'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plane,
  Building,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/data/visa-rules';

interface VisaCostDetail {
  destName: string;
  destFlag: string;
  touristFeeINR: number;
  businessFeeINR: number;
  studentFeeINR: number;
  vfsFeeINR: number;
  processingDays: string;
  expressDays: string;
  currencyCode: string;
  originalCurrencyFee: string;
}

const VISA_COSTS: Record<string, VisaCostDetail> = {
  FR: {
    destName: 'France (Schengen)',
    destFlag: '🇫🇷',
    touristFeeINR: 8100, // €90 (Updated 2026 Schengen fee)
    businessFeeINR: 8100,
    studentFeeINR: 4500,
    vfsFeeINR: 2350,
    processingDays: '15 business days',
    expressDays: 'N/A (Schengen rule)',
    currencyCode: 'EUR',
    originalCurrencyFee: '€90',
  },
  DE: {
    destName: 'Germany (Schengen)',
    destFlag: '🇩🇪',
    touristFeeINR: 8100,
    businessFeeINR: 8100,
    studentFeeINR: 6700,
    vfsFeeINR: 2400,
    processingDays: '15 business days',
    expressDays: 'N/A (Schengen rule)',
    currencyCode: 'EUR',
    originalCurrencyFee: '€90',
  },
  US: {
    destName: 'United States (B1/B2)',
    destFlag: '🇺🇸',
    touristFeeINR: 15725, // $185
    businessFeeINR: 15725,
    studentFeeINR: 15725,
    vfsFeeINR: 0, // Included in MRV fee
    processingDays: 'Appointment wait time + 3-5 days',
    expressDays: 'Emergency appointment subject to criteria',
    currencyCode: 'USD',
    originalCurrencyFee: '$185',
  },
  GB: {
    destName: 'United Kingdom (Standard Visitor)',
    destFlag: '🇬🇧',
    touristFeeINR: 12500, // £115
    businessFeeINR: 12500,
    studentFeeINR: 52000,
    vfsFeeINR: 2800,
    processingDays: '3 weeks (15 working days)',
    expressDays: '5 working days (+£500 priority fee)',
    currencyCode: 'GBP',
    originalCurrencyFee: '£115',
  },
  CA: {
    destName: 'Canada (Visitor Visa V-1)',
    destFlag: '🇨🇦',
    touristFeeINR: 6200, // $100 CAD + $85 CAD biometrics = 11,500 INR
    businessFeeINR: 6200,
    studentFeeINR: 9300,
    vfsFeeINR: 5300, // Biometrics fee
    processingDays: '20 to 35 business days',
    expressDays: 'N/A',
    currencyCode: 'CAD',
    originalCurrencyFee: '$100 CAD',
  },
  AU: {
    destName: 'Australia (Visitor Subclass 600)',
    destFlag: '🇦🇺',
    touristFeeINR: 10800, // $190 AUD
    businessFeeINR: 10800,
    studentFeeINR: 38000,
    vfsFeeINR: 1500,
    processingDays: '15 to 25 business days',
    expressDays: '48 hours (+1,000 AUD fast track)',
    currencyCode: 'AUD',
    originalCurrencyFee: '$190 AUD',
  },
  AE: {
    destName: 'United Arab Emirates (Dubai 30 Days)',
    destFlag: '🇦🇪',
    touristFeeINR: 6500,
    businessFeeINR: 8500,
    studentFeeINR: 12000,
    vfsFeeINR: 0,
    processingDays: '2 to 3 working days',
    expressDays: '24 hours (+₹2,000)',
    currencyCode: 'AED',
    originalCurrencyFee: '350 AED',
  },
  TH: {
    destName: 'Thailand (Tourist / VoA)',
    destFlag: '🇹🇭',
    touristFeeINR: 0, // Currently free waiver for Indians/major passports, or ₹2,500 VoA
    businessFeeINR: 4500,
    studentFeeINR: 4500,
    vfsFeeINR: 500,
    processingDays: 'Instant at border or 3 days',
    expressDays: 'Instant',
    currencyCode: 'THB',
    originalCurrencyFee: 'Free (or 2,000 THB VoA)',
  },
  SG: {
    destName: 'Singapore (e-Visa)',
    destFlag: '🇸🇬',
    touristFeeINR: 1900, // 30 SGD
    businessFeeINR: 1900,
    studentFeeINR: 6000,
    vfsFeeINR: 1800, // Authorized agent service fee
    processingDays: '3 to 5 working days',
    expressDays: '2 working days',
    currencyCode: 'SGD',
    originalCurrencyFee: '30 SGD',
  },
  JP: {
    destName: 'Japan (Tourist Single Entry)',
    destFlag: '🇯🇵',
    touristFeeINR: 1800, // ~3,000 JPY (Free or heavily subsidized)
    businessFeeINR: 1800,
    studentFeeINR: 1800,
    vfsFeeINR: 650,
    processingDays: '5 to 7 working days',
    expressDays: 'N/A',
    currencyCode: 'JPY',
    originalCurrencyFee: '3,000 JPY',
  },
};

