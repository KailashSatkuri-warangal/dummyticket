'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  User,
  Tag,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { getFlightOfferById } from '@/lib/flights/dataset';
import { calculateCompleteFare } from '@/lib/pricing/engine';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { BookingStepper } from '@/components/booking/BookingStepper';
import type { CabinClass, PassengerInput } from '@/types';

export default function CheckoutPage() {
  const params = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawId = params.bookingId || 'offer-hyd-msy-1';
  const departDate = searchParams.get('depart') || '2026-12-15';
  const adultsCount = Math.max(1, Number(searchParams.get('adults') ?? 1));
  const childrenCount = Math.max(0, Number(searchParams.get('children') ?? 0));
  const infantsCount = Math.max(0, Number(searchParams.get('infants') ?? 0));
  const cabin = (searchParams.get('cabin') || 'economy') as CabinClass;

  const offer = useMemo(
    () => getFlightOfferById(rawId, departDate, cabin),
    [rawId, departDate, cabin]
  );

  const isInternational = Boolean(
    offer &&
      (offer.origin.countryCode !== 'IN' ||
        offer.destination.countryCode !== 'IN')
  );

  const initialPassengers = useMemo<PassengerInput[]>(() => {
    const list: PassengerInput[] = [];
    for (let i = 0; i < adultsCount; i++) {
      list.push({
        passengerType: 'adult',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        passportNumber: '',
        passportExpiry: '',
        nationality: 'IN',
      });
    }
    for (let i = 0; i < childrenCount; i++) {
      list.push({
        passengerType: 'child',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'female',
        passportNumber: '',
        passportExpiry: '',
        nationality: 'IN',
      });
    }
    for (let i = 0; i < infantsCount; i++) {
      list.push({
        passengerType: 'infant',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        passportNumber: '',
        passportExpiry: '',
        nationality: 'IN',
      });
    }
    return list;
  }, [adultsCount, childrenCount, infantsCount]);

  const [passengers, setPassengers] =
    useState<PassengerInput[]>(initialPassengers);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fareDisclosureAccepted, setFareDisclosureAccepted] = useState(false);

  // Dynamic Fare Change Alert State
  const [fareChangeAlert, setFareChangeAlert] = useState<{
    message: string;
    oldAmountInr: number;
    newAmountInr: number;
  } | null>(null);
  const [acceptedUpdatedFareInr, setAcceptedUpdatedFareInr] = useState<
    number | undefined
  >();

  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const computedSnapshot = useMemo(() => {
    if (!offer) return null;
    return calculateCompleteFare({
      offer,
      adults: adultsCount,
      children: childrenCount,
      infants: infantsCount,
      cabin,
      couponCode: appliedCoupon,
    });
  }, [offer, adultsCount, childrenCount, infantsCount, cabin, appliedCoupon]);

  if (!offer || !computedSnapshot) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-navy-900">
          Unable to Load Checkout Session
        </h1>
        <Link
          href="/flights"
          className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white"
        >
          Return to Flights
        </Link>
      </div>
    );
  }

  function updatePassenger(
    index: number,
    field: keyof PassengerInput,
    value: string
  ) {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function handleApplyCoupon() {
    const clean = couponInput.trim().toUpperCase();
    if (clean === 'WELCOME10' || clean === 'FLAT500') {
      setAppliedCoupon(clean);
      setErrorBanner(null);
    } else {
      setErrorBanner(
        'Invalid coupon code. Try WELCOME10 (10% off) or FLAT500 (₹500 off).'
      );
    }
  }

  async function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    setErrorBanner(null);

    if (!termsAccepted || !fareDisclosureAccepted) {
      setErrorBanner(
        'Please accept both the Booking Terms & Conditions and the Itinerary Delivery Disclosure before paying.'
      );
      return;
    }

    if (
      fareChangeAlert &&
      acceptedUpdatedFareInr !== fareChangeAlert.newAmountInr
    ) {
      setErrorBanner(
        'Please click "Accept Updated Fare" in the fare change notice before continuing.'
      );
      return;
    }

    setSubmitting(true);

    try {
      // Step 5: Create Pending Booking on Server
      const idempotencyKey = `idem-${offer!.id}-${contactEmail}-${departDate}`;
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightOfferId: offer!.id,
          fareSnapshotId: computedSnapshot!.id,
          departDate,
          contactEmail,
          contactPhone,
          passengers,
          couponCode: appliedCoupon,
          termsAccepted: true,
          fareDisclosureAccepted: true,
          acceptedUpdatedFareInr,
          idempotencyKey,
          isInternational,
        }),
      });

      const bookingData = await bookingRes.json();

      if (
        bookingRes.status === 409 &&
        bookingData.code === 'FARE_CHANGED_CONFIRMATION_REQUIRED'
      ) {
        setFareChangeAlert({
          message: bookingData.error,
          oldAmountInr: bookingData.oldAmountInr,
          newAmountInr: bookingData.newAmountInr,
        });
        setSubmitting(false);
        return;
      }

      if (!bookingRes.ok) {
        setErrorBanner(
          bookingData.error || 'Please check all required passenger fields.'
        );
        setSubmitting(false);
        return;
      }

      const createdBooking = bookingData.booking;

      // Step 6: Create Server-Side Razorpay Order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: createdBooking.id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setErrorBanner(orderData.error || 'Could not initialize payment order.');
        setSubmitting(false);
        return;
      }

      // Step 7: Server-Side Payment Signature Verification
      if (orderData.sandboxTestCredentials) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: createdBooking.id,
            ...orderData.sandboxTestCredentials,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.verified) {
          router.push(
            `/payment/success?booking=${createdBooking.bookingReference}&paymentId=${orderData.sandboxTestCredentials.razorpay_payment_id}`
          );
          return;
        } else {
          router.push(
            `/payment/failed?booking=${createdBooking.bookingReference}&reason=${encodeURIComponent(
              verifyData.error || 'Verification failed'
            )}`
          );
          return;
        }
      } else {
        // Real or Test API Key Mode: Launch Razorpay Checkout Modal
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          const RazorpayConstructor = (
            window as unknown as {
              Razorpay: new (opts: unknown) => { open: () => void };
            }
          ).Razorpay;
          const rzp = new RazorpayConstructor({
            key: orderData.keyId,
            amount: orderData.amountSubunits,
            currency: orderData.currency,
            name: 'DummyTicket',
            description: `Flight Booking ${createdBooking.bookingReference}`,
            order_id: orderData.orderId,
            prefill: {
              name: `${passengers[0]?.firstName} ${passengers[0]?.lastName}`.trim(),
              email: contactEmail,
              contact: contactPhone,
            },
            theme: { color: '#001B94' },
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookingId: createdBooking.id,
                  ...response,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.verified) {
                router.push(
                  `/payment/success?booking=${createdBooking.bookingReference}&paymentId=${response.razorpay_payment_id}`
                );
              } else {
                router.push(
                  `/payment/failed?booking=${createdBooking.bookingReference}&reason=${encodeURIComponent(
                    verifyData.error || 'Verification failed'
                  )}`
                );
              }
            },
            modal: {
              ondismiss: () => {
                setSubmitting(false);
              },
            },
          });
          rzp.open();
        };
        script.onerror = () => {
          setErrorBanner('Failed to load Razorpay payment gateway.');
          setSubmitting(false);
        };
      }
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : 'Checkout error occurred.'
      );
      setSubmitting(false);
    }
  }

  const displayTotal = fareChangeAlert
    ? fareChangeAlert.newAmountInr
    : computedSnapshot.grandTotal;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep={submitting ? 'payment' : 'passengers'} />

      {/* Header & Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">
            Secure Multi-Step Checkout
          </span>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-navy-900">
            Passenger Details & Razorpay Verification
          </h1>
        </div>
      </div>

      {/* Fare Change Revalidation Banner */}
      {fareChangeAlert && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-amber-500 bg-amber-50 p-5 text-amber-950 shadow-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold">Fare Revalidation Notice</h2>
                <p className="mt-1 text-xs font-medium">
                  {fareChangeAlert.message}
                </p>
              </div>
            </div>
            {acceptedUpdatedFareInr === fareChangeAlert.newAmountInr ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-verified-600 px-3 py-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="h-4 w-4" />
                Updated Fare Accepted
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setAcceptedUpdatedFareInr(fareChangeAlert.newAmountInr)
                }
                className="shrink-0 rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white hover:bg-amber-950"
              >
                Accept Updated Fare ({formatInr(fareChangeAlert.newAmountInr)})
              </button>
            )}
          </div>
        </div>
      )}

      {errorBanner && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-700"
        >
          {errorBanner}
        </div>
      )}

      <form
        onSubmit={handleProceedToPayment}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left 8 Columns: Passenger Forms & Terms Consent */}
        <div className="lg:col-span-8 space-y-6">
          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-900">
              1. Booking Contact & Delivery Details
            </h2>
            <p className="text-xs text-slate-500">
              Your booking confirmation and downloadable PDF itinerary will be sent to this email address.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (with Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <User className="h-4 w-4 text-brand-600" />
                2. Passenger Details ({passengers.length} Traveler
                {passengers.length > 1 ? 's' : ''})
              </h2>
              <span className="text-[11px] text-slate-500">
                Names must match government-issued travel ID
              </span>
            </div>

            {passengers.map((pax, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Passenger {idx + 1} · {pax.passengerType}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First / Given Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={pax.firstName}
                      onChange={(e) =>
                        updatePassenger(idx, 'firstName', e.target.value)
                      }
                      placeholder="e.g., Arjun"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last / Family Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={pax.lastName}
                      onChange={(e) =>
                        updatePassenger(idx, 'lastName', e.target.value)
                      }
                      placeholder="e.g., Reddy"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={pax.dateOfBirth || ''}
                      onChange={(e) =>
                        updatePassenger(idx, 'dateOfBirth', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900"
                    />
                  </div>
                </div>

                {isInternational && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Passport Number (Required for International) *
                      </label>
                      <input
                        type="text"
                        required
                        value={pax.passportNumber || ''}
                        onChange={(e) =>
                          updatePassenger(idx, 'passportNumber', e.target.value)
                        }
                        placeholder="e.g., Z4988921"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Passport Expiration Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={departDate}
                        value={pax.passportExpiry || ''}
                        onChange={(e) =>
                          updatePassenger(idx, 'passportExpiry', e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <p className="text-[11px] text-slate-500">
              <strong>Privacy Notice:</strong> Passport numbers are masked immediately upon storage (e.g., <code>****8921</code>) and are never included in plain-text emails.
            </p>
          </div>

          {/* Explicit Terms & Itinerary Delivery Consent */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
            <h2 className="text-base font-bold text-navy-900">
              3. Mandatory Disclosures & Consent
            </h2>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={fareDisclosureAccepted}
                onChange={(e) => setFareDisclosureAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-brand-600"
              />
              <span>
                <strong>Itinerary Delivery Disclosure:</strong> I understand my confirmed
                itinerary and e-ticket document will be delivered digitally to the contact
                email above, and that fares are re-validated on the server before payment
                capture.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-brand-600"
              />
              <span>
                I accept the{' '}
                <Link href="/terms-and-conditions" className="text-brand-600 underline">
                  Terms & Conditions
                </Link>
                ,{' '}
                <Link href="/cancellation-policy" className="text-brand-600 underline">
                  Cancellation Policy
                </Link>
                , and{' '}
                <Link href="/privacy-policy" className="text-brand-600 underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>
        </div>

        {/* Right 4 Columns: Summary, Promo Code & Payment Action */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated sticky top-24 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-brand-600">
                {offer.airline.name} · {offer.flightNumber}
              </span>
              <h3 className="text-lg font-extrabold text-navy-900">
                {offer.origin.iataCode} → {offer.destination.iataCode}
              </h3>
              <p className="text-xs text-slate-500">
                {departDate} · {formatDuration(offer.durationMinutes)} ·{' '}
                {offer.cabin.toUpperCase()}
              </p>
            </div>

            {/* Coupon Code Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Promo Code (Try <code className="text-brand-700">WELCOME10</code> or{' '}
                <code className="text-brand-700">FLAT500</code>)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs uppercase font-semibold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Tag className="h-3 w-3" />
                  Apply
                </button>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({passengers.length} pax)</span>
                <span className="font-semibold text-navy-900">
                  {formatInr(computedSnapshot.baseFareTotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Airport Fees</span>
                <span className="font-semibold text-navy-900">
                  {formatInr(computedSnapshot.taxesTotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Disclosed Platform Service Fee</span>
                <span className="font-semibold text-navy-900">
                  {formatInr(computedSnapshot.serviceFeeTotal)}
                </span>
              </div>
              {computedSnapshot.discountTotal > 0 && (
                <div className="flex justify-between text-verified-700 font-semibold">
                  <span>Coupon ({computedSnapshot.couponCode})</span>
                  <span>-{formatInr(computedSnapshot.discountTotal)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                <span className="text-sm font-bold text-navy-900">
                  Total Payable
                </span>
                <span className="text-2xl font-extrabold text-brand-700">
                  {formatInr(displayTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>
                {submitting
                  ? 'Verifying Razorpay Order...'
                  : `Pay ${formatInr(displayTotal)} via Razorpay`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-verified-600 shrink-0" />
              Server-side HMAC-SHA256 signature verification enabled
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
