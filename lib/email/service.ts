import type { EmailDeliveryStatus, EmailLogRecord } from '@/types';
import { getBrandConfig, formatInr } from '@/lib/config/brand';

export type EmailTemplateName =
  | 'welcome_verification'
  | 'password_reset'
  | 'booking_initiated'
  | 'booking_confirmation'
  | 'payment_receipt'
  | 'itinerary_document'
  | 'payment_pending'
  | 'payment_successful'
  | 'payment_failed'
  | 'sample_itinerary_generated'
  | 'real_booking_confirmed'
  | 'ticket_issued'
  | 'booking_cancelled'
  | 'refund_initiated'
  | 'refund_completed'
  | 'fare_changed'
  | 'booking_update'
  | 'admin_booking_alert';

export interface TransactionalEmailPayload {
  bookingId?: string;
  bookingReference?: string;
  paymentReference?: string;
  receiptNumber?: string;
  recipientEmail: string;
  templateName: EmailTemplateName;
  variables: {
    passengerName?: string;
    originIata?: string;
    destinationIata?: string;
    departureDate?: string;
    totalAmountInr?: number;
    baseFareInr?: number;
    taxesInr?: number;
    serviceFeeInr?: number;
    paymentStatus?: string;
    documentTypeLabel?: string;
    bookingUrl?: string;
  };
}

