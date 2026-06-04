'use client';

import ConfettiLayer from './ConfettiLayer';

/** Overlay de subida de rango (réplica de `checkRankUp`). */
export default function RankUpOverlay({ from, to, onClose }: { from: string; to: string; onClose: () => void }) {
  return (
    <div className="rankup-overlay">
      <ConfettiLayer pieces={80} />
      <div className="rankup-card">
        <div className="rankup-kicker">¡SUBISTE DE RANGO!</div>
        <div className="rankup-arrow">
          <span className="rankup-from">{from}</span>
          <span className="rankup-sep">→</span>
          <span className="rankup-to">{to}</span>
        </div>
        <div className="rankup-reward">+100 🪙</div>
        <button className="cel-btn" onClick={onClose}>🚀 ¡Continuar!</button>
      </div>
    </div>
  );
}
