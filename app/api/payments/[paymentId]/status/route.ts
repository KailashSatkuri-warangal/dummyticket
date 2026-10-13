import { NextResponse } from 'next/server';
import {
  getBookingByIdOrReference,
  getPlatformStore,
} from '@/lib/booking/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await context.params;
  const store = getPlatformStore();

  const payment =
    store.payments.get(paymentId) ??
    Array.from(store.payments.values()).find(
      (p) =>
        p.razorpayPaymentId === paymentId ||
        p.razorpayOrderId === paymentId ||
        p.bookingReference === paymentId
    );

  if (payment) {
    const booking = getBookingByIdOrReference(payment.bookingId);
    return NextResponse.json({
      paymentId: payment.id,
      bookingReference: payment.bookingReference,
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      signatureVerified: payment.razorpaySignatureVerified,
      paymentStatus: payment.status,
      bookingStatus: booking?.status ?? 'pending',
      ticketStatus: booking?.ticketStatus ?? 'not_generated',
      amountInr: payment.amountInr,
      currency: payment.currency,
      updatedAt: payment.updatedAt,
    });
  }

  const booking = getBookingByIdOrReference(paymentId);
  if (booking) {
    return NextResponse.json({
      paymentId: `lookup_${booking.bookingReference}`,
      bookingReference: booking.bookingReference,
      signatureVerified: booking.paymentStatus === 'captured',
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status,
      ticketStatus: booking.ticketStatus,
      amountInr: booking.totalAmount,
      currency: booking.currency,
      updatedAt: booking.updatedAt,
    });
  }

  return NextResponse.json(
    { error: 'Payment or booking record not found.' },
    { status: 404 }
  );
}
