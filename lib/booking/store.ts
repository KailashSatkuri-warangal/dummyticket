import type {
  AuditLogRecord,
  BookingRecord,
  BookingStatus,
  EmailLogRecord,
  FareSnapshot,
  NotificationItem,
  PaymentReceipt,
  PaymentRecord,
  PaymentStatus,
  TicketDocument,
} from '@/types';
import {
  getDeterministicFlightOffers,
  getFlightOfferById,
} from '@/lib/flights/dataset';
import {
  canTransitionBookingStatus,
  canTransitionPaymentStatus,
  maskPassportNumber,
  validateTicketFulfillment,
} from '@/lib/booking/state-machine';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';

interface PlatformStoreState {
  fareSnapshots: Map<string, FareSnapshot>;
  bookings: Map<string, BookingRecord>;
  payments: Map<string, PaymentRecord>;
  receipts: Map<string, PaymentReceipt>;
  processedWebhookEvents: Set<string>;
  idempotencyRecords: Map<string, { bookingId: string; bookingReference: string }>;
  tickets: Map<string, TicketDocument>;
  notifications: NotificationItem[];
  emailLogs: EmailLogRecord[];
  auditLogs: AuditLogRecord[];
  refunds: Array<{
    id: string;
    bookingReference: string;
    paymentId: string;
    amountInr: number;
    reason: string;
    status: 'requested' | 'approved' | 'processed' | 'rejected';
    createdAt: string;
  }>;
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role:
      | 'customer'
      | 'admin'
      | 'support_agent'
      | 'finance_manager'
      | 'content_editor';
    isSuspended: boolean;
    createdAt: string;
  }>;
}

const globalForStore = globalThis as unknown as {
  __dummyticketStore?: PlatformStoreState;
};

function createInitialSeededStore(): PlatformStoreState {
  return {
    fareSnapshots: new Map<string, FareSnapshot>(),
    bookings: new Map<string, BookingRecord>(),
    payments: new Map<string, PaymentRecord>(),
    receipts: new Map<string, PaymentReceipt>(),
    processedWebhookEvents: new Set<string>(),
    idempotencyRecords: new Map(),
    tickets: new Map<string, TicketDocument>(),
    notifications: [],
    emailLogs: [],
    auditLogs: [],
    refunds: [],
    users: [],
  };
}

export function getPlatformStore(): PlatformStoreState {
  if (!globalForStore.__dummyticketStore) {
    globalForStore.__dummyticketStore = createInitialSeededStore();
  }
  return globalForStore.__dummyticketStore;
}

export function saveFareSnapshot(snapshot: FareSnapshot): FareSnapshot {
  const store = getPlatformStore();
  store.fareSnapshots.set(snapshot.id, snapshot);
  return snapshot;
}

export function getFareSnapshotById(
  snapshotId: string
): FareSnapshot | undefined {
  const store = getPlatformStore();
  return store.fareSnapshots.get(snapshotId);
}

