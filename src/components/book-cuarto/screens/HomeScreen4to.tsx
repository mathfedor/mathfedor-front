'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';
import bookCurriculum4 from '@/mocks/data/book-curriculum-4.data.json';
import Starfield from '@/components/book/shared/Starfield';
import UniversoFedorModal4to from '../shared/UniversoFedorModal4to';
import CommandPanelModals4to from '../shared/CommandPanelModals4to';
import Swal from 'sweetalert2';
import { DailyMissionCard4to } from '../shared/DailyMissionCard4to';

interface HomeScreen4toProps {
  onOpenIntro?: () => void;
}

const CELESTIAL_ORBS_4TO = [
  { num: 1, name: 'La Tierra', icon: '🌍', color: '#1A6CB4', glow: '#4DA6FF' },
  { num: 2, name: 'Mercurio', icon: '🟤', color: '#9B7A4F', glow: '#E0B07A' },
  { num: 3, name: 'Venus', icon: '🟡', color: '#D4AC2A', glow: '#FFD96A' },
  { num: 4, name: 'Marte', icon: '🔴', color: '#C94B22', glow: '#FF6B3B' },
  { num: 5, name: 'Sirio', icon: '⭐', color: '#FFD700', glow: '#FFF4A8' },
  { num: 6, name: 'Ceres', icon: '🪨', color: '#A0A0A0', glow: '#D5D5D5' },
  { num: 7, name: 'Pallas', icon: '🪨', color: '#A0A0A0', glow: '#D5D5D5' },
  { num: 8, name: 'Júpiter', icon: '🟠', color: '#D8853A', glow: '#FFB870' },
  { num: 9, name: 'Saturno', icon: '🪐', color: '#B8860B', glow: '#F5C518' },
  { num: 10, name: 'Cometa Halley', icon: '☄️', color: '#A8E8FF', glow: '#E0F4FF' },
  { num: 11, name: 'Neptuno', icon: '🔵', color: '#1A4CB4', glow: '#4D8AFF' },
  { num: 12, name: 'Urano', icon: '🔷', color: '#5FBEC8', glow: '#A8E8F0' },
  { num: 13, name: 'Plutón', icon: '🟣', color: '#8B5A2B', glow: '#C89060' },
  { num: 14, name: 'Nebulosa de Orión', icon: '🌌', color: '#9B5CFF', glow: '#D4A8FF' },
  { num: 15, name: 'El Sol', icon: '☀️', color: '#E8650A', glow: '#FFD700' },
];

