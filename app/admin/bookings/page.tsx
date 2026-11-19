import React from 'react';
import Link from 'next/link';
import { listAllBookings } from '@/lib/booking/store';
import { formatInr } from '@/lib/config/brand';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';
import { Ticket, Download, Mail, Phone, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await listAllBookings();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-brand-600" />
            Bookings, Customer Details & Fulfillment
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review customer contact details, passenger itineraries, PNR codes, and manage PDF documents.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Total Bookings: <span className="text-navy-900 font-extrabold">{bookings.length}</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No bookings recorded yet</p>
          <p className="mt-1 text-slate-500">
            Bookings created by travelers will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-3">Booking Ref / PNR</th>
                <th className="px-3.5 py-3">Customer & Passengers</th>
                <th className="px-3.5 py-3">Route & Date</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3">Amount</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => {
                const primaryPax = b.passengers[0];
                const paxName = primaryPax
                  ? `${primaryPax.firstName} ${primaryPax.lastName}`
                  : 'Traveler';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-3.5 font-mono">
                      <Link
                        href={`/booking/${b.bookingReference}`}
                        className="font-black text-brand-600 hover:text-brand-800 flex items-center gap-1"
                        target="_blank"
                      >
                        {b.bookingReference}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                        PNR: <span className="text-navy-900 font-mono">{b.airlinePnr ?? 'Instant'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-navy-900 text-sm">{paxName}</div>
                      {b.passengers.length > 1 && (
                        <div className="text-[10px] text-brand-600 font-semibold">
                          +{b.passengers.length - 1} additional traveler(s)
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-1">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{b.contactEmail || '—'}</span>
                      </div>
                      {b.contactPhone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{b.contactPhone}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-3.5 py-3.5">
                      <div className="font-extrabold text-navy-900 text-sm">
                        {b.originIata} ✈ {b.destinationIata}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Dep: {b.departureDate}
                      </div>
                      {b.returnDate && (
                        <div className="text-[11px] text-slate-500 font-medium">
                          Ret: {b.returnDate}
                        </div>
                      )}
                    </td>

                    <td className="px-3.5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.paymentStatus === 'captured'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                      <div className="text-[10px] text-slate-500 font-semibold mt-1 uppercase">
                        Ticket: {b.ticketStatus}
                      </div>
                    </td>

                    <td className="px-3.5 py-3.5 font-extrabold text-navy-900 text-sm">
                      {formatInr(b.totalAmount)}
                    </td>

                    <td className="px-3.5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                      <a
                        href={`/api/tickets/${b.bookingReference}/pdf`}
                        download
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors"
                        title="Download PDF Itinerary"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                      <AdminActionTrigger
                        label="Resend"
                        variant="secondary"
                        payload={{
                          action: 'RESEND_BOOKING_EMAIL',
                          bookingReference: b.bookingReference,
                        }}
                      />
                      <AdminActionTrigger
                        label="Ticketed"
                        variant="warning"
                        payload={{
                          action: 'MARK_BOOKING_TICKETED',
                          bookingReference: b.bookingReference,
                          providerBookingRef: b.providerBookingRef,
                          airlinePnr: b.airlinePnr,
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
