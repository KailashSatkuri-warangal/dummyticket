import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Onward Ticket: Free PDF or Verified PNR for ₹399 | DummyTicket",
  description: "Onward ticket for proof of onward travel at immigration. Free PDF with valid booking reference or verified airline PNR with DummyTicket.",
};

const TICKET_CARD_HTML = `
<div class="dt-hero-art" style="width:100%;max-width:440px;">
  <div class="dt-ticket-card-3d" style="width:100%;background:#ffffff;border-radius:24px;padding:24px;border:1px solid rgba(219,234,254,0.9);box-shadow:0 25px 60px -15px rgba(0,98,224,0.22),0 10px 25px -5px rgba(15,23,42,0.08);position:relative;overflow:hidden;color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#0062e0,#1d4ed8);display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:900;font-size:15px;">DT</div>
        <div>
          <div style="font-weight:900;font-size:14px;color:#0f172a;">DUMMYTICKET AIRWAYS</div>
          <div style="font-size:10px;font-weight:800;color:#0062e0;text-transform:uppercase;">Verified Onward Travel</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;">PNR Code</div>
        <div style="font-family:monospace;font-size:16px;font-weight:900;color:#0062e0;">DT7X42K</div>
      </div>
    </div>
    <div style="padding:18px 0;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:28px;font-weight:900;color:#0f172a;font-family:monospace;line-height:1;">BKK</div>
        <div style="font-size:11px;font-weight:700;color:#64748b;margin-top:2px;">Bangkok, TH</div>
      </div>
      <div style="flex:1;padding:0 12px;text-align:center;">
        <div style="font-size:10px;font-weight:800;color:#0062e0;text-transform:uppercase;margin-bottom:4px;">Direct • ₹299</div>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="width:100%;border-top:2px dashed #93c5fd;"></div>
          <div style="position:absolute;background:#ffffff;padding:0 4px;font-size:12px;">✈</div>
        </div>
        <div style="font-size:9px;font-weight:800;color:#16a34a;margin-top:4px;">Confirmed • Class Y</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:900;color:#0062e0;font-family:monospace;line-height:1;">SIN</div>
        <div style="font-size:11px;font-weight:700;color:#64748b;margin-top:2px;">Singapore, SG</div>
      </div>
    </div>
    <div style="background:#f8fafc;border-radius:14px;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;border:1px solid #f1f5f9;margin-bottom:14px;">
      <div><div style="font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Passenger</div><div style="font-size:10px;font-weight:900;color:#0f172a;">J. DOE</div></div>
      <div><div style="font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Flight</div><div style="font-size:10px;font-weight:900;color:#0f172a;">SQ-711</div></div>
      <div><div style="font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Date</div><div style="font-size:10px;font-weight:900;color:#0f172a;">24 NOV</div></div>
      <div><div style="font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Status</div><div style="font-size:10px;font-weight:900;color:#16a34a;">VERIFIED</div></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px dashed #cbd5e1;">
      <div style="display:flex;align-items:center;gap:3px;height:24px;">
        <div style="width:2px;height:100%;background:#0f172a;"></div><div style="width:4px;height:100%;background:#0f172a;"></div><div style="width:1px;height:100%;background:#0f172a;"></div><div style="width:3px;height:100%;background:#0f172a;"></div><div style="width:2px;height:100%;background:#0f172a;"></div><div style="width:4px;height:100%;background:#0f172a;"></div><div style="width:2px;height:100%;background:#0f172a;"></div>
      </div>
      <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:900;background:#dbeafe;color:#1d4ed8;">FREE PDF</span>
    </div>
  </div>
</div>
`;

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

  let beforeForm = formStart !== -1 ? html.slice(0, formStart) : '';
  
  // Replace the video phone mockup in hero with our verified ticket card
  beforeForm = beforeForm.replace(
    /<div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">[\s\S]*?Watch:\s*30-second generation walkthrough\s*<\/p>\s*<\/div>/gi,
    TICKET_CARD_HTML
  );

  beforeForm = sanitizeScrapedContent(beforeForm);
  let afterForm = formEnd !== -1 ? html.slice(formEnd) : html;

  // Make the hardcoded desktop two-column sidebar grid responsive for mobile
  afterForm = sanitizeScrapedContent(
    afterForm.replace(
      /grid-template-columns:\s*1fr\s+320px;/g,
      'grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr));'
    )
  );

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {beforeForm && <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full" dangerouslySetInnerHTML={{ __html: beforeForm }} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyJetGenerator />
      </div>
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full" dangerouslySetInnerHTML={{ __html: afterForm }} />
    </div>
  );
}
