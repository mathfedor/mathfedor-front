const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const s5Idx = content.indexOf('PAQUETE D+E — GAMIFICACIÓN Y MINIJUEGOS');
console.log('Snippet of Paquete D+E:\n', content.slice(s5Idx, s5Idx + 2000));
