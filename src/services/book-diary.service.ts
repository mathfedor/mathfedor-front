/**
 * Diario de actividad y Reto Espacial (réplica de `openDiario` / `openEspacial`).
 * Registra ejercicios por día y el estado del reto espacial diario en localStorage,
 * tal como el HTML original (`fedor2p2_diary`, `fedor2_espacial_v2`).
 */

const DIARY_KEY = 'fedor2_diary_v1';
const ESPACIAL_KEY = 'fedor2_espacial_v2';

function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

interface DiaryStore {
  [date: string]: { ex: number };
}

export interface DiaryDay {
  key: string;
  date: Date;
  ex: number;
  isToday: boolean;
  label: string;
  dayNum: number;
}

export interface DiaryWeek {
  days: DiaryDay[];
  totalEx: number;
  weekTotal: number;
  activeDays: number;
  streakDays: number;
  bestDay: DiaryDay;
  maxEx: number;
}

function readDiary(): DiaryStore {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(DIARY_KEY) || '{}') as DiaryStore;
  } catch {
    return {};
  }
}

function writeDiary(store: DiaryStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DIARY_KEY, JSON.stringify(store));
  } catch {
    /* almacenamiento no disponible */
  }
}

export interface EspacialState {
  lastDay: string;
  streak: number;
}

function readEspacial(): EspacialState {
  if (typeof window === 'undefined') return { lastDay: '', streak: 0 };
  try {
    const s = JSON.parse(window.localStorage.getItem(ESPACIAL_KEY) || '{}') as Partial<EspacialState>;
    return { lastDay: s.lastDay ?? '', streak: s.streak ?? 0 };
  } catch {
    return { lastDay: '', streak: 0 };
  }
}

export const bookDiaryService = {
  /** Registra ejercicios resueltos hoy. */
  logExercises(count: number): void {
    if (count <= 0) return;
    const store = readDiary();
    const k = todayKey();
    store[k] = { ex: (store[k]?.ex ?? 0) + count };
    writeDiary(store);
  },

  /** Resumen de los últimos 7 días con estadísticas. */
  getWeek(): DiaryWeek {
    const diary = readDiary();
    const days: DiaryDay[] = [];
    let maxEx = 1;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = todayKey(d);
      const ex = diary[k]?.ex ?? 0;
      if (ex > maxEx) maxEx = ex;
      days.push({
        key: k,
        date: d,
        ex,
        isToday: i === 0,
        label: d.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
        dayNum: d.getDate(),
      });
    }
    const totalEx = Object.values(diary).reduce((s, d) => s + (d.ex || 0), 0);
    const activeDays = days.filter((x) => x.ex > 0).length;
    const weekTotal = days.reduce((s, d) => s + d.ex, 0);
    const bestDay = days.reduce((b, d) => (d.ex > b.ex ? d : b), days[0]);
    let streakDays = 0;
    for (let j = days.length - 1; j >= 0; j--) {
      if (days[j].ex > 0) streakDays++;
      else break;
    }
    return { days, totalEx, weekTotal, activeDays, streakDays, bestDay, maxEx };
  },

  /** Estado del reto espacial diario. */
  getEspacial(): { state: EspacialState; doneToday: boolean } {
    const state = readEspacial();
    return { state, doneToday: state.lastDay === todayKey() };
  },

  /** Completa el reto espacial de hoy; devuelve la nueva racha. */
  completeEspacial(): number {
    const state = readEspacial();
    if (state.lastDay === todayKey()) return state.streak;
    const next: EspacialState = { lastDay: todayKey(), streak: state.streak + 1 };
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(ESPACIAL_KEY, JSON.stringify(next));
      } catch {
        /* almacenamiento no disponible */
      }
    }
    return next.streak;
  },
};
