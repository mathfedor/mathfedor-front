const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
console.log('[build-quinto] Reading HTML file from', htmlPath);
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
const scripts = [];
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  scripts.push({ idx, code: match[1] });
}
console.log('[build-quinto] Found', scripts.length, 'scripts in HTML.');

const mockEl = () => ({
  style: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
  appendChild: () => {},
  insertBefore: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  setAttribute: () => {},
  getAttribute: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  getContext: () => ({ fillRect: () => {}, clearRect: () => {}, beginPath: () => {} }),
});

function CanvasRenderingContext2D() {}
CanvasRenderingContext2D.prototype = { roundRect: () => {} };

const sandbox = {
  console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout: () => 1,
  setInterval: () => 1,
  clearTimeout: () => {},
  clearInterval: () => {},
  Date: Date,
  Math: Math,
  JSON: JSON,
  addEventListener: () => {},
  removeEventListener: () => {},
  CanvasRenderingContext2D: CanvasRenderingContext2D,
  speechSynthesis: { speak: () => {}, cancel: () => {} },
  SpeechSynthesisUtterance: function() {},
};
sandbox.window = sandbox;
sandbox.document = {
  getElementById: () => mockEl(),
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: () => mockEl(),
  addEventListener: () => {},
  removeEventListener: () => {},
  body: mockEl(),
  head: mockEl(),
  readyState: 'complete',
};
sandbox.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
sandbox.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
sandbox.location = { href: '', search: '', pathname: '' };

vm.createContext(sandbox);

// 1. Patch Script 1
let s1Code = scripts[0].code.replace(
  /\bconst (LEVELS|UNITS|LEVEL_EXAMPLES|RANKS|ALL_BADGES|AVATAR_UNLOCKS|UNIT_TUTS|AVATARS)\b/g,
  'var $1'
);
s1Code += `
;window.LEVELS = typeof LEVELS !== 'undefined' ? LEVELS : null;
window.UNITS = typeof UNITS !== 'undefined' ? UNITS : null;
window.LEVEL_EXAMPLES = typeof LEVEL_EXAMPLES !== 'undefined' ? LEVEL_EXAMPLES : null;
window.RANKS = typeof RANKS !== 'undefined' ? RANKS : null;
window.ALL_BADGES = typeof ALL_BADGES !== 'undefined' ? ALL_BADGES : null;
window.AVATARS = typeof AVATARS !== 'undefined' ? AVATARS : null;
window.AVATAR_UNLOCKS = typeof AVATAR_UNLOCKS !== 'undefined' ? AVATAR_UNLOCKS : null;
window.UNIT_TUTS = typeof UNIT_TUTS !== 'undefined' ? UNIT_TUTS : null;
`;

console.log('[build-quinto] Evaluating Script 1...');
try {
  vm.runInContext(s1Code, sandbox);
  console.log('[build-quinto] Script 1 loaded. UNITS length:', sandbox.UNITS?.length);
} catch (e) {
  console.error('[build-quinto] Script 1 failed:', e.message);
}

// 2. Extract SB (Problemas Cotidianos) from Script #10
let sbData = [];
const s10 = scripts[9] ? scripts[9].code : '';
const sbIdx = s10.indexOf('var SB = [');
if (sbIdx !== -1) {
  const endIdx = s10.indexOf(';\nvar SBCOL =', sbIdx);
  if (endIdx !== -1) {
    try {
      sbData = JSON.parse(s10.slice(sbIdx + 9, endIdx));
      console.log(`[build-quinto] Extracted ${sbData.length} levels of Problemas Cotidianos (SB).`);
    } catch (e) {
      console.error('[build-quinto] Failed to parse SB:', e.message);
    }
  }
}

