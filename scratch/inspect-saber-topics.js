const fs = require('fs');
const html = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');

// Let's inspect around index 371324 and 392203
console.log('--- TOPIC 1 ---');
console.log(html.slice(371324 - 100, 371324 + 500));

console.log('--- TOPIC 2 ---');
console.log(html.slice(392203 - 100, 392203 + 500));
