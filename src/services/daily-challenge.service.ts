/**
 * Reto diario: selecciona de forma determinista un conjunto de ejercicios
 * a partir de la fecha, de modo que todos los estudiantes ven el mismo reto
 * el mismo día y el resultado es reproducible (sin backend).
 * Portado de `startDailyChallenge` / `dailySeed` del HTML original.
 */

import type { Book, Exercise } from '@/types/book.types';

/** Clave de día estable (YYYY-MM-DD en horario local). */
export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Hash determinista de una cadena → entero de 32 bits. */
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** PRNG mulberry32 sembrable. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Aplana todos los ejercicios del libro. */
function flattenExercises(book: Book): Exercise[] {
  const out: Exercise[] = [];
  book.units.forEach((u) => u.topics.forEach((t) => t.levels.forEach((l) => out.push(...l.exercises))));
  return out;
}

/**
 * Devuelve el set de ejercicios del reto del día (determinista por fecha).
 * @param count número de ejercicios (por defecto 8).
 */
export function pickDailyExercises(book: Book, date: Date = new Date(), count = 8): Exercise[] {
  const all = flattenExercises(book);
  if (all.length === 0) return [];
  const rng = mulberry32(hashSeed(dayKey(date)));

  // Barajado de Fisher–Yates determinista.
  const idx = all.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(count, all.length)).map((i) => all[i]);
}

/** Clave de nivel usada para registrar el reto (no afecta el progreso de unidades). */
export function dailyChallengeKey(date: Date = new Date()): string {
  return `daily-${dayKey(date)}`;
}
