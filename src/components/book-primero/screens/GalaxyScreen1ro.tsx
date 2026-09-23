'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import Starfield from '@/components/book/shared/Starfield';

interface PlanetDef {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  color: string;
  glow: string;
  unitIndex: number;
  desc: string;
}

const GALAXY_PLANETS: PlanetDef[] = [
  {
    id: 'tierra',
    name: '🌍 La Tierra',
    icon: '🌍',
    subtitle: 'Base de lanzamiento — Adición',
    color: '#1A6CB4',
    glow: '#4DA6FF',
    unitIndex: 0,
    desc: '¡Aquí empieza todo! Domina la adición y el conteo para despegar.',
  },
  {
    id: 'luna',
    name: '🌙 La Luna',
    icon: '🌙',
    subtitle: 'Primera parada • ¡Casi en el espacio!',
    color: '#666666',
    glow: '#CCCCCC',
    unitIndex: -1,
    desc: 'La Luna te da la bienvenida. ¡Sigue avanzando hacia las estrellas!',
  },
  {
    id: 'marte',
    name: '🔴 Marte',
    icon: '🔴',
    subtitle: 'Planeta Rojo — Sustracción',
    color: '#C94B22',
    glow: '#FF6B3B',
    unitIndex: 1,
    desc: 'El planeta rojo. La Tienda de Math abre aquí. ¡Aprende a restar!',
  },
  {
    id: 'saturno',
    name: '🪐 Saturno',
    icon: '🪐',
    subtitle: 'Planeta de los Anillos — Multiplicación',
    color: '#B8860B',
    glow: '#F5C518',
    unitIndex: 2,
    desc: 'Los anillos de Saturno son tu tabla mágica. ¡Multiplica para avanzar!',
  },
  {
    id: 'neptuno',
    name: '🔵 Neptuno',
    icon: '🔵',
    subtitle: 'Planeta Azul — División',
    color: '#1A4CB4',
    glow: '#4D8AFF',
    unitIndex: 3,
    desc: 'Aguas profundas. Divide las chocolatinas entre los astronautas.',
  },
  {
    id: 'sol',
    name: '☀️ El Sol',
    icon: '☀️',
    subtitle: 'La Estrella Máxima — Geometría',
    color: '#E8650A',
    glow: '#FFD700',
    unitIndex: 4,
    desc: '¡El destino final! Perímetros, áreas y formas geométricas del cosmos.',
  },
];

export default function GalaxyScreen1ro() {
  const { book, scores, totalXP, goScreen, selectUnit } = useBook1();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetDef>(GALAXY_PLANETS[0]);

  const units = book?.units || [];

  const getPlanetPct = (unitIdx: number) => {
    if (unitIdx < 0) return 100;
    const unit = units[unitIdx];
    if (!unit || !unit.topics) return 0;
    let done = 0;
    let total = 0;
    unit.topics.forEach((t, ti) => {
      (t.levels || []).forEach((_, li) => {
        total += 1;
        const k1 = `u${unit.index}t${ti}-n${li + 1}`;
        const k2 = t.id ? `${t.id}-n${li + 1}` : k1;
        if (typeof scores[k1] === 'number' || typeof scores[k2] === 'number') {
          done += 1;
        }
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  const isUnlocked = (idx: number): boolean => {
    const p = GALAXY_PLANETS[idx];
    if (!p) return false;
    if (p.unitIndex < 0) return true;
    if (idx === 0) return true;
    const prev = GALAXY_PLANETS[idx - 1];
    if (!prev) return true;
    if (prev.unitIndex < 0) return isUnlocked(idx - 1);
    return getPlanetPct(prev.unitIndex) >= 50;
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        background: 'linear-gradient(180deg,#020718 0%,#060F30 60%,#0B1540 100%)',
        borderRadius: '24px',
        padding: '1.2rem 1.4rem 2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.6)',
      }}
    >
      <Starfield count={60} />

      {/* Top HUD */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,.15)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => goScreen('home')}
            style={{
              background: 'rgba(255,255,255,.12)',
              border: '1.5px solid rgba(255,255,255,.25)',
              color: '#fff',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Volver
          </button>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(245,197,24,.85)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
              🌌 UNIVERSO FEDOR
            </div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '20px', fontWeight: 900, color: '#fff' }}>
              Galaxia del Saber · 1° Grado
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,.1)', borderRadius: '12px', padding: '6px 14px', border: '1px solid rgba(255,255,255,.15)' }}>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#F5C518' }}>{totalXP}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>XP TOTAL</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Planet cards */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '2rem',
        }}
      >
        {GALAXY_PLANETS.map((planet, idx) => {
          const pct = getPlanetPct(planet.unitIndex);
          const unlocked = isUnlocked(idx);
          const isSelected = selectedPlanet.id === planet.id;

          return (
            <div
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(123,47,190,.3), rgba(26,108,180,.3))'
                  : 'rgba(255,255,255,.05)',
                border: isSelected
                  ? '2px solid #F5C518'
                  : '1.5px solid rgba(255,255,255,.12)',
                borderRadius: '18px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '38px', filter: unlocked ? `drop-shadow(0 0 10px ${planet.glow})` : 'grayscale(0.8)' }}>
                  {planet.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {!unlocked ? (
                    <span style={{ background: 'rgba(0,0,0,.6)', color: '#FFB066', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '12px' }}>
                      🔒 Bloqueado
                    </span>
                  ) : (
                    <span style={{ background: pct >= 100 ? '#24C496' : 'rgba(245,197,24,.2)', color: pct >= 100 ? '#fff' : '#F5C518', fontSize: '12px', fontWeight: 900, padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(245,197,24,.4)' }}>
                      {pct}% listo
                    </span>
                  )}
                </div>
              </div>

              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '17px', fontWeight: 900, color: '#FFD66B' }}>
                {planet.name}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,.8)', margin: '2px 0 6px' }}>
                {planet.subtitle}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', lineHeight: 1.4 }}>
                {planet.desc}
              </div>

              {unlocked && planet.unitIndex >= 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectUnit(planet.unitIndex);
                  }}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    background: 'linear-gradient(135deg,#FF1D4E,#F5C518)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255,29,78,.4)',
                  }}
                >
                  🚀 Viajar a Unidad {planet.unitIndex + 1}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
