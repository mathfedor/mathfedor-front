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
  const { lastResult, goScreen, newBadges, catalog, rankUp, clearRankUp } = useBook();
  const freshBadges = catalog ? resolveBadges(catalog, newBadges) : [];
  const [phase, setPhase] = useState<OverlayPhase>('cel');
  const [trophyIdx, setTrophyIdx] = useState(0);

  // Fanfarria y reinicio de la secuencia al mostrar el resultado.
  useEffect(() => {
    if (lastResult) {
      bookAudio.levelUp();
      setPhase('cel');
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

  const { grade, ok, wrong, pts, maxPts, topicTitle, levelLabel } = lastResult;

  // Secuencia: celebración → trofeos (uno por insignia) → subida de rango.
  const afterCelebration = () => {
    if (freshBadges.length > 0) setPhase('trophy');
    else if (rankUp) setPhase('rank');
    else setPhase('done');
  };
  const afterTrophy = () => {
    if (trophyIdx + 1 < freshBadges.length) setTrophyIdx((i) => i + 1);
    else if (rankUp) setPhase('rank');
    else setPhase('done');
  };
  const afterRank = () => {
    clearRankUp();
    setPhase('done');
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
