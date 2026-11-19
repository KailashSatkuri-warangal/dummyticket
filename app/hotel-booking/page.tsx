import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';
import { Building2, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "Hotel Booking for Visa Application: Proof of Accommodation | DummyTicket",
  description: "Generate verified hotel reservation proof for your visa application. Accepted by embassies worldwide with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'hotel-booking.html');
  const rawHtml = fs.readFileSync(filePath, 'utf8');

  // Strip broken hero and dead 34KB livewire form; keep the rich guide content starting at hbv-antwort
  const guideStartIdx = rawHtml.indexOf('<section class="hbv-antwort"');
  const guideHtml = guideStartIdx !== -1 ? rawHtml.slice(guideStartIdx) : rawHtml;
  const cleanedGuideHtml = sanitizeScrapedContent(guideHtml);

  return (
    <div className="bg-slate-50 min-h-screen pt-6 pb-20 overflow-x-hidden w-full max-w-full">
      {/* Modern High-Converting Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Proof of Accommodation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Hotel Booking Reservation for Visa Application
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3">
          Official hotel reservation voucher with your guest names, dates, hotel address & reservation confirmation number. Ready in 30 seconds as PDF for embassy appointments.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs font-bold text-gray-700">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>195+ Embassies Accepted</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
            <Clock className="w-4 h-4 text-[#0062e0]" />
            <span>Instant PDF Download</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>No Account Needed</span>
          </div>
        </div>
      </section>

      {/* Live Hotel Booking Generator */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
        <MyJetGenerator defaultTab="hotel" />
      </section>

      {/* Rich Guide & FAQ Articles */}
      {cleanedGuideHtml && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: cleanedGuideHtml }} />
        </div>
      )}
    </div>
  );
}
