const mongoose = require('../../mathfedor-back/node_modules/mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../mathfedor-back/.env');
const env = fs.readFileSync(envPath, 'utf8');
let uri = '';
env.split(/\r?\n/).forEach(line => {
  if (line.startsWith('MONGODB_URI=') || line.startsWith('MONGO_URI=')) {
    uri = line.substring(line.indexOf('=') + 1).trim();
  }
});

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const testCases = [
    { slug: 'libro-1ro', locale: 'en' },
    { slug: 'libro-1ro', locale: 'de' },
    { slug: 'matematicas-fedor-2', locale: 'pt' },
    { slug: 'matematicas-fedor-2', locale: 'fr' },
    { slug: 'matematicas-fedor-3', locale: 'en' },
    { slug: 'matematicas-fedor-3', locale: 'de' },
  ];

  console.log('=== TEST DE DISPONIBILIDAD INMEDIATA EN MONGODB ===');
  for (const tc of testCases) {
    // 1. Buscar en book_translations o en learnings
    const trans = await db.collection('book_translations').findOne({
      bookSlug: tc.slug,
      locale: tc.locale
    });

    const u0 = trans?.bookCurriculum?.units?.[0]?.name;
    const q0 = trans?.bookCurriculum?.units?.[0]?.topics?.[0]?.levels?.[0]?.exercises?.[0]?.q;

    console.log(`✅ [${tc.slug} | ${tc.locale}] -> "${u0}" | Pregunta 1: "${q0}"`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
