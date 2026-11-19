import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About DummyTicket – Free Dummy Ticket Service Since 2021",
  description: "About DummyTicket: free dummy tickets for visa applications since 2021, trusted by 10,000+ travelers in 195 countries. Free PDF or real PNR with Premium.",
};

export default function Page() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'about.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Make hardcoded desktop grids responsive on mobile screens
  html = html
    .replace(/grid-template-columns:\s*1fr\s+1fr;/g, 'grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr));')
    .replace(/grid-template-columns:\s*repeat\(4,\s*1fr\);/g, 'grid-template-columns:repeat(auto-fit, minmax(min(100%, 180px), 1fr));')
    .replace(/grid-template-columns:\s*repeat\(3,\s*1fr\);/g, 'grid-template-columns:repeat(auto-fit, minmax(min(100%, 240px), 1fr));')
    .replace(/grid-template-columns:\s*repeat\(2,\s*1fr\);/g, 'grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr));')
    .replace(/gap:\s*4rem;/g, 'gap:1.5rem;');

  return (
    <div className="myjet-page-wrapper overflow-x-hidden w-full max-w-full">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
