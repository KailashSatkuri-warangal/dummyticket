const fs = require('fs');

let html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

// 1. Replace Hero Art with crisp 3D DummyTicket Boarding Pass
const heroArtOld = `<div class="dt-hero-art">
                <div class="dt-img-glow"></div>
                <img src="storage/blog/ticket1.webp"
                     alt="Free dummy ticket flight reservation PDF example — DummyTicket boarding pass with QR code"
                     width="1057" height="992"
                     class="dt-hero-img"
                     loading="eager" fetchpriority="high" decoding="async">
            </div>`;

const heroArtNew = `<div class="dt-hero-art">
                <div class="dt-img-glow"></div>
                <div class="dt-ticket-card-3d" style="width:100%;max-width:540px;background:#ffffff;border-radius:28px;padding:26px;border:1px solid rgba(219,234,254,0.9);box-shadow:0 25px 60px -15px rgba(0,98,224,0.22),0 10px 25px -5px rgba(15,23,42,0.08);position:relative;overflow:hidden;color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;">
                  <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#0062e0,#1d4ed8);display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:900;font-size:16px;box-shadow:0 4px 12px rgba(0,98,224,0.3);">DT</div>
                      <div>
                        <div style="font-weight:900;font-size:15px;color:#0f172a;letter-spacing:-0.3px;">DUMMYTICKET AIRWAYS</div>
                        <div style="font-size:10px;font-weight:800;color:#0062e0;text-transform:uppercase;letter-spacing:0.5px;">Verified Flight Itinerary</div>
                      </div>
                    </div>
                    <div style="text-align:right;">
                      <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;">PNR Booking Ref</div>
                      <div style="font-family:monospace;font-size:17px;font-weight:900;color:#0062e0;letter-spacing:1px;">DT9LAX</div>
                    </div>
                  </div>

                  <div style="padding:22px 0;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                      <div style="font-size:32px;font-weight:900;color:#0f172a;font-family:monospace;line-height:1;">HYD</div>
                      <div style="font-size:12px;font-weight:700;color:#64748b;margin-top:4px;">Hyderabad, IN</div>
                      <div style="font-size:10px;color:#94a3b8;">Rajiv Gandhi Intl</div>
                    </div>
                    <div style="flex:1;padding:0 16px;text-align:center;">
                      <div style="font-size:11px;font-weight:800;color:#0062e0;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Direct • ₹299</div>
                      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
                        <div style="width:100%;border-top:2px dashed #93c5fd;"></div>
                        <div style="position:absolute;background:#ffffff;padding:0 6px;">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0062e0" stroke="#0062e0" stroke-width="1.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                        </div>
                      </div>
                      <div style="font-size:10px;font-weight:800;color:#16a34a;margin-top:6px;">Confirmed • Class Y</div>
                    </div>
                    <div style="text-align:right;">
                      <div style="font-size:32px;font-weight:900;color:#0062e0;font-family:monospace;line-height:1;">LAX</div>
                      <div style="font-size:12px;font-weight:700;color:#64748b;margin-top:4px;">Los Angeles, US</div>
                      <div style="font-size:10px;color:#94a3b8;">Tom Bradley Terminal</div>
                    </div>
                  </div>

                  <div style="background:#f8fafc;border-radius:18px;padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;border:1px solid #f1f5f9;margin-bottom:16px;">
                    <div>
                      <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#94a3b8;">Passenger</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;margin-top:2px;">AMIT VERMA</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#94a3b8;">Flight</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;margin-top:2px;">DT-742</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#94a3b8;">Departure</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;margin-top:2px;">21 NOV</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#94a3b8;">QR Code</div>
                      <div style="font-size:11px;font-weight:900;color:#16a34a;margin-top:2px;">VERIFIED</div>
                    </div>
                  </div>

                  <div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px dashed #cbd5e1;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:40px;height:40px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:4px;display:flex;align-items:center;justify-content:center;">
                        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#0062e0" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      </div>
                      <div>
                        <div style="font-size:11px;font-weight:900;color:#0f172a;">Official Embassy Format</div>
                        <div style="font-size:10px;color:#64748b;">Accepted by 195+ Countries Worldwide</div>
                      </div>
                    </div>
                    <div>
                      <span style="display:inline-flex;padding:4px 12px;border-radius:20px;background:#eff6ff;color:#0062e0;font-size:11px;font-weight:900;border:1px solid #bfdbfe;">
                        FREE PDF
                      </span>
                    </div>
                  </div>
                </div>
            </div>`;

