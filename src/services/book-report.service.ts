/**
 * Reporte docente y análisis IA del libro "Matemáticas de Fedor 2°".
 * Mock mientras no exista el endpoint de IA; backend-ready vía
 * `/books/{slug}/ai-analysis`.
 */

import type { BookProgress, AIAnalysis, LevelScore } from '@/types/book-progress.types';
import type { Book } from '@/types/book.types';

import { BOOK_API_URL as API_URL, BOOK_SLUG, bookBackendEnabled as backendEnabled, bookHeaders } from './book-http';

/** Resumen agregado del desempeño del estudiante. */
export interface BookReportSummary {
  totalLevels: number;
  completedLevels: number;
  avgPct: number;
  bestUnit: string | null;
  weakestUnit: string | null;
  perUnit: Array<{ unit: string; completed: number; total: number; avgPct: number }>;
}

export const bookReportService = {
  /** Construye el resumen agregado a partir del progreso y el currículo. */
  buildSummary(book: Book, progress: BookProgress): BookReportSummary {
    const scores = Object.values(progress.scores);
    const perUnit = book.units.map((unit) => {
      const totalLevels = unit.topics.reduce((acc, t) => acc + t.levels.length, 0);
      const unitScores: LevelScore[] = scores.filter((s) => s.key.startsWith(`u${unit.index}t`));
      const avgPct = unitScores.length
        ? Math.round(unitScores.reduce((a, s) => a + s.pct, 0) / unitScores.length)
        : 0;
      return { unit: unit.short, completed: unitScores.length, total: totalLevels, avgPct };
    });

    const totalLevels = perUnit.reduce((a, u) => a + u.total, 0);
    const completedLevels = perUnit.reduce((a, u) => a + u.completed, 0);
    const avgPct = scores.length
      ? Math.round(scores.reduce((a, s) => a + s.pct, 0) / scores.length)
      : 0;

    const withData = perUnit.filter((u) => u.completed > 0);
    const bestUnit = withData.length
      ? withData.reduce((b, u) => (u.avgPct > b.avgPct ? u : b)).unit
      : null;
    const weakestUnit = withData.length
      ? withData.reduce((w, u) => (u.avgPct < w.avgPct ? u : w)).unit
      : null;

    return { totalLevels, completedLevels, avgPct, bestUnit, weakestUnit, perUnit };
  },

  /** Genera el análisis IA (mock determinista; backend-ready). */
  async generateAIAnalysis(book: Book, progress: BookProgress): Promise<AIAnalysis> {
    if (backendEnabled()) {
      try {
        const res = await fetch(`${API_URL}/books/${BOOK_SLUG}/ai-analysis`, {
          method: 'POST',
          headers: bookHeaders(),
          body: JSON.stringify({ scores: progress.scores }),
        });
        if (res.ok) return (await res.json()) as AIAnalysis;
      } catch (error) {
        console.warn('[book-report] usando análisis mock:', error);
      }
    }

    const summary = this.buildSummary(book, progress);
    const name = progress.student.name || 'el estudiante';
    return {
      teacher: `${name} ha completado ${summary.completedLevels} de ${summary.totalLevels} niveles con un promedio del ${summary.avgPct}%. ${
        summary.bestUnit ? `Mayor dominio en ${summary.bestUnit}.` : ''
      } ${summary.weakestUnit ? `Recomendado reforzar ${summary.weakestUnit}.` : ''}`.trim(),
      family: `En casa pueden felicitar a ${name} por su constancia. Practiquen 10 minutos diarios${
        summary.weakestUnit ? `, especialmente ${summary.weakestUnit}` : ''
      } usando objetos cotidianos para contar y agrupar.`,
      positive: summary.bestUnit
        ? `Destaca en ${summary.bestUnit}. Mantiene buena concentración y resuelve con seguridad los niveles básicos.`
        : 'Muestra disposición para empezar y explorar los primeros niveles.',
      improve: summary.weakestUnit
        ? `Conviene repasar ${summary.weakestUnit} con ejemplos guiados antes de avanzar de nivel.`
        : 'Continuar avanzando para identificar áreas de refuerzo.',
    };
  },
};
