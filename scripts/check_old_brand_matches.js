const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

const matches = [];
for (const match of content.matchAll(/(myjet24|myjet|MyJet24|\$7\.90|\$14|\$29)/gi)) {
  matches.push({ text: match[0], index: match.index });
}
console.log(`Found ${matches.length} old brand/price matches in dummy-ticket.html:`);
for (const m of matches.slice(0, 10)) {
  console.log(`- "${m.text}" around: ${content.slice(Math.max(0, m.index - 30), m.index + 30).trim()}`);
}
