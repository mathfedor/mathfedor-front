'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Book } from '@/types/book.types';
import { bookService } from '@/services/book.service';
import { bookProgressService } from '@/services/book-progress.service';
import { authService } from '@/services/auth.service';

export type Book1Screen =
  | 'setup'
  | 'home'
  | 'unit'
  | 'lesson'
  | 'tablas-conteo'
  | 'conceptos'
  | 'retos'
  | 'problemas'
  | 'estandares'
  | 'definiciones'
  | 'results'
  | 'shop'
  | 'galaxy'
  | 'report'
  | 'profile'
  | 'diary';

export interface StudentProfile1 {
  name: string;
  school: string;
  city: string;
  teacher: string;
  email: string;
  avatar: string;
}

export interface LessonResultsSummary1 {
  unitIndex: number;
  topicIndex: number;
  levelIndex: number;
  total: number;
  correct: number;
  pct: number;
  xpEarned: number;
  coinsEarned: number;
  starsEarned: number;
  answers: Array<{ q: string; user: string; correct: string; ok: boolean }>;
}

interface Book1ContextType {
  book: Book | null;
  loading: boolean;
  screen: Book1Screen;
  student: StudentProfile1;
  coins: number;
  stars: number;
  streak: number;
  totalXP: number;
  scores: Record<string, number>;
  currentUnit: number;
  currentTopic: number;
  currentLevel: number;
  lastResults: LessonResultsSummary1 | null;
  dark: boolean;
  setDark: (d: boolean) => void;
  goScreen: (s: Book1Screen) => void;
  startStudent: (st: StudentProfile1) => void;
  selectUnit: (uIdx: number) => void;
  selectTopic: (tIdx: number) => void;
  startLevel: (uIdx: number, tIdx: number, lIdx: number) => void;
  saveLessonScore: (
    levelKey: string,
    scorePct: number,
    xp: number,
    c: number,
    s: number,
    summary: LessonResultsSummary1
  ) => void;
  updateStats: (earnedCoins: number, earnedStars: number, earnedXp: number) => void;
  grantReward: (xp: number, coins: number) => void;
  selectAvatar: (avatar: string) => void;
  resetStudent: () => void;
}

const defaultStudent: StudentProfile1 = {
  name: '',
  school: '',
  city: '',
  teacher: '',
  email: '',
  avatar: '🧑‍🚀',
};

const Book1Context = createContext<Book1ContextType | null>(null);

const STORAGE_KEY_STUDENT = 'fedor1_student';
const STORAGE_KEY_SCORES = 'fedor1_scores';
const STORAGE_KEY_STATS = 'fedor1_stats';

