'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  ArrowRight,
  Plane,
  Building,
  FileText,
} from 'lucide-react';

export interface GuideSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface GuideArticleLayoutProps {
  category?: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  reviewer?: string;
  sections: GuideSection[];
  sidebarTools?: Array<{ name: string; href: string; description: string; icon: React.ReactNode }>;
}

export function GuideArticleLayout({
  category = 'Visa Guide & Requirements',
  title,
  subtitle,
  lastUpdated = 'May 2026',
  reviewer = 'DummyTickets Editorial Team',
  sections,
  sidebarTools = [
    {
      name: 'Free Flight Reservation',
      href: '/dummy-ticket',
      description: 'Generate embassy-ready flight reservation PDF with PNR in 30 seconds.',
      icon: <Plane className="w-4 h-4 text-[#0062e0]" />,
    },
    {
      name: 'Proof of Accommodation',
      href: '/hotel-booking',
      description: 'Official hotel reservation voucher for visa appointments.',
      icon: <Building className="w-4 h-4 text-[#0062e0]" />,
    },
    {
      name: 'Embassy Cover Letter',
      href: '/embassy-letter',
      description: 'Applicant cover letter stating purpose of travel & return intent.',
      icon: <FileText className="w-4 h-4 text-[#0062e0]" />,
    },
  ],
}: GuideArticleLayoutProps) {
  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">{subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reviewed by: {reviewer}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Content + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left / Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {sections.map((section, idx) => (
            <section
              key={section.id || idx}
              id={section.id}
              className="scroll-mt-24 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-4 pb-3 border-b border-slate-100">
                {section.title}
              </h2>
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Right / Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Quick Table of Contents */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Table of Contents
            </div>
            <nav className="space-y-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs font-bold text-slate-700 hover:text-[#0062e0] transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-[#0062e0]"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Quick Visa Tools */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wider text-[#0062e0] mb-3">
              Essential Visa Tools
            </div>
            <div className="space-y-3">
              {sidebarTools.map((t, idx) => (
                <Link
                  key={idx}
                  href={t.href}
                  className="group block p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 group-hover:text-[#0062e0]">
                    {t.icon}
                    <span>{t.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
