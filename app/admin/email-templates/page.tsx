import React from 'react';
import { getPlatformStore } from '@/lib/booking/store';

export default function AdminEmailTemplatesPage() {
  const store = getPlatformStore();

  const templateCatalog = [
    'welcome_verification',
    'password_reset',
    'booking_initiated',
    'payment_pending',
    'payment_successful',
    'payment_failed',
    'sample_itinerary_generated',
    'real_booking_confirmed',
    'ticket_issued',
    'booking_cancelled',
    'refund_initiated',
    'refund_completed',
    'fare_changed',
    'booking_update',
    'admin_booking_alert',
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h1 className="text-xl font-extrabold text-navy-900">
          Transactional Email Templates & Delivery Logs
        </h1>
        <p className="text-xs text-slate-600">
          Emails distinguish between <code>queued</code>, <code>sent</code>,{' '}
          <code>delivered</code>, <code>bounced</code>, and <code>failed</code> states.
        </p>
        <div className="flex flex-wrap gap-2">
          {templateCatalog.map((tpl) => (
            <span
              key={tpl}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-navy-900"
            >
              {tpl}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-navy-900">
          Email Delivery Log ({store.emailLogs.length})
        </h2>
        <div className="divide-y divide-slate-100 text-xs">
          {store.emailLogs.map((em) => (
            <div key={em.id} className="py-3 flex justify-between">
              <div>
                <p className="font-bold text-navy-900">{em.subject}</p>
                <p className="text-slate-500">
                  To: {em.recipientEmail} · Template: {em.templateName} · MsgID:{' '}
                  {em.providerMessageId}
                </p>
              </div>
              <span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-brand-700 self-start">
                {em.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
