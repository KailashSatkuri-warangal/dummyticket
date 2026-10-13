'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-elevated space-y-5">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Reset Your Password
        </h1>
        <p className="text-xs text-slate-600">
          Enter your registered email address and we will dispatch a secure password reset link.
        </p>

        {sent ? (
          <div className="rounded-xl bg-verified-50 border border-verified-100 p-4 text-xs text-verified-700 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Password reset instructions queued for {email}
            </p>
            <Link
              href="/reset-password"
              className="inline-block font-semibold text-brand-700 underline"
            >
              Proceed to Reset Password Form →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center text-xs">
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
