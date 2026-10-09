'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Book, Unit, Topic, Level, LevelExample } from '@/types/book.types';
import { bookService } from '@/services/book.service';
import { useLocale } from 'next-intl';

export type Book5Screen =
  | 'setup'
  | 'home'
  | 'unit'
  | 'lesson'
  | 'problemas'
  | 'results'
  | 'definiciones'
  | 'estandares'
  | 'report';

export interface StudentProfile5 {
  name: string;
  school: string;
  city: string;
  teacher: string;
  email: string;
  avatar: string;
}

export interface LessonResultsSummary5 {
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

interface Book5ContextType {
  book: Book | null;
  loading: boolean;
  screen: Book5Screen;
  student: StudentProfile5;
  coins: number;
  stars: number;
  streak: number;
  totalXP: number;
  scores: Record<string, number>;
  currentUnit: number;
  currentTopic: number;
  currentLevel: number;
  lastResults: LessonResultsSummary5 | null;
  dark: boolean;
  setDark: (d: boolean) => void;
  goScreen: (s: Book5Screen) => void;
  startStudent: (st: StudentProfile5) => void;
  selectUnit: (uIdx: number) => void;
  selectTopic: (tIdx: number) => void;
  startLevel: (uIdx: number, tIdx: number, lIdx: number) => void;
  saveLessonScore: (levelKey: string, scorePct: number, xp: number, c: number, s: number, summary: LessonResultsSummary5) => void;
  activeProblemasNivel: number;
  setActiveProblemasNivel: (n: number) => void;
  activeProblemasTab: 'ejemplos' | 'practica';
  setActiveProblemasTab: (t: 'ejemplos' | 'practica') => void;
  reportAutoRunAI: boolean;
  setReportAutoRunAI: (v: boolean) => void;
  updateStats: (earnedCoins: number, earnedStars: number, earnedXp: number) => void;
  resetStudent: () => void;
}

const defaultStudent5: StudentProfile5 = {
  name: '',
  school: '',
  city: '',
  teacher: '',
  email: '',
  avatar: '🧑‍🚀',
};

const Book5Context = createContext<Book5ContextType | null>(null);

const STORAGE_KEY_STUDENT = 'fedor5_student';
const STORAGE_KEY_SCORES = 'fedor5_scores';
const STORAGE_KEY_STATS = 'fedor5_stats';

export function Book5Provider({
  children,
  slug = 'matematicas-fedor-5',
}: {
  children: React.ReactNode;
  slug?: string;
}) {
  const locale = useLocale();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Book5Screen>('setup');
  const [student, setStudent] = useState<StudentProfile5>(defaultStudent5);

  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastResults, setLastResults] = useState<LessonResultsSummary5 | null>(null);
  const [dark, setDark] = useState(false);

  const [activeProblemasNivel, setActiveProblemasNivel] = useState(0);
  const [activeProblemasTab, setActiveProblemasTab] = useState<'ejemplos' | 'practica'>('ejemplos');
  const [reportAutoRunAI, setReportAutoRunAI] = useState(false);

  // Cargar libro desde servicio
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    bookService
      .getBook(slug, locale)
      .then((b) => {
        if (mounted) {
          setBook(b);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[Book5Context] Error al cargar libro 5°:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug, locale]);

  // Cargar progreso del alumno desde localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawSt = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (rawSt) {
        const parsed = JSON.parse(rawSt);
        if (parsed && parsed.name) {
          setStudent(parsed);
          setScreen('home');
        }
      }

      const rawStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (rawStats) {
        const stats = JSON.parse(rawStats);
        setCoins(stats.coins || 0);
        setStars(stats.stars || 0);
        setStreak(stats.streak || 0);
        setTotalXP(stats.totalXP || 0);
      }

      const rawScores = localStorage.getItem(STORAGE_KEY_SCORES);
      if (rawScores) {
        setScores(JSON.parse(rawScores));
      }
    } catch (e) {
      console.warn('[Book5Context] Error al restaurar almacenamiento local:', e);
    }
  }, []);

  const goScreen = useCallback((s: Book5Screen) => {
    setScreen(s);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const startStudent = useCallback((st: StudentProfile5) => {
    setStudent(st);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(st));
    } catch (e) {}
    setScreen('home');
  }, []);

  const resetStudent = useCallback(() => {
    setStudent(defaultStudent5);
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENT);
      localStorage.removeItem(STORAGE_KEY_SCORES);
      localStorage.removeItem(STORAGE_KEY_STATS);
    } catch (e) {}
    setCoins(0);
    setStars(0);
    setStreak(0);
    setTotalXP(0);
    setScores({});
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

  const updateStats = useCallback((earnedCoins: number, earnedStars: number, earnedXp: number) => {
    setCoins((c) => {
      const nc = c + earnedCoins;
      setStars((s) => {
        const ns = s + earnedStars;
        setTotalXP((x) => {
          const nx = x + earnedXp;
          setStreak((stk) => {
            const nstk = stk + (earnedStars > 0 ? 1 : 0);
            try {
              localStorage.setItem(
                STORAGE_KEY_STATS,
                JSON.stringify({ coins: nc, stars: ns, totalXP: nx, streak: nstk })
              );
            } catch (e) {}
            return nstk;
          });
          return nx;
        });
        return ns;
      });
      return nc;
    });
  }, []);

  const saveLessonScore = useCallback(
    (
      levelKey: string,
      scorePct: number,
      xp: number,
      c: number,
      s: number,
      summary: LessonResultsSummary5
    ) => {
      setScores((prev) => {
        const currentBest = prev[levelKey] || 0;
        const next = { ...prev, [levelKey]: Math.max(currentBest, scorePct) };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      updateStats(c, s, xp);
      setLastResults(summary);
      setScreen('results');
    },
    [updateStats]
  );

  return (
    <Book5Context.Provider
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
        reportAutoRunAI,
        setReportAutoRunAI,
        updateStats,
        resetStudent,
      }}
    >
      {children}
    </Book5Context.Provider>
  );
}

export function useBook5() {
  const ctx = useContext(Book5Context);
  if (!ctx) {
    throw new Error('useBook5 debe usarse dentro de un Book5Provider');
  }
  return ctx;
}
