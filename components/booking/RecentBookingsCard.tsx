'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Copy,
  Check,
  Ticket,
  Smartphone,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import {
  getRecentBookings,
  removeRecentBooking,
  type SavedBookingItem,
} from '@/lib/booking/recent-storage';

export function RecentBookingsCard() {
  const [bookings, setBookings] = useState<SavedBookingItem[]>([]);
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    setBookings(getRecentBookings());

    // Listen to custom event or storage change
    const onStorage = () => setBookings(getRecentBookings());
    window.addEventListener('storage', onStorage);
    window.addEventListener('dt_booking_saved', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('dt_booking_saved', onStorage);
    };
  }, []);

  const handleCopy = (pnr: string) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  const handleRemove = (ref: string) => {
    removeRecentBooking(ref);
    setBookings(getRecentBookings());
  };

  if (bookings.length === 0) return null;

  return (
    <div className="mt-8 bg-white border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-lg shadow-blue-500/10">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#0062e0]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">
              Your Previously Generated Tickets
            </h3>
            <p className="text-[11px] text-gray-500">
              Saved automatically on this device • Instant re-download anytime
            </p>
          </div>
        </div>
        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-50 text-[#0062e0] border border-blue-200/60">
          {bookings.length} {bookings.length === 1 ? 'Ticket' : 'Tickets'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {bookings.map((b) => (
          <div
            key={b.bookingReference}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between card-3d-elevate"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                <span className="text-xs font-mono font-black text-[#0062e0]">
                  {b.bookingReference}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    PNR: <b className="text-gray-900 font-mono">{b.pnr || b.bookingReference}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(b.pnr || b.bookingReference)}
                    className="p-1 rounded hover:bg-white text-gray-500 hover:text-[#0062e0] transition-colors"
                    title="Copy PNR code"
                  >
                    {copiedPnr === (b.pnr || b.bookingReference) ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-black text-gray-900">
                  {b.origin || 'DEL'} ✈ {b.destination || 'LHR'}
                </div>
                {b.departureDate && (
                  <span className="text-xs font-semibold text-gray-500">
                    {b.departureDate}
                  </span>
                )}
              </div>

              {b.passengerName && (
                <div className="text-xs text-gray-600 font-medium mb-3">
                  Passenger: <b className="text-gray-900">{b.passengerName}</b>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 gap-2">
              <a
                href={b.pdfUrl || `/api/tickets/${b.bookingReference}/pdf`}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>

              <div className="flex items-center gap-2">
                <Link
                  href={`/booking/${b.bookingReference}`}
                  className="text-xs font-bold text-gray-600 hover:text-[#0062e0] inline-flex items-center gap-1"
                >
                  <span>Status</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemove(b.bookingReference)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove from device"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
