const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');

const filesToUpdate = [
  'about',
  'dummy-ticket',
  'dummy-ticket-schengen-visa',
  'editorial-policy',
  'embassy-finder',
  'embassy-letter',
  'flight-itinerary-for-visa',
  'hotel-booking',
  'invitation-letter',
  'onward-ticket',
  'proof-of-onward-travel',
  'temporary-flight-reservation',
  'terms',
  'travel-itinerary',
  'visa-checker',
  'visa-cost-calculator',
  'visa-letter',
  'visa-risk-check'
];

for (const slug of filesToUpdate) {
  const pagePath = path.join(appDir, slug, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;

  let code = fs.readFileSync(pagePath, 'utf8');

  // Replace old branding in metadata
  code = code.replace(/MyJet24\.com/gi, 'DummyTicket.com');
  code = code.replace(/MyJet24/g, 'DummyTicket');
  code = code.replace(/myjet24/gi, 'DummyTicket');
  code = code.replace(/\$7\.90/g, '₹399');
  code = code.replace(/\$14/g, '₹399');
  code = code.replace(/\$29/g, '₹399');

  // If this is one of the generator pages, wire in MyJetGenerator
  if (slug === 'dummy-ticket') {
    code = `import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';

export const metadata: Metadata = {
  title: "Dummy Ticket for Visa: What It Is & How It Works | DummyTicket",
  description: "What a dummy ticket for a visa is, how it works, whether it is legal and what embassies check. Free PDF or verified PNR with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'dummy-ticket.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const formStart = html.indexOf('<div class="card mj-form-huelle"');
  const formEnd = html.indexOf('<div class="oc-ticket-sec" id="dt-sample">');

  const beforeForm = formStart !== -1 ? html.slice(0, formStart) : '';
  const afterForm = formEnd !== -1 ? html.slice(formEnd) : html;

  return (
    <div className="myjet-page-wrapper">
      {beforeForm && <div dangerouslySetInnerHTML={{ __html: beforeForm }} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyJetGenerator />
      </div>
      <div dangerouslySetInnerHTML={{ __html: afterForm }} />
    </div>
  );
}
`;
  } else if (slug === 'onward-ticket') {
    code = `import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';

export const metadata: Metadata = {
  title: "Onward Ticket: Free PDF or Verified PNR for ₹399 | DummyTicket",
  description: "Onward ticket for proof of onward travel at immigration. Free PDF with valid booking reference or verified airline PNR with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'onward-ticket.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const formStart = html.indexOf('<div id="bookingForm"');
  let formEnd = -1;
  if (formStart !== -1) {
    const endFormTag = html.indexOf('</form>', formStart);
    if (endFormTag !== -1) {
      formEnd = html.indexOf('</div>', endFormTag + 20);
      formEnd = html.indexOf('</div>', formEnd + 1);
    }
  }

  const beforeForm = formStart !== -1 ? html.slice(0, formStart) : '';
  const afterForm = formEnd !== -1 ? html.slice(formEnd) : html;

  return (
    <div className="myjet-page-wrapper">
      {beforeForm && <div dangerouslySetInnerHTML={{ __html: beforeForm }} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyJetGenerator />
      </div>
      <div dangerouslySetInnerHTML={{ __html: afterForm }} />
    </div>
  );
}
`;
  } else if (slug === 'hotel-booking') {
    code = `import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';

export const metadata: Metadata = {
  title: "Hotel Booking for Visa Application: Proof of Accommodation | DummyTicket",
  description: "Generate verified hotel reservation proof for your visa application. Accepted by embassies worldwide with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'hotel-booking.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const formStart = html.indexOf('<div id="bookingForm"');
  let formEnd = -1;
  if (formStart !== -1) {
    const endFormTag = html.indexOf('</form>', formStart);
    if (endFormTag !== -1) {
      formEnd = html.indexOf('</div>', endFormTag + 20);
      formEnd = html.indexOf('</div>', formEnd + 1);
    }
  }

  const beforeForm = formStart !== -1 ? html.slice(0, formStart) : '';
  const afterForm = formEnd !== -1 ? html.slice(formEnd) : html;

  return (
    <div className="myjet-page-wrapper">
      {beforeForm && <div dangerouslySetInnerHTML={{ __html: beforeForm }} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyJetGenerator defaultTab="hotel" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: afterForm }} />
    </div>
  );
}
`;
  } else if (slug === 'temporary-flight-reservation') {
    code = `import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';

export const metadata: Metadata = {
  title: "Temporary Flight Reservation: Real PNR (₹399) | DummyTicket",
  description: "Temporary flight reservation with verifiable airline PNR for visa applications. Instant PDF download with DummyTicket.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'temporary-flight-reservation.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const formStart = html.indexOf('<div class="tv-bookwrap"');
  const formEnd = html.indexOf('<section class="tv-sec" id="fares">');

  const beforeForm = formStart !== -1 ? html.slice(0, formStart) : '';
  const afterForm = formEnd !== -1 ? html.slice(formEnd) : html;

  return (
    <div className="myjet-page-wrapper">
      {beforeForm && <div dangerouslySetInnerHTML={{ __html: beforeForm }} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyJetGenerator />
      </div>
      <div dangerouslySetInnerHTML={{ __html: afterForm }} />
    </div>
  );
}
`;
  }

  fs.writeFileSync(pagePath, code, 'utf8');
  console.log(`Updated app/${slug}/page.tsx`);
}
