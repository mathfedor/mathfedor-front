'use client';

import { useBook } from '../context/BookContext';

/** Estantería de insignias (réplica de `openBadgeShelf`): todas las medallas. */
export default function BadgeShelf({ onClose }: { onClose: () => void }) {
  const { catalog, progress } = useBook();
  if (!catalog || !progress) return null;
  const earned = new Set(progress.gamification.earnedBadges);
  const got = catalog.badges.filter((b) => earned.has(b.id)).length;

  return (
    <div className="mg-overlay" onClick={onClose}>
      <div className="mg-card" onClick={(e) => e.stopPropagation()}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="mg-head">
          <div style={{ fontSize: 42 }}>🏅</div>
          <div className="mg-title">Mis Insignias</div>
          <div className="mg-inst">{got} de {catalog.badges.length} conseguidas</div>
        </div>

        <div className="shelf-grid">
          {catalog.badges.map((b) => {
            const has = earned.has(b.id);
            return (
              <div key={b.id} className={`shelf-card${has ? ' got' : ''}`} title={b.tip} style={has ? { background: b.bg, borderColor: b.bc } : undefined}>
                <div className="shelf-emoji">{has ? b.emoji : '🔒'}</div>
                <div className="shelf-name">{b.name}</div>
                <div className="shelf-desc">{has ? b.tip : 'Bloqueada'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
