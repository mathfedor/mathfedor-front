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
  const doc = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-2' });
  const str = JSON.stringify(doc);
  console.log('Total document size in JSON:', (str.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('bookCurriculum size:', (JSON.stringify(doc.bookCurriculum || {}).length / 1024 / 1024).toFixed(2), 'MB');
  if (doc.translations) {
    Object.keys(doc.translations).forEach(k => {
      console.log(`translations.${k} size:`, (JSON.stringify(doc.translations[k]).length / 1024 / 1024).toFixed(2), 'MB');
    });
  }
  await mongoose.disconnect();
}
run().catch(console.error);
