const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'pages');

if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir);
  files.forEach((f) => {
    const fp = path.join(contentDir, f);
    let html = fs.readFileSync(fp, 'utf8');

    html = html
      .replace(/₹699/g, '₹399')
      .replace(/₹499/g, '₹299')
      .replace(/&#8377;699/g, '&#8377;399')
      .replace(/&#8377;499/g, '&#8377;299');

    fs.writeFileSync(fp, html, 'utf8');
  });
  console.log('Updated prices to ₹299 - ₹399 range in ' + files.length + ' HTML content files');
}

if (fs.existsSync('app/myjet.css')) {
  let css = fs.readFileSync('app/myjet.css', 'utf8');
  css = css
    .replace(/₹699/g, '₹399')
    .replace(/₹499/g, '₹299');
  fs.writeFileSync('app/myjet.css', css, 'utf8');
}
