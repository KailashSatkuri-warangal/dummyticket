import React from 'react';
import Link from 'next/link';
import { listUniqueBookings } from '@/lib/booking/store';
import { Download, ExternalLink, ShieldAlert } from 'lucide-react';

export default function AccountTicketsPage() {
  const bookings = listUniqueBookings();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Generated Sample Tickets & PDF Itineraries
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Download A4 PDF documents or inspect QR verification links. Sample documents are clearly labeled &ldquo;NOT VALID FOR TRAVEL&rdquo;.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">
            No sample tickets generated yet
          </p>
          <p className="mt-1 text-slate-500 mb-3">
            Book a flight and complete payment to download your signature boarding pass and receipt.
          </p>
          <Link
            href="/flights"
            className="inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
          >
            Search Available Flights
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-brand-700">
                    SAMPLE-{b.bookingReference}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    <ShieldAlert className="h-3 w-3" />
                    SAMPLE ITINERARY — NOT VALID FOR TRAVEL
                  </span>
                </div>
                <p className="text-xs font-semibold text-navy-900">
                  {b.originIata} → {b.destinationIata} · Departure: {b.departureDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/sample-ticket/${b.bookingReference}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-navy-900 hover:bg-slate-50"
                >
                  Preview <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`/api/tickets/${b.bookingReference}/pdf`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
