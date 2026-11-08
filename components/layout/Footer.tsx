import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { getBrandConfig } from '@/lib/config/brand';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';

export function Footer() {
  const brand = getBrandConfig();

  return (
    <footer className="border-t border-slate-800 bg-[#070e1c] text-slate-300 pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Grid */}
        <div className="pb-12 border-b border-slate-800/80 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-3">
            <DummyTicketLogo variant="full" theme="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Next-generation flight discovery, transparent server-verified fare snapshots, and boarding-pass-styled confirmed itineraries across 10 Indian and global carriers.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-800 px-3.5 py-2.5">
              <Mail className="h-4 w-4 text-brand-400" />
              <span>{brand.supportEmail}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-800 px-3.5 py-2.5">
              <Phone className="h-4 w-4 text-brand-400" />
              <span>{brand.supportPhone}</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Headquarters & About */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Headquarters & Presence
            </h3>
            <p className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
              <MapPin className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
              <span>{brand.headquarters}</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trusted by travelers worldwide for verified airline reservations, travel documentation, and seamless visa application proof.
            </p>
          </div>

          {/* Column 2: Popular Routes & Destinations */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Routes & Guides
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/routes/hyd-to-del" className="hover:text-brand-300 transition-colors">
                  Hyderabad to Delhi (HYD → DEL)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-bom" className="hover:text-brand-300 transition-colors">
                  Hyderabad to Mumbai (HYD → BOM)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-blr" className="hover:text-brand-300 transition-colors">
                  Hyderabad to Bengaluru (HYD → BLR)
                </Link>
              </li>
              <li>
                <Link href="/routes/del-to-hyd" className="hover:text-brand-300 transition-colors">
                  Delhi to Hyderabad (DEL → HYD)
                </Link>
              </li>
              <li>
                <Link href="/routes/bom-to-dxb" className="hover:text-brand-300 transition-colors">
                  Mumbai to Dubai (BOM → DXB)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-sin" className="hover:text-brand-300 transition-colors">
                  Hyderabad to Singapore (HYD → SIN)
                </Link>
              </li>
              <li>
                <Link href="/destinations/dubai" className="hover:text-brand-300 transition-colors">
                  Dubai Airport Guide (DXB)
                </Link>
              </li>
              <li>
                <Link href="/destinations/singapore" className="hover:text-brand-300 transition-colors">
                  Singapore Changi Guide (SIN)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer & Platform */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Platform & Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/flights" className="hover:text-brand-300 transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/track-booking" className="hover:text-brand-300 transition-colors">
                  Track Booking Reference
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-300 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/account/bookings" className="hover:text-brand-300 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-300 transition-colors">
                  Aviation & Travel Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-300 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Compliance & Help */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Legal & Policies
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/help" className="hover:text-brand-300 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-brand-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-300 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-brand-300 transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-brand-300 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-brand-300 transition-colors">
                  Booking Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {brand.legalEntityName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-verified-400" />
            <span>
              Razorpay Server-Verified Payments · Auditable Fare Snapshots · WCAG 2.2 AA Accessible
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
