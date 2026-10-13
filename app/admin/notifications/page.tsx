import React from 'react';
import { getPlatformStore } from '@/lib/booking/store';

export default function AdminNotificationsPage() {
  const store = getPlatformStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          System & Customer Notifications Log
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Inspect real-time notifications dispatched to customer accounts.
        </p>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {store.notifications.map((n) => (
          <div key={n.id} className="py-3 flex justify-between">
            <div>
              <p className="font-bold text-navy-900">{n.title}</p>
              <p className="text-slate-600">{n.message}</p>
            </div>
            <span className="font-mono text-slate-400">
              {n.isRead ? 'Read' : 'Unread'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
