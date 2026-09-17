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
  const t0 = book.bookCurriculum.units[0].topics[0];
  const l0 = t0.levels[0];
  console.log('Level 0 keys:', Object.keys(l0));
  console.log('Exercises count in level 0:', l0.exercises?.length);
  if (l0.exercises?.length) {
    console.log('Sample exercise:', JSON.stringify(l0.exercises[0], null, 2));
  }
  await mongoose.disconnect();
}
check().catch(console.error);
