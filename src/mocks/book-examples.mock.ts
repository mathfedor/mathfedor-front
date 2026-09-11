/**
 * Mock de los ejemplos didácticos del libro (`LEVEL_EXAMPLES` del HTML).
 * 910 tarjetas en 91 niveles, claveadas por `u{u}t{t}-n{n}`.
 */

import extras from './data/book-extras.data.json';
import extras1 from './data/book-extras-1.data.json';
import extras3 from './data/book-extras-3.data.json';
import type { LevelExample, LevelExamplesMap } from '@/types/book.types';

interface RawExtras {
  LEVEL_EXAMPLES?: Record<string, LevelExample[]>;
}

const data = extras as unknown as RawExtras;
const data1 = extras1 as unknown as RawExtras;
const data3 = extras3 as unknown as RawExtras;

export const mockLevelExamples: LevelExamplesMap = data.LEVEL_EXAMPLES ?? {};
export const mockLevelExamples1: LevelExamplesMap = data1.LEVEL_EXAMPLES ?? {};
export const mockLevelExamples3: LevelExamplesMap = data3.LEVEL_EXAMPLES ?? {};

