const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

const startIdx = content.indexOf('<div id="bookingForm"');
console.log('startIdx:', startIdx);
// Find the closing div for the bookingForm wrapper or mj-form-huelle
const huelleIdx = content.indexOf('class="card mj-form-huelle"');
console.log('huelleIdx:', huelleIdx);

// Find where the next section starts, e.g. <section or next major div
const nextSection = content.indexOf('<div class="dt-section"', huelleIdx);
console.log('nextSection:', nextSection);

// Show 200 chars around huelleIdx
console.log('around huelleIdx:\n', content.slice(huelleIdx, huelleIdx + 300));
// Show 200 chars before nextSection
if (nextSection !== -1) {
  console.log('before nextSection:\n', content.slice(nextSection - 150, nextSection + 150));
}
