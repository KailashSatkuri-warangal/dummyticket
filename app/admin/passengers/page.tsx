import React from 'react';
import { listAllBookings } from '@/lib/booking/store';
import { PassengerManagerClient } from './PassengerManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPassengersPage() {
  const bookings = await listAllBookings();

  // Aggregate passengers across all bookings
  const passengers = bookings.flatMap((b) =>
    (b.passengers || []).map((p, idx) => ({
      id: p.id || `${b.id}-pax-${idx}`,
      bookingId: b.id,
      bookingReference: b.bookingReference,
      passengerType: p.passengerType || 'adult',
      firstName: p.firstName,
      lastName: p.lastName,
      fullName: `${p.firstName} ${p.lastName}`.trim(),
      dateOfBirth: p.dateOfBirth || null,
      gender: p.gender || 'unspecified',
      passportNumberMasked: p.passportNumberMasked || 'N/A (Domestic)',
      passportExpiry: p.passportExpiry || null,
      nationality: p.nationality || 'IN',
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone || null,
      originIata: b.originIata,
      destinationIata: b.destinationIata,
      departureDate: b.departureDate,
      bookingStatus: b.status,
      createdAt: b.createdAt,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
            Module 8 · Passenger Manifest
          </span>
          <h1 className="text-2xl font-black text-navy-900 mt-1">
            Passenger Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized registry of all adult, child, and infant travelers across reservation records. Masked passport numbers for privacy compliance and audit readiness.
          </p>
        </div>
      </div>

      <PassengerManagerClient initialPassengers={passengers} />
    </div>
  );
}
