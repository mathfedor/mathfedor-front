const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('function montarInicio(');
console.log('montarInicio index:', idx);

if (idx !== -1) {
  console.log(html.slice(idx, idx + 12000));
} else {
  // Search for f5sec
  const idx2 = html.indexOf("munT.className = 'f5sec'");
  console.log('Around munT:\n', html.slice(idx2 - 3000, idx2 + 5000));
}
