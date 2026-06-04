'use client';

import { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import Starfield from '../shared/Starfield';
import UnitTutorialOverlay from '../shared/UnitTutorialOverlay';
import { bookService } from '@/services/book.service';
import { levelKey, topicCompletedLevels } from '../shared/progress.utils';
import type { UnitTutorial } from '@/types/book.types';

const TUT_DONE_KEY = 'fedor2_unit_tut_done';

function readDone(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(TUT_DONE_KEY) || '[]') as number[];
  } catch {
    return [];
  }
}

/** Detalle de una unidad: temas y sus niveles desbloqueables. */
export default function UnitScreen() {
  const { book, progress, currentUnit, openLesson, goScreen } = useBook();
  const [tut, setTut] = useState<UnitTutorial | null>(null);

  // Muestra el tutorial de la unidad en la primera visita.
  useEffect(() => {
    const done = readDone();
    if (done.includes(currentUnit)) return;
    const t = bookService.getUnitTutorial(currentUnit);
    if (t) setTut(t);
  }, [currentUnit]);

  const closeTut = () => {
    setTut(null);
    if (typeof window !== 'undefined') {
      const done = readDone();
      if (!done.includes(currentUnit)) {
        try {
          window.localStorage.setItem(TUT_DONE_KEY, JSON.stringify([...done, currentUnit]));
        } catch {
          /* almacenamiento no disponible */
        }
      }
    }
  };

  if (!book || !progress) return null;
  const unit = book.units[currentUnit];
  if (!unit) return null;

  return (
    <div className="screen active" id="screen-unit">
      {tut && <UnitTutorialOverlay tut={tut} onClose={closeTut} />}
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div className={`unit-hero-band ${unit.heroCls}`}>
        <Starfield count={30} />
        <span className="uhb-icon">{unit.icon}</span>
        <div className="uhb-title" style={{ position: 'relative', zIndex: 1 }}>{unit.short}</div>
        <div className="uhb-sub" style={{ position: 'relative', zIndex: 1 }}>{unit.name}</div>
        <span className="uhb-standard">{unit.std}</span>
      </div>

      <div className="topics-list">
        {unit.topics.map((topic, ti) => {
          const done = topicCompletedLevels(unit.index, ti, topic.levels.length, progress.scores);
          return (
            <div className="topic-card" key={topic.id} style={{ marginBottom: '1rem' }}>
              <div className="tc-head" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.6rem' }}>
                <span className="tc-icon" style={{ fontSize: 26 }}>{topic.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="tc-title" style={{ fontWeight: 900 }}>{topic.title}</div>
                  <div className="tc-desc" style={{ fontSize: 12, color: 'var(--muted)' }}>{topic.desc}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--purple)' }}>
                  {done}/{topic.levels.length}
                </div>
              </div>

              <div className="level-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topic.levels.map((level, li) => {
                  const key = levelKey(unit.index, ti, li);
                  const score = progress.scores[key];
                  const prevDone = li === 0 || progress.scores[levelKey(unit.index, ti, li - 1)];
                  const locked = !prevDone && !score;
                  return (
                    <button
                      key={key}
                      className="level-chip"
                      disabled={locked}
                      onClick={() => openLesson({ unitIndex: unit.index, topicIndex: ti, levelIndex: li })}
                      style={{
                        background: score ? '#DCF5EE' : level.bg,
                        color: level.color,
                        border: `1.5px solid ${score ? '#95DAC4' : 'transparent'}`,
                        borderRadius: 12,
                        padding: '8px 12px',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: locked ? 'not-allowed' : 'pointer',
                        opacity: locked ? 0.45 : 1,
                      }}
                    >
                      {locked ? '🔒 ' : score ? '✅ ' : ''}
                      {level.short}
                      {score ? ` · ${score.pct}%` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
