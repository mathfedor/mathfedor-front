const fs = require('fs');
const content = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
const scripts = [];
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  scripts.push({ idx, code: match[1], len: match[1].length });
}
console.log('Total scripts found:', scripts.length);
for (let i = 0; i < Math.min(10, scripts.length); i++) {
  console.log(`Script #${scripts[i].idx}: len=${scripts[i].len}, snippet: ${scripts[i].code.slice(0, 120).replace(/\s+/g, ' ')}`);
}
for (let i = 155; i < scripts.length; i++) {
  console.log(`Script #${scripts[i].idx}: len=${scripts[i].len}, snippet: ${scripts[i].code.slice(0, 120).replace(/\s+/g, ' ')}`);
}
