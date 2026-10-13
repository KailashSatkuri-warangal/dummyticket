import React from 'react';
import Link from 'next/link';
import {
  Download,
  FileText,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { getBookingByIdOrReference } from '@/lib/booking/store';
import { LazySignatureBoardingPass as SignatureBoardingPass } from '@/components/tickets/LazyBoardingPass';
import { BookingStepper } from '@/components/booking/BookingStepper';

export default async function TicketPage(props: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await props.params;
  const booking = await getBookingByIdOrReference(reference);

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="section-heading">
          Itinerary Not Found ({reference})
        </h1>
        <p className="text-sm text-slate-600">
          No booking record was found matching this reference. Please check your reference or search for a new flight.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/track-booking"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
          >
            Lookup Booking Reference
          </Link>
          <Link
            href="/flights"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
          >
            Search Flights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep="confirmation" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/booking/${booking.bookingReference}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Booking Overview ({booking.bookingReference})
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/tickets/${booking.bookingReference}/pdf`}
            className="inline-flex items-center gap-2 rounded-xl bg-coral-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-coral-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Itinerary PDF
          </a>
          <a
            href={`/api/tickets/${booking.bookingReference}/pdf?type=receipt`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-navy-900 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <FileText className="h-4 w-4 text-brand-600" />
            Download Separate Payment Receipt PDF
          </a>
        </div>
      </div>

      {/* Confirmed Reservation Banner */}
      <div
        role="region"
        aria-label="Reservation Status"
        className="rounded-2xl border-2 border-verified-500 bg-verified-50 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-verified-700 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-verified-800">
              {booking.paymentStatus === 'captured'
                ? 'Server-Verified Reservation'
                : 'Itinerary Document'}
            </p>
            <p className="text-[11px] font-medium text-verified-900">
              {booking.airlinePnr
                ? `Airline PNR ${booking.airlinePnr} · Verification token bound to booking ${booking.bookingReference}.`
                : 'This itinerary is bound to booking reference ' +
                  booking.bookingReference +
                  ' and is verifiable online.'}
            </p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white border border-verified-200 px-2.5 py-1 text-xs font-bold text-verified-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          QR Verifiable
        </span>
      </div>

      {/* Signature Boarding Pass with 3D Flip Reveal & View Switcher */}
      {booking.ticket && (
        <SignatureBoardingPass
          booking={booking}
          ticket={booking.ticket}
          animateReveal={true}
          showViewSwitcher={true}
        />
      )}
    </div>
  );
}
