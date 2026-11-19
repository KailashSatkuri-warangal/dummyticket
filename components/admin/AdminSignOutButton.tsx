'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

export function AdminSignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.reload();
    } catch {
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>{loading ? 'Logging out...' : 'Sign Out Admin'}</span>
    </button>
  );
}
