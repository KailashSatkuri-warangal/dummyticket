'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Plane,
  Ticket,
  FileText,
  Building,
  Search,
  Calculator,
  AlertTriangle,
  Mail,
} from 'lucide-react';

export function Header({
  brandName = 'DummyTicket',
}: {
  brandName?: string;
  user?: any;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const countriesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countriesRef.current && !countriesRef.current.contains(e.target as Node)) {
        setCountriesOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoToForm = (e: React.MouseEvent) => {
    setMobileOpen(false);
    const form = document.getElementById('bookingForm');
    if (form) {
      e.preventDefault();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100'
          : 'bg-white/90 backdrop-blur-md border-b border-blue-50'
      }`}
      style={{ height: '72px' }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo - DummyTicket in Blue and White */}
        <Link href="/" className="flex items-center gap-2.5 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0062e0] to-[#1d4ed8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0B1120]">
            Dummy<span className="text-[#0062e0]">Ticket</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/dummy-ticket"
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
              pathname === '/dummy-ticket'
                ? 'text-[#0062e0] bg-blue-50'
                : 'text-gray-700 hover:text-[#0062e0] hover:bg-blue-50/60'
            }`}
          >
            Dummy Ticket
          </Link>

          {/* Countries Dropdown */}
          <div className="relative" ref={countriesRef}>
            <button
              type="button"
              onClick={() => {
                setCountriesOpen(!countriesOpen);
                setToolsOpen(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-[#0062e0] hover:bg-blue-50/60 transition-colors"
              aria-expanded={countriesOpen}
            >
              Countries
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  countriesOpen ? 'rotate-180 text-[#0062e0]' : 'text-gray-400'
                }`}
              />
            </button>

            <AnimatePresence>
              {countriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[680px] bg-white rounded-2xl p-6 shadow-2xl border border-blue-100 grid grid-cols-3 gap-6 z-50"
                >
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0062e0] mb-3">
                      Popular Destinations
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: 'USA', href: '/proof-of-onward-travel', flag: '🇺🇸' },
                        { name: 'United Kingdom', href: '/proof-of-onward-travel', flag: '🇬🇧' },
                        { name: 'Thailand', href: '/proof-of-onward-travel', flag: '🇹🇭' },
                        { name: 'India', href: '/proof-of-onward-travel', flag: '🇮🇳' },
                        { name: 'Philippines', href: '/proof-of-onward-travel', flag: '🇵🇭' },
                        { name: 'Turkey', href: '/proof-of-onward-travel', flag: '🇹🇷' },
                        { name: 'Germany', href: '/proof-of-onward-travel', flag: '🇩🇪' },
                        { name: 'Australia', href: '/proof-of-onward-travel', flag: '🇦🇺' },
                      ].map((c) => (
                        <Link
                          key={c.name}
                          href={c.href}
                          onClick={() => setCountriesOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0062e0] hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-base">{c.flag}</span>
                          <span>{c.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0062e0] mb-3">
                      Regions
                    </div>
                    <Link
                      href="/dummy-ticket-schengen-visa"
                      onClick={() => setCountriesOpen(false)}
                      className="block p-3 rounded-xl border border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all mb-4 group"
                    >
                      <div className="flex items-center gap-2 font-bold text-gray-900 group-hover:text-[#0062e0]">
                        <span className="text-lg">🇪🇺</span> Schengen Zone
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">29 European countries requirement</div>
                    </Link>
                  </div>

                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0062e0] mb-3">
                      Resources
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/proof-of-onward-travel"
                        onClick={() => setCountriesOpen(false)}
                        className="block p-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-sm font-bold text-gray-900">All 195 Countries</div>
                        <div className="text-xs text-gray-500">Complete immigration directory</div>
                      </Link>
                      <Link
                        href="/onward-ticket"
                        onClick={() => setCountriesOpen(false)}
                        className="block p-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-sm font-bold text-gray-900">Onward Ticket</div>
                        <div className="text-xs text-gray-500">Required at check-in</div>
                      </Link>
                      <Link
                        href="/temporary-flight-reservation"
                        onClick={() => setCountriesOpen(false)}
                        className="block p-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-sm font-bold text-gray-900">Temporary Reservation</div>
                        <div className="text-xs text-gray-500">Fast embassy itinerary</div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => {
                setToolsOpen(!toolsOpen);
                setCountriesOpen(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-[#0062e0] hover:bg-blue-50/60 transition-colors"
              aria-expanded={toolsOpen}
            >
              Tools
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  toolsOpen ? 'rotate-180 text-[#0062e0]' : 'text-gray-400'
                }`}
              />
            </button>

            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[720px] bg-white rounded-2xl p-6 shadow-2xl border border-blue-100 grid grid-cols-2 gap-6 z-50"
                >
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0062e0] mb-3">
                      Research & Verification Tools
                    </div>
                    <div className="space-y-1.5">
                      {[
                        {
                          name: 'Visa Checker',
                          desc: 'Check requirements for any passport',
                          href: '/visa-checker',
                          icon: Search,
                          color: 'text-blue-600 bg-blue-50',
                        },
                        {
                          name: 'Embassy Finder',
                          desc: 'Embassies & consulates worldwide',
                          href: '/embassy-finder',
                          icon: Building,
                          color: 'text-indigo-600 bg-indigo-50',
                        },
                        {
                          name: 'Visa Cost Calculator',
                          desc: 'Exact fees & processing times',
                          href: '/visa-cost-calculator',
                          icon: Calculator,
                          color: 'text-emerald-600 bg-emerald-50',
                        },
                        {
                          name: 'Visa Risk Checker',
                          desc: 'Check your approval chances',
                          href: '/visa-risk-check',
                          icon: AlertTriangle,
                          color: 'text-red-600 bg-red-50',
                        },
                        {
                          name: 'Hotel Booking',
                          desc: 'Free accommodation proof for visa',
                          href: '/hotel-booking',
                          icon: Building,
                          color: 'text-sky-600 bg-sky-50',
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-[#0062e0]">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0062e0] mb-3">
                      Document Generators
                    </div>
                    <div className="space-y-1.5">
                      {[
                        {
                          name: 'Visa Support Letter',
                          desc: 'Embassy-ready support letter',
                          href: '/visa-letter',
                          icon: FileText,
                          color: 'text-amber-600 bg-amber-50',
                        },
                        {
                          name: 'Invitation Letter',
                          desc: 'Official host invitation format',
                          href: '/invitation-letter',
                          icon: Mail,
                          color: 'text-pink-600 bg-pink-50',
                        },
                        {
                          name: 'Travel Itinerary',
                          desc: 'Day-by-day travel plan PDF',
                          href: '/travel-itinerary',
                          icon: FileText,
                          color: 'text-cyan-600 bg-cyan-50',
                        },
                        {
                          name: 'Embassy Cover Letter',
                          desc: 'Professional applicant statement',
                          href: '/embassy-letter',
                          icon: FileText,
                          color: 'text-blue-600 bg-blue-50',
                        },
                        {
                          name: 'Flight Itinerary for Visa',
                          desc: 'Dedicated visa flight itinerary guide',
                          href: '/flight-itinerary-for-visa',
                          icon: Plane,
                          color: 'text-sky-600 bg-sky-50',
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-[#0062e0]">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/blog"
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
              pathname.startsWith('/blog')
                ? 'text-[#0062e0] bg-blue-50'
                : 'text-gray-700 hover:text-[#0062e0] hover:bg-blue-50/60'
            }`}
          >
            Blog
          </Link>

          <Link
            href="/about"
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
              pathname === '/about'
                ? 'text-[#0062e0] bg-blue-50'
                : 'text-gray-700 hover:text-[#0062e0] hover:bg-blue-50/60'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right CTA Button - Clean & No Login */}
        <div className="flex items-center gap-3">
          <a
            href="/#bookingForm"
            onClick={handleGoToForm}
            className="inline-flex items-center gap-2 bg-[#0062e0] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Free Ticket</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#0062e0] rounded-lg hover:bg-blue-50"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-blue-100 px-4 pt-2 pb-6 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="space-y-1">
              <Link
                href="/dummy-ticket"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#0062e0]"
              >
                Dummy Ticket Guide
              </Link>
              <Link
                href="/dummy-ticket-schengen-visa"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#0062e0]"
              >
                Schengen Visa Dummy Ticket
              </Link>
              <Link
                href="/proof-of-onward-travel"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#0062e0]"
              >
                Proof of Onward Travel (195+ Countries)
              </Link>
              <Link
                href="/onward-ticket"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#0062e0]"
              >
                Onward Ticket
              </Link>
              <Link
                href="/hotel-booking"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#0062e0]"
              >
                Hotel Reservation Proof
              </Link>
              <div className="pt-2 border-t border-blue-100 my-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#0062e0] px-3 py-1">
                  Tools & Calculators
                </div>
                <Link
                  href="/visa-checker"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Visa Checker
                </Link>
                <Link
                  href="/embassy-finder"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Embassy Finder
                </Link>
                <Link
                  href="/visa-cost-calculator"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Visa Cost Calculator
                </Link>
                <Link
                  href="/visa-risk-check"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Visa Risk Checker
                </Link>
              </div>
              <div className="pt-2 border-t border-blue-100 my-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#0062e0] px-3 py-1">
                  Document Generators
                </div>
                <Link
                  href="/visa-letter"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Visa Support Letter
                </Link>
                <Link
                  href="/invitation-letter"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Invitation Letter
                </Link>
                <Link
                  href="/travel-itinerary"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Travel Itinerary
                </Link>
                <Link
                  href="/embassy-letter"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Embassy Cover Letter
                </Link>
                <Link
                  href="/flight-itinerary-for-visa"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  Flight Itinerary for Visa
                </Link>
              </div>
              <div className="pt-2 border-t border-blue-100 my-2">
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50"
                >
                  Travel & Visa Blog
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold text-gray-800 hover:bg-blue-50"
                >
                  About DummyTicket
                </Link>
              </div>
              <div className="pt-3">
                <a
                  href="/#bookingForm"
                  onClick={handleGoToForm}
                  className="w-full flex items-center justify-center gap-2 bg-[#0062e0] text-white py-3 rounded-xl font-black text-center shadow-md shadow-blue-500/25"
                >
                  <Ticket className="w-5 h-5" /> Generate Free Ticket Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
