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

async function translateTopicParallel(topic, targetLang = 'English') {
  const newTopic = JSON.parse(JSON.stringify(topic));

  // 1. Traducir metadatos del tema y niveles
  const topicMeta = {
    title: topic.title,
    desc: topic.desc || '',
    levels: (topic.levels || []).map(l => ({ label: l.label, short: l.short }))
  };

  const metaPromise = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Translate elementary math topic title and level labels to ${targetLang}. Return ONLY valid JSON matching input keys.` },
      { role: 'user', content: JSON.stringify(topicMeta) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });

  // 2. Traducir niveles en PARALELO
  const levelPromises = (newTopic.levels || []).map(async (lvl) => {
    if (!lvl.exercises || !lvl.exercises.length) return null;

    const exList = lvl.exercises.map((ex, idx) => ({
      idx,
      q: ex.q,
      hint: ex.hint || undefined,
      badge: ex.badge || undefined,
      opts: (ex.opts && ex.opts.some(o => /[a-záéíóú]/i.test(o))) ? ex.opts : undefined
    }));

    const exRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an elementary math educator. Translate math exercise questions ('q'), hints, badges, and text options ('opts') to ${targetLang}. Preserve numbers, formulas, variables, and emojis. Return ONLY valid JSON with { "exercises": [{ "idx": number, "q": string, "hint": string, "badge": string, "opts": string[] }] }.`
        },
        { role: 'user', content: JSON.stringify({ exercises: exList }) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    const parsed = JSON.parse(exRes.choices[0]?.message?.content || '{}');
    if (parsed.exercises && Array.isArray(parsed.exercises)) {
      parsed.exercises.forEach(p => {
        const ex = lvl.exercises[p.idx];
        if (ex) {
          if (p.q) ex.q = p.q;
          if (p.hint) ex.hint = p.hint;
          if (p.badge) ex.badge = p.badge;
          if (p.opts && Array.isArray(p.opts)) ex.opts = p.opts;
        }
      });
    }
  });

  const [metaRes] = await Promise.all([metaPromise, Promise.all(levelPromises)]);
  const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
  newTopic.title = translatedMeta.title || topic.title;
  newTopic.desc = translatedMeta.desc || topic.desc;
  if (translatedMeta.levels && newTopic.levels) {
    newTopic.levels.forEach((l, i) => {
      if (translatedMeta.levels[i]) {
        l.label = translatedMeta.levels[i].label || l.label;
        l.short = translatedMeta.levels[i].short || l.short;
      }
    });
  }

  return newTopic;
}

async function translateUnitParallel(unit, targetLang = 'English') {
  console.log(`Translating unit: "${unit.name}"...`);
  const newUnit = JSON.parse(JSON.stringify(unit));

  // Metadatos de la unidad
  const metaPromise = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Translate math unit title ('name'), short label ('short'), and standard ('std') to ${targetLang}. Return ONLY valid JSON matching input keys.` },
      { role: 'user', content: JSON.stringify({ name: unit.name, short: unit.short, std: unit.std }) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });

  const metaRes = await metaPromise;
  const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
  newUnit.name = translatedMeta.name || unit.name;
  newUnit.short = translatedMeta.short || unit.short;
  newUnit.std = translatedMeta.std || unit.std;

  // Traducir temas
  if (Array.isArray(unit.topics)) {
    newUnit.topics = [];
    for (let ti = 0; ti < unit.topics.length; ti++) {
      console.log(`  Topic ${ti + 1}/${unit.topics.length}: "${unit.topics[ti].title}"`);
      const t = await translateTopicParallel(unit.topics[ti], targetLang);
      newUnit.topics.push(t);
    }
  }

  return newUnit;
}

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const book = await db.collection('learnings').findOne({ slug: 'libro-1ro' });
  if (!book) {
    console.error('libro-1ro not found in DB!');
    return;
  }

  console.log('Starting parallel translation of libro-1ro to English...');
  const startTime = Date.now();
  const curriculum = book.bookCurriculum;
  const translatedUnits = [];

  for (let ui = 0; ui < curriculum.units.length; ui++) {
    const u = curriculum.units[ui];
    const translatedU = await translateUnitParallel(u, 'English');
    translatedUnits.push(translatedU);
  }

  // Traducir metadatos del módulo
  const metaRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Translate module title and description to English. Return valid JSON { "title": string, "description": string }.' },
      { role: 'user', content: JSON.stringify({ title: book.title, description: book.description }) }
    ],
    response_format: { type: 'json_object' }
  });
  const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');

  const enData = {
    title: translatedMeta.title || 'Grade 1',
    description: translatedMeta.description || book.description,
    group: 'Grade 1',
    bookCurriculum: {
      ...curriculum,
      units: translatedUnits
    },
    translatedAt: new Date()
  };

  // Guardar DIRECTAMENTE en MongoDB con $set nativo
  console.log('Writing to MongoDB using native updateOne...');
  const updateResult = await db.collection('learnings').updateOne(
    { _id: book._id },
    {
      $set: {
        'translations.en': enData
      }
    }
  );
  console.log('MongoDB Update Result:', updateResult);

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log(`✅ SUCCESS! Saved English translations for libro-1ro in MongoDB in ${durationSec}s!`);

  // Verificar lectura
  const verifyDoc = await db.collection('learnings').findOne(
    { _id: book._id },
    { projection: { 'translations.en.title': 1, 'translations.en.bookCurriculum.units.name': 1 } }
  );
  console.log('Verification check from MongoDB:', {
    enTitle: verifyDoc.translations?.en?.title,
    unitsCount: verifyDoc.translations?.en?.bookCurriculum?.units?.length,
    unit0Name: verifyDoc.translations?.en?.bookCurriculum?.units?.[0]?.name
  });

  await mongoose.disconnect();
}

run().catch(console.error);
