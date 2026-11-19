const fs = require('fs');
const html = fs.readFileSync('content/pages/temporary-flight-reservation.html', 'utf8');
const formStart = html.indexOf('<div class="tv-bookwrap"');
console.log('formStart:', formStart);
const nextSection = html.indexOf('<section', formStart);
console.log('nextSection:', nextSection);
if (nextSection !== -1) {
  console.log(html.slice(nextSection - 100, nextSection + 100));
}
