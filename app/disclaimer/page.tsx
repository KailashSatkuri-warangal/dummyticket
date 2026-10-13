import React from 'react';
import type { Metadata } from 'next';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sample Itinerary & Platform Disclaimer',
  description:
    'Important legal disclosure regarding Sample Itineraries (Mode A) versus Confirmed Live Airline Reservations (Mode B).',
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm uppercase">
          <ShieldAlert className="h-5 w-5" />
          <span>Sample Itinerary & Aviation Compliance Disclaimer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Platform Operating Modes & Document Classification
        </h1>
        <p>
          <strong>1. Mode A (Demo / Sample Itinerary Mode):</strong> Sample itineraries generated in Demo Mode are prominently watermarked <code>SAMPLE ITINERARY — NOT VALID FOR TRAVEL</code>. They do not fabricate airline-issued ticket numbers, boarding passes, or live PNRs, and cannot be used to board any aircraft.
        </p>
        <p>
          <strong>2. Mode B (Authorized Live Provider Mode):</strong> A booking is marked as <code>ticketed</code> / <code>issued</code> only when connected to an authorized flight provider and confirmed with a valid carrier PNR and e-ticket number.
        </p>
      </div>
    </div>
  );
}
