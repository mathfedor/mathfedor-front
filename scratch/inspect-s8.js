const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
const scripts = [];
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  if (idx === 8) {
    const s8 = match[1];
    console.log('Script 8 length:', s8.length);
    console.log('Script 8 start:\n', s8.slice(0, 500));
    console.log('Script 8 end:\n', s8.slice(-500));
  }
}
