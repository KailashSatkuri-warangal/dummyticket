'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Download,
  Shield,
  Plane,
  Calendar,
  X,
  Eye,
  FileText,
  Mail,
  Phone,
} from 'lucide-react';

interface PassengerRow {
  id: string;
  bookingId: string;
  bookingReference: string;
  passengerType: 'adult' | 'child' | 'infant';
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  passportNumberMasked: string;
  passportExpiry: string | null;
  nationality: string;
  contactEmail: string;
  contactPhone: string | null;
  originIata: string;
  destinationIata: string;
  departureDate: string;
  bookingStatus: string;
  createdAt: string;
}

export function PassengerManagerClient({
  initialPassengers,
}: {
  initialPassengers: PassengerRow[];
}) {
  const [passengers] = useState<PassengerRow[]>(initialPassengers);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPax, setSelectedPax] = useState<PassengerRow | null>(null);

  const filtered = passengers.filter((p) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.bookingReference.toLowerCase().includes(q) ||
      p.contactEmail.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.passportNumberMasked.toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || p.passengerType === typeFilter;

    return matchesQuery && matchesType;
  });

  const totalPax = passengers.length;
  const adultsCount = passengers.filter((p) => p.passengerType === 'adult').length;
  const childrenCount = passengers.filter((p) => p.passengerType === 'child').length;
  const infantsCount = passengers.filter((p) => p.passengerType === 'infant').length;

  function exportCsv() {
    const headers = [
      'Passenger Full Name',
      'Category',
      'Gender',
      'Date of Birth',
      'Nationality',
      'Masked Passport',
      'Booking Reference',
      'Route',
      'Travel Date',
      'Contact Email',
      'Contact Phone',
    ];

    const rows = filtered.map((p) => [
      p.fullName,
      p.passengerType.toUpperCase(),
      p.gender,
      p.dateOfBirth || 'N/A',
      p.nationality,
      p.passportNumberMasked,
      p.bookingReference,
      `${p.originIata}-${p.destinationIata}`,
      p.departureDate,
      p.contactEmail,
      p.contactPhone || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dummyticket-passengers-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Travelers</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{totalPax}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Recorded across all itineraries</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Adult Passengers</span>
          <div className="text-2xl font-black text-brand-700 mt-1">{adultsCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ages 12+</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Children</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{childrenCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ages 2 - 11</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Infants</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{infantsCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Under 2 years</p>
        </div>
      </div>

      {/* Control Bar: Search & Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search passenger name, booking ref, nationality, email..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg ${typeFilter === 'all' ? 'bg-white shadow text-navy-900' : ''}`}
            >
              All Pax
            </button>
            <button
              onClick={() => setTypeFilter('adult')}
              className={`px-3 py-1 rounded-lg ${typeFilter === 'adult' ? 'bg-white shadow text-brand-700' : ''}`}
            >
              Adults
            </button>
            <button
              onClick={() => setTypeFilter('child')}
              className={`px-3 py-1 rounded-lg ${typeFilter === 'child' ? 'bg-white shadow text-indigo-700' : ''}`}
            >
              Children
            </button>
            <button
              onClick={() => setTypeFilter('infant')}
              className={`px-3 py-1 rounded-lg ${typeFilter === 'infant' ? 'bg-white shadow text-purple-700' : ''}`}
            >
              Infants
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

      {/* Passengers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">Traveler Name</th>
                <th className="p-3.5">Category & Gender</th>
                <th className="p-3.5">Nationality</th>
                <th className="p-3.5">Masked Passport</th>
                <th className="p-3.5">Associated Ref</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-extrabold text-navy-900 block text-sm">{p.fullName}</span>
                      <span className="text-[11px] text-slate-400">{p.contactEmail}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.passengerType === 'adult'
                            ? 'bg-blue-50 text-brand-700 border border-blue-200'
                            : p.passengerType === 'child'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {p.passengerType} · {p.gender}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-navy-900">
                      <span className="font-mono">{p.nationality}</span>
                    </td>
                    <td className="p-3.5 font-mono text-xs font-semibold text-slate-600">
                      {p.passportNumberMasked}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`/booking/${p.bookingReference}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-black text-brand-700 hover:underline"
                      >
                        {p.bookingReference}
                      </a>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700">
                      {p.originIata} → {p.destinationIata}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedPax(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="View Traveler Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No passengers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Passenger Details Modal */}
      {selectedPax && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Traveler Record
              </h2>
              <button onClick={() => setSelectedPax(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Full Passenger Name</div>
                <div className="text-base font-black text-navy-900 mt-0.5">{selectedPax.fullName}</div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>Category: <strong>{selectedPax.passengerType.toUpperCase()}</strong></span>
                  <span>·</span>
                  <span>Gender: <strong>{selectedPax.gender}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Nationality</div>
                  <div className="font-mono font-bold text-navy-900 mt-0.5">{selectedPax.nationality}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Date of Birth</div>
                  <div className="font-bold text-navy-900 mt-0.5">{selectedPax.dateOfBirth || 'Not Provided'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-brand-600" /> Protected Passport Information
                </div>
                <div className="font-mono font-black text-slate-800 text-sm mt-0.5">
                  {selectedPax.passportNumberMasked}
                </div>
                {selectedPax.passportExpiry && (
                  <div className="text-[11px] text-slate-500 mt-0.5">Expiry: {selectedPax.passportExpiry}</div>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Associated Itinerary</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-brand-700">{selectedPax.bookingReference}</span>
                  <span className="font-bold text-navy-900">{selectedPax.originIata} → {selectedPax.destinationIata}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Departure: {selectedPax.departureDate}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPax(null)}
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
