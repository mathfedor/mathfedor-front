const fs = require('fs');
const path = require('path');

const src4 = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'book-cuarto', 'shared', 'Grade4FloatingButtons.tsx'),
  'utf8'
);

let src5 = src4
  .replace(/Grade4FloatingButtons/g, 'Grade5FloatingButtons')
  .replace(/useBook4/g, 'useBook5')
  .replace(/Book4Context/g, 'Book5Context')
  .replace(/fedor4_/g, 'fedor5_')
  .replace(/cadete de 4°/g, 'cadete de 5°')
  .replace(/SABER 4°/g, 'SABER 5°')
  .replace(/4°/g, '5°');

const dest = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared', 'Grade5FloatingButtons.tsx');
fs.writeFileSync(dest, src5, 'utf8');
console.log('Wrote', dest);
