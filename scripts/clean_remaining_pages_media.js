const fs = require('fs');

const pagesToClean = [
  'dummy-ticket-schengen-visa.html',
  'flight-itinerary-for-visa.html',
  'onward-ticket.html'
];

const sampleImgRegex = /<figure class="oc-ticket-figure">[\s\S]*?<\/figure>/;
const sampleImgNew = `<figure class="oc-ticket-figure" style="padding:10px;">
  <div style="width:100%;max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:24px;border:1px solid #dbeafe;box-shadow:0 20px 50px -10px rgba(0,98,224,0.18);color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:34px;height:34px;border-radius:10px;background:#0062e0;color:#ffffff;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:14px;">DT</div>
        <div>
          <div style="font-weight:900;font-size:14px;color:#0f172a;">DUMMYTICKET PASSENGER ITINERARY</div>
          <div style="font-size:10px;font-weight:700;color:#0062e0;">Official Embassy Verified Document</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;font-weight:700;color:#64748b;">PNR RECORD</div>
        <div style="font-family:monospace;font-size:15px;font-weight:900;color:#0062e0;">DT7X42K</div>
      </div>
    </div>
    <div style="padding:18px 0;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:28px;font-weight:900;font-family:monospace;color:#0f172a;">DEL</div>
        <div style="font-size:11px;font-weight:700;color:#64748b;">New Delhi, IN</div>
      </div>
      <div style="flex:1;padding:0 12px;text-align:center;">
        <div style="font-size:10px;font-weight:800;color:#0062e0;text-transform:uppercase;">Non-Stop • 9h 10m</div>
        <div style="border-top:2px dashed #93c5fd;margin:4px 0;"></div>
        <div style="font-size:10px;font-weight:700;color:#16a34a;">Status: Confirmed / Issued</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:900;font-family:monospace;color:#0062e0;">CDG</div>
        <div style="font-size:11px;font-weight:700;color:#64748b;">Paris Charles de Gaulle</div>
      </div>
    </div>
    <div style="padding-top:12px;border-top:1px dashed #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:11px;color:#64748b;font-weight:600;">✓ Includes Valid 2D QR Code & Barcode</div>
      <div style="font-size:11px;font-weight:800;color:#16a34a;">Schengen & Embassy Compliant</div>
    </div>
  </div>
</figure>`;

const videoMockRegex = /<div class="marvel-device iphone-x"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const videoMockNew = `<div style="max-width:680px;margin:2rem auto;background:#ffffff;border-radius:24px;border:1px solid #dbeafe;padding:24px;box-shadow:0 20px 50px -10px rgba(0,98,224,0.15);">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
    <div style="width:36px;height:36px;border-radius:10px;background:#0062e0;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:900;">30s</div>
    <div>
      <div style="font-size:16px;font-weight:900;color:#0f172a;">How DummyTicket Generation Works</div>
      <div style="font-size:12px;color:#64748b;">Instant embassy-compliant flight reservation in 4 simple steps</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;text-align:center;">
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">01</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Select Route</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">02</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Passenger Info</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">03</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Plan: ₹0 or ₹399</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#ecfdf5;border:1px solid #a7f3d0;">
      <div style="font-size:18px;font-weight:900;color:#16a34a;">04</div>
      <div style="font-size:12px;font-weight:800;color:#065f46;margin-top:4px;">Download PDF</div>
    </div>
  </div>
</div>`;

for (const p of pagesToClean) {
  let content = fs.readFileSync('content/pages/' + p, 'utf8');
  if (sampleImgRegex.test(content)) {
    content = content.replace(sampleImgRegex, sampleImgNew);
    console.log('Replaced sampleticket in ' + p);
  }
  if (videoMockRegex.test(content)) {
    content = content.replace(videoMockRegex, videoMockNew);
    console.log('Replaced videoMock in ' + p);
  }
  fs.writeFileSync('content/pages/' + p, content, 'utf8');
}