if (html.includes(heroArtOld)) {
  html = html.replace(heroArtOld, heroArtNew);
  console.log('Replaced heroArt');
} else {
  console.log('heroArtOld not exact match, using regex');
  html = html.replace(/<div class="dt-hero-art">[\s\S]*?<\/div>\s*<\/div>/, heroArtNew + '\n        </div>');
}

// 2. Replace Sample Ticket image with crisp rendered DummyTicket Boarding Pass
const sampleImgRegex = /<figure class="oc-ticket-figure">[\s\S]*?<\/figure>/;
const sampleImgNew = `<figure class="oc-ticket-figure" style="padding:10px;">
                <div style="width:100%;max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:24px;border:1px solid #dbeafe;box-shadow:0 20px 50px -10px rgba(0,98,224,0.18);color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;">
                  <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div style="width:34px;height:34px;border-radius:10px;background:#0062e0;color:#ffffff;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:14px;">DT</div>
                      <div>
                        <div style="font-weight:900;font-size:14px;color:#0f172a;">DUMMYTICKET PASSENGER ITINERARY</div>
                        <div style="font-size:10px;font-weight:700;color:#0062e0;">IATA Embassies Standard Layout</div>
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
                      <div style="font-size:28px;font-weight:900;font-family:monospace;color:#0062e0;">LHR</div>
                      <div style="font-size:11px;font-weight:700;color:#64748b;">London Heathrow, UK</div>
                    </div>
                  </div>

                  <div style="background:#f8fafc;border-radius:14px;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;border:1px solid #f1f5f9;margin-bottom:14px;">
                    <div>
                      <div style="font-size:9px;font-weight:700;color:#94a3b8;">PASSENGER</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;">JOHN DOE</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;color:#94a3b8;">FLIGHT</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;">BA-256</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;color:#94a3b8;">CABIN</div>
                      <div style="font-size:11px;font-weight:900;color:#0f172a;">ECONOMY</div>
                    </div>
                    <div>
                      <div style="font-size:9px;font-weight:700;color:#94a3b8;">PRICE</div>
                      <div style="font-size:11px;font-weight:900;color:#0062e0;">₹299 / ₹0</div>
                    </div>
                  </div>

                  <div style="padding-top:12px;border-top:1px dashed #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
                    <div style="font-size:11px;color:#64748b;font-weight:600;">✓ Includes Valid 2D QR Code & Barcode</div>
                    <div style="font-size:11px;font-weight:800;color:#16a34a;">100% Embassy Compliant</div>
                  </div>
                </div>
            </figure>`;

if (sampleImgRegex.test(html)) {
  html = html.replace(sampleImgRegex, sampleImgNew);
  console.log('Replaced sampleticket figure');
}

// 3. Replace video mock device with a sleek interactive 4-step DummyTicket Generation Flow
const videoMockRegex = /<div class="marvel-device iphone-x"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const videoMockNew = `<div style="max-width:680px;margin:2rem auto;background:#ffffff;border-radius:24px;border:1px solid #dbeafe;padding:24px;box-shadow:0 20px 50px -10px rgba(0,98,224,0.15);">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
    <div style="width:36px;height:36px;border-radius:10px;background:#0062e0;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:900;">30s</div>
    <div>
      <div style="font-size:16px;font-weight:900;color:#0f172a;">How DummyTicket PDF Generation Works</div>
      <div style="font-size:12px;color:#64748b;">Instant embassy-compliant flight reservation in 4 simple steps</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;text-align:center;">
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">01</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Select Route</div>
      <div style="font-size:10px;color:#64748b;margin-top:2px;">Enter origin & destination airports</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">02</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Add Travelers</div>
      <div style="font-size:10px;color:#64748b;margin-top:2px;">Enter passenger passport names</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
      <div style="font-size:18px;font-weight:900;color:#0062e0;">03</div>
      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">Choose Plan</div>
      <div style="font-size:10px;color:#64748b;margin-top:2px;">₹0 Free PDF or ₹399 Clean Ticket</div>
    </div>
    <div style="padding:14px;border-radius:16px;background:#ecfdf5;border:1px solid #a7f3d0;">
      <div style="font-size:18px;font-weight:900;color:#16a34a;">04</div>
      <div style="font-size:12px;font-weight:800;color:#065f46;margin-top:4px;">Instant PDF</div>
      <div style="font-size:10px;color:#047857;margin-top:2px;">Ready with PNR + QR code</div>
    </div>
  </div>
</div>`;

if (videoMockRegex.test(html)) {
  html = html.replace(videoMockRegex, videoMockNew);
  console.log('Replaced video mock device');
}

fs.writeFileSync('content/pages/dummy-ticket.html', html, 'utf8');
console.log('Saved content/pages/dummy-ticket.html');
