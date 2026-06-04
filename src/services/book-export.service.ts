/**
 * Exportación e impresión del informe del libro.
 * Portado de `downloadBook` / `doExport` / `printReport` del HTML original.
 * Son utilidades de cliente; no requieren backend.
 */

import type { BookProgress } from '@/types/book-progress.types';

function slugifyName(name: string): string {
  return (name || 'estudiante')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const bookExportService = {
  /** Descarga el progreso completo como archivo JSON (respaldo / docente). */
  exportProgressJson(progress: BookProgress): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fedor2-progreso-${slugifyName(progress.student.name)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /** Abre el diálogo de impresión del navegador (permite "Guardar como PDF"). */
  printReport(): void {
    if (typeof window === 'undefined') return;
    window.print();
  },
};
