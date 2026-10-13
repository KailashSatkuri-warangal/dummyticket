import React from 'react';
import { listAllBookings } from '@/lib/booking/store';
import { formatInr } from '@/lib/config/brand';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const bookings = await listAllBookings();
  const capturedBookings = bookings.filter(
    (b) => b.paymentStatus === 'captured'
  );
  const conversionRate =
    bookings.length > 0
      ? Math.round((capturedBookings.length / bookings.length) * 100)
      : 0;
  const totalRevenue = capturedBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0
  );
  const ticketedCount = bookings.filter(
    (b) => b.status === 'ticketed'
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Conversion & Revenue Reports
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Audited financial and operational metrics derived directly from verified booking and payment records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500">Booking Conversion Rate</p>
          <p className="mt-1 text-2xl font-extrabold text-navy-900">
            {conversionRate}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500">Captured Transaction Volume</p>
          <p className="mt-1 text-2xl font-extrabold text-verified-600">
            {formatInr(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500">Provider-Confirmed Ticket Issuance</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-700">
            {ticketedCount} / {bookings.length}
          </p>
        </div>
      </div>
    </div>
  );
}
