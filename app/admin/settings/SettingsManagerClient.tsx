'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  Mail,
  Phone,
  Clock,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';
import type { BrandConfig } from '@/lib/config/brand';

export function SettingsManagerClient({
  brand,
}: {
  brand: BrandConfig;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: brand.name,
    supportEmail: brand.supportEmail,
    supportPhone: brand.supportPhone || '+91 800 000 0000',
    inventoryMode: brand.inventoryMode,
    holdHours: 48,
    currency: 'INR',
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);

  const showToast = (message: string, ok = true) => {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 4000);
  };

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_CMS_SETTING',
          settingKey: 'platform_config',
          settingValue: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      showToast('Platform settings saved and applied dynamically!');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Save failed', false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 shadow-2xl text-xs font-bold transition-all ${
            toast.ok
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Executive System Configuration</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Platform Settings & Integrations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Control live inventory operating modes, support routing, booking hold timers, and payment gateway connectivity.
        </p>
      </div>

      {/* Integration Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Supabase Database</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-black text-slate-900">
            {brand.supabaseConfigured ? 'Connected & Active' : 'Hybrid Dual-Layer'}
          </div>
          <div className="text-[11px] text-slate-400">
            PostgreSQL relational store with in-memory resilient fallback.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Razorpay Gateway</span>
            <Lock className="w-4 h-4 text-[#0062e0]" />
          </div>
          <div className="text-sm font-black text-slate-900">
            {brand.razorpayConfigured ? 'Production Live' : 'Test Sandbox Mode'}
          </div>
          <div className="text-[11px] text-slate-400">
            HMAC-SHA256 signature verification & webhooks active.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Inventory Mode</span>
            <Radio className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-black text-slate-900 uppercase">
            {form.inventoryMode}
          </div>
          <div className="text-[11px] text-slate-400">
            Deterministic catalog with authentic GDS PNR issuance.
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
          General & Operations Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Platform Brand Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Support Desk Email</label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Support Phone Hotline</label>
            <input
              type="text"
              value={form.supportPhone}
              onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Ticket Hold Duration</label>
            <select
              value={form.holdHours}
              onChange={(e) => setForm({ ...form, holdHours: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            >
              <option value={24}>24 Hours (Standard Airline Hold)</option>
              <option value={48}>48 Hours (Extended Visa Window)</option>
              <option value={72}>72 Hours (Maximum Provider Window)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Base Accounting Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            >
              <option value="INR">INR (₹ Indian Rupee)</option>
              <option value="USD">USD ($ United States Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">System Maintenance Mode</label>
            <select
              value={form.maintenanceMode ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.value === 'true' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:bg-white focus:border-[#0062e0]"
            >
              <option value="false">Live Online (Accepting Bookings)</option>
              <option value="true">Maintenance Mode (Bookings Paused)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0062e0] text-white font-black text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
