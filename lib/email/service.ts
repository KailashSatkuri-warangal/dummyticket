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
    pdfDownloadUrl?: string;
  };
}

export function renderEmailTemplate(payload: TransactionalEmailPayload): {
  subject: string;
  html: string;
  templateVersion: string;
} {
  const brand = getBrandConfig();
  const ref = payload.bookingReference ?? 'DT-REF';
  const payRef = payload.paymentReference ?? payload.receiptNumber ?? ref;
  const amount =
    payload.variables.totalAmountInr !== undefined
      ? formatInr(payload.variables.totalAmountInr)
      : '';
  const docLabel =
    payload.variables.documentTypeLabel ?? 'CONFIRMED ITINERARY';
  const bookingUrl =
    payload.variables.bookingUrl ?? `${brand.appUrl}/booking/${ref}`;
  const pdfDownloadUrl =
    payload.variables.pdfDownloadUrl ?? `${brand.appUrl}/api/tickets/${ref}/pdf`;

  const subjects: Record<EmailTemplateName, string> = {
    welcome_verification: `Welcome to ${brand.name} — Verify Your Email Address`,
    password_reset: `${brand.name} — Password Reset Instructions`,
    booking_initiated: `Booking Initiated — Reference: ${ref}`,
    booking_confirmation: `Flight Reservation Confirmed — ${ref}`,
    payment_receipt: `Official Payment Receipt — ${payRef}`,
    itinerary_document: `Flight Itinerary & Ticket Document — ${ref}`,
    payment_pending: `Action Required: Complete Your Reservation — ${ref}`,
    payment_successful: `Payment Verified (${amount}) — ${ref}`,
    payment_failed: `Payment Processing Failed — ${ref}`,
    ticket_issued: `Confirmed Flight Itinerary Ready — ${ref}`,
    booking_cancelled: `Booking Cancellation Notice — ${ref}`,
    refund_initiated: `Refund Initiated (${amount}) — ${ref}`,
    refund_completed: `Refund Completed — ${ref}`,
    fare_changed: `Important Flight Schedule / Fare Update — ${ref}`,
    booking_update: `Schedule or Itinerary Update — ${ref}`,
    admin_booking_alert: `[Admin Alert] Booking Activity — ${ref}`,
  };

  const subject = subjects[payload.templateName] || `Flight Reservation — ${ref}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: #0f172a; color: #ffffff; padding: 20px 24px;">
        <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #38bdf8;">
          FLIGHT RESERVATION ITINERARY
        </span>
        <span style="float: right; font-size: 12px; font-family: monospace; background: rgba(255,255,255,0.15); color: #ffffff; font-weight: 700; padding: 4px 10px; border-radius: 99px;">
          PNR: ${ref}
        </span>
      </div>

      <div style="padding: 24px; color: #0f172a;">
        <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #0f172a;">${subject}</h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">
          Dear ${payload.variables.passengerName ?? 'Traveler'},
        </p>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">
          Your flight reservation document has been successfully processed and is ready for your visa application or travel records.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Booking Reference:</td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: 800; color: #0f172a; text-align: right;">${ref}</td>
            </tr>
            ${
              payload.receiptNumber
                ? `<tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Receipt Number:</td>
                    <td style="padding: 6px 0; font-family: monospace; font-weight: 700; color: #0f172a; text-align: right;">${payload.receiptNumber}</td>
                  </tr>`
                : ''
            }
            ${
              payload.variables.originIata && payload.variables.destinationIata
                ? `<tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Flight Route:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">
                      ${payload.variables.originIata} ✈ ${payload.variables.destinationIata}
                    </td>
                  </tr>`
                : ''
            }
            ${
              payload.variables.departureDate
                ? `<tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Departure Date:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${payload.variables.departureDate}</td>
                  </tr>`
                : ''
            }
            ${
              amount
                ? `<tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Verified Amount:</td>
                    <td style="padding: 6px 0; font-weight: 800; color: #0f172a; text-align: right;">${amount}</td>
                  </tr>`
                : ''
            }
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Status:</td>
              <td style="padding: 6px 0; font-weight: 800; color: #059669; text-align: right;">${payload.variables.paymentStatus ?? 'CONFIRMED'}</td>
            </tr>
          </table>
        </div>

        <!-- Download Buttons -->
        <div style="margin: 26px 0; text-align: center;">
          <a href="${pdfDownloadUrl}" style="background: #0062e0; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; margin: 4px; box-shadow: 0 4px 10px rgba(0,98,224,0.25);">
            Download PDF Itinerary
          </a>
          <a href="${bookingUrl}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; margin: 4px;">
            View Online Booking
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0;">
          This electronic travel itinerary document confirms your flight schedule. Please print or download the PDF copy for your embassy appointment or border presentation.
        </p>
      </div>
    </div>
  `;

  return { subject, html, templateVersion: 'v2.2.0' };
}

export async function sendTransactionalEmailWithRetry(
  payload: TransactionalEmailPayload,
  maxRetries = 2
): Promise<EmailLogRecord> {
  const brand = getBrandConfig();
  const rendered = renderEmailTemplate(payload);

  let attempt = 0;
  let lastError: string | undefined;
  let status: EmailDeliveryStatus = 'queued';
  let providerMessageId: string | undefined;

  // ── Gmail SMTP via Nodemailer (primary transport) ──────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');

  if (gmailUser && gmailAppPassword) {
    const emailFrom = `Flight Reservations <${gmailUser}>`;

    while (attempt <= maxRetries) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
          connectionTimeout: 8000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
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
        console.log(`[email] Dispatched successfully to ${payload.recipientEmail} (${info.messageId})`);
        break;
      } catch (err: any) {
        lastError = err instanceof Error ? err.message : 'SMTP error';
        status = 'failed';
        attempt++;
        console.warn(`[email] Gmail SMTP attempt ${attempt} failed for ${payload.recipientEmail}:`, lastError);
      }
    }
    return buildLogRecord(payload, rendered, status, attempt, providerMessageId, lastError);
  }

  // ── Resend API (secondary fallback) ────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (brand.resendConfigured && resendKey && !resendKey.includes('placeholder')) {
    const emailFrom = process.env.EMAIL_FROM || 'Flight Reservations <onboarding@resend.dev>';
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

  // ── No external provider credentials available — queue in-memory ──────────
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
