'use client';

import { useEffect, useMemo, useState, Fragment, type ReactNode } from 'react';
import { useBook, useRank } from '../context/BookContext';
import Swal from 'sweetalert2';
import Starfield from '../shared/Starfield';
import UnitCard from '../shared/UnitCard';
import LaunchIntro from '../shared/LaunchIntro';
import TutorialOverlay from '../shared/TutorialOverlay';
import ConceptosFedorModal from '../shared/ConceptosFedorModal';
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

interface DailyMissionState {
  day: string;
  missionId: string;
  progress: number;
  claimed: boolean;
  baselineXP: number;
}

const DAILY_MISSIONS = [
  { id: 'm_corr5', txt: 'Acierta 5 ejercicios hoy', goal: 5, metric: 'correct', xp: 60, coins: 40 },
  { id: 'm_corr10', txt: 'Acierta 10 ejercicios hoy', goal: 10, metric: 'correct', xp: 120, coins: 80 },
  { id: 'm_streak3', txt: 'Logra una racha de 3 correctas', goal: 3, metric: 'streak', xp: 80, coins: 50 },
  { id: 'm_streak5', txt: 'Logra una racha de 5 correctas', goal: 5, metric: 'streak', xp: 140, coins: 90 },
  { id: 'm_xp200', txt: 'Gana 200 XP en el día', goal: 200, metric: 'xp', xp: 100, coins: 60 },
];

