const mongoose = require('../../mathfedor-back/node_modules/mongoose');
const fs = require('fs');
const path = require('path');
const OpenAI = require('../../mathfedor-back/node_modules/openai');

const envPath = path.resolve(__dirname, '../../mathfedor-back/.env');
const env = fs.readFileSync(envPath, 'utf8');
let uri = '';
let openaiKey = '';
env.split(/\r?\n/).forEach(line => {
  if (line.startsWith('MONGODB_URI=') || line.startsWith('MONGO_URI=')) {
    uri = line.substring(line.indexOf('=') + 1).trim();
  }
  if (line.startsWith('OPENAI_API_KEY=')) {
    openaiKey = line.substring(line.indexOf('=') + 1).trim();
  }
});

const openai = new OpenAI({ apiKey: openaiKey });

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function translateExpTemplate(exp, langCode) {
  if (!exp || typeof exp !== 'string') return exp;

  const dictionary = {
    en: [
      [/📖 Instrucciones:/gi, '📖 Instructions:'],
      [/📖 Pregunta:/gi, '📖 Question:'],
      [/🧮 Procedimiento:/gi, '🧮 Procedure:'],
      [/✅ Por tanto, el resultado es:/gi, '✅ Therefore, the result is:'],
      [/¡Excelente!/gi, 'Excellent!'],
      [/Suma:/gi, 'Add:'],
      [/Resta:/gi, 'Subtract:'],
      [/Multiplica:/gi, 'Multiply:'],
      [/Divide:/gi, 'Divide:']
    ],
    pt: [
      [/📖 Instrucciones:/gi, '📖 Instruções:'],
      [/📖 Pregunta:/gi, '📖 Pergunta:'],
      [/🧮 Procedimiento:/gi, '🧮 Procedimento:'],
      [/✅ Por tanto, el resultado es:/gi, '✅ Portanto, o resultado é:'],
      [/¡Excelente!/gi, 'Excelente!'],
      [/Suma:/gi, 'Some:'],
      [/Resta:/gi, 'Subtraia:'],
      [/Multiplica:/gi, 'Multiplique:'],
      [/Divide:/gi, 'Divida:']
    ],
    fr: [
      [/📖 Instrucciones:/gi, '📖 Instructions :'],
      [/📖 Pregunta:/gi, '📖 Question :'],
      [/🧮 Procedimiento:/gi, '🧮 Procédure :'],
      [/✅ Por tanto, el resultado es:/gi, '✅ Par conséquent, le résultat est :'],
      [/¡Excelente!/gi, 'Excellent !'],
      [/Suma:/gi, 'Additionnez :'],
      [/Resta:/gi, 'Soustrayez :'],
      [/Multiplica:/gi, 'Multipliez :'],
      [/Divide:/gi, 'Divisez :']
    ],
    de: [
      [/📖 Instrucciones:/gi, '📖 Anweisungen:'],
      [/📖 Pregunta:/gi, '📖 Frage:'],
      [/🧮 Procedimiento:/gi, '🧮 Vorgehensweise:'],
      [/✅ Por tanto, el resultado es:/gi, '✅ Daher ist das Ergebnis:'],
      [/¡Excelente!/gi, 'Ausgezeichnet!'],
      [/Suma:/gi, 'Addiere:'],
      [/Resta:/gi, 'Subtrahiere:'],
      [/Multiplica:/gi, 'Multipliziere:'],
      [/Divide:/gi, 'Dividiere:']
    ]
  };

  const rules = dictionary[langCode] || dictionary.en;
  let translated = exp;
  for (const [regex, replacement] of rules) {
    translated = translated.replace(regex, replacement);
  }
  return translated;
}

