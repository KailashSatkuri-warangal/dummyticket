import { NextResponse } from 'next/server';
import { getDeterministicFlightOffers } from '@/lib/flights/dataset';
import { calculateCompleteFare } from '@/lib/pricing/engine';
import {
  createPendingBooking,
  saveFareSnapshot,
  recordLead,
  updateBookingRecord,
  persistEmailLog,
} from '@/lib/booking/store';
import { sendTransactionalEmailWithRetry } from '@/lib/email/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const origin = (body.origin || 'DEL').toUpperCase();
    const destination = (body.destination || 'LHR').toUpperCase();
    const departDate = body.departureDate || new Date().toISOString().split('T')[0];
    const returnDate = body.returnDate || undefined;
    const contactEmail = body.contactEmail || 'traveler@example.com';
    const contactPhone = body.contactPhone || '+1234567890';

    const passengersRaw = Array.isArray(body.passengers) && body.passengers.length > 0
      ? body.passengers
      : [{ firstName: 'John', lastName: 'Doe', passport: '' }];

    const passengers = passengersRaw.map((p: any) => ({
      passengerType: 'adult' as const,
      firstName: p.firstName?.trim() || 'John',
      lastName: p.lastName?.trim() || 'Doe',
      passportNumber: p.passport?.trim() || undefined,
    }));

    // Generate or get deterministic offer for this route
    const offers = getDeterministicFlightOffers({
      from: origin,
      to: destination,
      departDate,
    });
    const offer = offers[0];

    if (!offer) {
      return NextResponse.json(
        { error: 'Could not find routes between these airports.' },
        { status: 400 }
      );
    }

    // Calculate fare snapshot
    const fare = calculateCompleteFare({
      offer,
      adults: passengers.length,
      children: 0,
      infants: 0,
      cabin: 'economy',
    });

    const snapshot = saveFareSnapshot(fare);

    const idempotencyKey = `instant_${origin}_${destination}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    const { booking } = await createPendingBooking({
      flightOfferId: offer.id,
      fareSnapshot: snapshot,
      departDate,
      returnDate,
      contactEmail,
      contactPhone,
      passengers,
      idempotencyKey,
    });

    let finalBooking = booking;
    if (body.plan === 'free') {
      const updated = await updateBookingRecord(booking.id, {
        ticketStatus: 'issued',
        status: 'confirmed',
        paymentStatus: 'captured',
      });
      if (updated) {
        finalBooking = updated;
      }
    }

    // Dispatch instant ticket confirmation email with direct PDF itinerary link
    try {
      const primaryPassenger = passengers[0];
      const fullName = `${primaryPassenger?.firstName || 'Traveler'} ${primaryPassenger?.lastName || ''}`.trim();
      const emailLog = await sendTransactionalEmailWithRetry({
        bookingId: finalBooking.id,
        bookingReference: finalBooking.bookingReference,
        recipientEmail: contactEmail,
        templateName: 'booking_confirmation',
        variables: {
          passengerName: fullName,
          originIata: origin,
          destinationIata: destination,
          departureDate: departDate,
          totalAmountInr: finalBooking.totalAmount,
          paymentStatus: finalBooking.status === 'confirmed' ? 'CONFIRMED' : 'RESERVATION HELD',
        },
      });
      await persistEmailLog(emailLog);
    } catch (emailErr) {
      console.warn('[instant-booking] Failed to send instant itinerary email:', emailErr);
    }

    // Auto-record as customer lead for Admin CRM
    try {
      const primaryPassenger = passengers[0];
      const fullName = `${primaryPassenger?.firstName || 'Traveler'} ${primaryPassenger?.lastName || ''}`.trim();
      await recordLead({
        name: fullName,
        email: contactEmail,
        phone: contactPhone,
        origin,
        destination,
        departureDate: departDate,
        tripType: returnDate ? 'roundtrip' : 'oneway',
        passengersCount: passengers.length,
        plan: body.plan === 'free' ? 'free' : 'premium',
        notes: `Instant ticket booking generated with PNR ${finalBooking.bookingReference}`,
        status: body.plan === 'free' ? 'converted' : 'new',
      });
    } catch (e) {
      console.warn('[instant-booking] Failed to capture lead:', e);
    }

    return NextResponse.json({
      success: true,
      bookingReference: finalBooking.bookingReference,
      bookingId: finalBooking.id,
      offerId: offer.id,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to auto-generate dummy ticket itinerary.',
      },
      { status: 500 }
    );
  }
}
