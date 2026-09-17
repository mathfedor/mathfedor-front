const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../mathfedor-back/src/services/learning.service.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Update translateBook to use updateOne
const oldTranslateBook = `    // 3. Guardar en translations del documento
    if (!book.translations) {
      book.translations = {};
    }
    book.translations[loc] = {
      title: translatedMeta.title,
      description: translatedMeta.description,
      group: translatedMeta.group,
      bookCurriculum: translatedCurriculum,
      translatedAt: new Date(),
    };

    book.markModified('translations');
    await book.save();`;

const newTranslateBook = `    // 3. Guardar en translations del documento con updateOne nativo
    const enPayload = {
      title: translatedMeta.title,
      description: translatedMeta.description,
      group: translatedMeta.group,
      bookCurriculum: translatedCurriculum,
      translatedAt: new Date(),
    };

    await this.learningModel.updateOne(
      { _id: book._id },
      { $set: { [\`translations.\${loc}\`]: enPayload } }
    );`;

if (content.includes(oldTranslateBook)) {
  content = content.replace(oldTranslateBook, newTranslateBook);
}

// Update translateAllModulesMetadata to use updateOne
const oldTranslateAll = `      if (!mod.translations) {
        mod.translations = {};
      }
      mod.translations[loc] = {
        ...(mod.translations[loc] || {}),
        title: translatedMeta.title,
        description: translatedMeta.description,
        group: translatedMeta.group,
        translatedAt: new Date(),
      };
      mod.markModified('translations');
      await mod.save();`;

const newTranslateAll = `      await this.learningModel.updateOne(
        { _id: mod._id },
        {
          $set: {
            [\`translations.\${loc}.title\`]: translatedMeta.title,
            [\`translations.\${loc}.description\`]: translatedMeta.description,
            [\`translations.\${loc}.group\`]: translatedMeta.group,
            [\`translations.\${loc}.translatedAt\`]: new Date(),
          }
        }
      );`;

if (content.includes(oldTranslateAll)) {
  content = content.replace(oldTranslateAll, newTranslateAll);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully patched learning.service.ts with updateOne!');