async function translateExerciseChunk(chunk, targetLang) {
  if (!chunk.length) return [];
  try {
    const exRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an elementary math educator. Translate math questions ('q'), hints, badges, contexts ('ctx'), and text options ('opts') to ${targetLang}.
Preserve numbers, formulas, variables, and emojis.
Return ONLY valid JSON:
{
  "exercises": [
    { "idx": number, "q": string, "hint": string, "badge": string, "ctx": string, "opts": string[] }
  ]
}`
        },
        { role: 'user', content: JSON.stringify({ exercises: chunk }) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    const parsed = JSON.parse(exRes.choices[0]?.message?.content || '{}');
    return parsed.exercises || [];
  } catch (err) {
    console.warn(`    ⚠️ Warning translating exercise chunk: ${err.message}.`);
    return [];
  }
}

async function translateTopicParallel(topic, targetLang = 'English', langCode = 'en') {
  // 1. Traducir metadatos del tema y niveles
  const topicMeta = {
    title: topic.title,
    desc: topic.desc || '',
    levels: (topic.levels || []).map(l => ({ label: l.label, short: l.short }))
  };

  const metaPromise = (async () => {
    try {
      const metaRes = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Translate elementary math topic title and level labels to ${targetLang}. Return ONLY valid JSON matching input keys.` },
          { role: 'user', content: JSON.stringify(topicMeta) }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      });
      return JSON.parse(metaRes.choices[0]?.message?.content || '{}');
    } catch (e) {
      console.warn(`  ⚠️ Warning in topic meta: ${e.message}`);
      return {};
    }
  })();

  // 2. Traducir niveles en PARALELO con chunking de ejercicios (máx 15 por llamada ya que no enviamos HTML exp)
  const levelPromises = (topic.levels || []).map(async (lvl) => {
    if (!lvl.exercises || !lvl.exercises.length) return [];

    const exList = lvl.exercises.map((ex, idx) => ({
      idx,
      q: ex.q,
      hint: ex.hint || undefined,
      badge: ex.badge || undefined,
      ctx: ex.ctx || undefined,
      opts: (ex.opts && ex.opts.some(o => /[a-záéíóúñ]/i.test(o))) ? ex.opts : undefined
    }));

    const chunks = chunkArray(exList, 15);
    const chunkPromises = chunks.map(chunk => translateExerciseChunk(chunk, targetLang));
    const chunkResults = await Promise.all(chunkPromises);
    const translationMap = new Map();
    chunkResults.flat().forEach(p => translationMap.set(p.idx, p));

    // Generar array limpio de ejercicios traducidos (overlay)
    return lvl.exercises.map((ex, idx) => {
      const tr = translationMap.get(idx);
      const cleanEx = {};
      if (tr && tr.q) cleanEx.q = tr.q;
      if (tr && tr.hint) cleanEx.hint = tr.hint;
      if (tr && tr.badge) cleanEx.badge = tr.badge;
      if (tr && tr.ctx) cleanEx.ctx = tr.ctx;
      if (tr && tr.opts) cleanEx.opts = tr.opts;
      if (ex.exp || ex.explain) {
        cleanEx.exp = translateExpTemplate(ex.exp || ex.explain, langCode);
      }
      return cleanEx;
    });
  });

  const [translatedMeta, translatedLevels] = await Promise.all([metaPromise, Promise.all(levelPromises)]);

  return {
    id: topic.id,
    title: translatedMeta.title || topic.title,
    desc: translatedMeta.desc || topic.desc,
    levels: (topic.levels || []).map((lvl, li) => ({
      label: translatedMeta.levels?.[li]?.label || lvl.label,
      short: translatedMeta.levels?.[li]?.short || lvl.short,
      exercises: translatedLevels[li] || []
    }))
  };
}

