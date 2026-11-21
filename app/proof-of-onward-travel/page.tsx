'use client';

import React, { useState } from 'react';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Search,
  Globe,
  Plane,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

const COUNTRY_DATA = [
  { name: 'Thailand', requirement: 'Strictly Checked', checkedAt: 'Airline Check-In & BKK/DMK Immigration', notes: 'Airlines will deny boarding without return or onward ticket within 60 days.' },
  { name: 'Indonesia (Bali)', requirement: 'Strictly Checked', checkedAt: 'Airline Check-In & DPS Immigration', notes: 'Mandatory proof of exit within 30-day visa on arrival window.' },
  { name: 'Philippines', requirement: 'Strictly Checked', checkedAt: 'Gate Check & Manila (MNL) Border', notes: 'Must show ticket leaving Philippines within 30 days.' },
  { name: 'United States', requirement: 'Mandatory', checkedAt: 'ESTA / Carrier Check & CBP Primary', notes: 'ESTA travelers must hold return or onward ticket to non-contiguous territory.' },
  { name: 'United Kingdom', requirement: 'Frequently Checked', checkedAt: 'Border Force Heathrow/Gatwick', notes: 'Must demonstrate funds and scheduled departure date.' },
  { name: 'Costa Rica', requirement: 'Strictly Checked', checkedAt: 'Airline Check-in & SJO Border', notes: 'Exit bus or flight ticket required before boarding.' },
  { name: 'Colombia', requirement: 'Strictly Checked', checkedAt: 'Carrier Gate & BOG Immigration', notes: 'Return or onward flight ticket required for 90-day tourist entry.' },
  { name: 'Singapore', requirement: 'Frequently Checked', checkedAt: 'Airline Counter & Changi ICA', notes: 'Proof of onward travel required for short-term visitors.' },
  { name: 'New Zealand', requirement: 'Mandatory', checkedAt: 'NZeTA & Auckland/Christchurch Border', notes: 'Travelers on visitor visas must hold outbound flight tickets.' },
  { name: 'Schengen Area (29 States)', requirement: 'Mandatory for Visa', checkedAt: 'Consular Filing & First Port of Entry', notes: 'Round-trip flight reservation required under Schengen Visa Code.' },
  { name: 'Japan', requirement: 'Occasionally Checked', checkedAt: 'Airline Check-in & NRT/KIX Border', notes: 'Must prove intended stay length within 90-day visa-free limit.' },
  { name: 'Mexico', requirement: 'Frequently Checked', checkedAt: 'Cancun & Mexico City INM', notes: 'Immigration officers frequently request return flight confirmation.' },
];

const ONWARD_TRAVEL_FAQS = [
  {
    question: 'What constitutes valid proof of onward travel?',
    answer:
      'Valid proof of onward travel is a confirmed flight itinerary document showing your full name matching your passport, a 6-character booking reference (PNR), specific flight number, travel date, and destination outside the country you are entering.',
  },
  {
    question: 'Can I show a bus or train ticket as onward travel proof?',
    answer:
      'While some land border crossings accept international bus or ferry tickets (e.g. between Costa Rica and Panama), airlines operating commercial flights almost universally require a flight reservation before allowing you to board.',
  },
  {
    question: 'Is a DummyTickets reservation recognized by airport check-in systems?',
    answer:
      'Yes. Our reservations follow international IATA/GDS ticketing format with standard e-ticket and PNR codes that satisfy airline gate agents and immigration officers worldwide.',
  },
];

export default function ProofOfOnwardTravelPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = COUNTRY_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>195+ Countries Immigration Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Proof of Onward Travel Requirements
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Which countries ask for onward tickets at airport check-in or border immigration, and how to satisfy the requirement with a verified reservation.
          </p>
        </div>
      </section>

      {/* Generator Section */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* Searchable Country Directory */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Country Onward Travel Check Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time carrier liability and border check intensity by destination
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0062e0]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Requirement</th>
                  <th className="py-3 px-4">Checked Where</th>
                  <th className="py-3 px-4">Guideline / Enforcement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCountries.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#0062e0]">
                        {c.requirement}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{c.checkedAt}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={ONWARD_TRAVEL_FAQS} title="Onward Travel Questions & Answers" />

        {/* CTA */}
        <CtaBanner
          title="Traveling Soon? Get Your Onward Flight Itinerary"
          subtitle="Generate an embassy-compliant and airline-approved reservation PDF in 30 seconds."
        />
      </section>
    </div>
  );
}
