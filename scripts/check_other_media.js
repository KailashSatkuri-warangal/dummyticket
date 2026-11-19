const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'content', 'pages');
for (const f of fs.readdirSync(dir)) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const t1 = content.includes('ticket1.webp');
  const s1 = content.includes('sampleticket');
  const y1 = content.includes('CuzqwMm50r0');
  if (t1 || s1 || y1) {
    console.log(`${f}: ticket1=${t1}, sampleticket=${s1}, youtube=${y1}`);
  }
}
