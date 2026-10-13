import { NextResponse } from 'next/server';
import {
  canTransitionBookingStatus,
} from '@/lib/booking/state-machine';
import {
  getBookingByIdOrReference,
  getLatestPaymentForBooking,
  insertNotification,
  insertRefund,
  persistEmailLog,
  recordAuditLog,
  updateBookingRecord,
} from '@/lib/booking/store';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';
import { getSessionUser } from '@/lib/auth/session';

export async function POST(
  request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await context.params;
  const user = await getSessionUser();
  const booking = await getBookingByIdOrReference(bookingId);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }
  if (!user || (booking.userId && booking.userId !== user.id && user.role !== 'admin')) {
    return NextResponse.json(
      { error: 'You do not have permission to cancel this booking.' },
      { status: 403 }
    );
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

  const updated = await updateBookingRecord(booking.id, {
    status: targetStatus,
    paymentStatus:
      booking.paymentStatus === 'captured' ? 'refund_pending' : undefined,
    cancellationReason: reason,
  });

  if (booking.paymentStatus === 'captured') {
    const payment = await getLatestPaymentForBooking(booking.id);
    await insertRefund({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      paymentId: payment?.id ?? booking.id,
      amountInr: Math.max(
        500,
        booking.totalAmount - booking.flightOffer.fareRule.cancellationFeeInr
      ),
      reason,
    });
  }

  if (user.id) {
    await insertNotification({
      userId: user.id,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      eventType: 'cancellation_requested',
      title: `Cancellation ${
        targetStatus === 'cancelled' ? 'Completed' : 'Requested'
      } (${booking.bookingReference})`,
      message: `Reason: ${reason}`,
      actionUrl: `/booking/${booking.bookingReference}`,
    });
  }

  const emailLog = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName: 'booking_cancelled',
    variables: {
      passengerName: updated.passengers[0]?.firstName ?? 'Traveler',
      originIata: updated.originIata,
      destinationIata: updated.destinationIata,
      departureDate: updated.departureDate,
      totalAmountInr: updated.totalAmount,
      paymentStatus: updated.paymentStatus,
    },
  });
  await persistEmailLog(emailLog);

  await recordAuditLog({
    actorId: user.id,
    actorEmail: user.email,
    action: 'BOOKING_CANCELLATION_WORKFLOW',
    resourceType: 'booking',
    resourceId: updated.bookingReference,
    beforeState: { status: booking.status },
    afterState: { status: updated.status, reason },
  });

  return NextResponse.json({
    booking: updated,
    message:
      targetStatus === 'cancel_requested'
        ? 'Cancellation request submitted and refund calculation initiated.'
        : 'Booking cancelled.',
  });
}
