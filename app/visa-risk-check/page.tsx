import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { VisaRiskCheckInteractive } from '@/components/tools/VisaRiskCheckInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Visa Risk Checker 2026 – Check Your Approval Odds | DummyTicket",
  description: "Free visa rejection risk checker. Get your personalized visa approval score based on your profile, travel history, and documents. 199 countries supported.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'visa-risk-check.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip broken empty static form
  const heroStart = html.indexOf('<div class="vrc-hero');
  const heroEnd = html.indexOf('</div><!-- /vrc-hero -->', heroStart);
  if (heroStart !== -1 && heroEnd !== -1) {
    html = html.substring(0, heroStart) + html.substring(heroEnd + 24);
  }
  html = sanitizeScrapedContent(html);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Visa Risk Assessment */}
      <VisaRiskCheckInteractive />

      {/* Guide Content, Statistics & Rejection Avoidance Tips */}
      <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
