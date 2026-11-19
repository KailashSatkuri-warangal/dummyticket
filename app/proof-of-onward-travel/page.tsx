import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Proof of Onward Travel: Which Countries Require It | DummyTicket",
  description: "Which countries ask for proof of onward travel at check-in or the border: table for 195 destinations, and how to show it with a free PDF or real PNR.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'proof-of-onward-travel.html');
  let rawHtml = fs.readFileSync(filePath, 'utf8');

  // Strip the oc-video-band with MacBook video explainer completely
  rawHtml = rawHtml.replace(/<div class="oc-video-band"[\s\S]*?(?=<div style="max-width:1280px)/gi, '');
  const html = sanitizeScrapedContent(rawHtml);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Flight Generator for Onward Travel */}
      <section id="bookingForm" className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            ✈ Proof of Onward Travel Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Proof of Onward Travel PDF
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Accepted by airlines at airport check-in and immigration border control across 195+ countries.
          </p>
        </div>
        <MyJetGenerator defaultTab="flight" />
      </section>

      {/* 195 Countries Immigration Directory */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
