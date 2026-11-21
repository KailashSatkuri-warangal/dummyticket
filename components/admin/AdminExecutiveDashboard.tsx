'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Ticket,
  CreditCard,
  RotateCcw,
  Plane,
  Compass,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Download,
  Calendar,
  Building2,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';
import type { BookingRecord, PaymentRecord, AuditLogRecord } from '@/types';

interface DashboardProps {
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  refunds: any[];
  auditLogs: AuditLogRecord[];
  flightsCount: number;
  routesCount: number;
  airlinesCount: number;
}

export function AdminExecutiveDashboard({
  bookings,
  payments,
  refunds,
  auditLogs,
  flightsCount,
  routesCount,
  airlinesCount,
}: DashboardProps) {
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | 'month' | 'all'>('all');

  const now = useMemo(() => new Date(), []);

  const filteredBookings = useMemo(() => {
    if (dateFilter === 'all') return bookings;
    return bookings.filter((b) => {
      const bDate = new Date(b.createdAt);
      if (dateFilter === 'today') {
        return (
          bDate.getDate() === now.getDate() &&
          bDate.getMonth() === now.getMonth() &&
          bDate.getFullYear() === now.getFullYear()
        );
      }
      if (dateFilter === '7d') {
        return now.getTime() - bDate.getTime() <= 7 * 24 * 3600 * 1000;
      }
      if (dateFilter === '30d') {
        return now.getTime() - bDate.getTime() <= 30 * 24 * 3600 * 1000;
      }
      if (dateFilter === 'month') {
        return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [bookings, dateFilter, now]);

  const filteredPayments = useMemo(() => {
    if (dateFilter === 'all') return payments;
    return payments.filter((p) => {
      const pDate = new Date(p.createdAt);
      if (dateFilter === 'today') {
        return (
          pDate.getDate() === now.getDate() &&
          pDate.getMonth() === now.getMonth() &&
          pDate.getFullYear() === now.getFullYear()
        );
      }
      if (dateFilter === '7d') {
        return now.getTime() - pDate.getTime() <= 7 * 24 * 3600 * 1000;
      }
      if (dateFilter === '30d') {
        return now.getTime() - pDate.getTime() <= 30 * 24 * 3600 * 1000;
      }
      if (dateFilter === 'month') {
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [payments, dateFilter, now]);

  // Aggregate Metrics
  const totalBookings = filteredBookings.length;
  const todayBookings = bookings.filter((b) => {
    const d = new Date(b.createdAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const pendingCount = filteredBookings.filter(
    (b) => b.status === 'awaiting_payment' || b.status === 'pending'
  ).length;
  const confirmedCount = filteredBookings.filter((b) => b.status === 'confirmed').length;
  const ticketedCount = filteredBookings.filter((b) => b.status === 'ticketed').length;
  const cancelledCount = filteredBookings.filter((b) => b.status === 'cancelled').length;
  const expiredCount = filteredBookings.filter((b) => b.status === 'expired').length;

  const capturedRevenue = filteredPayments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const processedRefundsTotal = refunds
    .filter((r) => r.status === 'processed')
    .reduce((sum, r) => sum + (r.amountInr || 0), 0);

  // Unique guest customer count
  const guestEmails = new Set(filteredBookings.map((b) => b.contactEmail.toLowerCase().trim()));
  const guestCustomerCount = guestEmails.size;

  // Popular Routes
  const routeCounts = useMemo(() => {
    const map = new Map<string, { route: string; count: number; revenue: number }>();
    for (const b of filteredBookings) {
      const key = `${b.originIata} → ${b.destinationIata}`;
      const curr = map.get(key) || { route: key, count: 0, revenue: 0 };
      curr.count += 1;
      curr.revenue += b.totalAmount || 0;
      map.set(key, curr);
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredBookings]);

  return (
    <div className="space-y-6">
      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-black text-navy-900">Period Filter:</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Filtering metrics across reservations & payments
          </span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'today' ? 'bg-white shadow-sm text-navy-900' : 'hover:text-navy-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('7d')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === '7d' ? 'bg-white shadow-sm text-navy-900' : 'hover:text-navy-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateFilter('30d')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === '30d' ? 'bg-white shadow-sm text-navy-900' : 'hover:text-navy-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateFilter('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'month' ? 'bg-white shadow-sm text-navy-900' : 'hover:text-navy-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              dateFilter === 'all' ? 'bg-white shadow-sm text-brand-700 font-black' : 'hover:text-navy-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* KPI Highlights Grid (12 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{totalBookings}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Platform reservation records</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Today&#39;s Bookings</span>
          <div className="text-2xl font-black text-brand-700 mt-1">{todayBookings}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Created today</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Holds</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Temporary hold active</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Confirmed Holds</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{confirmedCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified reservations</p>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Ticketed Records</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{ticketedCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Issued e-ticket itinerary</p>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Cancelled / Expired</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{cancelledCount + expiredCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{cancelledCount} voided · {expiredCount} timed out</p>
        </div>

        {/* Metric 7 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Guest Customers</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{guestCustomerCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Unique travelers</p>
        </div>

        {/* Metric 8 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Active Routes</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{routesCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{flightsCount} flights · {airlinesCount} airlines</p>
        </div>

        {/* Metric 9 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Actual Revenue</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{formatInr(capturedRevenue)}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">From successful transactions</p>
        </div>

        {/* Metric 10 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Refunds Processed</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{formatInr(processedRefundsTotal)}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{refunds.length} total refund claims</p>
        </div>

        {/* Metric 11 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Net Platform Margin</span>
          <div className="text-2xl font-black text-brand-700 mt-1">
            {formatInr(Math.max(0, capturedRevenue - processedRefundsTotal))}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">After processed refunds</p>
        </div>

        {/* Metric 12 */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Audit Events</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{auditLogs.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Logged admin operations</p>
        </div>
      </div>

      {/* Two-Column Analytics: Popular Routes & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Routes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-navy-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-600" />
              Most Popular Flight Routes
            </h2>
            <Link href="/admin/routes" className="text-xs font-bold text-brand-600 hover:underline">
              Manage routes →
            </Link>
          </div>

          <div className="space-y-2">
            {routeCounts.map((rc, idx) => (
              <div
                key={rc.route}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-brand-700 flex items-center justify-center font-black text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-extrabold text-navy-900 text-xs block">{rc.route}</span>
                    <span className="text-[10px] text-slate-400">{rc.count} booking reservations</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-navy-900 text-xs block">{formatInr(rc.revenue)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Volume</span>
                </div>
              </div>
            ))}
            {routeCounts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No route activity recorded for this period.</p>
            )}
          </div>
        </div>

        {/* Reservation Status Distribution */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-navy-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-purple-600" />
              Reservation Status Distribution
            </h2>
            <Link href="/admin/bookings" className="text-xs font-bold text-brand-600 hover:underline">
              All bookings →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Confirmed & Verified Holds</span>
                <span className="text-emerald-700">{confirmedCount} ({Math.round((confirmedCount / (totalBookings || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(confirmedCount / (totalBookings || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Awaiting Payment Holds</span>
                <span className="text-amber-700">{pendingCount} ({Math.round((pendingCount / (totalBookings || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(pendingCount / (totalBookings || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Ticketed Records</span>
                <span className="text-purple-700">{ticketedCount} ({Math.round((ticketedCount / (totalBookings || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${(ticketedCount / (totalBookings || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Cancelled or Expired</span>
                <span className="text-rose-700">{cancelledCount + expiredCount} ({Math.round(((cancelledCount + expiredCount) / (totalBookings || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${((cancelledCount + expiredCount) / (totalBookings || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-navy-900">Recent Customer Bookings</h2>
            <Link href="/admin/pnr" className="text-xs font-bold text-brand-600 hover:underline">
              PNR Search →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredBookings.slice(0, 6).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-mono font-black text-brand-700">{b.bookingReference}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {b.originIata} → {b.destinationIata} · {b.contactEmail}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-navy-900">{formatInr(b.totalAmount)}</div>
                  <span
                    className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : b.status === 'ticketed'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-navy-900">Recent System Audit Trail</h2>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-brand-600 hover:underline">
              Full logs →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-900 block">{log.action}</span>
                  <span className="text-[11px] text-slate-400">
                    Actor: {log.actorEmail} · {log.resourceType}/{log.resourceId}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
