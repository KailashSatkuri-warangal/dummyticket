import { NextResponse } from 'next/server';
import {
  getCurrentSessionUser,
  isAuthorizedAdminRole,
} from '@/lib/security/auth';
import {
  getBookingByIdOrReference,
  getRefundById,
  persistEmailLog,
  recordAuditLog,
  updateBookingRecord,
  updateRefundStatus,
} from '@/lib/booking/store';
import { setAdminOfferAdjustment } from '@/lib/pricing/engine';
import { validateTicketFulfillment } from '@/lib/booking/state-machine';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();
  if (!user || !isAuthorizedAdminRole(user.role)) {
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

  if (body.action === 'SET_FARE_ADJUSTMENT' && body.flightOfferId !== undefined) {
    const delta = Number(body.deltaInr ?? 0);
    setAdminOfferAdjustment(body.flightOfferId, delta);
    const audit = await recordAuditLog({
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
    const booking = await getBookingByIdOrReference(body.bookingReference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    // Enforce requirement: Never allow an admin to manually label a booking as ticketed
    // without corresponding provider confirmation or live mode
    const providerBookingRef = body.providerBookingRef ?? booking.providerBookingRef;
    const airlinePnr = body.airlinePnr ?? booking.airlinePnr;
    const check = validateTicketFulfillment({
      fulfillmentMode: booking.fulfillmentMode,
      targetBookingStatus: 'ticketed',
      targetTicketStatus: 'issued',
      providerBookingRef,
      airlinePnr,
    });

    if (!check.valid) {
      return NextResponse.json({ error: check.reason }, { status: 400 });
    }

    const updated = await updateBookingRecord(booking.id, {
      status: 'ticketed',
      ticketStatus: 'issued',
      providerBookingRef,
      airlinePnr,
    });

    await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_CONFIRMED_LIVE_TICKET_ISSUANCE',
      resourceType: 'booking',
      resourceId: updated.bookingReference,
      afterState: {
        status: updated.status,
        airlinePnr: updated.airlinePnr,
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  }

  if (body.action === 'PROCESS_REFUND' && body.refundId) {
    const refund = await getRefundById(body.refundId);
    if (!refund) {
      return NextResponse.json(
        { error: 'Refund request not found.' },
        { status: 404 }
      );
    }

    await updateRefundStatus(refund.id, 'processed');
    if (refund.bookingId) {
      const booking = await getBookingByIdOrReference(refund.bookingId);
      if (booking) {
        await updateBookingRecord(booking.id, {
          paymentStatus: 'refunded',
          status: 'cancelled',
        });
      }
    }

    const audit = await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_PROCESSED_REFUND',
      resourceType: 'refund',
      resourceId: refund.id,
      afterState: { status: 'processed', amountInr: refund.amountInr },
    });

    return NextResponse.json({
      success: true,
      refund: { ...refund, status: 'processed' },
      audit,
    });
  }

  if (body.action === 'RESEND_BOOKING_EMAIL' && body.bookingReference) {
    const booking = await getBookingByIdOrReference(body.bookingReference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const emailLog = await sendTransactionalEmailWithRetry({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      recipientEmail: booking.contactEmail,
      templateName: 'booking_confirmation',
      variables: {
        passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
        originIata: booking.originIata,
        destinationIata: booking.destinationIata,
        departureDate: booking.departureDate,
        totalAmountInr: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
    const persisted = await persistEmailLog(emailLog);

    const audit = await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: 'ADMIN_RESENT_TRANSACTIONAL_EMAIL',
      resourceType: 'email_log',
      resourceId: persisted.id,
      afterState: {
        recipient: booking.contactEmail,
        status: persisted.status,
      },
    });

    return NextResponse.json({ success: true, emailLog: persisted, audit });
  }

  return NextResponse.json({ error: 'Unsupported admin action.' }, { status: 400 });
}
