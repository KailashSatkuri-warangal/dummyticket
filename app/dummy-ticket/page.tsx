import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { PnrFlightSearch } from '@/components/flights/PnrFlightSearch';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Plane,
  AlertTriangle,
  HelpCircle,
  Award,
  Globe,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dummy Ticket for Visa: What It Is & How It Works | DummyTickets',
  description:
    'Generate an official flight reservation PDF for visa applications across 195+ countries. Verifiable airline PNR, instant download, and embassy-compliant layout.',
};

const DUMMY_TICKET_FAQS = [
  {
    question: 'What is a dummy ticket for a visa application?',
    answer:
      'A dummy ticket is a flight reservation document with a booking reference (PNR) that you submit with a visa application — without paying the full cost of a non-refundable commercial airline ticket. It displays your complete travel itinerary (departure and arrival airports, flight numbers, dates, times, and passenger names) in the official airline ticket format accepted by embassies, consulates, and VFS/BLS visa application centers worldwide.',
  },
  {
    question: 'Is a dummy ticket legal for visa applications?',
    answer:
      'Yes, 100% legal. In fact, official visa guidelines published by Schengen consulates, the UK Home Office, the US Department of State (DS-160 instructions), and the Australian Department of Home Affairs explicitly recommend that applicants submit a flight reservation or travel itinerary rather than purchasing a non-refundable ticket prior to visa approval.',
  },
  {
    question: 'How does the free dummy ticket differ from Premium (₹399)?',
    answer:
      'Free Dummy Ticket (₹0): Delivers an immediate embassy-formatted PDF itinerary carrying an internal booking reference and 2D QR code. It never expires as a file and is ideal for embassy document bundles.\n\nPremium Ticket (₹399): Created through live provider inventory (Amadeus / Sabre GDS) with a verified 6-character airline PNR queryable directly on airline websites (e.g. Emirates, Qatar Airways, Lufthansa) for 24 to 72 hours, without DummyTickets watermarks.',
  },
  {
    question: 'How long does it take to receive the reservation?',
    answer:
      'Your itinerary PDF is generated in approximately 30 seconds immediately after submitting your flight details. You can download it directly in your browser and receive an email copy with a link to track or retrieve it at any time.',
  },
  {
    question: 'Do I need to create an account or provide payment to get a free ticket?',
    answer:
      'No. DummyTickets operates on a 100% guest-friendly architecture. You do not need to register, create a password, or provide credit card information to download a standard flight reservation.',
  },
  {
    question: 'Can I add multiple passengers to a single itinerary?',
    answer:
      'Yes. You can add adults, children, and infants to your itinerary. All passenger names will appear on the unified reservation document, exactly matching your passport information.',
  },
  {
    question: 'What happens if my visa appointment is postponed?',
    answer:
      'Because you only reserved an itinerary rather than purchasing full-fare tickets, you have no cancellation penalties or change fees. You can simply generate an updated itinerary with your new travel dates whenever needed.',
  },
];

export default function DummyTicketPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Flight Itinerary & Reservation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Dummy Ticket for Visa Application
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate an embassy-compliant flight reservation in 30 seconds. Avoid financial risk on non-refundable tickets before your visa is approved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Option</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>30-Second PDF Generation</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Globe className="w-4 h-4 text-blue-300" />
              <span>Accepted in 195+ Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Live Interactive Dummy Ticket Generator */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <MyJetGenerator />
      </section>

      {/* 2. Live PNR Search & Flight Status Verifier */}
      <section className="mt-12">
        <PnrFlightSearch />
      </section>

      {/* 3. Educational Guide & Embassy Standards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Comprehensive Traveler Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Is a Dummy Ticket and Why Do Embassies Require It?
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              When applying for a Schengen visa, UK standard visitor visa, US tourist visa (B1/B2), or other international travel permits, immigration authorities require proof of your travel plans. Specifically, they need to verify:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Entry & Exit Dates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirms your exact arrival and departure timeline to match the duration of your requested visa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Intended Flight Route</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrates that your itinerary is logical and aligns with the member state where you submitted your application.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Intent to Return</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides concrete evidence that you have travel arrangements to leave the destination before your visa expires.
              </p>
            </div>
          </div>

          {/* Warning / Advice Callout */}
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-sm text-blue-900 leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-[#0062e0]">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>Official Consular Advice: Do NOT Buy Real Tickets Before Approval</span>
            </div>
            Embassies explicitly instruct applicants: <em>&ldquo;Do not purchase confirmed flight tickets until your visa has been approved and issued.&rdquo;</em> A temporary flight reservation satisfies all consular proof-of-travel requirements with zero financial loss if processing is delayed.
          </div>
        </div>

        {/* 4. Interactive FAQ Section */}
        <FaqAccordion items={DUMMY_TICKET_FAQS} />

        {/* 5. High-Converting CTA Banner */}
        <CtaBanner />
      </section>
    </div>
  );
}
