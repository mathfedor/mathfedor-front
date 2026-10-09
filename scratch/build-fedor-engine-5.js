const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
let script8 = '';
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  if (idx === 8) {
    script8 = match[1];
    break;
  }
}

// Extract inside of (function(){ ... })();
const fnStart = script8.indexOf('(function(){');
const fnEnd = script8.lastIndexOf('})();');

let innerCode = script8.slice(fnStart + 12, fnEnd).trim();
if (innerCode.startsWith("'use strict';")) {
  innerCode = innerCode.slice(13).trim();
}

// 1. Make $ SSR safe
innerCode = innerCode.replace(/function \$\(id\)\{\s*return document\.getElementById\(id\);\s*\}/, `function $(id){\n  if (typeof document === 'undefined') return null;\n  return document.getElementById(id);\n}`);

// 2. Make window.FZ safe
innerCode = innerCode.replace(/var FZ = window\.FZ = \{st:\{\}, n:0\};/, `var FZ = {st:{}, n:0};\nif (typeof window !== 'undefined') {\n  window.FZ = FZ;\n}`);

// 3. Make style injection SSR safe
innerCode = innerCode.replace(
  /\(function\(\)\{\s*var st=document\.createElement\('style'\);[\s\S]*?document\.head\.appendChild\(st\);\s*\}\)\(\);/,
  `if (typeof document !== 'undefined') {\n  (function(){ var st=document.createElement('style'); st.id='fzCSS'; st.textContent=CSS; if(document.head) document.head.appendChild(st); })();\n}`
);

// 4. Make showEx safe
innerCode = innerCode.replace(/var _se = window\.showEx;/, `if (typeof window !== 'undefined') {\n  var _se = window.showEx;`);
innerCode = innerCode.replace(/return r; \};/, `return r; };\n}`);

// 5. Wrap bottom observers
const obsStart = 'var _sp = window.showExamplesPanel;';
const obsIdx = innerCode.indexOf(obsStart);
if (obsIdx !== -1) {
  const top = innerCode.slice(0, obsIdx);
  const bottom = innerCode.slice(obsIdx);
  innerCode = top + `if (typeof window !== 'undefined') {\n` + bottom + `\n}`;
}

const finalCode = `// Motor FZ de Laboratorios Visuales y Manipulativos Pedagógicos de 5° Grado
// Extraído fielmente de public/quinto/MatematicasDeFedor_5.html sin alterar datos pedagógicos

/* eslint-disable */

${innerCode}

if (typeof window !== 'undefined') {
  window.FZ = FZ;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FZ };
}
`;

const destPath = path.join(__dirname, '..', 'src', 'components', 'book-quinto', 'shared', 'fedor-visual-lab-engine-5to.js');
fs.writeFileSync(destPath, finalCode, 'utf8');
console.log('[build-engine-5] Wrote', destPath);
