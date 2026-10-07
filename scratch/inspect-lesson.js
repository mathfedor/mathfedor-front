const fs = require('fs');
const content = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');
const idx = content.indexOf('function explicaEjemploHTML');
console.log('explicaEjemploHTML idx:', idx);
if (idx !== -1) {
  console.log(content.slice(idx, idx + 1000));
}
