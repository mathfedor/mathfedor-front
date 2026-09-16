/**
 * CI / Pre-commit script: Verifies that all locales have 100% of the keys present in the default locale ('es').
 * Fails with exit code 1 if any key is missing.
 */
const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const DEFAULT_LOCALE = 'es';
const TARGET_LOCALES = ['en', 'pt', 'fr', 'de'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadLocaleMessages(locale) {
  const localePath = path.join(MESSAGES_DIR, locale);
  if (!fs.existsSync(localePath)) {
    console.error(`❌ Directorio no encontrado para el locale: ${locale} (${localePath})`);
    process.exit(1);
  }

  const files = fs.readdirSync(localePath).filter((f) => f.endsWith('.json'));
  const messages = {};

  for (const file of files) {
    const namespace = path.basename(file, '.json');
    const content = JSON.parse(fs.readFileSync(path.join(localePath, file), 'utf8'));
    messages[namespace] = content;
  }

  return messages;
}

function runCompletenessCheck() {
  console.log('🔍 Iniciando verificación de completitud de traducciones (i18n completeness check)...');

  const baseMessages = loadLocaleMessages(DEFAULT_LOCALE);
  const baseKeys = getKeys(baseMessages);
  console.log(`📌 Idioma base (${DEFAULT_LOCALE}): ${baseKeys.length} claves encontradas.`);

  let hasErrors = false;

  for (const locale of TARGET_LOCALES) {
    const targetMessages = loadLocaleMessages(locale);
    const targetKeys = new Set(getKeys(targetMessages));

    const missingKeys = baseKeys.filter((k) => !targetKeys.has(k));
    const extraKeys = Array.from(targetKeys).filter((k) => !baseKeys.includes(k));

    if (missingKeys.length > 0) {
      hasErrors = true;
      console.error(`\n❌ [${locale.toUpperCase()}] Faltan ${missingKeys.length} claves:`);
      missingKeys.forEach((k) => console.error(`   - ${k}`));
    } else {
      console.log(`✅ [${locale.toUpperCase()}] 100% completo (${targetKeys.size}/${baseKeys.length} claves)`);
    }

    if (extraKeys.length > 0) {
      console.warn(`⚠️ [${locale.toUpperCase()}] ${extraKeys.length} claves huérfanas (no están en '${DEFAULT_LOCALE}'):`);
      extraKeys.forEach((k) => console.warn(`   + ${k}`));
    }
  }

  if (hasErrors) {
    console.error('\n🚨 Error: La verificación de traducciones falló. Completa las claves faltantes antes de desplegar.\n');
    process.exit(1);
  } else {
    console.log('\n✨ Todas las traducciones están sincronizadas y completas.\n');
    process.exit(0);
  }
}

runCompletenessCheck();
