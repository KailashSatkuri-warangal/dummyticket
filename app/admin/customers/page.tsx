import React from 'react';
import { listAllBookings, listAllLeads } from '@/lib/booking/store';
import { CustomerManagerClient } from './CustomerManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const [bookings, leads] = await Promise.all([listAllBookings(), listAllLeads()]);

  // Aggregate unique guest customers by email
  const customerMap = new Map<string, any>();

  for (const b of bookings) {
    if (!b.contactEmail) continue;
    const emailKey = b.contactEmail.toLowerCase().trim();
    const primaryPax = b.passengers[0];
    const name = primaryPax ? `${primaryPax.firstName} ${primaryPax.lastName}`.trim() : 'Guest Traveler';

    if (!customerMap.has(emailKey)) {
      customerMap.set(emailKey, {
        id: `guest-${b.id.slice(0, 8)}`,
        name: name || 'Guest Traveler',
        email: b.contactEmail,
        phone: b.contactPhone || null,
        totalBookings: 0,
        totalSpentInr: 0,
        lastBookingDate: b.createdAt,
        bookings: [] as Array<{
          id: string;
          reference: string;
          route: string;
          amount: number;
          status: string;
          date: string;
        }>,
        source: 'booking' as const,
      });
    }

    const c = customerMap.get(emailKey);
    c.totalBookings += 1;
    c.totalSpentInr += b.totalAmount || 0;
    c.bookings.push({
      id: b.id,
      reference: b.bookingReference,
      route: `${b.originIata} → ${b.destinationIata}`,
      amount: b.totalAmount || 0,
      status: b.status,
      date: b.createdAt,
    });
  }

  // Also include any leads not already in bookings
  for (const lead of leads) {
    if (!lead.email) continue;
    const emailKey = lead.email.toLowerCase().trim();
    if (!customerMap.has(emailKey)) {
      customerMap.set(emailKey, {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        totalBookings: 1,
        totalSpentInr: lead.plan === 'premium' ? 399 : 0,
        lastBookingDate: lead.createdAt,
        bookings: [
          {
            id: lead.id,
            reference: `LEAD-${lead.origin || 'DEL'}-${lead.destination || 'LHR'}`,
            route: `${lead.origin || 'DEL'} → ${lead.destination || 'LHR'}`,
            amount: lead.plan === 'premium' ? 399 : 0,
            status: lead.status,
            date: lead.createdAt,
          },
        ],
        source: 'lead' as const,
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Module 9 · Guest Profiles
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Guest Customer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified directory of guest travelers compiled directly from reservations and inquiries. No mandatory customer accounts needed.
          </p>
        </div>
      </div>

      <CustomerManagerClient initialCustomers={customers} />
    </div>
  );
}
