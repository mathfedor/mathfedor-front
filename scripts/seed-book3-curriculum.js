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

  const dataPath = path.resolve(__dirname, '../src/mocks/data/book-curriculum-3.data.json');
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Loaded book-curriculum-3.data.json with ${rawData.UNITS?.length} units.`);

  // Buscar Grado 3 por group o por slug
  const g3 = await db.collection('learnings').findOne({
    $or: [{ slug: 'matematicas-fedor-3' }, { slug: 'libro-3ro' }, { group: 'Grado3' }]
  });

  if (!g3) {
    console.error('Grado 3 document not found in DB!');
    await mongoose.disconnect();
    return;
  }

  console.log('Found Grado 3 doc:', { id: g3._id, title: g3.title, slug: g3.slug, group: g3.group });

  const res = await db.collection('learnings').updateOne(
    { _id: g3._id },
    {
      $set: {
        slug: 'matematicas-fedor-3',
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

  console.log('MongoDB updateOne result for Grado 3:', res);

  const updated = await db.collection('learnings').findOne(
    { _id: g3._id },
    { projection: { slug: 1, title: 1, 'bookCurriculum.units.name': 1 } }
  );

  console.log('Updated Grado 3:', {
    title: updated.title,
    slug: updated.slug,
    unitsCount: updated.bookCurriculum?.units?.length,
    unit0Name: updated.bookCurriculum?.units?.[0]?.name
  });

  await mongoose.disconnect();
}

run().catch(console.error);
