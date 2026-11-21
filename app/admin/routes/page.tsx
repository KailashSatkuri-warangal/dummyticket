import React from 'react';
import { readCatalogEntities } from '@/lib/booking/store';
import { RouteManagerClient } from './RouteManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminRoutesPage() {
  const routes = await readCatalogEntities('route_page');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-brand-700">
            Module 3 · Network & Navigation
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Route Management System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure departure-destination city pairs, IATA airport routes, route-specific base pricing, and customer visibility status.
          </p>
        </div>
      </div>

      <RouteManagerClient initialRoutes={routes} />
    </div>
  );
}
