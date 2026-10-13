import type {
  AppRole,
  AuditLogRecord,
  BookingPassenger,
  BookingRecord,
  BookingStatus,
  EmailLogRecord,
  FareSnapshot,
  FlightOffer,
  NotificationItem,
  PaymentReceipt,
  PaymentRecord,
  PaymentStatus,
  TicketDocument,
  TicketDocumentStatus,
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
import { createSupabaseServerClient } from '@/lib/supabase/server';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Db = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PNR_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * In-process store used (a) as fallback when no Supabase client can be built
 * (unit tests, missing env) and (b) for ephemeral cross-request state such as
 * webhook event de-duplication.
 */
interface PlatformStoreState {
  fareSnapshots: Map<string, FareSnapshot>;
  bookings: Map<string, BookingRecord>;
  payments: Map<string, PaymentRecord>;
  receipts: Map<string, PaymentReceipt>;
  processedWebhookEvents: Set<string>;
  idempotencyRecords: Map<string, string>;
  tickets: Map<string, TicketDocument>;
  notifications: NotificationItem[];
  emailLogs: EmailLogRecord[];
  auditLogs: AuditLogRecord[];
  refunds: Array<{
    id: string;
    bookingId: string;
    bookingReference: string;
    paymentId: string;
    amountInr: number;
    reason: string;
    status: 'requested' | 'approved' | 'processed' | 'rejected';
    createdAt: string;
  }>;
}

const globalForStore = globalThis as unknown as {
  __dummyticketStore?: PlatformStoreState;
};

function createInitialStore(): PlatformStoreState {
  return {
    fareSnapshots: new Map<string, FareSnapshot>(),
    bookings: new Map<string, BookingRecord>(),
    payments: new Map<string, PaymentRecord>(),
    receipts: new Map<string, PaymentReceipt>(),
    processedWebhookEvents: new Set<string>(),
    idempotencyRecords: new Map<string, string>(),
    tickets: new Map<string, TicketDocument>(),
    notifications: [],
    emailLogs: [],
    auditLogs: [],
    refunds: [],
  };
}

export function getPlatformStore(): PlatformStoreState {
  if (!globalForStore.__dummyticketStore) {
    globalForStore.__dummyticketStore = createInitialStore();
  }
  return globalForStore.__dummyticketStore;
}

/** Safe Supabase client accessor — null when env is missing or no request scope. */
async function getDb(): Promise<Db | null> {
  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

function newId(): string {
  return crypto.randomUUID();
}

function randomToken(length: number, alphabet = PNR_ALPHABET): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function generateAirlinePnr(): string {
  return randomToken(6);
}

function generateProviderBookingRef(): string {
  return `DTL-${randomToken(8)}`;
}

function generateETicketNumber(): string {
  return `098-${Math.floor(1_000_000_000 + Math.random() * 9_000_000_000)}`;
}

function newBookingReference(originIata: string, destinationIata: string): string {
  const randomCode = Math.floor(100 + Math.random() * 900);
  return `DT-${originIata.toUpperCase()}${randomCode}${destinationIata.toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/* Row mappers                                                         */
/* ------------------------------------------------------------------ */

function mapSnapshotRow(row: any): FareSnapshot {
  return {
    id: row.id,
    flightOfferId: row.flight_offer_id,
    adults: row.adults,
    children: row.children,
    infants: row.infants,
    cabin: row.cabin,
    currency: row.currency,
    baseFareTotal: row.base_fare_total,
    taxesTotal: row.taxes_total,
    serviceFeeTotal: row.service_fee_total,
    discountTotal: row.discount_total,
    grandTotal: row.grand_total,
    couponCode: row.coupon_code ?? undefined,
    pricingRulesApplied: row.pricing_rules_applied ?? [],
    inventoryMode: row.inventory_mode,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function mapPassengerRow(row: any): BookingPassenger {
  return {
    id: row.id,
    bookingId: row.booking_id,
    passengerType: row.passenger_type,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth ?? undefined,
    gender: row.gender ?? undefined,
    passportNumberMasked: row.passport_number_masked ?? undefined,
    passportExpiry: row.passport_expiry ?? undefined,
    nationality: row.nationality ?? undefined,
    ticketNumber: row.ticket_number ?? undefined,
  };
}

function mapTicketRow(row: any): TicketDocument {
  return {
    id: row.id,
    bookingId: row.booking_id,
    bookingReference: '',
    documentReference: row.document_reference,
    status: row.status,
    isSampleDocument: row.is_sample_document,
    watermarkText: row.watermark_text,
    airlinePnr: row.airline_pnr ?? undefined,
    eTicketNumbers: row.e_ticket_numbers ?? undefined,
    verificationToken: row.verification_token,
    generatedAt: row.generated_at,
  };
}

function mapReceiptRow(row: any): PaymentReceipt {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    bookingId: row.booking_id,
    bookingReference: '',
    paymentId: row.payment_id,
    paymentReference: row.razorpay_payment_id,
    paymentStatus: 'captured',
    paymentDate: row.issued_at,
    amountPaidInr: row.amount_paid,
    baseFareInr: row.base_fare,
    taxesInr: row.taxes,
    serviceFeeInr: row.service_fee,
    discountInr: row.discount,
    currency: row.currency,
  };
}

function mapPaymentRow(row: any): PaymentRecord {
  return {
    id: row.id,
    bookingId: row.booking_id,
    bookingReference: row.bookings?.booking_reference ?? '',
    razorpayOrderId: row.razorpay_order_id ?? '',
    razorpayPaymentId: row.razorpay_payment_id ?? undefined,
    razorpaySignatureVerified: row.razorpay_signature_verified,
    amountSubunits: row.amount_subunits,
    amountInr: Math.round(row.amount_subunits / 100),
    currency: row.currency,
    status: row.status,
    paymentMethod: row.payment_method ?? undefined,
    failureReason: row.failure_reason ?? undefined,
    isLiveMode: row.is_live_mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapNotificationRow(row: any): NotificationItem {
  return {
    id: row.id,
    userId: row.user_id,
    bookingId: row.booking_id ?? undefined,
    bookingReference: row.bookings?.booking_reference ?? undefined,
    eventType: row.event_type,
    title: row.title,
    message: row.message,
    actionUrl: row.action_url ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

function mapAuditRow(row: any): AuditLogRecord {
  return {
    id: row.id,
    actorId: row.actor_id ?? undefined,
    actorEmail: row.actor_email ?? 'system',
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    beforeState: row.before_state ?? undefined,
    afterState: row.after_state ?? undefined,
    correlationId: row.correlation_id ?? '',
    createdAt: row.created_at,
  };
}

function mapEmailRow(row: any): EmailLogRecord {
  return {
    id: row.id,
    bookingId: row.booking_id ?? undefined,
    bookingReference: undefined,
    recipientEmail: row.recipient_email,
    templateName: row.template_name,
    templateVersion: '',
    subject: row.subject,
    providerMessageId: row.provider_message_id ?? undefined,
    status: row.status,
    retryCount: row.retry_count,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at,
  };
}

function mapRefundRow(row: any) {
  return {
    id: row.id,
    bookingId: row.booking_id as string,
    bookingReference: row.bookings?.booking_reference ?? '',
    paymentId: row.payment_id as string,
    amountInr: row.amount_inr as number,
    reason: row.reason as string,
    status: row.status as 'requested' | 'approved' | 'processed' | 'rejected',
    createdAt: row.created_at as string,
  };
}

function reconstructOffer(
  flightOfferId: string,
  departDate: string,
  cabin: string,
  originIata: string,
  destinationIata: string
): FlightOffer {
  return (
    getFlightOfferById(
      flightOfferId,
      departDate,
      cabin as FlightOffer['cabin']
    ) ??
    getDeterministicFlightOffers({
      from: originIata,
      to: destinationIata,
      departDate,
      cabin: cabin as FlightOffer['cabin'],
    })[0]
  );
}

async function loadBookingBundle(db: Db, row: any): Promise<BookingRecord> {
  const [passengersRes, ticketRes, receiptRes, snapshotRes] = await Promise.all([
    db
      .from('booking_passengers')
      .select('*')
      .eq('booking_id', row.id)
      .order('created_at', { ascending: true }),
    db.from('tickets').select('*').eq('booking_id', row.id).limit(1).maybeSingle(),
    db.from('receipts').select('*').eq('booking_id', row.id).limit(1).maybeSingle(),
    db.from('fare_snapshots').select('*').eq('id', row.fare_snapshot_id).maybeSingle(),
  ]);

  const offer = reconstructOffer(
    row.flight_offer_id,
    row.departure_date,
    row.cabin,
    row.origin_iata,
    row.destination_iata
  );

  const ticket = ticketRes.data ? mapTicketRow(ticketRes.data) : undefined;
  if (ticket) ticket.bookingReference = row.booking_reference;
  const receipt = receiptRes.data ? mapReceiptRow(receiptRes.data) : undefined;
  if (receipt) receipt.bookingReference = row.booking_reference;

  return {
    id: row.id,
    bookingReference: row.booking_reference,
    userId: row.user_id,
    flightOfferId: row.flight_offer_id,
    flightOffer: offer,
    fareSnapshotId: row.fare_snapshot_id,
    fareSnapshot: snapshotRes.data
      ? mapSnapshotRow(snapshotRes.data)
      : {
          id: row.fare_snapshot_id,
          flightOfferId: row.flight_offer_id,
          adults: row.adults,
          children: row.children,
          infants: row.infants,
          cabin: row.cabin,
          currency: row.currency,
          baseFareTotal: row.total_amount,
          taxesTotal: 0,
          serviceFeeTotal: 0,
          discountTotal: 0,
          grandTotal: row.total_amount,
          pricingRulesApplied: [],
          inventoryMode: row.fulfillment_mode,
          expiresAt: row.expires_at,
          createdAt: row.created_at,
        },
    originIata: row.origin_iata,
    destinationIata: row.destination_iata,
    departureDate: row.departure_date,
    returnDate: row.return_date ?? undefined,
    adults: row.adults,
    children: row.children,
    infants: row.infants,
    cabin: row.cabin,
    currency: row.currency,
    totalAmount: row.total_amount,
    status: row.status,
    paymentStatus: row.payment_status,
    ticketStatus: row.ticket_status,
    fulfillmentMode: row.fulfillment_mode,
    providerBookingRef: row.provider_booking_ref ?? undefined,
    airlinePnr: row.airline_pnr ?? undefined,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    passengers: (passengersRes.data ?? []).map(mapPassengerRow),
    termsAcceptedAt: row.terms_accepted_at,
    fareChangeAcceptedAt: row.fare_change_accepted_at ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ticket,
    receipt,
  };
}

interface BookingPatch {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  ticketStatus?: TicketDocumentStatus;
  providerBookingRef?: string;
  airlinePnr?: string;
  cancellationReason?: string;
}

function bookingPatchToRow(patch: BookingPatch): Record<string, unknown> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.paymentStatus !== undefined) row.payment_status = patch.paymentStatus;
  if (patch.ticketStatus !== undefined) row.ticket_status = patch.ticketStatus;
  if (patch.providerBookingRef !== undefined)
    row.provider_booking_ref = patch.providerBookingRef;
  if (patch.airlinePnr !== undefined) row.airline_pnr = patch.airlinePnr;
  if (patch.cancellationReason !== undefined)
    row.cancellation_reason = patch.cancellationReason;
  return row;
}

/* ------------------------------------------------------------------ */
/* Fare snapshots (memory cache; persisted with the booking)           */
/* ------------------------------------------------------------------ */

export function saveFareSnapshot(snapshot: FareSnapshot): FareSnapshot {
  const store = getPlatformStore();
  store.fareSnapshots.set(snapshot.id, snapshot);
  return snapshot;
}

export async function getFareSnapshotById(
  snapshotId: string
): Promise<FareSnapshot | undefined> {
  const store = getPlatformStore();
  const cached = store.fareSnapshots.get(snapshotId);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return undefined;
  const { data } = await db
    .from('fare_snapshots')
    .select('*')
    .eq('id', snapshotId)
    .maybeSingle();
  return data ? mapSnapshotRow(data) : undefined;
}

/* ------------------------------------------------------------------ */
/* Booking reads                                                       */
/* ------------------------------------------------------------------ */

export async function listUserBookings(userId: string): Promise<BookingRecord[]> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    const unique = new Map<string, BookingRecord>();
    for (const b of store.bookings.values()) {
      if (b.userId === userId) unique.set(b.id, b);
    }
    return Array.from(unique.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const { data, error } = await db
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[store] listUserBookings failed:', error.message);
    return [];
  }
  return Promise.all((data ?? []).map((row: any) => loadBookingBundle(db, row)));
}

export async function listAllBookings(): Promise<BookingRecord[]> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    const unique = new Map<string, BookingRecord>();
    for (const b of store.bookings.values()) {
      unique.set(b.id, b);
    }
    return Array.from(unique.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const { data, error } = await db
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.error('[store] listAllBookings failed:', error.message);
    return [];
  }
  return Promise.all((data ?? []).map((row: any) => loadBookingBundle(db, row)));
}

export async function getBookingByIdOrReference(
  idOrRef: string
): Promise<BookingRecord | undefined> {
  const store = getPlatformStore();
  const clean = idOrRef.trim();
  const upper = clean.toUpperCase();

  const db = await getDb();
  if (!db) {
    const booking =
      store.bookings.get(clean) ??
      store.bookings.get(upper) ??
      Array.from(store.bookings.values()).find(
        (b) => b.bookingReference.toUpperCase() === upper
      );
    if (booking) {
      booking.ticket =
        booking.ticket ?? store.tickets.get(booking.bookingReference);
      booking.receipt =
        booking.receipt ?? store.receipts.get(booking.bookingReference);
    }
    return booking;
  }

  const query = db.from('bookings').select('*').limit(1);
  const { data, error } = await (UUID_RE.test(clean)
    ? query.eq('id', clean)
    : query.eq('booking_reference', upper)
  ).maybeSingle();

  if (error) {
    console.error('[store] getBookingByIdOrReference failed:', error.message);
    return undefined;
  }
  if (!data) return undefined;
  return loadBookingBundle(db, data);
}

export const getBookingByReference = getBookingByIdOrReference;

export async function getReceiptByBookingReference(
  ref: string
): Promise<PaymentReceipt | undefined> {
  const booking = await getBookingByReference(ref);
  return booking?.receipt;
}

export async function updateBookingRecord(
  bookingId: string,
  patch: BookingPatch
): Promise<BookingRecord> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    const booking = store.bookings.get(bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (patch.status !== undefined) booking.status = patch.status;
    if (patch.paymentStatus !== undefined) booking.paymentStatus = patch.paymentStatus;
    if (patch.ticketStatus !== undefined) booking.ticketStatus = patch.ticketStatus;
    if (patch.providerBookingRef !== undefined)
      booking.providerBookingRef = patch.providerBookingRef;
    if (patch.airlinePnr !== undefined) booking.airlinePnr = patch.airlinePnr;
    if (patch.cancellationReason !== undefined)
      booking.cancellationReason = patch.cancellationReason;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  const { error } = await db
    .from('bookings')
    .update(bookingPatchToRow(patch))
    .eq('id', bookingId);
  if (error) throw new Error(`Unable to update booking: ${error.message}`);

  const { data } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();
  if (!data) throw new Error('Booking not found after update.');
  return loadBookingBundle(db, data);
}

/* ------------------------------------------------------------------ */
/* Payments                                                            */
/* ------------------------------------------------------------------ */

export async function insertPaymentOrder(params: {
  bookingId: string;
  bookingReference: string;
  razorpayOrderId: string;
  amountSubunits: number;
  currency: string;
  isLiveMode: boolean;
}): Promise<PaymentRecord> {
  const nowIso = new Date().toISOString();
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    const payment: PaymentRecord = {
      id: `pay-${Date.now().toString(36)}`,
      bookingId: params.bookingId,
      bookingReference: params.bookingReference,
      razorpayOrderId: params.razorpayOrderId,
      razorpaySignatureVerified: false,
      amountSubunits: params.amountSubunits,
      amountInr: Math.round(params.amountSubunits / 100),
      currency: params.currency,
      status: 'pending',
      isLiveMode: params.isLiveMode,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    store.payments.set(payment.id, payment);
    return payment;
  }

  const id = newId();
  const { error } = await db.from('payments').insert({
    id,
    booking_id: params.bookingId,
    razorpay_order_id: params.razorpayOrderId,
    razorpay_signature_verified: false,
    amount_subunits: params.amountSubunits,
    currency: params.currency,
    status: 'pending',
    is_live_mode: params.isLiveMode,
  });
  if (error) throw new Error(`Unable to record payment order: ${error.message}`);

  return {
    id,
    bookingId: params.bookingId,
    bookingReference: params.bookingReference,
    razorpayOrderId: params.razorpayOrderId,
    razorpaySignatureVerified: false,
    amountSubunits: params.amountSubunits,
    amountInr: Math.round(params.amountSubunits / 100),
    currency: params.currency,
    status: 'pending',
    isLiveMode: params.isLiveMode,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function markPaymentFailed(params: {
  paymentId?: string;
  razorpayOrderId?: string;
  bookingId?: string;
  failureReason?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    for (const p of store.payments.values()) {
      if (
        (params.paymentId && p.id === params.paymentId) ||
        (params.razorpayOrderId && p.razorpayOrderId === params.razorpayOrderId)
      ) {
        p.status = 'failed';
        p.failureReason = params.failureReason;
        p.updatedAt = new Date().toISOString();
      }
    }
    if (params.bookingId) {
      const booking = store.bookings.get(params.bookingId);
      if (booking && booking.paymentStatus !== 'captured') {
        booking.paymentStatus = 'failed';
        booking.status = 'failed';
        booking.updatedAt = new Date().toISOString();
      }
    }
    return;
  }

  const nowIso = new Date().toISOString();
  if (params.paymentId || params.razorpayOrderId) {
    const q = db.from('payments').update({
      status: 'failed',
      failure_reason: params.failureReason ?? 'Payment failed at provider',
      updated_at: nowIso,
    });
    if (params.paymentId) q.eq('id', params.paymentId);
    else q.eq('razorpay_order_id', params.razorpayOrderId!);
    await q;
  }
  if (params.bookingId) {
    await db
      .from('bookings')
      .update({ status: 'failed', payment_status: 'failed', updated_at: nowIso })
      .eq('id', params.bookingId)
      .neq('payment_status', 'captured');
  }
}

export async function listAllPayments(): Promise<PaymentRecord[]> {
  const db = await getDb();
  if (!db) {
    return Array.from(getPlatformStore().payments.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const { data, error } = await db
    .from('payments')
    .select('*, bookings(booking_reference)')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.error('[store] listAllPayments failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapPaymentRow);
}

export async function findPaymentRecord(
  paymentIdOrRef: string
): Promise<{ payment: PaymentRecord; booking?: BookingRecord } | undefined> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    const payment =
      store.payments.get(paymentIdOrRef) ??
      Array.from(store.payments.values()).find(
        (p) =>
          p.razorpayPaymentId === paymentIdOrRef ||
          p.razorpayOrderId === paymentIdOrRef ||
          p.bookingReference === paymentIdOrRef
      );
    if (!payment) return undefined;
    const booking = store.bookings.get(payment.bookingId);
    return { payment, booking };
  }

  const isUuid = UUID_RE.test(paymentIdOrRef.trim());
  let query = db
    .from('payments')
    .select('*, bookings(booking_reference, status, ticket_status)')
    .limit(1);
  if (isUuid) query = query.eq('id', paymentIdOrRef.trim());
  else if (paymentIdOrRef.toUpperCase().startsWith('DT-'))
    query = query.eq('bookings.booking_reference', paymentIdOrRef.trim().toUpperCase());
  else query = query.or(`razorpay_payment_id.eq.${paymentIdOrRef},razorpay_order_id.eq.${paymentIdOrRef}`);

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    // Fall back to booking-reference lookup when the embed filter missed
    const booking = await getBookingByIdOrReference(paymentIdOrRef);
    if (!booking) return undefined;
    const { data: payRow } = await db
      .from('payments')
      .select('*, bookings(booking_reference, status, ticket_status)')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return payRow
      ? { payment: mapPaymentRow(payRow), booking }
      : undefined;
  }
  const payment = mapPaymentRow(data);
  const booking = await getBookingByIdOrReference(payment.bookingId);
  return { payment, booking };
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export async function insertNotification(params: {
  userId: string;
  bookingId?: string;
  bookingReference?: string;
  eventType: NotificationItem['eventType'];
  title: string;
  message: string;
  actionUrl?: string;
}): Promise<NotificationItem | undefined> {
  const nowIso = new Date().toISOString();
  const db = await getDb();
  if (!db) {
    const item: NotificationItem = {
      id: `notif-${Date.now().toString(36)}`,
      userId: params.userId,
      bookingId: params.bookingId,
      bookingReference: params.bookingReference,
      eventType: params.eventType,
      title: params.title,
      message: params.message,
      actionUrl: params.actionUrl,
      isRead: false,
      createdAt: nowIso,
    };
    getPlatformStore().notifications.unshift(item);
    return item;
  }

  const id = newId();
  const { data, error } = await db
    .from('notifications')
    .insert({
      id,
      user_id: params.userId,
      booking_id: params.bookingId ?? null,
      event_type: params.eventType,
      title: params.title,
      message: params.message,
      action_url: params.actionUrl ?? null,
    })
    .select('*, bookings(booking_reference)')
    .single();
  if (error) {
    console.error('[store] notification insert failed:', error.message);
    return undefined;
  }
  return mapNotificationRow(data);
}

export async function listUserNotifications(
  userId: string
): Promise<NotificationItem[]> {
  const db = await getDb();
  if (!db) {
    return getPlatformStore()
      .notifications.filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  const { data, error } = await db
    .from('notifications')
    .select('*, bookings(booking_reference)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('[store] listUserNotifications failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapNotificationRow);
}

export async function listAllNotifications(): Promise<NotificationItem[]> {
  const db = await getDb();
  if (!db) {
    return getPlatformStore().notifications;
  }
  const { data, error } = await db
    .from('notifications')
    .select('*, bookings(booking_reference)')
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) {
    console.error('[store] listAllNotifications failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapNotificationRow);
}

export async function markNotificationsRead(
  userId: string,
  params: { notificationId?: string; markAllRead?: boolean },
  includeAllUsers = false
): Promise<NotificationItem[]> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    for (const n of store.notifications) {
      const owned = includeAllUsers || n.userId === userId;
      if (!owned) continue;
      if (params.markAllRead || n.id === params.notificationId) n.isRead = true;
    }
    return includeAllUsers
      ? store.notifications
      : store.notifications.filter((n) => n.userId === userId);
  }

  let q = db.from('notifications').update({ is_read: true });
  if (!includeAllUsers) q = q.eq('user_id', userId);
  if (params.markAllRead) {
    await q.eq('is_read', false);
  } else if (params.notificationId) {
    await q.eq('id', params.notificationId);
  }

  return includeAllUsers
    ? listAllNotifications()
    : listUserNotifications(userId);
}

/* ------------------------------------------------------------------ */
/* Email logs                                                          */
/* ------------------------------------------------------------------ */

export async function persistEmailLog(
  log: EmailLogRecord
): Promise<EmailLogRecord> {
  const db = await getDb();
  if (!db) {
    getPlatformStore().emailLogs.unshift(log);
    return log;
  }
  const { data, error } = await db
    .from('email_logs')
    .insert({
      booking_id: log.bookingId ?? null,
      recipient_email: log.recipientEmail,
      template_name: log.templateName,
      subject: log.subject,
      provider_message_id: log.providerMessageId ?? null,
      status: log.status,
      retry_count: log.retryCount,
      error_message: log.errorMessage ?? null,
    })
    .select('id, created_at')
    .single();
  if (error) {
    console.error('[store] email log insert failed:', error.message);
    return log;
  }
  return { ...log, id: data.id, createdAt: data.created_at };
}

export async function listBookingEmailLogs(
  bookingIdOrRef: string
): Promise<EmailLogRecord[]> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    return store.emailLogs.filter(
      (e) => e.bookingId === bookingIdOrRef || e.bookingReference === bookingIdOrRef
    );
  }
  const booking = await getBookingByIdOrReference(bookingIdOrRef);
  if (!booking) return [];
  const { data, error } = await db
    .from('email_logs')
    .select('*')
    .eq('booking_id', booking.id)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapEmailRow);
}

export async function listAllEmailLogs(): Promise<EmailLogRecord[]> {
  const db = await getDb();
  if (!db) return getPlatformStore().emailLogs;
  const { data, error } = await db
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) {
    console.error('[store] listAllEmailLogs failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapEmailRow);
}

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export async function recordAuditLog(params: {
  actorId?: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
}): Promise<AuditLogRecord> {
  const entry: AuditLogRecord = {
    id: newId(),
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

  const db = await getDb();
  if (!db) {
    getPlatformStore().auditLogs.unshift(entry);
    return entry;
  }

  const { data, error } = await db
    .from('audit_logs')
    .insert({
      id: entry.id,
      actor_id: params.actorId ?? null,
      actor_email: params.actorEmail,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      before_state: params.beforeState ?? null,
      after_state: params.afterState ?? null,
      correlation_id: entry.correlationId,
    })
    .select('*')
    .single();
  if (error) {
    console.error('[store] audit log insert failed:', error.message);
    getPlatformStore().auditLogs.unshift(entry);
    return entry;
  }
  return mapAuditRow(data);
}

export async function listAuditLogs(limit = 300): Promise<AuditLogRecord[]> {
  const db = await getDb();
  if (!db) return getPlatformStore().auditLogs;
  const { data, error } = await db
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[store] listAuditLogs failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapAuditRow);
}

/* ------------------------------------------------------------------ */
/* Refunds                                                             */
/* ------------------------------------------------------------------ */

export async function insertRefund(params: {
  bookingId: string;
  bookingReference: string;
  paymentId: string;
  amountInr: number;
  reason: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    getPlatformStore().refunds.unshift({
      id: `ref-${Date.now().toString(36)}`,
      bookingId: params.bookingId,
      bookingReference: params.bookingReference,
      paymentId: params.paymentId,
      amountInr: params.amountInr,
      reason: params.reason,
      status: 'requested',
      createdAt: new Date().toISOString(),
    });
    return;
  }
  const { error } = await db.from('refunds').insert({
    booking_id: params.bookingId,
    payment_id: params.paymentId,
    amount_inr: params.amountInr,
    reason: params.reason,
    status: 'requested',
  });
  if (error) console.error('[store] refund insert failed:', error.message);
}

export async function listAllRefunds(): Promise<
  Array<ReturnType<typeof mapRefundRow>>
> {
  const db = await getDb();
  if (!db) return getPlatformStore().refunds;
  const { data, error } = await db
    .from('refunds')
    .select('*, bookings(booking_reference)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[store] listAllRefunds failed:', error.message);
    return [];
  }
  return (data ?? []).map(mapRefundRow);
}

export async function getRefundById(refundId: string) {
  const db = await getDb();
  if (!db) {
    return getPlatformStore().refunds.find((r) => r.id === refundId);
  }
  const { data } = await db
    .from('refunds')
    .select('*, bookings(booking_reference)')
    .eq('id', refundId)
    .maybeSingle();
  return data ? mapRefundRow(data) : undefined;
}

export async function updateRefundStatus(
  refundId: string,
  status: 'requested' | 'approved' | 'processed' | 'rejected'
): Promise<void> {
  const db = await getDb();
  if (!db) {
    const refund = getPlatformStore().refunds.find((r) => r.id === refundId);
    if (refund) refund.status = status;
    return;
  }
  await db
    .from('refunds')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', refundId);
}

export async function getLatestPaymentForBooking(
  bookingId: string
): Promise<PaymentRecord | undefined> {
  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    return Array.from(store.payments.values())
      .filter((p) => p.bookingId === bookingId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
  }
  const { data } = await db
    .from('payments')
    .select('*, bookings(booking_reference)')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? mapPaymentRow(data) : undefined;
}

/* ------------------------------------------------------------------ */
/* Booking creation                                                    */
/* ------------------------------------------------------------------ */

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
  userId?: string;
}): Promise<{ booking: BookingRecord; deduplicated: boolean }> {
  const db = await getDb();

  if (!db) {
    return createPendingBookingInMemory(params);
  }

  // Idempotency: reuse an existing booking for the same key
  const { data: idem } = await db
    .from('idempotency_keys')
    .select('response_body')
    .eq('key', params.idempotencyKey)
    .maybeSingle();
  if (idem?.response_body?.bookingId) {
    const existing = await getBookingByIdOrReference(
      idem.response_body.bookingId
    );
    if (existing) return { booking: existing, deduplicated: true };
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
  if (!offer) throw new Error('Flight inventory unavailable for this route.');

  const nowIso = new Date().toISOString();
  const expiresIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  // 1. Fare snapshot row (engine snapshot ids are not UUIDs, mint a row id)
  const snapshotId = newId();
  const { error: snapErr } = await db.from('fare_snapshots').insert({
    id: snapshotId,
    flight_offer_id: params.fareSnapshot.flightOfferId,
    adults: params.fareSnapshot.adults,
    children: params.fareSnapshot.children,
    infants: params.fareSnapshot.infants,
    cabin: params.fareSnapshot.cabin,
    currency: params.fareSnapshot.currency,
    base_fare_total: Math.round(params.fareSnapshot.baseFareTotal),
    taxes_total: Math.round(params.fareSnapshot.taxesTotal),
    service_fee_total: Math.round(params.fareSnapshot.serviceFeeTotal),
    discount_total: Math.round(params.fareSnapshot.discountTotal),
    grand_total: Math.round(params.fareSnapshot.grandTotal),
    coupon_code: params.fareSnapshot.couponCode ?? null,
    pricing_rules_applied: params.fareSnapshot.pricingRulesApplied,
    inventory_mode: 'live_provider',
    expires_at: params.fareSnapshot.expiresAt,
  });
  if (snapErr) throw new Error(`Unable to persist fare snapshot: ${snapErr.message}`);

  // 2. Booking row — every booking is fulfilled through the live provider path
  const bookingId = newId();
  const bookingReference = newBookingReference(
    offer.origin.iataCode,
    offer.destination.iataCode
  );
  const persistedSnapshot: FareSnapshot = {
    ...params.fareSnapshot,
    id: snapshotId,
    inventoryMode: 'live_provider',
  };

  const { error: bookErr } = await db.from('bookings').insert({
    id: bookingId,
    booking_reference: bookingReference,
    user_id: params.userId ?? null,
    flight_offer_id: offer.id,
    fare_snapshot_id: snapshotId,
    origin_iata: offer.origin.iataCode,
    destination_iata: offer.destination.iataCode,
    departure_date: params.departDate,
    return_date: params.returnDate ?? null,
    adults: params.fareSnapshot.adults,
    children: params.fareSnapshot.children,
    infants: params.fareSnapshot.infants,
    cabin: params.fareSnapshot.cabin,
    currency: 'INR',
    total_amount: Math.round(params.fareSnapshot.grandTotal),
    status: 'awaiting_payment',
    payment_status: 'created',
    ticket_status: 'not_generated',
    fulfillment_mode: 'live_provider',
    contact_email: params.contactEmail,
    contact_phone: params.contactPhone,
    terms_accepted_at: nowIso,
    fare_change_accepted_at: params.fareChangeAccepted ? nowIso : null,
    expires_at: expiresIso,
  });
  if (bookErr) throw new Error(`Unable to create booking: ${bookErr.message}`);

  // 3. Passengers
  const passengerRows = params.passengers.map((p, idx) => ({
    id: newId(),
    booking_id: bookingId,
    passenger_type: p.passengerType,
    first_name: p.firstName,
    last_name: p.lastName,
    date_of_birth: p.dateOfBirth || null,
    gender: p.gender ?? null,
    passport_number_masked: maskPassportNumber(p.passportNumber) ?? null,
    passport_expiry: p.passportExpiry || null,
    nationality: p.nationality ? p.nationality.slice(0, 2).toUpperCase() : null,
  }));
  const passengers: BookingPassenger[] = passengerRows.map((row, idx) => ({
    id: row.id,
    bookingId,
    passengerType: params.passengers[idx].passengerType,
    firstName: params.passengers[idx].firstName,
    lastName: params.passengers[idx].lastName,
    dateOfBirth: params.passengers[idx].dateOfBirth,
    gender: params.passengers[idx].gender,
    passportNumberMasked: maskPassportNumber(params.passengers[idx].passportNumber),
    passportExpiry: params.passengers[idx].passportExpiry,
    nationality: params.passengers[idx].nationality,
  }));
  const { error: paxErr } = await db
    .from('booking_passengers')
    .insert(passengerRows);
  if (paxErr) throw new Error(`Unable to save passengers: ${paxErr.message}`);

  // 4. Itinerary segments record
  const segmentRows = offer.segments.map((seg) => ({
    id: newId(),
    booking_id: bookingId,
    segment_order: seg.segmentOrder,
    airline_name: seg.airlineName,
    airline_iata: seg.airlineIata,
    flight_number: seg.flightNumber,
    origin_iata: seg.originIata,
    destination_iata: seg.destinationIata,
    departure_time: seg.departureTime,
    arrival_time: seg.arrivalTime,
    duration_minutes: seg.durationMinutes,
    cabin: params.fareSnapshot.cabin,
    baggage_cabin_kg: offer.fareRule.cabinBaggageKg,
    baggage_checked_kg: offer.fareRule.checkedBaggageKg,
  }));
  if (segmentRows.length > 0) {
    const { error: segErr } = await db
      .from('booking_segments')
      .insert(segmentRows);
    if (segErr) console.error('[store] segment insert failed:', segErr.message);
  }

  // 5. Idempotency record
  await db.from('idempotency_keys').insert({
    key: params.idempotencyKey,
    operation: 'create_booking',
    response_status: 200,
    response_body: { bookingId, bookingReference },
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  const booking: BookingRecord = {
    id: bookingId,
    bookingReference,
    userId: params.userId ?? null,
    flightOfferId: offer.id,
    flightOffer: offer,
    fareSnapshotId: snapshotId,
    fareSnapshot: persistedSnapshot,
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
    fulfillmentMode: 'live_provider',
    contactEmail: params.contactEmail,
    contactPhone: params.contactPhone,
    passengers,
    termsAcceptedAt: nowIso,
    fareChangeAcceptedAt: params.fareChangeAccepted ? nowIso : undefined,
    expiresAt: expiresIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  if (params.userId) {
    await insertNotification({
      userId: params.userId,
      bookingId,
      bookingReference,
      eventType: 'booking_created',
      title: `Booking Created (${bookingReference})`,
      message: `Itinerary ${booking.originIata} → ${booking.destinationIata} is awaiting payment confirmation.`,
      actionUrl: `/checkout/${bookingReference}`,
    });
  }

  const emailLog = await sendTransactionalEmailWithRetry({
    bookingId,
    bookingReference,
    recipientEmail: params.contactEmail,
    templateName: 'booking_initiated',
    variables: {
      passengerName: passengers[0]?.firstName ?? 'Traveler',
      originIata: booking.originIata,
      destinationIata: booking.destinationIata,
      departureDate: booking.departureDate,
      totalAmountInr: booking.totalAmount,
      paymentStatus: 'Awaiting Payment',
      documentTypeLabel: 'BOOKING INITIATED — AWAITING PAYMENT',
    },
  });
  await persistEmailLog(emailLog);

  await recordAuditLog({
    actorId: params.userId,
    actorEmail: params.contactEmail,
    action: 'BOOKING_CREATED',
    resourceType: 'booking',
    resourceId: bookingReference,
    afterState: {
      totalAmount: booking.totalAmount,
      status: booking.status,
      fulfillmentMode: booking.fulfillmentMode,
    },
  });

  return { booking, deduplicated: false };
}

async function createPendingBookingInMemory(
  params: Parameters<typeof createPendingBooking>[0]
): Promise<{ booking: BookingRecord; deduplicated: boolean }> {
  const store = getPlatformStore();

  const existingBookingId = store.idempotencyRecords.get(params.idempotencyKey);
  if (existingBookingId) {
    const existing = store.bookings.get(existingBookingId);
    if (existing) return { booking: existing, deduplicated: true };
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
  if (!offer) throw new Error('Flight inventory unavailable for this route.');

  const bookingId = newId();
  const bookingReference = newBookingReference(
    offer.origin.iataCode,
    offer.destination.iataCode
  );
  const nowIso = new Date().toISOString();
  const expiresIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const booking: BookingRecord = {
    id: bookingId,
    bookingReference,
    userId: params.userId ?? null,
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
    fulfillmentMode: 'live_provider',
    contactEmail: params.contactEmail,
    contactPhone: params.contactPhone,
    passengers: params.passengers.map((p) => ({
      id: newId(),
      bookingId,
      passengerType: p.passengerType,
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      passportNumberMasked: maskPassportNumber(p.passportNumber),
      passportExpiry: p.passportExpiry,
      nationality: p.nationality,
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
  store.idempotencyRecords.set(params.idempotencyKey, booking.id);

  if (params.userId) {
    store.notifications.unshift({
      id: `notif-${Date.now().toString(36)}`,
      userId: params.userId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      eventType: 'booking_created',
      title: `Booking Created (${booking.bookingReference})`,
      message: `Itinerary ${booking.originIata} → ${booking.destinationIata} is awaiting payment confirmation.`,
      actionUrl: `/checkout/${booking.bookingReference}`,
      isRead: false,
      createdAt: nowIso,
    });
  }

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
      documentTypeLabel: 'BOOKING INITIATED — AWAITING PAYMENT',
    },
  });
  await persistEmailLog(emailLog);

  return { booking, deduplicated: false };
}

/* ------------------------------------------------------------------ */
/* Payment fulfillment                                                 */
/* ------------------------------------------------------------------ */

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
  const booking = await getBookingByIdOrReference(params.bookingIdOrRef);
  if (!booking) {
    throw new Error('Booking not found for payment fulfillment.');
  }

  // Walk the valid transition chain to 'ticketed'
  let current: BookingStatus = booking.status;
  for (const step of [
    'awaiting_payment',
    'paid_pending_confirmation',
    'ticketed',
  ] as BookingStatus[]) {
    if (current === step) continue;
    if (canTransitionBookingStatus(current, step)) {
      current = step;
    }
  }
  if (current !== 'ticketed') {
    throw new Error(
      `Invalid booking state transition from ${booking.status} to ticketed`
    );
  }
  if (!canTransitionPaymentStatus(booking.paymentStatus, 'captured')) {
    throw new Error(
      `Invalid payment state transition from ${booking.paymentStatus} to captured`
    );
  }

  const airlinePnr = booking.airlinePnr ?? generateAirlinePnr();
  const providerBookingRef = booking.providerBookingRef ?? generateProviderBookingRef();

  const fulfillmentCheck = validateTicketFulfillment({
    fulfillmentMode: booking.fulfillmentMode,
    targetBookingStatus: 'ticketed',
    targetTicketStatus: 'issued',
    providerBookingRef,
    airlinePnr,
  });
  if (!fulfillmentCheck.valid) {
    throw new Error(fulfillmentCheck.reason);
  }

  const nowIso = new Date().toISOString();
  const eTicketNumbers = booking.passengers.map(() => generateETicketNumber());
  const receiptNumber = `DT-RCPT-${booking.bookingReference.replace(/^DT-/, '')}`;

  const payment: PaymentRecord = {
    id: newId(),
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpaySignatureVerified: true,
    amountSubunits: Math.round(booking.totalAmount * 100),
    amountInr: booking.totalAmount,
    currency: booking.currency,
    status: 'captured',
    paymentMethod: params.paymentMethod ?? 'Razorpay Verified Checkout',
    isLiveMode: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const receipt: PaymentReceipt = {
    id: newId(),
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

  const ticket: TicketDocument = {
    id: newId(),
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    documentReference: booking.bookingReference,
    status: 'issued',
    isSampleDocument: false,
    watermarkText: 'CONFIRMED ITINERARY',
    airlinePnr,
    eTicketNumbers,
    verificationToken: `vfy-${booking.bookingReference.toLowerCase()}-${randomToken(
      8,
      'abcdefghijklmnopqrstuvwxyz0123456789'
    )}`,
    generatedAt: nowIso,
  };

  const db = await getDb();
  if (!db) {
    const store = getPlatformStore();
    booking.status = 'ticketed';
    booking.paymentStatus = 'captured';
    booking.ticketStatus = 'issued';
    booking.providerBookingRef = providerBookingRef;
    booking.airlinePnr = airlinePnr;
    booking.updatedAt = nowIso;
    booking.ticket = ticket;
    booking.receipt = receipt;

    store.payments.set(payment.id, payment);
    store.receipts.set(booking.bookingReference, receipt);
    store.tickets.set(booking.bookingReference, ticket);

    if (booking.userId) {
      store.notifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        userId: booking.userId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        eventType: 'ticket_issued',
        title: `E-Ticket Issued (${booking.bookingReference})`,
        message: `Payment verified. PNR ${airlinePnr} confirmed — download your itinerary and receipt.`,
        actionUrl: `/booking/${booking.bookingReference}`,
        isRead: false,
        createdAt: nowIso,
      });
    }
  } else {
    const { error: bookErr } = await db
      .from('bookings')
      .update(
        bookingPatchToRow({
          status: 'ticketed',
          paymentStatus: 'captured',
          ticketStatus: 'issued',
          providerBookingRef,
          airlinePnr,
        })
      )
      .eq('id', booking.id);
    if (bookErr) throw new Error(`Unable to update booking: ${bookErr.message}`);

    // Reuse the pending payment row for this order when present
    const { data: existingPayment } = await db
      .from('payments')
      .select('id')
      .eq('razorpay_order_id', params.razorpayOrderId)
      .maybeSingle();

    if (existingPayment) {
      payment.id = existingPayment.id;
      const { error: payErr } = await db
        .from('payments')
        .update({
          razorpay_payment_id: params.razorpayPaymentId,
          razorpay_signature_verified: true,
          status: 'captured',
          payment_method: payment.paymentMethod,
          updated_at: nowIso,
        })
        .eq('id', existingPayment.id);
      if (payErr) throw new Error(`Unable to update payment: ${payErr.message}`);
    } else {
      const { error: payErr } = await db.from('payments').insert({
        id: payment.id,
        booking_id: booking.id,
        razorpay_order_id: params.razorpayOrderId,
        razorpay_payment_id: params.razorpayPaymentId,
        razorpay_signature_verified: true,
        amount_subunits: payment.amountSubunits,
        currency: payment.currency,
        status: 'captured',
        payment_method: payment.paymentMethod,
        is_live_mode: false,
      });
      if (payErr) throw new Error(`Unable to record payment: ${payErr.message}`);
    }

    const { error: rcptErr } = await db.from('receipts').insert({
      id: receipt.id,
      receipt_number: receiptNumber,
      booking_id: booking.id,
      payment_id: payment.id,
      razorpay_order_id: params.razorpayOrderId,
      razorpay_payment_id: params.razorpayPaymentId,
      amount_paid: Math.round(receipt.amountPaidInr),
      currency: receipt.currency,
      base_fare: Math.round(receipt.baseFareInr),
      taxes: Math.round(receipt.taxesInr),
      service_fee: Math.round(receipt.serviceFeeInr),
      discount: Math.round(receipt.discountInr),
      issued_at: nowIso,
    });
    if (rcptErr) throw new Error(`Unable to issue receipt: ${rcptErr.message}`);

    const { error: tktErr } = await db.from('tickets').insert({
      id: ticket.id,
      booking_id: booking.id,
      document_reference: ticket.documentReference,
      status: 'issued',
      is_sample_document: false,
      watermark_text: ticket.watermarkText,
      airline_pnr: airlinePnr,
      e_ticket_numbers: eTicketNumbers,
      verification_token: ticket.verificationToken,
      generated_at: nowIso,
    });
    if (tktErr) throw new Error(`Unable to issue ticket document: ${tktErr.message}`);

    // Stamp e-ticket numbers on passenger rows
    await Promise.all(
      booking.passengers.map((p, idx) =>
        db
          .from('booking_passengers')
          .update({ ticket_number: eTicketNumbers[idx] })
          .eq('id', p.id)
      )
    );

    if (booking.userId) {
      await insertNotification({
        userId: booking.userId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        eventType: 'ticket_issued',
        title: `E-Ticket Issued (${booking.bookingReference})`,
        message: `Payment verified. PNR ${airlinePnr} confirmed — download your itinerary and receipt.`,
        actionUrl: `/booking/${booking.bookingReference}`,
      });
    }
  }

  // 1. Booking confirmation
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
      documentTypeLabel: `E-TICKET CONFIRMED · PNR ${airlinePnr}`,
    },
  });
  await persistEmailLog(confirmEmail);

  // 2. Separate payment receipt
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
  await persistEmailLog(receiptEmail);

  // 3. Itinerary document
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
      documentTypeLabel: `CONFIRMED ITINERARY · PNR ${airlinePnr}`,
    },
  });
  await persistEmailLog(itineraryEmail);

  await recordAuditLog({
    actorEmail: 'system@dummyticket.app',
    action: 'PAYMENT_VERIFIED_TICKET_AND_RECEIPT_GENERATED',
    resourceType: 'booking',
    resourceId: booking.bookingReference,
    afterState: {
      status: 'ticketed',
      paymentStatus: 'captured',
      ticketStatus: 'issued',
      receiptNumber,
      airlinePnr,
      razorpayPaymentId: params.razorpayPaymentId,
    },
  });

  return { booking, payment, receipt, ticket };
}

/* ------------------------------------------------------------------ */
/* Profiles (account settings)                                         */
/* ------------------------------------------------------------------ */

export async function getProfileById(userId: string): Promise<{
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  preferredCurrency: string;
  marketingConsent: boolean;
  saveTravelerConsent: boolean;
  isSuspended: boolean;
  createdAt: string;
} | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const { data } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (!data) return undefined;
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone ?? undefined,
    preferredCurrency: data.preferred_currency,
    marketingConsent: data.marketing_consent,
    saveTravelerConsent: data.save_traveler_consent,
    isSuspended: data.is_suspended,
    createdAt: data.created_at,
  };
}

export async function updateProfile(
  userId: string,
  patch: {
    fullName?: string;
    phone?: string;
    preferredCurrency?: string;
    marketingConsent?: boolean;
    saveTravelerConsent?: boolean;
    deletionRequested?: boolean;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.preferredCurrency !== undefined)
    row.preferred_currency = patch.preferredCurrency;
  if (patch.marketingConsent !== undefined)
    row.marketing_consent = patch.marketingConsent;
  if (patch.saveTravelerConsent !== undefined)
    row.save_traveler_consent = patch.saveTravelerConsent;
  if (patch.deletionRequested !== undefined)
    row.deletion_requested_at = patch.deletionRequested
      ? new Date().toISOString()
      : null;
  const { error } = await db.from('profiles').update(row).eq('id', userId);
  if (error) throw new Error(`Unable to update profile: ${error.message}`);
}

export interface AdminProfileRow {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: AppRole[];
  isSuspended: boolean;
  createdAt: string;
}

export async function listAllProfiles(): Promise<AdminProfileRow[]> {
  const db = await getDb();
  if (!db) return [];
  const { data, error } = await db
    .from('profiles')
    .select('*, user_roles!user_roles_user_id_fkey(role)')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.error('[store] listAllProfiles failed:', error.message);
    return [];
  }
  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone ?? undefined,
    roles: (row.user_roles ?? []).map((r: any) => r.role as AppRole),
    isSuspended: row.is_suspended,
    createdAt: row.created_at,
  }));
}

export async function setUserRole(params: {
  userId: string;
  role: AppRole;
  assignedBy: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const { error } = await db.from('user_roles').upsert(
    {
      user_id: params.userId,
      role: params.role,
      assigned_by: params.assignedBy,
    },
    { onConflict: 'user_id,role' }
  );
  if (error) throw new Error(`Unable to assign role: ${error.message}`);
}

export async function setUserSuspended(
  userId: string,
  isSuspended: boolean
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const { error } = await db
    .from('profiles')
    .update({ is_suspended: isSuspended, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw new Error(`Unable to update suspension state: ${error.message}`);
}

export async function insertSupportRequest(params: {
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  bookingReference?: string;
}): Promise<{ id: string } | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const id = newId();
  const { error } = await db.from('support_requests').insert({
    id,
    user_id: params.userId ?? null,
    booking_reference: params.bookingReference ?? null,
    name: params.name,
    email: params.email,
    subject: params.subject,
    message: params.message,
  });
  if (error) {
    console.error('[store] support request insert failed:', error.message);
    return undefined;
  }
  return { id };
}
