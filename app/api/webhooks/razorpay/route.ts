import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/service';
import {
  fulfillVerifiedPayment,
  getBookingByIdOrReference,
  getPlatformStore,
} from '@/lib/booking/store';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get('x-razorpay-signature');
  const eventIdHeader =
    request.headers.get('x-razorpay-event-id') ?? `evt_${Date.now()}`;

  const isSignatureValid = verifyRazorpayWebhookSignature({
    rawBody,
    signatureHeader,
  });

  if (!isSignatureValid) {
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 401 }
    );
  }

  const store = getPlatformStore();

  // Idempotency check: prevent duplicate processing of the same webhook event ID
  if (store.processedWebhookEvents.has(eventIdHeader)) {
    return NextResponse.json({
      received: true,
      idempotentDuplicate: true,
      eventId: eventIdHeader,
    });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            status?: string;
            notes?: { bookingId?: string; bookingReference?: string };
          };
        };
      };
    };

    store.processedWebhookEvents.add(eventIdHeader);

    const paymentEntity = payload.payload?.payment?.entity;
    const bookingRef =
      paymentEntity?.notes?.bookingReference ?? paymentEntity?.notes?.bookingId;

    if (
      payload.event === 'payment.captured' &&
      bookingRef &&
      paymentEntity?.order_id &&
      paymentEntity?.id
    ) {
      const booking = getBookingByIdOrReference(bookingRef);
      if (booking && booking.paymentStatus !== 'captured') {
        await fulfillVerifiedPayment({
          bookingIdOrRef: booking.id,
          razorpayOrderId: paymentEntity.order_id,
          razorpayPaymentId: paymentEntity.id,
          paymentMethod: 'Razorpay Webhook Reconciled',
        });
      }
    } else if (payload.event === 'payment.failed' && bookingRef) {
      const booking = getBookingByIdOrReference(bookingRef);
      if (booking && booking.paymentStatus !== 'captured') {
        booking.paymentStatus = 'failed';
        booking.status = 'failed';
        booking.updatedAt = new Date().toISOString();
      }
    }

    return NextResponse.json({
      received: true,
      idempotentDuplicate: false,
      eventId: eventIdHeader,
      eventType: payload.event,
    });
  } catch {
    return NextResponse.json(
      { error: 'Malformed webhook JSON payload.' },
      { status: 400 }
    );
  }
}
