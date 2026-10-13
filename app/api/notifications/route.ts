import { NextResponse } from 'next/server';
import {
  listAllNotifications,
  listUserNotifications,
  markNotificationsRead,
} from '@/lib/booking/store';
import { getCurrentSessionUser } from '@/lib/security/auth';

export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Sign in to view notifications.' },
      { status: 401 }
    );
  }

  const items =
    user.role === 'admin'
      ? await listAllNotifications()
      : await listUserNotifications(user.id);

  return NextResponse.json({
    notifications: items,
    unreadCount: items.filter((n) => !n.isRead).length,
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Sign in to manage notifications.' },
      { status: 401 }
    );
  }
  const body = (await request.json().catch(() => ({}))) as {
    notificationId?: string;
    markAllRead?: boolean;
  };

  const items = await markNotificationsRead(
    user.id,
    body,
    user.role === 'admin'
  );

  return NextResponse.json({
    notifications: items,
    unreadCount: items.filter((n) => !n.isRead).length,
  });
}
