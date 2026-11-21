import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Send,
  Building,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Embassy Cover Letter Generator for Visa Applications | DummyTickets',
  description:
    'Generate a persuasive embassy cover letter for your visa application. Articulate your travel purpose, itinerary, financial stability, and ties to home country. Instant PDF download.',
};

const EMBASSY_LETTER_FAQS = [
  {
    question: 'What is an embassy cover letter and why is it important?',
    answer:
      'An embassy cover letter is a personal statement addressed directly to the Visa Consular Officer reviewing your application. It introduces who you are, the exact purpose and dates of your travel, how your trip is financed, and why you will unconditionally return to your home country before your visa expires. Consular officers frequently rely on the cover letter to understand your story before inspecting other documents.',
  },
  {
    question: 'What key elements must an embassy cover letter contain?',
    answer:
      'A consular-ready cover letter must contain: 1) Visa officer address and embassy details; 2) Subject line with passport number and visa category; 3) Clear purpose of trip (tourism, business, conference, family visit); 4) Complete day-by-day or key city itinerary; 5) Explanation of financial sponsorship and employment status; 6) Evidence of socio-economic ties to home country; 7) Comprehensive checklist of enclosed supporting documents.',
  },
  {
    question: 'Should I mention my dummy ticket or flight reservation in the letter?',
    answer:
      'Yes. In the itinerary or enclosures section, explicitly state: "Flight Reservation / Itinerary with booking code [Your PNR], reflecting entry on [Date] and departure on [Date]." This proves to the officer that you have prepared realistic travel arrangements in accordance with consular guidelines.',
  },
  {
    question: 'Can I edit the generated letter before printing or downloading?',
    answer:
      'Yes. Our interactive editor allows you to customize every paragraph, add your employer details, adjust travel dates, and format the document in real time before generating your final embassy-compliant PDF.',
  },
];

export default function EmbassyLetterPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span>Diplomatic Mission & Consular Submission Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Embassy Cover Letter Generator
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create an embassy-approved cover letter in minutes. Perfectly structured to present your travel purpose, financial stability, and ties to home country.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Embassy-Ready Format</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Private & Client-Side</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Generator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <DocumentGeneratorInteractive
          type="embassy-letter"
          title="Embassy Cover Letter Generator"
          subtitle="Generate an applicant cover letter addressed to the Visa Officer with travel purpose, ties to home country, and document checklist."
        />
      </section>

      {/* Guide & Best Practices */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Consular Best Practices</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Essential Rules for a Winning Visa Cover Letter
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Visa officers review dozens of applications every hour. A concise, well-structured cover letter provides an immediate overview of your application and eliminates doubts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">State Travel Purpose Clearly</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Be specific about why you are visiting. If tourism, name cities and attractions. If business, cite meetings or conferences.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Demonstrate Strong Ties</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Highlight steady employment, approved leave letters, family roots, or property ownership that assure your timely return.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Provide Document Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List every supporting file attached: flight reservation, hotel booking, bank statements, travel insurance, and passport copies.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={EMBASSY_LETTER_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Combine with Your Flight & Hotel Reservation"
          subtitle="Submit a complete, embassy-compliant application package with your cover letter, flight itinerary, and hotel booking voucher."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
