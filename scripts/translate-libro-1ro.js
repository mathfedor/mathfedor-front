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

async function translateTopic(topic, targetLang = 'English') {
  const newTopic = JSON.parse(JSON.stringify(topic));
  try {
    const topicMeta = {
      title: topic.title,
      desc: topic.desc || '',
      levels: (topic.levels || []).map(l => ({ label: l.label, short: l.short }))
    };

    const metaRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Translate elementary math topic title and level labels to ${targetLang}. Return ONLY valid JSON matching input keys.` },
        { role: 'user', content: JSON.stringify(topicMeta) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });
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

    for (let li = 0; li < (newTopic.levels || []).length; li++) {
      const lvl = newTopic.levels[li];
      if (!lvl.exercises || !lvl.exercises.length) continue;

      const exList = lvl.exercises.map((ex, idx) => ({
        idx,
        q: ex.q,
        hint: ex.hint || undefined,
        badge: ex.badge || undefined,
        opts: ex.opts && ex.opts.some(o => /[a-záéíóú]/i.test(o)) ? ex.opts : undefined
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
    }
  } catch (err) {
    console.error(`Error translating topic ${topic.title}:`, err.message);
  }
  return newTopic;
}

async function translateUnit(unit, targetLang = 'English') {
  console.log(`Translating unit: "${unit.name}"...`);
  const newUnit = JSON.parse(JSON.stringify(unit));
  try {
    const unitMeta = { name: unit.name, short: unit.short, std: unit.std };
    const metaRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Translate math unit title ('name'), short label ('short'), and standard ('std') to ${targetLang}. Return ONLY valid JSON matching input keys.` },
        { role: 'user', content: JSON.stringify(unitMeta) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });
    const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
    newUnit.name = translatedMeta.name || unit.name;
    newUnit.short = translatedMeta.short || unit.short;
    newUnit.std = translatedMeta.std || unit.std;

    if (Array.isArray(unit.topics)) {
      newUnit.topics = [];
      for (let ti = 0; ti < unit.topics.length; ti++) {
        console.log(`  Topic ${ti + 1}/${unit.topics.length}: "${unit.topics[ti].title}"`);
        const translatedTopic = await translateTopic(unit.topics[ti], targetLang);
        newUnit.topics.push(translatedTopic);
      }
    }
  } catch (err) {
    console.error(`Error translating unit ${unit.name}:`, err.message);
  }
  return newUnit;
}

async function run() {
  await mongoose.connect(uri);
  const Learning = mongoose.model('Learning', new mongoose.Schema({}, { strict: false }));
  const book = await Learning.findOne({ slug: 'libro-1ro' });
  if (!book) {
    console.error('libro-1ro not found!');
    return;
  }

  console.log('Starting translation of libro-1ro to English...');
  const curriculum = book.bookCurriculum;
  const translatedCurriculum = { ...curriculum, units: [] };

  for (let ui = 0; ui < curriculum.units.length; ui++) {
    const u = curriculum.units[ui];
    const translatedUnit = await translateUnit(u, 'English');
    translatedCurriculum.units.push(translatedUnit);
  }

  // Traducir metadatos de libro
  const metaRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Translate module title and description to English. Return valid JSON { "title": string, "description": string }.' },
      { role: 'user', content: JSON.stringify({ title: book.title, description: book.description }) }
    ],
    response_format: { type: 'json_object' }
  });
  const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');

  if (!book.translations) book.translations = {};
  book.translations.en = {
    title: translatedMeta.title || 'Grade 1',
    description: translatedMeta.description || book.description,
    group: 'Grade 1',
    bookCurriculum: translatedCurriculum,
    translatedAt: new Date()
  };

  book.markModified('translations');
  await book.save();
  console.log('✅ Successfully saved English translations for libro-1ro in MongoDB!');
  await mongoose.disconnect();
}

run().catch(console.error);
