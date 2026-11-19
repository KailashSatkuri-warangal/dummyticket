const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'pages');

if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir);
  files.forEach((f) => {
    const fp = path.join(contentDir, f);
    let html = fs.readFileSync(fp, 'utf8');

    html = html
      .replace(/\$7\.90/g, '₹699')
      .replace(/\$7\.99/g, '₹499')
      .replace(/\$16/g, '₹1,399')
      .replace(/\$14/g, '₹1,199')
      .replace(/\$15/g, '₹1,299')
      .replace(/\$11/g, '₹899')
      .replace(/\$300\+/g, '₹25,000+')
      .replace(/\$800/g, '₹65,000')
      .replace(/\$0/g, '₹0')
      .replace(/&dollar;7\.90/g, '&#8377;699')
      .replace(/&dollar;7\.99/g, '&#8377;499');

    fs.writeFileSync(fp, html, 'utf8');
  });
  console.log('Converted currency in ' + files.length + ' HTML content files to INR');
}

// Also update myjet.css if any $ prices exist
if (fs.existsSync('app/myjet.css')) {
  let css = fs.readFileSync('app/myjet.css', 'utf8');
  css = css
    .replace(/\$7\.90/g, '₹699')
    .replace(/\$7\.99/g, '₹499')
    .replace(/\$16/g, '₹1,399')
    .replace(/\$14/g, '₹1,199')
    .replace(/\$15/g, '₹1,299');
  fs.writeFileSync('app/myjet.css', css, 'utf8');
  console.log('Updated myjet.css currency references to INR');
}

console.log('All currencies converted to Indian Rupees (INR) successfully.');
