'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Ticket,
  Search,
  Download,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  KeyRound,
  ChevronDown,
  ChevronUp,
  User,
  Filter,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';
import type { BookingRecord } from '@/types';

export function BookingManagerClient({
  initialBookings,
}: {
  initialBookings: BookingRecord[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit PNR Modal / State
  const [pnrEditRef, setPnrEditRef] = useState<string | null>(null);
  const [pnrInput, setPnrInput] = useState('');

  // Action status toast
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showToast = (message: string, ok = true) => {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'captured' && b.paymentStatus !== 'captured') return false;
        if (statusFilter === 'awaiting_payment' && b.status !== 'awaiting_payment') return false;
        if (statusFilter === 'cancelled' && b.status !== 'cancelled') return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const paxMatch = b.passengers.some(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q)
      );
      return (
        b.bookingReference.toLowerCase().includes(q) ||
        (b.airlinePnr && b.airlinePnr.toLowerCase().includes(q)) ||
        b.contactEmail.toLowerCase().includes(q) ||
        (b.contactPhone && b.contactPhone.includes(q)) ||
        b.originIata.toLowerCase().includes(q) ||
        b.destinationIata.toLowerCase().includes(q) ||
        paxMatch
      );
    });
  }, [bookings, search, statusFilter]);

  async function handleResendEmail(bookingReference: string) {
    setActionLoading(`email-${bookingReference}`);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESEND_BOOKING_EMAIL',
          bookingReference,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email');
      showToast(`Itinerary confirmation email dispatched for ${bookingReference}!`);
    } catch (err: any) {
      showToast(err.message || 'Email dispatch failed', false);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateStatus(bookingReference: string, newStatus: string) {
    setActionLoading(`status-${bookingReference}`);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_BOOKING_STATUS',
          bookingReference,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setBookings((prev) =>
        prev.map((b) => (b.bookingReference === bookingReference ? data.booking : b))
      );
      showToast(`Booking ${bookingReference} updated to ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', false);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSavePnr(bookingReference: string) {
    if (!pnrInput.trim()) {
      showToast('Please enter a valid PNR code', false);
      return;
    }
    setActionLoading(`pnr-${bookingReference}`);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PNR_RECORD',
          bookingReference,
          airlinePnr: pnrInput.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update PNR');

      setBookings((prev) =>
        prev.map((b) => (b.bookingReference === bookingReference ? data.booking : b))
      );
      setPnrEditRef(null);
      setPnrInput('');
      showToast(`PNR code updated for ${bookingReference}`);
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'PNR update failed', false);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 shadow-2xl text-xs font-bold transition-all ${
            toast.ok
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Metric Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>Real-Time Reservation Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Customer Bookings & Fulfillments
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track customer details, passenger manifests, airline PNR status, and manage PDF deliveries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              Total: <span className="font-black text-[#0062e0]">{bookings.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              Paid: <span className="font-black">{bookings.filter((b) => b.paymentStatus === 'captured').length}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking Ref (DT-...), PNR, Guest Email, Phone, Passenger Name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:border-[#0062e0] focus:ring-1 focus:ring-[#0062e0] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'captured', label: 'Paid / Captured' },
              { id: 'awaiting_payment', label: 'Awaiting Payment' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#0062e0] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-800">No matching bookings found</p>
          <p className="mt-1">Try clearing your search query or switching status filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const primaryPax = b.passengers[0];
            const paxName = primaryPax
              ? `${primaryPax.firstName} ${primaryPax.lastName}`
              : 'Traveler';
            const isExpanded = expandedId === b.id;

            return (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-blue-200 transition-all"
              >
                {/* Main Card Overview */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Ref & Route */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062e0] flex items-center justify-center font-black shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/booking/${b.bookingReference}`}
                          target="_blank"
                          className="font-mono font-black text-sm text-[#0062e0] hover:underline flex items-center gap-1"
                        >
                          {b.bookingReference}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            b.paymentStatus === 'captured'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.paymentStatus === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs font-black text-slate-900 mt-1 flex items-center gap-2">
                        <span>{b.originIata} ✈ {b.destinationIata}</span>
                        <span className="text-slate-400 font-normal">·</span>
                        <span className="text-slate-600 font-medium">{b.departureDate}</span>
                        {b.returnDate && (
                          <span className="text-slate-600 font-medium">({b.returnDate})</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="font-bold text-slate-800">{paxName}</span>
                        {b.passengers.length > 1 && (
                          <span className="text-[#0062e0] font-bold">
                            +{b.passengers.length - 1} more
                          </span>
                        )}
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {b.contactEmail || '—'}
                        </span>
                        {b.contactPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {b.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: PNR, Fare & Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-sm font-black text-slate-900">
                        {formatInr(b.totalAmount)}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-600 mt-0.5 flex items-center gap-1">
                        <span>PNR:</span>
                        <span className="text-[#0062e0] font-black">{b.airlinePnr || 'Not Set'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPnrEditRef(b.bookingReference);
                            setPnrInput(b.airlinePnr || '');
                          }}
                          className="text-[10px] text-blue-600 hover:underline ml-1"
                        >
                          (Edit)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/api/tickets/${b.bookingReference}/pdf`}
                        download
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0062e0] hover:bg-blue-100 font-bold text-xs transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>

                      <button
                        type="button"
                        disabled={actionLoading === `email-${b.bookingReference}`}
                        onClick={() => handleResendEmail(b.bookingReference)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50"
                        title="Resend Itinerary Email"
                      >
                        <Send className="w-3.5 h-3.5 text-[#0062e0]" />
                        <span>Email</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : b.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                        aria-label="Toggle Details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit PNR Inline Bar */}
                {pnrEditRef === b.bookingReference && (
                  <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap items-center gap-2 text-xs">
                    <KeyRound className="w-4 h-4 text-[#0062e0]" />
                    <span className="font-bold text-blue-900">Set Live GDS Airline PNR:</span>
                    <input
                      type="text"
                      value={pnrInput}
                      onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                      placeholder="e.g. 6E7XK2"
                      maxLength={8}
                      className="px-2.5 py-1 rounded-lg border border-blue-300 bg-white font-mono font-bold text-xs outline-none uppercase"
                    />
                    <button
                      type="button"
                      disabled={actionLoading === `pnr-${b.bookingReference}`}
                      onClick={() => handleSavePnr(b.bookingReference)}
                      className="px-3 py-1 rounded-lg bg-[#0062e0] text-white font-bold hover:bg-blue-700"
                    >
                      Save PNR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPnrEditRef(null)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
                    <div>
                      <span className="font-black text-slate-900 block mb-2">
                        Passenger Manifest ({b.passengers.length} Traveler{b.passengers.length > 1 ? 's' : ''})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {b.passengers.map((p, idx) => (
                          <div key={p.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 flex items-center justify-between">
                              <span>{p.firstName} {p.lastName}</span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                {p.passengerType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              DOB: {p.dateOfBirth || '—'} · Passport: {p.passportNumberMasked || '—'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Nationality: {p.nationality || '—'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Modification Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-700">Quick Status Transition:</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(b.bookingReference, 'confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100"
                      >
                        Set Confirmed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(b.bookingReference, 'cancelled')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold hover:bg-rose-100"
                      >
                        Set Cancelled
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
