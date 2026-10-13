import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/service';
import {
  fulfillVerifiedPayment,
  getBookingByIdOrReference,
  getPlatformStore,
  markPaymentFailed,
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
      const booking = await getBookingByIdOrReference(bookingRef);
      if (booking && booking.paymentStatus !== 'captured') {
        try {
          await fulfillVerifiedPayment({
            bookingIdOrRef: booking.id,
            razorpayOrderId: paymentEntity.order_id,
            razorpayPaymentId: paymentEntity.id,
            paymentMethod: 'Razorpay Webhook Reconciled',
          });
        } catch (err) {
          // Webhooks arrive without a user session, so RLS may block the
          // write; the signed client-side verify flow remains the primary
          // fulfillment path. Acknowledge the event to stop retries.
          console.error(
            '[razorpay webhook] fulfillment deferred:',
            err instanceof Error ? err.message : err
          );
        }
      }
    } else if (payload.event === 'payment.failed' && bookingRef) {
      try {
        const booking = await getBookingByIdOrReference(bookingRef);
        if (booking && booking.paymentStatus !== 'captured') {
          await markPaymentFailed({
            bookingId: booking.id,
            razorpayOrderId: paymentEntity?.order_id,
            failureReason: 'Razorpay webhook reported payment.failure',
          });
        }
      } catch (err) {
        console.error(
          '[razorpay webhook] failure recording deferred:',
          err instanceof Error ? err.message : err
        );
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
