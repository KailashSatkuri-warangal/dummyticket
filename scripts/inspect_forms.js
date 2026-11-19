const fs = require('fs');
const path = require('path');

const files = [
  'dummy-ticket.html',
  'hotel-booking.html',
  'onward-ticket.html',
  'temporary-flight-reservation.html'
];

for (const file of files) {
  const p = path.join('content', 'pages', file);
  const content = fs.readFileSync(p, 'utf8');
  const start = content.indexOf('<div class="card mj-form-huelle"');
  // find the end of this card. In HTML, mj-form-huelle closes before the next main section.
  console.log(`${file}: form starts at ${start}`);
}
