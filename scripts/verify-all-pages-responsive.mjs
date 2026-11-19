import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';

function checkServerReady(port = 3000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServerRunning() {
  const isRunning = await checkServerReady(3000);
  if (isRunning) {
    console.log('✅ Found active server on port 3000.');
    return null;
  }

  console.log('⚡ Starting Next.js production server on port 3000...');
  const serverProcess = spawn('cmd.exe', ['/c', 'npx next start -p 3000'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const ready = await checkServerReady(3000);
    if (ready) {
      console.log('✅ Server ready on port 3000.\n');
      return serverProcess;
    }
  }
  throw new Error('Timed out waiting for server to start on port 3000');
}

const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/dummy-ticket', name: 'Dummy Ticket Generator' },
  { path: '/temporary-flight-reservation', name: 'Temporary Flight Reservation' },
  { path: '/hotel-booking', name: 'Hotel Booking Reservation' },
  { path: '/proof-of-onward-travel', name: 'Proof of Onward Travel' },
  { path: '/onward-ticket', name: 'Onward Ticket' },
  { path: '/dummy-ticket-schengen-visa', name: 'Schengen Visa Dummy Ticket' },
  { path: '/flight-itinerary-for-visa', name: 'Flight Itinerary for Visa' },
  { path: '/travel-itinerary', name: 'Travel Itinerary Document' },
  { path: '/visa-letter', name: 'Cover Letter for Visa' },
  { path: '/invitation-letter', name: 'Invitation Letter' },
  { path: '/embassy-letter', name: 'No Objection & Embassy Letter' },
  { path: '/visa-checker', name: 'Visa Requirement Checker' },
  { path: '/embassy-finder', name: 'Embassy & Consulate Finder' },
  { path: '/visa-cost-calculator', name: 'Visa Cost Calculator' },
  { path: '/visa-risk-check', name: 'Visa Rejection Risk Checker' },
  { path: '/flights?from=DEL&to=LHR&depart=2026-12-01&adults=1&cabin=economy', name: 'Flight Search Results' },
  { path: '/checkout/offer-del-lhr-1?depart=2026-12-01&adults=1&cabin=economy', name: 'Checkout Page' },
  { path: '/track-booking', name: 'Track Booking' },
  { path: '/contact', name: 'Contact Us' },
  { path: '/about', name: 'About' },
  { path: '/faq', name: 'FAQ' },
  { path: '/admin', name: 'Admin Gate / Portal' },
];

const VIEWPORTS = [
  { name: 'Mobile (iPhone 14 / 390x844)', width: 390, height: 844, isMobile: true },
  { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false },
];

async function runVerification() {
  console.log('🚀 Starting dynamic mobile & desktop responsive verification on all pages...\n');

  let server;
  try {
    server = await ensureServerRunning();
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
    console.error('Chromium launch failed:', err.message);
    process.exit(1);
  }

  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const url = `http://localhost:3000${route.path}`;
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const status = response ? response.status() : 'NO_RESP';

        // Wait a tick for layout & fonts
        await page.waitForTimeout(400);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body ? document.body.scrollWidth : 0;
          const maxW = Math.max(docWidth, bodyWidth);
          return {
            hasOverflow: maxW > winWidth + 2, // Allow 2px subpixel rounding tolerance
            scrollWidth: maxW,
            innerWidth: winWidth,
            diff: maxW - winWidth,
          };
        });

        // Check if header exists and is visible
        const headerVisible = await page.evaluate(() => {
          const header = document.querySelector('header');
          return header ? header.offsetHeight > 0 : false;
        });

        const passed = status === 200 && !overflow.hasOverflow;

        results.push({
          viewport: vp.name,
          route: route.name,
          path: route.path,
          status,
          overflow,
          headerVisible,
          consoleErrorsCount: consoleErrors.length,
          passed,
        });

        const icon = passed ? '✅ PASS' : '❌ FAIL';
        const overflowMsg = overflow.hasOverflow ? `[OVERFLOW: +${overflow.diff}px]` : '[NO OVERFLOW]';
        console.log(`${icon} | ${status} | ${overflowMsg} | ${route.name.padEnd(32)} (${route.path})`);
      } catch (err) {
        console.log(`❌ ERROR | ${route.name} (${route.path}): ${err.message}`);
        results.push({
          viewport: vp.name,
          route: route.name,
          path: route.path,
          status: 'ERROR',
          error: err.message,
          passed: false,
        });
      } finally {
        await page.close();
      }
    }

    await context.close();
  }

  await browser.close();

  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed);

  console.log(`\n======================================================`);
  console.log(`🏁 VERIFICATION SUMMARY: ${passedCount} / ${total} checks passed (${Math.round((passedCount / total) * 100)}%)`);
  console.log(`======================================================`);

  if (failed.length > 0) {
    console.log('\nIssues found to address:');
    for (const f of failed) {
      console.log(`- [${f.viewport}] ${f.route} (${f.path}): ${f.overflow?.hasOverflow ? `Horizontal overflow by ${f.overflow.diff}px (scrollWidth ${f.overflow.scrollWidth} > innerWidth ${f.overflow.innerWidth})` : f.status}`);
    }
  } else {
    console.log('\n🎉 All pages dynamically verified with zero horizontal overflow and 200 OK on both Mobile & Desktop!');
  }
  if (server && server.pid) {
    console.log('\nCleaning up Next.js test server...');
    try {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' });
    } catch {}
  }
}

runVerification();
