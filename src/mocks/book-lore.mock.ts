/** Mock de los capítulos narrativos (diario/lore) del libro. */

import lore from './data/book-lore.data.json';
import lore3 from './data/book-lore-3.data.json';
import type { LoreChapter } from '@/types/book.types';

interface RawLore {
  LORE_CHAPTERS?: LoreChapter[];
}

export const mockLoreChapters: LoreChapter[] = (lore as unknown as RawLore).LORE_CHAPTERS ?? [];
export const mockLoreChapters3: LoreChapter[] = (lore3 as unknown as RawLore).LORE_CHAPTERS ?? [];
