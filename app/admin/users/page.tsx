import React from 'react';
import { getPlatformStore } from '@/lib/booking/store';

export default function AdminUsersPage() {
  const store = getPlatformStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          User Accounts & Authorized Role Assignments
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Inspect permitted user records, role assignments, and account security states.
        </p>
      </div>

      {store.users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No registered users yet</p>
          <p className="mt-1 text-slate-500">
            Registered accounts from Supabase Auth will be listed here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Full Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Phone</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {store.users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-bold text-navy-900">
                    {u.fullName}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone}</td>
                  <td className="px-4 py-3 uppercase font-mono font-bold text-brand-700">
                    {u.role}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-verified-50 px-2 py-0.5 text-[11px] font-semibold text-verified-700">
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

