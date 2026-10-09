const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

function snippetAround(query, radius = 500) {
  const idx = html.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return `Query "${query}" not found`;
  const start = Math.max(0, idx - 100);
  const end = Math.min(html.length, idx + radius);
  return html.slice(start, end);
}

console.log('=== SCREEN SETUP ===');
console.log(snippetAround('screen-setup', 600));

console.log('=== POPUP BIENVENIDA ===');
console.log(snippetAround('bienvenida', 600));

console.log('=== FLOATING BUTTONS ===');
// Search for float, fab, fixed button
const floatMatches = Array.from(html.matchAll(/(?:class|id)=["'][^"']*(?:float|fab|flotante|menu-btn|menuBtn)[^"']*["']/gi)).map(m => m[0]);
console.log('Float matches:', floatMatches.slice(0, 15));

console.log('=== UNIVERSO FEDOR ===');
console.log(snippetAround('Universo fedor', 600));

console.log('=== HOY EN FEDOR ===');
console.log(snippetAround('Hoy en Fedor', 600));

console.log('=== PANEL DE COMANDO ===');
console.log(snippetAround('Panel de comando', 600));

console.log('=== PROBLEMAS COTIDIANOS ===');
console.log(snippetAround('problemas cotidianos', 600));

console.log('=== MIS MUNDOS DE APRENDIZAJE ===');
console.log(snippetAround('Mis mundos de aprendizaje', 600));

console.log('=== ZONA DE PROFES Y FAMILIAS ===');
console.log(snippetAround('Zona de profes y familias', 600));
