const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'quinto', 'MatematicasDeFedor_5.html');
const content = fs.readFileSync(htmlPath, 'utf8');

['SHOP_ITEMS', 'LORE_CHAPTERS', 'UNIT_TUTS', 'ALL_BADGES', 'RANKS', 'AVATARS', 'AVATAR_UNLOCKS'].forEach(key => {
  const idx = content.indexOf(key);
  console.log(`${key}: ${idx !== -1 ? 'Found at index ' + idx : 'NOT FOUND'}`);
});
