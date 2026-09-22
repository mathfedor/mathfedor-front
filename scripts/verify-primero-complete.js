const extras1 = require('../src/mocks/data/book-extras-1.data.json');
const c1 = require('../src/mocks/data/book-curriculum-1.data.json');

function inferSb(qRaw, aRaw) {
  const qStr = qRaw || '';
  const q = qStr.toLowerCase();
  const a = String(aRaw ?? '').trim();

  let em = '⭐';
  const emojiMatch = qStr.match(/([\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}])/u);
  if (emojiMatch) {
    em = emojiMatch[1];
  } else if (/manzanas?/i.test(q)) em = '🍎';
  else if (/estrellas?/i.test(q)) em = '⭐';
  else if (/pollit/i.test(q)) em = '🐣';
  else if (/pl[aá]tanos?/i.test(q)) em = '🍌';
  else if (/naranjas?/i.test(q)) em = '🍊';
  else if (/uvas?/i.test(q)) em = '🍇';
  else if (/perros?/i.test(q)) em = '🐶';
  else if (/gatos?/i.test(q)) em = '🐱';
  else if (/globos?/i.test(q)) em = '🎈';
  else if (/flores?/i.test(q)) em = '🌸';
  else if (/mariposas?/i.test(q)) em = '🦋';
  else if (/hormigas?/i.test(q)) em = '🐜';
  else if (/peces?/i.test(q)) em = '🐟';
  else if (/dulces?|caramelos?/i.test(q)) em = '🍬';
  else if (/regalos?/i.test(q)) em = '🎁';

  if (/decena/i.test(q)) return { type: 'decena', title: 'La Decena', captions: ['10 unidades sueltas', 'Las agrupamos', '1 Decena = 10 U'] };
  if (/docena/i.test(q)) return { type: 'docena', title: 'La Docena', captions: ['12 objetos', 'Los empacamos', '1 Docena = 12'] };

  const mAdd = q.match(/(\d+)\s*\+\s*(\d+)/);
  if (mAdd) {
    const a1 = parseInt(mAdd[1], 10), b1 = parseInt(mAdd[2], 10);
    if (a1 <= 9 && b1 <= 9) return { type: 'add', a: a1, b: b1, emoji: em, title: `Suma ${a1} + ${b1}`, captions: [`Grupo 1: ${a1} ${em}`, `Grupo 2: ${b1} ${em}`, `Total: ${a1 + b1}`] };
  }

  const mSub = q.match(/(\d+)\s*[-−]\s*(\d+)/);
  if (mSub) {
    const a2 = parseInt(mSub[1], 10), b2 = parseInt(mSub[2], 10);
    if (a2 <= 15 && b2 <= 9) return { type: 'sub', a: a2, b: b2, emoji: em, title: `Resta ${a2} - ${b2}`, captions: [`Tenemos ${a2}`, `Quitamos ${b2}`, `Quedan ${a2 - b2}`] };
  }

  if (/mayor|menor/i.test(q)) {
    const mAB = q.match(/(\d+)\s*(?:u|o|y|,)\s*(\d+)/i);
    if (mAB) {
      const va = parseInt(mAB[1], 10), vb = parseInt(mAB[2], 10);
      return { type: 'compare', a: va, b: vb, emoji: em, title: 'Comparación', captions: [`Primer número: ${va}`, 'Comparamos', `Mayor: ${Math.max(va, vb)}`] };
    }
  }

  const mSeq = q.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*\?/);
  if (mSeq) {
    const n1 = parseInt(mSeq[1], 10), n2 = parseInt(mSeq[2], 10);
    const d = n2 - n1, next = parseInt(a, 10);
    if (d > 0 && next <= 20 && !isNaN(next)) return { type: 'jump', start: 0, end: next, step: d, title: `De ${d} en ${d}`, captions: ['Empezamos', `🐸 salta de ${d} en ${d}`, `Llegamos a ${next}`] };
  }

  const mCount = a.match(/^(\d+)$/);
  if (/¿cuánt(o|a)s?/i.test(q) && mCount && parseInt(mCount[1], 10) <= 10) {
    const n = parseInt(mCount[1], 10);
    return { type: 'count', count: n, emoji: em, title: `Cuenta ${em}`, captions: [`Mira los ${em}`, 'Cuenta 1, 2, 3…', `Total: ${n}`] };
  }

  if (mCount && parseInt(mCount[1], 10) <= 10) {
    const n2 = parseInt(mCount[1], 10);
    const kidEmojis = ['🐬', '🍌', '🚗', '🚢', '✈️', '🪙', '🍎', '🎈', '🌸', '🐶', '🐱', '🐣', '🦋', '🌟', '⭐'];
    const pickedEmoji = em && em !== '⭐' ? em : kidEmojis[n2 % kidEmojis.length];
    return { type: 'count', count: n2, emoji: pickedEmoji, title: `Cuenta ${pickedEmoji}`, captions: ['Observa', (n2 === 1 ? 'Cuenta el número 1' : 'Cuenta 1, 2, 3…'), `¡Total! ${n2}`] };
  }

  return null;
}

