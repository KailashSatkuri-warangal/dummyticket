const fs = require('fs');
const path = require('path');

function searchDir(dir, matches = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        searchDir(fullPath, matches);
      }
    } else if (/\.(tsx|ts|jsx|js|html|json|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const count = (content.match(/myjet24/gi) || []).length;
      if (count > 0) {
        matches.push({ file: fullPath, count });
      }
    }
  }
  return matches;
}

const results = searchDir(process.cwd());
console.log(`Found ${results.length} files with 'myjet24':`);
for (const r of results) {
  console.log(`- ${path.relative(process.cwd(), r.file)}: ${r.count} occurrences`);
}
