const fs = require('fs');

const html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

const regex = /myjet[a-z0-9\.\-]*/gi;
let match;
const matches = [];
while ((match = regex.exec(html)) !== null) {
  matches.push({
    text: match[0],
    index: match.index,
    context: html.slice(Math.max(0, match.index - 40), match.index + 50)
  });
}

console.log(`Found ${matches.length} matches in content/pages/dummy-ticket.html:`);
for (const m of matches) {
  console.log(`- "${m.text}" around: ${m.context.replace(/\s+/g, ' ')}`);
}
