import React from 'react';
import { getPlatformStore } from '@/lib/booking/store';

export default function AdminAuditLogsPage() {
  const store = getPlatformStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Immutable Security & Operational Audit Logs
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Records administrator identity, action, affected resource, timestamp, correlation ID, and sanitized before/after metadata. Never logs passwords, secrets, or raw card numbers.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2.5">Timestamp</th>
              <th className="px-3 py-2.5">Actor</th>
              <th className="px-3 py-2.5">Action</th>
              <th className="px-3 py-2.5">Resource</th>
              <th className="px-3 py-2.5">Correlation ID</th>
              <th className="px-3 py-2.5">After State Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {store.auditLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                  {new Date(log.createdAt).toLocaleString('en-IN')}
                </td>
                <td className="px-3 py-3 font-semibold text-navy-900">
                  {log.actorEmail}
                </td>
                <td className="px-3 py-3 font-mono font-bold text-brand-700">
                  {log.action}
                </td>
                <td className="px-3 py-3 font-mono">
                  {log.resourceType}/{log.resourceId}
                </td>
                <td className="px-3 py-3 font-mono text-slate-500">
                  {log.correlationId}
                </td>
                <td className="px-3 py-3 font-mono text-[11px] text-slate-600">
                  {JSON.stringify(log.afterState ?? {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
