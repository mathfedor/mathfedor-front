/**
 * Persistencia de progreso del libro "Matemáticas de Fedor 2°".
 *
 * Mientras no exista el backend, persiste en localStorage (igual que el
 * HTML original). Backend-ready: cada método tiene su endpoint destino.
 * Sigue el estilo de `learning-results.service.ts`.
 */

import type {
  BookProgress,
  BookStudent,
  LevelScore,
  ScoreMap,
  LessonResult,
} from '@/types/book-progress.types';
import type { LevelRef } from '@/types/book.types';
import { createInitialGamificationState } from './gamification.service';
import { BOOK_API_URL as API_URL, BOOK_SLUG, bookBackendEnabled as backendEnabled, bookHeaders } from './book-http';

const STORAGE_KEY = 'fedor2_progress_v1';

function readLocal(): BookProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookProgress) : null;
  } catch {
    return null;
  }
}

function writeLocal(progress: BookProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* almacenamiento no disponible (modo privado) */
  }
}

/** Clave canónica de un nivel. */
export function levelKey(ref: LevelRef): string {
  return `u${ref.unitIndex}t${ref.topicIndex}-n${ref.levelIndex + 1}`;
}

class BookProgressService {
  /** Crea un progreso nuevo a partir de los datos del estudiante. */
  createProgress(student: BookStudent): BookProgress {
    const progress: BookProgress = {
      bookSlug: BOOK_SLUG,
      student,
      scores: {},
      gamification: createInitialGamificationState(student.avatar),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeLocal(progress);
    return progress;
  }

  /** Carga el progreso actual (backend → mock local). */
  async getProgress(): Promise<BookProgress | null> {
    if (backendEnabled()) {
      try {
        const res = await fetch(`${API_URL}/books/${BOOK_SLUG}/progress`, {
          headers: bookHeaders(),
        });
        if (res.ok) return (await res.json()) as BookProgress;
      } catch (error) {
        console.warn('[book-progress] fallback local:', error);
      }
    }
    return readLocal();
  }

  /** Guarda el progreso completo. */
  async saveProgress(progress: BookProgress): Promise<BookProgress> {
    const next: BookProgress = { ...progress, updatedAt: new Date().toISOString() };
    writeLocal(next);
    if (backendEnabled()) {
      try {
        await fetch(`${API_URL}/books/${BOOK_SLUG}/progress`, {
          method: 'PUT',
          headers: bookHeaders(),
          body: JSON.stringify(next),
        });
      } catch (error) {
        console.warn('[book-progress] no se pudo sincronizar con backend:', error);
      }
    }
    return next;
  }

  /** Registra el resultado de una lección y devuelve el progreso actualizado. */
  async submitLessonResult(
    progress: BookProgress,
    result: LessonResult
  ): Promise<BookProgress> {
    const prev: LevelScore | undefined = progress.scores[result.levelKey];
    const score: LevelScore = {
      key: result.levelKey,
      topicTitle: result.topicTitle,
      levelLabel: result.levelLabel,
      pts: result.pts,
      maxPts: result.maxPts,
      ok: result.ok,
      wrong: result.wrong,
      pct: result.pct,
      grade: result.grade.letter,
      attempts: (prev?.attempts ?? 0) + 1,
      ts: new Date().toISOString(),
    };
    const scores: ScoreMap = { ...progress.scores, [result.levelKey]: score };
    const next: BookProgress = { ...progress, scores };

    if (backendEnabled()) {
      try {
        await fetch(`${API_URL}/books/${BOOK_SLUG}/results`, {
          method: 'POST',
          headers: bookHeaders(),
          body: JSON.stringify(result),
        });
      } catch (error) {
        console.warn('[book-progress] resultado guardado solo localmente:', error);
      }
    }
    return this.saveProgress(next);
  }

  /** Borra el progreso local (reinicio). */
  reset(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const bookProgressService = new BookProgressService();
