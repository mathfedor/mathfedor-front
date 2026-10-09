const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const matches = Array.from(html.matchAll(/(?:var|let|const)\s+UNITS\s*=\s*/g));
console.log('Matches for UNITS declaration:', matches.map(m => m[0]));
matches.forEach(m => {
  const idx = m.index;
  console.log('Snippet:\n', html.slice(idx, idx + 300));
});
