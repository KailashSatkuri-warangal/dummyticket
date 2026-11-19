const fs = require('fs');
const path = require('path');

function searchApp(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchApp(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/myjet/i.test(line) && !line.includes('MyJetGenerator') && !line.includes('myjet.css') && !line.includes('myjet-page-wrapper')) {
          console.log(`${path.relative(process.cwd(), full)}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

searchApp(path.join(process.cwd(), 'app'));
