import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { sanitizeScrapedContent } from '@/lib/content/sanitizeScrapedContent';

export const metadata: Metadata = {
  title: "Day-by-Day Travel Itinerary for Visa – Generator | DummyTicket",
  description: "Build a day-by-day travel itinerary for your visa application. Hotels, activities & budget breakdown included. Embassy-ready PDF for Schengen, US, UK & more.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'travel-itinerary.html');
  const fullHtml = fs.readFileSync(filePath, 'utf8');

  // Strip all broken scraped hero forms and retain guide content
  const startIdx = fullHtml.indexOf('<!-- EXAMPLE ITINERARY CARDS');
  let rawGuideContent = startIdx !== -1 ? fullHtml.slice(startIdx) : '';

  // Fix 100vw bleed and strip video guides
  const guideContent = sanitizeScrapedContent(
    rawGuideContent.replace(/flex:\s*0\s+0\s+330px;/g, 'flex:0 0 min(82vw, 320px);max-width:85vw;')
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-16 overflow-x-hidden w-full max-w-full">
      {/* Live Interactive Travel Itinerary Generator */}
      <DocumentGeneratorInteractive
        type="travel-itinerary"
        title="Day-by-Day Travel Itinerary Generator"
        subtitle="Custom itinerary schedule with daily sightseeing, hotel accommodations, and flight schedule."
      />

      {/* Guide Content & Country Itinerary Examples */}
      {guideContent && (
        <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
          <div dangerouslySetInnerHTML={{ __html: guideContent }} />
        </div>
      )}
    </div>
  );
}
