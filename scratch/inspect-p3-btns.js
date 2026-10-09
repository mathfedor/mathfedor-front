const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('#p3Popup::before');
console.log('Snippet following p3Popup CSS:\n', html.slice(idx, idx + 4000));
