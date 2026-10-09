const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const matches = Array.from(html.matchAll(/problemas\s*cotidianos/gi));
console.log('Matches for problemas cotidianos:', matches.length);
matches.forEach(m => {
  const idx = m.index;
  console.log('--- At index', idx, '---');
  console.log(html.slice(idx - 150, idx + 350));
});
