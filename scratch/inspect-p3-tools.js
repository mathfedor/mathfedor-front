const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('id="p3Popup"');
console.log('id="p3Popup" index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 2500));
} else {
  // Search for p3Popup creation in JS
  const idx2 = html.indexOf('p3Popup');
  console.log('p3Popup in JS:\n', html.slice(idx2, idx2 + 2500));
}
