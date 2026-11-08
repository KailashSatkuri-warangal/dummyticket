'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Ticket, ShieldCheck } from 'lucide-react';

export default function TrackBookingPage() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanRef = reference.trim().toUpperCase();
    if (!cleanRef) return;
    router.push(`/booking/${cleanRef}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-elevated">
        <div className="flex items-center gap-2 eyebrow">
          <Ticket className="h-4 w-4" />
          <span>Booking Reference Lookup</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Track Your Booking & Download Documents
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
          Enter your DummyTicket booking reference to view real-time status and download your PDF documents.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Booking Reference *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="DT-HYD123DEL"
                className="input-field font-mono uppercase font-bold text-navy-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              className="btn btn-primary btn-shimmer w-full sm:w-auto px-7 py-3.5 text-sm font-extrabold shadow-md shadow-brand-600/20"
            >
              <Search className="h-4 w-4" />
              <span>Find Booking Record</span>
            </button>

            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-verified-600" />
              Verified Instant Retrieval
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
