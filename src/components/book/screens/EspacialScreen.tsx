'use client';

import { useMemo, useState } from 'react';
import { useBook } from '../context/BookContext';
import { bookDiaryService } from '@/services/book-diary.service';
import { bookReportService } from '@/services/book-report.service';
import { bookAudio } from '@/services/book-audio.service';
import ConfettiLayer from '../shared/ConfettiLayer';

/**
 * Reto Espacial Diario (réplica de `openEspacial`): otorga 50 monedas una vez
 * al día y mantiene una racha propia.
 */
export default function EspacialScreen() {
  const { book, progress, goScreen, grantReward } = useBook();
  const initial = useMemo(() => bookDiaryService.getEspacial(), []);
  const summary = useMemo(() => (book && progress ? bookReportService.buildSummary(book, progress) : null), [book, progress]);
  const [doneToday, setDoneToday] = useState(initial.doneToday);
  const [streak, setStreak] = useState(initial.state.streak);
  const [celebrate, setCelebrate] = useState(false);
  if (!book || !progress || !summary) return null;

  const complete = () => {
    if (doneToday) return;
    const newStreak = bookDiaryService.completeEspacial();
    setStreak(newStreak);
    setDoneToday(true);
    setCelebrate(true);
    grantReward(0, 50);
    bookAudio.levelUp();
  };

  return (
    <div className="screen active" id="screen-espacial">
      {celebrate && <ConfettiLayer pieces={50} />}
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div className="esp-hero">
        <div style={{ fontSize: 48 }}>🚀</div>
        <div className="esp-title">Reto Espacial</div>
        <div className="esp-sub">Resuelve 3 problemas para ganar puntos extra</div>
      </div>

      <div className="esp-stats">
        <div className="esp-stat" style={{ background: '#F0EDFF' }}>
          <div className="esp-stat-num" style={{ color: '#6C28B4' }}>{streak}🔥</div>
          <div className="esp-stat-lbl">Racha espacial</div>
        </div>
        <div className="esp-stat" style={{ background: '#FFF8DC' }}>
          <div className="esp-stat-num" style={{ color: '#7A3200' }}>{summary.completedLevels}</div>
          <div className="esp-stat-lbl">Niveles completados</div>
        </div>
      </div>

      {doneToday ? (
        <div className="esp-done">✅ Ya completaste el reto espacial de hoy. ¡Vuelve mañana!</div>
      ) : (
        <div className="esp-todo">
          <b>Hoy te toca:</b> resolver el reto del día para ganar <b>+50 monedas</b>.
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={complete}>
            🚀 ¡Completar reto espacial!
          </button>
        </div>
      )}
    </div>
  );
}
