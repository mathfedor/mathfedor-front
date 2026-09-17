const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../mathfedor-back/src/services/translation/openai-translation.service.ts');

const code = `import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English (US)',
  pt: 'Portuguese (Brazil)',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
};

@Injectable()
export class OpenAiTranslationService {
  private readonly logger = new Logger(OpenAiTranslationService.name);
  private openai: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAiTranslationService inicializado con éxito');
    } else {
      this.logger.warn('OPENAI_API_KEY no encontrada. La traducción con OpenAI estará deshabilitada.');
    }
  }

  private getLanguageName(locale: string): string {
    return LANGUAGE_NAMES[locale.toLowerCase()] || locale;
  }

  /**
   * Traduce metadatos básicos de un módulo (título, descripción, grupo)
   */
  async translateMetadata(
    metadata: { title: string; description?: string; group?: string },
    targetLocale: string,
  ): Promise<{ title: string; description?: string; group?: string }> {
    if (!this.openai || targetLocale.toLowerCase() === 'es') {
      return metadata;
    }

    const targetLang = this.getLanguageName(targetLocale);
    const systemPrompt = \`You are an expert bilingual elementary mathematics educator and localization specialist.
Translate the following module metadata from Spanish into \${targetLang}.
CRITICAL:
1. Return ONLY valid JSON with the exact same keys ('title', 'description', 'group').
2. Keep math terms natural for primary school students (Grades 1-3).
3. Translate grade names cleanly (e.g. 'Grado 1°' -> 'Grade 1', 'Grado 2°' -> 'Grade 2', 'Grado 3°' -> 'Grade 3').\`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(metadata) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        title: parsed.title || metadata.title,
        description: parsed.description || metadata.description,
        group: parsed.group || metadata.group,
      };
    } catch (error: any) {
      this.logger.error(\`Error al traducir metadatos a \${targetLocale}: \${error.message}\`);
      return metadata;
    }
  }

  /**
   * Traduce un tema individual y sus ejercicios de forma compacta y segura.
   */
  async translateTopic(topic: any, targetLocale: string): Promise<any> {
    if (!this.openai || targetLocale.toLowerCase() === 'es') return topic;

    const targetLang = this.getLanguageName(targetLocale);
    const newTopic = JSON.parse(JSON.stringify(topic));

    try {
      // 1. Traducir metadatos del tema y nombres de niveles
      const topicMeta = {
        title: topic.title,
        desc: topic.desc || '',
        levels: (topic.levels || []).map((l: any) => ({ label: l.label, short: l.short })),
      };

      const metaRes = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: \`Translate elementary math topic titles and level labels to \${targetLang}. Return ONLY valid JSON matching input keys.\`,
          },
          { role: 'user', content: JSON.stringify(topicMeta) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
      newTopic.title = translatedMeta.title || topic.title;
      newTopic.desc = translatedMeta.desc || topic.desc;

      if (translatedMeta.levels && newTopic.levels) {
        newTopic.levels.forEach((l: any, i: number) => {
          if (translatedMeta.levels[i]) {
            l.label = translatedMeta.levels[i].label || l.label;
            l.short = translatedMeta.levels[i].short || l.short;
          }
        });
      }

      // 2. Traducir ejercicios nivel por nivel (extrayendo únicamente strings a traducir)
      for (let li = 0; li < (newTopic.levels || []).length; li++) {
        const lvl = newTopic.levels[li];
        if (!lvl.exercises || !lvl.exercises.length) continue;

        const exList = lvl.exercises.map((ex: any, idx: number) => ({
          idx,
          q: ex.q,
          hint: ex.hint || undefined,
          badge: ex.badge || undefined,
          opts: ex.opts && ex.opts.some((o: string) => /[a-záéíóú]/i.test(o)) ? ex.opts : undefined,
        }));

        const exRes = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: \`You are an elementary math educator. Translate math exercise questions ('q'), hints, badges, and text options ('opts') to \${targetLang}. Preserve numbers, formulas, variables, and emojis. Return ONLY valid JSON with { "exercises": [{ "idx": number, "q": string, "hint": string, "badge": string, "opts": string[] }] }.\`,
            },
            { role: 'user', content: JSON.stringify({ exercises: exList }) },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const parsed = JSON.parse(exRes.choices[0]?.message?.content || '{}');
        if (parsed.exercises && Array.isArray(parsed.exercises)) {
          parsed.exercises.forEach((p: any) => {
            const ex = lvl.exercises[p.idx];
            if (ex) {
              if (p.q) ex.q = p.q;
              if (p.hint) ex.hint = p.hint;
              if (p.badge) ex.badge = p.badge;
              if (p.opts && Array.isArray(p.opts)) ex.opts = p.opts;
            }
          });
        }
      }

      return newTopic;
    } catch (error: any) {
      this.logger.error(\`Error al traducir tema '\${topic.title || ''}' a \${targetLocale}: \${error.message}\`);
      return topic;
    }
  }

  /**
   * Traduce una unidad curricular completa con sus temas.
   */
  async translateUnit(unit: any, targetLocale: string): Promise<any> {
    if (!this.openai || targetLocale.toLowerCase() === 'es') return unit;

    const targetLang = this.getLanguageName(targetLocale);
    const newUnit = JSON.parse(JSON.stringify(unit));

    try {
      // 1. Traducir metadatos de la unidad
      const unitMeta = {
        name: unit.name,
        short: unit.short,
        std: unit.std,
      };

      const metaRes = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: \`Translate math unit title ('name'), short label ('short'), and curriculum standard ('std') to \${targetLang}. Return ONLY valid JSON matching input keys.\`,
          },
          { role: 'user', content: JSON.stringify(unitMeta) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const translatedMeta = JSON.parse(metaRes.choices[0]?.message?.content || '{}');
      newUnit.name = translatedMeta.name || unit.name;
      newUnit.short = translatedMeta.short || unit.short;
      newUnit.std = translatedMeta.std || unit.std;

      // 2. Traducir cada tema
      if (Array.isArray(unit.topics)) {
        newUnit.topics = [];
        for (let ti = 0; ti < unit.topics.length; ti++) {
          this.logger.log(\`  Traducir tema \${ti + 1}/\${unit.topics.length} ('\${unit.topics[ti].title || ''}') a \${targetLocale}...\`);
          const translatedTopic = await this.translateTopic(unit.topics[ti], targetLocale);
          newUnit.topics.push(translatedTopic);
        }
      }

      return newUnit;
    } catch (error: any) {
      this.logger.error(\`Error al traducir unidad '\${unit.name || ''}' a \${targetLocale}: \${error.message}\`);
      return unit;
    }
  }

  /**
   * Traduce el catálogo de gamificación (avatares, medallas, rangos, tienda).
   */
  async translateGamificationCatalog(catalog: any, targetLocale: string): Promise<any> {
    if (!this.openai || !catalog || targetLocale.toLowerCase() === 'es') return catalog;

    const targetLang = this.getLanguageName(targetLocale);
    const systemPrompt = \`You are an expert game localizer.
Translate this gamification catalog (avatars, badges, ranks, shopItems) from Spanish into \${targetLang}.
CRITICAL:
1. Return ONLY valid JSON matching the exact input structure.
2. Translate user-facing strings: 'label', 'name', 'tip', 'desc'.
3. Do NOT change: 'id', 'av', 'emoji', 'xp', 'price', 'bg', 'bc', 'color', 'min', 'cat', 'avatar', 'unlockXP'.\`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(catalog) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error: any) {
      this.logger.error(\`Error al traducir catálogo de gamificación a \${targetLocale}: \${error.message}\`);
      return catalog;
    }
  }

  /**
   * Traduce el currículo completo de un libro procesando unidad por unidad.
   */
  async translateBookCurriculum(curriculum: any, targetLocale: string): Promise<any> {
    if (!this.openai || !curriculum || targetLocale.toLowerCase() === 'es') {
      return curriculum;
    }

    this.logger.log(\`Iniciando traducción completa de currículo a \${targetLocale}...\`);
    const translatedCurriculum: any = { ...curriculum };

    // 1. Traducir unidades (unidad por unidad)
    if (Array.isArray(curriculum.units)) {
      translatedCurriculum.units = [];
      for (let i = 0; i < curriculum.units.length; i++) {
        const u = curriculum.units[i];
        this.logger.log(\`Traduciendo unidad \${i + 1}/\${curriculum.units.length} ('\${u.name || ''}') a \${targetLocale}...\`);
        const translatedUnit = await this.translateUnit(u, targetLocale);
        translatedCurriculum.units.push(translatedUnit);
      }
    }

    // 2. Traducir catálogo de gamificación si existe
    if (curriculum.gamificationCatalog) {
      this.logger.log(\`Traduciendo catálogo de gamificación a \${targetLocale}...\`);
      translatedCurriculum.gamificationCatalog = await this.translateGamificationCatalog(
        curriculum.gamificationCatalog,
        targetLocale,
      );
    }

    // 3. Traducir loreChapters (diario de a bordo) si existe
    if (Array.isArray(curriculum.loreChapters) && curriculum.loreChapters.length > 0) {
      try {
        const targetLang = this.getLanguageName(targetLocale);
        const resp = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: \`Translate these story lore chapters into \${targetLang}. Return ONLY valid JSON with { "loreChapters": [...] } matching keys.\`,
            },
            { role: 'user', content: JSON.stringify({ loreChapters: curriculum.loreChapters }) },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });
        const parsed = JSON.parse(resp.choices[0]?.message?.content || '{}');
        if (parsed.loreChapters) translatedCurriculum.loreChapters = parsed.loreChapters;
      } catch (err: any) {
        this.logger.warn(\`No se pudo traducir loreChapters: \${err.message}\`);
      }
    }

    // 4. Copiar levelExamples y unitTutorials (conservando fallback funcional)
    if (curriculum.levelExamples) {
      translatedCurriculum.levelExamples = curriculum.levelExamples;
    }
    if (curriculum.unitTutorials) {
      translatedCurriculum.unitTutorials = curriculum.unitTutorials;
    }

    this.logger.log(\`Traducción de currículo a \${targetLocale} completada con éxito.\`);
    return translatedCurriculum;
  }
}
`;

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully updated openai-translation.service.ts with robust smart unit/topic translation!');
