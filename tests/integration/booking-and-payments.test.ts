import { describe, it, expect } from 'vitest';
import {
  canTransitionBookingStatus,
  canTransitionPaymentStatus,
  validateTicketFulfillment,
  maskPassportNumber,
} from '@/lib/booking/state-machine';
import {
  createPendingBooking,
  fulfillVerifiedPayment,
  getPlatformStore,
} from '@/lib/booking/store';
import { AIRLINES, getDeterministicFlightOffers } from '@/lib/flights/dataset';
import { calculateCompleteFare } from '@/lib/pricing/engine';
import {
  computeRazorpayPaymentSignature,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from '@/lib/razorpay/service';
import { POST as webhookPost } from '@/app/api/webhooks/razorpay/route';
import {
  generateItineraryPdfBytes,
  generatePaymentReceiptPdfBytes,
} from '@/lib/pdf/generator';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';
import { isAuthorizedAdminRole } from '@/lib/security/auth';

describe('DummyTicket Booking State Transitions, Indian Airlines, Razorpay Security, Webhooks & PDF Integration Tests', () => {
  it('includes all 10 required Indian airlines in the carrier catalog', () => {
    const indianNames = AIRLINES.filter((a) => a.category === 'indian').map(
      (a) => a.name
    );
    expect(indianNames).toEqual(
      expect.arrayContaining([
        'IndiGo',
        'Air India',
        'Air India Express',
        'Akasa Air',
        'SpiceJet',
        'Alliance Air',
        'Fly91',
        'Star Air',
        'IndiaOne Air',
        'Zoom Air',
      ])
    );
    expect(indianNames.length).toBe(10);
  });

  it('enforces valid booking and payment state transitions', () => {
    expect(canTransitionBookingStatus('pending', 'awaiting_payment')).toBe(true);
    expect(canTransitionBookingStatus('cancelled', 'confirmed')).toBe(false);
    expect(canTransitionPaymentStatus('pending', 'captured')).toBe(true);
    expect(canTransitionPaymentStatus('refunded', 'captured')).toBe(false);
  });

  it('prevents unconfirmed bookings from being marked as airline-ticketed', () => {
    const unconfirmedLiveAttempt = validateTicketFulfillment({
      fulfillmentMode: 'live_provider',
      targetBookingStatus: 'ticketed',
      targetTicketStatus: 'issued',
    });
    expect(unconfirmedLiveAttempt.valid).toBe(false);

    const confirmedLiveAttempt = validateTicketFulfillment({
      fulfillmentMode: 'live_provider',
      targetBookingStatus: 'ticketed',
      targetTicketStatus: 'issued',
      providerBookingRef: 'GDS-99412',
      airlinePnr: 'K8M2PQ',
    });
    expect(confirmedLiveAttempt.valid).toBe(true);
  });

  it('masks passport numbers safely', () => {
    expect(maskPassportNumber('Z4988921')).toBe('****8921');
  });

  it('prevents duplicate booking creation when using the same idempotency key and uses the DT- prefix', async () => {
    const offer = getDeterministicFlightOffers({
      from: 'HYD',
      to: 'BOM',
      departDate: '2026-12-18',
    })[0];
    const snap = calculateCompleteFare({ offer, adults: 1 });

    const first = await createPendingBooking({
      flightOfferId: offer.id,
      fareSnapshot: snap,
      departDate: '2026-12-18',
      contactEmail: 'test.idemp@example.com',
      contactPhone: '+91 9848011111',
      passengers: [
        { passengerType: 'adult', firstName: 'Vikram', lastName: 'Rao' },
      ],
      idempotencyKey: 'idem-unique-key-991',
    });

    const second = await createPendingBooking({
      flightOfferId: offer.id,
      fareSnapshot: snap,
      departDate: '2026-12-18',
      contactEmail: 'test.idemp@example.com',
      contactPhone: '+91 9848011111',
      passengers: [
        { passengerType: 'adult', firstName: 'Vikram', lastName: 'Rao' },
      ],
      idempotencyKey: 'idem-unique-key-991',
    });

    expect(first.deduplicated).toBe(false);
    expect(first.booking.bookingReference.startsWith('DT-')).toBe(true);
    expect(first.booking.bookingReference.includes('DEMO')).toBe(false);
    expect(second.deduplicated).toBe(true);
    expect(second.booking.bookingReference).toBe(first.booking.bookingReference);
  });

  it('verifies valid Razorpay HMAC signatures and rejects tampered signatures', () => {
    const orderId = 'order_TestOrder901';
    const paymentId = 'pay_TestPayment901';
    const validSig = computeRazorpayPaymentSignature(orderId, paymentId);

    expect(
      verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature: validSig,
      })
    ).toBe(true);

    expect(
      verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature: '0000invalid_signature_hex0000',
      })
    ).toBe(false);
  });

  it('rejects invalid webhook signatures and processes valid webhooks idempotently', async () => {
    const rawBody = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_wh_101',
            order_id: 'order_wh_101',
            notes: { bookingReference: 'DT-HYD319DEL' },
          },
        },
      },
    });

    expect(
      verifyRazorpayWebhookSignature({
        rawBody,
        signatureHeader: 'bad_sig',
      })
    ).toBe(false);

    // Rejects invalid webhook request via route handler
    const badReq = new Request('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': 'invalid',
        'x-razorpay-event-id': 'evt_test_001',
      },
      body: rawBody,
    });
    const badRes = await webhookPost(badReq);
    expect(badRes.status).toBe(401);

    // Valid webhook signature computed with default dev webhook secret
    const crypto = await import('crypto');
    const validWhSig = crypto
      .createHmac('sha256', 'whsec_test_dev_webhook_secret')
      .update(rawBody)
      .digest('hex');

    const req1 = new Request('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validWhSig,
        'x-razorpay-event-id': 'evt_unique_idemp_777',
      },
      body: rawBody,
    });
    const res1 = await webhookPost(req1);
    const data1 = await res1.json();
    expect(res1.status).toBe(200);
    expect(data1.idempotentDuplicate).toBe(false);

    // Duplicate delivery of the exact same webhook event ID
    const req2 = new Request('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validWhSig,
        'x-razorpay-event-id': 'evt_unique_idemp_777',
      },
      body: rawBody,
    });
    const res2 = await webhookPost(req2);
    const data2 = await res2.json();
    expect(res2.status).toBe(200);
    expect(data2.idempotentDuplicate).toBe(true);
  });

  it('fulfills verified payment, creates separate receipt, sends 3 emails, and generates both Boarding Pass PDF and Receipt PDF', async () => {
    const offer = getDeterministicFlightOffers({
      from: 'HYD',
      to: 'SIN',
      departDate: '2026-12-20',
    })[0];
    const snap = calculateCompleteFare({ offer, adults: 1 });
    const { booking } = await createPendingBooking({
      flightOfferId: offer.id,
      fareSnapshot: snap,
      departDate: '2026-12-20',
      contactEmail: 'pdf.test@example.com',
      contactPhone: '+91 9848022222',
      passengers: [
        { passengerType: 'adult', firstName: 'Meera', lastName: 'Nair' },
      ],
      idempotencyKey: 'idem-pdf-test-1',
    });

    const fulfilled = await fulfillVerifiedPayment({
      bookingIdOrRef: booking.id,
      razorpayOrderId: 'order_pdf_1',
      razorpayPaymentId: 'pay_pdf_1',
    });

    expect(fulfilled.booking.status).toBe('ticketed');
    expect(fulfilled.booking.paymentStatus).toBe('captured');
    expect(fulfilled.booking.ticketStatus).toBe('issued');
    expect(fulfilled.booking.fulfillmentMode).toBe('live_provider');
    expect(fulfilled.booking.airlinePnr).toBeTruthy();
    expect(fulfilled.booking.providerBookingRef).toBeTruthy();
    expect(fulfilled.ticket.watermarkText).toBe('CONFIRMED ITINERARY');
    expect(fulfilled.ticket.isSampleDocument).toBe(false);
    expect(fulfilled.receipt.receiptNumber.startsWith('DT-RCPT-')).toBe(true);

    // Verify 4 lifecycle emails logged for the booking (1 booking_initiated + 3 fulfillment emails: booking_confirmation, payment_receipt, itinerary_document)
    const store = getPlatformStore();
    const sentEmails = store.emailLogs.filter(
      (e) => e.bookingId === fulfilled.booking.id
    );
    expect(sentEmails.length).toBe(4);
    expect(sentEmails.map((e) => e.templateName)).toEqual(
      expect.arrayContaining([
        'booking_initiated',
        'booking_confirmation',
        'payment_receipt',
        'itinerary_document',
      ])
    );

    const itineraryPdfBytes = await generateItineraryPdfBytes(
      fulfilled.booking
    );
    expect(itineraryPdfBytes.byteLength).toBeGreaterThan(1000);

    const receiptPdfBytes = await generatePaymentReceiptPdfBytes(
      fulfilled.booking
    );
    expect(receiptPdfBytes.byteLength).toBeGreaterThan(1000);
  });

  it('tracks email status accurately without falsely claiming delivered', async () => {
    const emailLog = await sendTransactionalEmailWithRetry({
      bookingReference: 'DT-HYD842MSY',
      recipientEmail: 'customer@example.com',
      templateName: 'itinerary_document',
      variables: {
        passengerName: 'Arjun',
        totalAmountInr: 72499,
      },
    });
    expect(['queued', 'sent']).toContain(emailLog.status);
    expect(emailLog.status).not.toBe('delivered');
  });

  it('enforces admin role authorization', () => {
    expect(isAuthorizedAdminRole('customer')).toBe(false);
    expect(isAuthorizedAdminRole('admin')).toBe(true);
  });
});
