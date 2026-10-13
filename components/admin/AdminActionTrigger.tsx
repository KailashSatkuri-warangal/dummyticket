'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminActionTrigger({
  label,
  payload,
  variant = 'primary',
}: {
  label: string;
  payload: Record<string, unknown>;
  variant?: 'primary' | 'secondary' | 'warning';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  async function handleRun() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        message?: string;
        error?: string;
        success?: boolean;
      };
      if (res.ok) {
        setFeedback({
          ok: true,
          text: data.message ?? 'Action completed and recorded in audit logs.',
        });
        router.refresh();
      } else {
        setFeedback({
          ok: false,
          text: data.error ?? 'Operation rejected by server policy.',
        });
      }
    } catch {
      setFeedback({ ok: false, text: 'Network error.' });
    } finally {
      setLoading(false);
    }
  }

  const btnStyle =
    variant === 'warning'
      ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
      : variant === 'secondary'
      ? 'border border-slate-200 bg-white text-navy-900 hover:bg-slate-50'
      : 'bg-brand-600 text-white hover:bg-brand-700';

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleRun}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${btnStyle}`}
      >
        {loading ? 'Processing...' : label}
      </button>
      {feedback && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
            feedback.ok ? 'text-verified-700' : 'text-red-600'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-3 w-3 shrink-0" />
          ) : (
            <AlertCircle className="h-3 w-3 shrink-0" />
          )}
          {feedback.text}
        </span>
      )}
    </div>
  );
}
