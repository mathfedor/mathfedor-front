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

async function check() {
  await mongoose.connect(uri);
  const Learning = mongoose.model('Learning', new mongoose.Schema({}, { strict: false }));
  const book = await Learning.findOne({ slug: 'libro-1ro' });
  const u0 = book.bookCurriculum.units[0];
  console.log('Unit 0 keys:', Object.keys(u0));
  console.log('Topics count:', u0.topics?.length);
  u0.topics?.forEach((t, i) => {
    const tStr = JSON.stringify(t);
    console.log(`  Topic ${i} (${t.title}): ${tStr.length} chars, levels: ${t.levels?.length || 0}`);
  });
  await mongoose.disconnect();
}
check().catch(console.error);
