'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Star,
  ChevronDown,
  ArrowRight,
  Plane,
  Sparkles,
  QrCode,
  Check,
} from 'lucide-react';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const FAQS = [
  {
    q: 'What is a temporary flight reservation?',
    a: 'A PDF itinerary with your route, travel dates, passenger names and a booking reference (PNR), created without buying a non-refundable ticket. Many embassies and consulates explicitly ask for this at the application stage to prevent financial loss if a visa is delayed or refused.',
  },
  {
    q: "Is it a booking in the airline's system?",
    a: 'With Free, it is a valid reservation layout document for your application file. With Premium (₹399), it is booked with a real, verifiable PNR directly in the airline GDS system (Amadeus/Sabre) and held for 24 to 72 hours.',
  },
  {
    q: 'How long is a temporary flight reservation valid?',
    a: 'Free: The document displays your selected travel dates and never expires. Premium: The live airline PNR remains active in the airline system for 24 to 72 hours, which is the standard airline reservation hold window.',
  },
  {
    q: 'How much does a verifiable flight reservation cost?',
    a: 'DummyTicket Premium costs ₹399 one-time for a real PNR in the airline system, valid 24–72 hours, with instant PDF download and an email copy. The standard free flight reservation costs ₹0.',
  },
  {
    q: 'Will the embassy accept a temporary flight reservation?',
    a: 'Yes! Consulates ask for proof of intended travel (itinerary), not confirmed tickets. In fact, official Schengen, UK, US, and Australian visa guidelines advise applicants NOT to buy full non-refundable tickets before receiving their visa approval.',
  },
];

const REVIEWS = [
  {
    name: 'Maria Santos',
    location: 'Philippines',
    visa: 'Schengen Visa (Spain)',
    text: 'Approved in 8 days! Used the flight reservation PDF without buying real tickets. Saved over $900 before getting our visa stamp.',
  },
  {
    name: 'Priya Sharma',
    location: 'India',
    visa: 'Schengen Visa (France)',
    text: 'I sat on my bedroom floor at midnight with my VFS appointment 12 hours away. DummyTicket delivered the exact PDF with PNR and QR code in 30 seconds. France visa approved!',
  },
  {
    name: 'Bilal Hassan',
    location: 'Pakistan',
    visa: 'UK Visitor Visa',
    text: 'Two adults, two kids, four separate reservations needed for VFS. The flight reservations were verified immediately by UKVI. Outstanding service.',
  },
  {
    name: 'Lakshmi Iyer',
    location: 'India',
    visa: 'Schengen Visa (Spain)',
    text: 'Got my passport back yesterday with the visa approved. First Schengen application and this was completely seamless.',
  },
];

