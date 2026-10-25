import React from 'react';
import { listCatalog } from '@/lib/booking/store';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';
import { Plane, Tag, DollarSign, ShieldCheck } from 'lucide-react';

const FLIGHT_COLUMNS: CrudColumn[] = [
  {
    key: 'flight_number',
    label: 'Flight No.',
    type: 'text',
    required: true,
    placeholder: 'e.g. 6E-276, AI-542, UK-819',
  },
  {
    key: 'airline_name',
    label: 'Airline',
    type: 'text',
    required: true,
    placeholder: 'e.g. IndiGo, Air India, Emirates',
  },
  {
    key: 'origin_iata',
    label: 'Origin',
    type: 'text',
    required: true,
    placeholder: 'e.g. HYD, DEL, BOM',
  },
  {
    key: 'destination_iata',
    label: 'Dest',
    type: 'text',
    required: true,
    placeholder: 'e.g. DEL, BOM, BLR, DXB',
  },
  {
    key: 'cabin',
    label: 'Cabin',
    type: 'select',
    required: true,
    options: [
      { value: 'economy', label: 'Economy' },
      { value: 'premium_economy', label: 'Premium Economy' },
      { value: 'business', label: 'Business' },
      { value: 'first', label: 'First Class' },
    ],
  },
  {
    key: 'total_fare_inr',
    label: 'Total Fare (₹)',
    type: 'number',
    required: true,
    placeholder: 'e.g. 4500',
  },
  {
    key: 'base_fare_inr',
    label: 'Base Fare (₹)',
    type: 'number',
    placeholder: 'e.g. 3500',
  },
  {
    key: 'taxes_inr',
    label: 'Taxes (₹)',
    type: 'number',
    placeholder: 'e.g. 630',
  },
  {
    key: 'service_fee_inr',
    label: 'Fee (₹)',
    type: 'number',
    placeholder: 'e.g. 370',
  },
  {
    key: 'duration_minutes',
    label: 'Duration (m)',
    type: 'number',
    placeholder: 'e.g. 135',
  },
  {
    key: 'stops_count',
    label: 'Stops',
    type: 'number',
    placeholder: '0 for nonstop, 1, 2',
  },
  {
    key: 'cabin_baggage_kg',
    label: 'Cabin Bag (kg)',
    type: 'number',
    placeholder: '7',
  },
  {
    key: 'checked_baggage_kg',
    label: 'Check-in Bag (kg)',
    type: 'number',
    placeholder: '15',
  },
  {
    key: 'seats_available',
    label: 'Seats',
    type: 'number',
    placeholder: '9',
  },
  {
    key: 'inventory_mode',
    label: 'Mode',
    type: 'select',
    options: [
      { value: 'live_provider', label: 'Live Provider' },
      { value: 'sample_demo', label: 'Sample Demo' },
    ],
  },
  {
    key: 'is_active',
    label: 'Status',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ],
  },
];

export default async function AdminFlightsPage() {
  const flights = await listCatalog('flight');

  // Compute live statistics for admin oversight
  const activeCount = flights.filter((f) => f.is_active !== false).length;
  const avgFare =
    flights.length > 0
      ? Math.round(
          flights.reduce((acc, f) => acc + (Number(f.total_fare_inr) || 0), 0) /
            flights.length
        )
      : 0;
  const minFare =
    flights.length > 0
      ? Math.min(...flights.map((f) => Number(f.total_fare_inr) || 999999))
      : 0;

  return (
    <div className="space-y-6">
      {/* Overview & Pricing Operations Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              <Plane className="h-4 w-4" />
              <span>Inventory & Live Pricing Operations</span>
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 mt-1">
              Flight Inventory & Total Fare Management
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Full interactive CRUD controls for flight offers. Edit any flight&#39;s <strong>Total Fare (₹)</strong>, base fare, statutory taxes, cabin classes, duration, or baggage rules. All adjustments persist and reflect in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-center min-w-[90px]">
              <div className="text-[11px] font-medium text-slate-500">Active Flights</div>
              <div className="text-lg font-black text-navy-900">{activeCount}</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-center min-w-[100px]">
              <div className="text-[11px] font-medium text-slate-500">Avg Total Fare</div>
              <div className="text-lg font-black text-brand-700">₹{avgFare.toLocaleString('en-IN')}</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-center min-w-[100px]">
              <div className="text-[11px] font-medium text-slate-500">Starting From</div>
              <div className="text-lg font-black text-emerald-600">₹{minFare.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Quick Batch Adjustments */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5 mr-1">
              <Tag className="h-3.5 w-3.5 text-brand-600" />
              Quick Dynamic Surcharge:
            </span>
            <AdminActionTrigger
              label="+₹500 Peak Season Adj"
              variant="secondary"
              payload={{
                action: 'SET_FARE_ADJUSTMENT',
                flightOfferId: 'offer-hyd-del-1',
                deltaInr: 500,
              }}
            />
            <AdminActionTrigger
              label="+₹800 Tier Adj"
              variant="secondary"
              payload={{
                action: 'SET_FARE_ADJUSTMENT',
                flightOfferId: 'offer-hyd-del-2',
                deltaInr: 800,
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Audited & verified fare transparency</span>
          </div>
        </div>
      </div>

      {/* Main CRUD Table */}
      <CrudManager
        entity="flight"
        title={`Flights & Fare Management (${flights.length})`}
        description="Add new flights, edit Total Fare directly, modify routes, cabin classes, and baggage rules. Click Edit on any row to update its Total Fare."
        columns={FLIGHT_COLUMNS}
        rows={flights}
        emptyHint="No flight records found. Click 'Add New' to configure a flight."
      />
    </div>
  );
}
