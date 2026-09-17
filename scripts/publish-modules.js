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

  const res = await db.collection('learnings').updateMany(
    {
      $or: [
        { slug: { $in: ['libro-1ro', 'matematicas-fedor-2', 'matematicas-fedor-3', 'libro-2do', 'libro-3ro'] } },
        { group: { $in: ['Grado1', 'Grado2', 'Grado3', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade1', 'Grade2', 'Grade3'] } }
      ]
    },
    {
      $set: {
        published: true,
        status: 'active'
      }
    }
  );

  console.log('MongoDB updateMany published result:', res);

  const modules = await db.collection('learnings').find(
    { slug: { $in: ['libro-1ro', 'matematicas-fedor-2', 'matematicas-fedor-3'] } },
    { projection: { slug: 1, title: 1, published: 1, status: 1 } }
  ).toArray();

  console.log('Verified modules:');
  modules.forEach(m => console.log(` • ${m.slug} (${m.title}): published = ${m.published}, status = ${m.status}`));

  await mongoose.disconnect();
}

run().catch(console.error);
