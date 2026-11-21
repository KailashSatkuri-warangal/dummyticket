import React from 'react';
import { listAllProfiles } from '@/lib/booking/store';
import { RolesManagerClient } from './RolesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminRolesPage() {
  const profiles = await listAllProfiles();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-200 text-slate-800">
            Module 18 · Security & RBAC Governance
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Admin Roles & Permission Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access control (RBAC) across 7 enterprise administrative tiers. Configure granular access across bookings, flight operations, finance, and system settings.
          </p>
        </div>
      </div>

      <RolesManagerClient initialProfiles={profiles} />
    </div>
  );
}
