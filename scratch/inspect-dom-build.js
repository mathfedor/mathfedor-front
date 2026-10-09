const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('function montarInicioInfantil');
console.log('montarInicioInfantil idx:', idx);

if (idx !== -1) {
  console.log(html.slice(idx, idx + 10000));
} else {
  // Search for f5HoyT or Hoy en Fedor in JS
  const idx2 = html.indexOf('Hoy en Fedor');
  console.log('Around Hoy en Fedor:\n', html.slice(idx2, idx2 + 8000));
}
