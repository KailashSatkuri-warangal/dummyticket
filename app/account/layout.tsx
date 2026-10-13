import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Ticket,
  FileText,
  Bell,
  User,
  Shield,
} from 'lucide-react';
import { getCurrentSessionUser } from '@/lib/security/auth';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentSessionUser();

  const navItems = [
    { href: '/account', label: 'Overview', icon: LayoutDashboard },
    { href: '/account/bookings', label: 'My Bookings', icon: Ticket },
    { href: '/account/tickets', label: 'Sample Tickets & PDFs', icon: FileText },
    { href: '/account/notifications', label: 'Notifications', icon: Bell },
    { href: '/account/profile', label: 'Profile & Preferences', icon: User },
    { href: '/account/security', label: 'Security & Privacy', icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="eyebrow">
              Customer Portal
            </p>
            <h2 className="mt-1 text-base font-extrabold text-navy-900">
              {user.fullName}
            </h2>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>

            <nav
              aria-label="Customer Account Navigation"
              className="mt-5 space-y-1"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-brand-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
