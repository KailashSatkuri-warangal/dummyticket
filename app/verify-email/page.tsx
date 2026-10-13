'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MailCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type VerifyState = 'checking' | 'confirmed' | 'pending' | 'error';

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerifyState>('checking');
  const [email, setEmail] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);

  const verifyFromUrl = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setState('error');
      setErrorMessage('Authentication is not configured.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const tokenHash = params.get('token_hash');
    const type = params.get('type') ?? 'signup';

    try {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        setState('confirmed');
        return;
      }

      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type === 'recovery' ? 'recovery' : 'signup',
        });
        if (error) throw error;
        setState('confirmed');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setState(session ? 'confirmed' : 'pending');
    } catch (err) {
      setState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'This verification link is invalid or has expired.'
      );
    }
  }, []);

  useEffect(() => {
    verifyFromUrl();
  }, [verifyFromUrl]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendMessage('');
    setResendError('');
    setResending(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    setResending(false);
    if (error) {
      setResendError(error.message);
      return;
    }
    setResendMessage(`Confirmation link re-sent to ${email}.`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 text-center">
      <div className="card space-y-4 p-8 shadow-elevated">
        {state === 'checking' && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-600" />
            <h1 className="text-xl font-extrabold text-navy-900">
              Verifying your email...
            </h1>
          </>
        )}

        {state === 'confirmed' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verified-50 text-verified-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900">
              Email Verified
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your email address is confirmed and your account is active.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/account" className="btn btn-primary w-full py-3">
                Continue to Dashboard
              </Link>
              <Link href="/flights" className="btn btn-secondary w-full py-3">
                Search Flights
              </Link>
            </div>
          </>
        )}

        {state === 'pending' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <MailCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900">
              Verify Your Email Address
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the email you registered with and we will resend the
              confirmation link.
            </p>
            <form onSubmit={handleResend} className="space-y-3 text-left">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                aria-label="Email address"
              />
              <button type="submit" disabled={resending} className="btn btn-primary w-full py-3">
                {resending ? 'Sending...' : 'Resend Confirmation Link'}
              </button>
            </form>
            {resendMessage && (
              <p className="text-xs font-semibold text-verified-700">{resendMessage}</p>
            )}
            {resendError && (
              <p className="text-xs font-semibold text-red-600">{resendError}</p>
            )}
            <Link href="/login" className="inline-block text-xs font-semibold text-brand-600 hover:underline">
              ← Back to Sign In
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-50 text-coral-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900">
              Verification Failed
            </h1>
            <p className="text-xs text-slate-600">{errorMessage}</p>
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/login" className="btn btn-primary w-full py-3">
                Back to Sign In
              </Link>
              <Link href="/signup" className="btn btn-secondary w-full py-3">
                Create a New Account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
