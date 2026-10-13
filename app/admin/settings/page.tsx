import React from 'react';
import { getBrandConfig } from '@/lib/config/brand';

export default function AdminSettingsPage() {
  const brand = getBrandConfig();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Site Branding & Integration Configuration
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review active brand settings, inventory operating mode, and environment variable connection status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-slate-200 p-4 space-y-1">
          <p className="text-slate-500">Configured Brand Name</p>
          <p className="text-sm font-bold text-navy-900">{brand.name}</p>
          <p className="text-slate-500">Support: {brand.supportEmail}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 space-y-1">
          <p className="text-slate-500">Inventory Operating Mode</p>
          <p className="text-sm font-bold uppercase text-verified-700">
            {brand.inventoryMode}
          </p>
          <p className="text-slate-500">
            Supabase Live: {brand.supabaseConfigured ? 'Connected' : 'Not Configured — Run Migrations'} ·
            Razorpay Live Key: {brand.razorpayConfigured ? 'Configured' : 'Sandbox Test Mode'}
          </p>
        </div>
      </div>
    </div>
  );
}
