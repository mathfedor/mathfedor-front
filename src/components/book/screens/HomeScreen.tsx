'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useBook, useRank } from '../context/BookContext';
import Starfield from '../shared/Starfield';
import UnitCard from '../shared/UnitCard';
import LaunchIntro from '../shared/LaunchIntro';
import TutorialOverlay from '../shared/TutorialOverlay';
import { globalProgressPct, unitProgressPct } from '../shared/progress.utils';
import { dayKey } from '@/services/daily-challenge.service';

const TUTORIAL_KEY = 'fedor2_tutorial_done';

/** Pantalla principal: hero del estudiante, progreso global y unidades. */
export default function HomeScreen() {
  const { book, progress, openUnit, goScreen, claimDaily, startDailyChallenge } = useBook();
  const rank = useRank();
  const [showIntro, setShowIntro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
          <span className="hs-item">{g.totalXP} XP</span>
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '.6rem' }}>
          <button className="intro-btn" onClick={() => setShowIntro(true)}>🎬 Ver intro del despegue 🚀</button>
        </div>
      </div>

      {showIntro && <LaunchIntro onClose={() => setShowIntro(false)} />}
      {showTutorial && <TutorialOverlay onClose={closeTutorial} />}

      {/* Mapa galaxia 3D */}
      <div className="galaxy-card" onClick={() => goScreen('galaxy')}>
        <div className="galaxy-card-bg" />
        <div className="galaxy-card-body">
          <div>
            <div className="galaxy-card-kicker">🌌 Universo Fedor</div>
            <div className="galaxy-card-title">Galaxia del Saber</div>
            <div className="galaxy-card-sub">Explora tus {book.units.length} planetas en 3D</div>
          </div>
          <span className="galaxy-card-cta">Explorar →</span>
        </div>
      </div>

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
      <div className="daily-challenge" onClick={() => goScreen('games')} style={{ cursor: 'pointer' }}>
        <span className="dc-icon">🎮</span>
        <div className="dc-body">
          <div className="dc-title">Mini-juegos</div>
          <div className="dc-sub">Practica la división repartiendo chocolatinas</div>
        </div>
        <span className="dc-badge">Jugar →</span>
      </div>

      {/* Diario narrativo */}
      <div className="daily-challenge" onClick={() => goScreen('diary')} style={{ cursor: 'pointer' }}>
        <span className="dc-icon">📖</span>
        <div className="dc-body">
          <div className="dc-title">Diario del viaje</div>
          <div className="dc-sub">La historia de Fedor se desbloquea con tu progreso</div>
        </div>
        <span className="dc-badge">Leer →</span>
      </div>

      {/* Examen final */}
      <div className="daily-challenge" onClick={() => goScreen('examen')} style={{ cursor: 'pointer' }}>
        <span className="dc-icon">🎓</span>
        <div className="dc-body">
          <div className="dc-title">Examen Final</div>
          <div className="dc-sub">20 preguntas de todo el libro · aprueba con 14</div>
        </div>
        <span className="dc-badge">+300 🪙</span>
      </div>

      {/* Reto espacial */}
      <div className="daily-challenge" onClick={() => goScreen('espacial')} style={{ cursor: 'pointer' }}>
        <span className="dc-icon">🚀</span>
        <div className="dc-body">
          <div className="dc-title">Reto Espacial</div>
          <div className="dc-sub">Reto diario extra · mantén tu racha espacial</div>
        </div>
        <span className="dc-badge">+50 🪙</span>
      </div>

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
            <div className="fedor-brand-sub">Libro Interactivo · Grado 2° · Colombia</div>
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
