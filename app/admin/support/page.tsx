import React from 'react';
import { listAllSupportRequests } from '@/lib/booking/store';
import { SupportManagerClient } from './SupportManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const requests = await listAllSupportRequests();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800">
            Module 14 · Traveler Service Desk
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Support Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Handle customer inquiries, visa appointment schedule changes, itinerary adjustments, and refund assistance with full audit history.
          </p>
        </div>
      </div>

      <SupportManagerClient initialRequests={requests} />
    </div>
  );
}
