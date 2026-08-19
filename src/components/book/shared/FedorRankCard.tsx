'use client';

import { useMemo } from 'react';
import { useBook } from '../context/BookContext';

export const FEDOR2_RANKS = [
  { id: 0, emoji: '🌱', name: 'Cadete Estelar', xp: 0, color: '#22C55E', desc: '¡Bienvenido a la academia! Empieza tu aventura.' },
  { id: 1, emoji: '🐣', name: 'Aprendiz Lunar', xp: 100, color: '#3AA0FF', desc: 'Ya conoces el camino. Sigue resolviendo bloques.' },
  { id: 2, emoji: '🚀', name: 'Explorador Cósmico', xp: 300, color: '#9B5CFF', desc: 'Tu nave vuela alto. ¡Conquista las galaxias!' },
  { id: 3, emoji: '⭐', name: 'Veterano del Espacio', xp: 700, color: '#F5C518', desc: 'Brillas como una estrella. Los maestros te admiran.' },
  { id: 4, emoji: '🏆', name: 'Maestro Galáctico', xp: 1400, color: '#FF8C2A', desc: 'Eres un campeón. Pocos llegan hasta aquí.' },
  { id: 5, emoji: '☄️', name: 'Leyenda de Fedor', xp: 2500, color: '#FF1D4E', desc: '¡INCREÍBLE! Tu nombre se escribe en las estrellas.' },
];

export default function FedorRankCard({ onClick }: { onClick?: () => void }) {
  const { progress } = useBook();

  const totalXP = useMemo(() => {
    if (!progress || !progress.scores) return 0;
    return Object.values(progress.scores).reduce((sum, s) => sum + (s.pts || 0), 0);
  }, [progress]);

  const { curRank, nextRank, progressPct } = useMemo(() => {
    let cur = FEDOR2_RANKS[0];
    for (let i = 0; i < FEDOR2_RANKS.length; i++) {
      if (totalXP >= FEDOR2_RANKS[i].xp) {
        cur = FEDOR2_RANKS[i];
      }
    }
    let nxt: (typeof FEDOR2_RANKS)[0] | null = null;
    for (let i = 0; i < FEDOR2_RANKS.length; i++) {
      if (totalXP < FEDOR2_RANKS[i].xp) {
        nxt = FEDOR2_RANKS[i];
        break;
      }
    }

    let pct = 0;
    if (nxt) {
      pct = Math.min(100, Math.max(0, ((totalXP - cur.xp) / (nxt.xp - cur.xp)) * 100));
    } else {
      pct = 100;
    }

    return { curRank: cur, nextRank: nxt, progressPct: pct };
  }, [totalXP]);

  return (
    <div
      id="fedorRankCard"
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1E0848 0%, #3D1468 50%, #6C28B4 100%)',
        borderRadius: '18px',
        padding: '1rem 1.2rem',
        margin: '.85rem 0',
        color: '#fff',
        boxShadow: '0 12px 36px rgba(60,20,104,.5), inset 0 0 30px rgba(255,255,255,.08)',
        border: '2px solid rgba(245,197,24,.5)',
        overflow: 'hidden',
        zIndex: 5,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        #fedorRankCard::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(245,197,24,.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(91,191,255,.2), transparent 60%);
          pointer-events: none;
          animation: rankAura 4s ease-in-out infinite;
        }
        @keyframes rankAura {
          0%, 100% { opacity: .6; }
          50% { opacity: 1; }
        }
        @keyframes rankBob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
      `}</style>

      {/* Header Info */}
      <div
        className="rank-head"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '.7rem',
        }}
      >
        <div
          className="rank-emoji"
          style={{
            fontSize: '48px',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 14px rgba(245,197,24,.7))',
            animation: 'rankBob 2.2s ease-in-out infinite',
            userSelect: 'none',
          }}
        >
          {curRank.emoji}
        </div>
        <div className="rank-info" style={{ flex: 1 }}>
          <div
            className="rank-name"
            style={{
              fontSize: '19px',
              fontWeight: 900,
              color: curRank.color,
              fontFamily: "'Baloo 2', sans-serif",
              textShadow: '0 2px 8px rgba(0,0,0,.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {curRank.name}
          </div>
          <div
            className="rank-xp"
            style={{
              fontSize: '12px',
              color: '#C5BFEE',
              fontWeight: 800,
              marginTop: '2px',
            }}
          >
            {totalXP} XP totales
          </div>
          <div
            className="rank-desc"
            style={{
              fontSize: '11.5px',
              color: 'rgba(255,255,255,.9)',
              fontWeight: 700,
              marginTop: '4px',
              fontStyle: 'italic',
            }}
          >
            {curRank.desc}
          </div>
        </div>
      </div>

      {/* Progress Bar Groove */}
      <div
        className="rank-bar-wrap"
        style={{
          position: 'relative',
          zIndex: 2,
          height: '10px',
          background: 'rgba(0,0,0,.4)',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,.2)',
        }}
      >
        <div
          className="rank-bar-fill"
          style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #F5C518, #FF8C2A, #FF1D4E)',
            borderRadius: '6px',
            transition: 'width .8s cubic-bezier(.34,1.56,.64,1)',
            boxShadow: '0 0 12px rgba(245,197,24,.8)',
          }}
        />
      </div>

      {/* Progress Next Label */}
      <div
        className="rank-progress-lbl"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          fontSize: '11.5px',
          fontWeight: 900,
          color: '#FFD66B',
          marginTop: '6px',
          textShadow: '0 0 8px rgba(245,197,24,.5)',
        }}
      >
        {nextRank ? `${nextRank.xp - totalXP} XP para ${nextRank.emoji} ${nextRank.name}` : '🌟 ¡RANGO MÁXIMO ALCANZADO!'}
      </div>
    </div>
  );
}
