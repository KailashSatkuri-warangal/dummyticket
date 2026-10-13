import { NextResponse } from 'next/server';
import { razorpayVerifySchema } from '@/lib/validation/schemas';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay/service';
import {
  fulfillVerifiedPayment,
  getBookingByIdOrReference,
  markPaymentFailed,
} from '@/lib/booking/store';

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = razorpayVerifySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payment verification payload.',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = parsed.data;

    const booking = await getBookingByIdOrReference(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking record not found.' },
        { status: 404 }
      );
    }

    const isSignatureValid = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isSignatureValid) {
      await markPaymentFailed({
        bookingId: booking.id,
        razorpayOrderId: razorpay_order_id,
        failureReason: 'Razorpay HMAC signature verification failed',
      });
      return NextResponse.json(
        {
          verified: false,
          error:
            'Razorpay cryptographic signature verification failed. Payment has been rejected.',
        },
        { status: 400 }
      );
    }

    const fulfilled = await fulfillVerifiedPayment({
      bookingIdOrRef: booking.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentMethod: 'Razorpay Checkout (Verified)',
    });

    return NextResponse.json({
      verified: true,
      bookingReference: fulfilled.booking.bookingReference,
      bookingStatus: fulfilled.booking.status,
      paymentStatus: fulfilled.booking.paymentStatus,
      ticketStatus: fulfilled.booking.ticketStatus,
      airlinePnr: fulfilled.ticket.airlinePnr,
      documentReference: fulfilled.ticket.documentReference,
    });
  } catch (err) {
    return NextResponse.json(
      {
        verified: false,
        error:
          err instanceof Error
            ? err.message
            : 'Server error while verifying payment.',
      },
      { status: 500 }
    );
  }
}
