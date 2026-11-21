import React from 'react';
import { listAllNotifications } from '@/lib/booking/store';
import { NotificationManagerClient } from './NotificationManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const notifications = await listAllNotifications();
  return <NotificationManagerClient initialNotifications={notifications} />;
}
