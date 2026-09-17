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
  console.log(`Translating topic: "${topic.title}"...`);
  
  // 1. Extraer textos del tema y niveles
  const topicMeta = {
    title: topic.title,
    desc: topic.desc || '',
    levels: (topic.levels || []).map(l => ({ label: l.label, short: l.short }))
  };

  const metaRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Translate elementary math topic titles and level labels to ${targetLang}. Return ONLY valid JSON matching input keys.` },
      { role: 'user', content: JSON.stringify(topicMeta) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });
  const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');

  const newTopic = JSON.parse(JSON.stringify(topic));
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

  // 2. Traducir preguntas por cada nivel
  for (let li = 0; li < (newTopic.levels || []).length; li++) {
    const lvl = newTopic.levels[li];
    if (!lvl.exercises || !lvl.exercises.length) continue;

    // Filtrar solo los textos a traducir
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
          content: `You are an elementary math educator. Translate math exercise questions ('q'), hints, badges, and text options ('opts') to ${targetLang}. Preserve numbers, formulas, variables, and emojis. Return ONLY valid JSON with { exercises: [{ idx, q, hint, badge, opts }] }.`
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

  console.log(`Topic translated: "${topic.title}" -> "${newTopic.title}"`);
  return newTopic;
}

async function test() {
  await mongoose.connect(uri);
  const Learning = mongoose.model('Learning', new mongoose.Schema({}, { strict: false }));
  const book = await Learning.findOne({ slug: 'libro-1ro' });
  const t0 = book.bookCurriculum.units[0].topics[0];
  const translated = await translateTopic(t0, 'English');
  console.log('Original q:', t0.levels[0].exercises[0].q);
  console.log('Translated q:', translated.levels[0].exercises[0].q);
  await mongoose.disconnect();
}
test().catch(console.error);
