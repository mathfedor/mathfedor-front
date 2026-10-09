const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('var CAT =');
console.log('var CAT =', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 2000));
}
