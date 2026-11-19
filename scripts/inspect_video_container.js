const fs = require('fs');
const html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');
const vidIdx = html.indexOf('CuzqwMm50r0');
console.log(html.slice(vidIdx - 600, vidIdx + 500));
