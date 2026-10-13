'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function establishSession() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setSessionError('Authentication is not configured.');
        setReady(true);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const tokenHash = params.get('token_hash');

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });
          if (error) throw error;
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!session) {
            throw new Error(
              'This reset link is invalid or has expired. Request a new one from the forgot password page.'
            );
          }
        }
      } catch (err) {
        setSessionError(
          err instanceof Error
            ? err.message
            : 'This reset link is invalid or has expired.'
        );
      }
      setReady(true);
    }

    establishSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setUpdated(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="card space-y-5 p-6 shadow-elevated sm:p-8">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Set a New Password
        </h1>

        {!ready && (
          <div className="flex items-center gap-2 py-6 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
            Validating your reset link...
          </div>
        )}

        {ready && sessionError && (
          <div className="space-y-4">
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {sessionError}
            </p>
            <Link href="/forgot-password" className="btn btn-primary w-full py-3">
              Request a New Reset Link
            </Link>
          </div>
        )}

        {ready && !sessionError && updated && (
          <div className="rounded-xl bg-verified-50 p-4 text-xs text-verified-700 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Your password has been updated.
            </p>
            <Link href="/account" className="font-bold text-brand-700 underline">
              Continue to your dashboard →
            </Link>
          </div>
        )}

        {ready && !sessionError && !updated && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">New Password *</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
