'use client';

import { useMemo } from 'react';
import { useBook } from '../context/BookContext';
import { bookService } from '@/services/book.service';
import { bookDiaryService } from '@/services/book-diary.service';
import { bookReportService } from '@/services/book-report.service';
import { globalProgressPct } from '../shared/progress.utils';

/**
 * Mi Diario Espacial (réplica de `openDiario`): actividad semanal, estadísticas
 * y consejo de Fedor. Debajo, los capítulos narrativos (`LORE_CHAPTERS`).
 */
export default function DiaryScreen() {
  const { book, progress, goScreen } = useBook();
  const week = useMemo(() => bookDiaryService.getWeek(), []);
  const chapters = useMemo(() => bookService.getLore(), []);
  const summary = useMemo(() => (book && progress ? bookReportService.buildSummary(book, progress) : null), [book, progress]);
  if (!book || !progress || !summary) return null;

  const { days, weekTotal, activeDays, streakDays, bestDay, totalEx, maxEx } = week;
  const mood =
    streakDays >= 5
      ? '🔥 ¡Racha increíble! Eres una estrella.'
      : streakDays >= 3
        ? '🚀 ¡Vas genial! Tres días seguidos.'
        : weekTotal === 0
          ? '👋 ¡Empecemos hoy con un ejercicio!'
          : weekTotal < 5
            ? '💪 ¡Buen comienzo! Sigue practicando.'
            : '✨ ¡Sigue así, explorador!';
  const tip =
    streakDays === 0
      ? 'Hacer aunque sea 1 ejercicio al día construye la racha. ¡Vamos!'
      : streakDays < 3
        ? '¡Sigue! Después de 3 días seguidos desbloqueas un badge de racha.'
        : '¡Eres imparable! Comparte tu progreso con tu profe.';
  const pct = globalProgressPct(book, progress.scores) / 100;

  return (
    <div className="screen active" id="screen-diary">
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div className="diario-hero">
        <div style={{ fontSize: 56, lineHeight: 1 }}>📓</div>
        <div className="diario-title">Mi Diario Espacial</div>
        <div className="diario-mood">{mood}</div>
      </div>

      <div className="diario-stats">
        <DiaryStat ic="🔥" value={streakDays} label="Días seguidos" bg="#FFF4E5" bc="#FFB800" color="#7A3200" />
        <DiaryStat ic="📚" value={summary.completedLevels} label="Niveles" bg="#F0EDFF" bc="#7B2FBE" color="#6C28B4" />
        <DiaryStat ic="✅" value={`${summary.avgPct}%`} label="Promedio" bg="#DCF5EE" bc="#16876A" color="#16876A" />
        <DiaryStat ic="🎯" value={totalEx} label="Ej. total" bg="#E5F4FF" bc="#3AA0FF" color="#0E6BA8" />
      </div>

      <div className="diario-week">
        <div className="diario-week-head">
          <span>📊 Mi semana</span>
          <span className="diario-week-active">{activeDays}/7 días activos</span>
        </div>
        <div className="diario-bars">
          {days.map((d) => {
            const h = d.ex > 0 ? Math.max(12, Math.round((d.ex / maxEx) * 70)) : 4;
            const color = d.isToday ? '#FFB800' : d.ex > 0 ? '#3AA0FF' : '#E0DBED';
            return (
              <div className="diario-bar-col" key={d.key}>
                <div className="diario-bar-val">{d.ex > 0 ? d.ex : ''}</div>
                <div className="diario-bar" style={{ height: `${h}px`, background: color }} />
                <div className="diario-bar-lbl" style={{ color: d.isToday ? '#FFB800' : '#6C28B4' }}>
                  {d.isToday ? 'HOY' : d.label.toUpperCase().slice(0, 3)}
                </div>
                <div className="diario-bar-day">{d.dayNum}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="diario-cards2">
        <div className="diario-best">
          <div className="diario-best-lbl">⭐ MEJOR DÍA</div>
          <div className="diario-best-val">
            {bestDay.ex > 0 ? `${bestDay.date.toLocaleDateString('es-CO', { weekday: 'long' })} · ${bestDay.ex} ej.` : '— aún no'}
          </div>
        </div>
        <div className="diario-week2">
          <div className="diario-week2-lbl">🚀 ESTA SEMANA</div>
          <div className="diario-week2-val">{weekTotal} ejercicios</div>
        </div>
      </div>

      <div className="diario-tip">
        <div className="diario-tip-lbl">💡 CONSEJO DE FEDOR</div>
        <div className="diario-tip-txt">{tip}</div>
      </div>

      {/* Historia narrativa */}
      <div className="sec-title" style={{ marginTop: '1.25rem' }}>📖 La aventura de Fedor</div>
      <div className="diary-list">
        {chapters.map((ch) => {
          const unlocked = pct >= ch.threshold;
          return (
            <div key={ch.id} className={`diary-chapter${unlocked ? '' : ' locked'}`}>
              <div className="dc-head">
                <span className="dc-emoji">{unlocked ? ch.emoji : '🔒'}</span>
                <div>
                  <div className="dc-num">Capítulo {ch.id}</div>
                  <div className="dc-name">{unlocked ? ch.title : 'Capítulo bloqueado'}</div>
                </div>
              </div>
              <div className="dc-text">
                {unlocked ? ch.text : `Llega al ${Math.round(ch.threshold * 100)}% del libro para leerlo.`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiaryStat({ ic, value, label, bg, bc, color }: { ic: string; value: string | number; label: string; bg: string; bc: string; color: string }) {
  return (
    <div className="diario-stat" style={{ background: bg, border: `2px solid ${bc}` }}>
      <div style={{ fontSize: 22 }}>{ic}</div>
      <div className="diario-stat-num" style={{ color }}>{value}</div>
      <div className="diario-stat-lbl" style={{ color }}>{label}</div>
    </div>
  );
}
