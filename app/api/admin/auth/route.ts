import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'admin0722';
const ADMIN_PASSWORD = 'D1Q0!@!).';
const ADMIN_COOKIE_NAME = 'dummyticket_admin_token';
const ADMIN_COOKIE_VALUE = 'admin0722_verified_session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        user: {
          username: ADMIN_USERNAME,
          role: 'admin',
          fullName: 'Master Administrator',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid admin username or password.' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to authenticate admin.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (token === ADMIN_COOKIE_VALUE) {
    return NextResponse.json({
      authenticated: true,
      username: ADMIN_USERNAME,
      role: 'admin',
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: 'Admin logged out' });
}
