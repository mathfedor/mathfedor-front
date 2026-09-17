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

  const slugs = ['libro-1ro', 'matematicas-fedor-2'];
  for (const slug of slugs) {
    const book = await db.collection('learnings').findOne({ slug });
    if (book && book.translations?.en) {
      await db.collection('book_translations').updateOne(
        { bookSlug: slug, locale: 'en' },
        {
          $set: {
            bookSlug: slug,
            locale: 'en',
            title: book.translations.en.title || book.title,
            description: book.translations.en.description || book.description,
            bookCurriculum: book.translations.en.bookCurriculum,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✅ Mirrored ${slug} EN to book_translations collection.`);
    }
  }

  const count = await db.collection('book_translations').countDocuments();
  console.log(`Total documents in book_translations: ${count}`);

  await mongoose.disconnect();
}

run().catch(console.error);
