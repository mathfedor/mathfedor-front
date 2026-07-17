'use client';

/**
 * Contexto global de la experiencia del libro "Matemáticas de Fedor 2°".
 * Centraliza currículo, progreso, gamificación y navegación entre pantallas.
 * Reemplaza las variables globales y el localStorage disperso del HTML original.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import Swal from 'sweetalert2';
import type { Book, LevelRef, Exercise } from '@/types/book.types';
import type { GamificationCatalog, ShopItem } from '@/types/gamification.types';
import { pickDailyExercises, dayKey } from '@/services/daily-challenge.service';
import { bookAudio } from '@/services/book-audio.service';
import type {
  BookProgress,
  BookStudent,
  LessonResult,
} from '@/types/book-progress.types';
import { bookService } from '@/services/book.service';
import { bookProgressService } from '@/services/book-progress.service';
import {
  applyLevelReward,
  evaluateBadges,
  getBadgeReward,
  getRank,
  getRankIndex,
  getUnlockedAvatars,
  registerLogin,
} from '@/services/gamification.service';
import { unlockRandomSticker, resetStickers } from '../utils/stickerService';

export type BookScreen =
  | 'setup'
  | 'home'
  | 'galaxy'
  | 'unit'
  | 'lesson'
  | 'results'
  | 'report'
  | 'profile'
  | 'shop'
  | 'games'
  | 'diary'
  | 'examen'
  | 'espacial'
  | 'estandares'
  | 'problemas'
  | 'conteo'
  | 'retos';

export type BookGameShortcut = 'tablas' | 'stats' | 'conteo' | 'retos1';

interface BookContextValue {
  loading: boolean;
  book: Book | null;
  catalog: GamificationCatalog | null;
  progress: BookProgress | null;

  screen: BookScreen;
  goScreen: (s: BookScreen) => void;
  gameShortcut: BookGameShortcut | null;
  openGameShortcut: (shortcut: BookGameShortcut) => void;
  clearGameShortcut: () => void;

  currentUnit: number;
  currentTopic: number;
  currentLevel: LevelRef | null;
  openUnit: (unitIndex: number) => void;
  openLesson: (ref: LevelRef) => void;

  /** Modo del motor de lección: nivel normal o reto diario. */
  lessonMode: 'level' | 'daily';
  /** Ejercicios del reto diario (cuando lessonMode === 'daily'). */
  dailyExercises: Exercise[];
  /** Inicia el reto del día (set determinista por fecha, monedas dobles). */
  startDailyChallenge: () => void;

  lastResult: LessonResult | null;
  /** Insignias ganadas en la última lección (para celebrarlas en Results). */
  newBadges: string[];
  /** Subida de rango pendiente de mostrar (overlay). */
  rankUp: { from: string; to: string } | null;
  clearRankUp: () => void;

  /** Preferencias de dispositivo. */
  dark: boolean;
  soundOn: boolean;
  toggleDark: () => void;
  toggleSound: () => void;

  /** Acciones de dominio. */
  startStudent: (student: BookStudent) => void;
  finishLesson: (result: LessonResult, reward: ResultReward) => Promise<void>;
  selectAvatar: (avatar: string) => void;
  buyItem: (item: ShopItem) => boolean;
  equipItem: (item: ShopItem) => void;
  claimDaily: () => number;
  /** Otorga XP y monedas (mini-juegos, bonus). */
  grantReward: (xp: number, coins: number) => void;
  /** Reclama la recompensa de una misión completada. */
  claimMission: (missionId: string, reward: number) => void;
  resetAll: () => void;
  cameFromLesson: boolean;
}

interface ResultReward {
  xp: number;
  coins: number;
  stars: number;
  ok: number;
  wrong: number;
  /** Respuesta más rápida de la lección (ms), para la insignia de velocidad. */
  fastestMs?: number;
}

const BookContext = createContext<BookContextValue | null>(null);

