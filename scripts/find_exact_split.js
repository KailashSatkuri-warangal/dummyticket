const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');
const target = '<div class="oc-ticket-sec" id="dt-sample">';
const idx = content.indexOf(target);
console.log('idx:', idx);
console.log(content.slice(idx - 300, idx));
