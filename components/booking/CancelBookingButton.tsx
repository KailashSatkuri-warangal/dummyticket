'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function CancelBookingButton({
  bookingReference,
  disabled,
}: {
  bookingReference?: string;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Strict No-Refund & No-Cancellation Policy</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-normal">
        All flight itinerary reservations, onward tickets, and travel documents are final and strictly non-refundable once requested.
      </p>
    </div>
  );
}
