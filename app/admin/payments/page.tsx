import React from 'react';
import Link from 'next/link';
import { listAllPayments } from '@/lib/booking/store';
import { formatInr } from '@/lib/config/brand';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const payments = await listAllPayments();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" />
            Payments, Orders & Razorpay Transactions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time ledger of Razorpay order IDs, payment captures, currency conversions, and HMAC signature states.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Total Transactions: <span className="text-navy-900 font-extrabold">{payments.length}</span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No payment transactions yet</p>
          <p className="mt-1 text-slate-500">
            Razorpay orders and verified payment records will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-3">Booking Ref</th>
                <th className="px-3.5 py-3">Razorpay Order ID</th>
                <th className="px-3.5 py-3">Payment ID</th>
                <th className="px-3.5 py-3">Amount (INR)</th>
                <th className="px-3.5 py-3">HMAC Verification</th>
                <th className="px-3.5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3.5 py-3.5 font-mono font-bold text-brand-700">
                    <Link
                      href={`/booking/${p.bookingReference}`}
                      className="hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      {p.bookingReference}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5 font-mono text-slate-600">
                    {p.razorpayOrderId}
                  </td>
                  <td className="px-3.5 py-3.5 font-mono">
                    {p.razorpayPaymentId ? (
                      <span className="text-emerald-700 font-bold">{p.razorpayPaymentId}</span>
                    ) : (
                      <span className="text-slate-400 italic">Pending Capture</span>
                    )}
                  </td>
                  <td className="px-3.5 py-3.5 font-black text-navy-900 text-sm">
                    {formatInr(p.amountInr)}
                    <div className="text-[10px] text-slate-400 font-normal">
                      {p.amountSubunits} subunits
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5">
                    {p.razorpaySignatureVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified HMAC
                      </span>
                    ) : p.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Pending Signature
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-3.5 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.status === 'captured'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
