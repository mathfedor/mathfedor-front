/** Utilidades de progreso derivadas del mapa de puntuaciones. */

import type { Book, Unit } from '@/types/book.types';
import type { ScoreMap } from '@/types/book-progress.types';

export function levelKey(u: number, t: number, l: number): string {
  return `u${u}t${t}-n${l + 1}`;
}

/** Porcentaje 0..100 de niveles completados de una unidad. */
export function unitProgressPct(unit: Unit, scores: ScoreMap): number {
  let done = 0;
  let total = 0;
  unit.topics.forEach((topic, ti) => {
    topic.levels.forEach((_, li) => {
      total += 1;
      if (scores[levelKey(unit.index, ti, li)]) done += 1;
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

/** Porcentaje global del libro completo. */
export function globalProgressPct(book: Book, scores: ScoreMap): number {
  let done = 0;
  let total = 0;
  book.units.forEach((unit) => {
    unit.topics.forEach((topic, ti) => {
      topic.levels.forEach((_, li) => {
        total += 1;
        if (scores[levelKey(unit.index, ti, li)]) done += 1;
      });
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

/** Niveles completados de un tema. */
export function topicCompletedLevels(unitIndex: number, topicIndex: number, levels: number, scores: ScoreMap): number {
  let c = 0;
  for (let l = 0; l < levels; l++) if (scores[levelKey(unitIndex, topicIndex, l)]) c += 1;
  return c;
}
