import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  FileBadge,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa NOC Letter & Sponsorship Letter Generator | DummyTickets',
  description:
    'Generate an employer No Objection Certificate (NOC), leave approval letter, or personal sponsorship letter for your visa application. Instant PDF download.',
};

const VISA_LETTER_FAQS = [
  {
    question: 'What is an Employer NOC (No Objection Certificate) for a visa?',
    answer:
      'An employer NOC is a formal document issued by your workplace certifying that you are currently employed, stating your job title, date of hire, and monthly salary. Crucially, it confirms that your leave of absence has been officially approved for the specific dates of your trip and that your employer expects you to resume duties upon return. It is one of the strongest proofs of ties to your home country.',
  },
  {
    question: 'What should be included in a personal or family sponsorship letter?',
    answer:
      'If someone else (such as a parent or spouse) is financing your trip, consulates require a sponsorship declaration stating the sponsor&apos;s relationship to you, their commitment to cover all travel, boarding, lodging, and medical costs, supported by their recent bank statements and employment records.',
  },
  {
    question: 'Can I print this letter on corporate letterhead?',
    answer:
      'Yes. You can generate and download the completed letter as a PDF or copy the generated text onto your organization&apos;s official letterhead with corporate stamp and manager signature.',
  },
  {
    question: 'Is this document required for Schengen and UK visas?',
    answer:
      'Yes. Employed applicants submitting applications to Schengen consulates, UK Visas & Immigration (UKVI), US B1/B2 appointments, and Canadian visa offices routinely require an employment leave letter or NOC.',
  },
];

export default function VisaLetterPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Employer NOC & Sponsorship Document Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Employer NOC & Visa Letter Generator
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate an employer No Objection Certificate (NOC), leave sanction letter, or financial sponsorship letter. Formatted to meet global consular criteria.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>HR & Consular Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Free & Client-Side</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Generator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <DocumentGeneratorInteractive
          type="visa-letter"
          title="Employer NOC & Visa Letter Generator"
          subtitle="Generate an official Employer No Objection Certificate (NOC) or Financial Sponsorship Letter."
        />
      </section>

      {/* Guide & Rules */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileBadge className="w-3.5 h-3.5" />
              <span>Key Letter Components</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Visa Officers Look for in an Employer NOC
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Consulates examine NOC letters to confirm that the traveler has legitimate ongoing employment and a binding incentive to return to their career after the vacation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Company Credibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Include company registration, contact details, HR signatory name, and official company designation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Approved Leave Dates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exact start and end dates of authorized annual leave matching the dates on your flight reservation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Remuneration & Role</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear statement of current job title, tenure length, and monthly or annual remuneration.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={VISA_LETTER_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Combine with Your Verified Flight Itinerary"
          subtitle="Pair your employer NOC with a verifiable flight itinerary matching your approved leave schedule."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
