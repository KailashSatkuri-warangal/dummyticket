import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards 2026 | DummyTicket",
  description: "How DummyTicket researches, sources, fact-checks & updates visa content. Editorial principles, named authors, AI use disclosure, 14-day correction commitment.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'editorial-policy.html');
  const html = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="myjet-page-wrapper">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
