const fs = require('fs');
const path = require('path');

const src4 = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'book-cuarto', 'shared', 'DailyMissionCard4to.tsx'),
  'utf8'
);

let src5 = src4
  .replace(/DailyMissionCard4to/g, 'DailyMissionCard5to')
  .replace(/useBook4/g, 'useBook5')
  .replace(/Book4Context/g, 'Book5Context')
  .replace(/fedor4_/g, 'fedor5_')
  .replace(/4°/g, '5°');

const dest = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared', 'DailyMissionCard5to.tsx');
fs.writeFileSync(dest, src5, 'utf8');
console.log('Wrote', dest);
