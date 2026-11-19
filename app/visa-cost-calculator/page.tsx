import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { VisaCostCalculatorInteractive } from '@/components/tools/VisaCostCalculatorInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Visa Cost Calculator 2026: Fees for 83+ Countries | DummyTicket",
  description: "How much does a visa cost? Compare visa fees, processing times & total costs for 83+ countries in 2026. Free, real embassy data. Updated 2026.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'visa-cost-calculator.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip broken empty static calculator hero
  const heroStart = html.indexOf('<div class="vcc-hero">');
  const heroEnd = html.indexOf('</div><!-- /vcc-hero -->', heroStart);
  if (heroStart !== -1 && heroEnd !== -1) {
    html = html.substring(0, heroStart) + html.substring(heroEnd + 24);
  }
  html = sanitizeScrapedContent(html);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Visa Cost Calculator */}
      <VisaCostCalculatorInteractive />

      {/* Guide Content & Tables */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
