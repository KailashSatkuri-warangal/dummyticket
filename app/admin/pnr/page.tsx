import React from 'react';
import { listAllBookings } from '@/lib/booking/store';
import { PnrManagerClient } from './PnrManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPnrPage() {
  const bookings = await listAllBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800">
            Module 6 · Critical Reservation Core
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            PNR & Reservation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict separation between internal DummyTickets booking references and legitimate provider-issued airline PNRs. Inspect, audit, verify and update reservation hold records.
          </p>
        </div>
      </div>

      <PnrManagerClient initialBookings={bookings} />
    </div>
  );
}
