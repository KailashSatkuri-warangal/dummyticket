'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  AlertCircle,
  Plane,
  Building,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { COUNTRIES, getVisaRule, CountryVisaInfo } from '@/lib/data/visa-rules';

export function VisaCheckerInteractive() {
  const [passportIso, setPassportIso] = useState('IN');
  const [destIso, setDestIso] = useState('FR');
  const [hasChecked, setHasChecked] = useState(true);
  const [passportSearch, setPassportSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'free' | 'evisa' | 'required'>('all');

  const passportCountry = COUNTRIES.find((c) => c.iso2 === passportIso) || COUNTRIES[0];
  const destCountry = COUNTRIES.find((c) => c.iso2 === destIso) || COUNTRIES[6]; // France
  const rule = getVisaRule(passportIso, destIso);

  const popularQuickPassports = ['IN', 'PH', 'NG', 'PK', 'ID', 'TR', 'BD', 'EG', 'US', 'GB'];

  const filteredPassports = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(passportSearch.toLowerCase())
  );

  const filteredDestinations = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(destSearch.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'visa_free':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'visa_on_arrival':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'evisa':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'visa_required':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* 3D Elevated Hero Card */}
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" />
            Official 2026 Database
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Visa Eligibility Checker
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Check real-time entry rules, required visa documents, and embassy guidelines for 199 countries.
          </p>
        </div>

        {/* Form Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-blue-100 mb-6">
          {/* 1. Passport Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              1. I hold a passport from:
            </label>
            <div className="relative">
              <select
                value={passportIso}
                onChange={(e) => setPassportIso(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                {passportCountry.flag}
              </span>
            </div>

            {/* Quick Passport Chips */}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Quick:</span>
              {popularQuickPassports.map((iso) => {
                const c = COUNTRIES.find((x) => x.iso2 === iso);
                if (!c) return null;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setPassportIso(iso)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      passportIso === iso
                        ? 'bg-[#0062e0] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Destination Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              2. I am traveling to (Destination):
            </label>
            <div className="relative">
              <select
                value={destIso}
                onChange={(e) => setDestIso(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.flag} {c.name} ({c.continent})
                  </option>
                ))}
              </select>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                {destCountry.flag}
              </span>
            </div>

            {/* Quick Destination Suggestions */}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Popular:</span>
              {['FR', 'US', 'GB', 'AE', 'TH', 'SG', 'DE', 'AU'].map((iso) => {
                const c = COUNTRIES.find((x) => x.iso2 === iso);
                if (!c) return null;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setDestIso(iso)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      destIso === iso
                        ? 'bg-[#0062e0] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Eligibility Results Card */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 border border-blue-200/80 shadow-md">
            {/* Header: From -> To Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{passportCountry.flag}</span>
                <span className="text-gray-400 font-bold">➔</span>
                <span className="text-3xl">{destCountry.flag}</span>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Route Evaluation
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    {passportCountry.name} to {destCountry.name}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-2xl border text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 ${getStatusColor(
                  rule.status
                )}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                {rule.statusLabel}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-blue-100 text-center sm:text-left">
              <div className="p-4 bg-white rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                  <Clock className="w-4 h-4 text-blue-600" /> Allowed Duration
                </div>
                <div className="text-base font-black text-gray-900 mt-1">{rule.duration}</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Govt / Embassy Fee
                </div>
                <div className="text-base font-black text-gray-900 mt-1">{rule.costEstimate}</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                  <FileCheck className="w-4 h-4 text-indigo-600" /> Standard Processing
                </div>
                <div className="text-base font-black text-gray-900 mt-1">{rule.processingTime}</div>
              </div>
            </div>

            {/* Requirements & Notes */}
            <div className="py-6">
              <div className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                Mandatory Travel & Embassy Advisory:
              </div>
              <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                {rule.notes}
              </p>

              {/* Checklist */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Passport validity of at least 6 months required</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 font-bold text-blue-900">
                  <Plane className="w-4 h-4 text-[#0062e0] shrink-0" />
                  <span>Confirmed Return Flight Itinerary (Dummy Ticket) Mandatory</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                  <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Proof of Accommodation / Hotel Booking reservation</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sufficient funds for duration of intended stay</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-gray-500">Need flight proof for this visa?</div>
                <div className="text-sm font-black text-gray-900">
                  Instant Dummy Ticket PDF with live airline PNR • Only ₹299
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/#bookingForm"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0062e0] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition-all"
                >
                  <Plane className="w-4 h-4" />
                  <span>Generate Dummy Ticket</span>
                </Link>
                <Link
                  href="/hotel-booking"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-blue-400 text-gray-800 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Hotel Proof</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
