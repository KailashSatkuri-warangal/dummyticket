import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Dummy Ticket for Schengen Visa 2026 – Free PDF | DummyTicket",
  description: "Dummy ticket for your Schengen visa: free PDF with booking reference in 30 seconds, or a real PNR for ₹399. What all 29 Schengen states ask for.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'dummy-ticket-schengen-visa.html');
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const html = sanitizeScrapedContent(rawHtml);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Flight Generator for Schengen */}
      <section id="bookingForm" className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            🇪🇺 Schengen Visa Specialist
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Generate Schengen Visa Dummy Ticket
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Embassy-accepted round-trip flight itinerary with valid airline booking code (PNR) and scannable QR code.
          </p>
        </div>
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* 29 Schengen States Guide & Requirements */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
