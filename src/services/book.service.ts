/**
 * Servicio del libro interactivo "Matemáticas de Fedor 2°".
 *
 * Backend-ready: cuando exista la API Node.js consumirá los endpoints
 * `/books/...`; mientras tanto cae al mock del currículo. Sigue el patrón
 * de `module.service.ts` (fetch + NEXT_PUBLIC_API_URL).
 */

import type { Book, Unit, Topic, LevelRef, Level, LevelExample, LoreChapter, UnitTutorial, Exercise } from '@/types/book.types';
import type { GamificationCatalog } from '@/types/gamification.types';
import { mockBook, mockGamificationCatalog } from '@/mocks/book-curriculum.mock';
import { mockLevelExamples } from '@/mocks/book-examples.mock';
import { mockLoreChapters } from '@/mocks/book-lore.mock';
import { mockUnitTutorials } from '@/mocks/book-unit-tuts.mock';
import { BOOK_API_URL as API_URL, BOOK_SLUG, bookBackendEnabled, bookHeaders } from './book-http';
import bookCurriculum1 from '@/mocks/data/book-curriculum-1.data.json';

interface RawExercise {
  type: 'mcq' | 'input' | 'seq';
  q: string;
  pts?: number;
  badge?: string;
  bst?: string;
  mascot?: string;
  ctx?: string;
  figure?: string;
  fig_data?: Record<string, unknown>;
  opts?: string[];
  ans?: string;
  hint?: string;
  items?: Array<{ t: 'f' | 'b'; v?: string; a?: string }>;
  countEmoji?: string;
  countN?: number;
}

interface RawLevel {
  label: string;
  short: string;
  dot: string;
  bg: string;
  color: string;
  exercises?: RawExercise[];
}

interface RawTopic {
  id?: string;
  title: string;
  icon: string;
  desc: string;
  levels?: RawLevel[];
}

interface RawUnit {
  name: string;
  short: string;
  std: string;
  heroCls: string;
  icon: string;
  topics?: RawTopic[];
}

function mapExercise(raw: RawExercise, id: string): Exercise {
  const base = {
    id,
    q: raw.q,
    pts: raw.pts || 30,
    badge: raw.badge,
    bst: raw.bst,
    mascot: raw.mascot,
    ctx: raw.ctx,
    figure: raw.figure,
    fig_data: raw.fig_data,
    countEmoji: raw.countEmoji,
    countN: raw.countN,
  };
  if (raw.type === 'mcq') {
    return { ...base, type: 'mcq', opts: raw.opts ?? [], ans: raw.ans ?? '' };
  } else if (raw.type === 'seq') {
    return { ...base, type: 'seq', items: raw.items ?? [] };
  } else {
    return { ...base, type: 'input', ans: raw.ans ?? '', hint: raw.hint };
  }
}

function mapLevel(raw: RawLevel, levelIndex: number, topicId: string): Level {
  return {
    index: levelIndex,
    label: raw.label,
    short: raw.short,
    dot: raw.dot,
    bg: raw.bg,
    color: raw.color,
    exercises: (raw.exercises ?? []).map((ex, i) =>
      mapExercise(ex, `${topicId}-n${levelIndex + 1}-e${i + 1}`)
    ),
  };
}

function mapTopic(raw: RawTopic, topicIndex: number, unitId: string): Topic {
  const id = raw.id || `${unitId}-t${topicIndex}`;
  return {
    id,
    title: raw.title,
    icon: raw.icon,
    desc: raw.desc,
    levels: (raw.levels || []).map((lv, i) => mapLevel(lv, i, id)),
  };
}

function mapUnit(raw: RawUnit, unitIndex: number): Unit {
  const id = `u${unitIndex}`;
  return {
    id,
    index: unitIndex,
    name: raw.name,
    short: raw.short,
    std: raw.std,
    heroCls: raw.heroCls,
    icon: raw.icon,
    topics: (raw.topics || []).map((t, i) => mapTopic(t, i, id)),
  };
}

const mockBook1: Book = {
  id: 'book-fedor-1',
  slug: 'libro-1ro',
  title: 'Matemáticas de Fedor 1°',
  grade: '1° de Primaria',
  standard: 'Pensamiento Numérico · MEN Colombia',
  units: ((bookCurriculum1.UNITS || []) as unknown as RawUnit[]).map((u, i) => mapUnit(u, i)),
};

