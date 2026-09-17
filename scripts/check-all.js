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
  const books = await Learning.find({
    status: 'active'
  }, { title: 1, slug: 1, group: 1, translations: 1 });
  console.log('Active modules count:', books.length);
  books.forEach(b => {
    console.log(`Title: "${b.title}", slug: "${b.slug}", group: "${b.group}", translations: ${Object.keys(b.translations || {}).join(',') || 'none'}`);
  });
  await mongoose.disconnect();
}
check().catch(console.error);
