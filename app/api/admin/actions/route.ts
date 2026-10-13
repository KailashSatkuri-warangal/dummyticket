import { NextResponse } from 'next/server';
import {
  getCurrentSessionUser,
  isAuthorizedAdminRole,
} from '@/lib/security/auth';
import {
  getBookingByIdOrReference,
  getPlatformStore,
  recordAuditLog,
} from '@/lib/booking/store';
import { setAdminOfferAdjustment } from '@/lib/pricing/engine';
import { validateTicketFulfillment } from '@/lib/booking/state-machine';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();
  if (!isAuthorizedAdminRole(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden: Administrator privileges required.' },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    action: string;
    flightOfferId?: string;
    deltaInr?: number;
    bookingReference?: string;
    providerBookingRef?: string;
    airlinePnr?: string;
    refundId?: string;
  };

  const store = getPlatformStore();

  if (body.action === 'SET_FARE_ADJUSTMENT' && body.flightOfferId !== undefined) {
    const delta = Number(body.deltaInr ?? 0);
    setAdminOfferAdjustment(body.flightOfferId, delta);
    const audit = recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_FARE_ADJUSTMENT_UPDATED',
      resourceType: 'flight_offer',
      resourceId: body.flightOfferId,
      afterState: { deltaInr: delta },
    });
    return NextResponse.json({
      success: true,
      message: `Fare adjustment of ₹${delta} applied to ${body.flightOfferId}.`,
      audit,
    });
  }

  if (body.action === 'MARK_BOOKING_TICKETED' && body.bookingReference) {
    const booking = getBookingByIdOrReference(body.bookingReference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    // Enforce requirement: Never allow an admin to manually label a booking as ticketed
    // without corresponding provider confirmation or live mode
    const check = validateTicketFulfillment({
      fulfillmentMode: booking.fulfillmentMode,
      targetBookingStatus: 'ticketed',
      targetTicketStatus: 'issued',
      providerBookingRef: body.providerBookingRef ?? booking.providerBookingRef,
      airlinePnr: body.airlinePnr ?? booking.airlinePnr,
    });

    if (!check.valid) {
      return NextResponse.json({ error: check.reason }, { status: 400 });
    }

    booking.status = 'ticketed';
    booking.ticketStatus = 'issued';
    booking.providerBookingRef = body.providerBookingRef;
    booking.airlinePnr = body.airlinePnr;
    booking.updatedAt = new Date().toISOString();

    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_CONFIRMED_LIVE_TICKET_ISSUANCE',
      resourceType: 'booking',
      resourceId: booking.bookingReference,
      afterState: {
        status: booking.status,
        airlinePnr: booking.airlinePnr,
      },
    });

    return NextResponse.json({ success: true, booking });
  }

  if (body.action === 'PROCESS_REFUND' && body.refundId) {
    const refund = store.refunds.find((r) => r.id === body.refundId);
    if (!refund) {
      return NextResponse.json({ error: 'Refund request not found.' }, { status: 404 });
    }
    refund.status = 'processed';
    const booking = getBookingByIdOrReference(refund.bookingReference);
    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      booking.updatedAt = new Date().toISOString();
    }

    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_PROCESSED_REFUND',
      resourceType: 'refund',
      resourceId: refund.id,
      afterState: { status: 'processed', amountInr: refund.amountInr },
    });

    return NextResponse.json({ success: true, refund });
  }

  if (body.action === 'RESEND_BOOKING_EMAIL' && body.bookingReference) {
    const booking = getBookingByIdOrReference(body.bookingReference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const emailLog = await sendTransactionalEmailWithRetry({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      recipientEmail: booking.contactEmail,
      templateName:
        booking.fulfillmentMode === 'sample_demo'
          ? 'sample_itinerary_generated'
          : 'real_booking_confirmed',
      variables: {
        passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
        originIata: booking.originIata,
        destinationIata: booking.destinationIata,
        departureDate: booking.departureDate,
        totalAmountInr: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
    store.emailLogs.unshift(emailLog);

    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_RESENT_TRANSACTIONAL_EMAIL',
      resourceType: 'email_log',
      resourceId: emailLog.id,
      afterState: { recipient: booking.contactEmail, status: emailLog.status },
    });

    return NextResponse.json({ success: true, emailLog });
  }

  return NextResponse.json({ error: 'Unsupported admin action.' }, { status: 400 });
}
