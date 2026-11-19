'use client';

import React, { useState, useEffect } from 'react';
import { Plane, Wind, MapPin, Compass } from 'lucide-react';

interface RouteData {
  originIata: string;
  originCity: string;
  destIata: string;
  destCity: string;
  altitude: string;
  speed: string;
  pnr: string;
}

const ROUTES: Record<'hyd-lax' | 'del-lhr' | 'bom-dxb', RouteData> = {
  'hyd-lax': {
    originIata: 'HYD',
    originCity: 'Hyderabad',
    destIata: 'LAX',
    destCity: 'Los Angeles',
    altitude: '38,000 ft',
    speed: '915 km/h',
    pnr: 'DT7X42K',
  },
  'del-lhr': {
    originIata: 'DEL',
    originCity: 'New Delhi',
    destIata: 'LHR',
    destCity: 'London',
    altitude: '37,000 ft',
    speed: '880 km/h',
    pnr: 'DT8LHR',
  },
  'bom-dxb': {
    originIata: 'BOM',
    originCity: 'Mumbai',
    destIata: 'DXB',
    destCity: 'Dubai',
    altitude: '34,000 ft',
    speed: '860 km/h',
    pnr: 'DT6DXB',
  },
};

export function TicketFlightRadar() {
  const [activeRoute, setActiveRoute] = useState<'hyd-lax' | 'del-lhr' | 'bom-dxb'>('hyd-lax');
  const [progress, setProgress] = useState(42);

  // Smooth continuous flight movement animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 4;
        return prev + 0.6;
      });
    }, 70);
    return () => clearInterval(timer);
  }, []);

  const route = ROUTES[activeRoute];

  // Quadratic Bezier curve coordinates:
  // P0 = (40, 95), P1 = (200, 18), P2 = (360, 95)
  const t = progress / 100;
  const p0x = 40, p0y = 95;
  const p1x = 200, p1y = 18;
  const p2x = 360, p2y = 95;

  const planeX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
  const planeY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

  const dx = 2 * (1 - t) * (p1x - p0x) + 2 * t * (p2x - p1x);
  const dy = 2 * (1 - t) * (p1y - p0y) + 2 * t * (p2y - p1y);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      {/* Header bar inside ticket */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black tracking-wider uppercase text-blue-700">
            Live Flight Radar
          </span>
        </div>

        {/* Route Selector Tabs */}
        <div className="inline-flex bg-blue-100/70 p-0.5 rounded-lg border border-blue-200/60">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveRoute('hyd-lax');
              setProgress(35);
            }}
            className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all ${
              activeRoute === 'hyd-lax'
                ? 'bg-[#0062e0] text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            HYD ✈ LAX
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveRoute('del-lhr');
              setProgress(50);
            }}
            className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all ${
              activeRoute === 'del-lhr'
                ? 'bg-[#0062e0] text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            DEL ✈ LHR
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveRoute('bom-dxb');
              setProgress(65);
            }}
            className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all ${
              activeRoute === 'bom-dxb'
                ? 'bg-[#0062e0] text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            BOM ✈ DXB
          </button>
        </div>
      </div>

      {/* Trajectory Radar Canvas */}
      <div className="relative w-full h-36 bg-gradient-to-b from-[#0a1428] via-[#0e1d3a] to-[#081020] rounded-2xl overflow-hidden border border-blue-400/30 shadow-inner">
        {/* World Dotted Grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(147, 197, 253, 0.45) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Radar Scan Ring */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-blue-400/20 animate-pulse pointer-events-none" />

        {/* SVG Bezier Route */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 130"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ticketRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#0062e0" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
            <filter id="ticketGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dashed Background Track */}
          <path
            d="M 40 95 Q 200 18 360 95"
            fill="none"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Active Glowing Route Arc */}
          <path
            d="M 40 95 Q 200 18 360 95"
            fill="none"
            stroke="url(#ticketRouteGrad)"
            strokeWidth="3"
            filter="url(#ticketGlow)"
          />

          {/* Origin Node (HYD) */}
          <circle cx="40" cy="95" r="5" fill="#38bdf8" />
          <circle cx="40" cy="95" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />

          {/* Destination Node (LAX) */}
          <circle cx="360" cy="95" r="5" fill="#34d399" />
          <circle cx="360" cy="95" r="10" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6" />
        </svg>

        {/* HUD Pill (Progress & Altitude) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-0.5 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md">
          <Wind className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
          <span>{Math.round(progress)}% Completed</span>
          <span className="text-cyan-300 font-mono">• {route.altitude}</span>
        </div>

        {/* Origin Badge */}
        <div className="absolute left-2.5 bottom-2 bg-black/65 backdrop-blur-md border border-blue-400/40 rounded-lg px-2 py-1 text-left text-white shadow">
          <div className="text-[8px] text-blue-300 uppercase font-black tracking-wider flex items-center gap-0.5">
            <MapPin className="w-2 h-2 text-blue-400" /> Origin
          </div>
          <div className="text-sm font-black tracking-wider font-mono">{route.originIata}</div>
          <div className="text-[8px] text-gray-300 truncate max-w-[80px]">{route.originCity}</div>
        </div>

        {/* Destination Badge */}
        <div className="absolute right-2.5 bottom-2 bg-black/65 backdrop-blur-md border border-emerald-400/40 rounded-lg px-2 py-1 text-right text-white shadow">
          <div className="text-[8px] text-emerald-300 uppercase font-black tracking-wider flex items-center justify-end gap-0.5">
            Dest <MapPin className="w-2 h-2 text-emerald-400" />
          </div>
          <div className="text-sm font-black tracking-wider font-mono text-emerald-400">{route.destIata}</div>
          <div className="text-[8px] text-gray-300 truncate max-w-[80px]">{route.destCity}</div>
        </div>

        {/* Moving 3D Airplane */}
        <div
          className="absolute pointer-events-none transition-all duration-75 ease-linear z-20"
          style={{
            left: `${(planeX / 400) * 100}%`,
            top: `${(planeY / 130) * 100}%`,
            transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
          }}
        >
          {/* Engine Exhaust Trail */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-4 h-1 bg-gradient-to-r from-transparent to-cyan-400 rounded-full blur-[0.5px] opacity-80" />

          {/* Plane Icon Badge */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0062e0] to-[#38bdf8] flex items-center justify-center text-white shadow-[0_0_12px_#38bdf8] border border-white">
            <Plane className="w-3.5 h-3.5 fill-white text-white transform rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