export function BookProvider({ children, slug }: { children: ReactNode; slug: string }) {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [catalog, setCatalog] = useState<GamificationCatalog | null>(null);
  const [progress, setProgress] = useState<BookProgress | null>(null);

  const [screen, setScreen] = useState<BookScreen>('setup');
  const [gameShortcut, setGameShortcut] = useState<BookGameShortcut | null>(null);
  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<LevelRef | null>(null);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [rankUp, setRankUp] = useState<{ from: string; to: string } | null>(null);
  const [lessonMode, setLessonMode] = useState<'level' | 'daily'>('level');
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([]);
  const [dark, setDark] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [cameFromLesson, setCameFromLesson] = useState(false);

  // Carga de preferencias de dispositivo (modo oscuro / sonido).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('fedor2_prefs');
      if (raw) {
        const prefs = JSON.parse(raw) as { dark?: boolean; soundOn?: boolean };
        if (typeof prefs.dark === 'boolean') setDark(prefs.dark);
        if (typeof prefs.soundOn === 'boolean') {
          setSoundOn(prefs.soundOn);
          bookAudio.setEnabled(prefs.soundOn);
        }
      }
    } catch {
      /* sin preferencias previas */
    }
  }, []);

  const persistPrefs = useCallback((next: { dark: boolean; soundOn: boolean }) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('fedor2_prefs', JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      const next = !d;
      persistPrefs({ dark: next, soundOn });
      return next;
    });
  }, [soundOn, persistPrefs]);

  const toggleSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      bookAudio.setEnabled(next);
      persistPrefs({ dark, soundOn: next });
      return next;
    });
  }, [dark, persistPrefs]);

  /* Carga inicial: currículo + catálogo + progreso persistido. */
  useEffect(() => {
    let active = true;
    (async () => {
      const [b, c, p] = await Promise.all([
        bookService.getBook(slug),
        bookService.getGamificationCatalog(slug),
        bookProgressService.getProgress(slug),
      ]);
      if (!active) return;
      setBook(b);
      setCatalog(c);
      if (p) {
        const withLogin = { ...p, gamification: registerLogin(p.gamification) };
        setProgress(withLogin);
        if (withLogin.gamification.lastLogin !== p.gamification?.lastLogin) {
          void bookProgressService.saveProgress(withLogin);
        }
        setScreen('home');
      } else {
        setProgress(null);
        setScreen('setup');
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const goScreen = useCallback((s: BookScreen) => {
    setScreen((prev) => {
      if (prev === 'lesson') {
        setCameFromLesson(true);
      } else if (s === 'home' || s === 'setup') {
        setCameFromLesson(false);
      }
      return s;
    });
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (typeof document !== 'undefined') {
      const root = document.querySelector('.fedor-book');
      if (root) root.classList.toggle('in-lesson', s === 'lesson');
    }
  }, []);

  const clearGameShortcut = useCallback(() => {
    setGameShortcut(null);
  }, []);

  const openGameShortcut = useCallback(
    (shortcut: BookGameShortcut) => {
      if (shortcut === 'conteo') {
        goScreen('conteo');
      } else if (shortcut === 'retos1') {
        goScreen('retos');
      } else {
        setGameShortcut(shortcut);
        goScreen('games');
      }
    },
    [goScreen]
  );

  const openUnit = useCallback(
    (unitIndex: number) => {
      setCurrentUnit(unitIndex);
      goScreen('unit');
    },
    [goScreen]
  );

  const openLesson = useCallback(
    (ref: LevelRef) => {
      setLessonMode('level');
      setCurrentUnit(ref.unitIndex);
      setCurrentTopic(ref.topicIndex);
      setCurrentLevel(ref);
      goScreen('lesson');
    },
    [goScreen]
  );

  const startDailyChallenge = useCallback(() => {
    if (!book) return;
    setDailyExercises(pickDailyExercises(book));
    setLessonMode('daily');
    goScreen('lesson');
  }, [book, goScreen]);

  const persist = useCallback(async (next: BookProgress) => {
    setProgress(next);
    await bookProgressService.saveProgress(next);
  }, []);

  const startStudent = useCallback(
    (student: BookStudent) => {
      const fresh = bookProgressService.createProgress(student, slug);
      setProgress(fresh);
      goScreen('home');
    },
    [goScreen, slug]
  );

  const finishLesson = useCallback(
    async (result: LessonResult, reward: ResultReward) => {
      setLastResult(result);
      if (!progress || !catalog || !book) {
        setNewBadges([]);
        goScreen('results');
        return;
      }
      // 1) Aplicar XP/monedas/racha y registrar el resultado (actualiza scores).
      const rewarded = applyLevelReward(progress.gamification, reward);
      const withScore = await bookProgressService.submitLessonResult(
        { ...progress, gamification: rewarded },
        result
      );
      // 2) Evaluar insignias contra el mapa de scores YA actualizado.
      const before = new Set(progress.gamification.earnedBadges);
      const earned = evaluateBadges(catalog, withScore.gamification, {
        book,
        scores: withScore.scores,
        justFinishedLevelKey: result.levelKey,
        lessonPct: result.pct,
        anyCorrectThisLesson: result.ok > 0,
        fastestMs: reward.fastestMs,
      });
      const fresh = earned.filter((id) => !before.has(id));
      const isDaily = result.levelKey.startsWith('daily-');

      // 3) Recompensa por insignia nueva (XP + monedas según tarifa).
      const badgeReward = fresh.reduce(
        (acc, id) => {
          const r = getBadgeReward(id);
          return { xp: acc.xp + r.xp, coins: acc.coins + r.coins };
        },
        { xp: 0, coins: 0 }
      );

      let gamification = {
        ...withScore.gamification,
        earnedBadges: earned,
        totalXP: withScore.gamification.totalXP + badgeReward.xp,
        coins: withScore.gamification.coins + badgeReward.coins,
        ...(isDaily ? { lastDailyChallenge: dayKey() } : {}),
      };

      // 4) Detección de subida de rango (+100 monedas).
      const beforeRank = getRankIndex(catalog.ranks, progress.gamification.totalXP);
      const afterRank = getRankIndex(catalog.ranks, gamification.totalXP);
      let ru: { from: string; to: string } | null = null;
      if (afterRank > beforeRank) {
        gamification = { ...gamification, coins: gamification.coins + 100 };
        ru = { from: catalog.ranks[beforeRank].label, to: catalog.ranks[afterRank].label };
      }

      const finalProgress = { ...withScore, gamification };
      setProgress(finalProgress);
      await bookProgressService.saveProgress(finalProgress);
      setNewBadges(fresh);
      setRankUp(ru);

      // Unlock a random sticker in 1st Grade if score is >= 70%
      if (book?.slug === 'libro-1ro' && result.pct >= 70) {
        setTimeout(() => {
          const sticker = unlockRandomSticker();
          if (sticker) {
            Swal.fire({
              title: '¡Has ganado un sticker! 🎉',
              html: `<div style="font-size: 64px; margin: 15px 0; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">${sticker.e}</div>
                     <div style="font-size: 18px; font-weight: 900; color: #9B0066; font-family: 'Baloo 2', sans-serif;">${sticker.name}</div>
                     <div style="font-size: 13px; color: #666; margin-top: 8px; font-weight: 700;">¡Agrégalo a tu colección en el Álbum!</div>`,
              confirmButtonText: '¡Súper!',
              confirmButtonColor: '#9B5CFF',
              background: '#FFF7E0',
            });
          }
        }, 1500);
      }

      goScreen('results');
    },
    [progress, catalog, book, goScreen]
  );

  const clearRankUp = useCallback(() => setRankUp(null), []);

  const selectAvatar = useCallback(
    (avatar: string) => {
      if (!progress) return;
      persist({ ...progress, student: { ...progress.student, avatar }, gamification: { ...progress.gamification, avatar } });
    },
    [progress, persist]
  );

  const buyItem = useCallback(
    (item: ShopItem): boolean => {
      if (!progress) return false;
      const g = progress.gamification;
      if (g.shop.owned.includes(item.id)) return false;
      if (g.coins < item.price || g.totalXP < item.unlockXP) return false;
      persist({
        ...progress,
        gamification: {
          ...g,
          coins: g.coins - item.price,
          shop: { ...g.shop, owned: [...g.shop.owned, item.id] },
        },
      });
      return true;
    },
    [progress, persist]
  );

  const equipItem = useCallback(
    (item: ShopItem) => {
      if (!progress) return;
      const g = progress.gamification;
      if (!g.shop.owned.includes(item.id)) return;
      const equipped = { ...g.shop.equipped, [item.cat]: item.id };
      const avatar = item.avatar ?? g.avatar;
      persist({
        ...progress,
        student: { ...progress.student, avatar },
        gamification: { ...g, avatar, shop: { ...g.shop, equipped } },
      });
    },
    [progress, persist]
  );

  const claimDaily = useCallback((): number => {
    if (!progress) return 0;
    const today = new Date().toDateString();
    if (progress.gamification.lastDaily === today) return 0;
    const bonus = 50;
    persist({
      ...progress,
      gamification: {
        ...progress.gamification,
        lastDaily: today,
        totalXP: progress.gamification.totalXP + bonus,
        coins: progress.gamification.coins + 25,
      },
    });
    return bonus;
  }, [progress, persist]);

  const grantReward = useCallback(
    (xp: number, coins: number) => {
      if (!progress) return;
      persist({
        ...progress,
        gamification: {
          ...progress.gamification,
          totalXP: progress.gamification.totalXP + xp,
          coins: progress.gamification.coins + coins,
        },
      });
    },
    [progress, persist]
  );

  const claimMission = useCallback(
    (missionId: string, reward: number) => {
      if (!progress) return;
      const claimed = progress.gamification.claimedMissions ?? [];
      if (claimed.includes(missionId)) return;
      persist({
        ...progress,
        gamification: {
          ...progress.gamification,
          coins: progress.gamification.coins + reward,
          claimedMissions: [...claimed, missionId],
        },
      });
    },
    [progress, persist]
  );

  const resetAll = useCallback(() => {
    bookProgressService.reset(slug);
    resetStickers();
    setProgress(null);
    goScreen('setup');
  }, [goScreen, slug]);

  const value = useMemo<BookContextValue>(
    () => ({
      loading,
      book,
      catalog,
      progress,
      screen,
      goScreen,
      gameShortcut,
      openGameShortcut,
      clearGameShortcut,
      currentUnit,
      currentTopic,
      currentLevel,
      openUnit,
      openLesson,
      lessonMode,
      dailyExercises,
      startDailyChallenge,
      lastResult,
      newBadges,
      rankUp,
      clearRankUp,
      dark,
      soundOn,
      toggleDark,
      toggleSound,
      startStudent,
      finishLesson,
      selectAvatar,
      buyItem,
      equipItem,
      claimDaily,
      grantReward,
      claimMission,
      resetAll,
      cameFromLesson,
    }),
    [
      loading,
      book,
      catalog,
      progress,
      screen,
      goScreen,
      gameShortcut,
      openGameShortcut,
      clearGameShortcut,
      currentUnit,
      currentTopic,
      currentLevel,
      openUnit,
      openLesson,
      lessonMode,
      dailyExercises,
      startDailyChallenge,
      lastResult,
      newBadges,
      rankUp,
      clearRankUp,
      dark,
      soundOn,
      toggleDark,
      toggleSound,
      startStudent,
      finishLesson,
      selectAvatar,
      buyItem,
      equipItem,
      claimDaily,
      grantReward,
      claimMission,
      resetAll,
      cameFromLesson,
    ]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBook(): BookContextValue {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBook debe usarse dentro de <BookProvider>');
  return ctx;
}

/** Hooks derivados convenientes. */
export function useRank() {
  const { catalog, progress } = useBook();
  return useMemo(() => {
    if (!catalog || !progress) return null;
    return getRank(catalog.ranks, progress.gamification.totalXP);
  }, [catalog, progress]);
}

export function useUnlockedAvatars() {
  const { catalog, progress } = useBook();
  return useMemo(() => {
    if (!catalog || !progress) return [];
    return getUnlockedAvatars(catalog.avatars, progress.gamification.totalXP);
  }, [catalog, progress]);
}
