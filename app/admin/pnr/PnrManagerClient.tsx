'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  Edit3,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  User,
  Plane,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';
import type { BookingRecord } from '@/types';

export function PnrManagerClient({ initialBookings }: { initialBookings: BookingRecord[] }) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pnrFilter, setPnrFilter] = useState<'all' | 'has_pnr' | 'internal_only'>('all');
  const [activeModalBooking, setActiveModalBooking] = useState<BookingRecord | null>(null);

  // Modal edit fields
  const [airlinePnrInput, setAirlinePnrInput] = useState('');
  const [providerRefInput, setProviderRefInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      b.bookingReference.toLowerCase().includes(q) ||
      (b.airlinePnr && b.airlinePnr.toLowerCase().includes(q)) ||
      (b.providerBookingRef && b.providerBookingRef.toLowerCase().includes(q)) ||
      b.contactEmail.toLowerCase().includes(q) ||
      (b.contactPhone && b.contactPhone.toLowerCase().includes(q)) ||
      b.passengers.some((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      );

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    const matchesPnr =
      pnrFilter === 'all'
        ? true
        : pnrFilter === 'has_pnr'
        ? Boolean(b.airlinePnr)
        : !b.airlinePnr;

    return matchesQuery && matchesStatus && matchesPnr;
  });

  const totalBookings = bookings.length;
  const airlinePnrCount = bookings.filter((b) => Boolean(b.airlinePnr)).length;
  const onHoldCount = bookings.filter((b) => b.status === 'awaiting_payment' || b.status === 'confirmed').length;
  const ticketedCount = bookings.filter((b) => b.status === 'ticketed').length;

  function openEditModal(b: BookingRecord) {
    setActiveModalBooking(b);
    setAirlinePnrInput(b.airlinePnr || '');
    setProviderRefInput(b.providerBookingRef || '');
    setStatusInput(b.status);
    setAdminNotes('');
  }

  async function handleSavePnr(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModalBooking) return;
    setUpdating(true);
    setBannerMsg(null);

    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PNR_RECORD',
          bookingReference: activeModalBooking.bookingReference,
          airlinePnr: airlinePnrInput.trim().toUpperCase() || undefined,
          providerBookingRef: providerRefInput.trim() || undefined,
          status: statusInput,
          notes: adminNotes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update PNR record');
      }

      const data = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === data.booking.id ? data.booking : b))
      );

      setBannerMsg(`Booking reference ${activeModalBooking.bookingReference} updated successfully.`);
      setActiveModalBooking(null);
    } catch (err: any) {
      alert(err.message || 'Error updating PNR');
    } finally {
      setUpdating(false);
    }
  }

  function exportCsv() {
    const headers = [
      'Internal Reference',
      'Airline PNR',
      'Provider Reference',
      'Origin',
      'Destination',
      'Travel Date',
      'Passenger Names',
      'Contact Email',
      'Reservation Status',
      'Payment Status',
      'Total (INR)',
      'Created At',
    ];

    const rows = filtered.map((b) => [
      b.bookingReference,
      b.airlinePnr || 'None (Internal)',
      b.providerBookingRef || 'N/A',
      b.originIata,
      b.destinationIata,
      b.departureDate,
      b.passengers.map((p) => `${p.firstName} ${p.lastName}`).join('; '),
      b.contactEmail,
      b.status,
      b.paymentStatus,
      b.totalAmount,
      b.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dummyticket-pnr-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {bannerMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{bannerMsg}</span>
          <button onClick={() => setBannerMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{totalBookings}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Internal reservation references</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Verified Airline PNRs</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{airlinePnrCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Live GDS / provider confirmed</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Awaiting / On Hold</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{onHoldCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Temporary hold window active</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Ticketed Records</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{ticketedCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Issued e-ticket itinerary</p>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Reference, Airline PNR, traveler name, email..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">All Reservation Statuses</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="ticketed">Ticketed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={pnrFilter}
            onChange={(e) => setPnrFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">All Records</option>
            <option value="has_pnr">Airline PNR Issued Only</option>
            <option value="internal_only">Internal References Only</option>
          </select>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* PNR Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">Internal Ref (DummyTickets)</th>
                <th className="p-3.5">Airline PNR (Genuine)</th>
                <th className="p-3.5">Route & Dates</th>
                <th className="p-3.5">Lead Traveler</th>
                <th className="p-3.5">Reservation Status</th>
                <th className="p-3.5">Hold Expiry</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const primaryPax = b.passengers[0];
                const paxName = primaryPax ? `${primaryPax.firstName} ${primaryPax.lastName}` : 'Traveler';
                const hasAirlinePnr = Boolean(b.airlinePnr);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-black text-brand-700 text-sm">
                        {b.bookingReference}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Created: {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {hasAirlinePnr ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-black text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{b.airlinePnr}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Not Issued (Temporary Itinerary)
                        </span>
                      )}
                      {b.providerBookingRef && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Provider: {b.providerBookingRef}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-navy-900 flex items-center gap-1">
                        <Plane className="w-3 h-3 text-brand-600" />
                        <span>{b.originIata} → {b.destinationIata}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Depart: {b.departureDate}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-navy-900">{paxName}</div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{b.contactEmail}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.status === 'ticketed'
                            ? 'bg-purple-100 text-purple-800'
                            : b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'awaiting_payment'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {b.expiresAt ? new Date(b.expiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(b)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1"
                          title="Audit & Update PNR"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                        <a
                          href={`/api/tickets/${b.bookingReference}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-700 border border-blue-200"
                          title="Download Itinerary PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No PNR or reservation records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit PNR & Administrative Notes Modal */}
      {activeModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  Audit PNR: {activeModalBooking.bookingReference}
                </h2>
                <p className="text-[11px] text-slate-500">Route: {activeModalBooking.originIata} → {activeModalBooking.destinationIata}</p>
              </div>
              <button onClick={() => setActiveModalBooking(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePnr} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Compliance Rule:</strong> Never fabricate an airline PNR. Enter an airline PNR only when legitimately returned from the airline or CRS/GDS provider.
                </span>
              </div>

              <div>
                <label className="block mb-1">Airline-Issued PNR (Leave blank if unconfirmed hold)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={airlinePnrInput}
                  onChange={(e) => setAirlinePnrInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 6-character CRS PNR like W9X2KL"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-black text-brand-700 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Provider Booking Reference (optional)</label>
                <input
                  type="text"
                  value={providerRefInput}
                  onChange={(e) => setProviderRefInput(e.target.value)}
                  placeholder="e.g. 1A-98124019"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Reservation Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="awaiting_payment">Awaiting Payment (Hold)</option>
                  <option value="confirmed">Confirmed (Verified Reservation)</option>
                  <option value="ticketed">Ticketed (Issued)</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Administrative Notes (Internal Audit Log)</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified with airline system hold for VFS Delhi visa appointment."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalBooking(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black shadow-md shadow-brand-500/20"
                >
                  {updating ? 'Saving Audit...' : 'Save PNR Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
