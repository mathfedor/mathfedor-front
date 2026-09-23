const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('public/primero/MatematicasDeFedor_1.html'),
  crlfDelay: Infinity
});

let lineNo = 0;
let output1 = [];
let output2 = [];

rl.on('line', (line) => {
  lineNo++;
  if (lineNo >= 14000 && lineNo <= 14400) {
    output1.push(`${lineNo}: ${line}`);
  }
  if (lineNo >= 16070 && lineNo <= 16130) {
    output2.push(`${lineNo}: ${line}`);
  }
});

rl.on('close', () => {
  fs.writeFileSync('scripts/scratch_luna.txt', output1.join('\n'), 'utf8');
  fs.writeFileSync('scripts/scratch_lab.txt', output2.join('\n'), 'utf8');
  console.log('Saved scratch files');
});
