'use client';

import { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import { resolveBadges, getBadgeReward } from '@/services/gamification.service';
import { bookAudio } from '@/services/book-audio.service';
import CelebrationOverlay from '../shared/CelebrationOverlay';
import TrophyOverlay from '../shared/TrophyOverlay';
import RankUpOverlay from '../shared/RankUpOverlay';

type OverlayPhase = 'cel' | 'trophy' | 'rank' | 'done';

/** Resultado de la lección recién completada. */
export default function ResultsScreen() {
  const { lastResult, goScreen, newBadges, catalog, rankUp, clearRankUp, book, currentLevel, openLesson } = useBook();
  const freshBadges = catalog ? resolveBadges(catalog, newBadges) : [];
  const [phase, setPhase] = useState<OverlayPhase>('cel');
  const [trophyIdx, setTrophyIdx] = useState(0);

  // Fanfarria y reinicio de la secuencia al mostrar el resultado.
  useEffect(() => {
    if (lastResult) {
      if (lastResult.pct < 50) {
        bookAudio.wrong();
        setPhase('done');
      } else {
        bookAudio.levelUp();
        setPhase('cel');
      }
      setTrophyIdx(0);
    }
  }, [lastResult]);

  if (!lastResult) {
    return (
      <div className="screen active" id="screen-results">
        <div className="back-row" onClick={() => goScreen('home')}>← Inicio</div>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Aún no hay resultados.</p>
      </div>
    );
  }

  const { grade, ok, wrong, pct, pts, maxPts, topicTitle, levelLabel } = lastResult;

  const handleNextLevel = () => {
    if (book && currentLevel) {
      const unit = book.units[currentLevel.unitIndex];
      const topic = unit?.topics[currentLevel.topicIndex];
      if (topic && currentLevel.levelIndex + 1 < topic.levels.length) {
        openLesson({
          ...currentLevel,
          levelIndex: currentLevel.levelIndex + 1,
        });
        return;
      }
    }
    goScreen('unit');
  };

  // Secuencia: celebración → trofeos (uno por insignia) → subida de rango.
  const afterCelebration = () => {
    if (freshBadges.length > 0) setPhase('trophy');
    else if (rankUp) setPhase('rank');
    else handleNextLevel();
  };
  const afterTrophy = () => {
    if (trophyIdx + 1 < freshBadges.length) setTrophyIdx((i) => i + 1);
    else if (rankUp) setPhase('rank');
    else handleNextLevel();
  };
  const afterRank = () => {
    clearRankUp();
    handleNextLevel();
  };

  const currentBadge = freshBadges[trophyIdx];

  return (
    <div className="screen active" id="screen-results">
      {phase === 'cel' && (
        <CelebrationOverlay
          pct={grade.pct}
          pts={pts}
          topicTitle={topicTitle}
          levelLabel={levelLabel}
          okCount={ok}
          total={ok + wrong}
          onNext={afterCelebration}
          onAllTopics={() => goScreen('unit')}
        />
      )}
      {phase === 'trophy' && currentBadge && (
        <TrophyOverlay
          badge={currentBadge}
          reward={getBadgeReward(currentBadge.id)}
          index={trophyIdx}
          total={freshBadges.length}
          onNext={afterTrophy}
        />
      )}
      {phase === 'rank' && rankUp && <RankUpOverlay from={rankUp.from} to={rankUp.to} onClose={afterRank} />}
      {pct < 50 ? (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '2px solid rgba(0,0,0,.08)' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(160deg, #140830, #2A0F6A 60%, #0A2820)', padding: '2rem 1.5rem', textAlign: 'center', color: '#fff', position: 'relative' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px', animation: 'float 3s ease-in-out infinite' }}>📚</div>
            <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
              Sigue estudiando
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.72)', margin: '0 0 16px', fontWeight: 700 }}>
              Repasa el nivel y vuelve a intentarlo. ¡Tú puedes!
            </p>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFE066', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.1 }}>
              {pts}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '12px' }}>
              puntos espaciales
            </div>
            <div className={`rg-badge ${grade.cls}`} style={{ display: 'inline-block', padding: '5px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, color: '#fff', background: grade.barColor }}>
              {grade.lbl}
            </div>
          </div>

          {/* Body stats */}
          <div style={{ padding: '1.25rem 1.5rem 0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>✅</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#16876A', fontFamily: "'Baloo 2', sans-serif" }}>{ok}</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Correctas</div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>❌</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#C94B22', fontFamily: "'Baloo 2', sans-serif" }}>{wrong}</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Fallidas</div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>🎯</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#888', fontFamily: "'Baloo 2', sans-serif" }}>{pct}%</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Precisión</div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>📝</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#BA7517', fontFamily: "'Baloo 2', sans-serif" }}>{grade.num}</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Nota</div>
              </div>
            </div>
          </div>

          {/* Revision de respuestas */}
          <div style={{ padding: '0 1.5rem 1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', margin: '1rem 0 0.75rem', color: 'var(--text)' }}>
              📋 Revisión de respuestas
            </h3>
            
            <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1.5px solid var(--border)', borderRadius: '12px', background: 'var(--white)' }}>
              {lastResult.attempts.map((att, attIdx) => {
                return (
                  <div 
                    key={attIdx} 
                    style={{ 
                      padding: '10px 14px', 
                      borderBottom: attIdx < lastResult.attempts.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>
                      {att.isCorrect ? '✅' : '❌'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: 'var(--text)' }}>
                        Ej.{attIdx + 1}: {att.q || 'Pregunta de práctica'}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: att.isCorrect ? '#16876A' : '#C94B22', marginTop: '2px' }}>
                        {att.isCorrect ? '+40 pts' : `Correcto: ${att.correctAnswer}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => goScreen('unit')}>Repetir / Otros niveles</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => goScreen('home')}>Continuar →</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="results-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', background: 'var(--white)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: 64, animation: 'medalPop .6s ease' }}>{grade.letter === 'S' ? '🏆' : grade.letter === 'A' ? '🌟' : grade.letter === 'B' ? '📘' : '💪'}</div>
          <div className={`rg-badge ${grade.cls}`} style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, fontWeight: 900, margin: '8px 0', color: '#fff', background: grade.barColor }}>
            {grade.lbl} · {grade.num}
          </div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{grade.stars}</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{topicTitle} · {levelLabel}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '1.5rem 0' }}>
          <ResultStat value={`${grade.pct}%`} label="Desempeño" color={grade.barColor} />
          <ResultStat value={ok} label="Correctas ✅" color="#16876A" />
          <ResultStat value={wrong} label="Incorrectas" color="#C94B22" />
        </div>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
          {grade.adaptive}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>+{pts} XP de {maxPts} posibles</div>

        {freshBadges.length > 0 && (
          <div style={{ marginTop: '1.25rem', background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px' }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
              🎉 ¡Nuevas insignias!
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {freshBadges.map((b) => {
                const r = getBadgeReward(b.id);
                return (
                  <div key={b.id} title={b.tip} style={{ textAlign: 'center', padding: '8px 10px', borderRadius: 12, background: b.bg, border: `1.5px solid ${b.bc}`, animation: 'medalPop .6s ease' }}>
                    <div style={{ fontSize: 24 }}>{b.emoji}</div>
                    <div style={{ fontSize: 9, fontWeight: 800 }}>{b.name}</div>
                    <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--orange-d)' }}>+{r.xp}XP · +{r.coins}🪙</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => goScreen('unit')}>Repetir / Otros niveles</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => goScreen('home')}>Continuar →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultStat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "'Baloo 2',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
