'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AccountProfilePage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [saveTravelerConsent, setSaveTravelerConsent] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Profile & Traveler Preferences
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage your contact details, preferred currency, and explicit traveler storage consent.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-xl">
        <div>
          <label className="form-label">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="form-label">
            Preferred Display Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-navy-900"
          >
            <option value="INR">INR (₹ Indian Rupee)</option>
            <option value="USD">USD ($ US Dollar)</option>
          </select>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={saveTravelerConsent}
            onChange={(e) => setSaveTravelerConsent(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-brand-600"
          />
          <span>
            Explicit Consent: Save my primary traveler name and date of birth to speed up future bookings.
          </span>
        </label>

        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          Save Profile Settings
        </button>

        {saved && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-verified-700">
            <CheckCircle2 className="h-4 w-4" />
            Profile preferences updated.
          </p>
        )}
      </form>
    </div>
  );
}
