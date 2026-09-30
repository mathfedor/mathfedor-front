const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'cuarto');
const file = fs.readdirSync(dir)[0];
const content = fs.readFileSync(path.join(dir, file), 'utf8');

const regex = /POS\s*=\s*\{/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log('POS = { at:', m.index);
  console.log(content.slice(m.index, m.index + 800));
}
