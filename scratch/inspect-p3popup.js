const fs = require('fs');
const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const p3Idx = html.indexOf('p3Popup');
console.log('p3Popup first index:', p3Idx);

// Look around all occurrences of p3Popup
let idx = 0;
while ((idx = html.indexOf('p3Popup', idx)) !== -1) {
  const snippet = html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 250));
  console.log('--- At', idx, '---');
  console.log(snippet);
  idx += 7;
}
