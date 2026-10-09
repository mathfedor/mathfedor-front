const fs = require('fs');
const path = require('path');

const src4 = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'book-cuarto', 'shared', 'UniversoFedorModal4to.tsx'),
  'utf8'
);

let src5 = src4
  .replace(/UniversoFedorModal4to/g, 'UniversoFedorModal5to')
  .replace(/useBook4/g, 'useBook5')
  .replace(/Book4Context/g, 'Book5Context')
  .replace(/bookCurriculum4/g, 'bookCurriculum5')
  .replace(/book-curriculum-4/g, 'book-curriculum-5')
  .replace(/BODIES_4TO/g, 'BODIES_5TO')
  .replace(/4°/g, '5°');

const dest = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared', 'UniversoFedorModal5to.tsx');
fs.writeFileSync(dest, src5, 'utf8');
console.log('Wrote', dest);
