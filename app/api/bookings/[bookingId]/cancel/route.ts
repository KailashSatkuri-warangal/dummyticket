import { NextResponse } from 'next/server';
import {
  getBookingByIdOrReference,
  getPlatformStore,
  recordAuditLog,
} from '@/lib/booking/store';
import { canTransitionBookingStatus } from '@/lib/booking/state-machine';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';

export async function POST(
  request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await context.params;
  const booking = getBookingByIdOrReference(bookingId);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const reason = body.reason?.trim() || 'Customer requested online cancellation';

  const targetStatus =
    booking.paymentStatus === 'captured' ? 'cancel_requested' : 'cancelled';

  if (!canTransitionBookingStatus(booking.status, targetStatus)) {
    return NextResponse.json(
      {
        error: `Booking in status "${booking.status}" cannot transition to "${targetStatus}".`,
      },
      { status: 400 }
    );
  }

  const previousStatus = booking.status;
  booking.status = targetStatus;
  booking.cancellationReason = reason;
  booking.updatedAt = new Date().toISOString();

  const store = getPlatformStore();
  if (booking.paymentStatus === 'captured') {
    booking.paymentStatus = 'refund_pending';
    store.refunds.unshift({
      id: `ref-${Date.now().toString(36)}`,
      bookingReference: booking.bookingReference,
      paymentId: `pay-${booking.bookingReference}`,
      amountInr: Math.max(
        500,
        booking.totalAmount - booking.flightOffer.fareRule.cancellationFeeInr
      ),
      reason,
      status: 'requested',
      createdAt: new Date().toISOString(),
    });
  }

  store.notifications.unshift({
    id: `notif-${Date.now().toString(36)}`,
    userId: booking.userId ?? 'usr-customer-1',
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    eventType: 'cancellation_requested',
    title: `Cancellation ${
      targetStatus === 'cancelled' ? 'Completed' : 'Requested'
    } (${booking.bookingReference})`,
    message: `Reason: ${reason}`,
    actionUrl: `/booking/${booking.bookingReference}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  const emailLog = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName: 'booking_cancelled',
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
    actorEmail: booking.contactEmail,
    action: 'BOOKING_CANCELLATION_WORKFLOW',
    resourceType: 'booking',
    resourceId: booking.bookingReference,
    beforeState: { status: previousStatus },
    afterState: { status: booking.status, reason },
  });

  return NextResponse.json({
    booking,
    message:
      targetStatus === 'cancel_requested'
        ? 'Cancellation request submitted and refund calculation initiated.'
        : 'Booking cancelled.',
  });
}
