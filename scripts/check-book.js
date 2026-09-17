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
  console.log('Book title:', book.title);
  console.log('Units length:', book.bookCurriculum?.units?.length);
  if (book.bookCurriculum?.units) {
    book.bookCurriculum.units.forEach((u, i) => {
      console.log(`Unit ${i}: "${u.name}" (topics: ${u.topics?.length || 0})`);
    });
  }
  await mongoose.disconnect();
}
check().catch(console.error);
