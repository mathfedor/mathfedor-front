const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('public/primero/MatematicasDeFedor_1.html'),
  crlfDelay: Infinity
});

let lineNo = 0;
let results = [];

rl.on('line', (line) => {
  lineNo++;
  if (
    line.includes('Espacial') ||
    line.includes('espacial') ||
    line.includes('Repetir') ||
    line.includes('Diario') ||
    line.includes('Reiniciar') ||
    line.includes('Guardar')
  ) {
    if (line.includes('hdr') || line.includes('button') || line.includes('btn') || line.includes('header')) {
      results.push({ lineNo, text: line.trim().slice(0, 160) });
    }
  }
});

rl.on('close', () => {
  console.log(`Found ${results.length} occurrences:`);
  results.forEach(r => console.log(`${r.lineNo}: ${r.text}`));
});
