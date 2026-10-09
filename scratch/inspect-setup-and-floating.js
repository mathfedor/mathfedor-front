const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

// 1. Setup screen HTML
const setupStart = html.indexOf('<div class="screen active" id="screen-setup">');
const setupEnd = html.indexOf('<!-- ════════════════════════════════════════', setupStart + 10);
console.log('=== SCREEN SETUP HTML ===');
console.log(html.slice(setupStart, Math.min(setupStart + 4000, setupEnd)));

// 2. Floating buttons in HTML or JS
const p3FabIdx = html.indexOf('p3Fab');
console.log('=== p3Fab SNIPPET ===');
if (p3FabIdx !== -1) {
  console.log(html.slice(p3FabIdx - 200, p3FabIdx + 2000));
}

// 3. Welcome popup HTML / JS
const welcomeIdx = html.indexOf('welcomeModal');
console.log('=== WELCOME MODAL SNIPPET ===');
if (welcomeIdx !== -1) {
  console.log(html.slice(welcomeIdx - 100, welcomeIdx + 1500));
} else {
  const popupIdx = html.indexOf('popupBienvenida');
  console.log('popupBienvenida:', popupIdx !== -1 ? html.slice(popupIdx - 100, popupIdx + 1500) : 'not found');
}
