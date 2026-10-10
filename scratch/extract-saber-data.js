const fs = require('fs');

const html = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');

// Find all matches for temasSaber logic
// function temasSaber(){ var out = []; U().forEach(function(u){ (u.topics||[]).forEach(function(t){ if(/SABER/i.test(t.title||'')) out.push(t); }); }); return out; }

// Let's locate 'title:' with SABER
const regex = /title\s*:\s*['"]([^'"]*SABER[^'"]*)['"]/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Found SABER topic title at index', match.index, ':', match[1]);
}
