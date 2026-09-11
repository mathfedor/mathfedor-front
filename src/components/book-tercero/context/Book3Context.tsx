'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Book, Unit, Topic, Level, LevelExample } from '@/types/book.types';
import { bookService } from '@/services/book.service';

export type Book3Screen =
  | 'setup'
  | 'home'
  | 'unit'
  | 'lesson'
  | 'problemas'
  | 'results'
  | 'definiciones'
  | 'estandares';

export interface StudentProfile3 {
  name: string;
  school: string;
  city: string;
  teacher: string;
  email: string;
  avatar: string;
}

export interface LessonResultsSummary {
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

interface Book3ContextType {
  book: Book | null;
  loading: boolean;
  screen: Book3Screen;
  student: StudentProfile3;
  coins: number;
  stars: number;
  streak: number;
  totalXP: number;
  scores: Record<string, number>;
  currentUnit: number;
  currentTopic: number;
  currentLevel: number;
  lastResults: LessonResultsSummary | null;
  dark: boolean;
  setDark: (d: boolean) => void;
  goScreen: (s: Book3Screen) => void;
  startStudent: (st: StudentProfile3) => void;
  selectUnit: (uIdx: number) => void;
  selectTopic: (tIdx: number) => void;
  startLevel: (uIdx: number, tIdx: number, lIdx: number) => void;
  saveLessonScore: (levelKey: string, scorePct: number, xp: number, c: number, s: number, summary: LessonResultsSummary) => void;
  activeProblemasNivel: number;
  setActiveProblemasNivel: (n: number) => void;
  activeProblemasTab: 'ejemplos' | 'practica';
  setActiveProblemasTab: (t: 'ejemplos' | 'practica') => void;
  updateStats: (earnedCoins: number, earnedStars: number, earnedXp: number) => void;
  resetStudent: () => void;
}

const defaultStudent: StudentProfile3 = {
  name: '',
  school: '',
  city: '',
  teacher: '',
  email: '',
  avatar: '🧑‍🚀',
};

const Book3Context = createContext<Book3ContextType | null>(null);

const STORAGE_KEY_STUDENT = 'fedor3_student';
const STORAGE_KEY_SCORES = 'fedor3_scores';
const STORAGE_KEY_STATS = 'fedor3_stats';

export function Book3Provider({
  children,
  slug = 'matematicas-fedor-3',
}: {
  children: React.ReactNode;
  slug?: string;
}) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Book3Screen>('setup');
  const [student, setStudent] = useState<StudentProfile3>(defaultStudent);

  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastResults, setLastResults] = useState<LessonResultsSummary | null>(null);
  const [dark, setDark] = useState(false);
  const [activeProblemasNivel, setActiveProblemasNivel] = useState(0);
  const [activeProblemasTab, setActiveProblemasTab] = useState<'ejemplos' | 'practica'>('ejemplos');

  // Load Book and saved state from localStorage
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const loadedBook = await bookService.getBook(slug);
        if (!active) return;
        setBook(loadedBook);

        // Load saved state
        if (typeof window !== 'undefined') {
          try {
            const rawStudent = localStorage.getItem(STORAGE_KEY_STUDENT);
            if (rawStudent) {
              const parsed = JSON.parse(rawStudent);
              if (parsed && parsed.name) {
                setStudent(parsed);
                setScreen('home');
              }
            }
            const rawScores = localStorage.getItem(STORAGE_KEY_SCORES);
            if (rawScores) {
              setScores(JSON.parse(rawScores) || {});
            }
            const rawStats = localStorage.getItem(STORAGE_KEY_STATS);
            if (rawStats) {
              const parsed = JSON.parse(rawStats);
              if (parsed) {
                setCoins(parsed.coins || 0);
                setStars(parsed.stars || 0);
                setStreak(parsed.streak || 0);
                setTotalXP(parsed.totalXP || 0);
              }
            }
          } catch (e) {
            console.warn('[Book3Context] Error loading localStorage state:', e);
          }
        }
      } catch (err) {
        console.error('[Book3Context] Error loading book:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const goScreen = useCallback((s: Book3Screen) => {
    setScreen(s);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const startStudent = useCallback(
    (st: StudentProfile3) => {
      setStudent(st);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(st));
        } catch (e) {
          // ignore
        }
      }
      goScreen('home');
    },
    [goScreen]
  );

  const selectUnit = useCallback(
    (uIdx: number) => {
      setCurrentUnit(uIdx);
      setCurrentTopic(0);
      goScreen('unit');
    },
    [goScreen]
  );

  const selectTopic = useCallback((tIdx: number) => {
    setCurrentTopic(tIdx);
  }, []);

  const startLevel = useCallback(
    (uIdx: number, tIdx: number, lIdx: number) => {
      setCurrentUnit(uIdx);
      setCurrentTopic(tIdx);
      setCurrentLevel(lIdx);
      goScreen('lesson');
    },
    [goScreen]
  );

  const updateStats = useCallback(
    (earnedCoins: number, earnedStars: number, earnedXp: number) => {
      setCoins((c) => {
        const nextC = c + earnedCoins;
        setStars((s) => {
          const nextS = s + earnedStars;
          setTotalXP((x) => {
            const nextX = x + earnedXp;
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(
                  STORAGE_KEY_STATS,
                  JSON.stringify({ coins: nextC, stars: nextS, streak, totalXP: nextX })
                );
              } catch (e) {}
            }
            return nextX;
          });
          return nextS;
        });
        return nextC;
      });
    },
    [streak]
  );

  const saveLessonScore = useCallback(
    (
      levelKey: string,
      scorePct: number,
      xp: number,
      c: number,
      s: number,
      summary: LessonResultsSummary
    ) => {
      setScores((prev) => {
        const next = { ...prev, [levelKey]: Math.max(prev[levelKey] || 0, scorePct) };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
      updateStats(c, s, xp);
      setLastResults(summary);
      goScreen('results');
    },
    [goScreen, updateStats]
  );

  const resetStudent = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_STUDENT);
        localStorage.removeItem(STORAGE_KEY_SCORES);
        localStorage.removeItem(STORAGE_KEY_STATS);
      } catch (e) {}
    }
    setStudent(defaultStudent);
    setScores({});
    setCoins(0);
    setStars(0);
    setStreak(0);
    setTotalXP(0);
    goScreen('setup');
  }, [goScreen]);

  return (
    <Book3Context.Provider
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
        activeProblemasNivel,
        setActiveProblemasNivel,
        activeProblemasTab,
        setActiveProblemasTab,
        updateStats,
        resetStudent,
      }}
    >
      {children}
    </Book3Context.Provider>
  );
}

export function useBook3() {
  const ctx = useContext(Book3Context);
  if (!ctx) {
    throw new Error('useBook3 must be used within a Book3Provider');
  }
  return ctx;
}