async function translateUnitParallel(unit, targetLang = 'English', langCode = 'en') {
  console.log(`Translating unit: "${unit.name}"...`);

  let meta = { name: unit.name, short: unit.short, std: unit.std };
  try {
    const metaRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Translate math unit title ('name'), short label ('short'), and standard ('std') to ${targetLang}. Return ONLY valid JSON matching input keys.` },
        { role: 'user', content: JSON.stringify({ name: unit.name, short: unit.short, std: unit.std }) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });
    meta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
  } catch (e) {
    console.warn(`⚠️ Warning translating unit metadata: ${e.message}`);
  }

  // Traducir temas en paralelo de 2 en 2 o secuencial
  const cleanTopics = [];
  if (Array.isArray(unit.topics)) {
    for (let ti = 0; ti < unit.topics.length; ti++) {
      console.log(`  Topic ${ti + 1}/${unit.topics.length}: "${unit.topics[ti].title}"`);
      const t = await translateTopicParallel(unit.topics[ti], targetLang, langCode);
      cleanTopics.push(t);
    }
  }

  return {
    id: unit.id,
    name: meta.name || unit.name,
    short: meta.short || unit.short,
    std: meta.std || unit.std,
    topics: cleanTopics
  };
}

async function main() {
  const slug = process.argv[2] || 'matematicas-fedor-2';
  const langCode = (process.argv[3] || 'en').toLowerCase();
  const langNames = {
    en: 'English',
    pt: 'Portuguese',
    fr: 'French',
    de: 'German'
  };
  const targetLang = langNames[langCode] || 'English';

  console.log(`=== Translating book "${slug}" to ${targetLang} (${langCode}) [OPTIMIZED OVERLAY MODE] ===`);

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const book = await db.collection('learnings').findOne({ slug });

  if (!book || !book.bookCurriculum || !book.bookCurriculum.units) {
    console.error(`Book "${slug}" or its curriculum not found in DB!`);
    await mongoose.disconnect();
    return;
  }

  const startTime = Date.now();
  const curriculum = book.bookCurriculum;
  const totalUnits = curriculum.units.length;

  const btDoc = await db.collection('book_translations').findOne({ bookSlug: slug, locale: langCode });
  const existingUnits = book.translations?.[langCode]?.bookCurriculum?.units
    || btDoc?.bookCurriculum?.units
    || [];
  let translatedUnits = Array.isArray(existingUnits) && existingUnits.length === totalUnits
    ? existingUnits
    : new Array(totalUnits).fill(null);

  for (let ui = 0; ui < totalUnits; ui++) {
    const rawUnit = curriculum.units[ui];
    const alreadyDone = translatedUnits[ui] && translatedUnits[ui].name && translatedUnits[ui].name !== rawUnit.name;

    if (alreadyDone) {
      console.log(`⏭️  Unit ${ui + 1}/${totalUnits} ("${translatedUnits[ui].name}") already translated. Skipping!`);
      continue;
    }

    console.log(`\n▶️  Processing Unit ${ui + 1}/${totalUnits}: "${rawUnit.name}"...`);
    const translatedU = await translateUnitParallel(rawUnit, targetLang, langCode);
    translatedUnits[ui] = translatedU;

    console.log(`💾 Saving Unit ${ui + 1} to MongoDB...`);
    // 1. Guardar en colección book_translations (sin restricción de tamaño por idioma)
    await db.collection('book_translations').updateOne(
      { bookSlug: slug, locale: langCode },
      {
        $set: {
          bookSlug: slug,
          locale: langCode,
          title: book.translations?.[langCode]?.title || book.title,
          description: book.translations?.[langCode]?.description || book.description,
          [`bookCurriculum.units.${ui}`]: translatedU,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 2. Intentar guardar en learnings (si cabe en BSON)
    try {
      await db.collection('learnings').updateOne(
        { _id: book._id },
        {
          $set: {
            [`translations.${langCode}.bookCurriculum.units.${ui}`]: translatedU,
            [`translations.${langCode}.translatedAt`]: new Date()
          }
        }
      );
    } catch (e) {
      // Documento learnings saturado en BSON, book_translations lo sirve
    }
    console.log(`✅ Unit ${ui + 1} saved successfully in MongoDB.`);
  }

  console.log('\nFinalizing book translation in MongoDB...');
  await db.collection('book_translations').updateOne(
    { bookSlug: slug, locale: langCode },
    {
      $set: {
        bookSlug: slug,
        locale: langCode,
        title: book.translations?.[langCode]?.title || book.title,
        description: book.translations?.[langCode]?.description || book.description,
        'bookCurriculum.units': translatedUnits,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  try {
    await db.collection('learnings').updateOne(
      { _id: book._id },
      {
        $set: {
          [`translations.${langCode}.title`]: book.translations?.[langCode]?.title || book.title,
          [`translations.${langCode}.description`]: book.translations?.[langCode]?.description || book.description,
          [`translations.${langCode}.group`]: book.translations?.[langCode]?.group || book.group,
          [`translations.${langCode}.bookCurriculum.units`]: translatedUnits,
          [`translations.${langCode}.translatedAt`]: new Date()
        }
      }
    );
  } catch (e) {
    // Si learnings excede 16MB con todos los idiomas, guardamos al menos el título y descripción
    await db.collection('learnings').updateOne(
      { _id: book._id },
      {
        $set: {
          [`translations.${langCode}.title`]: book.translations?.[langCode]?.title || book.title,
          [`translations.${langCode}.description`]: book.translations?.[langCode]?.description || book.description,
          [`translations.${langCode}.group`]: book.translations?.[langCode]?.group || book.group,
          [`translations.${langCode}.translatedAt`]: new Date()
        }
      }
    );
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 COMPLETED: "${slug}" translated to ${targetLang} (${langCode}) in ${durationSec}s!`);

  const savedTrans = await db.collection('book_translations').findOne({ bookSlug: slug, locale: langCode });
  console.log('MongoDB Verification (book_translations):', {
    bookSlug: savedTrans?.bookSlug,
    locale: savedTrans?.locale,
    title: savedTrans?.title,
    unitsCount: savedTrans?.bookCurriculum?.units?.length,
    unit0Name: savedTrans?.bookCurriculum?.units?.[0]?.name,
    unit0Q0: savedTrans?.bookCurriculum?.units?.[0]?.topics?.[0]?.levels?.[0]?.exercises?.[0]?.q
  });

  await mongoose.disconnect();
}

main().catch(console.error);
