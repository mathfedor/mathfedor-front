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
  const lower = line.toLowerCase();
  if (
    lower.includes('viaje a la luna') ||
    lower.includes('laboratorio de estad') ||
    lower.includes('mira el despegue') ||
    lower.includes('galaxia del saber') ||
    lower.includes('bloques')
  ) {
    results.push({ lineNo, text: line.trim().slice(0, 160) });
  }
});

rl.on('close', () => {
  console.log(`Found ${results.length} occurrences:`);
  results.forEach(r => console.log(`${r.lineNo}: ${r.text}`));
});
