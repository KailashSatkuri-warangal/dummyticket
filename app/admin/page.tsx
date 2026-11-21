import React from 'react';
import {
  listAllBookings,
  listAllPayments,
  listAllRefunds,
  listAuditLogs,
  readCatalogEntities,
} from '@/lib/booking/store';
import { AdminExecutiveDashboard } from '@/components/admin/AdminExecutiveDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [bookings, payments, refunds, auditLogs, flights, routes, airlines] =
    await Promise.all([
      listAllBookings(),
      listAllPayments(),
      listAllRefunds(),
      listAuditLogs(15),
      readCatalogEntities('flight'),
      readCatalogEntities('route_page'),
      readCatalogEntities('airline'),
    ]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-brand-700">
          Executive Operations Console · DummyTickets
        </span>
        <h1 className="mt-1 text-2xl font-black text-navy-900">
          Executive Admin Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time dynamic operations across guest customer reservations, verified Razorpay payments, airline PNR status distributions, route analytics, and system audit logs.
        </p>
      </div>

      <AdminExecutiveDashboard
        bookings={bookings}
        payments={payments}
        refunds={refunds}
        auditLogs={auditLogs}
        flightsCount={flights.length}
        routesCount={routes.length}
        airlinesCount={airlines.length}
      />
    </div>
  );
}
