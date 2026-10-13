'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';

const NAV_ITEMS = [
  { label: 'Flights', href: '/flights' },
  { label: 'Track Booking', href: '/track-booking' },
  { label: 'Popular Routes', href: '/routes/hyd-to-del' },
  { label: 'Destinations', href: '/destinations/dubai' },
  { label: 'Travel Guides', href: '/blog' },
  { label: 'Help', href: '/help' },
];

export function Header({ brandName = 'DummyTicket' }: { brandName?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 12;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md'
          : 'border-b border-slate-200/60 bg-white/85 backdrop-blur-sm'
      }`}
    >
      {/* Transparency Operating Mode Top Bar */}
      <div className="bg-navy-950 px-4 py-1.5 text-xs text-slate-200 border-b border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles className="h-3 w-3" />
              Mode A: Demo & Sample Itinerary Mode
            </span>
            <span className="hidden md:inline text-slate-300">
              All sample boarding passes are clearly labeled &ldquo;SAMPLE — NOT VALID FOR TRAVEL&rdquo; with verifiable QR codes.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/track-booking" className="hover:text-white underline-offset-2 hover:underline">
              Track Booking
            </Link>
            <Link href="/admin" className="text-brand-300 font-medium hover:text-white">
              Admin Console
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label={`${brandName} Home`}
            className="flex items-center gap-2.5 text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-600 rounded-lg"
          >
            <div className="hidden sm:block">
              <DummyTicketLogo variant="full" theme="light" size="md" showTagline={!scrolled} />
            </div>
            <div className="sm:hidden">
              <DummyTicketLogo variant="compact" theme="light" size="sm" showTagline={false} />
            </div>
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700"
          >
            {NAV_ITEMS.map((item) => {
              const baseHref = item.href.split('?')[0];
              const isActive =
                pathname === baseHref ||
                (baseHref !== '/' && pathname?.startsWith(baseHref));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'text-brand-600 font-semibold' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="header-nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />

          <Link
            href="/account/bookings"
            className="btn btn-secondary hidden px-3 py-2 text-xs sm:inline-flex"
          >
            <Ticket className="h-4 w-4 text-blue-600" />
            My Bookings
          </Link>

          <Link
            href="/login"
            className="btn btn-primary px-3.5 py-2 text-xs focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
          >
            <UserCheck className="h-4 w-4" />
            <span>Sign In</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile navigation menu"
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Layered Mobile Navigation Drawer with Staggered Items */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6"
          >
            <div className="grid grid-cols-1 gap-1.5 text-sm font-medium text-slate-800">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/account/bookings"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2"
              >
                <Ticket className="h-4 w-4 text-blue-600" />
                My Bookings & Account
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-brand-700"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
