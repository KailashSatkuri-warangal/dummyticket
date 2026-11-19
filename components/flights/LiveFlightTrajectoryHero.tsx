'use client';

import React, { useState, useEffect } from 'react';
import { Plane, Compass, Navigation, Wind, MapPin, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function LiveFlightTrajectoryHero() {
  const [progress, setProgress] = useState(28);
  const [activeTab, setActiveTab] = useState<'hyd-lax' | 'del-lhr' | 'bom-dxb'>('hyd-lax');

  // Smooth continuous flight movement animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 5;
        return prev + 0.5;
      });
    }, 70);
    return () => clearInterval(timer);
  }, []);

  const routeDetails = {
    'hyd-lax': {
      originIata: 'HYD',
      originCity: 'Hyderabad',
      originCountry: 'India',
      originAirport: 'Rajiv Gandhi International',
      destIata: 'LAX',
      destCity: 'Los Angeles',
      destCountry: 'United States',
      destAirport: 'Los Angeles International (Tom Bradley)',
      flightNo: 'AI-187 / DT-742',
      aircraft: 'Boeing 787-9 Dreamliner',
      distance: '14,080 km',
      flightTime: '17h 45m',
      altitude: '38,000 ft',
      speed: '915 km/h',
      status: 'En Route • Real-time Tracking',
      pnr: 'DT9LAX',
    },
    'del-lhr': {
      originIata: 'DEL',
      originCity: 'New Delhi',
      originCountry: 'India',
      originAirport: 'Indira Gandhi International',
      destIata: 'LHR',
      destCity: 'London',
      destCountry: 'United Kingdom',
      destAirport: 'Heathrow Airport (Terminal 2)',
      flightNo: 'BA-256 / DT-319',
      aircraft: 'Airbus A350-900',
      distance: '6,710 km',
      flightTime: '9h 10m',
      altitude: '37,000 ft',
      speed: '880 km/h',
      status: 'On Schedule • Verified PNR',
      pnr: 'DT8LHR',
    },
    'bom-dxb': {
      originIata: 'BOM',
      originCity: 'Mumbai',
      originCountry: 'India',
      originAirport: 'Chhatrapati Shivaji Maharaj',
      destIata: 'DXB',
      destCity: 'Dubai',
      destCountry: 'United Arab Emirates',
      destAirport: 'Dubai International (Terminal 3)',
      flightNo: 'EK-501 / DT-420',
      aircraft: 'Boeing 777-300ER',
      distance: '1,930 km',
      flightTime: '3h 25m',
      altitude: '34,000 ft',
      speed: '860 km/h',
      status: 'Cruising • Verified Route',
      pnr: 'DT6DXB',
    },
  };

  const current = routeDetails[activeTab];

  // Calculate coordinates along SVG quadratic bezier curve
  // Path start: (40, 150), Control: (260, 20), End: (480, 150)
  const t = progress / 100;
  // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const p0x = 50, p0y = 140;
  const p1x = 260, p1y = 25;
  const p2x = 470, p2y = 140;

  const planeX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
  const planeY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

  // Tangent for plane rotation angle
  const dx = 2 * (1 - t) * (p1x - p0x) + 2 * t * (p2x - p1x);
  const dy = 2 * (1 - t) * (p1y - p0y) + 2 * t * (p2y - p1y);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div className="w-full my-8 perspective-container">
      {/* 3D Elevated Radar & Flight Simulator Card */}
      <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/40 to-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,98,224,0.12)] card-3d-elevate relative overflow-hidden transition-all duration-500">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#0062e0] to-transparent opacity-80" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Title & Route Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-100/80 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-1 badge-3d">
              <span className="w-2 h-2 rounded-full bg-[#0062e0] animate-ping" />
              Live Flight Trajectory Simulation
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {current.originCity} ({current.originIata}) → {current.destCity} ({current.destIata})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified IATA route simulation • PNR: <span className="font-mono font-bold text-[#0062e0]">{current.pnr}</span>
            </p>
          </div>

          {/* Quick Route Switchers */}
          <div className="inline-flex bg-blue-100/60 p-1 rounded-xl border border-blue-200/60 self-start sm:self-auto">
            <button
              onClick={() => { setActiveTab('hyd-lax'); setProgress(25); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'hyd-lax'
                  ? 'bg-[#0062e0] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#0062e0]'
              }`}
            >
              HYD ✈ LAX
            </button>
            <button
              onClick={() => { setActiveTab('del-lhr'); setProgress(45); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'del-lhr'
                  ? 'bg-[#0062e0] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#0062e0]'
              }`}
            >
              DEL ✈ LHR
            </button>
            <button
              onClick={() => { setActiveTab('bom-dxb'); setProgress(60); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bom-dxb'
                  ? 'bg-[#0062e0] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#0062e0]'
              }`}
            >
              BOM ✈ DXB
            </button>
          </div>
        </div>

        {/* 3D Animated Flight Canvas */}
        <div className="py-6 relative z-10">
          <div className="relative w-full max-w-2xl mx-auto h-48 sm:h-56 bg-gradient-to-b from-[#0a1428] via-[#0e1d3a] to-[#081020] rounded-2xl p-4 overflow-hidden border border-blue-400/30 shadow-inner">
            {/* World Grid Lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(147, 197, 253, 0.4) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Radar Scan Rings */}
            <div className="absolute left-10 top-24 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20 animate-ping pointer-events-none" />
            <div className="absolute right-10 top-24 w-28 h-28 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/25 pointer-events-none" />

            {/* SVG Flight Arc */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 520 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0062e0" stopOpacity="1" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Underlying Track */}
              <path
                d="M 50 140 Q 260 25 470 140"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* Active Trajectory Arc with Glow */}
              <path
                d="M 50 140 Q 260 25 470 140"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                filter="url(#glowEffect)"
              />

              {/* Origin Radar Node (HYD) */}
              <circle cx="50" cy="140" r="7" fill="#38bdf8" />
              <circle cx="50" cy="140" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />

              {/* Destination Beacon Node (LAX) */}
              <circle cx="470" cy="140" r="7" fill="#34d399" />
              <circle cx="470" cy="140" r="14" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
            </svg>

            {/* Origin Airport Badge */}
            <div className="absolute left-3 bottom-3 sm:left-6 sm:bottom-4 bg-black/60 backdrop-blur-md border border-blue-400/40 rounded-xl px-3 py-1.5 text-left text-white shadow-lg">
              <div className="text-[10px] text-blue-300 uppercase font-black tracking-wider flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-blue-400" /> Origin
              </div>
              <div className="text-lg font-black tracking-wider font-mono">{current.originIata}</div>
              <div className="text-[10px] text-gray-300 truncate max-w-[110px]">{current.originCity}</div>
            </div>

            {/* Destination Airport Badge */}
            <div className="absolute right-3 bottom-3 sm:right-6 sm:bottom-4 bg-black/60 backdrop-blur-md border border-emerald-400/40 rounded-xl px-3 py-1.5 text-right text-white shadow-lg">
              <div className="text-[10px] text-emerald-300 uppercase font-black tracking-wider flex items-center justify-end gap-1">
                Destination <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <div className="text-lg font-black tracking-wider font-mono text-emerald-400">{current.destIata}</div>
              <div className="text-[10px] text-gray-300 truncate max-w-[110px]">{current.destCity}</div>
            </div>

            {/* Moving 3D Airplane Icon & Altitude Glow */}
            <div
              className="absolute pointer-events-none transition-all duration-75 ease-linear z-20"
              style={{
                left: `${(planeX / 520) * 100}%`,
                top: `${(planeY / 200) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
              }}
            >
              {/* Particle Engine Jet Trail */}
              <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-7 h-1.5 bg-gradient-to-r from-transparent to-cyan-400 rounded-full blur-[1px] opacity-80" />

              {/* Glowing Airplane Icon */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0062e0] to-[#38bdf8] flex items-center justify-center text-white shadow-[0_0_20px_#38bdf8] border border-white">
                <Plane className="w-5 h-5 fill-white text-white transform rotate-90" />
              </div>
            </div>

            {/* Live Progress HUD Chip */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full px-4 py-1 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg">
              <Wind className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{Math.round(progress)}% Completed</span>
              <span className="text-cyan-300 font-mono">• {current.altitude}</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-100/80 text-xs">
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Aircraft & Flight</div>
            <div className="font-extrabold text-gray-900 mt-0.5">{current.flightNo}</div>
            <div className="text-[10px] text-gray-500 truncate">{current.aircraft}</div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Great Circle Distance</div>
            <div className="font-extrabold text-gray-900 mt-0.5">{current.distance}</div>
            <div className="text-[10px] text-gray-500">Est. Time: {current.flightTime}</div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Airspeed & Altitude</div>
            <div className="font-extrabold text-blue-700 mt-0.5">{current.speed}</div>
            <div className="text-[10px] text-gray-500">{current.altitude} Cruising</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="text-[10px] uppercase font-bold text-emerald-600">Verification Status</div>
            <div className="font-extrabold text-emerald-800 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Embassy Verified
            </div>
            <div className="text-[10px] text-emerald-600">Valid PNR Format</div>
          </div>
        </div>
      </div>
    </div>
  );
}
