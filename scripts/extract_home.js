const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('public/primero/MatematicasDeFedor_1.html'),
  crlfDelay: Infinity
});

let lineNo = 0;
let output = [];

rl.on('line', (line) => {
  lineNo++;
  if (lineNo >= 1065 && lineNo <= 1420) {
    output.push(`${lineNo}: ${line}`);
  }
  if (lineNo > 1420) {
    rl.close();
  }
});

rl.on('close', () => {
  fs.writeFileSync('scripts/scratch_home_html.txt', output.join('\n'), 'utf8');
  console.log('Saved lines 1065 to 1420 to scripts/scratch_home_html.txt');
});
