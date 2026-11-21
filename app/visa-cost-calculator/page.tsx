import type { Metadata } from 'next';
import { VisaCostCalculatorInteractive } from '@/components/tools/VisaCostCalculatorInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Coins,
  Receipt,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Visa Fee & Cost Calculator | DummyTickets',
  description:
    'Calculate official statutory visa application fees, biometric charges, VFS/BLS service fees, and optional processing costs across 195+ countries.',
};

const VISA_COST_FAQS = [
  {
    question: 'What fees are included in the total cost of a visa application?',
    answer:
      'A complete visa budget includes: 1) Statutory Consular Fee: Government fee mandated by law (e.g. €90 for adult Schengen visa, $185 for US B1/B2); 2) VAC Service Fee: Outsourced biometric center processing charges (e.g. VFS Global, TLScontact, or BLS, typically $20–$40); 3) Biometric Enrolment Fee: Fingerprinting fee charged in some jurisdictions (e.g. UKVI, Canada); 4) Optional Priority / Courier Services: SMS alerts, premium lounge, or passport return courier.',
  },
  {
    question: 'Are embassy visa fees refundable if my application is denied?',
    answer:
      'No. Government consular and visa application center fees are strictly non-refundable once an application is submitted and biometric data is captured, regardless of whether your visa is granted, delayed, or denied.',
  },
  {
    question: 'How much do children pay for visa applications?',
    answer:
      'Most jurisdictions provide reduced fees or complete waivers for children. For example, Schengen visas are €45 for children aged 6–12 and completely free (€0) for children under 6 years old. UK and US visa fees are generally the same for all age categories.',
  },
  {
    question: 'How can using DummyTickets reduce total visa expenses?',
    answer:
      'Instead of purchasing non-refundable commercial flight tickets costing $800–$1,500 and non-refundable hotel stays prior to visa approval, you can secure an embassy-compliant flight reservation and hotel voucher for ₹0 to ₹399, protecting 100% of your travel investment.',
  },
];

export default function VisaCostCalculatorPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span>Consular & Biometric Fee Estimator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Global Visa Cost Calculator
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Estimate your exact visa fees before applying. Calculates government statutory fees, VFS/BLS service fees, biometric charges, and child discounts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official 2026 Statutory Rates</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Coins className="w-4 h-4 text-blue-300" />
              <span>All Major Currencies</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Free Tool</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <VisaCostCalculatorInteractive />
      </section>

      {/* Educational Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <Receipt className="w-3.5 h-3.5" />
              <span>Fee Breakdown Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Where Your Visa Application Fees Go
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Applying for an international visa entails multiple distinct financial components:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Government Consular Fee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory statutory charge set by national immigration authorities for background checks and consular adjudication.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">VAC Service Charge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operating fee paid to visa facilitation centers (VFS, BLS, TLS) for appointment scheduling, biometric scanning, and document handling.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Zero-Risk Travel Proof</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Using temporary flight and hotel itineraries protects you from paying non-refundable commercial airfares upfront.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={VISA_COST_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Save Hundreds on Your Visa Application"
          subtitle="Generate an embassy-compliant flight itinerary and hotel voucher instead of purchasing expensive non-refundable tickets."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
