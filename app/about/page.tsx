import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Plane,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Globe2,
  Users,
  Building2,
  FileCheck2,
  Scale,
  HeartHandshake,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About DummyTickets – Flight Itinerary & Temporary Reservation Platform',
  description:
    'Learn about DummyTickets, the global leader in embassy-compliant temporary flight reservations, onward tickets, and hotel booking vouchers for international visa applications.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Plane className="w-3.5 h-3.5 text-blue-400" />
            <span>Empowering Global Travelers Since 2021</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            About DummyTickets
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            We provide fast, affordable, and embassy-compliant temporary flight reservations, onward tickets, and proof of accommodation for international travelers worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>195+ Countries Accepted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Guest Friendly</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant 30s Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0062e0]">195+</div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Countries Accepted</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0062e0]">120K+</div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Itineraries Generated</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0062e0]">99.4%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Embassy Acceptance</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0062e0]">0</div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Mandatory Accounts</div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Protecting Travelers from Unnecessary Financial Risk
          </h2>

          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Every year, millions of visa applicants lose thousands of dollars purchasing non-refundable airline tickets for visa interviews — only to have their applications delayed, rescheduled, or rejected.
          </p>

          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Consulates worldwide (including Schengen states, UK Visas & Immigration, and the US Department of State) explicitly advise travelers: <em>&ldquo;Do not purchase non-refundable flight tickets until your visa has been granted.&rdquo;</em> DummyTickets bridges this gap by providing verified, embassy-compliant flight reservations and hotel booking vouchers in under 30 seconds.
          </p>
        </div>

        {/* Core Principles */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center">
            Our Core Architecture & Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">100% Guest Checkout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe your time and privacy matter. No forced sign-ups, no password creation, and no mandatory customer accounts. Enter your flight details and get your document immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Full Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly distinguish between temporary flight itinerary reservations, GDS provider reservations, and issued commercial tickets. We never misrepresent temporary bookings as issued commercial tickets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Data Privacy & Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All passport details and personal identifying data are processed with banking-grade 256-bit SSL encryption. We never sell traveler information to third-party marketing brokers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <CtaBanner
          title="Ready to Create Your Flight Itinerary?"
          subtitle="Generate an embassy-compliant flight reservation and hotel voucher in 30 seconds. No account required."
          primaryButtonText="Create Flight Itinerary"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </div>
    </div>
  );
}
