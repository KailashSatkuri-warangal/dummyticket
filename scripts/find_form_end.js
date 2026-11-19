const fs = require('fs');
const content = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');
console.log(content.slice(49800, 50200));
