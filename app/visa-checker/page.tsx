import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { VisaCheckerInteractive } from '@/components/tools/VisaCheckerInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Visa Checker 2026 – Do You Need a Visa? | DummyTicket",
  description: "Check visa requirements for 199 countries in 2026. See if you need a visa, e-visa or can travel visa-free. Plus free dummy ticket for visa apps.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'visa-checker.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip broken empty scraped hero form so the live interactive component powers it
  const heroStart = html.indexOf('<section class="vc-hero2">');
  const heroEnd = html.indexOf('</section>', heroStart);
  if (heroStart !== -1 && heroEnd !== -1) {
    html = html.substring(0, heroStart) + html.substring(heroEnd + 10);
  }
  html = sanitizeScrapedContent(html);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Visa Checker */}
      <VisaCheckerInteractive />

      {/* Guide Content, FAQ & Detailed Country Database */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
