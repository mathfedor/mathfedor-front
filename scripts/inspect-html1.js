const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('public/primero/MatematicasDeFedor_1.html'),
  crlfDelay: Infinity
});

let lineNo = 0;
let bodyStarted = false;
let foundLines = [];

rl.on('line', (line) => {
  lineNo++;
  if (line.includes('<body')) bodyStarted = true;
  if (bodyStarted) {
    if (
      line.includes('hdr') ||
      line.includes('screen-home') ||
      line.includes('galaxy') ||
      line.includes('luna') ||
      line.includes('Luna') ||
      line.includes('estadística') ||
      line.includes('Estadística') ||
      line.includes('unidades') ||
      line.includes('Unidades')
    ) {
      foundLines.push({ lineNo, text: line.trim().slice(0, 150) });
    }
  }
  if (lineNo > 3500) {
    rl.close();
  }
});

rl.on('close', () => {
  console.log(`Found ${foundLines.length} matching lines:`);
  foundLines.slice(0, 40).forEach(l => console.log(`${l.lineNo}: ${l.text}`));
});
