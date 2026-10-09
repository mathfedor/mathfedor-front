const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('PAQUETE H — DISEÑO INFANTIL 5° + UNIVERSO FEDOR');
const slice = html.slice(idx, idx + 40000);

console.log('Length of Paquete H snippet:', slice.length);

// Let's find sections inside Paquete H
const functions = Array.from(slice.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)).map(m => m[1]);
console.log('Functions in Paquete H:', functions);

// Check CSS in Paquete H
const cssMatch = slice.match(/var CSS = \[([\s\S]*?)\];/);
if (cssMatch) {
  console.log('CSS entries count:', cssMatch[1].split('\n').length);
}

// Check where elements are created or rendered (e.g. hoy, cmd, mun, etc.)
const renderIdx = slice.indexOf('var hoy = document.createElement');
if (renderIdx !== -1) {
  console.log('Render section:\n', slice.slice(renderIdx - 200, renderIdx + 3000));
} else {
  const f5Idx = slice.indexOf('f5sec');
  console.log('f5sec section:\n', slice.slice(f5Idx - 200, f5Idx + 3000));
}
