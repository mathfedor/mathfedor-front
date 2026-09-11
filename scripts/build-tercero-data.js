const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'public', 'tercero', 'MatematicasDeFedor_3°.html');
const content = fs.readFileSync(htmlPath, 'utf8');

console.log('[build-tercero] Reading HTML file...');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, count = 0;
let script3 = '', script4 = '', script15 = '', script19 = '', script22 = '';

while ((match = scriptRegex.exec(content)) !== null) {
  count++;
  if (count === 3) script3 = match[1];
  if (count === 4) script4 = match[1];
  if (count === 15) script15 = match[1];
  if (count === 19) script19 = match[1];
  if (count === 22) script22 = match[1];
}

const mockEl = () => ({
  style: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {} },
  appendChild: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  setAttribute: () => {},
  getAttribute: () => null,
  getContext: () => ({ fillRect: () => {}, clearRect: () => {}, beginPath: () => {} }),
});

function CanvasRenderingContext2D() {}
CanvasRenderingContext2D.prototype = { roundRect: () => {} };

const sandbox = {
  console: console,
  setTimeout: () => {},
  setInterval: () => {},
  clearTimeout: () => {},
  clearInterval: () => {},
  Date: Date,
  Math: Math,
  JSON: JSON,
  addEventListener: () => {},
  removeEventListener: () => {},
  CanvasRenderingContext2D: CanvasRenderingContext2D,
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
};
sandbox.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
sandbox.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

vm.createContext(sandbox);

// 1. Script 3
console.log('[build-tercero] Evaluating Script 3...');
const res3 = vm.runInContext(
  script3 + '\n;({ LEVELS, UNITS, LEVEL_EXAMPLES, AVATAR_UNLOCKS, ALL_BADGES, RANKS, UNIT_TUTS })',
  sandbox
);

// 2. Script 4 (extract SHOP_ITEMS & LORE_CHAPTERS)
console.log('[build-tercero] Extracting Shop & Lore...');
let shopItems = [];
let loreChapters = [];
const sIdx = script4.indexOf('var SHOP_ITEMS =');
if (sIdx !== -1) {
  const sEnd = script4.indexOf(';\n', sIdx);
  const shopCode = script4.slice(sIdx, sEnd !== -1 ? sEnd + 1 : sIdx + 10000).replace('var SHOP_ITEMS =', 'shopItems =');
  try {
    vm.runInContext(shopCode, sandbox);
    shopItems = sandbox.shopItems || [];
  } catch (e) {
    console.error('Error extracting SHOP_ITEMS:', e.message);
  }
}

const lIdx = script4.indexOf('var LORE_CHAPTERS =');
if (lIdx !== -1) {
  const lEnd = script4.indexOf(';\n', lIdx);
  const loreCode = script4.slice(lIdx, lEnd !== -1 ? lEnd + 1 : lIdx + 10000).replace('var LORE_CHAPTERS =', 'loreChapters =');
  try {
    vm.runInContext(loreCode, sandbox);
    loreChapters = sandbox.loreChapters || [];
  } catch (e) {
    console.error('Error extracting LORE_CHAPTERS:', e.message);
  }
}

// 3. Script 22 (extract PC_NIVELES)
console.log('[build-tercero] Extracting Problemas Cotidianos...');
let pcNiveles = [];
const pcIdx = script22.indexOf('var PC_NIVELES =');
if (pcIdx !== -1) {
  const pcEnd = script22.indexOf(';\n', pcIdx);
  const pcCode = script22.slice(pcIdx, pcEnd !== -1 ? pcEnd + 1 : pcIdx + 60000).replace('var PC_NIVELES =', 'pcNiveles =');
  try {
    vm.runInContext(pcCode, sandbox);
    pcNiveles = sandbox.pcNiveles || [];
  } catch (e) {
    console.error('Error extracting PC_NIVELES:', e.message);
  }
}

