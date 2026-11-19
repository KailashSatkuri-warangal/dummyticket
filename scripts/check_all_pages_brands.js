const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'content', 'pages');
for (const file of fs.readdirSync(dir)) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const matches = [...content.matchAll(/(myjet24|myjet|MyJet24|\$7\.90|\$14|\$29)/gi)];
  if (matches.length > 0) {
    console.log(`${file}: ${matches.length} matches`);
  }
}
console.log('Checked all content pages.');
