const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

console.log('--- BASIC STATS ---');
console.log('Length:', html.length);

// Extract title
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

// Find major IDs (div id="...")
const idMatches = Array.from(html.matchAll(/id=["']([a-zA-Z0-9_\-]+)["']/g)).map(m => m[1]);
console.log('Total unique IDs:', new Set(idMatches).size);

// Check screens (e.g. id starting with "screen", "scr", "f5", "sec-", etc.)
const screens = Array.from(new Set(idMatches)).filter(id =>
  /screen|scr|setup|home|unit|lesson|modal|panel|popup/i.test(id)
);
console.log('Relevant Screen/Modal IDs:', screens.slice(0, 40));

// Check JavaScript variables (UNITS, AVATARS, etc.)
const varMatches = Array.from(html.matchAll(/(?:const|let|var)\s+([A-Z0-9_]{3,})\s*=/g)).map(m => m[1]);
console.log('Top capital JS variables:', Array.from(new Set(varMatches)).slice(0, 30));

// Search for the sections mentioned by the user:
const searchKeywords = [
  'Universo fedor',
  'Hoy en Fedor',
  'Panel de comando',
  'Para aprender',
  'problemas cotidianos',
  'Mis mundos de aprendizaje',
  'Zona de profes y familias',
  'bienvenida'
];

searchKeywords.forEach(kw => {
  const idx = html.toLowerCase().indexOf(kw.toLowerCase());
  console.log(`Keyword "${kw}": ${idx !== -1 ? 'FOUND at ' + idx : 'NOT FOUND'}`);
});
