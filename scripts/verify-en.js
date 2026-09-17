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

async function verify() {
  await mongoose.connect(uri);
  const Learning = mongoose.model('Learning', new mongoose.Schema({}, { strict: false }));
  const book = await Learning.findOne({ slug: 'libro-1ro' });
  console.log('Book title:', book.title);
  console.log('Translations in MongoDB:', Object.keys(book.translations || {}));
  const enCurriculum = book.translations?.en?.bookCurriculum;
  console.log('EN Units length:', enCurriculum?.units?.length);
  if (enCurriculum?.units) {
    enCurriculum.units.forEach((u, i) => {
      console.log(`Unit ${i}: "${u.name}"`);
      const sampleQ = u.topics?.[0]?.levels?.[0]?.exercises?.[0]?.q;
      console.log(`  Sample Q: "${sampleQ}"`);
    });
  }
  await mongoose.disconnect();
}
verify().catch(console.error);
