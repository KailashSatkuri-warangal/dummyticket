import { NextResponse } from 'next/server';
import { createBookingRequestSchema } from '@/lib/validation/schemas';
import {
  createPendingBooking,
  getBookingByIdOrReference,
  getFareSnapshotById,
  listUserBookings,
  recordAuditLog,
  saveFareSnapshot,
} from '@/lib/booking/store';
import { getFlightOfferById } from '@/lib/flights/dataset';
import {
  calculateCompleteFare,
  revalidateFareSnapshot,
} from '@/lib/pricing/engine';
import { checkRateLimit } from '@/lib/security/auth';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  const user = await getSessionUser();
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const email = searchParams.get('email');

  if (reference) {
    const booking = await getBookingByIdOrReference(reference);
    if (!booking) {
      return NextResponse.json(
        { error: 'No booking found with that reference.' },
        { status: 404 }
      );
    }
    if (
      email &&
      booking.contactEmail.toLowerCase() !== email.trim().toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Email address does not match the booking record.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ booking });
  }

  if (!user) {
    return NextResponse.json(
      { error: 'Sign in to view your bookings.' },
      { status: 401 }
    );
  }
  return NextResponse.json({ bookings: await listUserBookings(user.id) });
}

export async function POST(request: Request) {
  const rate = checkRateLimit('api_bookings_create', 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before creating another booking.' },
      { status: 429 }
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to complete your booking.' },
      { status: 401 }
    );
  }

  try {
    const raw = await request.json();
    const parsed = createBookingRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Please review the highlighted passenger or booking fields.',
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const offer = getFlightOfferById(data.flightOfferId, data.departDate);
    if (!offer) {
      return NextResponse.json(
        { error: 'Selected flight offer is no longer available.' },
        { status: 404 }
      );
    }

    const adultsCount = data.passengers.filter(
      (p) => p.passengerType === 'adult'
    ).length;
    const childrenCount = data.passengers.filter(
      (p) => p.passengerType === 'child'
    ).length;
    const infantsCount = data.passengers.filter(
      (p) => p.passengerType === 'infant'
    ).length;

    const existingSnapshot =
      (await getFareSnapshotById(data.fareSnapshotId)) ??
      calculateCompleteFare({
        offer,
        adults: Math.max(1, adultsCount),
        children: childrenCount,
        infants: infantsCount,
        cabin: offer.cabin,
        couponCode: data.couponCode,
        snapshotId: data.fareSnapshotId,
      });

    // Server-side fare revalidation before booking creation
    const revalidation = revalidateFareSnapshot({
      originalSnapshot: existingSnapshot,
      currentOffer: offer,
      couponCode: data.couponCode,
      acceptedUpdatedFareInr: data.acceptedUpdatedFareInr,
    });

    if (revalidation.requiresUserAcceptance) {
      saveFareSnapshot(revalidation.updatedSnapshot);
      return NextResponse.json(
        {
          code: 'FARE_CHANGED_CONFIRMATION_REQUIRED',
          error: revalidation.userMessage,
          oldAmountInr: revalidation.oldAmountInr,
          newAmountInr: revalidation.newAmountInr,
          updatedSnapshot: revalidation.updatedSnapshot,
        },
        { status: 409 }
      );
    }

    const finalSnapshot = saveFareSnapshot(revalidation.updatedSnapshot);

    const { booking, deduplicated } = await createPendingBooking({
      flightOfferId: offer.id,
      fareSnapshot: finalSnapshot,
      departDate: data.departDate,
      returnDate: data.returnDate,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      passengers: data.passengers,
      idempotencyKey: data.idempotencyKey,
      fareChangeAccepted: revalidation.hasChanged,
      userId: user.id,
    });

    return NextResponse.json({
      booking,
      deduplicated,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Unable to create booking record.',
      },
      { status: 500 }
    );
  }
}
