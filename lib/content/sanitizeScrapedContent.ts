/**
 * Utilities to sanitize and eliminate viewport bleed (e.g. 100vw calculations, oversized marquees)
 * and strip legacy video guide bands / phone mockups and broken assets from scraped content blocks.
 */
export function sanitizeScrapedContent(rawHtml: string): string {
  if (!rawHtml) return '';
  return rawHtml
    // 1. Remove video styles and device CSS
    .replace(/<style>[^<]*(?:\.oc-video-band|\.marvel-device|\.device-macbook|\.oc-mac-stage|\.yt-facade)[\s\S]*?<\/style>/gi, '')
    // 2. Remove entire oc-video-band container up to the next structural container
    .replace(/<div[^>]*class="[^"]*oc-video-band[^"]*"[\s\S]*?(?=<div style="max-width:|<div class="cta-banner"|<section|<div class="guide|<div class="mj-tb|<style|<article|<!--|$)/gi, '')
    // 3. Remove any standalone phone/macbook/yt-facade buttons and containers
    .replace(/<button[^>]*class="[^"]*yt-facade-btn[^"]*"[\s\S]*?<\/button>/gi, '')
    .replace(/<span[^>]*class="[^"]*yt-facade-pill[^"]*"[\s\S]*?<\/span>/gi, '')
    .replace(/<div[^>]*class="[^"]*(?:yt-facade|oc-phone-scale|marvel-device|oc-mac-stage|device-macbook)[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*(?:yt-facade|oc-phone-scale|marvel-device|oc-mac-stage|device-macbook)[^"]*"[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*data-yt-id="[^"]*"[\s\S]*?<\/div>/gi, '')
    .replace(/<script[^>]*src="[^"]*yt-facade[^"]*"[^>]*><\/script>/gi, '')
    // 4. Strip 100vw viewport-bleed and oversized tickers
    .replace(/width:\s*100vw;\s*margin-inline:\s*calc\(50%\s*-\s*50vw\);?/gi, 'width:100%;max-width:100%;margin-inline:0;')
    .replace(/width:\s*140%;\s*left:\s*-8%;?/gi, 'width:100%;left:0;')
    .replace(/\.oc-tw-marquee\s*\{[^}]*\}/gi, '.oc-tw-marquee { display: none !important; }')
    .replace(/<div class="dt-streak[^"]*"><\/div>/gi, '')
    // 5. Ensure clean, root-relative image and asset paths without legacy query/version suffixes
    .replace(/\.(svg|png|jpg|jpeg|webp)@v=\d+/gi, '.$1')
    .replace(/src="images\//gi, 'src="/images/')
    .replace(/src="storage\//gi, 'src="/storage/')
    .replace(/srcset="images\//gi, 'srcset="/images/')
    .replace(/srcset="storage\//gi, 'srcset="/storage/')
    .replace(/href="images\//gi, 'href="/images/')
    .replace(/href="storage\//gi, 'href="/storage/')
    // 6. Graceful image loading: if any image fails, hide it smoothly rather than showing broken icon
    .replace(/<img\s+(?![^>]*onerror)/gi, '<img onerror="this.onerror=null;this.style.display=\'none\';" ')
    // 7. Remove remaining myjet24 branding artifacts
    .replace(/myjet24\.com/gi, 'dummyticket.com')
    .replace(/myjet24/gi, 'DummyTicket')
    .replace(/MyJet24/gi, 'DummyTicket')
    .replace(/myjet/gi, 'dummyticket');
}
