import React from 'react';
import { CONFIGURED_COUPONS } from '@/lib/pricing/engine';
import { formatInr } from '@/lib/config/brand';

export default function AdminCouponsPage() {
  const coupons = Object.values(CONFIGURED_COUPONS);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Promotional Codes & Discount Rules
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Active promo codes validated by the server-side pricing engine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="rounded-xl border border-slate-200 p-4 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-extrabold text-brand-700">
                {c.code}
              </span>
              <span className="rounded bg-verified-50 px-2 py-0.5 font-semibold text-verified-700">
                {c.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="font-semibold text-navy-900">{c.description}</p>
            <p className="text-slate-500">
              Minimum Order: {formatInr(c.minOrderAmountInr)} · Max Discount:{' '}
              {formatInr(c.maxDiscountInr)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
