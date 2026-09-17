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

  console.log('=== TRADUCCIONES EN book_translations ===');
  const list = await db.collection('book_translations').find({}, {
    projection: { bookSlug: 1, locale: 1, 'bookCurriculum.units.name': 1 }
  }).toArray();

  console.log(`Total libros/idiomas en book_translations: ${list.length}`);
  list.forEach(item => {
    const uCount = item.bookCurriculum?.units?.length || 0;
    const u0 = item.bookCurriculum?.units?.[0]?.name || 'N/A';
    console.log(` • ${item.bookSlug} [${item.locale}]: ${uCount} unidades | Unidad 0: "${u0}"`);
  });

  console.log('\n=== TRADUCCIONES EN learnings.translations ===');
  const books = await db.collection('learnings').find(
    { slug: { $in: ['libro-1ro', 'matematicas-fedor-2', 'matematicas-fedor-3'] } },
    { projection: { slug: 1, title: 1, translations: 1 } }
  ).toArray();

  books.forEach(b => {
    const langs = Object.keys(b.translations || {});
    console.log(` • ${b.slug} (${b.title}): idiomas con metadatos = [${langs.join(', ')}]`);
  });

  await mongoose.disconnect();
}

run().catch(console.error);
