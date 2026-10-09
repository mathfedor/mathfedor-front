const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

// Search for popup or modal with "bienvenid"
const matches = Array.from(html.matchAll(/bienvenid[a-z]*/gi));
console.log('Matches for bienvenid:', matches.length);
matches.forEach(m => {
  const idx = m.index;
  console.log('--- At index', idx, '---');
  console.log(html.slice(idx - 100, idx + 400));
});
