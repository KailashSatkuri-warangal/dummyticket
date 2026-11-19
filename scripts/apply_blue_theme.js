const fs = require('fs');
const path = require('path');

function replaceColors(str) {
  return str
    .replace(/#7c3aed/gi, '#0062e0')
    .replace(/#6d28d9/gi, '#1d4ed8')
    .replace(/#8b5cf6/gi, '#2563eb')
    .replace(/#a78bfa/gi, '#60a5fa')
    .replace(/#c4b5fd/gi, '#93c5fd')
    .replace(/#ede9fe/gi, '#eff6ff')
    .replace(/#f8f5ff/gi, '#f0f7ff')
    .replace(/#f0ebff/gi, '#e0effe')
    .replace(/rgba\(124,\s*58,\s*237/gi, 'rgba(0, 98, 224')
    .replace(/rgba\(168,\s*85,\s*247/gi, 'rgba(37, 99, 235')
    .replace(/rgba\(139,\s*92,\s*246/gi, 'rgba(59, 130, 246')
    .replace(/MyJet24/gi, 'DummyTicket')
    .replace(/MYJET24/gi, 'DUMMYTICKET');
}

// 1. myjet.css
if (fs.existsSync('app/myjet.css')) {
  let css = fs.readFileSync('app/myjet.css', 'utf8');
  css = replaceColors(css);
  fs.writeFileSync('app/myjet.css', css, 'utf8');
  console.log('Updated app/myjet.css with blue and white theme');
}

// 2. content/pages/*.html
const contentDir = path.join(process.cwd(), 'content', 'pages');
if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir);
  files.forEach(f => {
    const fp = path.join(contentDir, f);
    let html = fs.readFileSync(fp, 'utf8');
    html = replaceColors(html);
    fs.writeFileSync(fp, html, 'utf8');
  });
  console.log('Updated ' + files.length + ' html files with DummyTicket branding and blue theme');
}

console.log('Blue and white theme successfully applied.');
