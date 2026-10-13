import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      !SUPABASE_URL.includes('your-project-id')
  );
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user) {
    if (
      pathname.startsWith('/account') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/checkout')
    ) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  if (pathname.startsWith('/admin')) {
    const { data: roles } = await supabase.rpc('get_my_roles');
    const roleList = (roles ?? []) as string[];
    const isAdmin = roleList.some((r) =>
      ['admin', 'support_agent', 'finance_manager', 'content_editor'].includes(r)
    );
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/account?forbidden=admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    '/login',
    '/signup',
  ],
};
