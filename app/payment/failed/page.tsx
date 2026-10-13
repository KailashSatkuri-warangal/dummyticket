import React from 'react';
import Link from 'next/link';
import { XCircle, RotateCcw, LifeBuoy } from 'lucide-react';

export default async function PaymentFailedPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const bookingRef = typeof sp.booking === 'string' ? sp.booking : '';
  const reason =
    typeof sp.reason === 'string'
      ? sp.reason
      : 'The payment transaction was cancelled, timed out, or failed signature verification.';

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <XCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900">
        Payment Incomplete or Declined
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">{reason}</p>
      {bookingRef && (
        <p className="text-xs font-mono text-slate-500">
          Booking Reference: <strong>{bookingRef}</strong> (No amount has been captured)
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
        <Link
          href={bookingRef ? `/checkout/${bookingRef}` : '/flights'}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Payment Checkout
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
        >
          <LifeBuoy className="h-4 w-4 text-brand-600" />
          Contact Billing Support
        </Link>
      </div>
    </div>
  );
}
