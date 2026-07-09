'use client';

import { useState, useMemo } from 'react';
import { useBook } from '../context/BookContext';
import { unitProgressPct, levelKey } from '../shared/progress.utils';
import GalaxyScene from '../shared/GalaxyScene';

const GALAXY_PLANETS = [
  { id: 'tierra', name: '🌍 La Tierra', icon: '🌍', subtitle: 'Base de lanzamiento — Adición', color: '#1A6CB4', glow: '#4DA6FF', ring: false, unitIndex: 0, desc: '¡Aquí empieza todo! Domina la adición y el conteo para despegar.' },
  { id: 'luna', name: '🌙 La Luna', icon: '🌙', subtitle: 'Primera parada • ¡Casi en el espacio!', color: '#666666', glow: '#CCCCCC', ring: false, unitIndex: -1, desc: 'La Luna te da la bienvenida. ¡Sigue avanzando hacia las estrellas!' },
  { id: 'marte', name: '🔴 Marte', icon: '🔴', subtitle: 'Planeta Rojo — Sustracción', color: '#C94B22', glow: '#FF6B3B', ring: false, unitIndex: 1, desc: 'El planeta rojo. La Tienda de Math abre aquí. ¡Aprende a restar!' },
  { id: 'saturno', name: '🪐 Saturno', icon: '🪐', subtitle: 'Planeta de los Anillos — Multiplicación', color: '#B8860B', glow: '#F5C518', ring: true, unitIndex: 2, desc: 'Los anillos de Saturno son tu tabla mágica. ¡Multiplica para avanzar!' },
  { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', subtitle: 'Planeta Azul — División', color: '#1A4CB4', glow: '#4D8AFF', ring: false, unitIndex: 3, desc: 'Aguas profundas. Divide las chocolatinas entre los astronautas.' },
  { id: 'sol', name: '☀️ El Sol', icon: '☀️', subtitle: 'La Estrella Máxima — Geometría', color: '#E8650A', glow: '#FFD700', ring: false, unitIndex: 4, desc: '¡El destino final! Perímetros, áreas y formas geométricas del cosmos.' },
];

const MINI_GAMES = [
  null,
  { txt: '🌙 Desafío Luna: ¿Cuántos km hay de la Tierra a la Luna? (384,400 km)' },
  { txt: '🔴 Desafío Marte: ¡Di la tabla del 2 en 10 segundos!' },
  { txt: '🪐 Desafío Saturno: ¿Cuántos anillos tiene Saturno? (7 grupos de anillos)' },
  { txt: '🔵 Desafío Neptuno: 81 ÷ 9 = ? (el océano azul te da la respuesta)' },
  { txt: '☀️ Desafío Sol: ¿Cuántos planetas orbitan el Sol? (8 planetas)' },
];

const LEVEL_INDICATORS = ['🟢', '🟡', '🔴', '🟣', '🏆'];

export default function GalaxyMapScreen() {
  const { book, progress, openUnit, goScreen } = useBook();
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);

  // Map progress percents for planets
  const planetsProgress = useMemo(() => {
    if (!book || !progress) return {};
    const map: { [key: number]: number } = {};
    book.units.forEach((u) => {
      map[u.index] = unitProgressPct(u, progress.scores);
    });
    return map;
  }, [book, progress]);

  // Calculate current planet index where ship orbits
  const currentPlanetIndex = useMemo(() => {
    let best = 0;
    const units = [0, -1, 1, 2, 3, 4];
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (u < 0 || planetsProgress[u] > 0) {
        best = i;
      }
    }
    return best;
  }, [planetsProgress]);

  // Total completed levels in the book
  const totalCompleted = useMemo(() => {
    if (!book || !progress) return 0;
    let count = 0;
    book.units.forEach((unit) => {
      unit.topics.forEach((topic, ti) => {
        topic.levels.forEach((_, li) => {
          if (progress.scores[levelKey(unit.index, ti, li)]) {
            count++;
          }
        });
      });
    });
    return count;
  }, [book, progress]);

  if (!book || !progress) return null;

  const nextPlanet = GALAXY_PLANETS[currentPlanetIndex + 1] || null;
  const nextPct = nextPlanet && nextPlanet.unitIndex >= 0 ? planetsProgress[nextPlanet.unitIndex] || 0 : 0;
  const levelsDone = Math.round((nextPct / 100) * 3);

  const selectedPlanet = selectedPlanetIndex !== null ? GALAXY_PLANETS[selectedPlanetIndex] : null;
  const selectedUnit = selectedPlanet && selectedPlanet.unitIndex >= 0 ? book.units[selectedPlanet.unitIndex] : null;
  const selectedPct = selectedPlanet ? (selectedPlanet.unitIndex < 0 ? 100 : planetsProgress[selectedPlanet.unitIndex] || 0) : 0;
  const isSelectedActive = selectedPlanetIndex !== null && (selectedPlanetIndex === 0 || selectedPlanetIndex === 1 || selectedPct > 0 || (selectedPlanetIndex > 0 && (GALAXY_PLANETS[selectedPlanetIndex - 1].unitIndex < 0 || planetsProgress[GALAXY_PLANETS[selectedPlanetIndex - 1].unitIndex] >= 50)));

  const handleSelectPlanetFromScene = (idx: number) => {
    setSelectedPlanetIndex(idx);
    setShowHint(false);
  };

  return (
    <div className="screen active galaxy-screen" id="screen-galaxy">
      {/* Styles for Hint and Overlay Panels */}
      <style>{`
        @keyframes f1gh_pulse {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
            box-shadow: 0 8px 24px rgba(91,191,255,.6), 0 0 0 0 rgba(91,191,255,.6);
          }
          50% {
            transform: translate(-50%, -4px) scale(1.045);
            box-shadow: 0 10px 30px rgba(91,191,255,.8), 0 0 0 16px rgba(91,191,255,0);
          }
        }
        @keyframes f1gh_arrowDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes f1gh_earthGlow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 12px rgba(91,191,255,.55)); }
          50% { filter: brightness(1.35) drop-shadow(0 0 26px rgba(91,191,255,1)); }
        }
        .f1-gh-banner {
          position: absolute;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          background: linear-gradient(135deg,#0E6BA8,#1A6CB4,#3AA0FF);
          color: #fff;
          font-family: Nunito, sans-serif;
          font-weight: 900;
          border: 2.5px solid #fff;
          border-radius: 24px;
          padding: 11px 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 88vw;
          box-shadow: 0 12px 32px rgba(0,0,0,.55);
          animation: f1gh_pulse 1.8s ease-in-out infinite;
          text-shadow: 0 2px 4px rgba(0,0,0,.4);
          pointer-events: none;
          cursor: default;
        }
        .f1-gh-banner .ico {
          font-size: 30px;
          animation: f1gh_earthGlow 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .f1-gh-banner .txt {
          font-size: 15px;
          line-height: 1.2;
          letter-spacing: .02em;
        }
        .f1-gh-banner .arr {
          font-size: 24px;
          color: #FFE066;
          text-shadow: 0 0 14px rgba(255,224,102,.85);
          animation: f1gh_arrowDown 1s ease-in-out infinite;
          flex-shrink: 0;
        }
        @media(max-width:600px) {
          .f1-gh-banner { top: 54px; padding: 9px 16px; gap: 8px; }
          .f1-gh-banner .ico { font-size: 24px; }
          .f1-gh-banner .txt { font-size: 13px; }
          .f1-gh-banner .arr { font-size: 20px; }
        }
      `}</style>

      {/* Top HUD Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'linear-gradient(180deg, rgba(0,0,20,.85), transparent)',
        padding: '12px 16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(245,197,24,.7)', textTransform: 'uppercase', letterSpacing: '.12em' }}>🌌 Universo Fedor</div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginTop: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {nextPlanet ? (
              <>Rumbo a <span style={{ color: '#FFE066' }}>{nextPlanet.name}</span> · {levelsDone}/3 niveles · {nextPct}%</>
            ) : (
              <>🏆 <span style={{ color: '#FFE066' }}>¡Has llegado al final!</span></>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,.1)',
            borderRadius: '10px',
            padding: '5px 12px',
            border: '1px solid rgba(255,255,255,.15)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#F5C518' }}>{progress.gamification.totalXP || 0}</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>XP</div>
          </div>
          <button
            onClick={() => goScreen('home')}
            style={{
              background: 'rgba(255,255,255,.12)',
              border: '1.5px solid rgba(255,255,255,.25)',
              color: '#fff',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'background 0.2s'
            }}
            title="Volver al menú principal"
          >
            ×
          </button>
        </div>
      </div>

      {/* Floating Tutorial/Hint Banner */}
      {showHint && totalCompleted === 0 && (
        <div className="f1-gh-banner">
          <span className="ico">🌍</span>
          <span className="txt">¡Haz clic en la Tierra para iniciar!</span>
          <span className="arr">⬇️</span>
        </div>
      )}

      {/* WebGL Canvas */}
      <div className="galaxy-canvas-wrap">
        <GalaxyScene
          planetsProgress={planetsProgress}
          selectedAvatar={progress.student.avatar}
          onSelectPlanet={handleSelectPlanetFromScene}
        />
      </div>

      {/* 3D interaction guide message */}
      <div className="galaxy-hint" style={{ marginTop: '0.6rem', color: '#9A92C0' }}>
        👆 Toca un planeta para viajar · arrastra para girar · pellizca para acercar
      </div>

      {/* Planet Info Bottom Drawer Panel */}
      {selectedPlanet && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 25,
          background: 'linear-gradient(0deg, #050525 85%, transparent)',
          borderRadius: '22px 22px 0 0',
          padding: '1.25rem 1.25rem 2rem',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
          fontFamily: 'Nunito, sans-serif',
          display: 'block'
        }}>
          {/* Pull drawer handle bar */}
          <div
            onClick={() => setSelectedPlanetIndex(null)}
            style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,.2)', borderRadius: '2px', margin: '0 auto .85rem', cursor: 'pointer' }}
          />

          {/* Close Panel Button */}
          <button
            onClick={() => setSelectedPlanetIndex(null)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '22px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '.85rem' }}>
            <div style={{ fontSize: '48px', filter: 'drop-shadow(0 0 16px rgba(255,255,255,.4))' }}>
              {selectedPlanet.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                {selectedPlanet.name}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.55)', marginTop: '3px', lineHeight: 1.4 }}>
                {selectedPlanet.desc}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FF8C2A', fontFamily: '"Baloo 2", sans-serif' }}>
                {selectedPct}%
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>completado</div>
            </div>
          </div>

          {/* Level List Progress Rows */}
          <div style={{ display: 'grid', gap: '6px', marginBottom: '1rem', maxHeight: '20vh', overflowY: 'auto' }}>
            {selectedUnit ? (
              selectedUnit.topics.flatMap((topic, ti) =>
                topic.levels.map((_, li) => {
                  const key = levelKey(selectedUnit.index, ti, li);
                  const sc = progress.scores[key];
                  const lpct = sc ? sc.pct || 0 : 0;
                  const indicator = LEVEL_INDICATORS[li] || '⭐';
                  const isCompleted = !!sc;

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 8px',
                        background: 'rgba(255,255,255,.07)',
                        borderRadius: '8px',
                        opacity: isCompleted ? 1 : 0.45
                      }}
                    >
                      <span>{indicator}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.8)', flex: 1 }}>
                        {topic.title}
                      </span>
                      <div style={{ width: '50px', height: '5px', background: 'rgba(255,255,255,.15)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '5px',
                          background: lpct >= 70 ? '#24C496' : lpct >= 50 ? '#F5C518' : 'rgba(255,255,255,.3)',
                          width: `${lpct || (isCompleted ? 100 : 0)}%`,
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 900,
                        color: lpct >= 70 ? '#24C496' : lpct >= 50 ? '#F5C518' : 'rgba(255,255,255,.35)'
                      }}>
                        {lpct || (isCompleted ? 100 : 0)}%
                      </span>
                    </div>
                  );
                })
              )
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(255,255,255,.07)', borderRadius: '8px' }}>
                <span>🌙</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.8)', flex: 1 }}>
                  Base Lunar (Paso Bonus)
                </span>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#24C496' }}>100%</span>
              </div>
            )}
          </div>

          {/* Mini game challenge prompt */}
          {MINI_GAMES[selectedPlanetIndex!] && isSelectedActive && selectedPct > 0 && (
            <div style={{
              background: 'linear-gradient(135deg,rgba(245,197,24,.15),rgba(232,101,10,.1))',
              border: '1.5px solid rgba(245,197,24,.3)',
              borderRadius: '12px',
              padding: '.75rem',
              marginBottom: '.85rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#F5C518', marginBottom: '4px' }}>
                🎮 Mini desafío desbloqueado
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                {MINI_GAMES[selectedPlanetIndex!]?.txt}
              </div>
            </div>
          )}

          {/* Travel action button */}
          {selectedPlanet.unitIndex >= 0 && (
            <button
              onClick={() => {
                setSelectedPlanetIndex(null);
                openUnit(selectedPlanet.unitIndex);
              }}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 900,
                background: selectedPct >= 50
                  ? 'linear-gradient(135deg,#24C496,#16876A)'
                  : 'linear-gradient(135deg,#F5C518,#FF8C2A)',
                color: '#2A0F60',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 6px 20px rgba(245,197,24,.35)'
              }}
            >
              {selectedPct >= 50 ? '🚀 ¡Continuar en este planeta!' : '🚀 ¡Ir a este planeta!'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
