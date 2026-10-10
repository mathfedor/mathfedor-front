const fs = require('fs');
const html = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');

const regex = /En el tema \\"[^\\"]+\\" resuelve:/g;
let m = regex.exec(html);
if (m) {
  console.log('Match at', m.index);
  console.log(html.slice(Math.max(0, m.index - 120), m.index + 120));
} else {
  console.log('No direct match, searching for template function...');
  const fnPos = html.indexOf('prepara el kiosco de la feria');
  console.log(html.slice(fnPos - 200, fnPos + 400));
}
