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
} from 'lucide-react';
import { RealtimeRefresh } from '@/components/admin/RealtimeRefresh';
import { AdminLoginGate } from '@/components/admin/AdminLoginGate';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';

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

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings & Customers', icon: Ticket },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/leads', label: 'Customer Leads', icon: Users },
    { href: '/admin/users', label: 'Users & Roles', icon: Users },
    { href: '/admin/flights', label: 'Flights Inventory', icon: Plane },
    { href: '/admin/refunds', label: 'Refunds', icon: RotateCcw },
    { href: '/admin/pricing', label: 'Pricing Engine', icon: Sliders },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/email-templates', label: 'Email Logs', icon: Mail },
    { href: '/admin/airports', label: 'Airports', icon: Building2 },
    { href: '/admin/airlines', label: 'Airlines', icon: Plane },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/blog', label: 'Blog CMS', icon: BookOpen },
    { href: '/admin/seo', label: 'SEO & Routes', icon: Globe },
    { href: '/admin/reports', label: 'Revenue Reports', icon: BarChart3 },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileSpreadsheet },
  ];

  return (
    <>
      <RealtimeRefresh />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6">
        {/* Mobile Horizontal Quick-Pills Navigation */}
        <div className="lg:hidden mb-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm mb-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-black text-navy-900">Admin Console</span>
              </div>
              <AdminSignOutButton />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar text-xs">
              {navLinks.slice(0, 8).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold whitespace-nowrap active:bg-blue-50 active:text-blue-700"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

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
                {navLinks.map((item) => {
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
