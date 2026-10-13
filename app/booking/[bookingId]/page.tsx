import React from 'react';
import Link from 'next/link';
import {
  Download,
  FileText,
  CreditCard,
  Plane,
  Mail,
} from 'lucide-react';
import {
  getBookingByIdOrReference,
  listBookingEmailLogs,
} from '@/lib/booking/store';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { CancelBookingButton } from '@/components/booking/CancelBookingButton';
import { LazySignatureBoardingPass as SignatureBoardingPass } from '@/components/tickets/LazyBoardingPass';

export default async function BookingDetailsPage(props: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await props.params;
  const booking = await getBookingByIdOrReference(bookingId);

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="section-heading">
          Booking Record Not Found ({bookingId})
        </h1>
        <p className="text-sm text-slate-600">
          Please check your booking reference or look up your reservation using the track booking tool.
        </p>
        <Link
          href="/track-booking"
          className="inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          Lookup Booking Reference
        </Link>
      </div>
    );
  }

  const emails = await listBookingEmailLogs(booking.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">
            Booking Management Record
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
            Reference: {booking.bookingReference}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Booking Status:{' '}
            <strong className="uppercase text-navy-900">{booking.status}</strong>{' '}
            · Payment Status:{' '}
            <strong className="uppercase text-navy-900">
              {booking.paymentStatus}
            </strong>{' '}
            · Created: {new Date(booking.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {booking.paymentStatus !== 'captured' &&
            booking.status !== 'cancelled' && (
              <Link
                href={`/checkout/${booking.flightOfferId}?depart=${booking.departureDate}&adults=${booking.adults}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white"
              >
                <CreditCard className="h-4 w-4" />
                Complete Payment
              </Link>
            )}
          <Link
            href={`/ticket/${booking.bookingReference}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4 text-brand-600" />
            View Itinerary
          </Link>
          <a
            href={`/api/tickets/${booking.bookingReference}/pdf`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-coral-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-coral-700"
          >
            <Download className="h-4 w-4" />
            Itinerary PDF
          </a>
          <a
            href={`/api/tickets/${booking.bookingReference}/pdf?type=receipt`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-navy-800"
          >
            <Download className="h-4 w-4" />
            Receipt PDF
          </a>
        </div>
      </div>

      {booking.airlinePnr && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 flex items-center gap-2.5">
          <Plane className="h-5 w-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Airline PNR: {booking.airlinePnr}.</strong> This reservation is
            confirmed with the carrier and verifiable via the itinerary QR code.
          </span>
        </div>
      )}

      {booking.ticket && (
        <SignatureBoardingPass
          booking={booking}
          ticket={booking.ticket}
          showViewSwitcher={true}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* Itinerary Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-900">
              Flight Segments ({booking.originIata} → {booking.destinationIata})
            </h2>
            {booking.flightOffer.segments.map((seg) => (
              <div
                key={seg.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1"
              >
                <div className="flex justify-between font-bold text-navy-900">
                  <span>
                    {seg.airlineName} ({seg.flightNumber})
                  </span>
                  <span>{formatDuration(seg.durationMinutes)}</span>
                </div>
                <p className="text-slate-600">
                  {seg.originCity} ({seg.originIata}) → {seg.destinationCity} (
                  {seg.destinationIata})
                </p>
                <p className="text-slate-500">
                  Departure: {new Date(seg.departureTime).toUTCString()}
                </p>
              </div>
            ))}
          </div>

          {/* Passengers & Email Notification History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-900">
              Passengers & Transactional Email Log
            </h2>
            <ul className="divide-y divide-slate-100 text-xs">
              {booking.passengers.map((p) => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span className="font-bold text-navy-900">
                    {p.firstName} {p.lastName} ({p.passengerType.toUpperCase()})
                  </span>
                  <span className="text-slate-500">
                    {p.passportNumberMasked ?? 'Domestic ID'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-brand-600" />
                Email Notification History
              </h3>
              {emails.length === 0 ? (
                <p className="text-xs text-slate-500">No emails logged yet.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {emails.map((em) => (
                    <li
                      key={em.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                    >
                      <span>{em.subject}</span>
                      <span className="rounded bg-brand-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-brand-800">
                        {em.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Fare & Cancellation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-900">
              Audited Fare & Cancellation
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Fare</span>
                <span className="font-semibold">
                  {formatInr(booking.fareSnapshot.baseFareTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Taxes & Fees</span>
                <span className="font-semibold">
                  {formatInr(booking.fareSnapshot.taxesTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service Fee</span>
                <span className="font-semibold">
                  {formatInr(booking.fareSnapshot.serviceFeeTotal)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-navy-900">
                <span>Total Amount</span>
                <span>{formatInr(booking.totalAmount)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <CancelBookingButton
                bookingReference={booking.bookingReference}
                disabled={
                  booking.status === 'cancelled' ||
                  booking.status === 'cancel_requested'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
