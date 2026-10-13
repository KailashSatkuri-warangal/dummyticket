import React from 'react';
import { AIRPORTS } from '@/lib/flights/dataset';

export default function AdminAirportsPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Configured Airports Dataset ({AIRPORTS.length})
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Indian and international IATA/ICAO airport records powering search autocomplete and route landing pages.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2.5">IATA</th>
              <th className="px-4 py-2.5">ICAO</th>
              <th className="px-4 py-2.5">Airport Name</th>
              <th className="px-4 py-2.5">City & Country</th>
              <th className="px-4 py-2.5">Timezone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {AIRPORTS.map((apt) => (
              <tr key={apt.id}>
                <td className="px-4 py-2.5 font-mono font-bold text-brand-700">
                  {apt.iataCode}
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-500">
                  {apt.icaoCode}
                </td>
                <td className="px-4 py-2.5 font-semibold text-navy-900">
                  {apt.name}
                </td>
                <td className="px-4 py-2.5">
                  {apt.city}, {apt.country} ({apt.countryCode})
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-500">
                  {apt.timezone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
