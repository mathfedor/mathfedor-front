const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'translate-book-resilient.js');

// Lista de traducciones de libros para Paso 3
// Puedes pasar filtros por argumentos, ej: node scripts/batch-translate-all-languages.js libro-1ro
const filterSlug = process.argv[2];
const filterLang = process.argv[3];

const ALL_JOBS = [
  // Grado 1° en otros idiomas
  { slug: 'libro-1ro', lang: 'pt', name: 'Português' },
  { slug: 'libro-1ro', lang: 'fr', name: 'Français' },
  { slug: 'libro-1ro', lang: 'de', name: 'Deutsch' },

  // Grado 2° en otros idiomas
  { slug: 'matematicas-fedor-2', lang: 'pt', name: 'Português' },
  { slug: 'matematicas-fedor-2', lang: 'fr', name: 'Français' },
  { slug: 'matematicas-fedor-2', lang: 'de', name: 'Deutsch' },

  // Grado 3° en inglés y otros idiomas
  { slug: 'matematicas-fedor-3', lang: 'en', name: 'English' },
  { slug: 'matematicas-fedor-3', lang: 'pt', name: 'Português' },
  { slug: 'matematicas-fedor-3', lang: 'fr', name: 'Français' },
  { slug: 'matematicas-fedor-3', lang: 'de', name: 'Deutsch' },
];

const jobsToRun = ALL_JOBS.filter(job => {
  if (filterSlug && job.slug !== filterSlug) return false;
  if (filterLang && job.lang !== filterLang) return false;
  return true;
});

console.log(`=== Inicia procesamiento por lotes de ${jobsToRun.length} libros/idiomas ===`);

function runJob(job) {
  return new Promise((resolve, reject) => {
    console.log(`\n======================================================`);
    console.log(`🚀 Iniciando: Libro "${job.slug}" a ${job.name} (${job.lang})`);
    console.log(`======================================================`);

    const proc = spawn('node', [scriptPath, job.slug, job.lang], {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', code => {
      if (code === 0) {
        console.log(`✅ Completado: "${job.slug}" a ${job.lang}`);
        resolve();
      } else {
        console.error(`❌ Error en job "${job.slug}" a ${job.lang} con código ${code}`);
        // Continuamos con el siguiente job para no detener la cola
        resolve();
      }
    });

    proc.on('error', err => {
      console.error(`❌ Error lanzando proceso:`, err);
      resolve();
    });
  });
}

async function runAll() {
  const startAll = Date.now();
  for (let i = 0; i < jobsToRun.length; i++) {
    const job = jobsToRun[i];
    console.log(`\n[${i + 1}/${jobsToRun.length}] En cola: ${job.slug} -> ${job.lang}`);
    await runJob(job);
  }

  const totalMin = Math.round((Date.now() - startAll) / 60000);
  console.log(`\n🎉🎉 ¡TODAS LAS TRADUCCIONES POR LOTE FINALIZARON en ${totalMin} min! 🎉🎉`);
}

runAll().catch(console.error);
