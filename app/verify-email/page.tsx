import React from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export default async function VerifyEmailPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const email = typeof sp.email === 'string' ? sp.email : 'your email address';

  return (
    <div className="mx-auto max-w-md px-4 py-14 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-elevated space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Verify Your Email Address
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          We have sent a verification link to <strong>{email}</strong>. Click the link in your inbox to activate your account.
        </p>
        <div className="pt-2">
          <Link
            href="/account"
            className="inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
          >
            Continue to Customer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
