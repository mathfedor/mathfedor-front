/** Mock de los tutoriales de unidad (`UNIT_TUTS` del HTML). */

import data from './data/book-unit-tuts.data.json';
import data3 from './data/book-unit-tuts-3.data.json';
import type { UnitTutorial } from '@/types/book.types';

interface RawTuts {
  UNIT_TUTS?: UnitTutorial[];
}

export const mockUnitTutorials: UnitTutorial[] = (data as unknown as RawTuts).UNIT_TUTS ?? [];
export const mockUnitTutorials3: UnitTutorial[] = (data3 as unknown as RawTuts).UNIT_TUTS ?? [];
