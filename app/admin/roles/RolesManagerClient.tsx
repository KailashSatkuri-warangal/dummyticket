'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Users,
  Lock,
  Edit2,
  X,
  Key,
  ShieldCheck,
} from 'lucide-react';
import type { AdminProfileRow } from '@/lib/booking/store';

const ROLES_CONFIG = [
  {
    role: 'admin',
    label: 'Super Admin',
    desc: 'Unrestricted root access across all 20 modules, database tables, user management, and API secrets.',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    permissions: ['Flights', 'Routes', 'Airlines', 'PNR & Bookings', 'Finance', 'Refunds', 'CMS', 'RBAC & Audit'],
  },
  {
    role: 'booking_manager',
    label: 'Booking Manager',
    desc: 'Manage customer reservations, audit internal references, inspect genuine airline PNRs, and issue itinerary PDFs.',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: ['PNR & Bookings', 'Passenger Registry', 'Guest Customers', 'Itinerary Generation'],
  },
  {
    role: 'flight_manager',
    label: 'Flight Manager',
    desc: 'Create and modify flight schedules, route networks, airport IATA codes, and airline operating partners.',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    permissions: ['Flights Inventory', 'Route Network', 'Airlines', 'Airports'],
  },
  {
    role: 'finance_manager',
    label: 'Finance Manager',
    desc: 'Audit verified Razorpay payments, manage pricing rules, reconcile transactions, and process refund requests.',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    permissions: ['Transactions & Payments', 'Pricing Rules', 'Coupons', 'Refund Processing', 'Financial Reports'],
  },
  {
    role: 'support_manager',
    label: 'Support Manager',
    desc: 'Manage traveler customer desk, update visa inquiry tickets, resend email itineraries, and resolve inquiries.',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    permissions: ['Support Inquiries', 'Email Logs', 'Notifications', 'Traveler Manifests'],
  },
  {
    role: 'content_editor',
    label: 'Content Manager',
    desc: 'Dynamic website CMS management, homepage hero copy, blog publications, reviews, and SEO landing pages.',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    permissions: ['Website CMS', 'Travel Blogs', 'Customer Reviews', 'SEO Meta Titles'],
  },
];

export function RolesManagerClient({
  initialProfiles,
}: {
  initialProfiles: AdminProfileRow[];
}) {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>(initialProfiles);
  const [activeProfile, setActiveProfile] = useState<AdminProfileRow | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function openAssignModal(p: AdminProfileRow) {
    setActiveProfile(p);
    setSelectedRole(p.roles[0] || 'admin');
  }

  async function handleAssignRole(e: React.FormEvent) {
    e.preventDefault();
    if (!activeProfile) return;
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN_ROLE',
          userId: activeProfile.id,
          role: selectedRole,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update role');
      }

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfile.id ? { ...p, roles: [selectedRole as any] } : p
        )
      );

      setMsg(`Role for ${activeProfile.email} updated to ${selectedRole}.`);
      setActiveProfile(null);
    } catch (err: any) {
      alert(err.message || 'Error assigning role');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES_CONFIG.map((rc) => (
          <div
            key={rc.role}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-navy-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  {rc.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${rc.badge}`}>
                  {rc.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{rc.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Granted Modules
              </span>
              <div className="flex flex-wrap gap-1">
                {rc.permissions.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assigned Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-navy-900">Active Administrative Accounts</h2>
            <p className="text-[11px] text-slate-500">Personnel with configured access permissions</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{profiles.length} total accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Assigned Roles</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => {
                const primaryRole = p.roles[0] || 'admin';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-navy-900 text-sm">{p.fullName}</div>
                      <span className="text-[11px] text-slate-400">{p.email}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.roles.map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-brand-700 border border-blue-200"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      {new Date(p.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAssignModal(p)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Reassign</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-brand-600" />
                  Assign Enterprise Role
                </h2>
                <p className="text-[11px] text-slate-500">{activeProfile.email}</p>
              </div>
              <button onClick={() => setActiveProfile(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-2">Select Primary Role Scope</label>
                <div className="space-y-2">
                  {ROLES_CONFIG.map((rc) => (
                    <label
                      key={rc.role}
                      className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                        selectedRole === rc.role
                          ? 'border-brand-500 bg-blue-50/60'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="adminRole"
                        value={rc.role}
                        checked={selectedRole === rc.role}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="mt-1 text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <div className="font-black text-navy-900 text-xs">{rc.label}</div>
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                          {rc.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveProfile(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black shadow-md shadow-brand-500/20"
                >
                  {saving ? 'Updating...' : 'Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
