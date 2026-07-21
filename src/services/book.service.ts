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
import { mockLevelExamples, mockLevelExamples1 } from '@/mocks/book-examples.mock';
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
  svgFig?: string;
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
  levelDescs?: string[];
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
    svgFig: raw.svgFig,
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
    levelDescs: raw.levelDescs,
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


/**
 * Convierte la respuesta del backend (que devuelve bookCurriculum directamente)
 * al tipo Book que usa el frontend. Las unidades, temas, niveles y ejercicios
 * se mapean usando las mismas funciones de normalización existentes.
 */
function mapBookFromBackend(data: any, slug: string): Book {
  const units: Unit[] = ((data.units || []) as RawUnit[]).map((u, i) => mapUnit(u, i));
  return {
    id: data.id || data._id || slug,
    slug: data.slug || slug,
    title: data.title || 'Matemáticas de Fedor',
    grade: data.grade || '',
    standard: data.standard || 'Pensamiento Numérico · MEN Colombia',
    units,
  };
}

/**
 * Traduce una clave lógica de nivel (como "u0t0-n1") a la clave física del tema
 * que está guardada en la base de datos (como "con_t0-n1" en 1° o "sub_t0-n1" en 2°).
 */
export function resolvePhysicalLevelKey(levelKey: string, slug: string, book?: Book): string {
  const isBook1 = slug === 'libro-1ro' || slug === 'matematicas-fedor-1';
  
  const m = /^u(\d+)t(\d+)-n(\d+)$/.exec(levelKey);
  if (!m) return levelKey;
  
  const uIdx = parseInt(m[1], 10);
  const tIdx = parseInt(m[2], 10);
  const lNum = parseInt(m[3], 10);

  if (isBook1) {
    if (book) {
      const topic = book.units[uIdx]?.topics[tIdx];
      if (topic) {
        return `${topic.id}-n${lNum}`;
      }
    }
    // Prefijos por unidad conocidos para Grado 1°
    const prefixMap = ['con', 'sum', 'res', 'lec', 'geo', 'med', 'est'];
    const prefix = prefixMap[uIdx] || `u${uIdx}`;
    return `${prefix}_t${tIdx}-n${lNum}`;
  } else {
    // Alias para Grado 2°
    const aliasMap: Record<string, string> = { u1: 'sub', u2: 'mul', u3: 'div' };
    const prefix = `u${uIdx}`;
    if (aliasMap[prefix]) {
      return `${aliasMap[prefix]}_t${tIdx}-n${lNum}`;
    }
  }

  return levelKey;
}

// Caché de promesas para deduplicar peticiones concurrentes al backend
const bookCache: Record<string, Promise<Book> | undefined> = {};
const catalogCache: Record<string, Promise<GamificationCatalog> | undefined> = {};
const loreCache: Record<string, Promise<LoreChapter[]> | undefined> = {};
const tutorialsCache: Record<string, Promise<UnitTutorial | null> | undefined> = {};
const examplesCache: Record<string, Promise<LevelExample[]> | undefined> = {};

