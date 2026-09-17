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

  const b1 = await db.collection('learnings').findOne({ slug: 'libro-1ro' });
  const b2 = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-2' });
  const b3 = await db.collection('learnings').findOne({ slug: 'matematicas-fedor-3' });

  console.log('Book 1:', { id: b1?._id, slug: b1?.slug, group: b1?.group, title: b1?.title, published: b1?.published, status: b1?.status });
  console.log('Book 2:', { id: b2?._id, slug: b2?.slug, group: b2?.group, title: b2?.title, published: b2?.published, status: b2?.status });
  console.log('Book 3:', { id: b3?._id, slug: b3?.slug, group: b3?.group, title: b3?.title, published: b3?.published, status: b3?.status });

  await mongoose.disconnect();
}

run().catch(console.error);
