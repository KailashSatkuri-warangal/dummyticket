const fs = require('fs');
const html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

function showContext(str) {
  const idx = html.indexOf(str);
  if (idx !== -1) {
    console.log('=== Context for ' + str + ' ===');
    console.log(html.slice(Math.max(0, idx - 250), idx + 350));
  }
}

showContext('ticket1.webp');
showContext('sampleticket.jpg');
showContext('CuzqwMm50r0');
