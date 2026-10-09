const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('var BODIES =');
const slice = html.slice(idx + 5000, idx + 25000);

console.log('Part 2 of Paquete H:\n', slice.slice(0, 6000));
