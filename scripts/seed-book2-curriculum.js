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

  const dataPath = path.resolve(__dirname, '../src/mocks/data/book-curriculum.data.json');
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Loaded book-curriculum.data.json with ${rawData.UNITS?.length} units.`);

  const res = await db.collection('learnings').updateOne(
    { slug: 'matematicas-fedor-2' },
    {
      $set: {
        bookCurriculum: {
          units: rawData.UNITS,
          avatarUnlocks: rawData.AVATAR_UNLOCKS,
          badges: rawData.ALL_BADGES,
          ranks: rawData.RANKS,
          shopItems: rawData.SHOP_ITEMS
        }
      }
    }
  );

  console.log('MongoDB updateOne result:', res);

  const updated = await db.collection('learnings').findOne(
    { slug: 'matematicas-fedor-2' },
    { projection: { slug: 1, title: 1, 'bookCurriculum.units.name': 1 } }
  );

  console.log('Updated book 2:', {
    title: updated.title,
    slug: updated.slug,
    units: updated.bookCurriculum?.units?.map((u, i) => `Unit ${i}: ${u.name}`)
  });

  await mongoose.disconnect();
}

run().catch(console.error);
