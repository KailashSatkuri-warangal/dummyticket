import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Visa Support Letter Generator 2026 | DummyTicket",
  description: "Generate a professional visa support letter in minutes. Embassy-ready PDF with financial proof, travel purpose & return intent. For visa applications worldwide.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'visa-letter.html');
  const fullHtml = fs.readFileSync(filePath, 'utf8');

  // Strip all broken scraped hero forms and retain guide content
  const startIdx = fullHtml.indexOf('<!-- EXAMPLE DOCUMENTS SECTION');
  const rawGuideContent = startIdx !== -1 ? fullHtml.slice(startIdx) : '';
  const guideContent = sanitizeScrapedContent(rawGuideContent);

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Generator & Live PDF Preview */}
      <DocumentGeneratorInteractive
        type="visa-letter"
        title="Visa Support Letter Generator"
        subtitle="Embassy-ready visa support letter with financial guarantee, travel dates, and employment details."
      />

      {/* Guide Content, Sample Letters & Embassy Requirements */}
      {guideContent && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: guideContent }} />
        </div>
      )}
    </div>
  );
}