export function renderEmailTemplate(payload: TransactionalEmailPayload): {
  subject: string;
  html: string;
  templateVersion: string;
} {
  const brand = getBrandConfig();
  const ref = payload.bookingReference ?? 'DT-DEMO-REF';
  const payRef = payload.paymentReference ?? payload.receiptNumber ?? ref;
  const amount =
    payload.variables.totalAmountInr !== undefined
      ? formatInr(payload.variables.totalAmountInr)
      : '';
  const docLabel =
    payload.variables.documentTypeLabel ??
    'SAMPLE — NOT VALID FOR TRAVEL';
  const bookingUrl =
    payload.variables.bookingUrl ?? `${brand.appUrl}/booking/${ref}`;

  const subjects: Record<EmailTemplateName, string> = {
    welcome_verification: `Welcome to ${brand.name} — Verify Your Email Address`,
    password_reset: `${brand.name} — Password Reset Instructions`,
    booking_initiated: `${brand.name} Booking Initiated — ${ref}`,
    booking_confirmation: `DummyTicket Booking Confirmation — ${ref}`,
    payment_receipt: `DummyTicket Payment Receipt — ${payRef}`,
    itinerary_document: `Your DummyTicket Itinerary — ${ref}`,
    payment_pending: `Action Required: Complete Your DummyTicket Payment — ${ref}`,
    payment_successful: `DummyTicket Payment Verified (${amount}) — ${ref}`,
    payment_failed: `DummyTicket Payment Incomplete — ${ref}`,
    sample_itinerary_generated: `Your DummyTicket Itinerary — ${ref} (Sample Document)`,
    real_booking_confirmed: `DummyTicket Reservation Confirmed — ${ref}`,
    ticket_issued: `Official Airline E-Ticket Issued — ${ref}`,
    booking_cancelled: `DummyTicket Booking Cancellation — ${ref}`,
    refund_initiated: `DummyTicket Refund Initiated (${amount}) — ${ref}`,
    refund_completed: `DummyTicket Refund Completed — ${ref}`,
    fare_changed: `Important Fare Update — ${ref}`,
    booking_update: `DummyTicket Schedule or Itinerary Update — ${ref}`,
    admin_booking_alert: `[DummyTicket Admin] Booking Activity — ${ref}`,
  };

  const subject = subjects[payload.templateName];

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #dbeafe; border-radius: 16px; overflow: hidden;">
      <div style="background: #0062e0; color: #ffffff; padding: 18px 24px; border-bottom: 4px solid #60a5fa;">
        <strong style="font-size: 19px; letter-spacing: -0.02em;">DummyTicket</strong>
        <span style="float: right; font-size: 11px; background: #ebf4ff; color: #0062e0; font-weight: 800; padding: 3px 8px; border-radius: 99px;">
          ${ref}
        </span>
      </div>
      <div style="padding: 24px; color: #0b1120;">
        <h2 style="font-size: 19px; margin-top: 0; color: #0b1120;">${subject}</h2>
        <p style="font-size: 14px; color: #334155;">
          Hello ${payload.variables.passengerName ?? 'Traveler'},
        </p>
        <div style="background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Booking Reference:</strong> ${ref}</p>
          ${
            payload.receiptNumber
              ? `<p style="margin: 4px 0;"><strong>Receipt Number:</strong> ${payload.receiptNumber}</p>`
              : ''
          }
          ${
            payload.variables.originIata
              ? `<p style="margin: 4px 0;"><strong>Route:</strong> ${payload.variables.originIata} → ${payload.variables.destinationIata} (${payload.variables.departureDate ?? ''})</p>`
              : ''
          }
          ${amount ? `<p style="margin: 4px 0;"><strong>Total Verified Amount:</strong> ${amount}</p>` : ''}
          <p style="margin: 4px 0;"><strong>Payment Status:</strong> ${payload.variables.paymentStatus ?? 'Recorded'}</p>
          <p style="margin: 4px 0;"><strong>Document Classification:</strong> <span style="color: #0062e0; font-weight: 800;">${docLabel}</span></p>
        </div>
        <p style="margin: 22px 0;">
          <a href="${bookingUrl}" style="background: #0062e0; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; margin-right: 8px;">View Booking & Download PDF</a>
        </p>
        <hr style="border: none; border-top: 1px solid #dbeafe; margin: 20px 0;" />
        <p style="font-size: 11px; color: #64748b;">
          Support: ${brand.supportEmail} | ${brand.supportPhone}. Payment receipts confirm payment capture only and are distinct from airline-issued tickets.
        </p>
      </div>
    </div>
  `;

  return { subject, html, templateVersion: 'v2.1.0' };
}

export async function sendTransactionalEmailWithRetry(
  payload: TransactionalEmailPayload,
  maxRetries = 2
): Promise<EmailLogRecord> {
  const brand = getBrandConfig();
  const rendered = renderEmailTemplate(payload);
  const emailFrom =
    process.env.EMAIL_FROM || `DummyTicket <ksatkuri@gmail.com>`;

  let attempt = 0;
  let lastError: string | undefined;
  let status: EmailDeliveryStatus = 'queued';
  let providerMessageId: string | undefined;

  // ── Gmail SMTP via Nodemailer (primary) ────────────────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    while (attempt <= maxRetries) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        const info = await transporter.sendMail({
          from: emailFrom,
          to: payload.recipientEmail,
          subject: rendered.subject,
          html: rendered.html,
        });

        providerMessageId = info.messageId;
        status = 'sent';
        lastError = undefined;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'SMTP error';
        status = 'failed';
        attempt++;
      }
    }
    return buildLogRecord(payload, rendered, status, attempt, providerMessageId, lastError);
  }

  // ── Resend API (secondary) ─────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (brand.resendConfigured && resendKey) {
    while (attempt <= maxRetries) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [payload.recipientEmail],
            subject: rendered.subject,
            html: rendered.html,
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as { id: string };
          providerMessageId = data.id;
          status = 'sent';
          lastError = undefined;
          break;
        } else {
          lastError = `Resend HTTP ${res.status}`;
          status = 'failed';
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Network error';
        status = 'failed';
      }
      attempt++;
    }
    return buildLogRecord(payload, rendered, status, attempt, providerMessageId, lastError);
  }

  // ── No provider configured — queue for later ────────────────────────────────
  status = 'queued';
  providerMessageId = `dt_queue_${Date.now().toString(36)}`;
  return buildLogRecord(payload, rendered, status, attempt, providerMessageId, undefined);
}

function buildLogRecord(
  payload: TransactionalEmailPayload,
  rendered: { subject: string; templateVersion: string },
  status: EmailDeliveryStatus,
  attempt: number,
  providerMessageId: string | undefined,
  lastError: string | undefined
): EmailLogRecord {
  return {
    id: `em-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    bookingId: payload.bookingId,
    bookingReference: payload.bookingReference,
    recipientEmail: payload.recipientEmail,
    templateName: payload.templateName,
    templateVersion: rendered.templateVersion,
    subject: rendered.subject,
    providerMessageId,
    status,
    retryCount: attempt,
    errorMessage: lastError,
    createdAt: new Date().toISOString(),
  };
}

