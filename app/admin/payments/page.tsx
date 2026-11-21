import React from 'react';
import { listAllPayments } from '@/lib/booking/store';
import { PaymentManagerClient } from './PaymentManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const payments = await listAllPayments();
  return <PaymentManagerClient initialPayments={payments} />;
}
