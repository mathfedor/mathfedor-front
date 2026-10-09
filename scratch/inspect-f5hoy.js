const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf("hoy.className = 'f5hoy'");
console.log('f5hoy index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 3500));
}
