'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plane } from 'lucide-react';

interface RouteTickerItem {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  airline: string;
  fare: string;
  time: string;
}

const LIVE_ROUTES: RouteTickerItem[] = [
  { fromCode: 'DEL', fromCity: 'Delhi', toCode: 'BOM', toCity: 'Mumbai', airline: 'IndiGo 6E-2041', fare: '₹4,299', time: '2h 10m' },
  { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'DXB', toCity: 'Dubai', airline: 'Emirates EK-501', fare: '₹14,999', time: '3h 30m' },
  { fromCode: 'BLR', fromCity: 'Bengaluru', toCode: 'SIN', toCity: 'Singapore', airline: 'Singapore SQ-503', fare: '₹16,450', time: '4h 25m' },
  { fromCode: 'HYD', fromCity: 'Hyderabad', toCode: 'DEL', toCity: 'New Delhi', airline: 'Air India AI-542', fare: '₹4,499', time: '2h 15m' },
  { fromCode: 'DEL', fromCity: 'Delhi', toCode: 'LHR', toCity: 'London', airline: 'British Airways BA-142', fare: '₹38,200', time: '9h 15m' },
  { fromCode: 'MAA', fromCity: 'Chennai', toCode: 'BKK', toCity: 'Bangkok', airline: 'Thai Airways TG-338', fare: '₹12,800', time: '3h 45m' },
  { fromCode: 'CCU', fromCity: 'Kolkata', toCode: 'BLR', toCity: 'Bengaluru', airline: 'Vistara UK-771', fare: '₹5,199', time: '2h 40m' },
  { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'JFK', toCity: 'New York', airline: 'Air India AI-119', fare: '₹56,400', time: '15h 30m' },
];

export function RoutesMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200/90 bg-white/70 py-3.5 backdrop-blur-md">
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50 to-transparent sm:w-28" />

      {/* Marquee Track */}
      <div className="flex w-max animate-marquee space-x-4">
        {[...LIVE_ROUTES, ...LIVE_ROUTES].map((item, idx) => (
          <Link
            key={idx}
            href={`/flights?from=${item.fromCode}&to=${item.toCode}&depart=2026-12-15&adults=1&cabin=economy`}
            className="group flex items-center gap-3 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/80 hover:shadow-card"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Plane className="h-3 w-3" />
            </span>

            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-navy-900">
              <span>{item.fromCode}</span>
              <ArrowRight className="h-3 w-3 text-brand-600 transition-transform group-hover:translate-x-0.5" />
              <span>{item.toCode}</span>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {item.time}
            </span>

            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-extrabold text-brand-700">
              {item.fare}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
