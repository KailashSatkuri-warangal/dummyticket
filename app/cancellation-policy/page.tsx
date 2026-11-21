import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | DummyTickets',
  description:
    'Official Strict No-Cancellation and No-Refund Policy for digital flight itinerary reservations and travel documents.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
          <Link href="/" className="hover:text-[#0062e0] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Strict Company Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Strict No-Cancellation & No-Refund Policy
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            All flight reservations, onward tickets, hotel vouchers, and travel support documents provided by DummyTickets are customized digital products that are fulfilled, verified, and issued instantly upon request.
          </p>

          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <h2 className="text-base font-bold text-rose-900">
              1. Final & Non-Cancellable Orders
            </h2>
            <p className="text-xs text-rose-800 leading-relaxed">
              Once an order is submitted and the itinerary or ticket document has been generated, all sales are strictly final. Cancellations are not permitted under any circumstances, and no partial or full refunds will be issued.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              2. Free Corrections & Error Fixes
            </h2>
            <p>
              If there was a typographical error in your passenger name, passport number, or flight dates due to a system issue or inadvertent mistake, we will gladly regenerate and reissue your documents free of charge within 24 hours of issuance. Please reach out via our official contact channels with your booking reference.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              3. Visa Processing Outcomes
            </h2>
            <p>
              Embassies, consulates, and border immigration officers retain sole discretion over visa approvals and border entry. Processing outcomes, embassy scheduling delays, appointment cancellations, or personal changes in travel plans do not qualify for cancellations or monetary refunds.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-500">
              Last Updated: May 2026 · Official Legal Advisory
            </div>
            <Link
              href="/refund-policy"
              className="text-xs font-bold text-[#0062e0] hover:underline"
            >
              View Full Refund Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
