'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  Mail,
  Plane,
  Calendar,
  AlertCircle,
  Filter,
  RefreshCw,
  Sparkles,
  Download,
  IndianRupee,
} from 'lucide-react';
import type { LeadRecord } from '@/lib/booking/store';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'converted' | 'lost'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadRecord['status']) => {
    try {
      setUpdatingId(id);
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.origin && lead.origin.toLowerCase().includes(q)) ||
      (lead.destination && lead.destination.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;
  const estimatedRevenue = convertedLeads * 399;

  return (
    <div className="space-y-6">
      {/* 3D Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-black uppercase tracking-wider">
            <Users className="w-4 h-4" />
            CRM & Lead Inquiries
          </div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Customer Leads & Conversions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realtime tracker for dummy ticket applicants, high-intent travelers, and inquiries.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Leads
        </button>
      </div>

      {/* 3D Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white shadow-sm transition hover:shadow-md hover:-translate-y-1"
          style={{ transform: 'perspective(600px) rotateX(1deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Total Leads</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-900 mt-2">{totalLeads}</div>
          <p className="text-[11px] text-slate-500 mt-1">Direct inquiries & submissions</p>
        </div>

        <div
          className="p-5 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white shadow-sm transition hover:shadow-md hover:-translate-y-1"
          style={{ transform: 'perspective(600px) rotateX(1deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Follow-up</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{newLeads}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires customer contact</p>
        </div>

        <div
          className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white shadow-sm transition hover:shadow-md hover:-translate-y-1"
          style={{ transform: 'perspective(600px) rotateX(1deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Converted</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{convertedLeads}</div>
          <p className="text-[11px] text-slate-500 mt-1">Ticket fulfilled successfully</p>
        </div>

        <div
          className="p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white shadow-sm transition hover:shadow-md hover:-translate-y-1"
          style={{ transform: 'perspective(600px) rotateX(1deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Est. Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-2">₹{estimatedRevenue.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-500 mt-1">Calculated at ₹399/ticket</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'contacted', 'converted', 'lost'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Contact Info</th>
                <th className="px-4 py-3.5">Route & Date</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Notes</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-medium">
                    {loading ? 'Loading customer leads...' : 'No customer leads found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-bold text-navy-900">
                      <div>{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-brand-600" />
                        <a href={`mailto:${lead.email}`} className="hover:underline">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {lead.origin && lead.destination ? (
                        <div className="flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-brand-500" />
                          <span className="font-bold text-navy-900">{lead.origin}</span>
                          <span>→</span>
                          <span className="font-bold text-navy-900">{lead.destination}</span>
                          <span className="text-[10px] text-slate-400">({lead.tripType || 'oneway'})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">General Inquiry</span>
                      )}
                      {lead.departureDate && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Dep: {lead.departureDate}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          lead.plan === 'premium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {lead.plan === 'premium' ? '₹399 Clean' : '₹0 Free'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadRecord['status'])}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border transition focus:outline-none cursor-pointer ${
                          lead.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : lead.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : lead.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate" title={lead.notes}>
                      {lead.notes || '—'}
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      <a
                        href={`mailto:${lead.email}?subject=Your%20Dummy%20Ticket%20Inquiry%20-%20DummyTicket`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-[11px]"
                      >
                        <Mail className="w-3 h-3" />
                        Reply
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
