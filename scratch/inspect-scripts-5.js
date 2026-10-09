const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
const scripts = [];
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  const code = match[1];
  const firstLine = code.trim().split('\n')[0].slice(0, 100);
  scripts.push({ idx, length: code.length, firstLine });
}
console.log('Total scripts in MatematicasDeFedor_5.html:', scripts.length);
scripts.forEach(s => {
  if (s.length > 5000 || s.firstLine.includes('PAQUETE') || s.firstLine.includes('UNITS') || s.firstLine.includes('SB')) {
    console.log(`Script #${s.idx} (len: ${s.length}): ${s.firstLine}`);
  }
});