async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  if (!bookBackendEnabled()) return fallback;
  try {
    const res = await fetch(url, { headers: bookHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn('[book.service] usando mock por error de backend:', error);
    return fallback;
  }
}

export const bookService = {
  /** Devuelve el libro completo (currículo + estructura). */
  async getBook(slug: string = BOOK_SLUG): Promise<Book> {
    if (bookBackendEnabled()) {
      return safeFetchJson<Book>(`${API_URL}/books/${slug}`, mockBook);
    }
    if (slug === 'libro-1ro' || slug === 'matematicas-fedor-1') {
      return mockBook1;
    }
    return mockBook;
  },

  /** Catálogo estático de gamificación (avatares, badges, rangos, tienda). */
  async getGamificationCatalog(slug: string = BOOK_SLUG): Promise<GamificationCatalog> {
    return safeFetchJson<GamificationCatalog>(
      `${API_URL}/books/${slug}/gamification`,
      mockGamificationCatalog
    );
  },

  /** Capítulos narrativos del diario (lore). */
  getLore(): LoreChapter[] {
    return mockLoreChapters;
  },

  /** Tutorial introductorio de una unidad (solo unidades 0..3 lo tienen). */
  getUnitTutorial(unitIndex: number): UnitTutorial | null {
    return mockUnitTutorials[unitIndex] ?? null;
  },

  /**
   * Ejemplos didácticos de un nivel (`u{u}t{t}-n{n}`).
   * Algunas unidades usan claves alternas en el original
   * (u1→`sub_`, u2→`mul_`, u3→`div_`); se resuelven por alias.
   */
  getExamples(levelKey: string): LevelExample[] {
    const cleanCounting: Record<string, LevelExample[]> = {
      'u0t0-n1': [
        { icon: "1️⃣", q: "¿Cuántos elementos hay? 🐉", a: "1", explain: "Un dragón = el número 1", vis: "🐉" },
        { icon: "2️⃣", q: "¿Cuántos elementos hay? 🐄🐄", a: "2", explain: "Dos vacas = el número 2", vis: "🐄🐄" },
        { icon: "3️⃣", q: "¿Cuántos elementos hay? 🍎🍎🍎", a: "3", explain: "Tres manzanas = el número 3", vis: "🍎🍎🍎" },
        { icon: "4️⃣", q: "¿Cuántos elementos hay? ⭐⭐⭐•", a: "4", explain: "Cuatro estrellas = el número 4", vis: "⭐⭐⭐⭐" },
        { icon: "5️⃣", q: "¿Cuántos elementos hay? 🌸🌸🌸🌸🌸", a: "5", explain: "Cinco flores = el número 5", vis: "🌸🌸🌸🌸🌸" },
        { icon: "🔢", q: "¿Qué número va DESPUÉS del 3?", a: "4", explain: "1, 2, 3, → 4" },
        { icon: "🔢", q: "¿Qué número va ANTES del 5?", a: "4", explain: "3, 4, 5 → el anterior a 5 es 4" },
        { icon: "🌙", q: "¿Qué número va ENTRE 2 y 4?", a: "3", explain: "2, 3, 4" },
        { icon: "🍬", q: "¿Cuántos elementos hay? 🍬🍬🍬🍬", a: "4", explain: "Cuatro dulces = el número 4", vis: "🍬🍬🍬🍬" },
        { icon: "📊", q: "¿Cuál número es Mayor: 1 o 5?", a: "5", explain: "5 está más adelante en la recta" }
      ],
      'u0t0-n2': [
        { icon: "6️⃣", q: "¿Cuántos elementos hay? ⚽⚽⚽⚽⚽⚽", a: "6", explain: "Seis balones = número 6", vis: "⚽⚽⚽⚽⚽⚽" },
        { icon: "7️⃣", q: "¿Cuántos elementos hay? 🥭×7", a: "7", explain: "Siete mangos", vis: "🥭🥭🥭🥭🥭🥭🥭" },
        { icon: "8️⃣", q: "¿Cuántos elementos hay? 🐟×8", a: "8", explain: "Ocho peces", vis: "🐟🐟🐟🐟🐟🐟🐟🐟" },
        { icon: "9️⃣", q: "¿Cuántos elementos hay? 🍬×9", a: "9", explain: "Nueve dulces", vis: "🍬🍬🍬🍬🍬🍬🍬🍬🍬" },
        { icon: "🔟", q: "¿Cuántos elementos hay? 🌸×10", a: "10", explain: "Diez flores = una decena", vis: "🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸" },
        { icon: "🔢", q: "Cuenta: 1,2,3,4,5,?,7,8,9,10", a: "6", explain: "Entre 5 y 7 va el 6" },
        { icon: "🔢", q: "Regresivo: 10,9,8,?,6,5", a: "7", explain: "Bajamos uno: 8→7→6" },
        { icon: "⚖️", q: "¿Cuál número es Mayor: 7 o 9?", a: "9", explain: "9 > 7" },
        { icon: "🌟", q: "¿Cuántos elementos hay? 🌟×8", a: "8", explain: "Ocho estrellas", vis: "🌟🌟🌟🌟🌟🌟🌟🌟" },
        { icon: "📊", q: "De 2 en 2: 2,4,?,8", a: "6", explain: "+2 cada paso" }
      ],
      'u0t0-n3': [
        { icon: "🔢", q: "¿Cuántos elementos hay? 🌟×12", a: "12", explain: "Doce estrellas = 10 + 2", vis: "🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟" },
        { icon: "📊", q: "De 2 en 2: 2,4,6,8,?,12", a: "10", explain: "Sumamos 2 cada vez: 8+2=10" },
        { icon: "📊", q: "De 5 en 5: 0,5,?,15", a: "10", explain: "Sumamos 5 cada vez: 10+5=15" },
        { icon: "⚖️", q: "¿Cuál número es mayor? 13 u 8?", a: "13", explain: "13 > 8" },
        { icon: "❓", q: "¿Cuál número falta? 11, 12, 14, 15", a: "13", explain: "Secuencia +1: el número entre 12 y 14 es 13" },
        { icon: "📉", q: "Regresivo: 15,14,?,12", a: "13", explain: "−1 cada paso" },
        { icon: "🔢", q: "¿Cuántos elementos hay? 🐣×15", a: "15", explain: "1 decena + 5 unidades", vis: "🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣🐣" },
        { icon: "🌌", q: "¿Cuál número es PAR? 11, 12, 13?", a: "12", explain: "Pares terminan en 0,2,4,6,8" },
        { icon: "📊", q: "¿Cuál número es IMPAR? 10, 11, 12?", a: "11", explain: "Impares terminan en 1,3,5,7,9" },
        { icon: "⚖️", q: "¿Cuál número es menor? 14 u 8?", a: "8", explain: "8 < 14" }
      ],
      'u0t0-n4': [
        { icon: "🔢", q: "¿Cuántos elementos hay? 🌟×18", a: "18", explain: "1 decena + 8 unidades", vis: "🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟" },
        { icon: "📊", q: "De 2 en 2: 10,12,?,16,18", a: "14", explain: "+2 cada vez" },
        { icon: "📊", q: "De 5 en 5: 0,5,?,15", a: "10", explain: "+5 cada vez" },
        { icon: "⚖️", q: "¿Cuál es el número MAYOR de 16,19,12,11", a: "19", explain: "El más grande" },
        { icon: "❓", q: "¿Cuál número falta: 17,?,19?", a: "18", explain: "+1" },
        { icon: "📉", q: "Regresivo: 20,19,?,17", a: "18", explain: "−1" },
        { icon: "🌌", q: "¿Cuál número es PAR: 17,18,19?", a: "18", explain: "Pares terminan en 0,2,4,6,8" },
        { icon: "⚖️", q: "¿Entre 18 y 20?", a: "19", explain: "18→19→20" },
        { icon: "📊", q: "De 5 en 5: 5,10,15,?", a: "20", explain: "+5 cada paso" },
        { icon: "📊", q: "De 2 en 2: 14,16,?,20", a: "18", explain: "+2" }
      ],
      'u0t0-n5': [
        { icon: "📝", q: "¡Repaso! Cuenta y compara hasta 20", a: "📚", explain: "Recordamos: contar, antes/después, entre, mayor/menor, par, secuencias de 2 y 5" },
        { icon: "🌟", q: "¿Cuántas? 🌟×3", a: "3", explain: "Tres estrellas", vis: "🌟🌟🌟" },
        { icon: "🔢", q: "¿Después del 13?", a: "14", explain: "13→14" },
        { icon: "⚖️", q: "¿Cuál número es mayor? 12 u 8?", a: "12", explain: "12>8" },
        { icon: "📊", q: "2 → ? → 6 → ?", a: "4 y 8", explain: "De 2 en 2" },
        { icon: "📉", q: "20,19,?,17", a: "18", explain: "−1" },
        { icon: "📊", q: "¿Después del 17?", a: "18", explain: "17→18" },
        { icon: "⚖️", q: "¿Cuál número es Mayor: 19 o 16?", a: "19", explain: "19>16" },
        { icon: "🌟", q: "¿Cuál número es PAR: 14, 15, 17?", a: "14", explain: "14 termina en 4" },
        { icon: "📊", q: "De 2 en 2: 16,?,20", a: "18", explain: "+2" }
      ]
    };

    if (cleanCounting[levelKey]) return cleanCounting[levelKey];

    const direct = mockLevelExamples[levelKey];
    if (direct) return direct;
    const alias: Record<string, string> = { u1: 'sub', u2: 'mul', u3: 'div' };
    const m = /^(u\d+)(t\d+-n\d+)$/.exec(levelKey);
    if (m && alias[m[1]]) {
      return mockLevelExamples[`${alias[m[1]]}_${m[2]}`] ?? [];
    }
    return [];
  },

  /** Atajo síncrono para acceder a una unidad ya cargada. */
  getUnit(book: Book, unitIndex: number): Unit | undefined {
    return book.units[unitIndex];
  },

  /** Atajo síncrono para acceder a un tema ya cargado. */
  getTopic(book: Book, unitIndex: number, topicIndex: number): Topic | undefined {
    return book.units[unitIndex]?.topics[topicIndex];
  },

  /** Atajo síncrono para acceder a un nivel ya cargado. */
  getLevel(book: Book, ref: LevelRef): Level | undefined {
    return book.units[ref.unitIndex]?.topics[ref.topicIndex]?.levels[ref.levelIndex];
  },

  /** Clave canónica de un nivel (compatible con el HTML original). */
  levelKey(ref: LevelRef): string {
    return `u${ref.unitIndex}t${ref.topicIndex}-n${ref.levelIndex + 1}`;
  },
};
