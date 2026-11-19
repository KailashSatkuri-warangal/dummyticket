const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
function walk(dir, list = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(p, list);
    } else if (item.name === 'page.tsx') {
      const code = fs.readFileSync(p, 'utf8');
      if (code.includes("'content'") && code.includes("'pages'")) {
        list.push({ file: p, code });
      }
    }
  }
  return list;
}

const pages = walk(appDir);
console.log(`Found ${pages.length} pages:`);
for (const p of pages) {
  console.log(`- ${path.relative(process.cwd(), p.file)}`);
}
