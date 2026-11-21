import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Compass,
  FileCheck2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Itinerary Generator for Visa Applications | DummyTickets',
  description:
    'Generate a day-by-day travel itinerary PDF for your tourist or business visa application. Organized schedule of cities, activities, and hotel stays.',
};

const TRAVEL_ITINERARY_FAQS = [
  {
    question: 'What is a day-by-day travel itinerary for a visa application?',
    answer:
      'A travel itinerary is a structured schedule mapping out your intended trip day by day. It details which cities you will be in on specific dates, the activities or tourist sites you plan to visit, where you will sleep (hotel name and address), and how you will travel between cities (flights, trains, or car rentals).',
  },
  {
    question: 'How detailed does my itinerary need to be for a Schengen visa?',
    answer:
      'Consulates do not expect hourly schedules, but they require a realistic day-by-day overview. For example: "Day 1-3: Paris — Arrival at CDG, check-in at Hotel Marais, visit Louvre and Eiffel Tower. Day 4: High-speed TGV to Lyon, check-in at Hotel Bellecour." The itinerary must perfectly span the days between your flight arrival and flight departure.',
  },
  {
    question: 'Must my travel itinerary match my hotel bookings and flights?',
    answer:
      'Yes, absolutely. Any discrepancy between your flight dates, hotel reservation dates, and the travel itinerary can trigger a request for clarification or visa denial. DummyTickets tools ensure your dates remain fully synchronized across all documents.',
  },
  {
    question: 'Can I download the itinerary as an embassy-ready PDF?',
    answer:
      'Yes. Our interactive itinerary builder formats your daily entries into a clean, professional PDF with applicant details, passport number, and date headers ready for submission.',
  },
];

export default function TravelItineraryPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
            <span>Day-By-Day Visa Trip Scheduler</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Travel Itinerary Generator for Visa
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create a professional day-by-day travel plan PDF. Map your travel dates, destinations, activities, and accommodation into an embassy-compliant schedule.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Consular-Ready Format</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Free & No Account</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Generator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <DocumentGeneratorInteractive
          type="travel-itinerary"
          title="Day-by-Day Travel Itinerary Generator"
          subtitle="Build a comprehensive day-by-day trip plan showing entry date, cities visited, planned activities, and departure date."
        />
      </section>

      {/* Educational Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Itinerary Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How Consular Officers Evaluate Your Travel Schedule
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Visa officers look for logic, realistic travel pace, and strict synchronization between your travel itinerary and supporting hotel/flight vouchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Geographic Coherence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure route travel times are reasonable. Do not schedule consecutive days in cities thousands of kilometers apart without booked flights or trains.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Hotel Alignment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every overnight listed on your itinerary must correspond to a confirmed hotel booking reservation in that specific city.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Return Date Strictness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The final day of your schedule must culminate in travel to your departure airport for your flight back home.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={TRAVEL_ITINERARY_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Get Matching Flight & Hotel Reservations"
          subtitle="Ensure every day of your itinerary is backed by an embassy-compliant flight reservation and hotel voucher."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
