'use client';

import React, { useState, useMemo } from 'react';
import { useBook5 } from '../context/Book5Context';
import bookCurriculum5 from '@/mocks/data/book-curriculum-5.data.json';
import Starfield from '@/components/book/shared/Starfield';
import UniversoFedorModal5to from '../shared/UniversoFedorModal5to';
import CommandPanelModals5to from '../shared/CommandPanelModals5to';
import Swal from 'sweetalert2';

interface HomeScreen5toProps {
  onOpenIntro?: () => void;
}

interface CelestialBodyInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
}

const BODIES_DICT: Record<string, CelestialBodyInfo> = {
  tierra: { id: 'tierra', name: '🌍 La Tierra', icon: '🌍', color: '#1A6CB4', glow: '#4DA6FF' },
  mercurio: { id: 'mercurio', name: '☿ Mercurio', icon: '🟤', color: '#9B7A4F', glow: '#E0B07A' },
  venus: { id: 'venus', name: '♀ Venus', icon: '🟡', color: '#D4AC2A', glow: '#FFD96A' },
  marte: { id: 'marte', name: '🔴 Marte', icon: '🔴', color: '#C94B22', glow: '#FF6B3B' },
  sirio: { id: 'sirio', name: '⭐ Sirio', icon: '⭐', color: '#FFD700', glow: '#FFF4A8' },
  asteroides1: { id: 'asteroides1', name: '🪨 Ceres', icon: '🪨', color: '#A0A0A0', glow: '#D5D5D5' },
  asteroides3: { id: 'asteroides3', name: '🪨 Pallas', icon: '🪨', color: '#A0A0A0', glow: '#D5D5D5' },
  jupiter: { id: 'jupiter', name: '🟠 Júpiter', icon: '🟠', color: '#D8853A', glow: '#FFB870' },
  saturno: { id: 'saturno', name: '🪐 Saturno', icon: '🪐', color: '#B8860B', glow: '#F5C518' },
  halley: { id: 'halley', name: '☄️ Cometa Halley', icon: '☄️', color: '#A8E8FF', glow: '#E0F4FF' },
  neptuno: { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', color: '#1A4CB4', glow: '#4D8AFF' },
  urano: { id: 'urano', name: '🔷 Urano', icon: '🔷', color: '#5FBEC8', glow: '#A8E8F0' },
  pluton: { id: 'pluton', name: '🟣 Plutón', icon: '🟣', color: '#8B5A2B', glow: '#C89060' },
  nebulosa: { id: 'nebulosa', name: '🌌 Nebulosa de Orión', icon: '🌌', color: '#9B5CFF', glow: '#D4A8FF' },
  sol: { id: 'sol', name: '☀️ El Sol', icon: '☀️', color: '#E8650A', glow: '#FFD700' },
};

const RUTA_5TO = [
  'tierra', 'mercurio', 'venus', 'marte', 'sirio',
  'asteroides1', 'asteroides3', 'jupiter', 'saturno', 'halley',
  'neptuno', 'urano', 'pluton', 'nebulosa', 'sol'
];

function shadeColor(hex: string, amt: number) {
  if (!hex || hex[0] !== '#') return hex;
  let r = parseInt(hex.slice(1, 3), 16) || 0;
  let g = parseInt(hex.slice(3, 5), 16) || 0;
  let b = parseInt(hex.slice(5, 7), 16) || 0;
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export default function HomeScreen5to({ onOpenIntro }: HomeScreen5toProps) {
  const {
    student,
    coins,
    streak,
    totalXP,
    scores,
    selectUnit,
    goScreen,
    updateStats,
  } = useBook5();

  const [showUniverseModal, setShowUniverseModal] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  const units = (bookCurriculum5.UNITS || []) as any[];

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

  // Group the 20 sub-units into 15 cosmic missions (the exact HTML grupos() algorithm)
  const missions = useMemo(() => {
    const g: Array<{
      n: number;
      uis: number[];
      titulos: string[];
      intros: string[];
      base?: string;
      titulo: string;
      icon: string;
      body: CelestialBodyInfo;
      num: number;
    }> = [];
    const idxMap: Record<number, number> = {};

    units.forEach((u, ui) => {
      const m = String(u.name || '').match(/Unidad\s+(\d+)/i);
      const n = m ? +m[1] : ui + 1;
      if (idxMap[n] === undefined) {
        idxMap[n] = g.length;
        g.push({ n, uis: [], titulos: [], intros: [], titulo: '', icon: '📘', body: BODIES_DICT.tierra, num: n });
      }
      const G = g[idxMap[n]];
      G.uis.push(ui);
      const parte = String(u.name || '').split('—').pop()?.trim() || '';
      const tit = parte.split('·')[0].trim();
      const sub = parte.indexOf('·') >= 0 ? parte.split('·').pop()?.trim() || parte : parte;
      G.base = G.base || tit;
      G.titulos.push(sub);
      if (u.intro) G.intros.push(u.intro);
    });

    g.sort((a, b) => a.n - b.n);

    g.forEach((G, i) => {
      G.titulo = G.uis.length > 2 ? (G.base || '') : G.titulos.join(' y ');
      G.icon = units[G.uis[0]]?.icon || '📘';
      const bodyId = RUTA_5TO[i] || 'tierra';
      G.body = BODIES_DICT[bodyId] || BODIES_DICT.tierra;
      G.num = i + 1;
    });

    return g;
  }, [units]);

  const getMissionPct = (m: (typeof missions)[0]) => {
    let s = 0;
    m.uis.forEach((ui) => {
      s += getUnitPct(ui);
    });
    return m.uis.length ? Math.round(s / m.uis.length) : 0;
  };

  const getMissionStars = (pct: number) => {
    return pct >= 95 ? 5 : pct >= 80 ? 4 : pct >= 65 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
  };

  // Find active mission (first incomplete mission)
  const activeMission = useMemo(() => {
    return missions.find((m) => getMissionPct(m) < 100) || missions[0];
  }, [missions, scores]);

  // Global progress calculation
  const totalBookPct = Math.round(
    units.reduce((acc: number, _: any, idx: number) => acc + getUnitPct(idx), 0) / (units.length || 1)
  );

  // Ranks
  const ranks = [
    { min: 0, label: '🌱 Explorador' },
    { min: 250, label: '🚀 Aprendiz' },
    { min: 600, label: '⭐ Aventurero' },
    { min: 1200, label: '🪐 Experto' },
    { min: 2500, label: '👑 Maestro' },
    { min: 5000, label: '🌌 Leyenda' },
  ];
  const currentRank = [...ranks].reverse().find((r) => totalXP >= r.min) || ranks[0];
  const nextRank = ranks[ranks.indexOf(currentRank) + 1] || null;
  const rankPct = nextRank
    ? Math.min(100, Math.round(((totalXP - currentRank.min) / (nextRank.min - currentRank.min)) * 100))
    : 100;

  const handleClaimDailyReward = () => {
    updateStats(25, 1, 30);
    Swal.fire({
      title: '🎁 ¡Recompensa Reclamada!',
      text: '¡Ganaste +25 monedas cósmicas y +30 XP por tu constancia!',
      icon: 'success',
      confirmButtonColor: '#E8650A',
    });
  };

  const handleOpenTool = (tool: string) => {
    if (tool === 'galaxy' || tool === 'universo') {
      setShowUniverseModal(true);
    } else if (tool === 'problemas' || tool === 'saber-cotidianos') {
      goScreen('problemas');
    } else if (tool === 'report') {
      goScreen('report');
    } else if (tool === 'estandares') {
      goScreen('estandares');
    } else {
      setActiveToolModal(tool);
    }
  };

  return (
    <div className="home-screen-5to" id="screen-home">
      {/* ═════════════════════════════════════════════════════════════
          1. HERO BANNER & AVATAR (f5HeroX)
      ═════════════════════════════════════════════════════════════ */}
      <div className="hero-banner">
        <Starfield count={50} />
        <div className="hero-planet" />
        <div className="hero-ring" />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.65rem', position: 'relative', zIndex: 1 }}>
          <div
            id="heroAvatarCircle"
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              boxShadow: '0 0 0 4px rgba(245,197,24,.6),0 8px 32px rgba(0,0,0,.5)',
              animation: 'float 3s ease-in-out infinite',
              background: 'radial-gradient(circle at 35% 35%,#3D1468,#6C28B4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              cursor: 'pointer',
            }}
            onClick={onOpenIntro}
            title="Toca para ver la bienvenida"
          >
            <span>{student?.avatar || '🧑‍🚀'}</span>
          </div>
        </div>

        <div className="hero-tag">🌟 MATEMÁTICAS DE FEDOR · 5° GRADO</div>
        <div className="hero-title">
          ¡Hola, <em>{student?.name || 'Cadete'}</em>!
        </div>
        <div className="hero-sub">
          {student?.school ? `${student.school} · ` : ''}{student?.city ? `${student.city} · ` : ''}15 Misiones Cósmicas
        </div>

        {/* f5HeroX Box */}
        <div className="f5hero-x" id="f5HeroX">
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
            <span className="f5chip">🔥 Racha {streak}</span>
          </div>

          {activeMission && (
            <button
              className="f5go"
              onClick={() => {
                const targetUi = activeMission.uis.find((ui) => getUnitPct(ui) < 100) ?? activeMission.uis[0];
                selectUnit(targetUi);
              }}
            >
              <span style={{ fontSize: 28 }}>🚀</span>
              <span>
                {totalBookPct > 0 ? '¡Continuar mi misión!' : '¡Empezar la aventura!'}
                <small>
                  Misión {activeMission.num} · {activeMission.titulo}
                </small>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          2. UNIVERSO FEDOR (Galaxia del Saber)
      ═════════════════════════════════════════════════════════════ */}
      <div
        id="galaxyMapWrap"
        className="galaxy-card-wrap"
        onClick={() => setShowUniverseModal(true)}
      >
        <Starfield count={25} />
        <div className="galaxy-card-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="galaxy-orb-icon">🌌</div>
            <div>
              <div className="galaxy-badge">🌌 UNIVERSO FEDOR</div>
              <div className="galaxy-title">Galaxia del Saber</div>
              <div className="galaxy-hint">
                🚀 <b style={{ color: '#FFE066' }}>Abrir el Universo Fedor</b> · 15 misiones interplanetarias
              </div>
            </div>
          </div>
          <div className="galaxy-arrow">Explorar ➔</div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          3. 🌟 HOY EN FEDOR
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec">
        🌟 Hoy en Fedor <small>¡entra cada día para ganar más!</small>
      </div>
      <div className="f5hoy" id="f5Hoy">
        {/* Recompensa Diaria */}
        <button
          className="f5tile"
          style={{ background: 'linear-gradient(135deg,#D97706,#B45309)' }}
          onClick={handleClaimDailyReward}
        >
          <span className="i">🎁</span>
          <span>
            <b>Recompensa Diaria</b>
            <small>+25 monedas y +30 XP</small>
          </span>
        </button>

        {/* Desafío del Día */}
        <button
          className="f5tile"
          style={{ background: 'linear-gradient(135deg,#16876A,#0F766E)' }}
          onClick={() => handleOpenTool('desafio')}
        >
          <span className="i">⚡</span>
          <span>
            <b>Desafío del Día</b>
            <small>Cálculo mental veloz</small>
          </span>
        </button>

        {/* Misiones de Hoy */}
        <button
          className="f5tile"
          style={{ background: 'linear-gradient(135deg,#0E6BA8,#5B21B6)' }}
          onClick={() => handleOpenTool('misiones')}
        >
          <span className="i">🎯</span>
          <span>
            <b>Misiones de Hoy</b>
            <small>3 retos nuevos cada día</small>
          </span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          4. 🕹️ PANEL DE COMANDO TODAS TUS HERRAMIENTAS
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec">
        🕹️ Panel de comando <small>todas tus herramientas de aprendizaje</small>
      </div>
      <div className="f5cmd" id="f5Cmd">
        {/* 📚 Para aprender */}
        <h4>📚 Para aprender</h4>
        <div className="f5grid">
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('laboratorio')}
            title="Laboratorio visual interactivo"
          >
            <span>🧠</span>
            <span>Laboratorio</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('conteo')}
            title="Tablas de conteo de frecuencia"
          >
            <span>🔢</span>
            <span>Conteo</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('multiplicar')}
            title="Tablas de multiplicar dinámicas"
          >
            <span>✖️</span>
            <span>Multiplicar</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('lab-est')}
            title="Laboratorio de estadística interactivo"
          >
            <span>🔬</span>
            <span>Lab. Est.</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('explicar')}
            title="Explicaciones paso a paso ilustradas"
          >
            <span>💡</span>
            <span>Explicar</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('videos')}
            title="Videos conceptuales animados"
          >
            <span>🎬</span>
            <span>Videos</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#5C21A6,#8B3EDB)' }}
            onClick={() => handleOpenTool('concepto')}
            title="Concepto clave del día"
          >
            <span>📘</span>
            <span>Concepto</span>
          </button>
        </div>

        {/* 🎮 Para jugar y ganar */}
        <h4>🎮 Para jugar y ganar</h4>
        <div className="f5grid">
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#E8650A,#F5A524)' }}
            onClick={() => handleOpenTool('minijuegos')}
            title="Minijuegos matemáticos de 5°"
          >
            <span>🎮</span>
            <span>Minijuegos</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#E8650A,#F5A524)' }}
            onClick={() => handleOpenTool('desafio')}
            title="Desafío del día contrarreloj"
          >
            <span>🎯</span>
            <span>Desafío</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#E8650A,#F5A524)' }}
            onClick={() => handleOpenTool('logros')}
            title="Trofeos y logros desbloqueados"
          >
            <span>🏆</span>
            <span>Logros</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#E8650A,#F5A524)' }}
            onClick={() => handleOpenTool('universo')}
            title="Explorador cósmico del Universo Fedor"
          >
            <span>🌌</span>
            <span>Universo</span>
          </button>
        </div>

        {/* 📝 Para ponerme a prueba */}
        <h4>📝 Para ponerme a prueba</h4>
        <div className="f5grid">
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#0E6BA8,#38BDF8)' }}
            onClick={() => handleOpenTool('saber-cotidianos')}
            title="Problemas cotidianos SABER 5°"
          >
            <span>🛒</span>
            <span>SABER cot</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#0E6BA8,#38BDF8)' }}
            onClick={() => handleOpenTool('repaso')}
            title="Mi Repaso personalizado"
          >
            <span>🔁</span>
            <span>Mi Repaso</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#0E6BA8,#38BDF8)' }}
            onClick={() => handleOpenTool('examen-final')}
            title="Examen final de 5° grado"
          >
            <span>🎓</span>
            <span>Examen final</span>
          </button>
        </div>

        {/* 👩‍🏫 Profes y familia */}
        <h4>👩‍🏫 Profes y familia</h4>
        <div className="f5grid">
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#16876A,#24C496)' }}
            onClick={() => handleOpenTool('curriculo')}
            title="Estándares MEN Colombia y DBA de 5°"
          >
            <span>📑</span>
            <span>Currículo</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#16876A,#24C496)' }}
            onClick={() => handleOpenTool('historia')}
            title="Historia y pedagogía del Método Fedor"
          >
            <span>📜</span>
            <span>Historia</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#16876A,#24C496)' }}
            onClick={() => handleOpenTool('guia-docente')}
            title="Guía docente y orientaciones pedagógicas"
          >
            <span>👩‍🏫</span>
            <span>Guía Doc.</span>
          </button>
          <button
            className="f5btn"
            style={{ background: 'linear-gradient(145deg,#16876A,#24C496)' }}
            onClick={() => handleOpenTool('report')}
            title="Informe de progreso detallado y diagnóstico IA"
          >
            <span>📊</span>
            <span>Informe</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          5. 🛒 PROBLEMAS COTIDIANOS — TIPO PRUEBA SABER (5°) (sb5Bar)
      ═════════════════════════════════════════════════════════════ */}
      <div
        id="sb5Bar"
        className="sb5-bar"
        onClick={() => goScreen('problemas')}
      >
        <span className="i">🛒</span>
        <span style={{ flex: 1 }}>
          <b>Problemas Cotidianos — Tipo Prueba SABER (5°)</b>
          <small>5 niveles · compras, tienda, dinero · 10 ejemplos y 20 ejercicios por nivel</small>
        </span>
        <span style={{ fontSize: 24, color: '#E8650A' }}>▶</span>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          6. 🪐 MIS MUNDOS DE APRENDIZAJE (15 Misiones de aprendizaje)
      ═════════════════════════════════════════════════════════════ */}
      <div className="f5sec" id="f5MunT">
        🪐 Mis mundos de aprendizaje <small>15 misiones · toca para entrar</small>
      </div>

      <div className="f5mundos" id="f5Mundos">
        {missions.map((m) => {
          const p = getMissionPct(m);
          const st = getMissionStars(p);
          const isNow = activeMission.num === m.num;
          const body = m.body;

          return (
            <div
              key={m.num}
              className={`f5m ${isNow ? 'now' : ''}`}
              id={`f5m${m.num}`}
            >
              {/* Top Banner */}
              <div
                className="f5m-top"
                style={{
                  background: `linear-gradient(135deg, ${shadeColor(body.color, -95)}, ${shadeColor(body.color, -35)} 65%, ${shadeColor(body.glow, -20)})`,
                }}
              >
                <div
                  className="f5m-orb"
                  style={{
                    backgroundColor: body.color,
                    boxShadow: `0 0 24px ${body.glow}, inset -6px -8px 18px rgba(0,0,0,.4), inset 5px 5px 12px rgba(255,255,255,.25)`,
                  }}
                >
                  {m.icon}
                </div>
                <div className="f5m-num">{p >= 100 ? '✓' : m.num}</div>
                <div className="f5m-kick">
                  Misión {m.num} · {body.name.replace(/^\S+\s/, '')}
                </div>
                <div className="f5m-title">{m.titulo}</div>
                <div className="f5m-stars">
                  {'⭐'.repeat(st)}
                  <span style={{ opacity: 0.35 }}>{'⭐'.repeat(5 - st)}</span>
                </div>
                <div className="f5m-pct">{p}%</div>
                {isNow && <div className="f5m-now">📍 ¡Estás aquí!</div>}
              </div>

              {/* Body with Subunits */}
              <div className="f5m-body">
                {m.uis.length === 1 && units[m.uis[0]]?.topics && (
                  <div className="f5m-temas">
                    {units[m.uis[0]].topics.slice(0, 5).map((t: any, ti: number) => (
                      <span key={ti}>
                        {t.icon || '•'} {t.title}
                      </span>
                    ))}
                  </div>
                )}

                {m.uis.map((ui) => {
                  const u = units[ui];
                  if (!u) return null;
                  const q = getUnitPct(ui);
                  const barColor =
                    q >= 70
                      ? 'linear-gradient(90deg,#16876A,#24C496)'
                      : q >= 40
                      ? 'linear-gradient(90deg,#E8650A,#F5C518)'
                      : 'linear-gradient(90deg,#8B3EDB,#C5BFEE)';

                  return (
                    <button
                      key={ui}
                      className="f5m-row"
                      onClick={() => selectUnit(ui)}
                    >
                      <span className="ic">{u.icon || '📘'}</span>
                      <span className="tx">
                        <b>
                          {m.uis.length === 1
                            ? `${u.topics?.length || 0} temas · 5 niveles cada uno`
                            : u.short || u.name}
                        </b>
                        <small>
                          {q >= 100
                            ? '¡Completado! ✅'
                            : q > 0
                            ? `Vas en ${q}%`
                            : '¡Nuevo! Empieza aquí'}
                        </small>
                        <span className="f5m-mini">
                          <i style={{ width: `${q}%`, background: barColor }} />
                        </span>
                      </span>
                      <span className="f5m-go">
                        {q >= 100 ? 'Repasar' : q > 0 ? 'Seguir ▶' : 'Entrar 🚀'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          7. 👨‍👩‍👧 ZONA DE PROFES Y FAMILIAS (f5adult)
      ═════════════════════════════════════════════════════════════ */}
      <details className="f5adult" id="f5Adult">
        <summary>
          👨‍👩‍👧 Zona de profes y familias{' '}
          <small style={{ fontFamily: 'Nunito, sans-serif', fontSize: 12, color: '#7A7299', fontWeight: 800 }}>
            informes, progreso detallado y guía
          </small>
        </summary>

        <div style={{ marginTop: '1rem' }}>
          {/* Fedor Brand */}
          <div className="fedor-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="fedor-brand-logo">
                <span style={{ fontSize: 20 }}>🧑‍🚀</span>
              </div>
              <div>
                <div className="fedor-brand-txt">Matemáticas de Fedor · 5° Grado</div>
                <div className="fedor-brand-sub">Método Fedor de Aprendizaje Espacial Acelerado</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#7A3200' }}>
              Estándares MEN Colombia
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="prog-global">
            <div className="pg-label">Progreso General del Libro de 5°</div>
            <div className="pg-bar">
              <div className="pg-fill" style={{ width: `${totalBookPct}%` }} />
            </div>
            <div className="pg-pct">{totalBookPct}%</div>
          </div>

          {/* Action Buttons for Adults */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: '1rem' }}>
            <button
              onClick={() => goScreen('report')}
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                border: '1.5px solid #6C28B4',
                background: '#F7F4FF',
                color: '#6C28B4',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📊 Ver Informe Pedagógico Completo
            </button>
            <button
              onClick={() => goScreen('estandares')}
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                border: '1.5px solid #16876A',
                background: '#DCF5EE',
                color: '#074F3A',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📑 Ver Currículo y Estándares MEN
            </button>
          </div>
        </div>
      </details>

      {/* ═════════════════════════════════════════════════════════════
          MODALS INTEGRATION
      ═════════════════════════════════════════════════════════════ */}
      <UniversoFedorModal5to
        isOpen={showUniverseModal}
        onClose={() => setShowUniverseModal(false)}
        onSelectUnit={(uIdx) => {
          setShowUniverseModal(false);
          selectUnit(uIdx);
        }}
      />

      <CommandPanelModals5to
        activeTool={activeToolModal}
        onClose={() => setActiveToolModal(null)}
        onOpenIntro={onOpenIntro}
      />

      {/* ═════════════════════════════════════════════════════════════
          EXACT STYLES FROM MatematicasDeFedor_5.html
      ═════════════════════════════════════════════════════════════ */}
      <style jsx>{`
        .home-screen-5to {
          max-width: 1008px;
          margin: 0 auto;
          padding: 0.5rem 0.5rem 3rem;
          font-family: 'Nunito', sans-serif;
        }

        /* HERO BANNER */
        .hero-banner {
          background: linear-gradient(160deg, #140830 0%, #2A0F6A 50%, #0A2820 100%);
          border-radius: 28px;
          padding: 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 1.25rem;
          box-shadow: 0 12px 48px rgba(108, 40, 180, 0.18);
        }
        .hero-planet {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle at 40% 35%, #E8650A, #7A2F00);
          border-radius: 50%;
          opacity: 0.25;
        }
        .hero-ring {
          position: absolute;
          top: 20px;
          right: -10px;
          width: 180px;
          height: 55px;
          border: 6px solid rgba(232, 101, 10, 0.2);
          border-radius: 50%;
          transform: rotate(-15deg);
        }
        .hero-tag {
          color: #FFE066;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }
        .hero-title {
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }
        .hero-title em {
          color: #FF8C2A;
          font-style: normal;
        }
        .hero-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          position: relative;
          z-index: 1;
        }

        /* f5HeroX */
        .f5hero-x {
          position: relative;
          z-index: 2;
          max-width: 520px;
          margin: 0.85rem auto 0;
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
          color: #FFE066;
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
          background: linear-gradient(90deg, #FFE066, #FF8C2A);
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
          font-family: 'Nunito', sans-serif;
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
          background: linear-gradient(135deg, #FFE066, #FF8C2A);
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          font-size: 19px;
          font-weight: 900;
          box-shadow: 0 8px 24px rgba(255, 140, 42, 0.45);
          transition: transform 0.2s;
        }
        .f5go:hover {
          transform: translateY(-2px);
        }
        .f5go small {
          display: block;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #5C2A00;
        }

        /* GALAXY CARD */
        .galaxy-card-wrap {
          background: linear-gradient(135deg, #140830 0%, #2A0F6A 60%, #16876A 100%);
          border: 1.5px solid rgba(245, 197, 24, 0.35);
          border-radius: 22px;
          padding: 16px 20px;
          margin-bottom: 1.25rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(108, 40, 180, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .galaxy-card-wrap:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(108, 40, 180, 0.3);
        }
        .galaxy-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .galaxy-orb-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #3D1468, #6C28B4);
          box-shadow: 0 0 16px rgba(155, 92, 229, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .galaxy-badge {
          font-size: 10px;
          font-weight: 900;
          color: rgba(245, 197, 24, 0.85);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .galaxy-title {
          font-family: 'Baloo 2', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          margin-top: 1px;
        }
        .galaxy-hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 700;
        }
        .galaxy-arrow {
          background: rgba(255, 255, 255, 0.15);
          color: #FFE066;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 900;
          backdrop-filter: blur(4px);
        }

        /* SECTION TITLES */
        .f5sec {
          font-family: 'Baloo 2', Nunito, sans-serif;
          font-size: 19px;
          font-weight: 900;
          color: #3D1468;
          margin: 1.1rem 0.2rem 0.55rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .f5sec small {
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: #7A7299;
        }

        /* HOY EN FEDOR */
        .f5hoy {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 1.25rem;
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
          transition: transform 0.15s;
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

        /* PANEL DE COMANDO */
        .f5cmd {
          background: linear-gradient(160deg, #2A0F60, #3D1468 60%, #5C21A6);
          border-radius: 22px;
          padding: 14px;
          box-shadow: 0 12px 30px rgba(40, 10, 90, 0.3);
          margin-bottom: 1.25rem;
        }
        .f5cmd h4 {
          color: #FFE066;
          font-family: 'Baloo 2', sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          margin: 10px 4px 8px;
          text-transform: uppercase;
        }
        .f5cmd h4:first-child {
          margin-top: 0;
        }
        .f5grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
          gap: 8px;
        }
        .f5btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-height: 84px;
          padding: 8px 6px;
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.18);
          cursor: pointer;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 12px;
          line-height: 1.15;
          text-align: center;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .f5btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
        }
        .f5btn span:first-child {
          font-size: 30px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        /* PROBLEMAS COTIDIANOS BAR (sb5Bar) */
        .sb5-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ffffff, #fff7e6);
          border: 2.5px solid #f5a524;
          border-radius: 20px;
          padding: 14px 16px;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(232, 101, 10, 0.15);
          margin: 14px 0 10px;
          transition: transform 0.15s;
        }
        .sb5-bar:hover {
          transform: translateY(-2px);
        }
        .sb5-bar .i {
          font-size: 40px;
        }
        .sb5-bar b {
          display: block;
          font-family: 'Baloo 2', sans-serif;
          font-size: 18px;
          color: #7a3200;
          line-height: 1.1;
        }
        .sb5-bar small {
          font-size: 12px;
          color: #7a7299;
          font-weight: 800;
        }

        /* MIS MUNDOS DE APRENDIZAJE */
        .f5mundos {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          align-items: start;
          margin-bottom: 1.5rem;
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
          transition: transform 0.15s;
        }
        .f5m:hover {
          transform: translateY(-3px);
        }
        .f5m.now {
          border-color: #ffb020;
          box-shadow: 0 0 0 3px rgba(255, 176, 32, 0.35), 0 10px 26px rgba(40, 10, 90, 0.14);
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
          font-size: 21px;
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
          font-size: 17px;
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
          margin-bottom: 6px;
          border-radius: 14px;
          border: 2px solid #eee8fb;
          background: #fbf9ff;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          text-align: left;
          transition: all 0.15s;
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
          font-size: 14px;
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
          height: 7px;
          background: #e8dbff;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
          display: block;
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

        /* PROFES Y FAMILIAS */
        .f5adult {
          margin-top: 1.2rem;
          background: #f7f4ff;
          border: 2px dashed #c5bfee;
          border-radius: 18px;
          padding: 14px 16px;
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

        /* FEDOR BRAND & PROG GLOBAL */
        .fedor-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fef0e6, #ffe2c8);
          border: 1.5px solid #fbbf7a;
          border-radius: 16px;
          padding: 10px 18px;
        }
        .fedor-brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #3d1468, #6c28b4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .fedor-brand-txt {
          font-family: 'Baloo 2', sans-serif;
          font-size: 15px;
          font-weight: 900;
          color: #b84d00;
        }
        .fedor-brand-sub {
          font-size: 11px;
          color: #7a7299;
          font-weight: 700;
        }

        .prog-global {
          background: #ffffff;
          border: 1.5px solid #ddd8f5;
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 2px 12px rgba(108, 40, 180, 0.08);
        }
        .pg-label {
          font-size: 13px;
          font-weight: 800;
          color: #180d38;
          flex: 1;
        }
        .pg-bar {
          flex: 2;
          height: 10px;
          background: #eee;
          border-radius: 5px;
          overflow: hidden;
        }
        .pg-fill {
          height: 10px;
          background: linear-gradient(90deg, #6c28b4, #9b5ce5);
          border-radius: 5px;
          transition: width 0.8s ease;
        }
        .pg-pct {
          font-size: 14px;
          font-weight: 900;
          color: #6c28b4;
          min-width: 38px;
          text-align: right;
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
