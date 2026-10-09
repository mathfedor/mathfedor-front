const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('f5Ajustes');
console.log('f5Ajustes index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx - 200, idx + 1000));
}

// Also search for any other fixed buttons
const fixedMatches = Array.from(html.matchAll(/position:\s*fixed[^;\}]*/gi)).map(m => m[0]);
console.log('Fixed position styles:', fixedMatches.slice(0, 10));
