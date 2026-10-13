import { NextResponse } from 'next/server';
import { findPaymentRecord } from '@/lib/booking/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await context.params;

  const found = await findPaymentRecord(paymentId);
  if (found) {
    return NextResponse.json({
      paymentId: found.payment.id,
      bookingReference: found.payment.bookingReference,
      razorpayOrderId: found.payment.razorpayOrderId,
      razorpayPaymentId: found.payment.razorpayPaymentId,
      signatureVerified: found.payment.razorpaySignatureVerified,
      paymentStatus: found.payment.status,
      bookingStatus: found.booking?.status ?? 'pending',
      ticketStatus: found.booking?.ticketStatus ?? 'not_generated',
      amountInr: found.payment.amountInr,
      currency: found.payment.currency,
      updatedAt: found.payment.updatedAt,
    });
  }

  return NextResponse.json(
    { error: 'Payment or booking record not found.' },
    { status: 404 }
  );
}
