import React from 'react';
import Link from 'next/link';
import { Mail, Plane } from 'lucide-react';
import { NewsletterForm } from '@/components/search/NewsletterForm';

export function Footer() {
  return (
    <footer className="footer bg-[#070e1c] text-gray-300 pt-16 pb-12 border-t border-[#1e3a8a]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Head */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#1e3a8a]/30 items-start">
          <div className="lg:col-span-6 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 text-decoration-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0062e0] to-[#1d4ed8] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Dummy<span className="text-[#38bdf8]">Ticket</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Free dummy ticket generator for visa applications and proof of onward travel. Trusted by travelers in 195+ countries.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="text-sm font-bold text-white mb-1">Stay Updated</div>
            <p className="text-xs text-gray-400 mb-3">
              Visa tips, country guides & travel updates — no spam, ever.
            </p>
            <NewsletterForm />
            <p className="text-[11px] text-gray-500 mt-2">
              Visa tips and country updates. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 text-sm">
          {/* Dummy Tickets */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4">
              Dummy Tickets
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dummy-ticket" className="text-gray-400 hover:text-white transition-colors">
                  Dummy Ticket Guide
                </Link>
              </li>
              <li>
                <Link href="/onward-ticket" className="text-gray-400 hover:text-white transition-colors">
                  Onward Ticket
                </Link>
              </li>
              <li>
                <Link href="/proof-of-onward-travel" className="text-gray-400 hover:text-white transition-colors">
                  Proof of Onward Travel
                </Link>
              </li>
              <li>
                <Link href="/flight-itinerary-for-visa" className="text-gray-400 hover:text-white transition-colors">
                  Flight Itinerary for Visa
                </Link>
              </li>
              <li>
                <Link href="/temporary-flight-reservation" className="text-gray-400 hover:text-white transition-colors">
                  Temporary Reservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Tools */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4">
              Research Tools
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/visa-checker" className="text-gray-400 hover:text-white transition-colors">
                  Visa Checker
                </Link>
              </li>
              <li>
                <Link href="/embassy-finder" className="text-gray-400 hover:text-white transition-colors">
                  Embassy Finder
                </Link>
              </li>
              <li>
                <Link href="/visa-cost-calculator" className="text-gray-400 hover:text-white transition-colors">
                  Visa Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/visa-risk-check" className="text-gray-400 hover:text-white transition-colors">
                  Visa Risk Checker
                </Link>
              </li>
              <li>
                <Link href="/hotel-booking" className="text-gray-400 hover:text-white transition-colors">
                  Hotel Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Document Generators */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4">
              Document Generators
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/visa-letter" className="text-gray-400 hover:text-white transition-colors">
                  Visa Support Letter
                </Link>
              </li>
              <li>
                <Link href="/invitation-letter" className="text-gray-400 hover:text-white transition-colors">
                  Invitation Letter
                </Link>
              </li>
              <li>
                <Link href="/travel-itinerary" className="text-gray-400 hover:text-white transition-colors">
                  Travel Itinerary
                </Link>
              </li>
              <li>
                <Link href="/embassy-letter" className="text-gray-400 hover:text-white transition-colors">
                  Embassy Cover Letter
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4">
              Popular
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dummy-ticket-schengen-visa" className="text-gray-400 hover:text-white transition-colors">
                  Schengen Visa
                </Link>
              </li>
              <li>
                <Link href="/proof-of-onward-travel" className="text-gray-400 hover:text-white transition-colors">
                  Thailand
                </Link>
              </li>
              <li>
                <Link href="/proof-of-onward-travel" className="text-gray-400 hover:text-white transition-colors">
                  USA
                </Link>
              </li>
              <li>
                <Link href="/proof-of-onward-travel" className="text-gray-400 hover:text-white transition-colors">
                  All 195 Countries
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4">
              Company
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="/#bookingForm" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-gray-400 hover:text-white transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-rose-400 hover:text-rose-300 font-bold transition-colors">
                  No-Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1e3a8a]/30 space-y-3 text-xs text-gray-500">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a href="mailto:support@dummyticket.example.com" className="text-blue-400 hover:underline">
                Contact: support@dummyticket.example.com
              </a>
            </div>
            <p>© 2026 DummyTicket — Free Dummy Ticket Generator for Visa Applications & Proof of Onward Travel</p>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500">
            Professional flight itineraries for visa applications worldwide. Not an airline or travel agency.
          </p>
          <p className="text-[11px] leading-relaxed text-gray-500">
            DummyTicket Aviation Technologies Ltd • Company No. 1213458 • Worldwide Service
          </p>
          <p className="text-[10px] leading-relaxed text-gray-600">
            DummyTicket provides flight reservations as supporting documents for visa applications and border control. Each document is a reservation and is identifiable as one — it is not a paid ticket and is not sold as one. We follow airline booking rules and do not support repeated speculative bookings.
          </p>
        </div>
      </div>
    </footer>
  );
}
