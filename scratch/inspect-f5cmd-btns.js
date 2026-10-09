const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf("cmd.className = 'f5cmd'");
console.log('f5cmd index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 6000));
}
