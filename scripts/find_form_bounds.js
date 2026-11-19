const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

// The form card is:
const start = content.indexOf('<div class="card mj-form-huelle"');
// Let's find where this form card ends
const nextMarker = content.indexOf('<div class="oc-ticket-wrap"', start);
console.log('start:', start, 'nextMarker:', nextMarker);
console.log('content between start and nextMarker length:', nextMarker - start);
console.log('50 chars before nextMarker:\n', content.slice(nextMarker - 100, nextMarker));
console.log('50 chars at nextMarker:\n', content.slice(nextMarker, nextMarker + 100));
