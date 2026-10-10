const fs = require('fs');

const html = fs.readFileSync('public/cuarto/MatematicasDeFedor_4°.html', 'utf8');

// Let's locate the full object for 'Problemas Numéricos SABER' and 'Problemas Contextuales SABER'
const p1 = html.indexOf("title:'Problemas Numéricos SABER'");
const p2 = html.indexOf("title:'Problemas Contextuales SABER'");

console.log('p1:', p1, 'p2:', p2);

// Let's parse both topics
// We can find where UNITS array is or extract the text of these two topics
function extractTopicBlock(startIndex) {
  // Find opening brace '{' of the topic
  const start = html.lastIndexOf('{', startIndex);
  // Find matching closing brace
  let depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  return html.slice(start, end);
}

const topic1Code = extractTopicBlock(p1);
const topic2Code = extractTopicBlock(p2);

console.log('topic1 length:', topic1Code.length);
console.log('topic2 length:', topic2Code.length);

fs.writeFileSync('scratch/topic1_num.js', 'module.exports = ' + topic1Code);
fs.writeFileSync('scratch/topic2_ctx.js', 'module.exports = ' + topic2Code);

console.log('Saved topic files to scratch/');
