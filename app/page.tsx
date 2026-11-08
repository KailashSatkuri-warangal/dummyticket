import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  ArrowRight,
  Plane,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  PhoneCall,
  Sparkles,
  Scale,
  Compass,
  Clock,
  Award,
  Globe2,
} from 'lucide-react';
import { FlightSearchPanel } from '@/components/search/FlightSearchPanel';
import { RecentSearchesStrip } from '@/components/search/RecentSearchesStrip';
import { NewsletterForm } from '@/components/search/NewsletterForm';
import {
  AIRLINES,
  DESTINATIONS,
  ROUTE_PAGES,
  BLOG_POSTS,
} from '@/lib/flights/dataset';
import { formatDuration, formatInr, getBrandConfig } from '@/lib/config/brand';
import { AirlineLogo } from '@/components/flights/AirlineLogo';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { HeroGlobe } from '@/components/ui/HeroGlobe';
import { RoutesMarquee } from '@/components/ui/RoutesMarquee';
import { MobileActionDock } from '@/components/ui/MobileActionDock';

export default function HomePage() {
  const brand = getBrandConfig();
  const indianAirlines = AIRLINES.filter((a) => a.category === 'indian');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: brand.name,
        legalName: brand.legalEntityName,
        url: brand.appUrl,
        contactPoint: {
          '@type': 'ContactPoint',
          email: brand.supportEmail,
          telephone: brand.supportPhone,
          contactType: 'customer support',
        },
      },
      {
        '@type': 'WebSite',
        name: brand.name,
        url: brand.appUrl,
      },
    ],
  };

  const faqItems = [
    {
      q: 'How do I receive my confirmed itinerary?',
      a: 'Once your Razorpay payment is verified server-side, DummyTicket issues your reservation with an airline PNR and generates a Boarding-Pass-Styled Itinerary PDF plus a separate Payment Receipt PDF, dispatched to your email instantly.',
    },
    {
      q: 'How are fares and price changes handled during checkout?',
      a: 'When you select a flight, our server stores an auditable Fare Snapshot with an expiration time. Before payment order creation, the fare is revalidated. If a fare increases, you are shown the exact old and new amounts and asked for explicit confirmation.',
    },
    {
      q: 'Do I receive a separate Payment Receipt PDF and Itinerary PDF?',
      a: 'Yes. Upon verified Razorpay payment, DummyTicket generates both your Boarding-Pass-Styled Itinerary PDF and a separate Payment Receipt PDF (DT-RCPT-...), and dispatches 3 distinct confirmation emails.',
    },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION WITH FUTURISTIC SVG FLIGHT-PATH ANIMATION */}
      <section className="relative overflow-hidden border-b border-rose-950/40 bg-gradient-to-b from-[#180414] via-[#2a0723] to-[#12020f] text-white py-14 sm:py-20 lg:py-24">
        {/* Background Animated SVG Flight Paths & Coordinates */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 420"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          fill="none"
        >
          <defs>
            <linearGradient id="heroPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#e11d48" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Subtle world grid lines */}
          <path d="M0 120 H1200 M0 240 H1200 M0 360 H1200" stroke="#3b0d2d" strokeWidth="0.6" strokeDasharray="4 8" />
          <path d="M240 0 V420 M600 0 V420 M960 0 V420" stroke="#3b0d2d" strokeWidth="0.6" strokeDasharray="4 8" />
          {/* Primary curved flight trajectory */}
          <path
            d="M 80 320 Q 560 30 1120 190"
            stroke="url(#heroPathGrad)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
          <circle cx="80" cy="320" r="5" fill="#f472b6" />
          <circle cx="585" cy="142" r="4" fill="#e11d48" />
          <circle cx="1120" cy="190" r="6" fill="#fb7185" />
          {/* Airplane silhouette along trajectory */}
          <g transform="translate(570, 128) rotate(-10)">
            <path
              d="M0 12 L28 4 L34 12 L28 14 L16 13 L10 22 L6 22 L9 13 L2 13 Z"
              fill="#f43f5e"
            />
          </g>
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-400/40 px-4 py-1.5 text-xs font-bold text-brand-200 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Next-Generation Flight Search & Confirmed Itineraries
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
                Your Next Journey Starts Here.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Discover routes, compare available fares, and keep every trip organized in one place.
              </p>
            </div>
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
              <HeroGlobe className="w-full h-80" />
            </div>
          </div>

          <div className="mt-8 text-navy-900">
            <FlightSearchPanel />
          </div>
        </div>
      </section>

      {/* STATS STRIP INSPIRED BY REFERENCE */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 text-white py-5 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-xs font-semibold text-brand-100 mt-0.5">Verifiable PNR & QR</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-white">Instant</div>
              <div className="text-xs font-semibold text-brand-100 mt-0.5">E-Delivery to Email</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-white">10+</div>
              <div className="text-xs font-semibold text-brand-100 mt-0.5">Indian & Global Airlines</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-white">24/7</div>
              <div className="text-xs font-semibold text-brand-100 mt-0.5">Verified Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS LIVE ROUTES TICKER MARQUEE (MYJET24 PATTERN) */}
      <RoutesMarquee />

      {/* RECENTLY SEARCHED ROUTES */}
      <RecentSearchesStrip />

      {/* INDIAN AIRLINES & REGIONAL CARRIERS CATALOG SHOWCASE */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 eyebrow">
                <Compass className="h-3.5 w-3.5" />
                Supported Indian Aviation Network
              </span>
              <h2 className="section-heading mt-1">
                All 10 Major & Regional Indian Airlines Supported
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Search domestic trunk corridors and regional UDAN connections with carrier-authentic emblems and fare rules.
              </p>
            </div>
            <Link
              href="/flights?from=HYD&to=DEL&depart=2026-12-15&adults=1&cabin=economy"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 group"
            >
              Search Domestic Indian Routes <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
            {indianAirlines.map((airline) => (
              <Link
                key={airline.id}
                href={`/flights?from=HYD&to=DEL&depart=2026-12-15&adults=1&cabin=economy&airline=${airline.iataCode}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-brand-400 hover:shadow-card-hover hover:-translate-y-1"
              >
                <AirlineLogo airline={airline} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-navy-900 truncate group-hover:text-brand-600">
                    {airline.name}
                  </p>
                  <p className="font-mono text-[10px] font-semibold text-slate-500">
                    IATA: {airline.iataCode}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR FLIGHT ROUTES & DESTINATIONS */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Popular Flight Routes */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="section-heading">
                  Popular Flight Routes
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Explore domestic and international corridors with complete schedule and baggage guides.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ROUTE_PAGES.map((route) => (
                <Link
                  key={route.id}
                  href={`/routes/${route.slug}`}
                  className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 transition-all duration-200 hover:border-brand-500 hover:bg-white hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-base font-extrabold text-navy-900 group-hover:text-brand-600">
                      {route.originCity} ({route.originIata})
                      <ArrowRight className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-1" />
                      {route.destinationCity} ({route.destinationIata})
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    Avg. Duration: {formatDuration(route.averageDurationMinutes)} ·{' '}
                    {route.airlinesOperating.join(', ')}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3">
                    <span className="text-xs text-slate-500 font-medium">
                      Starting fare
                    </span>
                    <span className="text-sm font-black tabular-nums text-brand-700">
                      {formatInr(route.startingFareInr)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <div className="flex items-end justify-between mb-2">
              <div>
                <h2 className="section-heading">
                  Popular Destinations & Airport Guides
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Check terminal information, best travel seasons, and visa documentation rules.
                </p>
              </div>
            </div>

            {/* Quick Country Discovery Chips */}
            <div className="flex flex-wrap gap-2 pt-3 pb-6">
              {[
                { name: 'Dubai (DXB)', href: '/destinations/dubai' },
                { name: 'Singapore (SIN)', href: '/destinations/singapore' },
                { name: 'Hyderabad (HYD)', href: '/routes/hyd-to-del' },
                { name: 'Delhi (DEL)', href: '/routes/del-to-hyd' },
                { name: 'Mumbai (BOM)', href: '/routes/hyd-to-bom' },
                { name: 'Bengaluru (BLR)', href: '/routes/hyd-to-blr' },
              ].map((chip) => (
                <Link
                  key={chip.name}
                  href={chip.href}
                  className="country-chip"
                >
                  <Plane className="h-3.5 w-3.5 text-brand-600" />
                  <span>{chip.name}</span>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DESTINATIONS.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card transition-all duration-200 hover:border-brand-500 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-bold text-brand-700">
                        {dest.airportIata}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {dest.country}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-navy-900">
                      {dest.city}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {dest.overview}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    <span className="tabular-nums text-slate-500 font-medium">
                      From {formatInr(dest.startingFareInr)}
                    </span>
                    <span className="font-bold text-brand-600 group-hover:underline">
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS & TRANSPARENT PRICING */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16"
      >
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">
              End-to-End Workflow
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-navy-900">
              How DummyTicket Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every step is backed by server-side validation, fare snapshots, and cryptographic Razorpay verification.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Search & Compare',
                desc: 'Select origin, destination, travel dates, and cabin class across 10 Indian and global carriers.',
                icon: Plane,
              },
              {
                step: '02',
                title: 'Lock Fare Snapshot',
                desc: 'Our server calculates the complete fare breakdown and locks a time-stamped fare snapshot before checkout.',
                icon: Scale,
              },
              {
                step: '03',
                title: 'Verify Payment',
                desc: 'Complete payment through Razorpay Checkout. Signatures and webhooks are verified server-side.',
                icon: CreditCard,
              },
              {
                step: '04',
                title: 'Reveal Itinerary & Receipt',
                desc: 'Download your Boarding-Pass-Styled Itinerary PDF and separate Payment Receipt PDF.',
                icon: FileText,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-200 hover:border-brand-400 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-sm font-black text-brand-600/60">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Pricing & Separate Receipt Guarantee */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-navy-950 via-navy-900 to-[#07132a] p-6 sm:p-10 text-white shadow-elevated relative overflow-hidden">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-verified-500/20 border border-verified-500/30 px-3 py-1 text-xs font-bold text-verified-400">
                <ShieldCheck className="h-4 w-4" />
                Auditable Pricing & Dual-Document Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                100% Transparent Pricing & Separate Payment Receipts
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                DummyTicket never hides mandatory service fees or mixes payment invoices onto your boarding pass. Every verified booking issues two distinct downloadable PDFs and three transactional emails.
              </p>
              <ul className="space-y-3 text-xs text-slate-200 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Verifiable References:</strong> Every itinerary carries a <code className="rounded bg-brand-400/20 px-1.5 py-0.5 text-brand-200 font-mono">DT-</code> booking reference and airline PNR, verifiable online via the QR code.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Separate Payment Receipt PDF:</strong> Your tax & fee breakdown (<code className="font-mono text-brand-300">DT-RCPT-...</code>) is generated as a clean accounting receipt separate from the boarding pass.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-verified-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>3 Transactional Emails:</strong> Receive separate Booking Confirmation, Payment Receipt, and Itinerary Delivery emails upon payment verification.
                  </span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-navy-900/90 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">Booking Reference Format</span>
                <span className="font-mono text-sm font-bold text-brand-300">DT-[ORIGIN][CODE][DEST]</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">Receipt Reference Format</span>
                <span className="font-mono text-sm font-bold text-brand-300">DT-RCPT-[BOOKING_REF]</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">Document Verification</span>
                <span className="text-xs font-bold text-verified-400">QR-VERIFIABLE CONFIRMED ITINERARY</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  href="/flights"
                  className="flex-1 text-center rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-brand-700 shadow-md transition-colors"
                >
                  Search Flights
                </Link>
                <Link
                  href="/track-booking"
                  className="flex-1 text-center rounded-xl border border-slate-700 bg-navy-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Track Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST SEO ARTICLES & TRAVEL PLANNING GUIDES */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow">
                Travel Planning & Compliance Guides
              </span>
              <h2 className="section-heading mt-1">
                Latest Aviation & Fare Rule Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 group"
            >
              All Articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 transition-all duration-200 hover:border-brand-400 hover:bg-white hover:shadow-card-hover hover:-translate-y-1"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700 border border-brand-100">
                    <BookOpen className="h-3 w-3" />
                    {post.category}
                  </span>
                  <h3 className="mt-3 text-base font-extrabold text-navy-900 group-hover:text-brand-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[11px] text-slate-500 font-medium">
                  <span>{post.readingTimeMinutes} min read</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Read Guide →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ, SUPPORT & NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 eyebrow">
              <HelpCircle className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="section-heading">
              Clear Answers Before You Book
            </h2>

            <FaqAccordion items={faqItems} />

            <div className="pt-2">
              <Link
                href="/faq"
                className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1 group"
              >
                View complete FAQ & Help Center <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card">
              <h3 className="text-lg font-extrabold text-navy-900">
                Subscribe to Route & Fare Rule Updates
              </h3>
              <p className="mt-1 text-xs text-slate-600 mb-4 leading-relaxed">
                Receive airport terminal updates, baggage policy alerts, and seasonal route guides. Consent-based with one-click unsubscribe.
              </p>
              <NewsletterForm />
            </div>

            <div className="rounded-2xl border border-brand-200/80 bg-brand-50/70 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-navy-900">
                    24/7 Booking & Itinerary Support
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {brand.supportEmail} · {brand.supportPhone}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/track-booking"
                  className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50 shadow-sm"
                >
                  Lookup Booking Reference
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-sm"
                >
                  Contact Support Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY ACTION DOCK */}
      <MobileActionDock />
    </div>
  );
}
