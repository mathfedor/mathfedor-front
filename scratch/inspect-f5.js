const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx2 = html.indexOf('Hoy en Fedor');
console.log('Slice around Hoy en Fedor:\n', html.slice(idx2 - 800, idx2 + 4000));
