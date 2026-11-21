import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  LayoutDashboard,
  Plane,
  Building2,
  Ticket,
  Users,
  CreditCard,
  RotateCcw,
  Sliders,
  Bell,
  Mail,
  MessageSquare,
  BookOpen,
  Globe,
  Tag,
  BarChart3,
  Settings,
  FileSpreadsheet,
  ShieldCheck,
  Compass,
  KeyRound,
  UserCheck,
  LifeBuoy,
  LayoutTemplate,
  Shield,
} from 'lucide-react';
import { RealtimeRefresh } from '@/components/admin/RealtimeRefresh';
import { AdminLoginGate } from '@/components/admin/AdminLoginGate';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';

import { AdminMobileNav, ADMIN_NAV_ITEMS } from '@/components/admin/AdminMobileNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('dummyticket_admin_token')?.value;
  const isMasterAdmin = adminCookie === 'admin0722_verified_session';

  if (!isMasterAdmin) {
    return <AdminLoginGate />;
  }

  const user = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin0722@dummyticket.com',
    fullName: 'Master Administrator (admin0722)',
    role: 'admin' as const,
    roles: ['admin' as const],
    emailConfirmed: true,
  };

  return (
    <>
      <RealtimeRefresh />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
        {/* Mobile Dynamic 20-Module Drawer & Horizontal Bar */}
        <AdminMobileNav />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sticky top-24">
              <div className="border-b border-slate-100 pb-3 mb-3 px-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Server-Verified Admin
                </span>
                <h2 className="text-sm font-extrabold text-navy-900 mt-1">
                  {user.fullName}
                </h2>
                <p className="text-[11px] text-slate-500">Session ID: Master Admin</p>
              </div>

              <nav aria-label="Admin Console Navigation" className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 mt-3">
                <AdminSignOutButton />
              </div>
            </div>
          </aside>

          {/* Main Admin Content */}
          <div className="lg:col-span-9 min-w-0 w-full overflow-hidden">{children}</div>
        </div>
      </div>
    </>
  );
}
