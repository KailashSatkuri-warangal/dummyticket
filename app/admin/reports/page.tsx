import React from 'react';
import { listAllBookings } from '@/lib/booking/store';
import { ReportsManagerClient } from './ReportsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const bookings = await listAllBookings();
  return <ReportsManagerClient bookings={bookings} />;
}
