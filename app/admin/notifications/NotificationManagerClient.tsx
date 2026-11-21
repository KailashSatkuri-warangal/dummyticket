'use client';

import React, { useState, useMemo } from 'react';
import { Bell, Search, CheckCircle2, Clock, CheckCheck } from 'lucide-react';
import type { NotificationItem } from '@/types';

export function NotificationManagerClient({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread' && n.isRead) return false;
      if (filter === 'read' && !n.isRead) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.bookingReference && n.bookingReference.toLowerCase().includes(q))
      );
    });
  }, [notifications, search, filter]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Event Dispatch Audit</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              System & Customer Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live audit of notifications dispatched for bookings, payments, cancellations, and administrative events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#0062e0]" />
              <span>Mark All as Read</span>
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications by title, booking reference, message..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:border-[#0062e0] focus:ring-1 focus:ring-[#0062e0] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'unread', 'read'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-2 rounded-xl font-bold uppercase text-[11px] transition-colors ${
                  filter === tab
                    ? 'bg-[#0062e0] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Stream */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-800">No notifications found</p>
          <p className="mt-1">Real-time alerts will appear here as users interact with the platform.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-sm">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#0062e0]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {n.bookingReference && (
                  <div className="text-[11px] font-mono text-[#0062e0] font-bold">
                    Ref: {n.bookingReference}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(n.createdAt).toLocaleDateString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-[#0062e0]'
                    }`}
                  >
                    {n.isRead ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
