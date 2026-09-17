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

async function nativeCheck() {
  await mongoose.connect(uri);
  const raw = await mongoose.connection.db.collection('learnings').findOne(
    { slug: 'libro-1ro' },
    { projection: { title: 1, slug: 1, translations: 1 } }
  );
  console.log('Raw MongoDB doc:', JSON.stringify(raw, null, 2));
  await mongoose.disconnect();
}
nativeCheck().catch(console.error);