export default function TemporaryFlightReservationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedSpot, setSelectedSpot] = useState<number>(1);

  return (
    <div className="bg-slate-50 min-h-screen text-gray-900 overflow-x-hidden w-full max-w-full">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0c1a30] via-[#102a54] to-[#0a182e] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Visa Travel Document • Verifiable PNR
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Temporary Flight Reservation{' '}
                <span className="text-blue-400 block mt-1">with Real, Verifiable PNR</span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed">
                Reserve your route, travel dates, and passenger names as an official PDF with booking
                reference — issued in 30 seconds. Buy your actual airline ticket only once your visa is
                approved.
              </p>

              {/* Rating + Trust */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-blue-200">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-white font-extrabold ml-1.5">4.8 / 5.0</span>
                </div>
                <span className="text-blue-400">•</span>
                <span>Trusted by 10,000+ applicants</span>
                <span className="text-blue-400">•</span>
                <span>Accepted by 195+ countries</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#bookingForm"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all group"
                >
                  <span>Create My Reservation Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Ticket Mockup Preview */}
            <div className="lg:col-span-5 relative flex justify-center perspective-container">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 text-gray-900 border border-blue-200/80 shadow-2xl shadow-blue-900/50 card-3d-elevate">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0062e0] to-[#1d4ed8] flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                      DT
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900">DUMMYTICKET AIRWAYS</div>
                      <div className="text-[10px] font-extrabold text-[#0062e0] tracking-wider uppercase">
                        Verifiable Flight Reservation
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      PNR Reference
                    </div>
                    <div className="font-mono text-base font-black text-[#0062e0] tracking-wider">
                      DT9LAX
                    </div>
                  </div>
                </div>

                <div className="py-6 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black font-mono text-gray-900 leading-none">DXB</div>
                    <div className="text-xs font-bold text-gray-600 mt-1">Dubai, UAE</div>
                    <div className="text-[10px] text-gray-400">14:25 Departure</div>
                  </div>
                  <div className="flex-1 px-4 text-center">
                    <div className="text-[10px] font-black text-[#0062e0] uppercase tracking-wider mb-1">
                      Direct • 7h 40m
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-full border-t-2 border-dashed border-blue-300"></div>
                      <div className="absolute bg-white px-1 text-blue-600">✈</div>
                    </div>
                    <div className="text-[9px] font-extrabold text-emerald-600 mt-1">
                      Confirmed Seat
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-[#0062e0] leading-none">AMS</div>
                    <div className="text-xs font-bold text-gray-600 mt-1">Amsterdam, NL</div>
                    <div className="text-[10px] text-gray-400">19:05 Arrival</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 grid grid-cols-4 gap-2 text-center border border-gray-100 mb-4">
                  <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">Passenger</div>
                    <div className="text-[10px] font-black text-gray-900 mt-0.5">JANE DOE</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">Flight</div>
                    <div className="text-[10px] font-black text-gray-900 mt-0.5">EK-147</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">Date</div>
                    <div className="text-[10px] font-black text-gray-900 mt-0.5">12 MAR</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase">Status</div>
                    <div className="text-[10px] font-black text-emerald-600 mt-0.5">VERIFIED</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                  <div className="flex items-center gap-1 h-5">
                    {[3, 1, 4, 2, 5, 2, 3, 1, 4, 2].map((w, i) => (
                      <div
                        key={i}
                        className="bg-gray-800 h-full rounded-sm"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-[#0062e0]">
                    <QrCode className="w-3.5 h-3.5" /> Scannable QR Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="bg-[#0062e0] text-white py-6 border-y border-blue-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Embassy Accepted</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black">
                <AnimatedCounter value={30} suffix="s" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Instant PDF Delivery</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black">
                <AnimatedCounter value={195} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Countries Supported</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black">
                <AnimatedCounter value="₹25,000+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Saved vs Real Flights</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE GENERATOR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50/30" id="bookingForm">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
            Generator
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Generate Your Temporary Flight Reservation
          </h2>
          <p className="text-base text-gray-600 mt-2">
            Enter your travel details and download your embassy-ready reservation PDF instantly
          </p>
        </div>
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* 4. FARES SECTION: FREE VS PREMIUM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
              Fares
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Free or Premium — Choose Your Reservation
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Both contain the complete itinerary required for visa submission. Premium includes a live
              PNR verifiable on airline websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-slate-50 border border-gray-200 rounded-3xl p-8 flex flex-col justify-between card-3d-elevate">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider mb-4">
                  Free Reservation
                </span>
                <div className="text-4xl font-black text-gray-900 mb-1">₹0</div>
                <div className="text-xs font-bold text-gray-500 mb-6">No credit card or login needed</div>

                <ul className="space-y-3.5 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Complete flight route, travel dates and airport codes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Unique 6-character booking reference code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Scannable QR code on document</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Up to 6 passengers included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant PDF download in 30 seconds</span>
                  </li>
                </ul>
              </div>

              <a
                href="#bookingForm"
                className="mt-8 w-full py-4 text-center rounded-xl bg-white border border-gray-300 text-gray-900 font-extrabold hover:bg-gray-100 transition-colors shadow-sm"
              >
                Select Free Reservation
              </a>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-blue-500/20 border border-blue-500/30 relative card-3d-elevate">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-[11px] font-black uppercase tracking-wider shadow-md">
                ★ Recommended for Visas
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-4 border border-blue-400/30">
                  Premium Verifiable PNR
                </span>
                <div className="text-4xl font-black text-white mb-1">₹399</div>
                <div className="text-xs font-bold text-blue-200/80 mb-6">One-time fee per reservation</div>

                <ul className="space-y-3.5 text-sm text-blue-100 font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-bold text-white">
                      Real, verifiable PNR active in the airline GDS system
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Verifiable directly on the official airline website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Held active for 24 to 72 hours for visa officer verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Real airline names and current flight numbers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>100% clean PDF with zero watermarks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Official copy dispatched to your email</span>
                  </li>
                </ul>
              </div>

              <a
                href="#bookingForm"
                className="mt-8 w-full py-4 text-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-extrabold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/40"
              >
                Select Premium (₹399)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Temporary Reservation vs Airline Hold vs Full Ticket
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Why thousands of travelers choose DummyTicket for their embassy visa submission
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-600">Feature</th>
                  <th className="py-4 px-6 font-black text-[#0062e0] bg-blue-50/50">
                    DummyTicket Reservation
                  </th>
                  <th className="py-4 px-6 font-bold text-gray-600">Direct Airline Hold</th>
                  <th className="py-4 px-6 font-bold text-gray-600">Refundable Flight Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-extrabold text-gray-900">Cost</td>
                  <td className="py-4 px-6 font-black text-emerald-600 bg-blue-50/30">Free or ₹399</td>
                  <td className="py-4 px-6 text-gray-600">$15 – $40 fee</td>
                  <td className="py-4 px-6 text-rose-600 font-bold">₹40,000 – ₹1,50,000+</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-extrabold text-gray-900">Hold Duration</td>
                  <td className="py-4 px-6 font-black text-gray-900 bg-blue-50/30">
                    Never expires (Free) / 24–72 hrs (Real PNR)
                  </td>
                  <td className="py-4 px-6 text-gray-600">Strictly 24–48 hours</td>
                  <td className="py-4 px-6 text-gray-600">Until cancelled</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-extrabold text-gray-900">Cancellation Risk</td>
                  <td className="py-4 px-6 font-black text-emerald-600 bg-blue-50/30">
                    Zero financial risk
                  </td>
                  <td className="py-4 px-6 text-gray-600">Hold fee non-refundable</td>
                  <td className="py-4 px-6 text-rose-600 font-bold">Hefty cancellation fees ($100–$300)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-extrabold text-gray-900">Embassy Suitability</td>
                  <td className="py-4 px-6 font-black text-emerald-600 bg-blue-50/30">
                    100% Embassy Compliant
                  </td>
                  <td className="py-4 px-6 text-gray-600">Expires before interview</td>
                  <td className="py-4 px-6 text-gray-600">Overkill & financial risk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. REAL REVIEWS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Verified Visa Applicant Experiences
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-gray-900 font-extrabold text-sm ml-2">4.8 / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-slate-50 p-6 rounded-3xl border border-gray-200 flex flex-col justify-between card-3d-elevate"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic mb-6">
                    &quot;{r.text}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200/80">
                  <div className="text-sm font-extrabold text-gray-900">{r.name}</div>
                  <div className="text-xs font-bold text-[#0062e0]">{r.visa}</div>
                  <div className="text-[10px] text-gray-400">{r.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Everything you need to know about temporary flight reservations for visas
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-extrabold text-base text-gray-900 flex items-center justify-between gap-4 hover:bg-gray-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === i ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
