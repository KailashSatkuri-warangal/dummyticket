'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Ticket,
  Calendar,
  Eye,
  X,
  CreditCard,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalBookings: number;
  totalSpentInr: number;
  lastBookingDate: string;
  bookings: Array<{
    id: string;
    reference: string;
    route: string;
    amount: number;
    status: string;
    date: string;
  }>;
  source: 'booking' | 'lead';
}

export function CustomerManagerClient({
  initialCustomers,
}: {
  initialCustomers: CustomerProfile[];
}) {
  const [customers] = useState<CustomerProfile[]>(initialCustomers);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'repeat' | 'paid'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q));

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'repeat'
        ? c.totalBookings > 1
        : c.totalSpentInr > 0;

    return matchesQuery && matchesFilter;
  });

  const totalSpent = customers.reduce((acc, c) => acc + c.totalSpentInr, 0);
  const repeatCount = customers.filter((c) => c.totalBookings > 1).length;
  const avgSpent = Math.round(totalSpent / (customers.length || 1));

  function exportCsv() {
    const headers = [
      'Customer Name',
      'Contact Email',
      'Contact Phone',
      'Total Bookings',
      'Total Spent (INR)',
      'Last Booking Date',
      'Associated References',
    ];

    const rows = filtered.map((c) => [
      c.name,
      c.email,
      c.phone || 'N/A',
      c.totalBookings,
      c.totalSpentInr,
      c.lastBookingDate,
      c.bookings.map((b) => b.reference).join('; '),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dummyticket-customers-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Guest Customers</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{customers.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Aggregated guest profiles</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Repeat Customers</span>
          <div className="text-2xl font-black text-brand-700 mt-1">{repeatCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Multiple itinerary requests</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Customer Volume</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{formatInr(totalSpent)}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified platform transactions</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Avg Spend / Guest</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{formatInr(avgSpent)}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Lifetime customer value</p>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-white shadow text-navy-900' : ''}`}
            >
              All Guests
            </button>
            <button
              onClick={() => setFilter('repeat')}
              className={`px-3 py-1 rounded-lg ${filter === 'repeat' ? 'bg-white shadow text-brand-700' : ''}`}
            >
              Repeat ({repeatCount})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1 rounded-lg ${filter === 'paid' ? 'bg-white shadow text-emerald-700' : ''}`}
            >
              Paid Bookers
            </button>
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Email & Phone</th>
                <th className="p-3.5">Total Reservations</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5">Last Activity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-navy-900 text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black ${
                          c.totalBookings > 1
                            ? 'bg-blue-50 text-brand-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.totalBookings} reservation{c.totalBookings > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-navy-900">
                      {formatInr(c.totalSpentInr)}
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      {new Date(c.lastBookingDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No guest customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-600" />
                  {selectedCustomer.name}
                </h2>
                <p className="text-[11px] text-slate-500">{selectedCustomer.email}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Lifetime Reservations</span>
                  <div className="text-base font-black text-navy-900 mt-0.5">{selectedCustomer.totalBookings}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Spent</span>
                  <div className="text-base font-black text-emerald-700 mt-0.5">{formatInr(selectedCustomer.totalSpentInr)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Reservation History ({selectedCustomer.bookings.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedCustomer.bookings.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-mono font-black text-brand-700 text-xs">
                          {b.reference}
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 mt-0.5">{b.route}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(b.date).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-navy-900">{formatInr(b.amount)}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
