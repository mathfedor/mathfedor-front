const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

// Find var UNITS = [...]
const idx = html.indexOf('var UNITS = [');
console.log('var UNITS index:', idx);

if (idx !== -1) {
  // Extract UNITS array
  const endIdx = html.indexOf('];', idx);
  console.log('UNITS block length:', endIdx - idx);
  const unitsCode = html.slice(idx, endIdx + 2);
  const sandbox = {};
  const fn = new Function('sandbox', unitsCode + '; sandbox.UNITS = UNITS;');
  fn(sandbox);
  console.log('Total Units:', sandbox.UNITS.length);
  sandbox.UNITS.forEach((u, i) => {
    console.log(`Unit ${i + 1}: ${u.name} (${u.topics ? u.topics.length : 0} topics) icon: ${u.icon}`);
  });
}
