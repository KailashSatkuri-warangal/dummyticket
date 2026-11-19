import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { PnrFlightSearch } from '@/components/flights/PnrFlightSearch';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Dummy Ticket for Visa: What It Is & How It Works | DummyTicket",
  description: "What a dummy ticket for a visa is, how it works, whether it is legal and what embassies check. Free PDF or verified PNR with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'dummy-ticket.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Boundary 1: Cut out at the clean end of .dthero (right before the old static generator container)
  const splitPoint = '<div style="max-width:1280px;margin:0 auto;padding:2.5rem 1.5rem 0;">';
  const splitIdx = html.indexOf(splitPoint);
  let beforeForm = splitIdx !== -1 ? html.slice(0, splitIdx) : '';

  // Boundary 2: Locate the static main-grid (after dt-sample and old generator)
  const mainGridIdx = html.indexOf('id="main-grid"');
  let afterDtSample = '';
  if (mainGridIdx !== -1) {
    const containerDivIdx = html.lastIndexOf('<div style="max-width:1280px', mainGridIdx);
    afterDtSample = containerDivIdx !== -1 ? html.slice(containerDivIdx) : html.slice(mainGridIdx);
  } else {
    afterDtSample = html;
  }

  // Sanitize both halves cleanly
  beforeForm = sanitizeScrapedContent(beforeForm);
  afterDtSample = sanitizeScrapedContent(
    afterDtSample
      .replace(/<table class="acceptance-table"/g, '<div style="overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch;"><table class="acceptance-table"')
      .replace(/<\/table>/g, '</table></div>')
  );

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Intro */}
      {beforeForm && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: beforeForm }} />
        </div>
      )}

      {/* 1. Live Interactive Dummy Ticket Generator */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <MyJetGenerator />
      </section>

      {/* 2. Live PNR Search & Flight Status Verifier (replaces static Sample Preview) */}
      <PnrFlightSearch />

      {/* 3. Polished Guide & Articles */}
      <div className="myjet-page-wrapper pb-16 overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: afterDtSample }} />
      </div>
    </div>
  );
}
