import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Flight Itinerary for Visa & Dummy Itinerary | DummyTicket",
  description: "Flight itinerary and flight reservation for your visa application: what embassies require, as a free PDF in 30 seconds. Schengen, US, UK and more.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'flight-itinerary-for-visa.html');
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const html = sanitizeScrapedContent(rawHtml);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Flight Itinerary Generator */}
      <section id="bookingForm" className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            Instant Flight Itinerary Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Generate Flight Itinerary for Visa
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Download your verifiable airline itinerary PDF with PNR & QR code in 30 seconds.
          </p>
        </div>
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* Guide & Embassy Advisory Articles */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
