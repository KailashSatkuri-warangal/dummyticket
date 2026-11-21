'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plane,
  Sparkles,
  ChevronDown,
  Star,
  Download,
} from 'lucide-react';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { LiveFlightTrajectoryHero } from '@/components/flights/LiveFlightTrajectoryHero';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const FAQS = [
  {
    q: 'What is a dummy ticket and is it legal?',
    a: 'A dummy ticket (or dummy flight ticket) is a temporary flight reservation used for visa applications, proof of onward travel, and hotel bookings. It is legal and widely accepted by embassies across 195+ countries — in fact, most embassies explicitly advise applicants not to purchase confirmed tickets before visa approval. It is a professional flight reservation document.',
  },
  {
    q: 'Can I use a dummy ticket for my visa application?',
    a: "Yes. Dummy tickets are specifically designed for visa applications. Most embassies — Schengen, UK, USA, Canada, Australia, India and more — accept a flight itinerary as proof of travel. Always check your specific embassy's requirements.",
  },
  {
    q: 'Can I get a dummy ticket for free?',
    a: 'Yes! DummyTicket generates free dummy tickets instantly with a valid booking reference (PNR), QR code, and professional airline format. No credit card or account needed. Your ticket is ready in 30 seconds as a downloadable PDF — instant proof of onward travel accepted by embassies and consulates in 195+ countries.',
  },
  {
    q: 'Does the ticket include a PNR/booking reference?',
    a: 'Yes. Every dummy ticket from DummyTicket includes a unique 6-character PNR (Passenger Name Record) and booking reference number, a scannable QR code, real airline names and flight numbers, departure and arrival times, and a professionally formatted layout.',
  },
  {
    q: 'Can I generate a round-trip dummy ticket?',
    a: 'Yes. You can generate both one-way and round-trip dummy tickets. Simply select the Round Trip option in the form and enter your return date. Round-trip flight itineraries are recommended for Schengen visa applications and most embassy submissions.',
  },
  {
    q: 'Do airlines check if your ticket is real?',
    a: 'Some airlines and immigration officers ask for proof of onward travel before allowing entry — particularly for destinations like Thailand, the Philippines, and Indonesia. At immigration, officers review your travel documents visually. A DummyTicket PDF clearly shows your onward route, dates, and booking reference, which meets this requirement.',
  },
  {
    q: 'Does VFS Global accept dummy tickets?',
    a: 'VFS Global is a processing centre, not the decision-maker. Whether a temporary flight reservation is accepted depends on the specific embassy policy. In practice, the vast majority of Schengen consulates that operate through VFS accept dummy tickets with valid PNR codes.',
  },
  {
    q: 'Can a dummy flight ticket be detected?',
    a: 'DummyTicket generates professional flight itineraries that include booking references (PNR codes), airline formatting, flight numbers, and QR codes. Embassy staff review these documents to verify your travel intentions. Our itineraries follow standard airline document formatting and are used by over 10,000 travelers worldwide.',
  },
  {
    q: 'Is a dummy ticket legal in the UAE?',
    a: 'Yes. Using a flight itinerary for visa applications is legal in the UAE and worldwide. VFS Global centers in Abu Dhabi and Dubai routinely accept flight itinerary documents. DummyTicket is used by thousands of UAE-based applicants for Schengen, US, UK, and other visa types.',
  },
  {
    q: 'How fast can I get a dummy ticket?',
    a: 'With DummyTicket, about 30 seconds. Enter your airports, pick a date, and your professional PDF with booking reference and QR code is ready for instant download. No account needed, no payment, no waiting for email delivery.',
  },
  {
    q: 'Can I use a dummy ticket at the airport?',
    a: 'No. A dummy ticket is designed exclusively for visa application purposes — to show embassies and consulates your intended travel plans. It should not be used for airport check-in, boarding, or passing through immigration at arrival. For those situations, you need a confirmed, paid flight reservation.',
  },
  {
    q: 'Can I download my dummy ticket as a PDF?',
    a: 'Yes. Every dummy ticket is delivered as a PDF that you can download straight away, save on your phone or print. You can upload it to an online visa application or bring a printout to your appointment.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'United States',
    visa: 'Schengen Visa (France)',
    text: 'Used this for my French Schengen visa appointment at VFS Washington. Downloaded in under 1 minute, printed it out, and the visa was approved in 5 days with zero questions!',
  },
  {
    name: 'Ahmed K.',
    location: 'United Arab Emirates',
    visa: 'UK Standard Visitor Visa',
    text: 'I was hesitant about dummy tickets before, but DummyTicket produced an itinerary with realistic flight times and QR codes that looked identical to an official booking. Saved me ₹65,000 on non-refundable flights.',
  },
  {
    name: 'Priya Sharma',
    location: 'India',
    visa: 'Schengen Visa (Germany)',
    text: 'First time applying for a European visa. The embassy explicitly stated not to buy flight tickets until approval. DummyTicket solved this in 30 seconds for my family of four.',
  },
  {
    name: 'Carlos R.',
    location: 'Brazil',
    visa: 'Japan Tourist Visa',
    text: 'Applied for Japan tourist visa in São Paulo. They asked for detailed flight reservations. Downloaded both inbound and outbound flights from DummyTicket. Visa granted in 4 working days!',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-[#0B1120] font-sans antialiased overflow-x-hidden">
      {/* 1. HERO SECTION - BLUE & WHITE THEME */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 bg-gradient-to-b from-[#f0f7ff] via-[#f8fbff] to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-100 text-[#0062e0] text-[11px] sm:text-xs font-black uppercase tracking-wider border border-blue-200 text-center max-w-full">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0062e0] shrink-0" />
                <span>100% Free • No Credit Card • No Login Required</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900">
                Free Dummy Ticket PDF Generator{' '}
                <em className="text-[#0062e0] not-italic block mt-1">Real PNR in 30 Seconds</em>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Generate a professional flight itinerary PDF in 30 seconds. With booking reference,
                QR code, and airline format — accepted by 195+ countries, embassies, and immigration
                authorities worldwide.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#bookingForm"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white font-extrabold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all group"
                >
                  <span>Generate Free Ticket Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust Checkmarks */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Instant PDF download</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real QR code included</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>No login needed</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>195+ countries</span>
                </div>
              </div>
            </div>

            {/* Right Ticket Mockup with 3D Perspective Tilt & Sheen */}
            <div className="lg:col-span-5 relative flex justify-center perspective-container">
              <a
                href="#bookingForm"
                className="w-full max-w-md block card-3d-elevate transition-all duration-300"
              >
                {/* Floating FREE PDF Badge */}
                <div className="absolute -top-4 -right-2 z-20 flex items-center shadow-xl shadow-blue-500/30 bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white px-4 py-2 rounded-full font-black text-xs tracking-wider animate-pulse badge-3d">
                  <span>FREE PDF</span>
                </div>

                {/* Ticket Card in Crisp White & Blue with 3D Elevation */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-blue-900/15 border border-blue-200/90 relative overflow-hidden ticket-3d-card sheen-3d">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="text-xs font-black uppercase tracking-wider text-[#0062e0]">
                      DUMMYTICKET AIRWAYS
                    </div>
                    <div className="text-xs font-bold tracking-widest text-gray-400">
                      PNR: <span className="text-gray-900 font-mono">DT7X42K</span>
                    </div>
                  </div>

                  {/* Flight Route - HYD to LAX */}
                  <div className="py-6 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black text-gray-900 font-mono">HYD</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-medium">Hyderabad</div>
                    </div>
                    <div className="flex-1 px-4 text-center">
                      <div className="text-[11px] font-bold text-[#0062e0] uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Direct • ₹299
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="w-full border-t-2 border-dashed border-blue-400"></div>
                        <div className="absolute animate-pulse">
                          <Plane className="w-4 h-4 text-[#0062e0] bg-white px-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-gray-900 font-mono text-blue-600">LAX</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-medium">Los Angeles</div>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100 bg-blue-50/40 rounded-xl px-4 text-center">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Date</div>
                      <div className="text-xs font-black text-gray-900">21 NOV</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Depart</div>
                      <div className="text-xs font-black text-gray-900">09:45</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Arrive</div>
                      <div className="text-xs font-black text-gray-900">05:20+1</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Flight</div>
                      <div className="text-xs font-black text-gray-900">DT 472</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Seat</div>
                      <div className="text-xs font-black text-gray-900">24C</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Class</div>
                      <div className="text-xs font-black text-gray-900">Y</div>
                    </div>
                  </div>

                  {/* Barcode Mock */}
                  <div className="mt-4 flex items-center justify-between h-7 opacity-60">
                    <div className="flex gap-1 h-full w-full justify-between items-center px-2">
                      {[3, 1, 4, 2, 3, 5, 2, 4, 3, 2, 5, 3, 2, 4, 2, 3, 5, 2, 3, 4, 2, 3, 2, 4, 3, 5, 2, 3, 4].map(
                        (w, i) => (
                          <div
                            key={i}
                            className="bg-gray-800 h-full rounded-[1px]"
                            style={{ width: `${w}px` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR - VIBRANT BLUE */}
      <div className="bg-[#0062e0] text-white py-8 border-y border-blue-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Free Forever</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                <AnimatedCounter value={30} suffix="s" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Generation Time</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                <AnimatedCounter value={195} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Countries Covered</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                <AnimatedCounter value="6,000+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1">Airports Worldwide</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOOKING FORM GENERATOR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50/30" id="bookingForm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              Generator
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Generate Your Free Dummy Ticket
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Fill in your details and download your PDF instantly — no login or signup needed
            </p>
          </div>
        </div>

        <MyJetGenerator />
      </section>

      {/* 4. 3 STEPS: HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider">
                Simple Process
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Get Your Dummy Ticket in 3 Steps
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                The fastest way to get proof of return travel for your visa application without login.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  step: '01',
                  title: 'Enter Your Flight Route',
                  desc: 'Choose your departure and arrival airports from our database of 6,000+ airports worldwide. Set your travel dates — one-way or round-trip. Add up to 6 passengers.',
                },
                {
                  step: '02',
                  title: 'We Generate Your Itinerary',
                  desc: 'In 30 seconds, we create a professional flight itinerary PDF with a real booking reference (PNR), flight number, passenger details, and QR code.',
                },
                {
                  step: '03',
                  title: 'Download PDF & Submit',
                  desc: 'Download your PDF instantly. Submit it to your visa application, at the embassy, or show it at immigration. Once your visa is approved, book your real flights.',
                },
              ].map((s, idx) => (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    activeStep === idx
                      ? 'border-[#0062e0] bg-blue-50/40 shadow-lg shadow-blue-500/5'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xl font-black text-[#0062e0] font-mono">{s.step}</span>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-gray-900">{s.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT IS A DUMMY TICKET */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0f7ff] border-y border-blue-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            What is a Dummy Ticket for Visa Applications?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            A <strong className="text-[#0062e0]">dummy ticket</strong> — also known as a dummy flight ticket, flight itinerary, flight reservation, or proof of onward travel — is a temporary flight booking used to show travel plans without purchasing a confirmed ticket. It is widely accepted by embassies, consulates, and immigration officers worldwide.
          </p>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p>
              Most embassies — including <strong>Schengen countries</strong>, <strong>UK</strong>, <strong>USA</strong>, <strong>Canada</strong>, and <strong>India</strong> — officially state that applicants should NOT buy confirmed tickets before visa approval. A flight itinerary from DummyTicket meets all documentation requirements.
            </p>
            <p>
              Our free dummy ticket includes a <strong>unique booking reference (PNR)</strong>, passenger details, flight numbers, dates, and a <strong>QR code</strong> — everything embassies need to confirm your travel plans.
            </p>
            <p>
              DummyTicket generates your itinerary using real airline routes, IATA airport codes, and authentic flight number formats to ensure your document looks professional and meets embassy standards.
            </p>
          </div>
        </div>
      </section>

      {/* 6. EMBASSY QUOTES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              Official Guidance
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Embassies Advise: Do Not Buy Real Tickets First
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Official statements from embassies confirming flight reservations are the recommended proof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Norway */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
              <blockquote className="text-sm font-semibold text-gray-800 leading-relaxed italic mb-4">
                &quot;Confirmed booking (travel itinerary) of roundtrip air ticket with fixed travel dates of maximum 90 days. Do not buy the ticket until visa has been granted.&quot;
              </blockquote>
              <div className="pt-4 border-t border-gray-200/60 text-xs font-bold text-gray-600">
                🇳🇴 Norwegian Embassy — Schengen Visa Checklist
              </div>
            </div>

            {/* Spain */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
              <blockquote className="text-sm font-semibold text-gray-800 leading-relaxed italic mb-4">
                &quot;Two Way Airline Ticket Reservation (detailed itinerary) is acceptable. It is strongly recommended not to purchase the flight ticket before obtaining the visa.&quot;
              </blockquote>
              <div className="pt-4 border-t border-gray-200/60 text-xs font-bold text-gray-600">
                🇪🇸 Spanish Consulate — Schengen Requirements
              </div>
            </div>

            {/* India */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
              <blockquote className="text-sm font-semibold text-gray-800 leading-relaxed italic mb-4">
                &quot;No bookings or travel arrangements should be confirmed until a visa decision has been made.&quot;
              </blockquote>
              <div className="pt-4 border-t border-gray-200/60 text-xs font-bold text-gray-600">
                🇮🇳 Consulate General of India, San Francisco
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY DUMMYTICKET TIMELINE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0f7ff] border-t border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              Why DummyTicket
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              The Smart Way to Handle Visa Applications
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Save money, reduce risk, and get approved faster with our verified itinerary documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center card-3d-elevate">
              <div className="text-3xl font-black text-[#0062e0] mb-2">
                <AnimatedCounter value="₹25,000+" />
              </div>
              <div className="text-sm font-extrabold text-gray-900 mb-1">Average Savings</div>
              <div className="text-xs text-gray-500">
                Never risk thousands on non-refundable tickets before receiving your visa stamp.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center card-3d-elevate">
              <div className="text-3xl font-black text-[#0062e0] mb-2">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-sm font-extrabold text-gray-900 mb-1">Embassy Compliant</div>
              <div className="text-xs text-gray-500">
                Formatted according to official IATA airline and embassy visa standards.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center card-3d-elevate">
              <div className="text-3xl font-black text-[#0062e0] mb-2">
                <AnimatedCounter value={195} suffix="+" />
              </div>
              <div className="text-sm font-extrabold text-gray-900 mb-1">Countries Supported</div>
              <div className="text-xs text-gray-500">
                Schengen 29, USA, UK, Canada, Australia, Japan, and worldwide consulates.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center card-3d-elevate">
              <div className="text-3xl font-black text-[#0062e0] mb-2">
                <AnimatedCounter value={30} suffix="s" />
              </div>
              <div className="text-sm font-extrabold text-gray-900 mb-1">Instant Generation</div>
              <div className="text-xs text-gray-500">
                Generate and download your verified PDF in 30 seconds with 0 waiting time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON TABLE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              Honest Comparison
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              How DummyTicket Compares to Paid Alternatives
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              We believe in transparency. Here is how our free dummy ticket generator stacks up against paid competitors.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-blue-100 shadow-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-blue-100">
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-700">Feature</th>
                  <th className="py-4 px-6 font-black text-[#0062e0] bg-blue-50/70">DummyTicket</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">OnwardTicket</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">BestOnwardTicket</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">DummyFlights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">Price</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">₹299 (Free option)</td>
                  <td className="py-3.5 px-6 text-gray-500">₹1,399</td>
                  <td className="py-3.5 px-6 text-gray-500">₹1,199</td>
                  <td className="py-3.5 px-6 text-gray-500">₹1,299</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">Delivery Speed</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">~30 sec</td>
                  <td className="py-3.5 px-6 text-gray-500">~60 sec</td>
                  <td className="py-3.5 px-6 text-gray-500">~2 min</td>
                  <td className="py-3.5 px-6 text-gray-500">~5 min</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">QR Code Verification</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">✓ Included</td>
                  <td className="py-3.5 px-6 text-red-500 font-bold">✗</td>
                  <td className="py-3.5 px-6 text-red-500 font-bold">✗</td>
                  <td className="py-3.5 px-6 text-red-500 font-bold">✗</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">Hotel Reservation</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">✓ Free</td>
                  <td className="py-3.5 px-6 text-gray-500">₹899 extra</td>
                  <td className="py-3.5 px-6 text-red-500 font-bold">✗</td>
                  <td className="py-3.5 px-6 text-red-500 font-bold">✗</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">Valid PNR Code</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">✓ Yes</td>
                  <td className="py-3.5 px-6 text-blue-600 font-bold">✓ Yes</td>
                  <td className="py-3.5 px-6 text-blue-600 font-bold">✓ Yes</td>
                  <td className="py-3.5 px-6 text-blue-600 font-bold">✓ Yes</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-gray-900">Airports Worldwide</td>
                  <td className="py-3.5 px-6 font-black text-blue-600 bg-blue-50/40">6,000+</td>
                  <td className="py-3.5 px-6 text-gray-500">~2,000</td>
                  <td className="py-3.5 px-6 text-gray-500">~1,500</td>
                  <td className="py-3.5 px-6 text-gray-500">~1,200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. PROFESSIONAL VISA DOCUMENTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f244a] to-[#070e1c] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Need Professional Visa Documents?
            </h2>
            <p className="text-blue-200 mt-2 text-sm sm:text-base">
              Professional visa documents — embassy-ready, instant PDF delivery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
            {[
              {
                title: 'Visa Support Letter',
                desc: 'Formal letter addressed to embassy stating trip details, accommodation, and intent.',
                price: '₹299',
                href: '/visa-letter',
                badge: 'Financial & Trip Proof',
              },
              {
                title: 'Invitation Letter',
                desc: 'Official template for hosts inviting family, friends, or business associates.',
                price: '₹299',
                href: '/invitation-letter',
                badge: 'Host Sponsorship',
              },
              {
                title: 'Travel Itinerary',
                desc: 'Day-by-day sightseeing and city transit itinerary PDF meeting Schengen requirements.',
                price: '₹299',
                href: '/travel-itinerary',
                badge: 'Day-by-Day Schedule',
              },
              {
                title: 'Embassy Cover Letter',
                desc: 'Comprehensive statement of purpose and ties to home country for visa officers.',
                price: '₹299',
                href: '/embassy-letter',
                badge: 'Consular Statement',
              },
            ].map((doc) => (
              <Link
                key={doc.title}
                href={doc.href}
                className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-blue-400/50 p-6 rounded-2xl transition-all group flex flex-col justify-between card-3d-elevate shadow-lg"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-2.5 border border-blue-400/20">
                    {doc.badge}
                  </div>
                  <div className="text-lg font-black text-white group-hover:text-blue-300 transition-colors mb-2">
                    {doc.title}
                  </div>
                  <div className="text-xs text-blue-100/80 leading-relaxed mb-6">
                    {doc.desc}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-blue-300 uppercase font-bold">Embassy Ready</span>
                    <span className="text-base font-black text-white">{doc.price}</span>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#0062e0] transition-colors badge-3d">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VERIFIED CUSTOMER REVIEWS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              Customer Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Trusted by <AnimatedCounter value="10,000+" /> Travelers Worldwide
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-gray-900 font-extrabold text-sm ml-2">
                <AnimatedCounter value="4.8" decimals={1} /> / 5.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between card-3d-elevate"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6 italic">
                    &quot;{t.text}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm font-extrabold text-gray-900">{t.name}</div>
                  <div className="text-[11px] text-[#0062e0] font-bold">{t.visa}</div>
                  <div className="text-[10px] text-gray-400">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10.5 LIVE FLIGHT TRAJECTORY SIMULATION SHOWCASE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/40 via-white to-blue-50/30 border-t border-blue-100/80">
        <div className="max-w-5xl mx-auto">
          <LiveFlightTrajectoryHero />
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-extrabold text-base text-gray-900 flex items-center justify-between gap-4 hover:bg-gray-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0062e0] shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CTA BANNER - BLUE GRADIENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Generate Your Free Dummy Ticket?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Get your flight itinerary PDF in 30 seconds with real PNR and QR code. 100% free forever — no login required.
          </p>
          <div className="pt-2">
            <a
              href="#bookingForm"
              className="inline-flex items-center gap-2 bg-white text-[#0062e0] hover:bg-blue-50 px-8 py-4 rounded-xl font-black text-base shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Generate Ticket Now — Free</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
