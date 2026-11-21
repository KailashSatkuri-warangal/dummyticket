const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let totalFixed = 0;
files.forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  const orig = c;
  
  // 1. Fix relative image paths
  c = c.replace(/src=["']images\//gi, 'src="/images/');
  c = c.replace(/href=["']images\//gi, 'href="/images/');
  c = c.replace(/srcset=["']images\//gi, 'srcset="/images/');
  c = c.replace(/src=["']storage\//gi, 'src="/storage/');
  
  // 2. Remove @v= query suffixes
  c = c.replace(/(\.(svg|png|jpg|jpeg|webp))@v=[^"'\s>]*/gi, '$1');
  
  // 3. Brand names
  c = c.replace(/myjet24\.com/gi, 'dummyticket.com');
  c = c.replace(/myjet24/gi, 'DummyTicket');
  c = c.replace(/MyJet24/gi, 'DummyTicket');
  
  if (c !== orig) {
    fs.writeFileSync(p, c, 'utf8');
    totalFixed++;
  }
});
console.log('Fixed asset paths in ' + totalFixed + ' content files.');
