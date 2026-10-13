'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, MailCheck } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNeedsConfirmation(false);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError('Authentication is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      if (signInError.message === 'Email not confirmed') {
        setNeedsConfirmation(true);
      } else {
        setError(
          signInError.message === 'Invalid login credentials'
            ? 'Incorrect email or password. Please try again.'
            : signInError.message
        );
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      if (nextPath && nextPath.startsWith('/')) {
        router.push(nextPath);
      } else {
        router.push('/account');
      }
      router.refresh();
      return;
    }

    setLoading(false);
  }

  return (
    <div className="card space-y-6 p-6 shadow-elevated sm:p-8">
      <div>
        <span className="eyebrow">Welcome Back</span>
        <h1 className="section-heading mt-1">Sign In to Your Account</h1>
        <p className="mt-1 text-xs text-slate-600">
          Manage bookings, download itineraries, and view real-time notifications.
        </p>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      {needsConfirmation && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          <p className="flex items-start gap-2 font-semibold">
            <MailCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your email isn&apos;t confirmed yet.
          </p>
          <p className="mt-1">
            Open the confirmation link we emailed you, then sign in again.{' '}
            <Link href="/verify-email" className="font-bold underline">
              Resend confirmation
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <div className="form-label flex items-center justify-between">
            <span>Password</span>
            <Link href="/forgot-password" className="text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field pl-9"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-brand-600 hover:underline">
          Create an Account
        </Link>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-verified-600" />
        Protected by Supabase Auth & Row Level Security
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <React.Suspense fallback={<div className="skeleton h-96 w-full rounded-2xl" />}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
