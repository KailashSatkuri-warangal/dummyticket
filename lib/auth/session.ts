import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAuthorizedAdminRole } from '@/lib/security/roles';
import type { AppRole } from '@/types';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: AppRole;
  roles: AppRole[];
  emailConfirmed: boolean;
}

async function loadSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: rolesRaw }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, phone, email')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.rpc('get_my_roles'),
  ]);

  const roles = (rolesRaw ?? []) as AppRole[];
  const primaryRole: AppRole =
    roles.find((r) => r === 'admin') ??
    roles.find((r) => isAuthorizedAdminRole(r)) ??
    'customer';

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? '',
    fullName: profile?.full_name ?? user.email?.split('@')[0] ?? 'Traveler',
    phone: profile?.phone ?? undefined,
    role: primaryRole,
    roles: roles.length > 0 ? roles : ['customer'],
    emailConfirmed: Boolean(user.email_confirmed_at ?? user.confirmed_at),
  };
}

// Cache per request so layout, header, and pages share one session lookup
export const getSessionUser = cache(loadSessionUser);

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}
