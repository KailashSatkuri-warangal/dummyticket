import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Scale,
  RefreshCw,
  Search,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy & Fact-Checking Standards | DummyTickets',
  description:
    'How DummyTickets researches, sources, fact-checks, and updates visa guidelines, consular rules, and travel requirements. Author standards, AI disclosures, and 14-day correction commitments.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Journalistic & Research Integrity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Editorial Policy & Verification Standards
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Our commitment to accurate, up-to-date, and legally verified immigration and travel documentation guidance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Primary Sourcing</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <RefreshCw className="w-4 h-4 text-blue-300" />
              <span>Bi-Weekly Policy Audits</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>14-Day Correction Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              1. Primary Sourcing & Legal Authority
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Every visa guideline, document checklist, and statutory fee published on DummyTickets is verified against primary government sources: official ministry gazettes, foreign affairs portals, Schengen Visa Code regulations (Regulation EC No 810/2009), UK Visas and Immigration (UKVI) guidance, US Department of State Foreign Affairs Manual (FAM), and IATA Timatic travel databases. We do not base compliance recommendations on unverified forums or secondary blogs.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              2. Independent Editorial Review
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Our guides are researched and authored by travel specialists with extensive background in international consular processing. Articles undergo peer review for clarity, factual precision, and alignment with current border control practices before publication.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              3. Distinction Between Reservations and Issued Tickets
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              We uphold strict truth-in-advertising standards. DummyTickets never describes a temporary flight reservation or onward travel itinerary as a fully issued, paid commercial airline e-ticket. We explicitly educate users on the legal difference between an itinerary reservation for visa processing and a confirmed travel ticket required for boarding.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4. 14-Day Public Correction Commitment
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Immigration regulations and consular fees change frequently. If a user or consular representative identifies outdated information on any page, our editorial team investigates and updates the content within 14 business days. Corrections can be submitted directly through our <Link href="/contact" className="text-[#0062e0] font-bold underline">contact center</Link>.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              5. AI Disclosure & Human Oversight
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Where algorithmic data aggregation or automated calculators are utilized (such as fee estimators or currency conversions), all underlying parameters are manually reviewed and audited against official consular fee tables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