export default function HomeScreen4to({ onOpenIntro }: HomeScreen4toProps) {
  const {
    student,
    coins,
    streak,
    totalXP,
    scores,
    selectUnit,
    goScreen,
    updateStats,
  } = useBook4();

  const [showUniverseModal, setShowUniverseModal] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  const units = bookCurriculum4.UNITS || [];

  // Count total completed blocks (250 blocks in 4° grado)
  const completedBlocksCount = Object.keys(scores).filter((k) => (scores[k] || 0) > 0).length;

  // Calculate unit completion %
  const getUnitPct = (uIdx: number) => {
    const u = units[uIdx];
    if (!u || !u.topics || u.topics.length === 0) return 0;
    let totalScore = 0;
    let totalLevels = 0;
    u.topics.forEach((t: any, ti: number) => {
      (t.levels || []).forEach((_: any, li: number) => {
        totalLevels++;
        const key = `${t.id || `u${uIdx}t${ti}`}-n${li + 1}`;
        totalScore += scores[key] || 0;
      });
    });
    return totalLevels > 0 ? Math.round(totalScore / totalLevels) : 0;
  };

  // Global progress calculation
  const totalBookPct = Math.round(
    units.reduce((acc: number, _: any, idx: number) => acc + getUnitPct(idx), 0) / (units.length || 1)
  );

  // Ranks
  const ranks = [
    { min: 0, label: '🌱 Explorador' },
    { min: 200, label: '🚀 Aprendiz' },
    { min: 500, label: '⭐ Aventurero' },
    { min: 1000, label: '🪐 Experto' },
    { min: 2000, label: '👑 Maestro' },
    { min: 4000, label: '🌌 Leyenda' },
  ];
  const currentRank = [...ranks].reverse().find((r) => totalXP >= r.min) || ranks[0];
  const nextRank = ranks[ranks.indexOf(currentRank) + 1] || null;
  const rankPct = nextRank
    ? Math.min(100, Math.round(((totalXP - currentRank.min) / (nextRank.min - currentRank.min)) * 100))
    : 100;

  // Active mission: first incomplete unit
  const activeUnitIdx = units.findIndex((_: any, idx: number) => getUnitPct(idx) < 100);
  const activeMissionIdx = activeUnitIdx !== -1 ? activeUnitIdx : 0;

  const handleClaimDailyReward = () => {
    updateStats(25, 1, 30);
    Swal.fire({
      title: '🎁 ¡Recompensa Reclamada!',
      text: '¡Ganaste +25 monedas cósmicas y +30 XP por tu constancia!',
      icon: 'success',
      confirmButtonColor: '#E8650A',
    });
  };

  const handleDailyChallenge = () => {
    setActiveToolModal('misiones');
  };

  return (
    <div className="home-screen-4to">
      {/* ═════════════════════════════════════════════════════════════
          1. HERO BANNER
      ═════════════════════════════════════════════════════════════ */}
      <div className="hero-banner">
        <Starfield count={50} />
        <div className="hero-planet" />
        <div className="hero-ring" />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.65rem', position: 'relative', zIndex: 1 }}>
          <div
            id="heroAvatarCircle"
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
              boxShadow: '0 0 0 4px rgba(245,197,24,.6), 0 8px 28px rgba(123,47,190,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              animation: 'float 3.2s ease-in-out infinite',
              flexShrink: 0,
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
        </div>

        <div className="f5hero-x">
          <div className="f5rank">
            <b>{currentRank.label}</b>
            <div className="f5bar">
              <i style={{ width: `${rankPct}%` }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 12, whiteSpace: 'nowrap' }}>
              {nextRank ? `${totalXP}/${nextRank.min} XP` : `${totalXP} XP`}
            </span>
          </div>

          <div className="f5chips">
            <span className="f5chip">📚 {totalBookPct}% del libro</span>
            <span className="f5chip">⚡ {totalXP} XP</span>
            <span className="f5chip">🪙 {coins} monedas</span>
            <span className="f5chip">🔥 {streak} racha</span>
          </div>

          <button
            type="button"
            className="f5go"
            onClick={() => selectUnit(activeMissionIdx)}
          >
            <span style={{ fontSize: 28 }}>🚀</span>
            <span>
              {totalBookPct > 0 ? '¡Continuar mi misión!' : '¡Empezar la aventura!'}
              <small>Misión {activeMissionIdx + 1} · {units[activeMissionIdx]?.name}</small>
            </span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          1. UNIVERSO FEDOR: Galaxia del Saber
      ═════════════════════════════════════════════════════════════ */}
      <div
        id="galaxyMapWrap"
        onClick={() => setShowUniverseModal(true)}
        className="f4-galaxy-wrap"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <span>🌌</span> UNIVERSO FEDOR
            </div>
            <div className="text-lg md:text-xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Galaxia del Saber
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-orange-400">
              {streak} 🔥
            </div>
            <div className="text-[10px] text-white/40 font-bold">
              mejor racha
            </div>
          </div>
        </div>

        {/* 15 Planet Orbs Strip */}
        <div className="f4-planet-strip">
          {CELESTIAL_ORBS_4TO.map((orb, idx) => {
            const pct = getUnitPct(idx);
            const isNow = idx === activeMissionIdx;
            return (
              <div
                key={orb.num}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUniverseModal(true);
                }}
                className="f4-planet-node cursor-pointer"
                title={`Misión ${orb.num} · ${orb.name} · Toca para abrir Universo Fedor`}
              >
                <div
                  className={`f4-planet-orb ${isNow ? 'active-now' : ''}`}
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${orb.glow}, ${orb.color} 65%, #000)`,
                    boxShadow: isNow
                      ? `0 0 16px ${orb.glow}, 0 0 0 2px #FFE066`
                      : pct > 0
                      ? `0 0 10px ${orb.glow}`
                      : 'none',
                  }}
                >
                  <span className="text-lg sm:text-xl">{orb.icon}</span>
                </div>
                <span className="f4-planet-lbl">
                  {pct >= 100 ? '✓' : `M${orb.num}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to open Universe modal */}
        <div className="f4-open-universe-cta">
          🚀 <b style={{ color: '#FFE066' }}>Abrir el Universo Fedor</b> · 15 misiones, una por unidad
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          2. PANEL DE COMANDO: 7 Acciones Cósmicas
      ═════════════════════════════════════════════════════════════ */}
      <div id="fedorActionBar" className="f4-action-bar">
        {/* Floating pill badge superimposed on top border */}
        <div className="f4-action-badge">
          <span className="badge-bolt">⚡</span>
          <span>PANEL DE COMANDO</span>
        </div>

        <button
          type="button"
          onClick={() => setActiveToolModal('tienda')}
          className="ab-btn tienda"
        >
          <span className="ab-ico">🛒</span>
          <span className="ab-lbl">Tienda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveToolModal('espacial')}
          className="ab-btn espacial"
        >
          <span className="ab-ico">🚀</span>
          <span className="ab-lbl">Espacial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveToolModal('diario')}
          className="ab-btn diario"
        >
          <span className="ab-ico">📓</span>
          <span className="ab-lbl">Diario</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveToolModal('examen')}
          className="ab-btn examen"
        >
          <span className="ab-ico">📝</span>
          <span className="ab-lbl">Examen</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenIntro?.()}
          className="ab-btn intro"
        >
          <span className="ab-ico">🎬</span>
          <span className="ab-lbl">Despegue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveToolModal('stickers')}
          className="ab-btn album"
        >
          <span className="ab-ico">📔</span>
          <span className="ab-lbl">Stickers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveToolModal('juegos')}
          className="ab-btn juegos"
        >
          <span className="ab-ico">🎮</span>
          <span className="ab-lbl">Juegos</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          3. TRAVESÍA MERCURIO → PLUTÓN (Pista Orbital 250 Bloques)
      ═════════════════════════════════════════════════════════════ */}
      <div id="fedorJourneyWrap" className="f4-journey-wrap">
        <div className="fj-header">
          <div className="fj-title">
            🪐 TRAVESÍA MERCURIO → PLUTÓN
          </div>
          <div className="fj-progress">
            {completedBlocksCount} / 250 bloques
          </div>
        </div>

        <div className="fj-track">
          {/* Planet Mercurio with bouncing INICIA AQUÍ badge */}
          <div className="fj-mercury-wrap">
            <div className="fj-start-here">
              <div className="fj-start-arrow">⬇</div>
              <div className="fj-start-pill">INICIA AQUÍ</div>
            </div>
            <div className="fj-planet-mercury">
              <div className="fj-planet-crater" />
            </div>
            <div className="fj-planet-label">☿ Mercurio</div>
          </div>

          {/* Spaceship Rocket */}
          <div className="fj-ship-holder">
            <span className="fj-rocket-icon">🚀</span>
          </div>

          {/* Asteroid Bead Orbit Line */}
          <div className="fj-asteroid-row">
            {Array.from({ length: 42 }).map((_, idx) => {
              const isDone = idx < Math.floor((completedBlocksCount / 250) * 42);
              const isCurrent = idx === Math.floor((completedBlocksCount / 250) * 42);
              return (
                <div
                  key={idx}
                  className={`fj-ast ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="fj-legend">
          <span>🪨 = bloque pendiente</span>
          <span>⭐ = bloque dominado</span>
          <span>🚀 = posición actual</span>
        </div>

        {/* Status Message */}
        <div className="fj-celebrate-msg">
          🌅 ¡La nave está en Mercurio, lista para empezar!
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          3. 🌟 HOY EN FEDOR ¡ENTRA CADA DÍA!
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec">
        🌟 Hoy en Fedor <small>¡entra cada día!</small>
      </div>
      <div className="f5hoy">
        {/* Recompensa Diaria */}
        <button
          type="button"
          onClick={handleClaimDailyReward}
          className="f5tile"
          style={{ background: 'linear-gradient(135deg, #16876A, #24C496)' }}
        >
          <span className="i">🎁</span>
          <span>
            <b>Recompensa Diaria</b>
            <small>Racha de {streak} días · ¡Reclama monedas!</small>
          </span>
        </button>

        {/* Desafío del Día */}
        <button
          type="button"
          onClick={handleDailyChallenge}
          className="f5tile"
          style={{ background: 'linear-gradient(135deg, #E8650A, #FF8C2A)' }}
        >
          <span className="i">⚔️</span>
          <span>
            <b>Desafío del Día</b>
            <small>¡Reto especial con bono de XP!</small>
          </span>
        </button>

        {/* Misiones de hoy */}
        <button
          type="button"
          onClick={() => setActiveToolModal('misiones')}
          className="f5tile"
          style={{ background: 'linear-gradient(135deg, #0E6BA8, #5B21B6)' }}
        >
          <span className="i">🎯</span>
          <span>
            <b>Misiones de hoy</b>
            <small>3 retos nuevos cada día</small>
          </span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          4. 🕹️ PANEL DE COMANDO TODAS TUS HERRAMIENTAS
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec">
        🕹️ Panel de comando <small>todas tus herramientas</small>
      </div>
      <div className="f5cmd">
        {/* 1. PARA APRENDER */}
        <h4>📗 PARA APRENDER</h4>
        <div className="f5grid">
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('lab-visual')}
            title="Laboratorio visual interactivo"
          >
            <span>🧠</span>
            <span>Laboratorio</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('conteo')}
            title="Tablas de conteo"
          >
            <span>🔢</span>
            <span>Conteo</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('mult')}
            title="Tablas de multiplicar"
          >
            <span>✖️</span>
            <span>Multiplicar</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('lab-est')}
            title="Laboratorio de estadística"
          >
            <span>🔬</span>
            <span>Lab. Est.</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('explicar')}
            title="Explicaciones paso a paso"
          >
            <span>💡</span>
            <span>Explicar</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('videos')}
            title="Videos animados"
          >
            <span>🎬</span>
            <span>Videos</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('concepto')}
            title="Concepto del día"
          >
            <span>📘</span>
            <span>Concepto</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #5C21A6, #8B3EDB)' }}
            onClick={() => setActiveToolModal('historia')}
            title="Historia del método Fedor"
          >
            <span>📜</span>
            <span>Historia</span>
          </button>
        </div>

        {/* 2. PARA JUGAR Y GANAR */}
        <h4>🎮 PARA JUGAR Y GANAR</h4>
        <div className="f5grid">
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #E8650A, #F5A524)' }}
            onClick={() => setActiveToolModal('desafio')}
            title="Desafío matemático del día"
          >
            <span>🎯</span>
            <span>Desafío</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #E8650A, #F5A524)' }}
            onClick={() => setActiveToolModal('logros')}
            title="Vitrina de trofeos y medallas"
          >
            <span>🏆</span>
            <span>Logros</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #E8650A, #F5A524)' }}
            onClick={() => setActiveToolModal('minijuegos')}
            title="Minijuegos de agilidad mental"
          >
            <span>🎮</span>
            <span>Minijuegos</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #E8650A, #F5A524)' }}
            onClick={() => setShowUniverseModal(true)}
            title="Universo Fedor"
          >
            <span>🌌</span>
            <span>Universo</span>
          </button>
        </div>

        {/* 3. PARA PONERME A PRUEBA */}
        <h4>📝 PARA PONERME A PRUEBA</h4>
        <div className="f5grid">
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #0E6BA8, #38BDF8)' }}
            onClick={() => setActiveToolModal('saber')}
            title="Problemas tipo Prueba SABER"
          >
            <span>🏆</span>
            <span>SABER</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #0E6BA8, #38BDF8)' }}
            onClick={() => setActiveToolModal('examen-final')}
            title="Examen final integrador de 4°"
          >
            <span>🎓</span>
            <span>Examen final</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #0E6BA8, #38BDF8)' }}
            onClick={() => setActiveToolModal('repaso')}
            title="Mi Repaso personalizado"
          >
            <span>🔄</span>
            <span>Mi Repaso</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #0E6BA8, #38BDF8)' }}
            onClick={() => goScreen('problemas')}
            title="Problemas cotidianos SABER"
          >
            <span>🛒</span>
            <span>SABER cotidianos</span>
          </button>
        </div>

        {/* 4. PROFES Y FAMILIA */}
        <h4>👩‍🏫 PROFES Y FAMILIA</h4>
        <div className="f5grid">
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #16876A, #24C496)' }}
            onClick={() => setActiveToolModal('guia-docente')}
            title="Guía docente y estándares MEN"
          >
            <span>👩‍🏫</span>
            <span>Guía Doc.</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #16876A, #24C496)' }}
            onClick={() => setActiveToolModal('color')}
            title="Color de fondo del libro"
          >
            <span>🎨</span>
            <span>Color</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #16876A, #24C496)' }}
            onClick={() => setActiveToolModal('curriculo')}
            title="Currículo MEN 4°"
          >
            <span>📑</span>
            <span>Currículo</span>
          </button>
          <button
            type="button"
            className="f5btn"
            style={{ background: 'linear-gradient(145deg, #16876A, #24C496)' }}
            onClick={() => goScreen('report')}
            title="Informe de progreso"
          >
            <span>📊</span>
            <span>Informe</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          5. 🛒 PROBLEMAS COTIDIANOS — TIPO PRUEBA SABER (4°)
      ═════════════════════════════════════════════════════════════ */}
      <div
        className="sb5-bar"
        onClick={() => goScreen('problemas')}
      >
        <span className="i">🛒</span>
        <span style={{ flex: 1 }}>
          <b>Problemas Cotidianos — Tipo Prueba SABER (4°)</b>
          <small>5 niveles · compras, vueltos, recetas y vida real con proceso paso a paso</small>
        </span>
        <button
          type="button"
          className="sb5-go"
          onClick={(e) => {
            e.stopPropagation();
            goScreen('problemas');
          }}
        >
          ▶ Abrir problemas
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          6. 🪐 MIS MUNDOS DE APRENDIZAJE (15 Misiones de 4°)
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec">
        🪐 Mis mundos de aprendizaje <small>15 misiones · toca para entrar</small>
      </div>
      <div className="f5mundos">
        {units.map((u: any, idx: number) => {
          const orb = CELESTIAL_ORBS_4TO[idx] || {
            num: idx + 1,
            name: `Mundo ${idx + 1}`,
            icon: u.icon || '📘',
            color: '#6C28B4',
            glow: '#C5BFEE',
          };
          const pct = getUnitPct(idx);
          const isNow = idx === activeMissionIdx;

          // Stars rating
          const starsEarned = pct >= 95 ? 5 : pct >= 80 ? 4 : pct >= 65 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;

          return (
            <div
              key={idx}
              className={`f5m ${isNow ? 'now' : ''}`}
            >
              {/* Card Top */}
              <div
                className="f5m-top"
                style={{
                  background: `linear-gradient(135deg, #1A0848, #2A0F60 65%, ${orb.color})`,
                }}
              >
                <div
                  className="f5m-orb"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, ${orb.glow}, ${orb.color} 55%, #000)`,
                    boxShadow: `0 0 24px ${orb.glow}`,
                  }}
                >
                  {orb.icon}
                </div>

                <div className="f5m-num">
                  {pct >= 100 ? '✓' : orb.num}
                </div>

                <div className="f5m-kick">
                  Misión {orb.num} · {orb.name}
                </div>

                <div className="f5m-title">
                  {u.name.replace(/^Unidad\s+\d+\s*—\s*/i, '')}
                </div>

                <div className="f5m-stars">
                  {'⭐'.repeat(starsEarned)}
                  <span style={{ opacity: 0.35 }}>
                    {'⭐'.repeat(5 - starsEarned)}
                  </span>
                </div>

                <div className="f5m-pct">
                  {pct}%
                </div>

                {isNow && <div className="f5m-now">📍 ¡Estás aquí!</div>}
              </div>

              {/* Card Body */}
              <div className="f5m-body">
                {/* Topic Pills */}
                <div className="f5m-temas">
                  {(u.topics || []).slice(0, 5).map((t: any, ti: number) => (
                    <span key={ti}>
                      {t.icon || '•'} {t.title}
                    </span>
                  ))}
                </div>

                {/* Subtopic Action Row */}
                <button
                  type="button"
                  className="f5m-row"
                  onClick={() => selectUnit(idx)}
                >
                  <span className="ic">{u.icon || '📘'}</span>
                  <span className="tx">
                    <b>{u.topics?.length || 0} temas · 5 niveles cada uno</b>
                    <small>
                      {pct >= 100
                        ? '¡Completado! ✅'
                        : pct > 0
                        ? `Vas en ${pct}%`
                        : '¡Nuevo! Empieza aquí'}
                    </small>
                    <span className="f5m-mini">
                      <i
                        style={{
                          width: `${pct}%`,
                          background:
                            pct >= 70
                              ? 'linear-gradient(90deg, #16876A, #24C496)'
                              : pct >= 40
                              ? 'linear-gradient(90deg, #E8650A, #F5C518)'
                              : 'linear-gradient(90deg, #8B3EDB, #C5BFEE)',
                        }}
                      />
                    </span>
                  </span>
                  <span className="f5m-go">
                    {pct >= 100 ? 'Repasar' : pct > 0 ? 'Seguir ▶' : 'Entrar 🚀'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MISIÓN DEL DÍA
      ═════════════════════════════════════════════════════════════ */}
      <DailyMissionCard4to />

      {/* ═════════════════════════════════════════════════════════════
          7. 👨‍👩‍👧 ZONA DE PROFES Y FAMILIAS
      ═════════════════════════════════════════════════════════════ */}
      <details className="f5adult">
        <summary>
          👨‍👩‍👧 Zona de profes y familias <small style={{ fontFamily: 'Nunito', fontSize: 12, color: '#7A7299', fontWeight: 800 }}>informes, progreso detallado y guía</small>
        </summary>
        <div className="p-3 bg-white rounded-xl border border-purple-100 mt-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Progreso global del libro: <strong>{totalBookPct}%</strong></span>
            <span>Total XP acumulado: <strong>{totalXP} XP</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => goScreen('report')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs text-center border border-purple-200 cursor-pointer"
            >
              📊 Ver Informe Detallado
            </button>
            <button
              type="button"
              onClick={() => goScreen('estandares')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs text-center border border-amber-200 cursor-pointer"
            >
              📚 Estándares MEN 4°
            </button>
            <button
              type="button"
              onClick={() => goScreen('definiciones')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs text-center border border-blue-200 cursor-pointer"
            >
              📖 Glosario Matemático
            </button>
            <button
              type="button"
              onClick={() => setActiveToolModal('historia')}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs text-center border border-emerald-200 cursor-pointer"
            >
              🚀 Método Fedor
            </button>
          </div>
        </div>
      </details>

      {/* ══ MODAL DEL UNIVERSO FEDOR ══ */}
      {showUniverseModal && (
        <UniversoFedorModal4to
          isOpen={showUniverseModal}
          onClose={() => setShowUniverseModal(false)}
          onSelectUnit={(uIdx) => selectUnit(uIdx)}
        />
      )}

      {/* ══ MODALES DEL PANEL DE COMANDO ══ */}
      {activeToolModal && (
        <CommandPanelModals4to
          activeTool={activeToolModal}
          onClose={() => setActiveToolModal(null)}
          onOpenIntro={onOpenIntro}
        />
      )}

      <style>{`
        .home-screen-4to {
          padding-bottom: 5rem;
          font-family: 'Nunito', sans-serif;
        }

        .hero-banner {
          background: linear-gradient(160deg, #1a0848, #2a0f60 55%, #4a154b);
          padding: 2rem 1rem 1.6rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          margin-bottom: 1.2rem;
          box-shadow: 0 14px 34px rgba(42, 15, 96, 0.25);
        }

        .hero-planet {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ff8c2a, #e8650a 60%, #5c21a6);
          opacity: 0.35;
          pointer-events: none;
        }

        .hero-ring {
          position: absolute;
          top: -20px;
          right: -50px;
          width: 200px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid rgba(255, 224, 102, 0.4);
          transform: rotate(-25deg);
          pointer-events: none;
        }

        .f5hero-x {
          position: relative;
          z-index: 2;
          max-width: 520px;
          margin: 0.6rem auto 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .f5rank {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          border-radius: 16px;
          padding: 8px 12px;
        }

        .f5rank b {
          font-family: 'Baloo 2', sans-serif;
          font-size: 15px;
          color: #ffe066;
          white-space: nowrap;
        }

        .f5bar {
          flex: 1;
          height: 12px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 8px;
          overflow: hidden;
        }

        .f5bar > i {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #ffe066, #ff8c2a);
          border-radius: 8px;
          transition: width 1s;
        }

        .f5chips {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .f5chip {
          background: rgba(255, 255, 255, 0.14);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: #fff;
          border-radius: 14px;
          padding: 5px 12px;
          font-weight: 900;
          font-size: 13px;
        }

        .f5go {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          background: linear-gradient(135deg, #ffe066, #ff8c2a);
          color: #2a0f60;
          font-family: 'Baloo 2', sans-serif;
          font-size: 19px;
          font-weight: 900;
          box-shadow: 0 8px 24px rgba(255, 140, 42, 0.45);
          animation: f5pulse 2.2s infinite;
        }

        .f5go small {
          display: block;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #5c2a00;
        }

        /* ══ 1. UNIVERSO FEDOR: GALAXIA DEL SABER ══ */
        .f4-galaxy-wrap {
          background: linear-gradient(180deg, #020B18, #050E2A, #0A1840);
          border-radius: 20px;
          padding: 1.1rem 1.3rem 0.9rem;
          margin-bottom: 0.95rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .f4-planet-strip {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 6px;
          padding: 0.6rem 0 0.3rem;
          overflow-x: auto;
        }

        .f4-planet-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          flex: 1;
          min-width: 38px;
          transition: transform 0.2s ease;
        }

        .f4-planet-node:hover {
          transform: translateY(-2px);
        }

        .f4-planet-orb {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .f4-planet-orb.active-now {
          outline: 2.5px solid #FFE066;
          outline-offset: 2px;
          box-shadow: 0 0 16px rgba(255, 224, 102, 0.85);
          animation: fjPulse 1.8s ease-in-out infinite;
        }

        .f4-planet-lbl {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.7);
        }

        .f4-open-universe-cta {
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 700;
          margin-top: 0.6rem;
        }

        /* ══ 2. PANEL DE COMANDO: 7 ACCIONES CÓSMICAS ══ */
        .f4-action-bar {
          position: relative;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1A0A3C, #2A0F60, #0A1B40);
          padding: 1.45rem 1rem 1.05rem;
          border-radius: 22px;
          margin: 1.8rem 0 1.3rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), inset 0 0 30px rgba(91, 191, 255, 0.15);
          border: 2.5px solid rgba(91, 191, 255, 0.35);
          z-index: 10;
          overflow: visible;
        }

        .f4-action-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #FF1E56 0%, #FF5A00 45%, #FFA700 85%, #FBBF24 100%);
          color: #ffffff;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 900;
          padding: 5px 24px;
          border-radius: 9999px;
          letter-spacing: 0.08em;
          box-shadow: 0 4px 16px rgba(255, 30, 86, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
          z-index: 30;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }

        .badge-bolt {
          font-size: 14px;
          filter: drop-shadow(0 0 4px rgba(255, 235, 59, 0.9));
        }

        .ab-btn {
          flex: 1;
          min-width: 80px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-weight: 900;
          font-size: 12px;
          padding: 10px 6px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }

        .ab-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 22px rgba(91, 191, 255, 0.35);
          border-color: rgba(245, 197, 24, 0.7);
        }

        .ab-ico {
          font-size: 26px;
          line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
        }

        .ab-lbl {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .ab-btn.tienda { background: linear-gradient(135deg, #16876A, #24C496); }
        .ab-btn.espacial { background: linear-gradient(135deg, #6C28B4, #9B5CFF); }
        .ab-btn.diario { background: linear-gradient(135deg, #0E6BA8, #3AA0FF); }
        .ab-btn.examen { background: linear-gradient(135deg, #A30041, #FF1D4E); }
        .ab-btn.intro { background: linear-gradient(135deg, #FF8C2A, #F5C518); color: #3A1A00; }
        .ab-btn.album { background: linear-gradient(135deg, #9B0066, #FF1DAA); }
        .ab-btn.juegos { background: linear-gradient(135deg, #FF1D4E, #FF8C2A); }

        /* ══ 3. TRAVESÍA MERCURIO → PLUTÓN ══ */
        .f4-journey-wrap {
          position: relative;
          background: linear-gradient(180deg, #020611 0%, #0A1840 50%, #1A0D40 100%);
          border-radius: 20px;
          padding: 1.1rem 1.3rem;
          margin: 1.1rem 0;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          min-height: 175px;
          border: 1.5px solid rgba(255, 214, 107, 0.25);
        }

        .fj-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.2rem;
        }

        .fj-title {
          color: #FFD66B;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-shadow: 0 0 18px rgba(255, 214, 107, 0.5);
        }

        .fj-progress {
          color: #fff;
          font-size: 12px;
          font-weight: 900;
          background: rgba(255, 255, 255, 0.12);
          padding: 4px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 214, 107, 0.4);
        }

        .fj-track {
          position: relative;
          z-index: 2;
          height: 85px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 6px;
        }

        .fj-mercury-wrap {
          position: relative;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fj-start-here {
          position: absolute;
          top: -46px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          animation: fjStartBounce 1s ease-in-out infinite;
          z-index: 10;
        }

        .fj-start-pill {
          background: linear-gradient(135deg, #FF1D4E, #F5C518);
          color: #fff;
          font-weight: 900;
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 14px;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 14px rgba(255, 29, 78, 0.6);
          white-space: nowrap;
          border: 1.5px solid #fff;
        }

        .fj-start-arrow {
          color: #F5C518;
          font-size: 17px;
          line-height: 1;
          margin-bottom: -3px;
          text-shadow: 0 0 10px rgba(245, 197, 24, 0.9);
        }

        @keyframes fjStartBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }

        .fj-planet-mercury {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #C9A674, #7E5A30, #3A2410);
          box-shadow: 0 0 25px rgba(201, 166, 116, 0.6), inset -8px -8px 20px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: fjPlanetBob 3s ease-in-out infinite;
        }

        .fj-planet-crater {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, #E0A030, #C27010);
          box-shadow: 0 0 8px rgba(245, 165, 36, 0.8);
        }

        @keyframes fjPlanetBob {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-4px) rotate(6deg); }
        }

        .fj-planet-label {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          color: #FFD66B;
          font-size: 10px;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
        }

        .fj-ship-holder {
          flex-shrink: 0;
          margin-left: 2px;
          font-size: 24px;
          filter: drop-shadow(0 0 8px rgba(91, 191, 255, 0.8));
          animation: fjShipBob 1.4s ease-in-out infinite;
        }

        @keyframes fjShipBob {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }

        .fj-asteroid-row {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 30px;
          margin: 0 6px;
        }

        .fj-asteroid-row::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: repeating-linear-gradient(90deg, rgba(255, 214, 107, 0.4) 0 8px, transparent 8px 14px);
          transform: translateY(-50%);
        }

        .fj-ast {
          position: relative;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #A89684, #605040, #2A1F12);
          box-shadow: 0 0 6px rgba(168, 150, 132, 0.5);
          z-index: 2;
          transition: all 0.4s;
          flex-shrink: 0;
        }

        .fj-ast.done {
          background: radial-gradient(circle at 30% 30%, #FFEE99, #F5C518);
          box-shadow: 0 0 14px rgba(245, 197, 24, 0.9);
          transform: scale(1.25);
        }

        .fj-ast.current {
          background: radial-gradient(circle at 30% 30%, #FF89A8, #FF1D4E);
          box-shadow: 0 0 20px rgba(255, 29, 78, 0.9);
          transform: scale(1.4);
        }

        .fj-legend {
          position: relative;
          z-index: 2;
          margin-top: 0.6rem;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          font-size: 10px;
          color: #C5BFEE;
          font-weight: 800;
        }

        .fj-legend span {
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 10px;
          border: 1px solid rgba(255, 214, 107, 0.3);
        }

        .fj-celebrate-msg {
          position: relative;
          z-index: 5;
          text-align: center;
          color: #FFD66B;
          font-weight: 900;
          font-size: 13px;
          margin-top: 0.5rem;
          text-shadow: 0 0 12px rgba(255, 214, 107, 0.5);
        }

        /* Section Titles */
        .f5sec {
          font-family: 'Baloo 2', sans-serif;
          font-size: 19px;
          font-weight: 900;
          color: #3d1468;
          margin: 1.3rem 0.2rem 0.55rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .f5sec small {
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #7a7299;
        }

        /* Hoy en Fedor */
        .f5hoy {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .f5tile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 18px;
          border: none;
          cursor: pointer;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          text-align: left;
          box-shadow: 0 8px 20px rgba(40, 10, 90, 0.18);
          transition: transform 0.15s ease;
        }

        .f5tile:hover {
          transform: translateY(-3px);
        }

        .f5tile .i {
          font-size: 30px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
        }

        .f5tile b {
          display: block;
          font-family: 'Baloo 2', sans-serif;
          font-size: 15px;
          line-height: 1.1;
        }

        .f5tile small {
          font-size: 11px;
          font-weight: 800;
          opacity: 0.9;
        }

        /* Panel de comando */
        .f5cmd {
          background: linear-gradient(160deg, #2a0f60, #3d1468 60%, #5c21a6);
          border-radius: 22px;
          padding: 16px 18px 20px;
          box-shadow: 0 14px 34px rgba(40, 10, 90, 0.35);
        }

        .f5cmd h4 {
          color: #ffe066;
          font-family: 'Baloo 2', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          margin: 14px 4px 8px;
          text-transform: uppercase;
        }

        .f5cmd h4:first-child {
          margin-top: 0;
        }

        .f5grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .f5btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 94px;
          min-height: 84px;
          padding: 8px 4px;
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 11.5px;
          line-height: 1.15;
          text-align: center;
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }

        .f5btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
          filter: brightness(1.1);
        }

        .f5btn span:first-child {
          font-size: 28px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        /* Barra de Problemas Cotidianos SABER */
        .sb5-bar {
          margin-top: 1.2rem;
          background: linear-gradient(135deg, #fef0e6, #fff4ed);
          border: 2px solid #fbbf7a;
          border-radius: 20px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(232, 101, 10, 0.14);
          transition: transform 0.15s ease;
        }

        .sb5-bar:hover {
          transform: translateY(-2px);
          border-color: #f97316;
        }

        .sb5-bar .i {
          font-size: 36px;
        }

        .sb5-bar b {
          display: block;
          font-family: 'Baloo 2', sans-serif;
          font-size: 17px;
          color: #9a3412;
          line-height: 1.15;
        }

        .sb5-bar small {
          font-size: 12px;
          color: #7a3200;
          font-weight: 700;
        }

        .sb5-go {
          background: linear-gradient(135deg, #e8650a, #f97316);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 8px 16px;
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(232, 101, 10, 0.35);
        }

        /* Mis mundos de aprendizaje */
        .f5mundos {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          align-items: start;
        }

        @media (min-width: 720px) {
          .f5mundos {
            grid-template-columns: 1fr 1fr;
          }
        }

        .f5m {
          position: relative;
          background: #ffffff;
          border-radius: 22px;
          overflow: visible;
          box-shadow: 0 10px 26px rgba(40, 10, 90, 0.14);
          border: 2.5px solid transparent;
          transition: transform 0.15s ease;
        }

        .f5m:hover {
          transform: translateY(-3px);
        }

        .f5m.now {
          border-color: #ffb020;
          animation: f5pulse 2.4s infinite;
        }

        .f5m-top {
          position: relative;
          border-radius: 20px 20px 0 0;
          padding: 14px 14px 14px 104px;
          min-height: 92px;
          color: #fff;
          overflow: hidden;
        }

        .f5m-orb {
          position: absolute;
          left: 14px;
          top: 12px;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          z-index: 2;
        }

        .f5m-num {
          position: absolute;
          left: 66px;
          top: 6px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffe066, #ff8c2a);
          border: 3px solid #fff;
          color: #3d1468;
          font-family: 'Baloo 2', sans-serif;
          font-weight: 900;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .f5m-kick {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          opacity: 0.9;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        .f5m-title {
          font-family: 'Baloo 2', sans-serif;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.1;
          margin: 2px 0 6px;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          padding-right: 58px;
        }

        .f5m-stars {
          font-size: 13px;
          letter-spacing: 1px;
          position: relative;
          z-index: 2;
        }

        .f5m-pct {
          position: absolute;
          right: 12px;
          top: 12px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 14px;
          padding: 4px 10px;
          font-family: 'Baloo 2', sans-serif;
          font-weight: 900;
          font-size: 16px;
          z-index: 2;
        }

        .f5m-now {
          position: absolute;
          right: 12px;
          bottom: 10px;
          background: #ffe066;
          color: #3d1468;
          border-radius: 12px;
          padding: 3px 10px;
          font-weight: 900;
          font-size: 11px;
          z-index: 2;
        }

        .f5m-body {
          padding: 12px 14px 14px;
        }

        .f5m-temas {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin: 2px 0 10px;
        }

        .f5m-temas span {
          background: #f3ecff;
          color: #3d1468;
          border-radius: 10px;
          padding: 3px 9px;
          font-size: 11px;
          font-weight: 800;
        }

        .f5m-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          border-radius: 14px;
          border: 2px solid #eee8fb;
          background: #fbf9ff;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          text-align: left;
          transition: all 0.15s ease;
        }

        .f5m-row:hover {
          border-color: #8b3edb;
          background: #f3ecff;
          transform: translateX(3px);
        }

        .f5m-row .ic {
          font-size: 22px;
          width: 30px;
          text-align: center;
        }

        .f5m-row .tx {
          flex: 1;
          min-width: 0;
        }

        .f5m-row .tx b {
          display: block;
          font-size: 13px;
          color: #1a1033;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .f5m-row .tx small {
          font-size: 11px;
          color: #6b5e8a;
          font-weight: 700;
        }

        .f5m-mini {
          display: block;
          height: 7px;
          background: #e8dbff;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
        }

        .f5m-mini > i {
          display: block;
          height: 100%;
          border-radius: 4px;
        }

        .f5m-go {
          font-family: 'Baloo 2', sans-serif;
          font-weight: 900;
          font-size: 13px;
          color: #fff;
          background: linear-gradient(135deg, #5c21a6, #8b3edb);
          border-radius: 12px;
          padding: 6px 12px;
          white-space: nowrap;
        }

        /* Zona de profes y familias */
        .f5adult {
          margin-top: 1.4rem;
          background: #f7f4ff;
          border: 2px dashed #c5bfee;
          border-radius: 18px;
          padding: 12px 16px;
        }

        .f5adult > summary {
          cursor: pointer;
          font-family: 'Baloo 2', sans-serif;
          font-size: 16px;
          font-weight: 900;
          color: #3d1468;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .f5adult > summary::-webkit-details-marker {
          display: none;
        }

        @keyframes f5pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 224, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(255, 224, 102, 0);
          }
        }

        @media (max-width: 600px) {
          .f5hoy {
            grid-template-columns: 1fr;
          }
          .f5m-title {
            font-size: 18px;
          }
          .f5go {
            font-size: 17px;
          }
        }
      `}</style>
    </div>
  );
}
