import React from 'react';
import Link from 'next/link';
import { DESTINATIONS, ROUTE_PAGES } from '@/lib/flights/dataset';

export default function AdminSeoPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h1 className="text-xl font-extrabold text-navy-900">
          SEO Route Landing Pages ({ROUTE_PAGES.length}) & Destination Guides (
          {DESTINATIONS.length})
        </h1>
        <p className="text-xs text-slate-600">
          Controlled indexable route pages and destination guides included in{' '}
          <Link href="/sitemap.xml" className="text-brand-600 underline">
            /sitemap.xml
          </Link>
          .
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          {ROUTE_PAGES.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-navy-900">{r.metaTitle}</p>
                <p className="text-slate-500 font-mono">/routes/{r.slug}</p>
              </div>
              <Link
                href={`/routes/${r.slug}`}
                className="font-bold text-brand-600 hover:underline"
              >
                Open →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
