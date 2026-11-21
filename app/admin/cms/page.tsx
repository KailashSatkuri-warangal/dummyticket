import React from 'react';
import { readCatalogEntities } from '@/lib/booking/store';
import { CmsManagerClient } from './CmsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  const settingsRows = await readCatalogEntities('site_setting');
  const settingsMap: Record<string, any> = {};

  for (const s of settingsRows) {
    if (s.key) {
      settingsMap[s.key] = s.value;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800">
            Module 15 · Dynamic Content Management
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Website CMS & Content Editor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify customer-facing hero copy, promotional banners, company details, disclaimer texts, and SEO metadata in real time without redeploying code.
          </p>
        </div>
      </div>

      <CmsManagerClient initialSettings={settingsMap} />
    </div>
  );
}
