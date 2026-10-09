const fs = require('fs');
const path = require('path');

const src4 = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'book-cuarto', 'shared', 'CommandPanelModals4to.tsx'),
  'utf8'
);

let src5 = src4
  .replace(/CommandPanelModals4to/g, 'CommandPanelModals5to')
  .replace(/useBook4/g, 'useBook5')
  .replace(/Book4Context/g, 'Book5Context')
  .replace(/fedor-visual-lab-engine/g, 'fedor-visual-lab-engine-5to')
  .replace(/problemas-cotidianos-4/g, 'problemas-cotidianos-5')
  .replace(/4° de Primaria/g, '5° de Primaria')
  .replace(/grado 4°/g, 'grado 5°')
  .replace(/4°/g, '5°');

const dest = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared', 'CommandPanelModals5to.tsx');
fs.writeFileSync(dest, src5, 'utf8');
console.log('Wrote', dest);
