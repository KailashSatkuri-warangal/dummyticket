'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const POLL_MS = 10_000;

// Catalog tables only carry non-sensitive content. postgres_changes payloads
// are visible to any subscriber holding the anon key, so PII tables
// (bookings, payments, profiles, refunds, email_logs, notifications) are
// deliberately excluded — those pages refresh via the polling loop.
const LIVE_TABLES = [
  'coupons',
  'airports',
  'airlines',
  'fare_rules',
  'blog_posts',
  'destinations',
  'route_pages',
  'site_settings',
] as const;

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | undefined;

    const refresh = () => {
      if (!cancelled) router.refresh();
    };

    const supabase = createSupabaseBrowserClient();
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | undefined;
    if (supabase) {
      let ch = supabase.channel('admin-realtime');
      for (const table of LIVE_TABLES) {
        ch = ch.on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          refresh
        );
      }
      ch.subscribe();
      channel = ch;
    }

    const startPolling = () => {
      if (!pollId) pollId = setInterval(refresh, POLL_MS);
    };
    const stopPolling = () => {
      if (pollId) {
        clearInterval(pollId);
        pollId = undefined;
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        refresh();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    startPolling();

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener('visibilitychange', onVisibility);
      if (channel) void channel.unsubscribe();
    };
  }, [router]);

  return null;
}
