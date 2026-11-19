const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'content', 'pages');
for (const f of fs.readdirSync(dir)) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const hasForm = c.includes('mj-form-huelle') || c.includes('id="bookingForm"');
  if (hasForm) {
    console.log(`Page has form: ${f}`);
  }
}
