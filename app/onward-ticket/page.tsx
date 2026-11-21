import type { Metadata } from 'next';
import Link from 'next/link';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Plane,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Globe,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Onward Ticket: Proof of Departure for Check-In and Immigration | DummyTickets',
  description:
    'Generate an onward ticket for airport check-in and border immigration. Verifiable airline reservation format accepted across 195+ countries.',
};

const ONWARD_TICKET_FAQS = [
  {
    question: 'Why do airlines ask for an onward ticket at the check-in gate?',
    answer:
      'Airlines are legally required by destination governments (under international carrier liability laws) to ensure passengers have proof of departure before boarding. If you enter on a one-way ticket or tourist visa without onward travel proof, airlines face heavy fines and must fly you back at their expense. Therefore, gate agents frequently deny boarding unless you show a valid return or onward ticket.',
  },
  {
    question: 'Which countries strictly check for onward travel proof?',
    answer:
      'Countries like Thailand, Indonesia (Bali), Philippines, United States, United Kingdom, Costa Rica, Colombia, New Zealand, and Schengen nations enforce onward travel rules at airline check-in desks and border immigration counters.',
  },
  {
    question: 'Can I show the onward ticket on my smartphone?',
    answer:
      'Yes. Our flight reservations are generated as standard PDF documents with high-resolution 2D QR codes and PNR booking references. You can present the PDF on your phone screen or print a paper copy.',
  },
  {
    question: 'How fast can I get an onward ticket if I am stuck at the airport gate?',
    answer:
      'Our generator operates instantly. In approximately 30 seconds after entering your passenger name and route, your PDF document is ready for download directly on your phone.',
  },
];

export default function OnwardTicketPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Plane className="w-3.5 h-3.5 text-blue-400" />
            <span>Airline Check-In & Immigration Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Onward Ticket: Proof of Departure
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate proof of onward travel for international flights. Avoid denied boarding at airport check-in counters in 30 seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#bookingForm"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0062e0] shadow-md hover:bg-slate-100 transition"
            >
              <span>Generate Free Onward Ticket</span>
            </a>
            <Link
              href="/proof-of-onward-travel"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition"
            >
              <span>Check 195+ Countries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Traveler Safety & Advice</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Travelers Use DummyTickets for Onward Travel
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Digital nomads, backpackers, and open-ended travelers often don&rsquo;t know their exact departure date or next destination when landing in a new country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xl font-black text-[#0062e0] mb-2">01</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Flexibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stay as long as you want without being locked into an inflexible flight ticket months in advance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xl font-black text-[#0062e0] mb-2">02</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Financial Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avoid paying expensive last-minute change or cancellation penalties on commercial airline tickets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xl font-black text-[#0062e0] mb-2">03</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Guaranteed Boarding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Satisfy airline gate requirements and clear immigration without anxiety or boarding delays.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={ONWARD_TICKET_FAQS} title="Onward Ticket FAQ" />

        {/* CTA */}
        <CtaBanner
          title="Need Proof of Departure Right Now?"
          subtitle="Generate an onward travel flight itinerary with verified PNR code in 30 seconds."
        />
      </section>
    </div>
  );
}
