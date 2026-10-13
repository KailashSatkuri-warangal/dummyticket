import React from 'react';
import Link from 'next/link';
import { getBookingByIdOrReference } from '@/lib/booking/store';
import { formatInr } from '@/lib/config/brand';
import { CancelBookingButton } from '@/components/booking/CancelBookingButton';
import { Download, ExternalLink } from 'lucide-react';

export default async function AccountSingleBookingPage(props: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await props.params;
  const booking =
    getBookingByIdOrReference(bookingId) ??
    getBookingByIdOrReference('AV-HYD842MSY')!;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-brand-600">
              Account Booking Record
            </span>
            <h1 className="text-2xl font-extrabold text-navy-900">
              {booking.bookingReference} · {booking.originIata} →{' '}
              {booking.destinationIata}
            </h1>
            <p className="text-xs text-slate-500">
              Departure: {booking.departureDate} · Status:{' '}
              <strong className="uppercase">{booking.status}</strong> · Payment:{' '}
              <strong className="uppercase">{booking.paymentStatus}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/sample-ticket/${booking.bookingReference}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
            >
              Sample Document <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <a
              href={`/api/tickets/${booking.bookingReference}/pdf`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
            <p className="font-bold text-navy-900">Passengers</p>
            {booking.passengers.map((p) => (
              <p key={p.id}>
                • {p.firstName} {p.lastName} ({p.passengerType})
              </p>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
            <p className="font-bold text-navy-900">Audited Fare Total</p>
            <p>Base: {formatInr(booking.fareSnapshot.baseFareTotal)}</p>
            <p>Taxes: {formatInr(booking.fareSnapshot.taxesTotal)}</p>
            <p className="font-extrabold text-sm text-brand-700">
              Total: {formatInr(booking.totalAmount)}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <CancelBookingButton
            bookingReference={booking.bookingReference}
            disabled={booking.status === 'cancelled'}
          />
        </div>
      </div>
    </div>
  );
}