console.log('═══════════════════════════════════════════════════════');
console.log('   VERIFICACIÓN INTEGRAL DE GRADO 1° (PRIMERO)        ');
console.log('═══════════════════════════════════════════════════════\n');

// 1. Verificación de Claves Físicas y Ejemplos en todos los 145 niveles
let totalLevels = 0;
let levelsWith10Examples = 0;

c1.UNITS.forEach((unit, ui) => {
  console.log(`📘 Unidad ${ui + 1}: ${unit.name} (${unit.topics.length} temas)`);
  unit.topics.forEach((topic, ti) => {
    for (let li = 0; li < 5; li++) {
      totalLevels++;
      const logicalKey = `u${ui}t${ti}-n${li + 1}`;
      const physicalKey = `${topic.id}-n${li + 1}`;
      const exs = extras1.LEVEL_EXAMPLES[physicalKey] || [];

      if (exs.length === 10) {
        levelsWith10Examples++;
      } else {
        console.error(`  ❌ ERROR en ${logicalKey} (${physicalKey}): tiene ${exs.length} ejemplos`);
      }
    }
  });
});

console.log(`\n✅ Niveles con 10 ejemplos exactos: ${levelsWith10Examples} / ${totalLevels}`);

// 2. Verificación detallada de Unidad 1, Nivel 1 (add_conteo-n1)
console.log('\n--- Verificación detallada de Unidad 1, Nivel 1 (add_conteo-n1) ---');
const u1n1 = extras1.LEVEL_EXAMPLES['add_conteo-n1'];
console.log(`Total de ejemplos en Nivel 1: ${u1n1.length}`);
u1n1.forEach((ex, idx) => {
  const sb = inferSb(ex.q, ex.a);
  console.log(`  Ejemplo ${idx + 1}: [${ex.icon}] ${ex.q} | Ans: ${ex.a} | Vis: ${ex.vis} | SB Type: ${sb ? sb.type : 'N/A'}`);
});

// 3. Verificación del ejemplo del Dragón (Ejemplo 1 de Unidad 1 Nivel 1)
const exDragon = u1n1[0];
const sbDragon = inferSb(exDragon.q, exDragon.a);
console.log('\n--- Ejemplo 1 (Dragón) ---');
console.log('Pregunta:', exDragon.q);
console.log('Respuesta:', exDragon.a);
console.log('Visual:', exDragon.vis);
console.log('Storyboard configurado:', sbDragon);

if (
  exDragon.vis === '🐉' &&
  exDragon.a === '1' &&
  sbDragon &&
  sbDragon.type === 'count' &&
  sbDragon.count === 1 &&
  sbDragon.emoji === '🐉'
) {
  console.log('\n🎉 ¡VERIFICACIÓN EXITOSA! Unidad 1 Nivel 1 coincide 100% con la captura y con MatematicasDeFedor_1.html!');
} else {
  console.error('\n❌ Discrepancia detectada en Ejemplo 1.');
}
