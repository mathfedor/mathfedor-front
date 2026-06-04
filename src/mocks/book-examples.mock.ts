/**
 * Mock de los ejemplos didácticos del libro (`LEVEL_EXAMPLES` del HTML).
 * 910 tarjetas en 91 niveles, claveadas por `u{u}t{t}-n{n}`.
 */

import extras from './data/book-extras.data.json';
import type { LevelExample, LevelExamplesMap } from '@/types/book.types';

interface RawExtras {
  LEVEL_EXAMPLES?: Record<string, LevelExample[]>;
}

const data = extras as unknown as RawExtras;

export const mockLevelExamples: LevelExamplesMap = data.LEVEL_EXAMPLES ?? {};
