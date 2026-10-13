import { NextResponse } from 'next/server';
import { recordAuditLog, updateProfile } from '@/lib/booking/store';
import { getSessionUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    id: user?.id,
    email: user?.email,
    fullName: user?.fullName,
    phone: user?.phone,
  });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Sign in to update your profile.' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      fullName?: string;
      phone?: string;
      preferredCurrency?: string;
      marketingConsent?: boolean;
      saveTravelerConsent?: boolean;
      deletionRequested?: boolean;
    };

    const patch: Parameters<typeof updateProfile>[1] = {};
    if (typeof body.fullName === 'string' && body.fullName.trim().length >= 2) {
      patch.fullName = body.fullName.trim().slice(0, 120);
    }
    if (typeof body.phone === 'string') {
      patch.phone = body.phone.trim().slice(0, 20);
    }
    if (body.preferredCurrency === 'INR' || body.preferredCurrency === 'USD') {
      patch.preferredCurrency = body.preferredCurrency;
    }
    if (typeof body.marketingConsent === 'boolean') {
      patch.marketingConsent = body.marketingConsent;
    }
    if (typeof body.saveTravelerConsent === 'boolean') {
      patch.saveTravelerConsent = body.saveTravelerConsent;
    }
    if (body.deletionRequested === true) {
      patch.deletionRequested = true;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'No valid profile fields supplied.' },
        { status: 400 }
      );
    }

    await updateProfile(user.id, patch);

    if (patch.deletionRequested) {
      await recordAuditLog({
        actorId: user.id,
        actorEmail: user.email,
        action: 'ACCOUNT_DELETION_REQUESTED',
        resourceType: 'profile',
        resourceId: user.id,
        afterState: { requestedAt: new Date().toISOString() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to update profile settings.',
      },
      { status: 500 }
    );
  }
}
