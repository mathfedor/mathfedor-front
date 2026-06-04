'use client';

import { useMemo } from 'react';

const COLORS = ['#E8650A', '#6C28B4', '#16876A', '#F5A623', '#FF6B6B', '#4ECDC4', '#FFE66D'];

/** Lluvia de confeti (réplica de `confetti()` del HTML). */
export default function ConfettiLayer({ pieces = 70 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, () => ({
        left: Math.random() * 100,
        bg: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 5 + Math.random() * 8,
        h: 5 + Math.random() * 8,
        round: Math.random() > 0.5 ? '50%' : '2px',
        delay: Math.random() * 0.6,
        dur: 2.6 + Math.random() * 1.4,
      })),
    [pieces]
  );

  return (
    <div className="cf-layer" aria-hidden>
      {items.map((c, i) => (
        <div
          key={i}
          className="cf"
          style={{
            left: `${c.left}%`,
            background: c.bg,
            width: `${c.w}px`,
            height: `${c.h}px`,
            borderRadius: c.round,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
