import React from 'react';
import { AIRLINES } from '@/lib/flights/dataset';
import { AirlineLogo } from '@/components/flights/AirlineLogo';

export default function AdminAirlinesPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Airlines Directory ({AIRLINES.length})
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Includes all 10 major and regional Indian carriers plus international partner airlines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AIRLINES.map((airline) => (
          <div
            key={airline.id}
            className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-4"
          >
            <AirlineLogo airline={airline} size="md" />
            <div className="text-xs">
              <p className="font-bold text-navy-900">{airline.name}</p>
              <p className="text-slate-500 font-mono">
                IATA: {airline.iataCode} · {airline.country}
              </p>
              <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                {airline.category ?? 'airline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
