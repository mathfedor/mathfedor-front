/** Mock de los tutoriales de unidad (`UNIT_TUTS` del HTML). */

import data from './data/book-unit-tuts.data.json';
import type { UnitTutorial } from '@/types/book.types';

interface RawTuts {
  UNIT_TUTS?: UnitTutorial[];
}

export const mockUnitTutorials: UnitTutorial[] = (data as unknown as RawTuts).UNIT_TUTS ?? [];
