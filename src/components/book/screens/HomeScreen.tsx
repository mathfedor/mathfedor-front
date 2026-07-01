'use client';

import { useEffect, useMemo, useState, Fragment, type ReactNode } from 'react';
import { useBook, useRank } from '../context/BookContext';
import Starfield from '../shared/Starfield';
import UnitCard from '../shared/UnitCard';
import LaunchIntro from '../shared/LaunchIntro';
import TutorialOverlay from '../shared/TutorialOverlay';
import { globalProgressPct, unitProgressPct } from '../shared/progress.utils';
import { dayKey } from '@/services/daily-challenge.service';

const TUTORIAL_KEY = 'fedor2_tutorial_done';

const GALAXY_PLANETS = [
  { id: 'tierra', name: ' La Tierra', icon: '🌍', unitIndex: 0, glow: '#4DA6FF' },
  { id: 'luna', name: ' La Luna', icon: '🌙', unitIndex: -1, glow: '#CCC' },
  { id: 'marte', name: '🔴 Marte', icon: '🔴', unitIndex: 1, glow: '#FF6B3B' },
  { id: 'saturno', name: '🪐 Saturno', icon: '🪐', unitIndex: 2, glow: '#F5C518' },
  { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', unitIndex: 3, glow: '#4D8AFF' },
  { id: 'sol', name: '☀️ El Sol', icon: '☀️', unitIndex: 4, glow: '#FFD700' },
];

const CONCEPT_PHRASES = [
  { text: 'Digite en cada cuadro el número de dragones siguiendo la correspondiente cantidad y luego el resultado de la adición.', icon: '➕' },
  { text: 'Digite en el cuadro respectivo el número de bolas y luego el resultado de la adición.', icon: '➕' },
  { text: 'Adición o Suma sin llevar', icon: '➕' },
  { text: 'La sustracción o resta disminuye una cantidad de otra.', icon: '➖' },
  { text: 'Restar una cantidad de otra es hallar la diferencia.', icon: '➖' },
  { text: 'Ejemplos de Sustracción o Resta', icon: '➖' },
  { text: 'Acciones de presente y pasado en la sustracción', icon: '➖' },
  { text: 'La Propiedad Conmutativa de la Multiplicación', icon: '✖️' },
  { text: 'La multiplicación se representa con los signos: · o ×.', icon: '✖️' },
  { text: 'Acciones de presente y pasado en la Multiplicación', icon: '✖️' },
  { text: 'Tablas de Multiplicar', icon: '✖️' },
  { text: 'En el salón de clase hay una reunión entre los estudiantes y van a repartir una bebida.', icon: '➗' },
  { text: 'La profesora reparte en grupos de 5 estudiantes.', icon: '➗' },
  { text: 'La profesora reparte 3 cuentos diarios para leer.', icon: '➗' },
  { text: 'Dividir es repartir en partes iguales.', icon: '➗' },
  { text: 'Dividir es repartir la unidad en una o más partes', icon: '➗' },
  { text: 'Son reparticiones en partes iguales donde el residuo es 0.', icon: '➗' },
  { text: 'Repartir chocolatines', icon: '➗' },
  { text: '¿Cuánto le toca a cada niño en cada repartición ?', icon: '➗' },
  { text: 'La decena representa un conjunto de 10 elementos.', icon: '🔟' },
  { text: 'Dibuja 5 ejemplos de decenas en tu cuaderno.', icon: '🔟' },
  { text: 'El sistema decimal es posicional, primero las unidades, luego las decenas y luego las centenas.', icon: '🔟' },
  { text: 'Unidades decenas y centenas', icon: '🔟' },
  { text: 'Descomponer cada número en unidades, decenas y centenas.', icon: '🔟' },
  { text: 'Descomponer cada número en centenas, decenas y unidades.', icon: '🔟' },
  { text: 'Dibujar una centena en tu cuaderno.', icon: '💯' },
  { text: 'Son los números naturales usados para contar elementos.', icon: '🔢' },
  { text: 'Son los números Naturales que usamos para contar elementos de un conjunto.', icon: '🔢' },
  { text: 'Contar, Sumar y Completar.', icon: '🔢' }
];

/** Pantalla principal: hero del estudiante, progreso global y unidades. */
export default function HomeScreen() {
  const { book, progress, openUnit, goScreen, claimDaily, startDailyChallenge, openGameShortcut } = useBook();
  const isGrade1 = book?.slug === 'libro-1ro';
  const rank = useRank();
  const [showIntro, setShowIntro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const getPlanetPct = (unitIdx: number) => {
    if (!book || !progress) return 0;
    if (unitIdx < 0) return 100;
    const unit = book.units[unitIdx];
    if (!unit) return 0;
    return unitProgressPct(unit, progress.scores);
  };

  const isPlanetUnlocked = (idx: number): boolean => {
    if (!book || !progress) return false;
    const p = GALAXY_PLANETS[idx];
    if (!p) return false;
    if (p.unitIndex < 0) return true;
    if (idx === 0) return true;
    const prev = GALAXY_PLANETS[idx - 1];
    if (!prev) return true;
    if (prev.unitIndex < 0) return isPlanetUnlocked(idx - 1);
    return getPlanetPct(prev.unitIndex) >= 50;
  };

  const conceptTip = useMemo(() => {
    const dayIdx = (new Date().getDate() + (new Date().getMonth() * 7)) % CONCEPT_PHRASES.length;
    return CONCEPT_PHRASES[dayIdx];
  }, []);

  const handleFocusMascot = () => {
    const mascotBtn = document.querySelector('.kj1-mascot') as HTMLButtonElement;
    if (mascotBtn) {
      mascotBtn.click();
      mascotBtn.style.boxShadow = '0 0 0 8px rgba(245,197,24,.6),0 6px 18px rgba(0,0,0,.3)';
      setTimeout(() => {
        mascotBtn.style.boxShadow = '';
      }, 1500);
    }
  };


  // Muestra el tutorial solo en el primer ingreso.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(TUTORIAL_KEY) !== '1') setShowTutorial(true);
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    try {
      window.localStorage.setItem(TUTORIAL_KEY, '1');
    } catch {
      /* almacenamiento no disponible */
    }
  };

  if (!book || !progress) return null;

  const g = progress.gamification;
  const globalPct = globalProgressPct(book, progress.scores);
  const dailyAvailable = g.lastDaily !== new Date().toDateString();
  const challengeDone = g.lastDailyChallenge === dayKey();

  return (
    <div className="screen active" id="screen-home">
      <div className="hero-banner">
        <Starfield count={40} />
        <div className="hero-planet" />
        <div className="hero-ring" />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.65rem', position: 'relative', zIndex: 1 }}>
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
            {g.avatar}
          </div>
        </div>
        <div className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
          ¡Hola, <em>{progress.student.name || 'Astronauta'}</em>!
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
          {rank?.label ?? 'Explorador Estelar'}
        </div>
        <div className="hero-stats" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 14, justifyContent: 'center', margin: '.4rem 0' }}>
          <span className="hs-item">{g.coins}🪙</span>
          <span className="hs-item">{g.stars}⭐</span>
          {!isGrade1 && <span className="hs-item">{g.totalXP} XP</span>}
        </div>
        {isGrade1 ? (
          <div className="f1cta-card" onClick={() => setShowIntro(true)}>
            <div className="f1cta-rocket-wrap">
              <div className="f1cta-flame" />
              <div className="f1cta-rocket">🚀</div>
            </div>
            <div className="f1cta-body">
              <div className="f1cta-pretitle">🎬 ¿quieres verla otra vez?</div>
              <div className="f1cta-title">🚀 Repetir el despegue</div>
              <div className="f1cta-sub">El astronauta sale del laboratorio y vuela 🌍 → 🌙</div>
            </div>
            <div className="f1cta-arrow">›</div>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '.6rem' }}>
            <button className="intro-btn" onClick={() => setShowIntro(true)}>🎬 Ver intro del despegue 🚀</button>
          </div>
        )}
      </div>

      {showIntro && <LaunchIntro onClose={() => setShowIntro(false)} />}
      {showTutorial && <TutorialOverlay onClose={closeTutorial} />}

      {/* Mapa galaxia 3D */}
      <div
        className="galaxy-card"
        onClick={() => goScreen('galaxy')}
        style={{
          background: 'linear-gradient(180deg,#020B18,#050E2A,#0A1840)',
          padding: '1rem 1.1rem .85rem',
          minHeight: '130px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="galaxy-card-bg" style={{ background: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <div>
              <div className="galaxy-card-kicker">🌌 Universo Fedor</div>
              <div className="galaxy-card-title" style={{ marginTop: '1px' }}>Galaxia del Saber</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#FF8C2A' }}>
                {g.maxStreak || 0}🔥
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>
                mejor racha
              </div>
            </div>
          </div>

          {/* Planet Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '.25rem 0' }}>
            {GALAXY_PLANETS.map((p, i) => {
              const pct = getPlanetPct(p.unitIndex);
              const unlocked = isPlanetUnlocked(i);
              const hasStarted = p.unitIndex < 0 || pct > 0;
              const iconSize = hasStarted ? 26 : unlocked ? 22 : 20;
              const opa = hasStarted ? 1 : unlocked ? 0.7 : 0.35;

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
                        borderTop: `2px dotted rgba(245,214,107,${
                          unlocked && hasStarted ? 0.55 : unlocked ? 0.25 : 0.12
                        })`,
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

      {/* Grade 1: Laboratorio de Estadística */}
      {isGrade1 && (
        <div className="fedor-lab-card" onClick={() => openGameShortcut('stats')}>
          <div className="flc-row">
            <div className="flc-icon">🧪</div>
            <div className="flc-info">
              <div className="flc-title">Laboratorio de Estadística</div>
              <div className="flc-sub">
                ¡Crea tus propias encuestas! Mete datos, mira el gráfico cambiar en vivo
                y genera preguntas para tus amigos.
              </div>
              <div className="flc-cta">🚀 ABRIR LABORATORIO →</div>
            </div>
            <div className="flc-preview">
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
      )}

      {/* Grade 1: Viaje a la Luna */}
      {isGrade1 && <MoonJourney />}

      {/* Grade 1: Panel de Comando */}
      {isGrade1 && (
        <div className="f1-action-bar">
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
              whiteSpace: 'nowrap',
              zIndex: 3,
            }}
          >
            ⚡ PANEL DE COMANDO
          </div>
          <button
            className="ab1-btn"
            style={{ background: 'linear-gradient(135deg,#FF8C2A,#F5C518)', color: '#3A1A00' }}
            onClick={() => setShowIntro(true)}
          >
            <span className="ab1-ico">🎬</span>
            <span className="ab1-lbl">Despegue</span>
          </button>
          <button
            className="ab1-btn"
            style={{ background: 'linear-gradient(135deg,#9B0066,#FF1DAA)', color: '#fff' }}
            onClick={() => goScreen('diary')}
          >
            <span className="ab1-ico">📔</span>
            <span className="ab1-lbl">Stickers</span>
          </button>
          <button
            className="ab1-btn"
            style={{ background: 'linear-gradient(135deg,#16876A,#24C496)', color: '#fff' }}
            onClick={() => goScreen('shop')}
          >
            <span className="ab1-ico">🛒</span>
            <span className="ab1-lbl">Tienda</span>
          </button>
          <button
            className="ab1-btn"
            style={{ background: 'linear-gradient(135deg,#0E6BA8,#3AA0FF)', color: '#fff' }}
            onClick={() => goScreen('galaxy')}
          >
            <span className="ab1-ico">🌌</span>
            <span className="ab1-lbl">Galaxia 3D</span>
          </button>
          <button
            className="ab1-btn"
            style={{ background: 'linear-gradient(135deg,#6C28B4,#9B5CFF)', color: '#fff' }}
            onClick={handleFocusMascot}
          >
            <span className="ab1-ico">🐉</span>
            <span className="ab1-lbl">Mascota</span>
          </button>
        </div>
      )}

      {/* Grade 1: Concepto del día */}
      {isGrade1 && conceptTip && (
        <div className="f1-concept-tip">
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
          <div className="f1ct-icon">{conceptTip.icon}</div>
          <div className="f1ct-text">
            <strong>Concepto del día:</strong> {conceptTip.text}
          </div>
        </div>
      )}

      {/* Grade 1: Pruebas SABER · Modo Maratón */}
      {isGrade1 && (
        <div className="f1-saber-card" onClick={() => goScreen('examen')}>
          <div
            style={{
              position: 'absolute',
              top: '-9px',
              right: '14px',
              background: 'linear-gradient(135deg,#fff,#FFE066)',
              color: '#A30041',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 14px',
              borderRadius: '12px',
              letterSpacing: '.12em',
              boxShadow: '0 4px 12px rgba(0,0,0,.25)',
              zIndex: 3,
            }}
          >
            PRUEBAS
          </div>
          <div className="f1sb-row">
            <div className="f1sb-ic">📝</div>
            <div className="f1sb-info">
              <div className="f1sb-title">Pruebas SABER · Modo Maratón</div>
              <div className="f1sb-sub">
                20 preguntas mezcladas de todos los temas. ¡Demuestra lo que sabes!
              </div>
              <div className="f1sb-cta">▶ Empezar prueba</div>
            </div>
          </div>
        </div>
      )}

      {/* Centro de informes */}
      <div style={{ background: 'linear-gradient(135deg,#140830,#1E0848)', borderRadius: 18, padding: '1rem 1.1rem', marginBottom: '.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📊</div>
            <div>
              <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 14, fontWeight: 900, color: '#fff' }}>Centro de Informes</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>Seguimiento docente y familia</div>
            </div>
          </div>
          <button onClick={() => goScreen('report')} style={{ background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', color: '#2A0F60', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
            Ver informe →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          <Stat value={g.totalXP} label="XP Total" color="#FF8C2A" />
          <Stat value={Object.keys(progress.scores).length} label="Niveles ✅" color="#24C496" />
          <Stat value={`${g.maxStreak}🔥`} label="Racha" color="#FF8C2A" />
        </div>
      </div>

      {/* Recompensa diaria */}
      <div className="daily-reward" onClick={() => claimDaily()} style={{ opacity: dailyAvailable ? 1 : 0.55 }}>
        <span className="dr-icon">🎁</span>
        <div className="dr-body">
          <div className="dr-title">Recompensa diaria</div>
          <div className="dr-sub">¡Entra cada día y gana XP extra!</div>
        </div>
        <span className="dr-badge">{dailyAvailable ? '¡Disponible!' : 'Reclamada'}</span>
      </div>

      {/* Reto del día */}
      <div className="daily-challenge" onClick={() => !challengeDone && startDailyChallenge()} style={{ opacity: challengeDone ? 0.55 : 1, cursor: challengeDone ? 'default' : 'pointer' }}>
        <span className="dc-icon">⚡</span>
        <div className="dc-body">
          <div className="dc-title">Desafío del día</div>
          <div className="dc-sub">{challengeDone ? '¡Completado hoy! Vuelve mañana' : '8 ejercicios · ¡gana el doble de monedas!'}</div>
        </div>
        <span className="dc-badge">{challengeDone ? '✅' : '🏅 x2'}</span>
      </div>

      {/* Mini-juegos */}
      {!isGrade1 && (
        <div className="daily-challenge" onClick={() => goScreen('games')} style={{ cursor: 'pointer' }}>
          <span className="dc-icon">🎮</span>
          <div className="dc-body">
            <div className="dc-title">Mini-juegos</div>
            <div className="dc-sub">Practica la división repartiendo chocolatinas</div>
          </div>
          <span className="dc-badge">Jugar →</span>
        </div>
      )}

      {/* Diario narrativo */}
      {!isGrade1 && (
        <div className="daily-challenge" onClick={() => goScreen('diary')} style={{ cursor: 'pointer' }}>
          <span className="dc-icon">📖</span>
          <div className="dc-body">
            <div className="dc-title">Diario del viaje</div>
            <div className="dc-sub">La historia de Fedor se desbloquea con tu progreso</div>
          </div>
          <span className="dc-badge">Leer →</span>
        </div>
      )}

      {/* Examen final */}
      {!isGrade1 && (
        <div className="daily-challenge" onClick={() => goScreen('examen')} style={{ cursor: 'pointer' }}>
          <span className="dc-icon">🎓</span>
          <div className="dc-body">
            <div className="dc-title">Examen Final</div>
            <div className="dc-sub">20 preguntas de todo el libro · aprueba con 14</div>
          </div>
          <span className="dc-badge">+300 🪙</span>
        </div>
      )}

      {/* Reto espacial */}
      {!isGrade1 && (
        <div className="daily-challenge" onClick={() => goScreen('espacial')} style={{ cursor: 'pointer' }}>
          <span className="dc-icon">🚀</span>
          <div className="dc-body">
            <div className="dc-title">Reto Espacial</div>
            <div className="dc-sub">Reto diario extra · mantén tu racha espacial</div>
          </div>
          <span className="dc-badge">+50 🪙</span>
        </div>
      )}

      {/* Progreso global */}
      <div className="prog-global">
        <div className="pg-label">📚 Progreso total</div>
        <div className="pg-bar">
          <div className="pg-fill" style={{ width: `${globalPct}%` }} />
        </div>
        <div className="pg-pct">{globalPct}%</div>
      </div>

      <div className="sec-title">📦 Unidades de aprendizaje</div>
      <HomeSection icon="🧮" title="Operaciones Básicas" gradient="linear-gradient(135deg,#6C28B4,#9B5CE5)" defaultOpen>
        {book.units.slice(0, 4).map((unit) => (
          <UnitCard key={unit.id} unit={unit} pct={unitProgressPct(unit, progress.scores)} onClick={() => openUnit(unit.index)} />
        ))}
      </HomeSection>
      {book.units.length > 4 && (
        <HomeSection icon="📐" title="Magnitudes, Geometría y más" gradient="linear-gradient(135deg,#16876A,#24C496)">
          {book.units.slice(4).map((unit) => (
            <UnitCard key={unit.id} unit={unit} pct={unitProgressPct(unit, progress.scores)} onClick={() => openUnit(unit.index)} />
          ))}
        </HomeSection>
      )}

      <div className="fedor-brand" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="fedor-brand-logo"><span style={{ fontSize: 20 }}>🚀</span></div>
          <div>
            <div className="fedor-brand-txt">Matemáticas de Fedor</div>
            <div className="fedor-brand-sub">Libro Interactivo · {isGrade1 ? 'Grado 1°' : 'Grado 2°'} · Colombia</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeSection({
  icon,
  title,
  gradient,
  defaultOpen = false,
  children,
}: {
  icon: string;
  title: string;
  gradient: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fhl-section${open ? ' open' : ''}`}>
      <div className="fhl-section-header" style={{ background: gradient }} onClick={() => setOpen((o) => !o)}>
        <span className="fhl-ic">{icon}</span>
        <span className="fhl-name">{title}</span>
        <span className="fhl-arrow">⌄</span>
      </div>
      <div className="fhl-section-body">{children}</div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 900, color, fontFamily: "'Baloo 2',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

/** Viaje a la Luna — tracker de progreso Tierra → Luna para Grado 1. */
function MoonJourney() {
  const { book, progress } = useBook();

  const { done, total } = useMemo(() => {
    if (!book || !progress) return { done: 0, total: 12 };
    let t = 0;
    let d = 0;
    book.units.forEach((u) =>
      u.topics.forEach((topic, ti) =>
        topic.levels.forEach((_, li) => {
          t++;
          const key = `u${u.index}t${ti}-n${li + 1}`;
          if (progress.scores[key] && progress.scores[key].pts > 0) d++;
        })
      )
    );
    return { done: d, total: Math.max(t, 8) };
  }, [book, progress]);

  const ASTEROIDS = Math.min(Math.max(total, 8), 14);
  const currentAst = Math.max(0, Math.min(done, ASTEROIDS - 1));
  const arrived = done >= ASTEROIDS;
  const isStarter = done === 0;

  const shipLeft = arrived ? '100%' : `${((currentAst + 0.5) / ASTEROIDS) * 100}%`;

  return (
    <div className="fj1-wrap">
      <div className="fj1-header">
        <span className="fj1-title">🚀 Viaje a la Luna</span>
        <span className="fj1-progress">{done} / {total} bloques</span>
      </div>
      <div className="fj1-track">
        {/* Tierra */}
        <div className={`fj1-earth${isStarter ? ' starter' : ''}`}>
          {isStarter && (
            <div className="fj1-start-here">
              <div className="fj1-start-pill">¡EMPIEZA AQUÍ!</div>
              <div className="fj1-start-arrow">⬇️</div>
            </div>
          )}
          <div className="fj1-planet-label">🌍 Tierra</div>
        </div>

        {/* Asteroids + Ship */}
        <div className="fj1-ast-row">
          {Array.from({ length: ASTEROIDS }).map((_, i) => {
            let cls = 'fj1-ast';
            if (i < done) cls += ' done';
            else if (i === currentAst && !arrived) cls += ' current';
            return <div key={i} className={cls} />;
          })}
          <div className="fj1-ship" style={{ left: shipLeft }}>
            <div className="fj1-flame" />
            <svg viewBox="0 0 60 60" width={50} height={50}>
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
                <path d="M4 22 L-2 18 L-2 34 L4 30" fill="url(#f1Fin)" />
              </g>
            </svg>
          </div>
        </div>

        {/* Luna */}
        <div className="fj1-moon">
          <div className="fj1-planet-label">🌙 Luna</div>
        </div>
      </div>
      <div className="fj1-legend">
        <span>🟡 Completado</span>
        <span>🔴 Actual</span>
        <span>⚫ Pendiente</span>
      </div>
    </div>
  );
}
