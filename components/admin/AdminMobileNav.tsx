'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
  Plane,
  Building2,
  Ticket,
  Users,
  CreditCard,
  Sliders,
  Bell,
  BarChart3,
  Settings,
  FileSpreadsheet,
  Compass,
  KeyRound,
  UserCheck,
  LifeBuoy,
  LayoutTemplate,
  Shield,
  Tag,
} from 'lucide-react';
import { AdminSignOutButton } from './AdminSignOutButton';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: '1. Executive Dashboard', icon: LayoutDashboard },
  { href: '/admin/flights', label: '2. Flight Management', icon: Plane },
  { href: '/admin/routes', label: '3. Route Management', icon: Compass },
  { href: '/admin/airlines', label: '4. Airline Management', icon: Plane },
  { href: '/admin/airports', label: '5. Airport Management', icon: Building2 },
  { href: '/admin/pnr', label: '6. PNR Management', icon: KeyRound },
  { href: '/admin/bookings', label: '7. Booking Management', icon: Ticket },
  { href: '/admin/passengers', label: '8. Passenger Manifest', icon: UserCheck },
  { href: '/admin/customers', label: '9. Guest Customer CRM', icon: Users },
  { href: '/admin/payments', label: '10. Transactions & Payments', icon: CreditCard },
  { href: '/admin/pricing', label: '11. Pricing Management', icon: Sliders },
  { href: '/admin/coupons', label: '12. Coupons & Discounts', icon: Tag },
  { href: '/admin/notifications', label: '13. Notifications', icon: Bell },
  { href: '/admin/support', label: '14. Support Management', icon: LifeBuoy },
  { href: '/admin/cms', label: '15. Website CMS', icon: LayoutTemplate },
  { href: '/admin/reports', label: '16. Reports & Analytics', icon: BarChart3 },
  { href: '/admin/users', label: '17. Admin Staff Users', icon: Users },
  { href: '/admin/roles', label: '18. Roles & Permissions', icon: Shield },
  { href: '/admin/audit-logs', label: '19. System Audit Logs', icon: FileSpreadsheet },
  { href: '/admin/settings', label: '20. Platform Settings', icon: Settings },
];

export function AdminMobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden mb-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Toggle Admin Navigation"
            >
              {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0062e0]" />
              <span className="text-xs font-black text-slate-900">Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0062e0] font-bold text-[11px] border border-blue-200"
            >
              All 20 Modules
            </button>
            <AdminSignOutButton />
          </div>
        </div>

        {/* Scrollable Quick Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar text-xs">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0062e0] text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#0062e0]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Full Drawer Modal for Mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0062e0] text-white flex items-center justify-center font-black">
                  DT
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Admin Modules</h3>
                  <p className="text-[10px] text-slate-400">All 20 Management Centers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0062e0] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0062e0]'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <AdminSignOutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
