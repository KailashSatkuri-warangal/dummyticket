'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Plane, Sparkles, Key, AlertCircle } from 'lucide-react';

export function AdminLoginGate() {
  const router = useRouter();
  const [username, setUsername] = useState('admin0722');
  const [password, setPassword] = useState('D1Q0!@!).');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.reload();
      } else {
        setError(data.error || 'Invalid admin credentials');
      }
    } catch {
      setError('Connection failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#070e1c] via-[#0B1528] to-[#040810] text-white">
      {/* 3D Glassmorphic Card Container */}
      <div
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-blue-500/30 bg-white/5 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,98,224,0.25)] relative overflow-hidden transition-all duration-500 hover:border-blue-400/50"
        style={{
          transform: 'perspective(1000px) rotateX(1deg)',
        }}
      >
        {/* Ambient Underglow Lights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#0062e0]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1d4ed8]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-3 mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0062e0] to-[#38bdf8] flex items-center justify-center text-white shadow-lg shadow-blue-500/40 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Operations Portal
          </h1>
          <p className="text-xs text-blue-200/80">
            Authorized Personnel Only • Dynamic Backend & Leads Controller
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-blue-300 mb-2">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-400/30 bg-black/40 text-sm font-bold text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-blue-300 mb-2">
              Security Key / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-400/30 bg-black/40 text-sm font-bold text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#0062e0] text-white font-black text-sm tracking-wide shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-blue-200" />
            <span>{loading ? 'Authenticating System...' : 'Unlock Operations Console'}</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] text-blue-300/60 font-mono">
            DummyTicket Secure Kernel v2.4 • 256-Bit TLS
          </span>
        </div>
      </div>
    </div>
  );
}