/** Pantalla principal: hero del estudiante, progreso global y unidades. */
export default function HomeScreen() {
  const { book, progress, openUnit, goScreen, claimDaily, startDailyChallenge, openGameShortcut, grantReward } = useBook();
  const isGrade1 = book?.slug === 'libro-1ro';
  const rank = useRank();

  const [dailyMissionState, setDailyMissionState] = useState<DailyMissionState | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const today = new Date().toDateString();
      const raw = localStorage.getItem('fedor1_daily_mission');
      let state = raw ? JSON.parse(raw) : null;
      
      const missionIndex = (new Date().getDate() + new Date().getMonth()) % DAILY_MISSIONS.length;
      const mission = DAILY_MISSIONS[missionIndex];

      if (!state || state.day !== today) {
        state = {
          day: today,
          missionId: mission.id,
          progress: 0,
          claimed: false,
          baselineXP: progress?.gamification?.totalXP ?? 0,
        };
        localStorage.setItem('fedor1_daily_mission', JSON.stringify(state));
      } else {
        const activeMission = DAILY_MISSIONS.find(m => m.id === state.missionId);
        if (activeMission && activeMission.metric === 'xp' && progress) {
          const delta = progress.gamification.totalXP - (state.baselineXP || 0);
          state.progress = Math.min(activeMission.goal, Math.max(0, delta));
          localStorage.setItem('fedor1_daily_mission', JSON.stringify(state));
        }
      }
      setDailyMissionState(state);
    } catch (e) {
      console.error(e);
    }
  }, [progress?.gamification?.totalXP]);

  const handleClaimDailyMission = () => {
    if (!dailyMissionState || dailyMissionState.claimed) return;
    const mission = DAILY_MISSIONS.find(m => m.id === dailyMissionState.missionId);
    if (!mission) return;

    const updated = { ...dailyMissionState, claimed: true };
    try {
      localStorage.setItem('fedor1_daily_mission', JSON.stringify(updated));
    } catch {}
    setDailyMissionState(updated);

    grantReward(mission.xp, mission.coins);

    Swal.fire({
      title: '¡Misión Completada! 🎁',
      html: `<div style="font-size:16px; font-weight:800; color:#2A0F60; margin-top:8px;">
               Has recibido:<br/>
               <span style="font-size:22px; color:#F5C518; font-weight:900;">+${mission.xp} XP · +${mission.coins} 🪙</span>
             </div>`,
      icon: 'success',
      confirmButtonText: '¡Súper!',
      confirmButtonColor: '#9B5CFF',
    });
  };
  const [showIntro, setShowIntro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showRankUpModal, setShowRankUpModal] = useState(false);
  const [showConceptos, setShowConceptos] = useState(false);

  const handleClaimDailyClick = () => {
    claimDaily();
    setShowDailyModal(true);
  };

  const handleCloseDailyModal = () => {
    setShowDailyModal(false);
    setShowRankUpModal(true);
  };

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: '0.75rem' }}>
          <Stat value={g.totalXP} label="XP Total" color="#FF8C2A" />
          <Stat value={Object.keys(progress.scores).length} label="Niveles ✅" color="#24C496" />
          <Stat value={`${g.maxStreak}🔥`} label="Racha" color="#FF8C2A" />
        </div>

        {/* Unit Progress Bars */}
        <div style={{ display: 'grid', gap: '5px', margin: '0.85rem 0' }}>
          {book.units.map((unit) => {
            const pct = unitProgressPct(unit, progress.scores);
            const col = pct >= 70 ? '#24C496' : pct >= 50 ? '#F5C518' : '#7B2FBE';
            return (
              <div key={unit.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', width: '18px', display: 'flex', justifyContent: 'center', color: '#fff' }}>
                  {unit.icon || '📚'}
                </span>
                <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: col, width: `${pct}%`, borderRadius: '3px', transition: 'width 1.2s' }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 900, color: col, minWidth: '28px', textAlign: 'right' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Botón Análisis IA Fedor */}
        <button 
          onClick={() => {
            goScreen('report');
            setTimeout(() => {
              document.getElementById('ai-report-btn')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }} 
          style={{ 
            width: '100%', 
            padding: '9px', 
            fontSize: '12px', 
            fontWeight: 900, 
            background: 'rgba(245,197,24,.12)', 
            color: '#F5C518', 
            border: '1.5px solid rgba(245,197,24,.25)', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontFamily: "'Nunito',sans-serif",
            marginTop: '8px'
          }}
        >
          🤖 Análisis IA Fedor
        </button>
      </div>

      {/* Recompensa diaria */}
      <div className="daily-reward" onClick={handleClaimDailyClick} style={{ opacity: dailyAvailable ? 1 : 0.55 }}>
        <span className="dr-icon">🎁</span>
        <div className="dr-body">
          <div className="dr-title">Recompensa diaria</div>
          <div className="dr-sub">¡Entra cada día y gana XP extra!</div>
        </div>
        <span className="dr-badge">{dailyAvailable ? '¡Disponible!' : 'Reclamada'}</span>
      </div>

      {/* Grade 1: Brand banner (Matemáticas de Fedor) */}
      {isGrade1 && (
        <div className="fedor-brand" style={{ marginBottom: '.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="fedor-brand-logo"><span style={{ fontSize: 20 }}>🚀</span></div>
            <div>
              <div className="fedor-brand-txt">Matemáticas de Fedor</div>
              <div className="fedor-brand-sub">Libro Interactivo · Grado 1° · Colombia</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}>¿Tienes el libro Excel?</div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#FF8C2A' }}>Úsalos juntos 📊</div>
          </div>
        </div>
      )}

      {/* Grade 1: Misión del día */}
      {isGrade1 && dailyMissionState && (() => {
        const activeMission = DAILY_MISSIONS.find((m) => m.id === dailyMissionState.missionId);
        if (!activeMission) return null;
        const pct = Math.min(100, Math.round((dailyMissionState.progress / activeMission.goal) * 100));
        const done = dailyMissionState.progress >= activeMission.goal;
        const claimed = dailyMissionState.claimed;

        return (
          <div 
            className="daily-mission-card"
            style={{
              background: 'linear-gradient(135deg, #1E0848, #7B2FBE, #E8650A)',
              borderRadius: '18px',
              padding: '1rem 1.15rem',
              marginBottom: '.85rem',
              color: '#fff',
              boxShadow: '0 8px 30px rgba(123, 47, 190, .4)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  background: 'rgba(0,0,0,.35)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '26px', 
                  flexShrink: 0, 
                  border: '1.5px solid rgba(255,224,102,.4)' 
                }}
              >
                🎯
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,224,102,.85)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
                  Misión del día
                </div>
                <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '15px', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginTop: '2px' }}>
                  {activeMission.txt}
                </div>
                
                {/* Progress track */}
                <div 
                  style={{ 
                    height: '8px', 
                    background: 'rgba(255,255,255,0.18)', 
                    borderRadius: '5px', 
                    overflow: 'hidden', 
                    marginTop: '10px',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #FFB066, #FF7300)', 
                      borderRadius: '5px', 
                      width: `${pct}%`,
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,.75)', marginTop: '6px' }}>
                  <span>{dailyMissionState.progress} / {activeMission.goal}</span>
                  <span style={{ color: '#F5C518' }}>+{activeMission.xp} XP · +{activeMission.coins} 🪙</span>
                </div>
              </div>
              
              <div style={{ flexShrink: 0, alignSelf: 'center', marginLeft: '8px' }}>
                {done && !claimed ? (
                  <button 
                    onClick={handleClaimDailyMission} 
                    style={{ 
                      background: 'linear-gradient(135deg, #F5C518, #FF8C2A)', 
                      color: '#2A0F60', 
                      border: 'none', 
                      borderRadius: '12px', 
                      padding: '10px 14px', 
                      fontSize: '12px', 
                      fontWeight: 900, 
                      cursor: 'pointer', 
                      fontFamily: "'Nunito', sans-serif", 
                      boxShadow: '0 4px 14px rgba(245,197,24,.5)',
                      animation: 'pulse 1.6s ease-in-out infinite' 
                    }}
                  >
                    🎁 RECLAMAR
                  </button>
                ) : claimed ? (
                  <div style={{ background: 'rgba(36,196,150,.2)', border: '1px solid #24C496', color: '#24C496', borderRadius: '10px', padding: '6px 10px', fontSize: '11px', fontWeight: 900 }}>
                    ✅ HECHO
                  </div>
                ) : (
                  <div style={{ fontSize: '32px', opacity: 0.7 }}>🔒</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reto del día */}
      <div className="daily-challenge" onClick={() => !challengeDone && startDailyChallenge()} style={{ opacity: challengeDone ? 0.55 : 1, cursor: challengeDone ? 'default' : 'pointer', marginBottom: '.85rem' }}>
        <span className="dc-icon">⚡</span>
        <div className="dc-body">
          <div className="dc-title">Desafío del día</div>
          <div className="dc-sub">{challengeDone ? '¡Completado hoy! Vuelve mañana' : '8 ejercicios · ¡gana el doble de monedas!'}</div>
        </div>
        <span className="dc-badge">{challengeDone ? '✅' : '🏅 x2'}</span>
      </div>

      {/* Mini-juegos */}
      {!isGrade1 && (
        <div className="daily-challenge" onClick={() => goScreen('games')} style={{ cursor: 'pointer', marginBottom: '.85rem' }}>
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
        <div className="daily-challenge" onClick={() => goScreen('diary')} style={{ cursor: 'pointer', marginBottom: '.85rem' }}>
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
        <div className="daily-challenge" onClick={() => goScreen('examen')} style={{ cursor: 'pointer', marginBottom: '.85rem' }}>
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
        <div className="daily-challenge" onClick={() => goScreen('espacial')} style={{ cursor: 'pointer', marginBottom: '.85rem' }}>
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

      {/* Grade 1: Mapa de progreso */}
      {isGrade1 && <ProgressMap />}

      <div className="sec-title">📦 UNIDADES DE APRENDIZAJE</div>
      {isGrade1 ? (
        <div style={{ display: 'grid', gap: '8px', marginBottom: '1.25rem' }}>
          {book.units.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit} 
              pct={unitProgressPct(unit, progress.scores)} 
              onClick={() => openUnit(unit.index)} 
              isGrade1={true}
            />
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* Grade 1: Recursos extra */}
      {isGrade1 && (
        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <div 
            style={{ 
              fontSize: '13px', 
              fontWeight: 900, 
              color: 'rgba(245,197,24,.85)', 
              textTransform: 'uppercase', 
              letterSpacing: '.08em', 
              paddingLeft: '6px',
              marginBottom: '.85rem'
            }}
          >
            ✨ Recursos extra
          </div>

          {/* Tablas de Conteo */}
          <div 
            className="feat-btn" 
            onClick={() => goScreen('conteo')} 
            style={{ background: 'linear-gradient(135deg,#fff,#F0F8FF)' }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#1A6CB4,#4DA6FF)' }}>🔢</div>
            <div className="feat-info">
              <div className="feat-name">Tablas de Conteo</div>
              <div className="feat-meta">Ranges 1-10, 1-20, 1-30, 1-50, 1-100</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>

          {/* Conceptos */}
          <div 
            className="feat-btn" 
            onClick={() => setShowConceptos(true)} 
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)' }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#16876A,#34D399)' }}>📚</div>
            <div className="feat-info">
              <div className="feat-name">Conceptos</div>
              <div className="feat-meta">Definiciones técnicas de cada operación</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>

          {/* Retos Matemáticos */}
          <div 
            className="feat-btn" 
            onClick={() => goScreen('retos')} 
            style={{ background: 'linear-gradient(135deg,#fff,#FFF6E6)' }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#FF8A1F,#FFB066)' }}>🏆</div>
            <div className="feat-info">
              <div className="feat-name">Retos Matemáticos</div>
              <div className="feat-meta">Desafíos para primer grado</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>

          {/* Separator / Spacer */}
          <div style={{ height: '1.5rem' }} />

          {/* Estándares MEN */}
          <div 
            className="feat-btn" 
            onClick={() => goScreen('estandares')} 
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)' }}
          >
            <div 
              className="feat-icon" 
              style={{ 
                background: '#fff', 
                fontSize: '18px', 
                fontWeight: 900, 
                color: '#333', 
                border: '1.5px solid rgba(0,0,0,.08)',
                boxShadow: 'none' 
              }}
            >
              CO
            </div>
            <div className="feat-info">
              <div className="feat-name">Estándares MEN</div>
              <div className="feat-sub">Programa de 1° Colombia</div>
            </div>
          </div>

          {/* Problemas Cotidianos */}
          <div 
            className="feat-btn" 
            onClick={() => goScreen('problemas')} 
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)' }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)' }}>🛒</div>
            <div className="feat-info">
              <div className="feat-name">Problemas Cotidianos</div>
              <div className="feat-meta">Conteo de monedas + compras + 4 operaciones</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      )}

      {/* For Grade 2, we can render fedor-brand at the bottom */}
      {!isGrade1 && (
        <div className="fedor-brand" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="fedor-brand-logo"><span style={{ fontSize: 20 }}>🚀</span></div>
            <div>
              <div className="fedor-brand-txt">Matemáticas de Fedor</div>
              <div className="fedor-brand-sub">Libro Interactivo · Grado 2° · Colombia</div>
            </div>
          </div>
        </div>
      )}

      {showDailyModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10010,
            background: 'radial-gradient(circle at center, rgba(20,8,48,.96), rgba(0,0,0,.98))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            fontFamily: "'Nunito', sans-serif"
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '340px', padding: '0 1rem', color: '#fff' }}>
            <div 
              style={{ 
                fontSize: '11px', 
                fontWeight: 900, 
                color: '#F5C518', 
                letterSpacing: '.2em', 
                marginBottom: '.5rem', 
                animation: 'fadeInDown .5s ease .2s both' 
              }}
            >
              ★ MEDALLA DESBLOQUEADA ★
            </div>
            <div 
              style={{ 
                fontSize: '130px', 
                margin: '.5rem 0', 
                filter: 'drop-shadow(0 0 35px rgba(245,197,24,.7))', 
                animation: 'trophyPop 1.1s cubic-bezier(.34,1.56,.64,1) both, trophySpin 3s linear .8s infinite',
                lineHeight: 1.1
              }}
            >
              📅
            </div>
            <div 
              style={{ 
                fontFamily: "'Baloo 2', sans-serif", 
                fontSize: '30px', 
                fontWeight: 900, 
                color: '#FFE066', 
                marginBottom: '.4rem', 
                textShadow: '0 0 20px rgba(245,197,24,.6)', 
                animation: 'fadeInUp .5s ease .6s both' 
              }}
            >
              Constante
            </div>
            <div 
              style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: 'rgba(255,255,255,.85)', 
                lineHeight: 1.5, 
                marginBottom: '1rem', 
                animation: 'fadeInUp .5s ease .8s both' 
              }}
            >
              Entraste {progress.gamification.loginStreak || 3} días seguidos
            </div>
            <div 
              style={{ 
                display: 'inline-flex', 
                gap: '14px', 
                background: 'rgba(245,197,24,.15)', 
                border: '1.5px solid rgba(245,197,24,.4)', 
                borderRadius: '14px', 
                padding: '8px 18px', 
                marginBottom: '1.25rem', 
                animation: 'fadeInUp .5s ease 1s both' 
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#F5C518' }}>+50 XP</span>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#FF8C2A' }}>+25 🪙</span>
            </div>
            <button 
              onClick={handleCloseDailyModal}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '14px', 
                fontSize: '15px', 
                fontWeight: 900, 
                background: 'linear-gradient(135deg,#F5C518,#FF8C2A)', 
                color: '#2A0F60', 
                border: 'none', 
                borderRadius: '14px', 
                cursor: 'pointer', 
                fontFamily: "'Nunito', sans-serif", 
                letterSpacing: '.05em', 
                boxShadow: '0 8px 28px rgba(245,197,24,.5)', 
                animation: 'fadeInUp .5s ease 1.2s both' 
              }}
            >
              ¡GENIAL! 🚀
            </button>
          </div>
        </div>
      )}

      {showRankUpModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10010,
            background: 'radial-gradient(circle at center, rgba(123,47,190,.96), rgba(10,4,32,.98))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            fontFamily: "'Nunito', sans-serif"
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '360px', padding: '0 1rem', color: '#fff' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#FFE066', letterSpacing: '.25em', marginBottom: '.5rem' }}>
              ↑ ASCENSO DE RANGO ↑
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '.4rem' }}>
              <span>🌱</span> Explorador
            </div>
            <div 
              style={{ 
                fontSize: '90px', 
                margin: '.5rem 0', 
                filter: 'drop-shadow(0 0 40px rgba(168,100,232,.9))', 
                animation: 'rankPulse 1.6s ease-in-out infinite',
                lineHeight: 1.1
              }}
            >
              ⭐
            </div>
            <div 
              style={{ 
                fontFamily: "'Baloo 2', sans-serif", 
                fontSize: '52px', 
                fontWeight: 900, 
                color: '#fff', 
                marginBottom: '.5rem',
                lineHeight: 1.1
              }}
            >
              Aprendiz
            </div>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245,197,24,.15)', 
                border: '1.5px solid rgba(245,197,24,.4)', 
                borderRadius: '14px', 
                padding: '6px 16px', 
                marginBottom: '1.25rem',
                color: '#FFE066',
                fontWeight: 800,
                fontSize: '15px'
              }}
            >
              <span>⭐</span> Aprendiz
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.85)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto 1.5rem' }}>
              ¡Has subido al siguiente rango espacial! Sigue volando alto, astronauta.
            </div>
            <button 
              onClick={() => setShowRankUpModal(false)}
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontSize: '15px', 
                fontWeight: 900, 
                background: 'linear-gradient(135deg, #7B2FBE, #A864E8)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '14px', 
                cursor: 'pointer', 
                fontFamily: "'Nunito', sans-serif", 
                letterSpacing: '.05em', 
                boxShadow: '0 8px 28px rgba(123,47,190,.5)' 
              }}
            >
              CONTINUAR MISIÓN ✨
            </button>
          </div>
        </div>
      )}

      {showConceptos && (
        <ConceptosFedorModal onClose={() => setShowConceptos(false)} />
      )}
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

