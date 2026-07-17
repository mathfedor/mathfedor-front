'use client';

import { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import Starfield from '../shared/Starfield';
import UnitTutorialOverlay from '../shared/UnitTutorialOverlay';
import { bookService } from '@/services/book.service';
import { levelKey, topicCompletedLevels } from '../shared/progress.utils';
import type { UnitTutorial } from '@/types/book.types';
import { computeGrade } from '@/services/gamification.service';

/** Detalle de una unidad: temas y sus niveles desbloqueables. */
export default function UnitScreen() {
  const { book, progress, currentUnit, openLesson, goScreen } = useBook();
  const [tut, setTut] = useState<UnitTutorial | null>(null);
  const isGrade1 = book?.slug === 'libro-1ro';

  // Muestra el tutorial cada vez que se entra a una unidad (comportamiento del HTML original).
  useEffect(() => {
    bookService.getUnitTutorial(currentUnit, book?.slug).then((t) => {
      if (t) setTut(t);
    }).catch(() => { /* sin tutorial */ });
  }, [currentUnit, book?.slug]);

  const closeTut = () => setTut(null);

  if (!book || !progress) return null;
  const unit = book.units[currentUnit];
  if (!unit) return null;

  return (
    <div className="screen active" id="screen-unit">
      {tut && <UnitTutorialOverlay tut={tut} onClose={closeTut} />}

      {book?.slug === 'libro-1ro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1.25rem' }}>
          <div
            className="feat-btn"
            onClick={() => goScreen('estandares')}
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0 }}
          >
            <div className="feat-icon" style={{ background: '#fff', fontSize: '26px', border: '1.5px solid #C5BFEE', boxShadow: 'none' }}>
              🇨🇴
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Estándares MEN</div>
              <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Programa de 1° Colombia</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>

          <div
            className="feat-btn"
            onClick={() => goScreen('problemas')}
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0 }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)', color: '#fff' }}>
              🛒
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Problemas Cotidianos</div>
              <div className="feat-meta">Conteo de monedas + compras + 4 operaciones</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      )}

      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div className={`unit-hero-band ${unit.heroCls}`}>
        <Starfield count={30} />
        <span className="uhb-icon">{unit.icon}</span>
        <div className="uhb-title" style={{ position: 'relative', zIndex: 1 }}>
          {isGrade1 ? `${unit.short} — ${unit.name}` : unit.short}
        </div>
        <div className="uhb-sub" style={{ position: 'relative', zIndex: 1 }}>
          {isGrade1 ? unit.name : unit.name}
        </div>
        <span className="uhb-standard">{unit.std}</span>
      </div>

      <div className="topics-list">
        {unit.topics.map((topic, ti) => {
          if (isGrade1) {
            return (
              <div key={topic.id} style={{ display: 'contents' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '1.25rem 0 .4rem', paddingLeft: '4px', textAlign: 'left' }}>
                  {topic.icon} {topic.title}
                </div>
                {topic.levels.map((level, li) => {
                  const key = levelKey(unit.index, ti, li);
                  const score = progress.scores[key];
                  const done = !!score;
                  const g = done ? computeGrade(score.pts, score.maxPts) : null;
                  const emoji = done ? '🎉' : ['🟢', '🟡', '🔴', '🟣', '🔵'][li] || '⭐';

                  return (
                    <div
                      key={key}
                      className={`tc${done ? ' done' : ''}`}
                      onClick={() => openLesson({ unitIndex: unit.index, topicIndex: ti, levelIndex: li })}
                      style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '14px', width: '100%', cursor: 'pointer' }}
                    >
                      <div className="tc-icon" style={{ background: level.bg }}>{emoji}</div>
                      <div className="tc-body" style={{ textAlign: 'left', flex: 1 }}>
                        <div className="tc-name" style={{ fontWeight: 900 }}>{level.label}</div>
                        <div className="tc-desc" style={{ fontSize: '11px', color: done ? 'rgba(255,255,255,.92)' : 'var(--muted)' }}>{topic.desc}</div>
                        <div className="level-indicator">
                          <div className={`lv-dot ${li >= 0 ? 'fill-1' : ''}`}></div>
                          <div className={`lv-dot ${li >= 1 ? 'fill-2' : ''}`}></div>
                          <div className={`lv-dot ${li >= 2 ? 'fill-3' : ''}`}></div>
                          <div className={`lv-dot ${li >= 3 ? 'fill-4' : ''}`}></div>
                          <div className={`lv-dot ${li >= 4 ? 'fill-5' : ''}`}></div>
                        </div>
                      </div>
                      <div className="tc-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', minWidth: '130px' }}>
                        {done && g ? (
                          <div className="tc-score-panel" style={{ textAlign: 'right', background: 'linear-gradient(135deg,#FFF7E0,#FFE9C4)', border: '2px solid #FFB066', borderRadius: '12px', padding: '6px 10px', minWidth: '118px' }}>
                            <span className={`tc-grade ${g.cls}`} style={{ fontSize: '11px', padding: '3px 9px', display: 'inline-block', marginBottom: '4px', fontWeight: 900 }}>{g.lbl}</span>
                            <div style={{ fontSize: '13px', lineHeight: 1.05, margin: '2px 0', color: '#000' }}>{g.stars || ''}</div>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#7A1B00', fontFamily: "'Baloo 2', sans-serif" }}>{score.pts}<span style={{ opacity: .55, fontWeight: 800 }}>/{score.maxPts}</span></div>
                            <div style={{ height: '6px', background: '#F5E1C4', borderRadius: '3px', margin: '4px 0 3px', overflow: 'hidden' }}>
                              <div style={{ height: '6px', width: `${g.pct}%`, backgroundColor: g.barColor || '#16876A', borderRadius: '3px', transition: 'width .6s' }}></div>
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 900, color: g.barColor || '#0B7A56' }}>{g.pct}% resuelto</div>
                          </div>
                        ) : (
                          <div className="tc-pending-pill" style={{ textAlign: 'right', background: '#F8F5FF', border: '1.5px dashed #C5BFEE', borderRadius: '12px', padding: '5px 10px', fontSize: '11px', fontWeight: 900, color: '#6C28B4' }}>
                            Sin resolver
                          </div>
                        )}
                        <span className="tc-arrow" style={{ fontSize: '20px' }}>{done ? '🏆' : '▶️'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

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
                  return (
                    <button
                      key={key}
                      className="level-chip"
                      onClick={() => openLesson({ unitIndex: unit.index, topicIndex: ti, levelIndex: li })}
                      style={{
                        background: score ? '#DCF5EE' : level.bg,
                        color: level.color,
                        border: `1.5px solid ${score ? '#95DAC4' : 'transparent'}`,
                        borderRadius: 12,
                        padding: '8px 12px',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {score ? '✅ ' : ''}
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

