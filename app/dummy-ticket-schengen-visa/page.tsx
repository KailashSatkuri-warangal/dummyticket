import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  ShieldCheck,
  CheckCircle2,
  Globe,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flight Reservation for Schengen Visa Application 2026 | DummyTickets',
  description:
    'Generate an official round-trip flight reservation for Schengen visa applications across all 29 European member states. Accepted by VFS Global, TLScontact & BLS.',
};

const SCHENGEN_FAQS = [
  {
    question: 'Does the Schengen visa require a round-trip flight reservation?',
    answer:
      'Yes. Article 14 of the Schengen Visa Code requires proof of travel arrangements showing entry and exit from the Schengen territory. A round-trip flight reservation confirming your exit date is mandatory.',
  },
  {
    question: 'Which European embassies accept DummyTickets reservations?',
    answer:
      'All 29 Schengen member states accept our flight reservations, including France, Germany, Italy, Spain, Switzerland, Netherlands, Greece, Portugal, Austria, and Sweden. Submissions are routinely processed at VFS Global, TLScontact, and BLS International centers.',
  },
  {
    question: 'Which embassy should I submit my flight reservation to if visiting multiple countries?',
    answer:
      'According to Schengen rules, submit your application to the consulate of your main destination (where you spend the greatest number of nights). If spending equal time in multiple countries, apply at the consulate of your first port of entry.',
  },
  {
    question: 'How long before my VFS appointment should I generate the ticket?',
    answer:
      'We recommend generating your reservation 1 to 3 days before your VFS or embassy appointment so the document issue date is fresh and matches your bank statements and employment letter.',
  },
];

const SCHENGEN_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Iceland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania',
  'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland'
];

export default function SchengenVisaPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>29 Schengen Member States &middot; Article 14 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Flight Reservation for Schengen Visa
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Official round-trip flight itinerary with verifiable booking code. Satisfies proof of onward travel for tourist, business, and family visit Schengen visas.
          </p>
        </div>
      </section>

      {/* Generator Section */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Schengen Visa Code Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Official Flight Requirements for European Visas
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Consulates across the Schengen zone do not require paid flight tickets. Under Regulation (EC) No 810/2009 (Visa Code), visa officers evaluate intended entry and exit schedules to calculate visa validity.
            </p>
          </div>

          {/* Member States Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Accepted by Consulates of all 29 Schengen Countries:</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              {SCHENGEN_COUNTRIES.map((country) => (
                <span
                  key={country}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={SCHENGEN_FAQS} title="Schengen Visa Itinerary FAQ" />

        {/* CTA */}
        <CtaBanner
          title="Prepare Your Schengen Visa Itinerary in 30 Seconds"
          subtitle="Download an embassy-ready round-trip flight reservation PDF with valid PNR format."
        />
      </section>
    </div>
  );
}
