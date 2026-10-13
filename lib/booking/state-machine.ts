import type {
  BookingStatus,
  PaymentStatus,
  TicketDocumentStatus,
  FulfillmentMode,
} from '@/types';

const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['awaiting_payment', 'cancelled', 'expired', 'failed'],
  awaiting_payment: [
    'paid_pending_confirmation',
    'confirmed',
    'cancelled',
    'expired',
    'failed',
  ],
  paid_pending_confirmation: ['confirmed', 'ticketed', 'cancel_requested', 'failed'],
  confirmed: ['ticketed', 'cancel_requested', 'cancelled'],
  ticketed: ['cancel_requested', 'cancelled'],
  cancel_requested: ['cancelled', 'confirmed', 'ticketed'],
  cancelled: [],
  expired: [],
  failed: ['awaiting_payment', 'cancelled'],
};

const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  created: ['pending', 'authorized', 'captured', 'failed'],
  pending: ['authorized', 'captured', 'failed'],
  authorized: ['captured', 'failed', 'refund_pending'],
  captured: ['refund_pending', 'partially_refunded', 'refunded'],
  failed: ['pending', 'authorized', 'captured'],
  refund_pending: ['partially_refunded', 'refunded', 'captured'],
  partially_refunded: ['refund_pending', 'refunded'],
  refunded: [],
};

export function canTransitionBookingStatus(
  current: BookingStatus,
  next: BookingStatus
): boolean {
  if (current === next) return true;
  return VALID_BOOKING_TRANSITIONS[current]?.includes(next) ?? false;
}

export function canTransitionPaymentStatus(
  current: PaymentStatus,
  next: PaymentStatus
): boolean {
  if (current === next) return true;
  return VALID_PAYMENT_TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Enforces strict separation between sample itinerary documents and live airline tickets.
 * Never allows a sample booking or unconfirmed provider booking to be marked 'ticketed' or 'issued'.
 */
export function validateTicketFulfillment(params: {
  fulfillmentMode: FulfillmentMode;
  targetBookingStatus: BookingStatus;
  targetTicketStatus: TicketDocumentStatus;
  providerBookingRef?: string;
  airlinePnr?: string;
}): { valid: boolean; reason?: string } {
  if (params.fulfillmentMode === 'sample_demo') {
    if (params.targetBookingStatus === 'ticketed') {
      return {
        valid: false,
        reason:
          'Sample demo bookings cannot be marked as airline-ticketed. Use "confirmed" with ticketStatus "sample_generated".',
      };
    }
    if (params.targetTicketStatus === 'issued') {
      return {
        valid: false,
        reason:
          'Sample itinerary documents must use status "sample_generated", never "issued".',
      };
    }
  }

  if (params.fulfillmentMode === 'live_provider') {
    if (
      (params.targetBookingStatus === 'ticketed' ||
        params.targetTicketStatus === 'issued') &&
      (!params.providerBookingRef || !params.airlinePnr)
    ) {
      return {
        valid: false,
        reason:
          'Live bookings require both providerBookingRef and airlinePnr confirmation before marking as ticketed/issued.',
      };
    }
  }

  return { valid: true };
}

export function maskPassportNumber(passportNumber?: string): string | undefined {
  if (!passportNumber) return undefined;
  const cleaned = passportNumber.trim().toUpperCase();
  if (cleaned.length <= 4) return '****';
  return `${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
}
