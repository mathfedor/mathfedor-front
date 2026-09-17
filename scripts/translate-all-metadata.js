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

const TARGET_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

async function translateMetadataBatch(modules, targetLang) {
  const inputList = modules.map(m => ({
    id: m._id.toString(),
    title: m.title || '',
    description: m.description || '',
    group: m.group || ''
  }));

  const titleRule = {
    en: 'Translate "Grado 1°" to "Grade 1", "Grado 2°" to "Grade 2", "Grado 11 y Pre-Universitario" to "Grade 11 & Pre-College", etc.',
    pt: 'Translate "Grado 1°" to "1º Ano", "Grado 2°" to "2º Ano", "Grado 11 y Pre-Universitario" to "11º Ano e Pré-Vestibular", etc.',
    fr: 'Translate "Grado 1°" to "1re Année", "Grado 2°" to "2e Année", "Grado 11 y Pre-Universitario" to "11e Année & Pré-Universitaire", etc.',
    de: 'Translate "Grado 1°" to "1. Klasse", "Grado 2°" to "2. Klasse", "Grado 11 y Pre-Universitario" to "11. Klasse & Studienkolleg", etc.'
  }[targetLang.code] || `Translate grade titles naturally into ${targetLang.name}.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an educational translator. Translate school grade titles, descriptions, and groups to ${targetLang.name}.
CRITICAL RULE FOR TITLES:
${titleRule}
Return JSON matching:
{
  "translations": [
    { "id": string, "title": string, "description": string, "group": string }
  ]
}`
      },
      {
        role: 'user',
        content: JSON.stringify({ items: inputList })
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });

  const parsed = JSON.parse(res.choices[0]?.message?.content || '{}');
  return parsed.translations || [];
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const modules = await db.collection('learnings').find({}).toArray();
  console.log(`Found ${modules.length} modules to translate metadata.`);

  for (const lang of TARGET_LANGS) {
    console.log(`\nTranslating metadata for ${lang.name} (${lang.code})...`);
    const translations = await translateMetadataBatch(modules, lang);
    console.log(`Received ${translations.length} translations for ${lang.code}. Saving to MongoDB...`);

    for (const item of translations) {
      const oid = new mongoose.Types.ObjectId(item.id);
      await db.collection('learnings').updateOne(
        { _id: oid },
        {
          $set: {
            [`translations.${lang.code}.title`]: item.title,
            [`translations.${lang.code}.description`]: item.description,
            [`translations.${lang.code}.group`]: item.group,
            [`translations.${lang.code}.translatedAt`]: new Date()
          }
        }
      );
    }
    console.log(`✅ Saved ${lang.code} metadata successfully.`);
  }

  console.log('\n--- VERIFICATION ---');
  const sample = await db.collection('learnings').findOne({ slug: 'libro-1ro' });
  console.log('libro-1ro translations keys:', Object.keys(sample.translations || {}));
  console.log('Titles:', {
    es: sample.title,
    en: sample.translations?.en?.title,
    pt: sample.translations?.pt?.title,
    fr: sample.translations?.fr?.title,
    de: sample.translations?.de?.title
  });

  const sample2 = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-2' });
  console.log('\nmatematicas-fedor-2 titles:', {
    es: sample2.title,
    en: sample2.translations?.en?.title,
    pt: sample2.translations?.pt?.title,
    fr: sample2.translations?.fr?.title,
    de: sample2.translations?.de?.title
  });

  await mongoose.disconnect();
  console.log('\nDone translating all module metadata!');
}

run().catch(console.error);
