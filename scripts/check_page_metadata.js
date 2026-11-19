const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const pagePath = path.join(appDir, entry.name, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      const code = fs.readFileSync(pagePath, 'utf8');
      if (code.includes('MyJet24') || code.includes('myjet24') || code.includes('$7.90') || code.includes('$')) {
        console.log(`Page ${entry.name}: has old metadata`);
      }
    }
  }
}
