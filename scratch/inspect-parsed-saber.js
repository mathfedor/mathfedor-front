const fs = require('fs');
const vm = require('vm');

let t1Code = fs.readFileSync('scratch/topic1_num.js', 'utf8');
let t2Code = fs.readFileSync('scratch/topic2_ctx.js', 'utf8');

// The code uses LEVELS[0], etc. Let's create dummy LEVELS array so it evaluates smoothly
const context = {
  LEVELS: [
    { num: 1, name: 'Cadete', icon: '🧑‍🚀' },
    { num: 2, name: 'Piloto', icon: '🚀' },
    { num: 3, name: 'Capitán', icon: '⭐' },
    { num: 4, name: 'Comandante', icon: '👑' },
    { num: 5, name: 'SABER', icon: '🏆' }
  ],
  module: {}
};

vm.createContext(context);
vm.runInContext(t1Code, context);
const topic1 = context.module.exports;

context.module = {};
vm.runInContext(t2Code, context);
const topic2 = context.module.exports;

console.log('Topic 1 title:', topic1.title, 'levels:', topic1.levels.length);
console.log('Topic 2 title:', topic2.title, 'levels:', topic2.levels.length);

for (let i = 0; i < 5; i++) {
  const ex1 = topic1.levels[i].exercises || [];
  const ex2 = topic2.levels[i].exercises || [];
  console.log(`Level ${i + 1}: Topic1 has ${ex1.length} exercises, Topic2 has ${ex2.length} exercises. Total: ${ex1.length + ex2.length}`);
}
