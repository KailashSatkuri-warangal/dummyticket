import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Invitation Letter for Visa 2026 | DummyTicket",
  description: "Create a professional invitation letter for any visa: host details, accommodation proof and sponsorship declaration. For visa applications in 190+ countries.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'invitation-letter.html');
  const fullHtml = fs.readFileSync(filePath, 'utf8');

  // Strip all broken scraped hero forms and retain guide content
  const startIdx = fullHtml.indexOf('<!-- TOOL SWITCHER');
  const rawGuideContent = startIdx !== -1 ? fullHtml.slice(startIdx) : '';
  const guideContent = sanitizeScrapedContent(rawGuideContent);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Invitation Letter Generator */}
      <DocumentGeneratorInteractive
        type="invitation-letter"
        title="Official Invitation Letter for Visa"
        subtitle="Host declaration, accommodation guarantee, and travel sponsorship for embassy submission."
      />

      {/* Guide Content & Sample Letters */}
      {guideContent && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: guideContent }} />
        </div>
      )}
    </div>
  );
}