export function listUniqueBookings(): BookingRecord[] {
  const store = getPlatformStore();
  const unique = new Map<string, BookingRecord>();
  for (const b of store.bookings.values()) {
    unique.set(b.id, b);
  }
  return Array.from(unique.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getBookingByIdOrReference(
  idOrRef: string
): BookingRecord | undefined {
  const store = getPlatformStore();
  const clean = idOrRef.trim();
  const booking =
    store.bookings.get(clean) ??
    store.bookings.get(clean.toUpperCase()) ??
    store.bookings.get(`DT-DEMO-${clean.toUpperCase().replace(/^AV-/, '')}`);
  if (booking) {
    booking.ticket = booking.ticket ?? store.tickets.get(booking.bookingReference);
    booking.receipt = booking.receipt ?? store.receipts.get(booking.bookingReference);
  }
  return booking;
}

export const getBookingByReference = getBookingByIdOrReference;

export function getReceiptByBookingReference(
  ref: string
): PaymentReceipt | undefined {
  const store = getPlatformStore();
  return store.receipts.get(ref.trim().toUpperCase());
}

export async function createPendingBooking(params: {
  flightOfferId: string;
  fareSnapshot: FareSnapshot;
  departDate: string;
  returnDate?: string;
  contactEmail: string;
  contactPhone: string;
  passengers: Array<{
    passengerType: 'adult' | 'child' | 'infant';
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    passportNumber?: string;
    passportExpiry?: string;
    nationality?: string;
  }>;
  idempotencyKey: string;
  fareChangeAccepted?: boolean;
}): Promise<{ booking: BookingRecord; deduplicated: boolean }> {
  const store = getPlatformStore();

  const existingIdemp = store.idempotencyRecords.get(params.idempotencyKey);
  if (existingIdemp) {
    const existingBooking = getBookingByIdOrReference(existingIdemp.bookingId);
    if (existingBooking) {
      return { booking: existingBooking, deduplicated: true };
    }
  }

  const offer =
    getFlightOfferById(
      params.flightOfferId,
      params.departDate,
      params.fareSnapshot.cabin
    ) ??
    getDeterministicFlightOffers({
      from: 'HYD',
      to: 'DEL',
      departDate: params.departDate,
    })[0];

  const randomCode = Math.floor(100 + Math.random() * 900);
  const prefix = offer.inventoryMode === 'sample_demo' ? 'DT-DEMO' : 'DT-LIVE';
  const bookingReference = `${prefix}-${offer.origin.iataCode}${randomCode}${offer.destination.iataCode}`;
  const bookingId = `bkg-${Date.now().toString(36)}`;
  const nowIso = new Date().toISOString();
  const expiresIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const booking: BookingRecord = {
    id: bookingId,
    bookingReference,
    userId: 'usr-customer-1',
    flightOfferId: offer.id,
    flightOffer: offer,
    fareSnapshotId: params.fareSnapshot.id,
    fareSnapshot: params.fareSnapshot,
    originIata: offer.origin.iataCode,
    destinationIata: offer.destination.iataCode,
    departureDate: params.departDate,
    returnDate: params.returnDate,
    adults: params.fareSnapshot.adults,
    children: params.fareSnapshot.children,
    infants: params.fareSnapshot.infants,
    cabin: params.fareSnapshot.cabin,
    currency: 'INR',
    totalAmount: params.fareSnapshot.grandTotal,
    status: 'awaiting_payment',
    paymentStatus: 'created',
    ticketStatus: 'not_generated',
    fulfillmentMode: offer.inventoryMode,
    contactEmail: params.contactEmail,
    contactPhone: params.contactPhone,
    passengers: params.passengers.map((p, idx) => ({
      id: `pax-${bookingId}-${idx + 1}`,
      bookingId,
      passengerType: p.passengerType,
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      passportNumberMasked: maskPassportNumber(p.passportNumber),
      passportExpiry: p.passportExpiry,
      nationality: p.nationality,
      sampleSeat: `${12 + idx}A (SAMPLE)`,
    })),
    termsAcceptedAt: nowIso,
    fareChangeAcceptedAt: params.fareChangeAccepted ? nowIso : undefined,
    expiresAt: expiresIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  store.fareSnapshots.set(params.fareSnapshot.id, params.fareSnapshot);
  store.bookings.set(booking.id, booking);
  store.bookings.set(booking.bookingReference, booking);
  store.idempotencyRecords.set(params.idempotencyKey, {
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
  });

  store.notifications.unshift({
    id: `notif-${Date.now().toString(36)}`,
    userId: 'usr-customer-1',
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    eventType: 'booking_created',
    title: `Booking Created (${booking.bookingReference})`,
    message: `Itinerary ${booking.originIata} → ${booking.destinationIata} is awaiting payment confirmation.`,
    actionUrl: `/checkout/${booking.bookingReference}`,
    isRead: false,
    createdAt: nowIso,
  });

  const emailLog = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName: 'booking_initiated',
    variables: {
      passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
      originIata: booking.originIata,
      destinationIata: booking.destinationIata,
      departureDate: booking.departureDate,
      totalAmountInr: booking.totalAmount,
      paymentStatus: 'Awaiting Payment',
    },
  });
  store.emailLogs.unshift(emailLog);

  return { booking, deduplicated: false };
}

export async function fulfillVerifiedPayment(params: {
  bookingIdOrRef: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentMethod?: string;
}): Promise<{
  booking: BookingRecord;
  payment: PaymentRecord;
  receipt: PaymentReceipt;
  ticket: TicketDocument;
}> {
  const store = getPlatformStore();
  const booking = getBookingByIdOrReference(params.bookingIdOrRef);
  if (!booking) {
    throw new Error('Booking not found for payment fulfillment.');
  }

  const targetBookingStatus: BookingStatus =
    booking.fulfillmentMode === 'sample_demo'
      ? 'confirmed'
      : 'paid_pending_confirmation';
  const targetPaymentStatus: PaymentStatus = 'captured';
  const targetTicketStatus =
    booking.fulfillmentMode === 'sample_demo'
      ? 'sample_generated'
      : 'not_generated';

  if (!canTransitionBookingStatus(booking.status, targetBookingStatus)) {
    throw new Error(
      `Invalid booking state transition from ${booking.status} to ${targetBookingStatus}`
    );
  }
  if (!canTransitionPaymentStatus(booking.paymentStatus, targetPaymentStatus)) {
    throw new Error(
      `Invalid payment state transition from ${booking.paymentStatus} to ${targetPaymentStatus}`
    );
  }

  const fulfillmentCheck = validateTicketFulfillment({
    fulfillmentMode: booking.fulfillmentMode,
    targetBookingStatus,
    targetTicketStatus,
    providerBookingRef: booking.providerBookingRef,
    airlinePnr: booking.airlinePnr,
  });

  if (!fulfillmentCheck.valid) {
    throw new Error(fulfillmentCheck.reason);
  }

  const nowIso = new Date().toISOString();
  booking.status = targetBookingStatus;
  booking.paymentStatus = targetPaymentStatus;
  booking.ticketStatus = targetTicketStatus;
  booking.updatedAt = nowIso;

  const payment: PaymentRecord = {
    id: `pay-${Date.now().toString(36)}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpaySignatureVerified: true,
    amountSubunits: booking.totalAmount * 100,
    amountInr: booking.totalAmount,
    currency: booking.currency,
    status: 'captured',
    paymentMethod: params.paymentMethod ?? 'Razorpay Verified Checkout',
    isLiveMode: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  store.payments.set(payment.id, payment);

  const receiptNumber = `DT-RCPT-${booking.bookingReference.replace(/^DT-DEMO-|^AV-/, '')}`;
  const receipt: PaymentReceipt = {
    id: `rcpt-${Date.now().toString(36)}`,
    receiptNumber,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    paymentId: payment.id,
    paymentReference: params.razorpayPaymentId,
    paymentStatus: 'captured',
    paymentDate: nowIso,
    amountPaidInr: booking.totalAmount,
    baseFareInr: booking.fareSnapshot.baseFareTotal,
    taxesInr: booking.fareSnapshot.taxesTotal,
    serviceFeeInr: booking.fareSnapshot.serviceFeeTotal,
    discountInr: booking.fareSnapshot.discountTotal,
    currency: booking.currency,
  };
  store.receipts.set(booking.bookingReference, receipt);

  const ticket: TicketDocument = {
    id: `tkt-${Date.now().toString(36)}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    documentReference: booking.bookingReference,
    status: targetTicketStatus,
    isSampleDocument: booking.fulfillmentMode === 'sample_demo',
    watermarkText:
      booking.fulfillmentMode === 'sample_demo'
        ? 'SAMPLE — NOT VALID FOR TRAVEL'
        : 'CONFIRMED RESERVATION RECEIPT',
    verificationToken: `vfy-${booking.bookingReference.toLowerCase()}`,
    generatedAt: nowIso,
  };
  store.tickets.set(booking.bookingReference, ticket);

  store.notifications.unshift({
    id: `notif-${Date.now().toString(36)}`,
    userId: booking.userId ?? 'usr-customer-1',
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    eventType: 'payment_confirmed',
    title: `Payment Verified & Boarding Pass Ready (${booking.bookingReference})`,
    message: `Payment ${params.razorpayPaymentId} verified. Download both your Sample Itinerary and Payment Receipt.`,
    actionUrl: `/sample-ticket/${booking.bookingReference}`,
    isRead: false,
    createdAt: nowIso,
  });

  // Dispatch all 3 separate emails required by Section 8:
  // 1. Booking Confirmation
  const confirmEmail = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName: 'booking_confirmation',
    variables: {
      passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
      originIata: booking.originIata,
      destinationIata: booking.destinationIata,
      departureDate: booking.departureDate,
      totalAmountInr: booking.totalAmount,
      paymentStatus: 'Captured & Verified',
      documentTypeLabel: 'SAMPLE — NOT VALID FOR TRAVEL',
    },
  });

  // 2. Separate Payment Receipt
  const receiptEmail = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    paymentReference: params.razorpayPaymentId,
    receiptNumber,
    recipientEmail: booking.contactEmail,
    templateName: 'payment_receipt',
    variables: {
      passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
      originIata: booking.originIata,
      destinationIata: booking.destinationIata,
      departureDate: booking.departureDate,
      totalAmountInr: booking.totalAmount,
      paymentStatus: 'Captured & Verified',
      documentTypeLabel: 'OFFICIAL PAYMENT RECEIPT (NOT AN AIRLINE TICKET)',
    },
  });

  // 3. Itinerary Document
  const itineraryEmail = await sendTransactionalEmailWithRetry({
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName: 'itinerary_document',
    variables: {
      passengerName: booking.passengers[0]?.firstName ?? 'Traveler',
      originIata: booking.originIata,
      destinationIata: booking.destinationIata,
      departureDate: booking.departureDate,
      totalAmountInr: booking.totalAmount,
      paymentStatus: 'Captured & Verified',
      documentTypeLabel: 'SAMPLE — NOT VALID FOR TRAVEL',
    },
  });

  store.emailLogs.unshift(itineraryEmail, receiptEmail, confirmEmail);

  recordAuditLog({
    actorEmail: 'system@dummyticket.example.com',
    action: 'PAYMENT_VERIFIED_TICKET_AND_RECEIPT_GENERATED',
    resourceType: 'booking',
    resourceId: booking.bookingReference,
    afterState: {
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      ticketStatus: booking.ticketStatus,
      receiptNumber,
      razorpayPaymentId: params.razorpayPaymentId,
    },
  });

  return { booking, payment, receipt, ticket };
}

export function recordAuditLog(params: {
  actorId?: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
}): AuditLogRecord {
  const store = getPlatformStore();
  const entry: AuditLogRecord = {
    id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    beforeState: params.beforeState,
    afterState: params.afterState,
    correlationId: `corr-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  store.auditLogs.unshift(entry);
  return entry;
}
