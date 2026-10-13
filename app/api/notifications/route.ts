import { NextResponse } from 'next/server';
import { getPlatformStore } from '@/lib/booking/store';
import { getCurrentSessionUser } from '@/lib/security/auth';

export async function GET() {
  const user = await getCurrentSessionUser();
  const store = getPlatformStore();

  const items = store.notifications.filter(
    (n) => n.userId === user.id || user.role === 'admin'
  );

  return NextResponse.json({
    notifications: items,
    unreadCount: items.filter((n) => !n.isRead).length,
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentSessionUser();
  const store = getPlatformStore();
  const body = (await request.json().catch(() => ({}))) as {
    notificationId?: string;
    markAllRead?: boolean;
  };

  if (body.markAllRead) {
    store.notifications.forEach((n) => {
      if (n.userId === user.id || user.role === 'admin') {
        n.isRead = true;
      }
    });
  } else if (body.notificationId) {
    const item = store.notifications.find((n) => n.id === body.notificationId);
    if (item && (item.userId === user.id || user.role === 'admin')) {
      item.isRead = true;
    }
  }

  const items = store.notifications.filter(
    (n) => n.userId === user.id || user.role === 'admin'
  );

  return NextResponse.json({
    notifications: items,
    unreadCount: items.filter((n) => !n.isRead).length,
  });
}
