import { describe, it, expect, beforeEach } from 'vitest';
import {
  flightSearchSchema,
  createBookingRequestSchema,
} from '@/lib/validation/schemas';
import {
  searchAirports,
  getDeterministicFlightOffers,
} from '@/lib/flights/dataset';
import {
  calculateCompleteFare,
  isFareSnapshotExpired,
  revalidateFareSnapshot,
  setAdminOfferAdjustment,
} from '@/lib/pricing/engine';

describe('Flight Search, Airport Autocomplete & Dynamic Pricing Unit Tests', () => {
  beforeEach(() => {
    setAdminOfferAdjustment('offer-hyd-msy-1', 0);
  });

  it('rejects identical origin and destination airports', () => {
    const result = flightSearchSchema.safeParse({
      from: 'HYD',
      to: 'HYD',
      depart: '2026-12-15',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'economy',
      tripType: 'one_way',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.to?.[0]).toContain(
        'cannot be identical'
      );
    }
  });

  it('rejects infant count exceeding adult count and total > 9 passengers', () => {
    const resInfants = flightSearchSchema.safeParse({
      from: 'HYD',
      to: 'DEL',
      depart: '2026-12-15',
      adults: 1,
      children: 0,
      infants: 2,
      cabin: 'economy',
      tripType: 'one_way',
    });
    expect(resInfants.success).toBe(false);

    const resMaxPax = flightSearchSchema.safeParse({
      from: 'HYD',
      to: 'DEL',
      depart: '2026-12-15',
      adults: 6,
      children: 4,
      infants: 0,
      cabin: 'economy',
      tripType: 'one_way',
    });
    expect(resMaxPax.success).toBe(false);
  });

  it('returns matching airports for IATA code and city queries', () => {
    const hydResults = searchAirports('HYD');
    expect(hydResults.some((a) => a.iataCode === 'HYD')).toBe(true);

    const msyResults = searchAirports('New Orleans');
    expect(msyResults.some((a) => a.iataCode === 'MSY')).toBe(true);
  });

  it('validates international passport requirements on booking requests', () => {
    const missingPassport = createBookingRequestSchema.safeParse({
      flightOfferId: 'offer-hyd-msy-1',
      fareSnapshotId: 'snap-123',
      departDate: '2026-12-15',
      contactEmail: 'traveler@example.com',
      contactPhone: '+91 9848012345',
      passengers: [
        {
          passengerType: 'adult',
          firstName: 'Arjun',
          lastName: 'Reddy',
        },
      ],
      termsAccepted: true,
      idempotencyKey: 'idem-test-001',
      isInternational: true,
    });
    expect(missingPassport.success).toBe(false);
  });

  it('calculates complete fare with passenger multipliers and WELCOME10 coupon', () => {
    const offer = getDeterministicFlightOffers({
      from: 'HYD',
      to: 'DEL',
      departDate: '2026-12-15',
      cabin: 'economy',
    })[0];

    const snapNoCoupon = calculateCompleteFare({
      offer,
      adults: 2,
      children: 1,
      infants: 1,
      cabin: 'economy',
    });

    const snapWithCoupon = calculateCompleteFare({
      offer,
      adults: 2,
      children: 1,
      infants: 1,
      cabin: 'economy',
      couponCode: 'WELCOME10',
    });

    expect(snapWithCoupon.discountTotal).toBeGreaterThan(0);
    expect(snapWithCoupon.grandTotal).toBe(
      snapNoCoupon.grandTotal - snapWithCoupon.discountTotal
    );
  });

  it('detects fare snapshot expiration accurately', () => {
    const offer = getDeterministicFlightOffers({
      from: 'HYD',
      to: 'DEL',
      departDate: '2026-12-15',
    })[0];

    const snapshot = calculateCompleteFare({
      offer,
      adults: 1,
      ttlMinutes: 10,
    });

    const futureAfterExpiry = new Date(Date.now() + 15 * 60 * 1000);
    expect(isFareSnapshotExpired(snapshot, futureAfterExpiry)).toBe(true);
  });

  it('requires explicit user acceptance when fare increases before checkout', () => {
    const offer = getDeterministicFlightOffers({
      from: 'HYD',
      to: 'MSY',
      departDate: '2026-12-15',
    })[0];

    const originalSnapshot = calculateCompleteFare({
      offer,
      adults: 1,
    });

    // Apply admin tier increase of +₹1,500
    setAdminOfferAdjustment(offer.id, 1500);

    const revalWithoutAcceptance = revalidateFareSnapshot({
      originalSnapshot,
      currentOffer: offer,
    });

    expect(revalWithoutAcceptance.hasChanged).toBe(true);
    expect(revalWithoutAcceptance.requiresUserAcceptance).toBe(true);
    expect(revalWithoutAcceptance.userMessage).toContain(
      'Your selected fare has changed from'
    );
    expect(revalWithoutAcceptance.userMessage).toContain(
      'Review the updated total before continuing.'
    );

    // Now test with explicit user acceptance of the new amount
    const revalWithAcceptance = revalidateFareSnapshot({
      originalSnapshot,
      currentOffer: offer,
      acceptedUpdatedFareInr: revalWithoutAcceptance.newAmountInr,
    });
    expect(revalWithAcceptance.requiresUserAcceptance).toBe(false);
  });
});
