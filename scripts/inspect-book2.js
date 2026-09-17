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
  const book2 = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-2' });
  if (!book2) {
    console.log('Book 2 not found by slug matematicas-fedor-2');
    const all = await db.collection('learnings').find({}, { projection: { slug: 1, title: 1 } }).toArray();
    console.log('All books in DB:', all);
    await mongoose.disconnect();
    return;
  }

  console.log('Book 2 Found:', {
    id: book2._id,
    title: book2.title,
    slug: book2.slug,
    group: book2.group,
    hasCurriculum: !!book2.bookCurriculum,
    unitsCount: book2.bookCurriculum?.units?.length,
    translations: Object.keys(book2.translations || {})
  });

  if (book2.bookCurriculum?.units) {
    book2.bookCurriculum.units.forEach((u, i) => {
      console.log(`  Unit ${i}: "${u.name}" (topics: ${u.topics?.length || 0})`);
    });
  }

  await mongoose.disconnect();
}

run().catch(console.error);
