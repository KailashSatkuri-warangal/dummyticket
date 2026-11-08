'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck } from 'lucide-react';

export function MobileActionDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show bottom bar only after scrolling 260px down on mobile
      if (window.scrollY > 260) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block sm:hidden pb-safe">
      <div className="border-t border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-elevated">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ShieldCheck className="h-4 w-4 text-verified-600 shrink-0" />
            <span className="font-semibold text-navy-900">Verified PNR</span>
          </div>

          <Link
            href="/flights?from=HYD&to=DEL&depart=2026-12-15&adults=1&cabin=economy"
            className="btn-shimmer flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search Flights Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
