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
