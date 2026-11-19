import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Embassy Cover Letter Generator 2026 | DummyTicket",
  description: "Write a persuasive embassy cover letter for your visa application. Travel purpose, financial stability & return ties. Instant PDF download.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'embassy-letter.html');
  const fullHtml = fs.readFileSync(filePath, 'utf8');

  // Strip all broken scraped hero forms and retain guide content
  const startIdx = fullHtml.indexOf('<!-- EXAMPLE CARDS');
  let guideContent = startIdx !== -1 ? fullHtml.slice(startIdx) : '';

  // Fix 100vw bleed and strip video guides
  guideContent = sanitizeScrapedContent(
    guideContent
      .replace(/flex:\s*0\s+0\s+330px;/g, 'flex:0 0 min(82vw, 320px);max-width:85vw;')
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Embassy Cover Letter Generator */}
      <DocumentGeneratorInteractive
        type="embassy-letter"
        title="Embassy Cover Letter Generator"
        subtitle="Professional applicant statement to the Visa Officer with travel purpose, ties to home country, and document checklist."
      />

      {/* Guide Content, Formats & Embassy Submission Tips */}
      {guideContent && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: guideContent }} />
        </div>
      )}
    </div>
  );
}