export function Book1Provider({
  children,
  slug = 'libro-1ro',
}: {
  children: React.ReactNode;
  slug?: string;
}) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Book1Screen>('setup');
  const [student, setStudent] = useState<StudentProfile1>(defaultStudent);

  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastResults, setLastResults] = useState<LessonResultsSummary1 | null>(null);
  const [dark, setDark] = useState(false);

  // Carga inicial del libro de 1°
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      bookService.getBook(slug),
      bookProgressService.getProgress(slug),
    ])
      .then(([b, p]) => {
        if (!mounted) return;
        setBook(b);

        // Si hay progreso guardado en bookProgressService (backend o localStorage fedor_progress_libro-1ro)
        if (p && p.student && p.student.name) {
          setStudent({
            name: p.student.name,
            school: p.student.school || '',
            city: p.student.city || '',
            teacher: p.student.teacher || '',
            email: p.student.email || '',
            avatar: p.student.avatar || '🧑‍🚀',
          });
          if (p.scores) {
            const scMap: Record<string, number> = {};
            Object.entries(p.scores).forEach(([k, v]) => {
              scMap[k] = typeof v === 'number' ? v : (v.pct || 100);
            });
            setScores(scMap);
          }
          if (p.gamification) {
            setCoins(p.gamification.coins || 0);
            setStars(p.gamification.stars || 0);
            setStreak(p.gamification.streak || 0);
            setTotalXP(p.gamification.totalXP || 0);
          }
          setScreen('home');
        } else {
          // Revisar si existe en localStorage legacy
          let foundStudent = false;
          try {
            const rawSt = localStorage.getItem(STORAGE_KEY_STUDENT);
            if (rawSt) {
              const stObj = JSON.parse(rawSt);
              if (stObj && stObj.name) {
                setStudent(stObj);
                setScreen('home');
                foundStudent = true;
              }
            }
          } catch {}

          if (!foundStudent) {
            // Pre-cargar datos del estudiante desde authService si existen
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
              const st = currentUser.student;
              const prefilledName = st?.name || currentUser.name || '';
              if (prefilledName) {
                setStudent({
                  name: prefilledName,
                  school: st?.institution || '',
                  city: st?.city || '',
                  teacher: '',
                  email: st?.email || currentUser.email || '',
                  avatar: '🧑‍🚀',
                });
                setScreen('home');
                foundStudent = true;
              }
            }
            if (!foundStudent) {
              setScreen('setup');
            }
          }

          try {
            const rawSc = localStorage.getItem(STORAGE_KEY_SCORES);
            if (rawSc) setScores(JSON.parse(rawSc));

            const rawStats = localStorage.getItem(STORAGE_KEY_STATS);
            if (rawStats) {
              const stats = JSON.parse(rawStats);
              setCoins(stats.coins || 0);
              setStars(stats.stars || 0);
              setStreak(stats.streak || 0);
              setTotalXP(stats.totalXP || 0);
            }
          } catch (e) {
            console.warn('[Book1Context] Error reading local stats:', e);
          }
        }
      })
      .catch((err) => {
        console.error('[Book1Context] Error loading book:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const goScreen = useCallback((s: Book1Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startStudent = useCallback((st: StudentProfile1) => {
    setStudent(st);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(st));
      // Registrar en bookProgressService para mantener compatibilidad
      bookProgressService.createProgress(
        {
          name: st.name,
          school: st.school,
          city: st.city,
          teacher: st.teacher,
          email: st.email,
          avatar: st.avatar,
        },
        slug
      );
    } catch {}
    setScreen('home');
  }, [slug]);

  const resetStudent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENT);
      localStorage.removeItem(STORAGE_KEY_SCORES);
      localStorage.removeItem(STORAGE_KEY_STATS);
    } catch {}
    setStudent(defaultStudent);
    setScores({});
    setCoins(0);
    setStars(0);
    setStreak(0);
    setTotalXP(0);
    setScreen('setup');
  }, []);

  const selectUnit = useCallback((uIdx: number) => {
    setCurrentUnit(uIdx);
    setScreen('unit');
  }, []);

  const selectTopic = useCallback((tIdx: number) => {
    setCurrentTopic(tIdx);
  }, []);

  const startLevel = useCallback((uIdx: number, tIdx: number, lIdx: number) => {
    setCurrentUnit(uIdx);
    setCurrentTopic(tIdx);
    setCurrentLevel(lIdx);
    setScreen('lesson');
  }, []);

  const saveLessonScore = useCallback(
    (
      levelKey: string,
      scorePct: number,
      xp: number,
      c: number,
      s: number,
      summary: LessonResultsSummary1
    ) => {
      setScores((prev) => {
        const next = { ...prev, [levelKey]: Math.max(prev[levelKey] || 0, scorePct) };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
        } catch {}
        return next;
      });

      setCoins((prev) => {
        const n = prev + c;
        updatePersistentStats(n, stars + s, totalXP + xp, streak + 1);
        return n;
      });
      setStars((prev) => prev + s);
      setTotalXP((prev) => prev + xp);
      setStreak((prev) => prev + 1);
      setLastResults(summary);
      setScreen('results');
    },
    [stars, totalXP, streak]
  );

  const updateStats = useCallback((earnedCoins: number, earnedStars: number, earnedXp: number) => {
    setCoins((c) => {
      const nC = c + earnedCoins;
      setStars((s) => {
        const nS = s + earnedStars;
        setTotalXP((x) => {
          const nX = x + earnedXp;
          updatePersistentStats(nC, nS, nX, streak);
          return nX;
        });
        return nS;
      });
      return nC;
    });
  }, [streak]);

  const selectAvatar = useCallback((av: string) => {
    setStudent((prev) => {
      const next = { ...prev, avatar: av };
      try {
        localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const grantReward = useCallback((xp: number, c: number) => {
    updateStats(c, 0, xp);
  }, [updateStats]);

  function updatePersistentStats(c: number, s: number, x: number, strk: number) {
    try {
      localStorage.setItem(
        STORAGE_KEY_STATS,
        JSON.stringify({ coins: c, stars: s, totalXP: x, streak: strk })
      );
    } catch {}
  }

  return (
    <Book1Context.Provider
      value={{
        book,
        loading,
        screen,
        student,
        coins,
        stars,
        streak,
        totalXP,
        scores,
        currentUnit,
        currentTopic,
        currentLevel,
        lastResults,
        dark,
        setDark,
        goScreen,
        startStudent,
        selectUnit,
        selectTopic,
        startLevel,
        saveLessonScore,
        updateStats,
        grantReward,
        selectAvatar,
        resetStudent,
      }}
    >
      {children}
    </Book1Context.Provider>
  );
}

export function useBook1() {
  const ctx = useContext(Book1Context);
  if (!ctx) {
    throw new Error('useBook1 must be used within a Book1Provider');
  }
  return ctx;
}