// Ensure IDs on units, topics, and levels for consistency
const cleanUnits = (res3.UNITS || []).map((u, ui) => {
  return {
    id: `u${ui}`,
    name: u.name,
    short: u.short || `U${ui + 1}`,
    std: u.std || 'Pensamiento Numérico · Grado 3° · MEN Colombia',
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
            label: lv.label || (res3.LEVELS && res3.LEVELS[li]?.label) || `Nivel ${li + 1}`,
            short: lv.short || (res3.LEVELS && res3.LEVELS[li]?.short) || `N${li + 1}`,
            dot: lv.dot || `n${li + 1}`,
            bg: lv.bg || (res3.LEVELS && res3.LEVELS[li]?.bg) || '#DCF5EE',
            color: lv.color || (res3.LEVELS && res3.LEVELS[li]?.color) || '#074F3A',
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
              if (ex.pA) cleanEx.pA = ex.pA;
              if (ex.pB) cleanEx.pB = ex.pB;
              if (ex.pOp) cleanEx.pOp = ex.pOp;
              if (ex.pIco) cleanEx.pIco = ex.pIco;
              if (ex.pIco2) cleanEx.pIco2 = ex.pIco2;
              if (ex.pNameA) cleanEx.pNameA = ex.pNameA;
              if (ex.pNameB) cleanEx.pNameB = ex.pNameB;
              if (ex.countEmoji) cleanEx.countEmoji = ex.countEmoji;
              if (ex.countN) cleanEx.countN = ex.countN;
              if (ex.visObjs) cleanEx.visObjs = ex.visObjs;
              return cleanEx;
            }),
          };
        }),
      };
    }),
  };
});

const outDir = path.join(__dirname, '..', 'src', 'mocks', 'data');

// 1. book-curriculum-3.data.json
const curriculum3 = {
  LEVELS: res3.LEVELS || [],
  UNITS: cleanUnits,
  AVATAR_UNLOCKS: res3.AVATAR_UNLOCKS || [],
  ALL_BADGES: res3.ALL_BADGES || [],
  RANKS: res3.RANKS || [],
  SHOP_ITEMS: shopItems,
};
const curPath = path.join(outDir, 'book-curriculum-3.data.json');
fs.writeFileSync(curPath, JSON.stringify(curriculum3, null, 2), 'utf8');
console.log(`[build-tercero] Wrote ${curPath} (${(fs.statSync(curPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 2. book-extras-3.data.json
const extras3 = {
  LEVEL_EXAMPLES: res3.LEVEL_EXAMPLES || {},
};
const extPath = path.join(outDir, 'book-extras-3.data.json');
fs.writeFileSync(extPath, JSON.stringify(extras3, null, 2), 'utf8');
console.log(`[build-tercero] Wrote ${extPath} (${(fs.statSync(extPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 3. problemas-cotidianos-3.json
const probPath = path.join(outDir, 'problemas-cotidianos-3.json');
fs.writeFileSync(probPath, JSON.stringify({ PC_NIVELES: pcNiveles }, null, 2), 'utf8');
console.log(`[build-tercero] Wrote ${probPath} (${(fs.statSync(probPath).size / 1024).toFixed(1)} KB)`);

// 4. book-lore-3.data.json
const lorePath = path.join(outDir, 'book-lore-3.data.json');
fs.writeFileSync(lorePath, JSON.stringify({ LORE_CHAPTERS: loreChapters }, null, 2), 'utf8');
console.log(`[build-tercero] Wrote ${lorePath}`);

// 5. book-unit-tuts-3.data.json
const tutsPath = path.join(outDir, 'book-unit-tuts-3.data.json');
fs.writeFileSync(tutsPath, JSON.stringify({ UNIT_TUTS: res3.UNIT_TUTS || [] }, null, 2), 'utf8');
console.log(`[build-tercero] Wrote ${tutsPath}`);

console.log('[build-tercero] ✅ Extraction complete!');
