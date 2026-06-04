/**
 * Servicio del libro interactivo "Matemáticas de Fedor 2°".
 *
 * Backend-ready: cuando exista la API Node.js consumirá los endpoints
 * `/books/...`; mientras tanto cae al mock del currículo. Sigue el patrón
 * de `module.service.ts` (fetch + NEXT_PUBLIC_API_URL).
 */

import type { Book, Unit, Topic, LevelRef, Level, LevelExample, LoreChapter, UnitTutorial } from '@/types/book.types';
import type { GamificationCatalog } from '@/types/gamification.types';
import { mockBook, mockGamificationCatalog } from '@/mocks/book-curriculum.mock';
import { mockLevelExamples } from '@/mocks/book-examples.mock';
import { mockLoreChapters } from '@/mocks/book-lore.mock';
import { mockUnitTutorials } from '@/mocks/book-unit-tuts.mock';
import { BOOK_API_URL as API_URL, BOOK_SLUG, bookBackendEnabled, bookHeaders } from './book-http';

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
    return safeFetchJson<Book>(`${API_URL}/books/${slug}`, mockBook);
  },

  /** Catálogo estático de gamificación (avatares, badges, rangos, tienda). */
  async getGamificationCatalog(): Promise<GamificationCatalog> {
    return safeFetchJson<GamificationCatalog>(
      `${API_URL}/books/${BOOK_SLUG}/gamification`,
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
