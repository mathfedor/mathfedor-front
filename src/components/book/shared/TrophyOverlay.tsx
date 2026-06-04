'use client';

import { useMemo } from 'react';
import type { Badge } from '@/types/gamification.types';

interface Props {
  badge: Badge;
  reward: { xp: number; coins: number };
  index: number;
  total: number;
  onNext: () => void;
}

/** Modal de trofeo (réplica de `showTrophy`): muestra una insignia con su recompensa. */
export default function TrophyOverlay({ badge, reward, index, total, onNext }: Props) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        angle: (i / 14) * 360,
        delay: (i % 7) * 0.06,
      })),
    []
  );

  return (
    <div className="trophy-overlay">
      <div className="trophy-card">
        <div className="trophy-particles" aria-hidden>
          {sparks.map((s, i) => (
            <span key={i} className="trophy-spark-wrap" style={{ transform: `rotate(${s.angle}deg)` }}>
              <span className="trophy-spark" style={{ animationDelay: `${s.delay}s` }} />
            </span>
          ))}
        </div>
        <span className="trophy-emoji">{badge.emoji}</span>
        <div className="trophy-name">{badge.name}</div>
        <div className="trophy-tip">{badge.tip}</div>
        <div className="trophy-reward">
          <span style={{ color: '#F5C518' }}>+{reward.xp} XP</span>
          <span style={{ color: '#FF8C2A' }}>+{reward.coins} 🪙</span>
        </div>
        <button className="cel-btn" onClick={onNext}>
          {total > 1 ? `¡Genial! (${index + 1}/${total})` : '¡Genial!'}
        </button>
      </div>
    </div>
  );
}
