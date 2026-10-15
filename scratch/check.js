const fs = require('fs');
const content = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');
const data = require('../src/mocks/data/book-extras-5.data.json');
const exs = data.LEVEL_EXAMPLES['01a_adicion_t0-n1'];

console.log('Testing detection on 10 examples:');
exs.forEach((e, i) => {
  console.log(`Example ${i + 1}: ${e.q}`);
});
