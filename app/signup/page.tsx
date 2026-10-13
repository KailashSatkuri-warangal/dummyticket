'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-elevated space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Create Your Travel Account
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Access booking history, downloadable itineraries, and instant fare alerts.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Arjun Reddy"
              className="input-field"
            />
          </div>
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
          <div>
            <label className="form-label">
              Password (minimum 8 characters) *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-600"
            />
            <span>
              Optional: Send me seasonal route guides and promotional coupon codes.
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full py-3"
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
