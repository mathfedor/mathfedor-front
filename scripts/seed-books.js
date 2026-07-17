#!/usr/bin/env node
/**
 * Script de seed: sube el currículo de los libros al backend.
 *
 * Uso:
 *   node seed-books.js <slug> [--grade1]
 *
 * Ejemplos:
 *   node seed-books.js matematicas-fedor-2
 *   node seed-books.js libro-1ro --grade1
 *
 * Requiere:
 *   - El servidor backend corriendo (npm run start:dev)
 *   - Variable de entorno SEED_TOKEN=<JWT de admin>
 *     o pasar como segundo arg: node seed-books.js <slug> --token=xxx
 *
 * Los archivos JSON se leen desde src/mocks/data/ del frontend.
 */

const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
const TOKEN = process.env.SEED_TOKEN || (() => {
  const tokenArg = process.argv.find(a => a.startsWith('--token='));
  return tokenArg ? tokenArg.split('=')[1] : null;
})();

const isGrade1 = process.argv.includes('--grade1');
const slug = process.argv[2] || (isGrade1 ? 'libro-1ro' : 'matematicas-fedor-2');

// Rutas a los archivos de datos del frontend
const FRONT_DATA = path.join(__dirname, '..', 'src', 'mocks', 'data');

const CURRICULUM_FILE = isGrade1
  ? path.join(FRONT_DATA, 'book-curriculum-1.data.json')
  : path.join(FRONT_DATA, 'book-curriculum.data.json');

const EXTRAS_FILE = isGrade1
  ? path.join(FRONT_DATA, 'book-extras-1.data.json')
  : path.join(FRONT_DATA, 'book-extras.data.json');

const LORE_FILE = path.join(FRONT_DATA, 'book-lore.data.json');
const TUTS_FILE = path.join(FRONT_DATA, 'book-unit-tuts.data.json');

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[seed] Archivo no encontrado, omitiendo: ${filePath}`);
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function sizeKB(obj) {
  return (Buffer.byteLength(JSON.stringify(obj), 'utf8') / 1024).toFixed(1);
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  if (!TOKEN) {
    console.error('[seed] ERROR: Se requiere un token de admin.');
    console.error('       Pásalo como: SEED_TOKEN=xxx node seed-books.js <slug>');
    console.error('       o como:      node seed-books.js <slug> --token=xxx');
    process.exit(1);
  }

  console.log(`[seed] ========================================`);
  console.log(`[seed] Libro: ${slug} | Grade1: ${isGrade1}`);
  console.log(`[seed] Backend: ${BACKEND_URL}`);
  console.log(`[seed] ========================================`);

  // 1. Leer currículo (unidades + ejercicios)
  console.log('[seed] Leyendo currículo...');
  const curriculumData = readJson(CURRICULUM_FILE);
  if (!curriculumData) {
    console.error('[seed] FATAL: No se pudo leer el archivo de currículo.');
    process.exit(1);
  }
  const units = curriculumData.UNITS || [];
  console.log(`[seed] → ${units.length} unidades cargadas`);

  // 2. Leer ejemplos didácticos (LEVEL_EXAMPLES)
  console.log('[seed] Leyendo ejemplos...');
  const extrasData = readJson(EXTRAS_FILE);
  const levelExamples = extrasData?.LEVEL_EXAMPLES || {};
  const exampleKeys = Object.keys(levelExamples).length;
  console.log(`[seed] → ${exampleKeys} claves de ejemplos cargadas`);

  // 3. Leer tutoriales de unidad
  console.log('[seed] Leyendo tutoriales...');
  const tutsData = readJson(TUTS_FILE);
  const unitTutorials = tutsData?.UNIT_TUTS || [];
  console.log(`[seed] → ${unitTutorials.length} tutoriales`);

  // 4. Leer lore (capítulos narrativos)
  console.log('[seed] Leyendo lore...');
  const loreData = readJson(LORE_FILE);
  const loreChapters = loreData?.LORE_CHAPTERS || [];
  console.log(`[seed] → ${loreChapters.length} capítulos narrativos`);

  // 5. Catálogo de gamificación (tomado del curriculum si existe, o vacío)
  const gamificationCatalog = {
    avatars: curriculumData.AVATAR_UNLOCKS || [],
    badges: curriculumData.ALL_BADGES || [],
    ranks: curriculumData.RANKS || [],
    shopItems: curriculumData.SHOP_ITEMS || [],
  };
  console.log(`[seed] → Gamificación: ${gamificationCatalog.avatars.length} avatares, ${gamificationCatalog.badges.length} badges`);

  // 6. Armar payload
  const payload = {
    units,
    levelExamples,
    unitTutorials,
    loreChapters,
    gamificationCatalog,
  };

  const payloadSizeKB = sizeKB(payload);
  const payloadSizeMB = (parseFloat(payloadSizeKB) / 1024).toFixed(2);
  console.log(`[seed] Tamaño del payload: ${payloadSizeKB} KB (${payloadSizeMB} MB)`);

  if (parseFloat(payloadSizeMB) > 14) {
    console.warn('[seed] ADVERTENCIA: El payload supera 14 MB. Puede acercarse al límite de MongoDB (16 MB).');
    console.warn('[seed] Considera separar levelExamples en una colección aparte.');
  }

  // 7. Enviar al backend
  const url = `${BACKEND_URL}/learning/books/${slug}/curriculum`;
  console.log(`[seed] Enviando a: POST ${url}`);
  console.log('[seed] Esto puede tardar varios segundos...');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[seed] ERROR HTTP ${response.status}: ${errText}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log(`[seed] ✅ Currículo subido correctamente.`);
  console.log(`[seed] → _id: ${result._id || result.id}`);
  console.log(`[seed] → slug: ${result.slug}`);
  console.log(`[seed] → bookCurriculum.units: ${result.bookCurriculum?.units?.length ?? '?'} unidades`);
  console.log('[seed] ========================================');
  console.log('[seed] DONE. El backend ahora sirve el currículo desde MongoDB.');
}

main().catch(err => {
  console.error('[seed] Error inesperado:', err);
  process.exit(1);
});
