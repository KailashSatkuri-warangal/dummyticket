const fs = require('fs');

const files = [
  'dummy-ticket.html',
  'hotel-booking.html',
  'onward-ticket.html',
  'temporary-flight-reservation.html'
];

for (const file of files) {
  const html = fs.readFileSync('content/pages/' + file, 'utf8');
  let formStart = -1;
  let formEnd = -1;

  if (file === 'dummy-ticket.html') {
    formStart = html.indexOf('<div class="card mj-form-huelle"');
    formEnd = html.indexOf('<div class="oc-ticket-sec" id="dt-sample">');
  } else if (file === 'hotel-booking.html') {
    formStart = html.indexOf('<div class="card mj-form-huelle"');
    if (formStart === -1) formStart = html.indexOf('<div id="bookingForm"');
    formEnd = html.indexOf('</form>', formStart);
    if (formEnd !== -1) {
      formEnd = html.indexOf('</div>', formEnd + 20);
      formEnd = html.indexOf('</div>', formEnd + 1);
    }
  } else if (file === 'onward-ticket.html') {
    formStart = html.indexOf('<div class="card mj-form-huelle"');
    if (formStart === -1) formStart = html.indexOf('<div id="bookingForm"');
    formEnd = html.indexOf('</form>', formStart);
    if (formEnd !== -1) {
      formEnd = html.indexOf('</div>', formEnd + 20);
      formEnd = html.indexOf('</div>', formEnd + 1);
    }
  } else if (file === 'temporary-flight-reservation.html') {
    formStart = html.indexOf('<div class="tv-bookwrap"');
    formEnd = html.indexOf('</form>', formStart);
    if (formEnd !== -1) {
      formEnd = html.indexOf('</div>', formEnd + 20);
      formEnd = html.indexOf('</div>', formEnd + 1);
    }
  }

  console.log(`${file}: formStart=${formStart}, formEnd=${formEnd}`);
}
