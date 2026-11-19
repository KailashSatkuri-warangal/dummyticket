import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { EmbassyFinderInteractive } from '@/components/tools/EmbassyFinderInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Find Embassies & Consulates Worldwide 2026 | DummyTicket",
  description: "Find embassies, consulates, and high commissions in 195+ countries. 8,744 diplomatic missions with contact information, addresses, and opening hours.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'embassy-finder.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip broken empty search hero form so live interactive component replaces it cleanly
  const heroStart = html.indexOf('<section class="hero">');
  const heroEnd = html.indexOf('</section>', heroStart);
  if (heroStart !== -1 && heroEnd !== -1) {
    html = html.substring(0, heroStart) + html.substring(heroEnd + 10);
  }
  html = sanitizeScrapedContent(html);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Embassy Finder */}
      <EmbassyFinderInteractive />

      {/* Guide Content, FAQ & Diplomatic Articles */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
