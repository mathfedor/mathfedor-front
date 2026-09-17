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

  await db.collection('learnings').updateOne(
    { slug: 'matematicas-fedor-2' },
    { $unset: { 'translations.en.bookCurriculum': '' } }
  );

  const doc = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-2' });
  const str = JSON.stringify(doc);
  console.log('Cleaned up book 2 doc size:', (str.length / 1024 / 1024).toFixed(2), 'MB');
  await mongoose.disconnect();
}

run().catch(console.error);
