const fs = require('fs');
const vm = require('vm');

let t1Code = fs.readFileSync('scratch/topic1_num.js', 'utf8');
let t2Code = fs.readFileSync('scratch/topic2_ctx.js', 'utf8');

const context = { LEVELS: [{},{},{},{},{}], module: {} };
vm.createContext(context);
vm.runInContext(t1Code, context);
const t1 = context.module.exports;

context.module = {};
vm.runInContext(t2Code, context);
const t2 = context.module.exports;

const characters = ['Sora', 'Roxy', 'Leo', 'Mateo', 'Valentina', 'Fedor', 'Camila', 'Andrés'];
const actions = [
  'prepara el kiosco de la feria',
  'ayuda en la biblioteca',
  'reparte volantes en el colegio',
  'planea la fiesta de fin de año',
  'anota las cuentas del kiosco',
  'juega en el parque con sus amigos',
  'organiza los materiales de clase',
  'cuenta las plantas del jardín escolar'
];

const allLevels = [];

for (let lvl = 0; lvl < 5; lvl++) {
  const pool = [];
  
  // Topic 1: Problemas Numéricos SABER
  const ex1List = t1.levels[lvl].exercises || [];
  ex1List.forEach((ex, idx) => {
    if (ex.type === 'mcq' && ex.opts && ex.opts.length) {
      const char = characters[(lvl * 7 + idx * 3) % characters.length];
      const act = actions[(lvl * 5 + idx * 2) % actions.length];
      const ctx = `${char} ${act}. En el tema "Problemas Numéricos SABER" resuelve:`;
      pool.push({
        id: `t1-l${lvl}-q${idx}`,
        tema: 'Problemas Numéricos SABER',
        ctx: ctx,
        q: ex.q,
        opts: ex.opts,
        ans: String(ex.ans),
        formula: '🧠 CM · DM · UM · C · D · U'
      });
    }
  });

  // Topic 2: Problemas Contextuales SABER
  const ex2List = t2.levels[lvl].exercises || [];
  ex2List.forEach((ex, idx) => {
    if (ex.type === 'mcq' && ex.opts && ex.opts.length) {
      const char = characters[(lvl * 3 + idx * 5) % characters.length];
      const act = actions[(lvl * 2 + idx * 3) % actions.length];
      const ctx = `${char} ${act}. En el tema "Problemas Contextuales SABER" resuelve:`;
      pool.push({
        id: `t2-l${lvl}-q${idx}`,
        tema: 'Problemas Contextuales SABER',
        ctx: ctx,
        q: ex.q,
        opts: ex.opts,
        ans: String(ex.ans),
        formula: '🧠 CM · DM · UM · C · D · U'
      });
    }
  });

  allLevels.push({
    level: lvl + 1,
    count: pool.length,
    pool: pool
  });
}

console.log('Summary of pools:');
allLevels.forEach(l => {
  console.log(`Nivel ${l.level}: ${l.count} ejercicios MCQ listos.`);
});

fs.writeFileSync('src/components/book-cuarto/shared/saber4to-data.json', JSON.stringify(allLevels, null, 2));
console.log('Saved data to src/components/book-cuarto/shared/saber4to-data.json');
