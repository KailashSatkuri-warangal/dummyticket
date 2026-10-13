import { cookies } from 'next/headers';
import type { AppRole } from '@/types';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
}

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export async function getCurrentSessionUser(): Promise<SessionUser> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get('aerovista_role')?.value as AppRole | undefined;
    const emailCookie = cookieStore.get('aerovista_email')?.value;
    const nameCookie = cookieStore.get('aerovista_name')?.value;

    const role: AppRole =
      roleCookie &&
      ['customer', 'admin', 'support_agent', 'finance_manager', 'content_editor'].includes(
        roleCookie
      )
        ? roleCookie
        : 'admin'; // Default in demo mode allows reviewing both Customer & Admin workflows, switchable via header role toggle

    return {
      id: role === 'admin' ? 'usr-admin-1' : 'usr-customer-1',
      email:
        emailCookie ??
        (role === 'admin'
          ? 'admin@aerovista.example.com'
          : 'arjun.reddy@example.com'),
      fullName:
        nameCookie ??
        (role === 'admin' ? 'Kavita Rao (Admin)' : 'Arjun Reddy'),
      role,
    };
  } catch {
    return {
      id: 'usr-customer-1',
      email: 'arjun.reddy@example.com',
      fullName: 'Arjun Reddy',
      role: 'customer',
    };
  }
}

export function isAuthorizedAdminRole(role: AppRole): boolean {
  return ['admin', 'support_agent', 'finance_manager', 'content_editor'].includes(role);
}
