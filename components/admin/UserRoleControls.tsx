'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserX, UserCheck } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'support_agent', label: 'Support Agent' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'content_editor', label: 'Content Editor' },
  { value: 'customer', label: 'Customer' },
];

export function UserRoleControls({
  userId,
  roles,
  isSuspended,
}: {
  userId: string;
  roles: string[];
  isSuspended: boolean;
}) {
  const router = useRouter();
  const [role, setRole] = useState(
    roles.find((r) => r !== 'customer') ?? roles[0] ?? 'customer'
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Action failed.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-1.5">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={busy}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-navy-900"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || roles.includes(role)}
          onClick={() =>
            post({ action: 'ASSIGN_ROLE', userId, role })
          }
          className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-700 disabled:opacity-40"
        >
          <ShieldCheck className="h-3 w-3" />
          {roles.includes(role) ? 'Current' : 'Assign'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            post({
              action: 'SET_SUSPENDED',
              userId,
              isSuspended: !isSuspended,
            })
          }
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
            isSuspended
              ? 'border-verified-200 bg-verified-50 text-verified-700 hover:bg-verified-100'
              : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          {isSuspended ? (
            <>
              <UserCheck className="h-3 w-3" /> Reactivate
            </>
          ) : (
            <>
              <UserX className="h-3 w-3" /> Suspend
            </>
          )}
        </button>
      </div>
      {error && <span className="text-[11px] font-semibold text-red-600">{error}</span>}
    </div>
  );
}
