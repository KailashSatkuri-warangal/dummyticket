import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Booking & Sample Itinerary Rules',
  description:
    'Review the governing terms for flight searches, fare snapshots, sample itinerary documents, and live provider bookings.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Terms and Conditions
        </h1>
        <h2 className="text-sm font-bold text-navy-900">
          1. Separation of Sample Itineraries and Live Airline Tickets
        </h2>
        <p>
          When operating in Demo/Sample Mode (Mode A), the platform generates clearly marked sample itinerary documents labeled <strong>&ldquo;SAMPLE ITINERARY — NOT VALID FOR TRAVEL&rdquo;</strong>. Customers must not present sample itineraries for airline check-in or boarding.
        </p>
        <h2 className="text-sm font-bold text-navy-900">
          2. Server-Side Fare Calculation & Revalidation
        </h2>
        <p>
          All fares are calculated on the server and stored as time-limited Fare Snapshots. If a fare changes prior to payment order creation, the updated total is presented for explicit user acceptance.
        </p>
      </div>
    </div>
  );
}
