const fs = require('fs');
const path = require('path');

const PAGES = [
  { file: 'dummy-ticket.html', slug: 'dummy-ticket' },
  { file: 'dummy-ticket-schengen-visa.html', slug: 'dummy-ticket-schengen-visa' },
  { file: 'temporary-flight-reservation.html', slug: 'temporary-flight-reservation' },
  { file: 'proof-of-onward-travel.html', slug: 'proof-of-onward-travel' },
  { file: 'onward-ticket.html', slug: 'onward-ticket' },
  { file: 'hotel-booking.html', slug: 'hotel-booking' },
  { file: 'flight-itinerary-for-visa.html', slug: 'flight-itinerary-for-visa' },
  { file: 'visa-checker.html', slug: 'visa-checker' },
  { file: 'embassy-finder.html', slug: 'embassy-finder' },
  { file: 'visa-cost-calculator.html', slug: 'visa-cost-calculator' },
  { file: 'visa-risk-check.html', slug: 'visa-risk-check' },
  { file: 'visa-letter.html', slug: 'visa-letter' },
  { file: 'invitation-letter.html', slug: 'invitation-letter' },
  { file: 'embassy-letter.html', slug: 'embassy-letter' },
  { file: 'travel-itinerary.html', slug: 'travel-itinerary' },
  { file: 'about.html', slug: 'about' },
  { file: 'editorial-policy.html', slug: 'editorial-policy' },
  { file: 'terms.html', slug: 'terms' }
];

const contentDir = path.join(process.cwd(), 'content', 'pages');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

PAGES.forEach(({ file, slug }) => {
  const srcPath = path.join('D:/dummyticket/myjet24.com', file);
  if (!fs.existsSync(srcPath)) {
    console.log('Skipping ' + file + ' (not found)');
    return;
  }
  const content = fs.readFileSync(srcPath, 'utf8');

  // Metadata
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'MyJet24';
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const desc = descMatch ? descMatch[1].trim() : 'Free dummy ticket generator for visa applications';

  // Extract main content or body between nav and footer
  let mainHtml = '';
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    mainHtml = mainMatch[1];
  } else {
    // fallback: extract between </nav> and <footer
    const navEnd = content.indexOf('</nav>');
    const footStart = content.indexOf('<footer');
    if (navEnd !== -1 && footStart !== -1) {
      mainHtml = content.substring(navEnd + 6, footStart);
    } else {
      mainHtml = content;
    }
  }

  // Sanitize links
  let sanitized = mainHtml
    .replace(/href=["']index\.html#bookingForm["']/gi, 'href="/#bookingForm"')
    .replace(/href=["']index\.html["']/gi, 'href="/"')
    .replace(/href=["']booking\.html[^"']*["']/gi, 'href="/#bookingForm"')
    .replace(/href=["']booking@[^"']*["']/gi, 'href="/#bookingForm"')
    .replace(/href=["']dummy-ticket\.html["']/gi, 'href="/dummy-ticket"')
    .replace(/href=["']dummy-ticket-schengen-visa\.html["']/gi, 'href="/dummy-ticket-schengen-visa"')
    .replace(/href=["']temporary-flight-reservation\.html["']/gi, 'href="/temporary-flight-reservation"')
    .replace(/href=["']proof-of-onward-travel\.html["']/gi, 'href="/proof-of-onward-travel"')
    .replace(/href=["']onward-ticket\.html["']/gi, 'href="/onward-ticket"')
    .replace(/href=["']hotel-booking\.html["']/gi, 'href="/hotel-booking"')
    .replace(/href=["']flight-itinerary-for-visa\.html["']/gi, 'href="/flight-itinerary-for-visa"')
    .replace(/href=["']visa-checker\.html["']/gi, 'href="/visa-checker"')
    .replace(/href=["']embassy-finder\.html["']/gi, 'href="/embassy-finder"')
    .replace(/href=["']visa-cost-calculator\.html["']/gi, 'href="/visa-cost-calculator"')
    .replace(/href=["']visa-risk-check\.html["']/gi, 'href="/visa-risk-check"')
    .replace(/href=["']visa-letter\.html["']/gi, 'href="/visa-letter"')
    .replace(/href=["']invitation-letter\.html["']/gi, 'href="/invitation-letter"')
    .replace(/href=["']embassy-letter\.html["']/gi, 'href="/embassy-letter"')
    .replace(/href=["']travel-itinerary\.html["']/gi, 'href="/travel-itinerary"')
    .replace(/href=["']about\.html["']/gi, 'href="/about"')
    .replace(/href=["']terms\.html["']/gi, 'href="/terms"')
    .replace(/href=["']privacy-policy\.html["']/gi, 'href="/privacy-policy"')
    .replace(/href=["']editorial-policy\.html["']/gi, 'href="/editorial-policy"')
    .replace(/href=["']blog\.html["']/gi, 'href="/blog"')
    .replace(/href=["']onward-ticket-[a-zA-Z0-9-]+\.html["']/gi, 'href="/proof-of-onward-travel"');

  // Save html
  const htmlOutPath = path.join(contentDir, slug + '.html');
  fs.writeFileSync(htmlOutPath, sanitized, 'utf8');

  // Create app directory and page.tsx
  const pageDir = path.join(process.cwd(), 'app', slug);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const pageTsx = `import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(desc)},
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', '${slug}.html');
  const html = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="myjet-page-wrapper">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
`;

  fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageTsx, 'utf8');
  console.log('Created app/' + slug + '/page.tsx (' + sanitized.length + ' bytes)');
});

console.log('All pages generated successfully.');
