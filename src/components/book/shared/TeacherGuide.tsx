'use client';

import { useMemo } from 'react';
import { useBook } from '../context/BookContext';
import { bookReportService } from '@/services/book-report.service';
import { bookExportService } from '@/services/book-export.service';

/**
 * Guía del Profesor imprimible (réplica de `showTeacherGuide`).
 * Reporte de progreso del estudiante con tabla por unidad y recomendaciones.
 */
export default function TeacherGuide({ onClose }: { onClose: () => void }) {
  const { book, progress } = useBook();
  const summary = useMemo(() => (book && progress ? bookReportService.buildSummary(book, progress) : null), [book, progress]);
  if (!book || !progress || !summary) return null;

  const g = progress.gamification;

  return (
    <div className="tg-overlay" onClick={onClose}>
      <div className="tg-card" onClick={(e) => e.stopPropagation()}>
        <div className="tg-header">
          <div>
            <div className="tg-title">👩‍🏫 Guía del Profesor</div>
            <div className="tg-subtitle">Reporte de progreso del estudiante</div>
          </div>
          <button className="tg-close no-print" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="tg-body">
          <div className="tg-student">
            <div className="tg-student-title">Estudiante</div>
            <div>Nombre: <b>{progress.student.name || 'No registrado'}</b></div>
            <div>Colegio: <b>{progress.student.school || '—'}</b></div>
            <div>Docente: <b>{progress.student.teacher || '—'}</b></div>
          </div>

          <div className="tg-stats">
            <div className="tg-stat tg-stat-xp"><div className="tg-stat-ic">⭐</div><div className="tg-stat-num">{g.totalXP}</div><div className="tg-stat-lbl">XP Total</div></div>
            <div className="tg-stat tg-stat-streak"><div className="tg-stat-ic">🔥</div><div className="tg-stat-num">{g.maxStreak}</div><div className="tg-stat-lbl">Mejor racha</div></div>
            <div className="tg-stat tg-stat-badges"><div className="tg-stat-ic">🏆</div><div className="tg-stat-num">{g.earnedBadges.length}</div><div className="tg-stat-lbl">Insignias</div></div>
          </div>

          <h4 className="tg-h4">Progreso por unidad</h4>
          <table className="tg-table">
            <thead>
              <tr><th style={{ textAlign: 'left' }}>Unidad</th><th>Niveles</th><th>Promedio</th></tr>
            </thead>
            <tbody>
              {summary.perUnit.map((u) => (
                <tr key={u.unit}>
                  <td style={{ textAlign: 'left', fontWeight: 800 }}>{u.unit}</td>
                  <td style={{ textAlign: 'center' }}>{u.completed}/{u.total}</td>
                  <td style={{ textAlign: 'center' }}>{u.avgPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="tg-h4">📋 Recomendaciones pedagógicas</h4>
          <ul className="tg-recs">
            <li>Practicar <b>15-20 minutos al día</b> es mejor que sesiones largas ocasionales.</li>
            <li>Si un nivel sale por debajo del 70%, conviene <b>repasarlo</b> antes de avanzar.</li>
            <li>{'La sección "Descomposición Posicional" 🔢 es excelente apoyo para Sistema Decimal.'}</li>
            <li>El Laboratorio de Estadística permite explorar gráficos antes de hacer ejercicios.</li>
            <li>Felicitar verbalmente cuando se complete una unidad refuerza la motivación.</li>
          </ul>

          <div className="tg-actions no-print">
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => bookExportService.printReport()}>🖨️ Imprimir / PDF</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
