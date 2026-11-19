import { chromium } from '@playwright/test';

const ROUTES = [
  '/dummy-ticket',
  '/onward-ticket',
  '/travel-itinerary',
  '/embassy-letter',
  '/about',
];

async function debug() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });

  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const culprits = await page.evaluate(() => {
      const winW = window.innerWidth;
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowing = [];

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // If element extends beyond viewport width
        if (rect.right > winW + 2) {
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            id: el.id,
            className: (el.className || '').toString().slice(0, 100),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            diff: Math.round(rect.right - winW),
          });
        }
      }

      // Sort by largest overflow
      overflowing.sort((a, b) => b.diff - a.diff);
      return overflowing.slice(0, 6);
    });

    console.log(`\n🔍 Culprits for ${route} (viewport 390px):`);
    console.log(JSON.stringify(culprits, null, 2));
  }

  await browser.close();
}

debug();
