const fs = require('fs');
const files = ['hotel-booking.html', 'onward-ticket.html', 'temporary-flight-reservation.html'];

for (const file of files) {
  const content = fs.readFileSync('content/pages/' + file, 'utf8');
  const bIdx = content.indexOf('id="bookingForm"');
  console.log(`${file}: bookingForm at ${bIdx}`);
  if (bIdx !== -1) {
    console.log(content.slice(bIdx - 100, bIdx + 200));
  }
}
