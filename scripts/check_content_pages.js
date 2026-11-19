const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'content', 'pages');
const files = fs.readdirSync(dir);
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const count = (content.match(/myjet24/gi) || []).length;
  const myjetCount = (content.match(/myjet/gi) || []).length;
  console.log(`${f}: myjet24=${count}, myjet=${myjetCount}`);
}
