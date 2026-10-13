'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    document.cookie = `aerovista_role=${roleMode}; path=/; max-age=86400`;
    document.cookie = `aerovista_email=${encodeURIComponent(email)}; path=/; max-age=86400`;
    router.push(roleMode === 'admin' ? '/admin' : '/account');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="card space-y-6 p-6 shadow-elevated sm:p-8">
        <div>
          <span className="eyebrow">Supabase Auth & Session Portal</span>
          <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
            Sign In to Your Account
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Manage bookings, download sample itineraries, and view real-time notifications.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Account Portal</label>
            <select
              value={roleMode}
              onChange={(e) =>
                setRoleMode(e.target.value as 'customer' | 'admin')
              }
              className="input-field cursor-pointer"
            >
              <option value="customer">Customer Account</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3"
          >
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
          Protected by Supabase Row Level Security
        </p>
      </div>
    </div>
  );
}
