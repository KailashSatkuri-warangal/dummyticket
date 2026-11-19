const fs = require('fs');
const html = fs.readFileSync('content/pages/dummy-ticket.html', 'utf8');

const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let match;
while ((match = imgRegex.exec(html)) !== null) {
  console.log(`img: ${match[1]} | full: ${match[0].slice(0, 150)}`);
}

const videoRegex = /<(video|iframe)[^>]+src=["']([^"']+)["'][^>]*>/gi;
while ((match = videoRegex.exec(html)) !== null) {
  console.log(`media: ${match[2]}`);
}