// 3. Sanitize and structure cleanUnits
console.log('[build-quinto] Sanitizing Units and Levels...');
const cleanUnits = (sandbox.UNITS || []).map((u, ui) => {
  return {
    id: `u${ui}`,
    name: u.name,
    short: u.short || `U${ui + 1}`,
    std: u.std || 'Pensamiento Numérico · Grado 5° · MEN Colombia',
    heroCls: u.heroCls || `uhb-${(ui % 8) + 1}`,
    icon: u.icon || '📘',
    topics: (u.topics || []).map((t, ti) => {
      const topicId = t.id || `u${ui}t${ti}`;
      return {
        id: topicId,
        title: t.title,
        icon: t.icon || '📝',
        desc: t.desc || '',
        levels: (t.levels || []).map((lv, li) => {
          return {
            label: lv.label || (sandbox.LEVELS && sandbox.LEVELS[li]?.label) || `Nivel ${li + 1}`,
            short: lv.short || (sandbox.LEVELS && sandbox.LEVELS[li]?.short) || `N${li + 1}`,
            dot: lv.dot || `n${li + 1}`,
            bg: lv.bg || (sandbox.LEVELS && sandbox.LEVELS[li]?.bg) || '#DCF5EE',
            color: lv.color || (sandbox.LEVELS && sandbox.LEVELS[li]?.color) || '#074F3A',
            exercises: (lv.exercises || []).map((ex) => {
              const cleanEx = {
                type: ex.type || 'mcq',
                q: ex.q,
                pts: ex.pts || 20,
              };
              if (ex.badge) cleanEx.badge = ex.badge;
              if (ex.bst) cleanEx.bst = ex.bst;
              if (ex.mascot) cleanEx.mascot = ex.mascot;
              if (ex.ctx) cleanEx.ctx = ex.ctx;
              if (ex.opts) cleanEx.opts = ex.opts;
              if (ex.ans !== undefined) cleanEx.ans = String(ex.ans);
              if (ex.hint) cleanEx.hint = ex.hint;
              if (ex.explain) cleanEx.explain = ex.explain;
              if (ex.vis) cleanEx.vis = ex.vis;
              if (ex.pA !== undefined) cleanEx.pA = ex.pA;
              if (ex.pB !== undefined) cleanEx.pB = ex.pB;
              if (ex.pOp !== undefined) cleanEx.pOp = ex.pOp;
              if (ex.pIco !== undefined) cleanEx.pIco = ex.pIco;
              if (ex.pIco2 !== undefined) cleanEx.pIco2 = ex.pIco2;
              if (ex.pNameA !== undefined) cleanEx.pNameA = ex.pNameA;
              if (ex.pNameB !== undefined) cleanEx.pNameB = ex.pNameB;
              if (ex.countEmoji !== undefined) cleanEx.countEmoji = ex.countEmoji;
              if (ex.countN !== undefined) cleanEx.countN = ex.countN;
              if (ex.visObjs !== undefined) cleanEx.visObjs = ex.visObjs;
              if (ex.__figHTML !== undefined) cleanEx.__figHTML = ex.__figHTML;
              if (ex.__proceso !== undefined) cleanEx.__proceso = ex.__proceso;
              return cleanEx;
            }),
          };
        }),
      };
    }),
  };
});

const outDir = path.join(__dirname, '..', 'src', 'mocks', 'data');

// 1. book-curriculum-5.data.json
const curriculum5 = {
  LEVELS: sandbox.LEVELS || [],
  UNITS: cleanUnits,
  AVATARS: sandbox.AVATARS || [],
  AVATAR_UNLOCKS: sandbox.AVATAR_UNLOCKS || [],
  ALL_BADGES: sandbox.ALL_BADGES || [],
  RANKS: sandbox.RANKS || [],
};
const curPath = path.join(outDir, 'book-curriculum-5.data.json');
fs.writeFileSync(curPath, JSON.stringify(curriculum5, null, 2), 'utf8');
console.log(`[build-quinto] Wrote ${curPath} (${(fs.statSync(curPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 2. book-extras-5.data.json
const extras5 = {
  LEVEL_EXAMPLES: sandbox.LEVEL_EXAMPLES || {},
};
const extPath = path.join(outDir, 'book-extras-5.data.json');
fs.writeFileSync(extPath, JSON.stringify(extras5, null, 2), 'utf8');
console.log(`[build-quinto] Wrote ${extPath} (${(fs.statSync(extPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 3. problemas-cotidianos-5.json
const probPath = path.join(outDir, 'problemas-cotidianos-5.json');
fs.writeFileSync(probPath, JSON.stringify({ PC_NIVELES: sbData }, null, 2), 'utf8');
console.log(`[build-quinto] Wrote ${probPath} (${(fs.statSync(probPath).size / 1024).toFixed(1)} KB)`);

// 4. book-unit-tuts-5.data.json
const tutsPath = path.join(outDir, 'book-unit-tuts-5.data.json');
fs.writeFileSync(tutsPath, JSON.stringify({ UNIT_TUTS: sandbox.UNIT_TUTS || [] }, null, 2), 'utf8');
console.log(`[build-quinto] Wrote ${tutsPath}`);

console.log('[build-quinto] ✅ Extraction of 5° Grado successfully completed!');
