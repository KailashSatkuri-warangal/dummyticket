import { NextResponse } from 'next/server';
import {
  getBookingByIdOrReference,
  insertPaymentOrder,
  updateBookingRecord,
} from '@/lib/booking/store';
import {
  computeRazorpayPaymentSignature,
  createRazorpayServerOrder,
} from '@/lib/razorpay/service';
import { checkRateLimit } from '@/lib/security/auth';

export async function POST(request: Request) {
  const rate = checkRateLimit('api_payments_create_order', 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many payment requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { bookingId?: string };
    if (!body.bookingId) {
      return NextResponse.json(
        { error: 'bookingId is required to create a payment order.' },
        { status: 400 }
      );
    }

    const booking = await getBookingByIdOrReference(body.bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking record not found.' },
        { status: 404 }
      );
    }

    if (booking.paymentStatus === 'captured') {
      return NextResponse.json(
        { error: 'This booking has already been paid and verified.' },
        { status: 409 }
      );
    }

    // Always calculate payment amount from trusted server booking record, never from client
    const order = await createRazorpayServerOrder({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      amountInr: booking.totalAmount,
      currency: booking.currency,
    });

    const payment = await insertPaymentOrder({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      razorpayOrderId: order.orderId,
      amountSubunits: order.amountSubunits,
      currency: order.currency,
      isLiveMode: order.isLiveMode,
    });

    if (booking.paymentStatus !== 'pending') {
      await updateBookingRecord(booking.id, { paymentStatus: 'pending' });
    }

    // In sandbox/test mode, provide a deterministic test payment ID and server-signed test signature
    // so developers and QA can execute full cryptographic verification end-to-end.
    const testPaymentId = `pay_test_${Date.now().toString(36)}`;
    const testSignature = order.sandboxMode
      ? computeRazorpayPaymentSignature(order.orderId, testPaymentId)
      : undefined;

    return NextResponse.json({
      paymentRecordId: payment.id,
      bookingReference: booking.bookingReference,
      orderId: order.orderId,
      amountSubunits: order.amountSubunits,
      amountInr: booking.totalAmount,
      currency: order.currency,
      keyId: order.keyId,
      fulfillmentMode: booking.fulfillmentMode,
      sandboxMode: order.sandboxMode,
      sandboxTestCredentials: order.sandboxMode
        ? {
            razorpay_order_id: order.orderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: testSignature,
          }
        : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to create Razorpay payment order.',
      },
      { status: 500 }
    );
  }
}
