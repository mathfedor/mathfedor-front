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
      const res = await fetch(`${API_URL}/books/${slug}/progress`, {
        headers: bookHeaders(),
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Error del servidor al obtener progreso de ${slug}: HTTP ${res.status}`);
      }
      const data = await res.json();
      // El backend devuelve { exists: boolean, learningResult: any }
      if (data && data.exists && data.learningResult) {
        const lr = data.learningResult;
        
        // Reconstruir la estructura scores que espera el frontend
        const scores: ScoreMap = {};
        if (lr.bookScores) {
          const rawScores = lr.bookScores instanceof Map 
            ? Object.fromEntries(lr.bookScores) 
            : lr.bookScores;
          
          Object.entries(rawScores).forEach(([key, val]: [string, any]) => {
            scores[key] = {
              key: val.key || key,
              topicTitle: val.topicTitle || '',
              levelLabel: val.levelLabel || '',
              pts: val.pts || 0,
              maxPts: val.maxPts || 0,
              ok: val.ok || 0,
              wrong: val.wrong || 0,
              pct: val.pct || 0,
              grade: val.grade || 'B',
              attempts: val.attempts || 1,
              ts: val.ts || new Date().toISOString(),
            };
          });
        }

        return {
          id: lr._id || lr.id,
          bookSlug: slug,
          student: {
            name: lr.student?.name || 'Estudiante',
            school: lr.student?.school || 'Colegio',
            city: lr.student?.city || 'Ciudad',
            teacher: lr.student?.teacher || lr.teacher?.name || '',
            avatar: lr.gamification?.avatar || '🧑‍🚀',
          },
          scores,
          gamification: lr.gamification || createInitialGamificationState(lr.gamification?.avatar || '🧑‍🚀'),
        };
      }
      return null;
    }
    return readLocal(slug);
  }

  /** Guarda el progreso completo. */
  async saveProgress(progress: BookProgress): Promise<BookProgress> {
    const next: BookProgress = { ...progress, updatedAt: new Date().toISOString() };
    const slug = progress.bookSlug || BOOK_SLUG;
    writeLocal(next, slug);
    if (backendEnabled()) {
      // Mapear al DTO esperado por el backend NestJS (learningResultModel)
      const payload = {
        student: {
          name: next.student.name,
          userId: next.student.email || '', 
          school: next.student.school,
          city: next.student.city,
          teacher: next.student.teacher,
        },
        gamification: next.gamification,
        bookScores: next.scores,
      };

      const res = await fetch(`${API_URL}/books/${slug}/progress`, {
        method: 'PUT',
        headers: bookHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Error del servidor al guardar progreso de ${slug}: HTTP ${res.status}`);
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
      // Mapear al DTO de resultados que espera el backend
      const coinsEarned = result.wrong === 0 ? Math.round(result.pts * 1.5) : result.pts;
      const xpEarned = result.pts;
      const starsEarned = result.grade.letter === 'S' ? 3 : result.grade.letter === 'A' ? 2 : 1;

      const payload = {
        xpEarned,
        coinsEarned,
        starsEarned,
        score: {
          key: result.levelKey,
          topicTitle: result.topicTitle,
          levelLabel: result.levelLabel,
          pts: result.pts,
          maxPts: result.maxPts,
          ok: result.ok,
          wrong: result.wrong,
          pct: result.pct,
          grade: result.grade.letter,
        }
      };

      const res = await fetch(`${API_URL}/books/${slug}/results`, {
        method: 'POST',
        headers: bookHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Error del servidor al registrar resultado en ${slug}: HTTP ${res.status}`);
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

  /**
   * Obtiene el reporte detallado jerarquico del backend.
   * Incluye desglose por unidad, tema y nivel con colores y grades.
   * Devuelve null si el backend no está habilitado o no hay datos.
   */
  async getReport(slug: string = BOOK_SLUG): Promise<any | null> {
    if (!backendEnabled()) return null;
    try {
      const res = await fetch(`${API_URL}/books/${slug}/report`, {
        headers: bookHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (error) {
      console.warn('[book-progress] no se pudo obtener el reporte del backend:', error);
    }
    return null;
  }
}

export const bookProgressService = new BookProgressService();
