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



function readLocal(slug: string = BOOK_SLUG): BookProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    let raw = window.localStorage.getItem(`fedor_progress_${slug}`);
    if (!raw && (slug === 'matematicas-fedor-2' || slug === BOOK_SLUG)) {
      raw = window.localStorage.getItem('fedor2_progress_v1');
    }
    return raw ? (JSON.parse(raw) as BookProgress) : null;
  } catch {
    return null;
  }
}

function writeLocal(progress: BookProgress, slug: string = BOOK_SLUG): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`fedor_progress_${slug}`, JSON.stringify(progress));
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
  createProgress(student: BookStudent, slug: string = BOOK_SLUG): BookProgress {
    const progress: BookProgress = {
      bookSlug: slug,
      student,
      scores: {},
      gamification: createInitialGamificationState(student.avatar),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeLocal(progress, slug);
    return progress;
  }

  /** Carga el progreso actual (backend → mock local). */
  async getProgress(slug: string = BOOK_SLUG): Promise<BookProgress | null> {
    if (backendEnabled()) {
      try {
        const res = await fetch(`${API_URL}/books/${slug}/progress`, {
          headers: bookHeaders(),
        });
        if (res.ok) return (await res.json()) as BookProgress;
      } catch (error) {
        console.warn('[book-progress] fallback local:', error);
      }
    }
    return readLocal(slug);
  }

  /** Guarda el progreso completo. */
  async saveProgress(progress: BookProgress): Promise<BookProgress> {
    const next: BookProgress = { ...progress, updatedAt: new Date().toISOString() };
    const slug = progress.bookSlug || BOOK_SLUG;
    writeLocal(next, slug);
    if (backendEnabled()) {
      try {
        await fetch(`${API_URL}/books/${slug}/progress`, {
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
    const slug = progress.bookSlug || BOOK_SLUG;

    if (backendEnabled()) {
      try {
        await fetch(`${API_URL}/books/${slug}/results`, {
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
  reset(slug: string = BOOK_SLUG): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(`fedor_progress_${slug}`);
    if (slug === 'matematicas-fedor-2' || slug === BOOK_SLUG) {
      window.localStorage.removeItem('fedor2_progress_v1');
    }
  }
}

export const bookProgressService = new BookProgressService();
