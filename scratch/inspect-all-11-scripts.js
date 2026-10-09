const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  const code = match[1];
  const lines = code.trim().split('\n').slice(0, 5).join(' | ');
  console.log(`Script #${idx} (${code.length} chars): ${lines}`);
}
