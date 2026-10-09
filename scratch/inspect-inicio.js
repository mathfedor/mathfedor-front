const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('f5hoy');
console.log('f5hoy index:', idx);

if (idx !== -1) {
  const slice = html.slice(idx, idx + 15000);
  console.log('Inicio Infantil code:\n', slice.slice(0, 5000));
}
