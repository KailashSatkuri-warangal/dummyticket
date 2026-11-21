import React from 'react';
import { listAllBookings } from '@/lib/booking/store';
import { BookingManagerClient } from './BookingManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await listAllBookings();
  return <BookingManagerClient initialBookings={bookings} />;
}