export function VisaCostCalculatorInteractive() {
  const [destCode, setDestCode] = useState('FR');
  const [visaType, setVisaType] = useState<'tourist' | 'business' | 'student'>('tourist');
  const [includeDummyTicket, setIncludeDummyTicket] = useState(true);
  const [includeHotelProof, setIncludeHotelProof] = useState(true);

  const cost = VISA_COSTS[destCode] || VISA_COSTS['FR'];

  const baseFee =
    visaType === 'tourist'
      ? cost.touristFeeINR
      : visaType === 'business'
      ? cost.businessFeeINR
      : cost.studentFeeINR;

  const dummyTicketFee = includeDummyTicket ? 299 : 0;
  const hotelProofFee = includeHotelProof ? 299 : 0;
  const totalCost = baseFee + cost.vfsFeeINR + dummyTicketFee + hotelProofFee;

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            2026 Embassy Fee Auditor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Visa Cost & Fee Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Accurate government embassy visa fees, VFS biometrics surcharges, and travel document requirements in Indian Rupees (₹).
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-blue-100 mb-8">
          {/* Destination */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Destination Country:
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {Object.entries(VISA_COSTS).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.destFlag} {item.destName}
                </option>
              ))}
            </select>
          </div>

          {/* Visa Type */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Visa Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tourist', label: 'Tourist' },
                { id: 'business', label: 'Business' },
                { id: 'student', label: 'Student' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setVisaType(t.id as any)}
                  className={`h-12 rounded-xl text-xs font-extrabold transition-all ${
                    visaType === t.id
                      ? 'bg-[#0062e0] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-50/60 via-white to-blue-50/40 border border-blue-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-blue-100 gap-4">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Cost Breakdown For
              </div>
              <div className="text-2xl font-black text-gray-900 flex items-center gap-2 mt-0.5">
                <span>{cost.destFlag}</span>
                <span>{cost.destName}</span>
                <span className="text-xs font-bold text-[#0062e0] bg-blue-100/80 px-2 py-0.5 rounded-md uppercase">
                  {visaType}
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-xs font-bold text-gray-400 uppercase">Estimated Total Cost</div>
              <div className="text-3xl font-black text-[#0062e0]">₹{totalCost.toLocaleString()}</div>
            </div>
          </div>

          {/* Line items table */}
          <div className="py-5 space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-semibold text-gray-700">
                Official Consular / Embassy Fee ({cost.originalCurrencyFee})
              </span>
              <span className="font-black text-gray-900">₹{baseFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-semibold text-gray-700">
                VFS / VAC Biometric Processing Surcharge
              </span>
              <span className="font-black text-gray-900">₹{cost.vfsFeeINR.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDummyTicket}
                  onChange={(e) => setIncludeDummyTicket(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-gray-700">
                  DummyTicket.com Verified Flight Reservation with Real Airline PNR
                </span>
              </label>
              <span className="font-black text-blue-600">
                {includeDummyTicket ? '₹299' : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHotelProof}
                  onChange={(e) => setIncludeHotelProof(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-gray-700">
                  Confirmed Hotel Booking Voucher for Visa Application
                </span>
              </label>
              <span className="font-black text-blue-600">
                {includeHotelProof ? '₹299' : '₹0'}
              </span>
            </div>
          </div>

          {/* Processing Timeline */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-blue-100 text-xs">
            <div>
              <div className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Standard Processing
              </div>
              <div className="text-gray-900 font-extrabold text-sm mt-0.5">{cost.processingDays}</div>
            </div>
            <div>
              <div className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Expedited / Fast Track
              </div>
              <div className="text-gray-900 font-extrabold text-sm mt-0.5">{cost.expressDays}</div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Never buy non-refundable tickets before visa issuance. Use our embassy-accepted Dummy Ticket.
            </div>

            <Link
              href="/#bookingForm"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0062e0] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              <Plane className="w-4 h-4" />
              <span>Generate Dummy Ticket (₹299)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
