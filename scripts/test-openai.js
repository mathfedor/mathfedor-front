const mongoose = require('../../mathfedor-back/node_modules/mongoose');
const fs = require('fs');
const path = require('path');
const OpenAI = require('../../mathfedor-back/node_modules/openai');

const envPath = path.resolve(__dirname, '../../mathfedor-back/.env');
const env = fs.readFileSync(envPath, 'utf8');
let uri = '';
let openaiKey = '';
env.split(/\r?\n/).forEach(line => {
  if (line.startsWith('MONGODB_URI=') || line.startsWith('MONGO_URI=')) {
    uri = line.substring(line.indexOf('=') + 1).trim();
  }
  if (line.startsWith('OPENAI_API_KEY=')) {
    openaiKey = line.substring(line.indexOf('=') + 1).trim();
  }
});

console.log('OpenAI Key exists:', !!openaiKey);

async function test() {
  const openai = new OpenAI({ apiKey: openaiKey });
  console.log('Testing OpenAI connection...');
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Translate this JSON to English. Return ONLY valid JSON.' },
      { role: 'user', content: JSON.stringify({ name: 'Unidad 1 — Adición y Números' }) }
    ],
    response_format: { type: 'json_object' }
  });
  console.log('OpenAI response:', res.choices[0]?.message?.content);
}
test().catch(console.error);
