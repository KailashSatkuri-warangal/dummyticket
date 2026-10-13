import React from 'react';
import type { Airline } from '@/types';

interface AirlineLogoProps {
  airline: Airline;
  size?: 'sm' | 'md' | 'lg';
  showVerifiedBadge?: boolean;
}

export function AirlineLogo({
  airline,
  size = 'md',
  showVerifiedBadge = false,
}: AirlineLogoProps) {
  const dimensions =
    size === 'sm'
      ? 'h-9 w-9 text-xs rounded-lg'
      : size === 'lg'
      ? 'h-14 w-14 text-base rounded-2xl'
      : 'h-12 w-12 text-sm rounded-xl';

  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        style={{
          backgroundColor: airline.brandColor,
          borderColor: airline.accentColor ?? 'rgba(255,255,255,0.2)',
        }}
        title={`${airline.name} (IATA: ${airline.iataCode} / ICAO: ${airline.icaoCode})`}
        className={`relative flex ${dimensions} shrink-0 items-center justify-center border font-black tracking-tight text-white shadow-sm overflow-hidden`}
      >
        {/* Subtle Tail-Fin Geometric Vector Accent */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        >
          <path
            d="M28 0L40 0L40 40L12 40L28 0Z"
            fill={airline.accentColor ?? '#FFFFFF'}
          />
        </svg>
        <span className="relative z-10 font-mono">{airline.logoText}</span>
      </div>
      {showVerifiedBadge && airline.isVerified && (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
          {airline.iataCode}/{airline.icaoCode}
        </span>
      )}
    </div>
  );
}
