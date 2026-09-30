const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'public', 'cuarto', 'MatematicasDeFedor_4°.html');
console.log('Reading HTML file...');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, idx = 0;
const scripts = [];
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  scripts.push({ idx, code: match[1] });
}
console.log('Found', scripts.length, 'scripts.');

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

// Patch Script 1 so const becomes var and attaches to window
let s1Code = scripts[0].code.replace(
  /\bconst (LEVELS|UNITS|LEVEL_EXAMPLES|RANKS|ALL_BADGES|AVATAR_UNLOCKS)\b/g,
  'var $1'
);
s1Code += `
;window.LEVELS = typeof LEVELS !== 'undefined' ? LEVELS : null;
window.UNITS = typeof UNITS !== 'undefined' ? UNITS : null;
window.LEVEL_EXAMPLES = typeof LEVEL_EXAMPLES !== 'undefined' ? LEVEL_EXAMPLES : null;
window.RANKS = typeof RANKS !== 'undefined' ? RANKS : null;
window.ALL_BADGES = typeof ALL_BADGES !== 'undefined' ? ALL_BADGES : null;
window.AVATAR_UNLOCKS = typeof AVATAR_UNLOCKS !== 'undefined' ? AVATAR_UNLOCKS : null;
window.UNIT_TUTS = typeof UNIT_TUTS !== 'undefined' ? UNIT_TUTS : null;
`;

console.log('Running Script 1...');
try {
  vm.runInContext(s1Code, sandbox);
  console.log('Script 1 done. UNITS length:', sandbox.UNITS ? sandbox.UNITS.length : 0);
  console.log('LEVEL_EXAMPLES keys:', sandbox.LEVEL_EXAMPLES ? Object.keys(sandbox.LEVEL_EXAMPLES).length : 0);
} catch (e) {
  console.error('Script 1 failed:', e);
}

// Run scripts 2 to 158
console.log('Running intermediate scripts up to 158...');
let passed = 0, failed = 0;
for (let i = 1; i < scripts.length; i++) {
  try {
    vm.runInContext(scripts[i].code, sandbox);
    passed++;
  } catch (e) {
    failed++;
  }
}
console.log(`Executed remaining scripts: ${passed} passed, ${failed} failed.`);

if (sandbox.__vlockapi && typeof sandbox.__vlockapi.aplicar === 'function') {
  console.log('Running candado aplicar()...');
  sandbox.__vlockapi.aplicar();
  console.log('Candado reporte:', sandbox.__VLOCK_REPORTE);
}

console.log('Final state:');
console.log('UNITS:', sandbox.UNITS ? sandbox.UNITS.length : 0);
if (sandbox.UNITS) {
  let totalTopics = 0, totalLevels = 0, totalExercises = 0;
  sandbox.UNITS.forEach(u => {
    (u.topics || []).forEach(t => {
      totalTopics++;
      (t.levels || []).forEach(l => {
        totalLevels++;
        totalExercises += (l.exercises || []).length;
      });
    });
  });
  console.log(`Units: ${sandbox.UNITS.length}, Topics: ${totalTopics}, Levels: ${totalLevels}, Exercises: ${totalExercises}`);
}
console.log('LEVEL_EXAMPLES keys:', sandbox.LEVEL_EXAMPLES ? Object.keys(sandbox.LEVEL_EXAMPLES).length : 0);
console.log('SB (Problemas Cotidianos):', sandbox.SB ? sandbox.SB.length : 0);
console.log('RANKS:', sandbox.RANKS ? sandbox.RANKS.length : 0);
console.log('ALL_BADGES:', sandbox.ALL_BADGES ? sandbox.ALL_BADGES.length : 0);
console.log('AVATAR_UNLOCKS:', sandbox.AVATAR_UNLOCKS ? sandbox.AVATAR_UNLOCKS.length : 0);
console.log('UNIT_TUTS:', sandbox.UNIT_TUTS ? sandbox.UNIT_TUTS.length : 0);