function ProgressMap() {
  const { book, progress, openUnit } = useBook();
  if (!book || !progress) return null;

  const unit1 = book.units[0];
  if (!unit1) return null;

  return (
    <div className="progress-map" style={{ cursor: 'pointer' }} onClick={() => openUnit(0)}>
      <div className="pm-title">
        <span>🗺️</span> MAPA DE PROGRESO — UNIDAD 1
      </div>
      <div className="pm-path">
        {unit1.topics.map((t, ti) => {
          const isTopicDone = t.levels.every((l) => {
            const key = `u0t${ti}-n${l.index}`;
            return progress.scores[key] && progress.scores[key].pts > 0;
          });

          const isTopicStarted = t.levels.some((l) => {
            const key = `u0t${ti}-n${l.index}`;
            return progress.scores[key] && progress.scores[key].pts > 0;
          });

          const bestL = t.levels.findIndex((l) => {
            const key = `u0t${ti}-n${l.index}`;
            return !progress.scores[key] || progress.scores[key].pts === 0;
          });
          const bestLName = bestL >= 0 ? t.levels[bestL].label : '';

          let cls = 'locked';
          if (isTopicDone) cls = 'done';
          else if (isTopicStarted) cls = 'active';

          return (
            <Fragment key={ti}>
              {ti > 0 && <span className="pm-connector">→</span>}
              <div className="pm-step">
                <div className={`pm-bubble ${cls}`}>
                  {t.icon || '📚'}
                  {isTopicDone && <span className="pm-check">✅</span>}
                  {isTopicStarted && !isTopicDone && bestLName && (
                    <span className="pm-level-badge">{bestLName}</span>
                  )}
                </div>
                <div className="pm-label">
                  {t.title.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

