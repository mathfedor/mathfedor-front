const fs = require('fs');

const fileContent = fs.readFileSync('src/app/[locale]/dashboard/modules/[id]/exercises/page.tsx', 'utf8');

// Find all t('...') or t("...") calls
const regex = /t\(['"]([^'"]+)['"]\)/g;
const keys = new Set();
let match;
while ((match = regex.exec(fileContent)) !== null) {
  keys.add(match[1]);
}

console.log('Found', keys.size, 'translation keys used in exercises/page.tsx:');
console.log(Array.from(keys));

const locales = ['es', 'en', 'pt', 'fr', 'de'];
for (const loc of locales) {
  const dash = JSON.parse(fs.readFileSync(`messages/${loc}/dashboard.json`, 'utf8'));
  const exercisesDict = dash.exercises || {};
  const missing = [];
  for (const k of keys) {
    // k can be nested like 'alerts.title' or simple like 'title'
    const parts = k.split('.');
    let cur = exercisesDict;
    let found = true;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        found = false;
        break;
      }
    }
    if (!found) {
      missing.push(k);
    }
  }
  if (missing.length > 0) {
    console.log(`[${loc}] MISSING keys (${missing.length}):`, missing);
  } else {
    console.log(`[${loc}] ALL ${keys.size} keys present!`);
  }
}
