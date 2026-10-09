const fs = require('fs');
const path = require('path');

const dir4 = path.join(__dirname, '..', 'src', 'components', 'book-cuarto', 'shared');
const dir5 = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared');

['BookHeader4to.tsx', 'AiChatSidebar4to.tsx', 'LaunchIntro4to.tsx'].forEach(file => {
  const src = fs.readFileSync(path.join(dir4, file), 'utf8');
  const targetName = file.replace('4to', '5to');
  const res = src
    .replace(/4to/g, '5to')
    .replace(/useBook4/g, 'useBook5')
    .replace(/Book4Context/g, 'Book5Context')
    .replace(/fedor4_/g, 'fedor5_')
    .replace(/4°/g, '5°')
    .replace(/progreso-fedor-4to/g, 'progreso-fedor-5to')
    .replace(/MatematicasDeFedor4/g, 'MatematicasDeFedor5');
  fs.writeFileSync(path.join(dir5, targetName), res, 'utf8');
  console.log('Wrote', targetName);
});
