const fs = require('fs');

const html = fs.readFileSync('public/quinto/MatematicasDeFedor_5.html', 'utf8');

const idx = html.indexOf('<div class="screen active" id="screen-setup">');
console.log(html.slice(idx, idx + 8000));
