'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useBook } from '../context/BookContext';
import { unitProgressPct } from '../shared/progress.utils';
import type { GalaxyPlanet } from '../shared/GalaxyScene';

// La escena three.js solo se carga en cliente (evita SSR de WebGL).
const GalaxyScene = dynamic(() => import('../shared/GalaxyScene'), {
  ssr: false,
  loading: () => <div className="galaxy-loading">Cargando galaxia… 🌌</div>,
});

const PALETTE = ['#7B2FBE', '#16876A', '#9B5CFF', '#E8650A', '#FF8C2A', '#3D9BE8', '#0E6BA8', '#D4286A'];

/** Pantalla del mapa galaxia 3D: un planeta por unidad. */
export default function GalaxyMapScreen() {
  const { book, progress, openUnit, goScreen } = useBook();

  const planets = useMemo<GalaxyPlanet[]>(() => {
    if (!book || !progress) return [];
    return book.units.map((u) => ({
      index: u.index,
      label: u.short,
      icon: u.icon,
      pct: unitProgressPct(u, progress.scores),
      color: PALETTE[u.index % PALETTE.length],
    }));
  }, [book, progress]);

  if (!book || !progress) return null;

  return (
    <div className="screen active galaxy-screen" id="screen-galaxy">
      <div className="galaxy-topbar">
        <div>
          <div className="galaxy-kicker">🌌 Universo Fedor</div>
          <div className="galaxy-title">Galaxia del Saber</div>
        </div>
        <button className="galaxy-back-btn" onClick={() => goScreen('home')}>⬅ Volver al menú</button>
      </div>

      <div className="galaxy-canvas-wrap">
        <GalaxyScene planets={planets} onSelect={(i) => openUnit(i)} />
      </div>

      <div className="galaxy-hint">👆 Toca un planeta para viajar · arrastra para girar · pellizca para acercar</div>
    </div>
  );
}
