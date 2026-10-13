import React from 'react';
import { FARE_RULES } from '@/lib/flights/dataset';
import { formatInr } from '@/lib/config/brand';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';

export default function AdminPricingPage() {
  const rules = Object.values(FARE_RULES);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h1 className="text-xl font-extrabold text-navy-900">
          Dynamic Pricing Engine & Fare Rule Configuration
        </h1>
        <p className="text-xs text-slate-600">
          Configure base fares, cabin multipliers, statutory taxes, and transparent platform service fees. Any fare increase triggers mandatory user acceptance at checkout.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <AdminActionTrigger
            label="Apply +₹1,200 Adjustment on HYD→MSY Offer 1"
            payload={{
              action: 'SET_FARE_ADJUSTMENT',
              flightOfferId: 'offer-hyd-msy-1',
              deltaInr: 1200,
            }}
          />
          <AdminActionTrigger
            label="Reset HYD→MSY Offer 1 Adjustment to ₹0"
            variant="secondary"
            payload={{
              action: 'SET_FARE_ADJUSTMENT',
              flightOfferId: 'offer-hyd-msy-1',
              deltaInr: 0,
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-navy-900">
          Configured Fare Rules & Baggage Tiers
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rules.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 p-4 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">{r.name}</span>
                <span className="font-mono text-brand-700 font-semibold">
                  {r.code}
                </span>
              </div>
              <p className="text-slate-600">
                Cabin: {r.cabin.toUpperCase()} · Refundable:{' '}
                {r.isRefundable ? 'Yes' : 'No'}
              </p>
              <p className="text-slate-600">
                Cancellation Fee: {formatInr(r.cancellationFeeInr)} · Change Fee:{' '}
                {formatInr(r.changeFeeInr)}
              </p>
              <p className="text-slate-500">{r.termsSummary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
