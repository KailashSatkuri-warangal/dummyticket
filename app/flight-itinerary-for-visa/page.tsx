import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Plane,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flight Itinerary for Visa Application: What Embassies Check | DummyTickets',
  description:
    'Generate an official flight itinerary for your visa application without buying expensive flights. Real airline reservation format with verified booking reference.',
};

const FLIGHT_ITINERARY_FAQS = [
  {
    question: 'Is a flight itinerary the same as a flight reservation or dummy ticket?',
    answer:
      'Yes. In the travel and visa processing industry, the terms "flight itinerary for visa", "flight reservation", "provisional booking", and "dummy ticket" all refer to the same document: a planned flight schedule containing your route, dates, airline flight numbers, and booking reference (PNR).',
  },
  {
    question: 'Will the visa officer contact the airline to verify the flight?',
    answer:
      'In standard visa processing, consular officers verify that your travel dates correspond with your leave letter, bank funds, and hotel bookings. With our Premium (₹399) plan, an authentic GDS reservation hold is placed with the airline, allowing the PNR to be verified directly in the airline’s reservations system.',
  },
  {
    question: 'Can I use this itinerary for one-way or multi-city travel?',
    answer:
      'Yes. Our generator supports one-way journeys, round-trip journeys, and direct connecting flights across 6,000+ international airports.',
  },
];

export default function FlightItineraryPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Embassy Proof of Travel Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Flight Itinerary for Visa Application
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate a verifiable flight reservation document for visa filing. No ticket purchase required prior to consular approval.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            What Information Must a Visa Flight Itinerary Contain?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Visa officers look for specific data points when examining your itinerary:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Full Traveler Name</div>
                <div className="text-xs text-slate-600 mt-1">Must match your passport given name and surname exactly.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Valid Booking Reference (PNR)</div>
                <div className="text-xs text-slate-600 mt-1">6-character alphanumeric reference code generated for your reservation.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Flight Numbers & Airlines</div>
                <div className="text-xs text-slate-600 mt-1">Realistic commercial flight numbers (e.g. EK-501, LH-761, SQ-403).</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Airport IATA Codes & Timings</div>
                <div className="text-xs text-slate-600 mt-1">Standard 3-letter IATA codes with scheduled departure and arrival hours.</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={FLIGHT_ITINERARY_FAQS} title="Flight Itinerary FAQ" />

        {/* CTA */}
        <CtaBanner />
      </section>
    </div>
  );
}
