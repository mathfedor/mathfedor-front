'use client';

import type { BookReportSummary } from '@/services/book-report.service';
import type { Grade } from '@/types/book-progress.types';

export interface GradeCounts {
  S: number;
  A: number;
  B: number;
  L: number;
}

const GRADE_META: Array<{ key: keyof GradeCounts; label: string; color: string; grad: string }> = [
  { key: 'S', label: 'Superior', color: '#06A570', grad: 'linear-gradient(180deg,#24C496,#06A570)' },
  { key: 'A', label: 'Alto', color: '#1A6CB4', grad: 'linear-gradient(180deg,#3D9BE8,#1A6CB4)' },
  { key: 'B', label: 'Básico', color: '#BA7517', grad: 'linear-gradient(180deg,#F5C518,#BA7517)' },
  { key: 'L', label: 'Bajo', color: '#C94B22', grad: 'linear-gradient(180deg,#FF6B6B,#C94B22)' },
];

/** Gráficas del informe docente: desempeño por unidad y distribución de notas. */
export default function ReportCharts({
  summary,
  gradeCounts,
}: {
  summary: BookReportSummary;
  gradeCounts: GradeCounts;
}) {
  const totalGraded = GRADE_META.reduce((a, g) => a + gradeCounts[g.key], 0);

  return (
    <div className="rc-wrap">
      <div className="rc-card">
        <div className="rc-title">🎓 Distribución de calificaciones</div>
        {totalGraded === 0 ? (
          <div className="rc-empty">Completa niveles para ver la distribución.</div>
        ) : (
          <>
            <div className="rc-stacked">
              {GRADE_META.map((g) => {
                const pct = (gradeCounts[g.key] / totalGraded) * 100;
                if (pct === 0) return null;
                return <div key={g.key} className="rc-stacked-seg" style={{ width: `${pct}%`, background: g.grad }} title={`${g.label}: ${gradeCounts[g.key]}`} />;
              })}
            </div>
            <div className="rc-legend">
              {GRADE_META.map((g) => (
                <span className="rc-legend-item" key={g.key}>
                  <span className="rc-dot" style={{ background: g.color }} />
                  {g.label} · {gradeCounts[g.key]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function barColor(pct: number): string {
  if (pct >= 90) return 'linear-gradient(90deg,#24C496,#06A570)';
  if (pct >= 70) return 'linear-gradient(90deg,#3D9BE8,#1A6CB4)';
  if (pct >= 50) return 'linear-gradient(90deg,#F5C518,#BA7517)';
  return 'linear-gradient(90deg,#FF6B6B,#C94B22)';
}

/** Cuenta las calificaciones por letra a partir de un arreglo de letras. */
export function countGrades(letters: Array<Grade['letter']>): GradeCounts {
  return letters.reduce<GradeCounts>(
    (acc, l) => {
      acc[l] += 1;
      return acc;
    },
    { S: 0, A: 0, B: 0, L: 0 }
  );
}
