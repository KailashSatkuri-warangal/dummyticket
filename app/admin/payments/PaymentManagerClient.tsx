'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';
import type { PaymentRecord } from '@/types';

export function PaymentManagerClient({
  initialPayments,
}: {
  initialPayments: PaymentRecord[];
}) {
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // De-duplicate payment records by order ID or booking ref (preferring captured / verified state)
  const deduplicatedPayments = useMemo(() => {
    const map = new Map<string, PaymentRecord>();
    for (const p of payments) {
      const key = (p.razorpayOrderId && p.razorpayOrderId.trim()) || p.bookingReference || p.id;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, p);
      } else {
        const isCurrentBetter =
          (p.status === 'captured' && existing.status !== 'captured') ||
          (p.razorpaySignatureVerified && !existing.razorpaySignatureVerified) ||
          (Boolean(p.razorpayPaymentId) && !existing.razorpayPaymentId) ||
          new Date(p.updatedAt || p.createdAt).getTime() >
            new Date(existing.updatedAt || existing.createdAt).getTime();

        if (isCurrentBetter) {
          map.set(key, p);
        }
      }
    }
    return Array.from(map.values());
  }, [payments]);

  const capturedTotal = useMemo(() => {
    return deduplicatedPayments
      .filter((p) => p.status === 'captured')
      .reduce((sum, p) => sum + p.amountInr, 0);
  }, [deduplicatedPayments]);

  const verifiedHmacCount = useMemo(() => {
    return deduplicatedPayments.filter((p) => p.razorpaySignatureVerified).length;
  }, [deduplicatedPayments]);

  const filteredPayments = useMemo(() => {
    return deduplicatedPayments.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.bookingReference.toLowerCase().includes(q) ||
        (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(q)) ||
        (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q))
      );
    });
  }, [deduplicatedPayments, search, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Overview & Metrics Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Razorpay Payment Gateway Ledger</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Transactions & Payment Processing
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verified Razorpay order IDs, HMAC-SHA256 signature audits, and transaction statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Captured Revenue</div>
              <div className="text-sm font-black text-emerald-700">{formatInr(capturedTotal)}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Verified HMAC</div>
              <div className="text-sm font-black text-[#0062e0]">{verifiedHmacCount} / {payments.length}</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Razorpay Order ID (order_...), Payment ID (pay_...), or Booking Ref..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:border-[#0062e0] focus:ring-1 focus:ring-[#0062e0] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'captured', label: 'Captured' },
              { id: 'created', label: 'Pending' },
              { id: 'failed', label: 'Failed' },
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

      {/* Transactions Table / Card List */}
      {filteredPayments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-800">No payment transactions match your query</p>
          <p className="mt-1">Orders processed through Razorpay will appear here in real time.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Razorpay Order ID</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Security & HMAC</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#0062e0]">
                      <Link
                        href={`/booking/${p.bookingReference}`}
                        className="hover:underline flex items-center gap-1"
                        target="_blank"
                      >
                        {p.bookingReference}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      {p.razorpayOrderId}
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      {p.razorpayPaymentId ? (
                        <span className="text-emerald-700 font-bold">{p.razorpayPaymentId}</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Capture</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-black text-slate-900 text-sm">
                      {formatInr(p.amountInr)}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.currency}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      {p.razorpaySignatureVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified HMAC
                        </span>
                      ) : p.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Signature
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'captured'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
