import type { Metadata } from 'next';
import { VisaRiskCheckInteractive } from '@/components/tools/VisaRiskCheckInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Application Approval Risk Checker | DummyTickets',
  description:
    'Evaluate your visa application risk factors, approval probability, financial sufficiency, and consular red flags before applying.',
};

const VISA_RISK_FAQS = [
  {
    question: 'What are the most common reasons for visa application rejection?',
    answer:
      'According to global consular refusal statistics (including Schengen Visa Code Article 32 guidelines), the top refusal grounds are: 1) Insufficient proof of financial means to sustain travel; 2) Inadequate justification for the purpose and conditions of the intended stay; 3) Unreliable or missing travel itinerary / proof of accommodation; 4) Inability to demonstrate strong socio-economic ties to your home country (employment, family, property) ensuring return; 5) Inconsistencies between application form entries and supporting documents.',
  },
  {
    question: 'How much money should I show in my bank account for a visa?',
    answer:
      'Consulates calculate minimum daily funds required per traveler. For Schengen countries, the benchmark ranges from €45 to €100 per day of stay (depending on whether accommodation is already prepaid or guaranteed). For example, a 15-day trip requires an active closing balance of at least €1,500 to €2,000, demonstrated through 3 to 6 months of steady, unmanipulated bank statements.',
  },
  {
    question: 'Can a previous visa refusal affect future applications?',
    answer:
      'Yes, previous visa refusals are recorded in shared immigration databases (such as the Schengen Visa Information System - VIS, and Five Eyes intelligence sharing). However, a prior refusal does not automatically mean future rejection. You must address the exact grounds of the previous refusal directly in your cover letter and provide strengthened supporting evidence.',
  },
  {
    question: 'How does an authentic flight reservation improve my approval odds?',
    answer:
      'A verifiable flight itinerary demonstrates to the visa officer that you have a planned, coherent entry and exit strategy with fixed dates. Providing a professional flight itinerary and matching hotel voucher eliminates ambiguity regarding your travel intent.',
  },
];

export default function VisaRiskCheckPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>Consular Adjudication & Approval Assessment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Visa Application Risk Checker
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Assess your approval probability before booking your embassy appointment. Identifies red flags, financial gaps, and document deficiencies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Consular Criteria Audit</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Confidential & Free</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant Risk Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Risk Checker Tool */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <VisaRiskCheckInteractive />
      </section>

      {/* Educational Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Consular Evaluation Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The 3 Pillars of Visa Approval
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Visa officers evaluate applications through three mandatory security and immigration criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Financial Solvency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consistent monthly salary credits and adequate daily funds covering all living expenses throughout your intended stay without public funds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Home Country Ties</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unbreakable domestic anchors: permanent employment contracts, active business registrations, enrolled university studies, or immediate dependent family.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Coordinated Itinerary</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Logically planned flight reservations, confirmed hotel bookings, and day-by-day itinerary with exact alignment across all dates.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={VISA_RISK_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Eliminate Travel Document Red Flags"
          subtitle="Generate an embassy-compliant flight itinerary and hotel voucher to solidify your visa application file."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
