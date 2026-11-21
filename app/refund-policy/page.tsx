import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Ban,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertOctagon,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strict No-Refund Policy | DummyTickets',
  description:
    'DummyTickets company policy: All flight reservations, temporary itineraries, hotel vouchers, and consular document purchases are 100% final and strictly non-refundable.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-500/30">
            <Ban className="w-3.5 h-3.5" />
            <span>Company Policy Statement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Strict No-Refund Policy
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            All purchases, flight itinerary reservations, hotel booking vouchers, and document generations on DummyTickets are 100% final and non-refundable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Transparent Terms</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant Digital Fulfillment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        {/* Core Warning Box */}
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 sm:p-10 text-rose-950 shadow-sm space-y-4">
          <div className="flex items-center gap-3 font-black text-lg text-rose-900">
            <AlertOctagon className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <span>Absolute No-Refund Guarantee Notice</span>
          </div>
          <p className="text-sm leading-relaxed text-rose-900">
            <strong>DummyTickets enforces a strict NO-REFUND POLICY on all transactions.</strong> Under no circumstances do we issue monetary refunds, cash returns, or payment reversals once an order has been submitted or digital documents have been provisioned. By completing checkout, you acknowledge and agree that your order is final and non-refundable.
          </p>
        </div>

        {/* Detailed Policy Sections */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              1. Nature of Real-Time Digital Fulfillment
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              DummyTickets provides automated, on-demand digital services. When you place an order for a flight reservation, PNR itinerary, hotel voucher, or visa letter:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>Our automated systems instantly allocate reservation slots, process airline GDS provider queues, and generate custom high-resolution PDF documents.</li>
              <li>Operational, routing, and third-party GDS provider costs are incurred immediately upon checkout.</li>
              <li>Because digital products cannot be physically returned or un-generated, our services are considered fully delivered and consumed the second the PDF is produced.</li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              2. Situations Where Refunds Are NOT Provided
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              Without exception, refunds will NOT be issued under any of the following scenarios:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">Visa Denials or Delays</div>
                <p className="text-xs text-slate-600">
                  Consular decisions, embassy processing delays, or visa rejections do not qualify for a refund.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">Travel Date Changes</div>
                <p className="text-xs text-slate-600">
                  Changes in your personal travel plans, rescheduled interviews, or missed flights do not warrant a refund.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">Customer Input Errors</div>
                <p className="text-xs text-slate-600">
                  Misspelled passenger names, incorrect dates, or invalid passport numbers entered by the customer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">Change of Mind</div>
                <p className="text-xs text-slate-600">
                  Deciding not to apply for a visa, choosing alternative airlines, or no longer requiring the itinerary.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              3. Support & Document Correction Commitment
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              While we strictly do not provide cash or card refunds, we are dedicated to ensuring you receive what you paid for. If you encounter a technical failure (e.g. download link failure, corrupted PDF, or server delivery error), our customer support team will promptly investigate and <strong>re-issue or re-generate your documents free of charge</strong>.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              Please contact us via our <Link href="/contact" className="text-[#0062e0] font-bold underline">Help & Support Desk</Link> with your Booking Reference (`DT-XXXXXX`) within 24 hours of purchase for assistance.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              4. Chargebacks and Fraudulent Disputes
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              Because our strict No-Refund Policy is clearly published and agreed to prior to checkout, any unjustified payment dispute or fraudulent chargeback filed through banking providers will be vigorously contested with server generation timestamps, download logs, IP address audits, and signed transaction receipts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
