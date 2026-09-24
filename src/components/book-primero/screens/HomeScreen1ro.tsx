'use client';

import React, { useState, useMemo, Fragment } from 'react';
import { useBook1 } from '../context/Book1Context';
import Starfield from '@/components/book/shared/Starfield';
import UnitCard from '@/components/book/shared/UnitCard';
import StatsLab from '@/components/book/games/StatsLab';
import StickerAlbumModal from '@/components/book/shared/StickerAlbumModal';
import ExamenIntegradorModal from '@/components/book/shared/ExamenIntegradorModal';
import { fedorTTS } from '@/services/tts.service';
import Swal from 'sweetalert2';
import type { Unit } from '@/types/book.types';

function calculateUnitProgress(unit: Unit, scores: Record<string, number>): number {
  if (!unit || !unit.topics) return 0;
  let done = 0;
  let total = 0;
  unit.topics.forEach((topic, ti) => {
    (topic.levels || []).forEach((_, li) => {
      total += 1;
      const key1 = `u${unit.index}t${ti}-n${li + 1}`;
      const key2 = topic.id ? `${topic.id}-n${li + 1}` : key1;
      if (typeof scores[key1] === 'number' || typeof scores[key2] === 'number') {
        done += 1;
      }
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

const GALAXY_PLANETS = [
  { id: 'tierra', name: '🌍 La Tierra', icon: '🌍', unitIndex: 0, glow: '#4DA6FF' },
  { id: 'luna', name: '🌙 La Luna', icon: '🌙', unitIndex: -1, glow: '#CCC' },
  { id: 'marte', name: '🔴 Marte', icon: '🔴', unitIndex: 1, glow: '#FF6B3B' },
  { id: 'saturno', name: '🪐 Saturno', icon: '🪐', unitIndex: 2, glow: '#F5C518' },
  { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', unitIndex: 3, glow: '#4D8AFF' },
  { id: 'sol', name: '☀️ El Sol', icon: '☀️', unitIndex: 4, glow: '#FFD700' },
];

interface HomeScreen1roProps {
  onOpenIntro?: () => void;
  onOpenStatsLab?: () => void;
}

export default function HomeScreen1ro({ onOpenIntro, onOpenStatsLab }: HomeScreen1roProps) {
  const { book, student, coins, stars, streak, totalXP, scores, selectUnit, goScreen, grantReward } = useBook1();

  const [showStatsLabLocal, setShowStatsLabLocal] = useState(false);
  const [showStickersModal, setShowStickersModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [dismissSticky, setDismissSticky] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const units = book?.units || [];

  const handleOpenStatsLab = () => {
    if (onOpenStatsLab) onOpenStatsLab();
    else setShowStatsLabLocal(true);
  };

  const getPlanetPct = (unitIdx: number) => {
    if (unitIdx < 0) return 100;
    const unit = units[unitIdx];
    if (!unit) return 0;
    return calculateUnitProgress(unit, scores);
  };

  const isPlanetUnlocked = (idx: number): boolean => {
    const p = GALAXY_PLANETS[idx];
    if (!p) return false;
    if (p.unitIndex < 0) return true;
    if (idx === 0) return true;
    const prev = GALAXY_PLANETS[idx - 1];
    if (!prev) return true;
    if (prev.unitIndex < 0) return isPlanetUnlocked(idx - 1);
    return getPlanetPct(prev.unitIndex) >= 50;
  };

  // Conteo de bloques completados para el Viaje a la Luna
  let totalBlocks = 0;
  let doneBlocks = 0;
  units.forEach((u) => {
    (u.topics || []).forEach((t, ti) => {
      (t.levels || []).forEach((_, li) => {
        totalBlocks += 1;
        const key1 = `u${u.index}t${ti}-n${li + 1}`;
        const key2 = t.id ? `${t.id}-n${li + 1}` : key1;
        if (typeof scores[key1] === 'number' || typeof scores[key2] === 'number') {
          doneBlocks += 1;
        }
      });
    });
  });

  const globalPct = totalBlocks ? Math.round((doneBlocks / totalBlocks) * 100) : 0;
  const ASTEROIDS = 12; // 12 bloques según Imagen 2 (0 / 12 bloques)
  const currentAst = Math.max(0, Math.min(doneBlocks, ASTEROIDS - 1));
  const arrived = doneBlocks >= ASTEROIDS;
  const isStarter = doneBlocks === 0;
  const shipLeft = arrived ? '100%' : `${((currentAst + 0.5) / ASTEROIDS) * 100}%`;

  const handleFocusMascot = () => {
    const msg = '¡Hola amiguito! ¿Listo para explorar las matemáticas hoy? 🐲✨';
    fedorTTS.speak(msg);
    Swal.fire({
      icon: 'info',
      title: '¡Tu Mascota Fedor! 🐲',
      text: msg,
      confirmButtonText: '¡A jugar!',
      confirmButtonColor: '#7B2FBE',
    });
  };

  const handleClaimDaily = () => {
    if (dailyClaimed) {
      Swal.fire({
        icon: 'info',
        title: '¡Ya reclamaste hoy!',
        text: 'Vuelve mañana para obtener más monedas y XP extra.',
        confirmButtonColor: '#16876A',
      });
      return;
    }
    setDailyClaimed(true);
    grantReward(50, 20);
    Swal.fire({
      title: '¡Recompensa Reclamada! 🎁',
      html: `<div style="font-size:16px; font-weight:800; color:#2A0F60; margin-top:8px;">
               Has recibido:<br/>
               <span style="font-size:22px; color:#F5C518; font-weight:900;">+50 XP · +20 🪙</span>
             </div>`,
      icon: 'success',
      confirmButtonText: '¡Súper!',
      confirmButtonColor: '#16876A',
    });
  };

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
  }, []);

  return (
    <div className="screen active" id="screen-home" style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
      {/* Hero Banner del Estudiante */}
      <div
        className="hero-banner"
        style={{
          marginTop: '0',
          marginBottom: '1rem',
          borderRadius: '26px',
          overflow: 'hidden',
          padding: '1.75rem 1.5rem',
        }}
      >
        <Starfield count={40} />
        <div className="hero-planet" />
        <div className="hero-ring" />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem', marginBottom: '.65rem', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
              boxShadow: '0 0 0 4px rgba(245,197,24,.6),0 8px 28px rgba(123,47,190,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              animation: 'float 3.2s ease-in-out infinite',
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
        </div>
        <div className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
          ¡Hola, <em>{student?.name || 'Astronauta'}</em>!
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#FFE066',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '.04em',
            textShadow: '0 1px 4px rgba(0,0,0,.5)',
          }}
        >
          Explorador de 1° Grado · {student?.school || 'Matemáticas de Fedor'}
        </div>
        <div className="hero-stats" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 14, justifyContent: 'center', margin: '.6rem 0 .2rem' }}>
          <span className="hs-item">{coins}🪙</span>
          <span className="hs-item">{stars}⭐</span>
          <span className="hs-item">{streak}🔥 Racha</span>
        </div>
      </div>

      {/* ══ SECCIÓN 1: GALAXIA DEL SABER ══ */}
      <div
        id="galaxyMapWrap"
        className="galaxy-card"
        onClick={() => goScreen('galaxy')}
        style={{
          background: 'linear-gradient(180deg,#020B18,#050E2A,#0A1840)',
          borderRadius: '20px',
          padding: '1rem 1.1rem .85rem',
          marginBottom: '.85rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,.6)',
          cursor: 'pointer',
          minHeight: '130px',
          border: '1.5px solid rgba(91,191,255,.2)',
        }}
      >
        <Starfield count={30} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(245,197,24,.85)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                🌌 UNIVERSO FEDOR
              </div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '1px' }}>
                Galaxia del Saber
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FF8C2A' }}>
                {streak} 🔥
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>
                mejor racha
              </div>
            </div>
          </div>

          {/* Fila horizontal de 6 planetas */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '.25rem 0' }}>
            {GALAXY_PLANETS.map((p, i) => {
              const pct = getPlanetPct(p.unitIndex);
              const unlocked = isPlanetUnlocked(i);
              const hasStarted = p.unitIndex < 0 || pct > 0;
              const iconSize = hasStarted ? 26 : unlocked ? 22 : 20;
              const opa = hasStarted ? 1 : unlocked ? 0.75 : 0.35;

              return (
                <Fragment key={p.id}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      flex: 1,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        fontSize: `${iconSize}px`,
                        opacity: opa,
                        filter: hasStarted
                          ? `drop-shadow(0 0 6px ${p.glow})`
                          : `grayscale(${unlocked ? 0.2 : 0.7})`,
                        animation: hasStarted ? `float ${2 + i * 0.3}s ease-in-out infinite` : 'none',
                      }}
                    >
                      {p.icon}
                      {!unlocked && p.unitIndex >= 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            fontSize: '11px',
                            background: 'rgba(0,0,0,.7)',
                            borderRadius: '50%',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          🔒
                        </div>
                      )}
                    </div>

                    {pct > 0 ? (
                      <div
                        style={{
                          fontSize: '7px',
                          fontWeight: 900,
                          color: '#F5C518',
                          background: 'rgba(0,0,0,.5)',
                          borderRadius: '4px',
                          padding: '1px 3px',
                        }}
                      >
                        {pct}%
                      </div>
                    ) : (
                      <div style={{ height: '12px', fontSize: '7px', fontWeight: 800, color: 'rgba(255,255,255,.4)' }}>
                        {unlocked ? '▶' : ''}
                      </div>
                    )}
                  </div>

                  {i < GALAXY_PLANETS.length - 1 && (
                    <div
                      style={{
                        width: '14px',
                        height: 0,
                        borderTop: `2px dotted rgba(245,197,24,${unlocked && hasStarted ? 0.55 : unlocked ? 0.25 : 0.12})`,
                        flexShrink: 0,
                        alignSelf: 'center',
                        marginBottom: '12px',
                      }}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,.3)', fontWeight: 700, marginTop: '.35rem' }}>
            👆 Toca para explorar · arrastra para viajar
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 2: LABORATORIO DE ESTADÍSTICA ══ */}
      <div
        id="fedorLabCard"
        className="fedor-lab-card"
        onClick={handleOpenStatsLab}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0A3D28 0%, #16876A 50%, #24C496 100%)',
          borderRadius: '22px',
          padding: '1.2rem 1.4rem',
          marginBottom: '.85rem',
          boxShadow: '0 16px 40px rgba(22,135,106,.5), inset 0 0 30px rgba(255,255,255,.1)',
          border: '3px solid rgba(245,197,24,.5)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all .25s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '14px',
            background: 'linear-gradient(135deg,#FF1D4E,#F5C518)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 900,
            padding: '3px 14px',
            borderRadius: '0 0 12px 12px',
            letterSpacing: '.12em',
            boxShadow: '0 4px 12px rgba(255,29,78,.5)',
            zIndex: 3,
          }}
        >
          NUEVO
        </div>
        <div className="flc-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 2 }}>
          <div className="flc-icon" style={{ fontSize: '54px', lineHeight: 1, filter: 'drop-shadow(0 0 18px rgba(245,197,24,.7))', animation: 'flcIconBob 2.4s ease-in-out infinite' }}>
            🧪
          </div>
          <div className="flc-info" style={{ flex: 1, color: '#fff' }}>
            <div className="flc-title" style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '19px', fontWeight: 900, color: '#FFD66B', textShadow: '0 2px 8px rgba(0,0,0,.4)', lineHeight: 1.1 }}>
              Laboratorio de Estadística
            </div>
            <div className="flc-sub" style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,.92)', marginTop: '4px', lineHeight: 1.35 }}>
              ¡Crea tus propias encuestas! Mete datos, mira el gráfico cambiar en vivo y genera preguntas para tus amigos.
            </div>
            <div className="flc-cta" style={{ background: 'rgba(255,255,255,.18)', border: '2px solid #FFD66B', color: '#FFD66B', borderRadius: '14px', padding: '6px 14px', fontWeight: 900, fontSize: '12px', display: 'inline-block', marginTop: '8px', fontFamily: "'Nunito', sans-serif", backdropFilter: 'blur(4px)' }}>
              🚀 ABRIR LABORATORIO →
            </div>
          </div>
          <div className="flc-preview" style={{ flexShrink: 0, background: 'rgba(0,0,0,.25)', borderRadius: '12px', padding: '8px', border: '2px solid rgba(255,255,255,.25)' }}>
            <svg viewBox="0 0 120 80" width={120} height={80}>
              <rect x={10} y={50} width={18} height={22} fill="#FF1D4E" rx={2} />
              <rect x={36} y={32} width={18} height={40} fill="#F5C518" rx={2} />
              <rect x={62} y={20} width={18} height={52} fill="#3AA0FF" rx={2} />
              <rect x={88} y={38} width={18} height={34} fill="#9B5CFF" rx={2} />
              <line x1={6} y1={72} x2={114} y2={72} stroke="#fff" strokeWidth={1.5} />
            </svg>
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 3: VIAJE A LA LUNA ══ */}
      <div
        id="fedor1JourneyWrap"
        className="fj1-wrap"
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, #020611 0%, #0A1840 50%, #1A0D40 100%)',
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '.85rem',
          boxShadow: '0 12px 40px rgba(0,0,0,.6)',
          overflow: 'hidden',
          minHeight: '200px',
          border: '2px solid rgba(91,191,255,.25)',
        }}
      >
        <div className="fj1-header" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
          <span className="fj1-title" style={{ color: '#FFD66B', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', textShadow: '0 0 18px rgba(255,214,107,.5)' }}>
            🚀 VIAJE A LA LUNA
          </span>
          <span className="fj1-progress" style={{ color: '#fff', fontSize: '13px', fontWeight: 900, background: 'rgba(255,255,255,.12)', padding: '5px 14px', borderRadius: '14px', border: '1px solid rgba(255,214,107,.4)' }}>
            {doneBlocks} / {ASTEROIDS} bloques
          </span>
        </div>

        <div className="fj1-track" style={{ position: 'relative', zIndex: 2, height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', padding: '0 6px' }}>
          {/* Tierra */}
          <div className={`fj1-earth${isStarter ? ' starter' : ''}`} style={{ flexShrink: 0, position: 'relative' }}>
            {isStarter && (
              <div className="fj1-start-here" style={{ position: 'absolute', top: '-58px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 10 }}>
                <div className="fj1-start-pill" style={{ background: 'linear-gradient(135deg,#FF1D4E,#F5C518)', color: '#fff', fontWeight: 900, fontSize: '12px', padding: '6px 14px', borderRadius: '16px', letterSpacing: '.05em', boxShadow: '0 6px 18px rgba(255,29,78,.6), 0 0 30px rgba(245,197,24,.5)', whiteSpace: 'nowrap', border: '2px solid #fff' }}>
                  ¡EMPIEZA AQUÍ!
                </div>
                <div className="fj1-start-arrow" style={{ color: '#F5C518', fontSize: '24px', textShadow: '0 0 14px rgba(245,197,24,.9)', lineHeight: 1, marginBottom: '-3px' }}>
                  ⬇️
                </div>
              </div>
            )}
            <div className="fj1-planet-label" style={{ position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', color: '#FFD66B', fontSize: '11px', fontWeight: 900, textShadow: '0 0 10px rgba(0,0,0,.8)', whiteSpace: 'nowrap' }}>
              🌍 Tierra
            </div>
          </div>

          {/* Asteroides y Nave Espacial */}
          <div className="fj1-ast-row" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '60px', margin: '0 4px' }}>
            {Array.from({ length: ASTEROIDS }).map((_, i) => {
              let cls = 'fj1-ast';
              if (i < doneBlocks) cls += ' done';
              else if (i === currentAst && !arrived) cls += ' current';
              return <div key={i} className={cls} />;
            })}

            <div className="fj1-ship" style={{ position: 'absolute', top: '50%', left: shipLeft, transform: 'translate(-50%, -50%)', zIndex: 5, width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'left 1.2s cubic-bezier(.5, 0, .5, 1.2)', pointerEvents: 'none' }}>
              <div className="fj1-flame" />
              <svg viewBox="0 0 60 60" width={50} height={50} style={{ filter: 'drop-shadow(0 0 12px rgba(91,191,255,.85)) drop-shadow(0 0 22px rgba(245,197,24,.55))', animation: 'fj1ShipBob 1.4s ease-in-out infinite' }}>
                <defs>
                  <linearGradient id="f1ShCh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset=".3" stopColor="#E8EFFF" />
                    <stop offset=".55" stopColor="#A8BBE6" />
                    <stop offset=".75" stopColor="#5A6E9C" />
                    <stop offset="1" stopColor="#2A3A6E" />
                  </linearGradient>
                  <radialGradient id="f1Port" cx=".4" cy=".35">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset=".3" stopColor="#A8DFFF" />
                    <stop offset=".7" stopColor="#1E6FB8" />
                    <stop offset="1" stopColor="#0A2E5A" />
                  </radialGradient>
                  <linearGradient id="f1Fin" x1="0" x2="1">
                    <stop offset="0" stopColor="#FF6F8A" />
                    <stop offset=".5" stopColor="#FF1D4E" />
                    <stop offset="1" stopColor="#9B0028" />
                  </linearGradient>
                </defs>
                <g transform="translate(0,2)">
                  <path d="M52 26 L18 12 L18 22 L4 22 L4 30 L18 30 L18 40 Z" fill="url(#f1ShCh)" stroke="#1A2A4E" strokeWidth={1.5} strokeLinejoin="round" />
                  <path d="M48 26 L20 16 L20 22" stroke="rgba(255,255,255,.65)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  <circle cx={28} cy={26} r={5} fill="url(#f1Port)" stroke="#0A2E5A" strokeWidth={1.2} />
                  <circle cx={26} cy={24} r={1.5} fill="#fff" opacity={0.85} />
                  <path d="M18 22 L12 16 L18 18 Z" fill="url(#f1Fin)" stroke="#5A0014" strokeWidth={0.8} />
                  <path d="M18 30 L12 36 L18 32 Z" fill="url(#f1Fin)" stroke="#5A0014" strokeWidth={0.8} />
                  <circle cx={50} cy={26} r={2} fill="#FFEE99" />
                </g>
              </svg>
            </div>
          </div>

          {/* Luna */}
          <div className="fj1-moon" style={{ flexShrink: 0, position: 'relative' }}>
            <div className="fj1-planet-label" style={{ position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', color: '#FFD66B', fontSize: '11px', fontWeight: 900, textShadow: '0 0 10px rgba(0,0,0,.8)', whiteSpace: 'nowrap' }}>
              🌙 Luna
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="fj1-legend" style={{ position: 'relative', zIndex: 2, marginTop: '.7rem', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '11px', color: '#C5BFEE', fontWeight: 800 }}>
          <span>☀️ = bloque listo</span>
          <span>🔴 = actual</span>
          <span>⚫ = por jugar</span>
        </div>
        {arrived && (
          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', color: '#FFD66B', fontWeight: 900, fontSize: '15px', marginTop: '.5rem', textShadow: '0 0 12px rgba(255,214,107,.5)' }}>
            🎉 ¡Llegaste a la LUNA! ¡Eres un experto! 🌙
          </div>
        )}
      </div>

      {/* Floating Sticky CTA: 🚀 ¡Mira el despegue!  ✖ */}
      {!dismissSticky && (
        <div
          id="f1IntroSticky"
          onClick={() => {
            if (onOpenIntro) onOpenIntro();
          }}
        >
          <span className="em">🚀</span>
          <span>¡Mira el despegue!</span>
          <span
            className="x"
            onClick={(e) => {
              e.stopPropagation();
              setDismissSticky(true);
            }}
          >
            ✖
          </span>
        </div>
      )}

      {/* ══ SECCIÓN 4: ⚡ PANEL DE COMANDO (User Image 1) ══ */}
      <div id="fedor1ActionBar" className="f1-action-bar" style={{ position: 'relative', marginTop: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg,#FF1D4E,#F5C518)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 900,
            padding: '4px 16px',
            borderRadius: '14px',
            letterSpacing: '.12em',
            boxShadow: '0 4px 12px rgba(255,29,78,.5)',
            zIndex: 3,
            whiteSpace: 'nowrap',
          }}
        >
          ⚡ PANEL DE COMANDO
        </div>
        <button
          type="button"
          className="ab1-btn intro"
          style={{ background: 'linear-gradient(135deg,#FF8C2A,#F5C518)', color: '#3A1A00' }}
          onClick={() => {
            if (onOpenIntro) onOpenIntro();
          }}
        >
          <span className="ab1-ico">🎬</span>
          <span className="ab1-lbl">Despegue</span>
        </button>
        <button
          type="button"
          className="ab1-btn album"
          style={{ background: 'linear-gradient(135deg,#9B0066,#FF1DAA)', color: '#fff' }}
          onClick={() => setShowStickersModal(true)}
        >
          <span className="ab1-ico">📔</span>
          <span className="ab1-lbl">Stickers</span>
        </button>
        <button
          type="button"
          className="ab1-btn tienda"
          style={{ background: 'linear-gradient(135deg,#16876A,#24C496)', color: '#fff' }}
          onClick={() => goScreen('shop')}
        >
          <span className="ab1-ico">🛒</span>
          <span className="ab1-lbl">Tienda</span>
        </button>
        <button
          type="button"
          className="ab1-btn galaxia"
          style={{ background: 'linear-gradient(135deg,#0E6BA8,#3AA0FF)', color: '#fff' }}
          onClick={() => goScreen('galaxy')}
        >
          <span className="ab1-ico">🌌</span>
          <span className="ab1-lbl">Galaxia 3D</span>
        </button>
        <button
          type="button"
          className="ab1-btn mascot"
          style={{ background: 'linear-gradient(135deg,#6C28B4,#9B5CFF)', color: '#fff' }}
          onClick={handleFocusMascot}
        >
          <span className="ab1-ico">🐲</span>
          <span className="ab1-lbl">Mascota</span>
        </button>
      </div>

      {/* ══ SECCIÓN 5: 📖 CONCEPTO DEL DÍA (User Image 1) ══ */}
      <div className="f1-concept-tip" style={{ position: 'relative', marginTop: '.85rem', marginBottom: '.85rem' }}>
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '14px',
            background: 'linear-gradient(135deg,#BA7517,#F5C518)',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 900,
            padding: '2px 12px',
            borderRadius: '10px',
            letterSpacing: '.12em',
            zIndex: 3,
          }}
        >
          📖 CONCEPTO
        </div>
        <div className="f1ct-icon" style={{ color: '#7B2FBE' }}>➗</div>
        <div className="f1ct-text">
          <strong>Concepto del día:</strong> Repartir chocolatines
        </div>
      </div>

      {/* ══ SECCIÓN 6: PRUEBAS SABER · MODO MARATÓN (User Image 1) ══ */}
      <div
        id="f1SaberCard"
        className="f1-saber-card"
        onClick={() => setShowExamModal(true)}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg,#A30041 0%,#FF1D4E 50%,#FF8C2A 100%)',
          borderRadius: '24px',
          padding: '1.1rem 1.3rem',
          margin: '.85rem 0',
          color: '#fff',
          border: '3px solid #FFE066',
          boxShadow: '0 14px 38px rgba(163,0,65,.55)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '14px',
            background: 'linear-gradient(135deg,#fff,#FFE066)',
            color: '#A30041',
            fontSize: '10px',
            fontWeight: 900,
            padding: '3px 14px',
            borderRadius: '0 0 12px 12px',
            letterSpacing: '.12em',
            boxShadow: '0 4px 12px rgba(0,0,0,.25)',
            zIndex: 3,
          }}
        >
          PRUEBAS
        </div>
        <div className="f1sb-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 2 }}>
          <div className="f1sb-ic" style={{ fontSize: '54px', lineHeight: 1 }}>📝</div>
          <div className="f1sb-info" style={{ flex: 1 }}>
            <div className="f1sb-title" style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '20px', fontWeight: 900, color: '#FFF7C2', textShadow: '0 2px 8px rgba(0,0,0,.45)', lineHeight: 1.15 }}>
              Pruebas SABER · Modo Maratón
            </div>
            <div className="f1sb-sub" style={{ fontSize: '12.5px', fontWeight: 800, color: 'rgba(255,255,255,.94)', marginTop: '4px', lineHeight: 1.35 }}>
              20 preguntas mezcladas de todos los temas. ¡Demuestra lo que sabes!
            </div>
            <div className="f1sb-cta" style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(255,255,255,.2)', border: '2px solid #FFE066', color: '#FFE066', borderRadius: '14px', padding: '5px 14px', fontWeight: 900, fontSize: '12px' }}>
              ▶ Empezar prueba
            </div>
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 7: CENTRO DE INFORMES (User Image 1) ══ */}
      <div
        style={{
          background: 'linear-gradient(135deg,#140830,#1E0848)',
          borderRadius: '18px',
          padding: '1rem 1.1rem',
          margin: '.85rem 0',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(123,47,190,.3)',
          boxShadow: '0 10px 30px rgba(20,8,48,.4)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.65rem', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                📊
              </div>
              <div>
                <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 14, fontWeight: 900, color: '#fff' }}>
                  Centro de Informes
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>
                  Seguimiento docente y familia
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goScreen('report')}
              style={{
                background: 'linear-gradient(135deg,#F5C518,#FF8C2A)',
                color: '#2A0F60',
                border: 'none',
                borderRadius: 10,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Ver informe →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '.65rem' }}>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>{totalXP}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700, textTransform: 'uppercase' }}>XP TOTAL</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#24C496', fontFamily: "'Baloo 2', sans-serif" }}>{doneBlocks}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700, textTransform: 'uppercase' }}>NIVELES ✅</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#FF8C2A', fontFamily: "'Baloo 2', sans-serif" }}>{streak} 🔥</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700, textTransform: 'uppercase' }}>RACHA</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '4px', marginBottom: '.65rem' }}>
            {[
              { icon: '➕', unitIdx: 0 },
              { icon: '➖', unitIdx: 1 },
              { icon: '✖️', unitIdx: 2 },
              { icon: '➗', unitIdx: 3 },
              { icon: '📐', unitIdx: 4 },
              { icon: '📊', unitIdx: 5 },
            ].map((u) => {
              const pct = getPlanetPct(u.unitIdx);
              return (
                <div key={u.icon} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#fff' }}>
                  <span style={{ width: '16px', textAlign: 'center' }}>{u.icon}</span>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,.15)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#F5C518', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,.6)', minWidth: '24px', textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goScreen('report')}
            style={{
              width: '100%',
              padding: '9px',
              fontSize: 12,
              fontWeight: 900,
              background: 'rgba(245,197,24,.12)',
              color: '#F5C518',
              border: '1.5px solid rgba(245,197,24,.25)',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            🤖 Análisis IA Fedor
          </button>
        </div>
      </div>

      {/* ══ SECCIÓN 8: RECOMPENSA DIARIA (User Image 2) ══ */}
      <div
        className="daily-reward"
        onClick={handleClaimDaily}
        style={{
          background: 'linear-gradient(135deg,#1A4030,#16876A)',
          borderRadius: '20px',
          padding: '12px 18px',
          margin: '.85rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(22,135,106,.3)',
          color: '#fff',
        }}
      >
        <span style={{ fontSize: '30px', animation: 'float 2.5s ease-in-out infinite' }}>🎁</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>Recompensa diaria</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.65)', fontWeight: 700 }}>¡Entra cada día y gana XP extra!</div>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 900,
            background: dailyClaimed ? 'rgba(36,196,150,.3)' : 'rgba(245,197,24,.22)',
            color: dailyClaimed ? '#24C496' : '#FFE066',
            border: dailyClaimed ? '1px solid #24C496' : '1px solid rgba(245,197,24,.4)',
            padding: '3px 10px',
            borderRadius: '20px',
          }}
        >
          {dailyClaimed ? '✓ Reclamada' : '¡Disponible!'}
        </span>
      </div>

      {/* ══ SECCIÓN 9: MATEMÁTICAS DE FEDOR (User Image 2) ══ */}
      <div
        className="fedor-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          margin: '.85rem 0',
          background: 'linear-gradient(135deg,#FEF0E6,#FFE2C8)',
          border: '1.5px solid #FBBF7A',
          borderRadius: '20px',
          padding: '10px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%,#3D1468,#6C28B4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '20px',
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '15px', fontWeight: 900, color: '#BA340A' }}>
              Matemáticas de Fedor
            </div>
            <div style={{ fontSize: '10px', color: '#666', fontWeight: 700 }}>
              Libro Interactivo · Grado 1° · Colombia
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#666' }}>¿Tienes el libro Excel?</div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#BA340A' }}>Úsalos juntos 📊</div>
        </div>
      </div>

      {/* ══ SECCIÓN 10: MISIÓN DEL DÍA (User Image 2) ══ */}
      <div
        className="daily-mission-card"
        style={{
          background: 'linear-gradient(135deg,#1E0848,#7B2FBE,#E8650A)',
          borderRadius: '18px',
          padding: '1rem 1.15rem',
          margin: '.85rem 0',
          color: '#fff',
          boxShadow: '0 8px 30px rgba(123,47,190,.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(0,0,0,.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
              border: '1.5px solid rgba(255,224,102,.4)',
            }}
          >
            🎯
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,224,102,.85)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
              MISIÓN DEL DÍA
            </div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '15px', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginTop: '2px' }}>
              Logra una racha de 3 correctas
            </div>
            <div style={{ height: 8, background: 'rgba(0,0,0,.35)', borderRadius: 4, overflow: 'hidden', marginTop: '.5rem' }}>
              <div style={{ width: `${Math.min(100, (streak / 3) * 100)}%`, height: 8, background: 'linear-gradient(90deg,#F5C518,#FF8C2A)', borderRadius: 4, transition: 'width .8s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,.75)', marginTop: '4px' }}>
              <span>{Math.min(3, streak)} / 3</span>
              <span style={{ color: '#F5C518' }}>+80 XP · +50 🪙</span>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            {streak >= 3 ? (
              <span style={{ background: '#24C496', color: '#053C2A', fontWeight: 900, fontSize: 11, padding: '4px 10px', borderRadius: 10 }}>✓ HECHO</span>
            ) : (
              <div style={{ fontSize: 32, opacity: 0.7 }}>🔒</div>
            )}
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 11: DESAFÍO DEL DÍA (User Image 2) ══ */}
      <div
        className="daily-challenge"
        onClick={() => selectUnit(0)}
        style={{
          background: 'linear-gradient(135deg,#1A4030,#16876A)',
          borderRadius: '20px',
          padding: '12px 16px',
          margin: '.85rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(22,135,106,.25)',
          color: '#fff',
        }}
      >
        <span style={{ fontSize: '32px' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
            Desafío del día · {todayFormatted}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.65)', fontWeight: 700 }}>
            ¡Gana el doble de monedas hoy!
          </div>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 900,
            background: 'rgba(245,197,24,.25)',
            color: '#FFE066',
            border: '1px solid rgba(245,197,24,.4)',
            padding: '3px 10px',
            borderRadius: '20px',
          }}
        >
          🏅 x2
        </span>
      </div>

      {/* ══ SECCIÓN 12: PROGRESO TOTAL (User Image 2) ══ */}
      <div
        className="prog-global"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--border)',
          borderRadius: '20px',
          padding: '14px 18px',
          margin: '.85rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)', flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📚</span>
          <span>Progreso total</span>
        </div>
        <div style={{ flex: 2, height: 10, background: '#EEE', borderRadius: 5, overflow: 'hidden' }}>
          <div
            style={{
              width: `${globalPct}%`,
              height: 10,
              background: 'linear-gradient(90deg, #7B2FBE, #A864E8)',
              borderRadius: 5,
              transition: 'width .8s',
            }}
          />
        </div>
        <div style={{ fontSize: '14px', fontWeight: 900, color: '#7B2FBE', minWidth: 38, textAlign: 'right' }}>
          {globalPct}%
        </div>
      </div>

      {/* ══ SECCIÓN 13: MAPA DE PROGRESO — UNIDAD 1 (User Image 2) ══ */}
      <div
        className="progress-map"
        onClick={() => selectUnit(0)}
        style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--border)',
          borderRadius: '20px',
          padding: '1.1rem 1.25rem',
          margin: '.85rem 0',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 900, color: '#7B2FBE', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🗺️</span>
          <span>MAPA DE PROGRESO — UNIDAD 1</span>
        </div>
        <div className="pm-path" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {(units[0]?.topics || []).map((t, ti) => {
            let isDone = true;
            let isStarted = false;
            (t.levels || []).forEach((_, li) => {
              const k1 = `u0t${ti}-n${li + 1}`;
              const k2 = t.id ? `${t.id}-n${li + 1}` : k1;
              if (typeof scores[k1] === 'number' || typeof scores[k2] === 'number') {
                isStarted = true;
              } else {
                isDone = false;
              }
            });
            const cls = isDone ? 'done' : isStarted ? 'active' : 'locked';

            return (
              <Fragment key={t.id || ti}>
                {ti > 0 && <span style={{ fontSize: '14px', color: '#AAA' }}>→</span>}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      border: isDone ? '2.5px solid #16876A' : isStarted ? '2.5px solid #7B2FBE' : '2.5px solid #DDD8F5',
                      background: isDone ? '#DCF5EE' : isStarted ? '#EEEDFE' : '#F5F3FF',
                      position: 'relative',
                    }}
                  >
                    {t.icon || '➕'}
                    {isDone && <span style={{ position: 'absolute', top: -4, right: -4, fontSize: '12px' }}>✅</span>}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#666', textAlign: 'center', maxWidth: 52 }}>
                    {t.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ══ SECCIÓN 14: UNIDADES DE APRENDIZAJE ══ */}
      <div className="sec-title" style={{ textAlign: 'left', marginTop: '1.25rem', marginBottom: '0.8rem' }}>
        📦 UNIDADES DE APRENDIZAJE
      </div>

      {/* Lista de Unidades hacia abajo (idéntico a 2° grado) */}
      <div style={{ display: 'grid', gap: '8px', marginBottom: '1.5rem' }}>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            pct={calculateUnitProgress(unit, scores)}
            onClick={() => selectUnit(unit.index)}
            isGrade1={true}
          />
        ))}
      </div>

      {/* ══ SECCIÓN 15: RECURSOS EXTRA ══ */}
      <div
        style={{
          marginTop: '2rem',
          marginBottom: '0.85rem',
          fontSize: '13px',
          fontWeight: 900,
          color: '#D97706',
          textTransform: 'uppercase',
          letterSpacing: '.1em',
          paddingLeft: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <span style={{ fontSize: '15px' }}>✨</span> RECURSOS EXTRA
      </div>

      {/* Bloque 1: Tablas de Conteo, Conceptos, Retos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
        {/* 1. Tablas de Conteo */}
        <div
          className="feat-btn"
          onClick={() => goScreen('tablas-conteo')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #F0F8FF 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1A6CB4, #4DA6FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(26,108,180,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="2" y="2" width="13" height="13" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <text x="8.5" y="11.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="'Baloo 2', Nunito, sans-serif">1</text>
              <rect x="19" y="2" width="13" height="13" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <text x="25.5" y="11.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="'Baloo 2', Nunito, sans-serif">2</text>
              <rect x="2" y="19" width="13" height="13" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <text x="8.5" y="28.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="'Baloo 2', Nunito, sans-serif">3</text>
              <rect x="19" y="19" width="13" height="13" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <text x="25.5" y="28.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="'Baloo 2', Nunito, sans-serif">4</text>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0A3A6A', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2, marginBottom: '3px' }}>
              Tablas de Conteo
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(20, 60, 100, 0.72)', letterSpacing: '0.01em' }}>
              Ranges 1-10, 1-20, 1-30, 1-50, 1-100
            </div>
          </div>
          <div style={{ fontSize: '24px', color: '#1A6CB4', fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>→</div>
        </div>

        {/* 2. Conceptos */}
        <div
          className="feat-btn"
          onClick={() => goScreen('conceptos')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #E8FAF1 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #00A86B, #2ECC71)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(0,168,107,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="4" y="9" width="13" height="18" rx="3" fill="#00E5FF" />
              <rect x="6.5" y="11" width="8" height="14" rx="1.5" fill="#E0F7FA" />
              <rect x="11" y="6" width="13" height="21" rx="3" fill="#FF2A6D" />
              <rect x="13.5" y="8" width="8" height="17" rx="1.5" fill="#FFE4EC" />
              <rect x="18" y="11" width="13" height="16" rx="3" fill="#FFB703" />
              <rect x="20.5" y="13" width="8" height="12" rx="1.5" fill="#FFF9C4" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0A3A6A', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2, marginBottom: '3px' }}>
              Conceptos
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(20, 60, 100, 0.72)', letterSpacing: '0.01em' }}>
              Definiciones técnicas de cada operación
            </div>
          </div>
          <div style={{ fontSize: '24px', color: '#1A6CB4', fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>→</div>
        </div>

        {/* 3. Retos Matemáticos */}
        <div
          className="feat-btn"
          onClick={() => goScreen('retos')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #FFF6E6 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FF7A00, #FFAE00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(255,122,0,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M8 8H4a3 3 0 00-3 3v2a3 3 0 003 3h4" stroke="#FFA000" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M26 8h4a3 3 0 013 3v2a3 3 0 01-3 3h-4" stroke="#FFA000" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 6h18v9c0 4.97-4.03 9-9 9s-9-4.03-9-9V6z" fill="#FFC107" />
              <path d="M10 6h14v8c0 3.866-3.134 7-7 7s-7-3.134-7-7V6z" fill="#FFD54F" />
              <rect x="15" y="24" width="4" height="4" fill="#FFA000" />
              <path d="M9 28h16a1 1 0 011 1v1a2 2 0 01-2 2H10a2 2 0 01-2-2v-1a1 1 0 011-1z" fill="#FF8F00" />
              <polygon points="17,11 18.2,13.5 21,13.9 19,15.8 19.5,18.5 17,17.2 14.5,18.5 15,15.8 13,13.9 15.8,13.5" fill="#FF8F00" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0A3A6A', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2, marginBottom: '3px' }}>
              Retos Matemáticos
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(20, 60, 100, 0.72)', letterSpacing: '0.01em' }}>
              Desafíos para primer grado
            </div>
          </div>
          <div style={{ fontSize: '24px', color: '#1A6CB4', fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>→</div>
        </div>
      </div>

      {/* Bloque 2: Definiciones FEDOR, Estándares MEN, Problemas Cotidianos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
        {/* 4. Definiciones FEDOR */}
        <div
          className="feat-btn"
          onClick={() => goScreen('definiciones')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #F5F0FF 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(123,47,190,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="4" y="9" width="13" height="18" rx="3" fill="#00E5FF" />
              <rect x="6.5" y="11" width="8" height="14" rx="1.5" fill="#E0F7FA" />
              <rect x="11" y="6" width="13" height="21" rx="3" fill="#FF2A6D" />
              <rect x="13.5" y="8" width="8" height="17" rx="1.5" fill="#FFE4EC" />
              <rect x="18" y="11" width="13" height="16" rx="3" fill="#FFB703" />
              <rect x="20.5" y="13" width="8" height="12" rx="1.5" fill="#FFF9C4" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0A3A6A', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2, marginBottom: '3px' }}>
              Definiciones FEDOR
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1830', letterSpacing: '0.01em' }}>
              Conceptos matemáticos claros para 1°
            </div>
          </div>
        </div>

        {/* 5. Estándares MEN */}
        <div
          className="feat-btn"
          onClick={() => goScreen('estandares')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #F0FDF9 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: '#FFFFFF',
              border: '2px solid rgba(0, 40, 80, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px',
              color: '#0A1830',
              boxShadow: '0 4px 14px rgba(0, 40, 80, 0.08)',
              flexShrink: 0,
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            CO
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#4A607A', fontFamily: "'Baloo 2', sans-serif" }}>
              Estándares MEN
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0A1830' }}>
              Programa de 1° Colombia
            </div>
          </div>
        </div>

        {/* 6. Problemas Cotidianos */}
        <div
          className="feat-btn"
          onClick={() => goScreen('problemas')}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 22px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 45%, #E8FAF1 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0, 40, 80, 0.12), 0 2px 6px rgba(0, 40, 80, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0E5240, #16876A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.14), 0 6px 18px rgba(14,82,64,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M4 6h4l3.5 13h13.5l3-10H10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="13" y="10" width="5" height="5" rx="1.5" fill="#38BDF8" />
              <rect x="19" y="8" width="5" height="7" rx="1.5" fill="#A7F3D0" />
              <circle cx="13" cy="24" r="2.2" fill="#FFFFFF" />
              <circle cx="23" cy="24" r="2.2" fill="#FFFFFF" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0A3A6A', fontFamily: "'Baloo 2', sans-serif", lineHeight: 1.2, marginBottom: '3px' }}>
              Problemas Cotidianos
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(20, 60, 100, 0.72)', letterSpacing: '0.01em' }}>
              Conteo de monedas + compras + 4 operaciones
            </div>
          </div>
          <div style={{ fontSize: '24px', color: '#1A6CB4', fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>→</div>
        </div>
      </div>

      {/* Modales Interactivos */}
      {showStatsLabLocal && (
        <StatsLab
          onClose={() => setShowStatsLabLocal(false)}
          onGrantReward={grantReward}
        />
      )}

      {showStickersModal && (
        <StickerAlbumModal
          onClose={() => setShowStickersModal(false)}
        />
      )}

      {showExamModal && (
        <ExamenIntegradorModal
          isOpen={showExamModal}
          onClose={() => setShowExamModal(false)}
          onStartExam={() => {
            setShowExamModal(false);
            goScreen('retos');
          }}
        />
      )}
    </div>
  );
}
