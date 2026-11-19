'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plane,
  Building,
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/data/visa-rules';

export function VisaRiskCheckInteractive() {
  const [passportIso, setPassportIso] = useState('IN');
  const [destIso, setDestIso] = useState('FR');
  const [employment, setEmployment] = useState<'salaried' | 'business' | 'student' | 'freelance'>('salaried');
  const [travelHistory, setTravelHistory] = useState<'extensive' | 'moderate' | 'first_time'>('moderate');
  const [hasFlightProof, setHasFlightProof] = useState(false);
  const [hasHotelProof, setHasHotelProof] = useState(false);
  const [hasBankFunds, setHasBankFunds] = useState(true);

  // Compute calculated score
  let baseScore = 60;
  if (employment === 'salaried' || employment === 'business') baseScore += 12;
  if (travelHistory === 'extensive') baseScore += 16;
  else if (travelHistory === 'moderate') baseScore += 8;

  if (hasBankFunds) baseScore += 10;
  if (hasFlightProof) baseScore += 10;
  if (hasHotelProof) baseScore += 8;

  // Cap at 98%
  const score = Math.min(98, Math.max(35, baseScore));

  const getRiskTier = (s: number) => {
    if (s >= 85) return { label: 'Low Rejection Risk (High Approval Odds)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (s >= 65) return { label: 'Moderate Risk (Strengthen Ties & Proofs)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'Elevated Risk (Essential Documents Missing)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const riskTier = getRiskTier(score);

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            2026 Visa Approval Odds Evaluator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Visa Rejection Risk Checker
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Calculate your visa approval probability and discover actionable steps to prevent rejection.
          </p>
        </div>

        {/* Assessment Questionnaire Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-blue-100 mb-8">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Passport & Target Embassy:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={passportIso}
                onChange={(e) => setPassportIso(e.target.value)}
                className="h-11 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <select
                value={destIso}
                onChange={(e) => setDestIso(e.target.value)}
                className="h-11 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Employment Status:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'salaried', label: 'Salaried' },
                { id: 'business', label: 'Business' },
                { id: 'student', label: 'Student' },
                { id: 'freelance', label: 'Freelancer' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEmployment(item.id as any)}
                  className={`h-11 rounded-xl text-xs font-bold transition-all ${
                    employment === item.id
                      ? 'bg-[#0062e0] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travel History */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Previous International Travel:
            </label>
            <select
              value={travelHistory}
              onChange={(e) => setTravelHistory(e.target.value as any)}
              className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
            >
              <option value="extensive">Extensive (3+ international trips, US/Schengen/UK visas)</option>
              <option value="moderate">Moderate (1-2 international trips to Asian or Middle Eastern countries)</option>
              <option value="first_time">First-time International Applicant (Fresh Passport)</option>
            </select>
          </div>

          {/* Documents Preparedness */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Documents Currently Prepared:
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={hasFlightProof}
                  onChange={(e) => setHasFlightProof(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Confirmed Flight Itinerary (Dummy Ticket with airline PNR)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={hasHotelProof}
                  onChange={(e) => setHasHotelProof(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Hotel Reservation Proof / Accommodation Voucher</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={hasBankFunds}
                  onChange={(e) => setHasBankFunds(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Bank Statement showing sufficient travel funds</span>
              </label>
            </div>
          </div>
        </div>

        {/* Real-time Dynamic Score Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 border border-blue-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-blue-100">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Overall Visa Approval Score
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-[#0062e0]">{score}%</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${riskTier.color}`}>
                  {riskTier.label}
                </span>
              </div>
            </div>

            {/* Gauge meter */}
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span>High Risk</span>
                <span>Low Risk</span>
              </div>
              <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Recommendations to Boost Odds */}
          <div className="pt-6">
            <div className="text-xs font-black uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0062e0]" /> Actionable Steps to Maximize Approval:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {!hasFlightProof ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-amber-900">
                      Missing Return Flight Proof (+10% Odds)
                    </div>
                    <div className="text-amber-700 mt-0.5">
                      Embassies reject applications lacking confirmed return tickets. Generate an embassy-accepted Dummy Ticket with live airline PNR.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-emerald-900">Flight Reservation Attached</div>
                    <div className="text-emerald-700 mt-0.5">Your itinerary demonstrates clear intent to return home.</div>
                  </div>
                </div>
              )}

              {!hasHotelProof ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-amber-900">
                      Missing Accommodation Voucher (+8% Odds)
                    </div>
                    <div className="text-amber-700 mt-0.5">
                      Consular officers require proof of daily lodging. Generate a verified hotel reservation.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-emerald-900">Accommodation Voucher Attached</div>
                    <div className="text-emerald-700 mt-0.5">Verified hotel stay establishes clear travel itinerary.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-medium text-gray-600">
                Prepare your documents in under 2 minutes without purchasing costly non-refundable airfares.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/#bookingForm"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0062e0] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition-all"
                >
                  <Plane className="w-4 h-4" />
                  <span>Generate Flight Proof (₹299)</span>
                </Link>

                <Link
                  href="/hotel-booking"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 px-5 py-3 rounded-xl font-bold text-sm hover:border-blue-300 transition-all"
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
