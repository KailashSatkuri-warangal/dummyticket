'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Building2, CheckCircle2, ArrowRight, ShieldCheck, Clock, Globe } from 'lucide-react';

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryHref?: string;
  showHotelLink?: boolean;
}

export function CtaBanner({
  title = 'Get Your Free Dummy Ticket: Instant PDF, No Payment Needed',
  subtitle = 'Instant PDF itinerary. No credit card required. Accepted for visa applications across 195+ countries worldwide.',
  primaryButtonText = 'Generate Free Dummy Ticket',
  primaryHref = '#bookingForm',
  showHotelLink = true,
}: CtaBannerProps) {
  const scrollToForm = (e: React.MouseEvent) => {
    if (primaryHref.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(primaryHref.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="relative my-14 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0062e0] via-[#1d4ed8] to-[#1e40af] p-8 sm:p-12 text-center text-white shadow-2xl shadow-blue-500/25">
        {/* Glow streaks */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-black uppercase tracking-wider mb-4 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Embassy Submission Format</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={primaryHref}
              onClick={scrollToForm}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#0062e0] shadow-xl shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-2xl active:translate-y-0"
            >
              <Download className="w-5 h-5" />
              <span>{primaryButtonText}</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-blue-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Option</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-200" />
              <span>Instant PDF in 30 Seconds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>Embassy-Compliant PNR Layout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-200" />
              <span>195+ Countries Accepted</span>
            </div>
          </div>

          {/* Hotel booking cross-link card */}
          {showHotelLink && (
            <div className="mt-8 pt-8 border-t border-white/15">
              <Link
                href="/hotel-booking"
                className="group inline-flex items-center justify-between gap-4 w-full max-w-lg mx-auto p-4 rounded-2xl bg-white/10 border border-white/20 text-left transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Need proof of accommodation too?</div>
                    <div className="text-xs text-blue-100">Generate an embassy hotel reservation confirmation</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Free Hotel Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
