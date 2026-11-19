const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');
const idx = content.indexOf('<div class="oc-ticket-sec" id="dt-sample">');
// find style tag before idx
const styleIdx = content.lastIndexOf('<style>', idx);
console.log('styleIdx:', styleIdx);
console.log(content.slice(styleIdx - 200, styleIdx));
