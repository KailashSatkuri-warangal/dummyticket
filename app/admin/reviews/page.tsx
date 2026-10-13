import React from 'react';

export default function AdminReviewsPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
      <h1 className="text-xl font-extrabold text-navy-900">
        Verified Booking Reviews Moderation
      </h1>
      <p className="text-xs text-slate-600 leading-relaxed">
        Strict Policy: Only verified customers with a completed booking record may submit a review. We never fabricate customer testimonials or search engine review ratings.
      </p>
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
        <p className="font-bold text-navy-900">
          No customer reviews submitted yet
        </p>
        <p className="mt-1 text-slate-500">
          Customer reviews submitted after verified flight completion will appear here for moderation.
        </p>
      </div>
    </div>
  );
}
