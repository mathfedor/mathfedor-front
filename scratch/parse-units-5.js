const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('const UNITS = ');
// Find end of UNITS
let endIdx = html.indexOf(';\n', idx);
if (endIdx === -1) endIdx = html.indexOf(';\r\n', idx);
const unitsCode = html.slice(idx, endIdx + 1);
const sandbox = {};
const fn = new Function('sandbox', unitsCode + '; sandbox.UNITS = UNITS;');
fn(sandbox);
console.log('Total Units in 5th Grade:', sandbox.UNITS.length);
sandbox.UNITS.forEach((u, i) => {
  console.log(`Unit ${i + 1}: ${u.name} | Topics: ${u.topics ? u.topics.length : 0} | icon: ${u.icon}`);
});
