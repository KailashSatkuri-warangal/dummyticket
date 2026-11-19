const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');
const huelleIdx = content.indexOf('class="card mj-form-huelle"');

// Find headings after huelleIdx
const regex = /<h2[^>]*>(.*?)<\/h2>/g;
regex.lastIndex = huelleIdx + 100;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`h2 at ${match.index}: ${match[1]}`);
  if (regex.lastIndex > huelleIdx + 50000) break;
}
