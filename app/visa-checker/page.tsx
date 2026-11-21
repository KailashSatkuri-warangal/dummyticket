import type { Metadata } from 'next';
import { VisaCheckerInteractive } from '@/components/tools/VisaCheckerInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSearch,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Visa Requirement Checker | DummyTickets',
  description:
    'Check visa requirements, embassy processing timelines, transit rules, and passport validity criteria between 195+ countries.',
};

const VISA_CHECKER_FAQS = [
  {
    question: 'How do visa requirements differ based on my passport nationality?',
    answer:
      'Visa policies are bilateral agreements between sovereign nations. Depending on your citizenship passport and destination country, you may enjoy visa-free entry (e.g. 90 days), be eligible for an Electronic Travel Authorization (eTA / eVisa) applied online, or be required to apply for a standard consular visa with in-person biometric appointment at an embassy or visa application center.',
  },
  {
    question: 'What is the standard 6-month passport validity rule?',
    answer:
      'Most countries worldwide (including Thailand, Singapore, UAE, Turkey, Indonesia, and all Schengen countries) strictly require your passport to be valid for at least 3 to 6 months beyond your scheduled departure date from their territory. If your passport expires sooner, airlines will refuse boarding at the check-in counter.',
  },
  {
    question: 'Do I need a transit visa for flight layovers?',
    answer:
      'An Airport Transit Visa (ATV) or standard transit visa may be required depending on your nationality and the transit hub airport (e.g. Frankfurt, London Heathrow, Doha, Dubai). If you do not leave the international transit area and your layover is under 12 to 24 hours, many nationalities do not need a visa, but strict exceptions apply (e.g. UK Direct Airside Transit Visa requirements). Always check transit rules before booking multi-leg flights.',
  },
  {
    question: 'How can a dummy flight reservation help with my visa application?',
    answer:
      'Consulates require documented proof of your entry and exit dates before issuing a visa. A temporary flight reservation provides an embassy-compliant itinerary showing your complete flight schedule with booking reference, eliminating financial risk if your visa is delayed or denied.',
  },
];

export default function VisaCheckerPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>International Immigration & Border Policy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Global Visa Requirement Checker
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Check visa requirements between any two countries in seconds. Passport validity rules, eVisa availability, consular fees, and required documents.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>195+ Countries</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Real-Time Policy Verification</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Official Consular Guidelines</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visa Checker Tool */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <VisaCheckerInteractive />
      </section>

      {/* Educational Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileSearch className="w-3.5 h-3.5" />
              <span>Entry Classification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Understanding International Visa Categories
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Before planning international travel, understand which legal entry channel applies to your passport:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Visa-Free (Exemption)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter without prior application for a specified limit (e.g. 30, 90, or 180 days). Must still hold a return or onward ticket and passport with 6 months validity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">eVisa / eTA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applied online prior to travel. Approved electronically and linked to your passport barcode without requiring an embassy appointment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Consular Sticker Visa</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Requires physical submission of passport, biometric fingerprinting, flight itinerary, hotel booking, bank records, and visa fee at an embassy or VAC.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={VISA_CHECKER_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Need Proof of Onward Travel for Your Trip?"
          subtitle="Airlines require a return or onward ticket before boarding. Generate an embassy-compliant flight reservation in 30 seconds."
          primaryButtonText="Create Flight Itinerary"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
