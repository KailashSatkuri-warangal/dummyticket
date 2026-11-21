'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  Plane,
  Ticket,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';
import type { BookingRecord } from '@/types';

export function ReportsManagerClient({
  bookings,
}: {
  bookings: BookingRecord[];
}) {
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('all');

  const filteredBookings = useMemo(() => {
    if (timeRange === 'all') return bookings;
    const now = Date.now();
    const days = timeRange === '7d' ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return bookings.filter((b) => new Date(b.createdAt).getTime() >= cutoff);
  }, [bookings, timeRange]);

  const capturedBookings = useMemo(() => {
    return filteredBookings.filter((b) => b.paymentStatus === 'captured');
  }, [filteredBookings]);

  const totalGrossRevenue = useMemo(() => {
    return capturedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  }, [capturedBookings]);

  const conversionRate = useMemo(() => {
    if (filteredBookings.length === 0) return 0;
    return Math.round((capturedBookings.length / filteredBookings.length) * 100);
  }, [filteredBookings, capturedBookings]);

  // Route popularity map
  const routeBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    for (const b of filteredBookings) {
      const key = `${b.originIata} → ${b.destinationIata}`;
      const cur = map.get(key) || { count: 0, revenue: 0 };
      map.set(key, {
        count: cur.count + 1,
        revenue: cur.revenue + (b.paymentStatus === 'captured' ? b.totalAmount : 0),
      });
    }
    return Array.from(map.entries())
      .map(([route, stat]) => ({ route, ...stat }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredBookings]);

  function exportCsv() {
    const headers = [
      'Booking Reference',
      'Airline PNR',
      'Origin',
      'Destination',
      'Departure Date',
      'Passengers',
      'Total Amount (INR)',
      'Payment Status',
      'Ticket Status',
      'Created At',
    ];
    const rows = filteredBookings.map((b) => [
      b.bookingReference,
      b.airlinePnr || 'None',
      b.originIata,
      b.destinationIata,
      b.departureDate,
      b.passengers.length,
      b.totalAmount,
      b.paymentStatus,
      b.ticketStatus,
      b.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dummytickets-report-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Financial & Itinerary Performance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Reports & Revenue Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live conversion metrics, gross revenue reconciliation, and top route distributions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
              {(['7d', '30d', 'all'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeRange === r ? 'bg-white text-[#0062e0] shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0062e0] text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Conversion Rate
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {conversionRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {capturedBookings.length} paid of {filteredBookings.length} created
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Captured Revenue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
              {formatInr(totalGrossRevenue)}
            </div>
            <p className="text-[10px] text-emerald-600 mt-0.5">
              Settled via Razorpay payment gateway
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Total Reservations
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">
              {filteredBookings.length}
            </div>
            <p className="text-[10px] text-blue-600 mt-0.5">
              Flight itineraries generated
            </p>
          </div>
        </div>
      </div>

      {/* Route Popularity Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#0062e0]" />
          <span>Top Flight Itinerary Routes</span>
        </h2>

        {routeBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No route booking data recorded for this time range.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {routeBreakdown.map((item, idx) => (
              <div key={item.route} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-black flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{item.route}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="text-slate-500 font-semibold">{item.count} booking{item.count > 1 ? 's' : ''}</span>
                  <span className="font-black text-slate-900">{formatInr(item.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
