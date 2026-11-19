import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service — DummyTicket",
  description: "Terms of Service for DummyTicket.com. What our documents are, how you may use them, and what we are not liable for.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'terms.html');
  const html = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="myjet-page-wrapper">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
