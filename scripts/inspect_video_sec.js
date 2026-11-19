const fs = require('fs');
const html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

const vidIdx = html.indexOf('CuzqwMm50r0');
// find start of the video section
const secStart = html.lastIndexOf('<section', vidIdx);
const secEnd = html.indexOf('</section>', vidIdx);
console.log('secStart:', secStart, 'secEnd:', secEnd);
console.log(html.slice(secStart, secEnd + 10));
