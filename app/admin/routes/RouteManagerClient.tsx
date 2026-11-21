'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Plane,
  TrendingUp,
  Sliders,
  X,
} from 'lucide-react';
import { formatInr } from '@/lib/config/brand';

interface RouteRow {
  id: string;
  slug?: string;
  origin_iata: string;
  destination_iata: string;
  origin_city: string;
  destination_city: string;
  starting_fare_inr: number;
  daily_flights_count: number;
  meta_title?: string;
  is_active?: boolean;
}

export function RouteManagerClient({ initialRoutes }: { initialRoutes: any[] }) {
  const [routes, setRoutes] = useState<RouteRow[]>(
    initialRoutes.map((r) => ({
      ...r,
      is_active: r.is_active !== undefined ? r.is_active : true,
      starting_fare_inr: Number(r.starting_fare_inr) || 399,
      daily_flights_count: Number(r.daily_flights_count) || 2,
    }))
  );

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteRow | null>(null);

  // Form State
  const [originCity, setOriginCity] = useState('');
  const [originIata, setOriginIata] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationIata, setDestinationIata] = useState('');
  const [startingFare, setStartingFare] = useState(399);
  const [dailyFlights, setDailyFlights] = useState(2);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredRoutes = routes.filter((r) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.origin_city.toLowerCase().includes(q) ||
      r.destination_city.toLowerCase().includes(q) ||
      r.origin_iata.toLowerCase().includes(q) ||
      r.destination_iata.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? r.is_active !== false
        : r.is_active === false;

    return matchesQuery && matchesStatus;
  });

  const activeCount = routes.filter((r) => r.is_active !== false).length;
  const avgFare = Math.round(
    routes.reduce((acc, r) => acc + (r.starting_fare_inr || 399), 0) / (routes.length || 1)
  );

  function openCreateModal() {
    setEditingRoute(null);
    setOriginCity('');
    setOriginIata('');
    setDestinationCity('');
    setDestinationIata('');
    setStartingFare(399);
    setDailyFlights(2);
    setIsActive(true);
    setModalOpen(true);
  }

  function openEditModal(route: RouteRow) {
    setEditingRoute(route);
    setOriginCity(route.origin_city);
    setOriginIata(route.origin_iata);
    setDestinationCity(route.destination_city);
    setDestinationIata(route.destination_iata);
    setStartingFare(route.starting_fare_inr);
    setDailyFlights(route.daily_flights_count);
    setIsActive(route.is_active !== false);
    setModalOpen(true);
  }

  async function handleSaveRoute(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const id = editingRoute ? editingRoute.id : `route-${originIata.toLowerCase()}-${destinationIata.toLowerCase()}`;
    const slug = `${originIata.toLowerCase()}-to-${destinationIata.toLowerCase()}-flights`;
    const payload = {
      id,
      slug,
      origin_city: originCity.trim(),
      origin_iata: originIata.trim().toUpperCase(),
      destination_city: destinationCity.trim(),
      destination_iata: destinationIata.trim().toUpperCase(),
      starting_fare_inr: Number(startingFare),
      daily_flights_count: Number(dailyFlights),
      is_active: isActive,
      meta_title: `Dummy Ticket & Flight Itinerary from ${originCity} to ${destinationCity}`,
    };

    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CATALOG_UPSERT',
          entity: 'route_page',
          record: payload,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save route');
      }

      setRoutes((prev) => {
        const idx = prev.findIndex((r) => r.id === id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = payload;
          return next;
        }
        return [payload, ...prev];
      });

      setMessage(`Route ${payload.origin_iata} → ${payload.destination_iata} saved successfully.`);
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error saving route');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(route: RouteRow) {
    const updated = !route.is_active;
    try {
      await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CATALOG_UPSERT',
          entity: 'route_page',
          record: {
            ...route,
            is_active: updated,
          },
        }),
      });

      setRoutes((prev) =>
        prev.map((r) => (r.id === route.id ? { ...r, is_active: updated } : r))
      );
    } catch {
      alert('Failed to update route status');
    }
  }

  async function handleDelete(routeId: string) {
    if (!confirm('Are you sure you want to deactivate and remove this route?')) return;

    try {
      await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CATALOG_DELETE',
          entity: 'route_page',
          id: routeId,
        }),
      });

      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    } catch {
      alert('Failed to delete route');
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Routes</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{routes.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Configured pairs</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Routes</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Visible to customers</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Inactive</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{routes.length - activeCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Hidden from search</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Avg Starting Fare</span>
          <div className="text-2xl font-black text-brand-700 mt-1">{formatInr(avgFare)}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Platform base rate</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Add Route */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, IATA code (e.g. DEL, London)..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-white shadow text-navy-900' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg ${statusFilter === 'active' ? 'bg-white shadow text-emerald-700' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded-lg ${statusFilter === 'inactive' ? 'bg-white shadow text-amber-700' : ''}`}
            >
              Inactive
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-black hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Route
          </button>
        </div>
      </div>

      {/* Route Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">Route (Origin → Destination)</th>
                <th className="p-3.5">IATA Pair</th>
                <th className="p-3.5">Starting Fare</th>
                <th className="p-3.5">Daily Flights</th>
                <th className="p-3.5">Customer Visibility</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.map((route) => {
                const active = route.is_active !== false;
                return (
                  <tr key={route.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center font-bold">
                          <Plane className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-navy-900 block text-sm">
                            {route.origin_city} → {route.destination_city}
                          </span>
                          <span className="text-[11px] text-slate-400">Slug: {route.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-black text-brand-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs border border-blue-200">
                        {route.origin_iata} ⇄ {route.destination_iata}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-navy-900">
                      {formatInr(route.starting_fare_inr)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-700">
                      {route.daily_flights_count} departures / day
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleStatus(route)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black cursor-pointer transition-colors ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(route)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="Edit Route"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                          title="Delete Route"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No routes found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Route */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-600" />
                {editingRoute ? 'Edit Route & Pricing' : 'Add New Flight Route'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Origin City *</label>
                  <input
                    type="text"
                    required
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Origin IATA *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={originIata}
                    onChange={(e) => setOriginIata(e.target.value.toUpperCase())}
                    placeholder="DEL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-black focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="London"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Destination IATA *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={destinationIata}
                    onChange={(e) => setDestinationIata(e.target.value.toUpperCase())}
                    placeholder="LHR"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-black focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Starting Base Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    min={99}
                    step={10}
                    value={startingFare}
                    onChange={(e) => setStartingFare(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-brand-700 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Daily Flights Count</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={dailyFlights}
                    onChange={(e) => setDailyFlights(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span>Route Active & Searchable</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black shadow-md shadow-brand-500/20"
                  >
                    {saving ? 'Saving...' : editingRoute ? 'Update Route' : 'Create Route'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
