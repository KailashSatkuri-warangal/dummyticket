const fs = require('fs');
const path = require('path');

function searchAll(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'myjet24.com') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchAll(full, results);
    } else {
      try {
        const content = fs.readFileSync(full, 'utf8');
        if (/myjet24/i.test(content)) {
          results.push(path.relative(process.cwd(), full));
        }
      } catch (e) {
        // binary files etc
      }
    }
  }
  return results;
}

const res = searchAll(process.cwd());
console.log('Files with myjet24 (outside myjet24.com, node_modules, .next):');
res.forEach(f => console.log('- ' + f));
