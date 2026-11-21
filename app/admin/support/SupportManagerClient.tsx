'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Mail,
  Ticket,
  Send,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import type { SupportRequestRecord } from '@/lib/booking/store';

export function SupportManagerClient({
  initialRequests,
}: {
  initialRequests: SupportRequestRecord[];
}) {
  const [requests, setRequests] = useState<SupportRequestRecord[]>(initialRequests);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTicket, setActiveTicket] = useState<SupportRequestRecord | null>(null);

  // Modal State
  const [newStatus, setNewStatus] = useState<SupportRequestRecord['status']>('in_progress');
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q) ||
      (r.bookingReference && r.bookingReference.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === 'new').length;
  const inProgressCount = requests.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length;

  function openReplyModal(ticket: SupportRequestRecord) {
    setActiveTicket(ticket);
    setNewStatus(ticket.status === 'new' ? 'in_progress' : ticket.status);
    setReplyText(ticket.adminReply || '');
  }

  async function handleSaveReply(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTicket) return;
    setSaving(true);
    setSuccessBanner(null);

    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_SUPPORT_STATUS',
          supportId: activeTicket.id,
          status: newStatus,
          reply: replyText.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update support ticket');
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === activeTicket.id
            ? { ...r, status: newStatus, adminReply: replyText.trim() || r.adminReply }
            : r
        )
      );

      setSuccessBanner(`Ticket #${activeTicket.id} updated to ${newStatus}.`);
      setActiveTicket(null);
    } catch (err: any) {
      alert(err.message || 'Error updating ticket');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{successBanner}</span>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Inquiries</span>
          <div className="text-2xl font-black text-navy-900 mt-1">{totalCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">All customer requests</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">New / Unopened</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{newCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting first response</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Progress</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{inProgressCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Being reviewed by support</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Successfully completed</p>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search traveler name, subject, email, booking ref..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-white shadow text-navy-900' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'new' ? 'bg-white shadow text-rose-700' : ''}`}
          >
            New ({newCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'in_progress' ? 'bg-white shadow text-amber-700' : ''}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'resolved' ? 'bg-white shadow text-emerald-700' : ''}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Support Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3.5">Inquiry Subject & Message</th>
                <th className="p-3.5">Traveler Name</th>
                <th className="p-3.5">Associated Ref</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <div className="font-bold text-navy-900 text-sm block">{r.subject}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {r.message}
                      </p>
                      {r.adminReply && (
                        <div className="mt-1.5 p-2 bg-blue-50/80 rounded-lg text-[10px] text-brand-800 font-medium">
                          <strong>Admin Reply:</strong> {r.adminReply}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-navy-900">{r.name}</div>
                      <span className="text-[11px] text-slate-400 block">{r.email}</span>
                    </td>
                    <td className="p-3.5">
                      {r.bookingReference ? (
                        <a
                          href={`/booking/${r.bookingReference}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-black text-brand-700 hover:underline"
                        >
                          {r.bookingReference}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">General Inquiry</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : r.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${
                          r.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : r.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.status === 'resolved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 mr-1" />
                        )}
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openReplyModal(r)}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold border border-brand-200 inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No support inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply / Status Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-black text-navy-900 flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-rose-600" />
                  Manage Inquiry: {activeTicket.name}
                </h2>
                <p className="text-[11px] text-slate-500">{activeTicket.email}</p>
              </div>
              <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Subject</div>
                <div className="text-sm font-black text-navy-900 mt-0.5">{activeTicket.subject}</div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{activeTicket.message}</p>
                {activeTicket.bookingReference && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Associated Ref: <strong className="font-mono text-brand-700">{activeTicket.bookingReference}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="new">New (Unopened)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Administrative Reply / Resolution Note</label>
                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide resolution details or message sent to traveler..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black shadow-md shadow-brand-500/20 inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Update & Record Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
