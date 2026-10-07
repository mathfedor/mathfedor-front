const fs = require('fs');
const content = fs.readFileSync('src/app/[locale]/dashboard/modules/[id]/exercises/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("t(':')") || l.includes("t(',')") || l.includes("t(' ')") || l.includes("t('\\n')") || l.includes("t(\"\\n\")")) {
    console.log(i + 1, l.trim());
  }
});