export const bookService = {
  /** Devuelve el libro completo (currículo + estructura) con deduplicación. */
  async getBook(slug: string = BOOK_SLUG): Promise<Book> {
    const cacheKey = slug;
    if (bookCache[cacheKey]) {
      return bookCache[cacheKey];
    }

    const promise = (async () => {
      if (bookBackendEnabled()) {
        const res = await fetch(`${API_URL}/books/${slug}`, { headers: bookHeaders() });
        if (!res.ok) {
          throw new Error(`Error del servidor al obtener el libro ${slug}: HTTP ${res.status}`);
        }
        const rawData = await res.json();
        console.log(`[book.service] getBook("${slug}") data:`, rawData);
        const data = rawData && rawData.bookCurriculum ? {
          ...rawData,
          ...rawData.bookCurriculum
        } : rawData;
        const unitsArray = data ? (data.units || data.UNITS) : null;
        if (data && Array.isArray(unitsArray) && unitsArray.length > 0) {
          return mapBookFromBackend(data, slug);
        }
        throw new Error(`El libro retornado por el backend ${slug} no contiene unidades válidas`);
      }
      if (slug === 'libro-1ro' || slug === 'matematicas-fedor-1') {
        return mockBook1;
      }
      return mockBook;
    })();

    bookCache[cacheKey] = promise;
    promise.catch(() => {
      delete bookCache[cacheKey];
    });

    return promise;
  },

  /** Catálogo estático de gamificación con deduplicación. */
  async getGamificationCatalog(slug: string = BOOK_SLUG): Promise<GamificationCatalog> {
    const cacheKey = slug;
    if (catalogCache[cacheKey]) {
      return catalogCache[cacheKey];
    }

    const promise = (async () => {
      if (bookBackendEnabled()) {
        const res = await fetch(`${API_URL}/books/${slug}/gamification`, { headers: bookHeaders() });
        if (!res.ok) {
          throw new Error(`Error del servidor al obtener gamificación de ${slug}: HTTP ${res.status}`);
        }
        return (await res.json()) as GamificationCatalog;
      }
      return mockGamificationCatalog;
    })();

    catalogCache[cacheKey] = promise;
    promise.catch(() => {
      delete catalogCache[cacheKey];
    });

    return promise;
  },

  /** Capítulos narrativos del diario (lore) con deduplicación. */
  async getLore(slug: string = BOOK_SLUG): Promise<LoreChapter[]> {
    const cacheKey = slug;
    if (loreCache[cacheKey]) {
      return loreCache[cacheKey];
    }

    const promise = (async () => {
      if (bookBackendEnabled()) {
        const res = await fetch(`${API_URL}/books/${slug}/lore`, { headers: bookHeaders() });
        if (!res.ok) {
          throw new Error(`Error del servidor al obtener lore de ${slug}: HTTP ${res.status}`);
        }
        return (await res.json()) as LoreChapter[];
      }
      return mockLoreChapters;
    })();

    loreCache[cacheKey] = promise;
    promise.catch(() => {
      delete loreCache[cacheKey];
    });

    return promise;
  },

  /** Tutorial introductorio de una unidad con deduplicación. */
  async getUnitTutorial(unitIndex: number, slug: string = BOOK_SLUG): Promise<UnitTutorial | null> {
    const cacheKey = `${slug}_${unitIndex}`;
    if (tutorialsCache[cacheKey]) {
      return tutorialsCache[cacheKey];
    }

    const promise = (async () => {
      if (bookBackendEnabled()) {
        const res = await fetch(`${API_URL}/books/${slug}/tutorials`, { headers: bookHeaders() });
        if (!res.ok) {
          throw new Error(`Error del servidor al obtener tutoriales de ${slug}: HTTP ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          return (data[unitIndex] as UnitTutorial) ?? null;
        }
        return null;
      }
      return mockUnitTutorials[unitIndex] ?? null;
    })();

    tutorialsCache[cacheKey] = promise;
    promise.catch(() => {
      delete tutorialsCache[cacheKey];
    });

    return promise;
  },

  /** Ejemplos didácticos de un nivel con deduplicación. */
  async getExamples(levelKey: string, slug: string = BOOK_SLUG): Promise<LevelExample[]> {
    let bookObj: Book | undefined;
    try {
      bookObj = slug === 'libro-1ro' || slug === 'matematicas-fedor-1' ? mockBook1 : mockBook;
    } catch {}

    const physicalKey = resolvePhysicalLevelKey(levelKey, slug, bookObj);
    const cacheKey = `${slug}_${physicalKey}`;
    if (examplesCache[cacheKey]) {
      return examplesCache[cacheKey];
    }

    const getLocalExamples = () => {
      const isBook1 = slug === 'libro-1ro' || slug === 'matematicas-fedor-1';
      if (isBook1) {
        const ex = mockLevelExamples1[physicalKey];
        if (ex && ex.length > 0) return ex;
        return [];
      }

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
      };

      if (cleanCounting[physicalKey]) return cleanCounting[physicalKey];

      const direct = mockLevelExamples[physicalKey];
      if (direct) return direct;
      return [];
    };

    const promise = (async () => {
      if (bookBackendEnabled()) {
        const res = await fetch(`${API_URL}/books/${slug}/examples/${encodeURIComponent(physicalKey)}`, { headers: bookHeaders() });
        if (!res.ok) {
          throw new Error(`Error del servidor al obtener ejemplos para ${physicalKey}: HTTP ${res.status}`);
        }
        return (await res.json()) as LevelExample[];
      }
      return getLocalExamples();
    })();

    examplesCache[cacheKey] = promise;
    promise.catch(() => {
      delete examplesCache[cacheKey];
    });

    return promise;
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

  /** (Admin) Guarda las actualizaciones del nivel en el backend. */
  async updateBookLevel(slug: string, levelData: any): Promise<{ success: boolean; slug: string; levelKey: string }> {
    if (!bookBackendEnabled()) {
      throw new Error('La integración de API en el libro interactivo no está configurada.');
    }
    const res = await fetch(`${API_URL}/books/${slug}/curriculum/level`, {
      method: 'PUT',
      headers: {
        ...bookHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(levelData),
    });
    if (!res.ok) {
      throw new Error(`Error del servidor al guardar el nivel: HTTP ${res.status}`);
    }
    return res.json();
  },
};
