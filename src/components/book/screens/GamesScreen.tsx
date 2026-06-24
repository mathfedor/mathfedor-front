'use client';

import { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import DragDivisionGame from '../shared/DragDivisionGame';
import NumberMiniGame from '../games/NumberMiniGame';
import MultiplicationTables from '../games/MultiplicationTables';
import StatsLab from '../games/StatsLab';
import DecompositionTool from '../games/DecompositionTool';
import BadgeShelf from '../games/BadgeShelf';
import { genHearts, genClock, genStore } from '../games/gameRounds';

type GameId = 'tablas' | 'hearts' | 'clock' | 'store' | 'division' | 'stats' | 'decomp' | 'badges' | null;

interface GameCard {
  id: Exclude<GameId, null>;
  emoji: string;
  title: string;
  desc: string;
  reward?: string;
  color: string;
}

const CARDS: GameCard[] = [
  { id: 'tablas', emoji: '🎯', title: 'Tablas Mágicas', desc: 'Tablas de multiplicar: práctica y reto rápido', reward: '+5 🪙', color: '#7B2FBE' },
  { id: 'hearts', emoji: '❤️', title: 'Reparte los Corazones', desc: 'Divide en partes iguales', reward: '+10 🪙', color: '#D4286A' },
  { id: 'clock', emoji: '🕒', title: 'Reto del Reloj', desc: 'Convierte horas, minutos y segundos', reward: '+15 🪙', color: '#E8650A' },
  { id: 'store', emoji: '🏪', title: 'Tienda de Math', desc: 'Da el cambio correcto', reward: '+20 🪙', color: '#16876A' },
  { id: 'division', emoji: '🍫', title: 'Chocolatinas de Math', desc: 'Reparte arrastrando a cada cesto', reward: '+10 🪙', color: '#B84D00' },
  { id: 'stats', emoji: '📊', title: 'Laboratorio de Estadística', desc: '¡Crea tus propios gráficos!', color: '#0E6BA8' },
  { id: 'decomp', emoji: '🔢', title: 'Descomposición Posicional', desc: 'Centenas, decenas y unidades', color: '#6A1B9A' },
  { id: 'badges', emoji: '🏅', title: 'Mis Insignias', desc: 'Tu colección de medallas', color: '#C94B22' },
];

/** Hub de mini-juegos y laboratorios. */
export default function GamesScreen() {
  const { progress, goScreen, grantReward, gameShortcut, clearGameShortcut } = useBook();
  const [active, setActive] = useState<GameId>(null);

  useEffect(() => {
    if (!gameShortcut) return;
    setActive(gameShortcut);
    clearGameShortcut();
  }, [gameShortcut, clearGameShortcut]);

  if (!progress) return null;

  const reward = (coins: number) => grantReward(0, coins);
  const close = () => setActive(null);

  return (
    <div className="screen active" id="screen-games">
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, fontWeight: 900 }}>🎮 Juegos y Laboratorios</div>
        <div style={{ fontWeight: 900, color: 'var(--orange)' }}>{progress.gamification.coins}🪙</div>
      </div>

      <div className="games-grid">
        {CARDS.map((c) => (
          <button key={c.id} className="game-card-btn" onClick={() => setActive(c.id)} style={{ borderColor: c.color }}>
            <span className="gcb-emoji">{c.emoji}</span>
            <span className="gcb-title" style={{ color: c.color }}>{c.title}</span>
            <span className="gcb-desc">{c.desc}</span>
            {c.reward && <span className="gcb-reward">{c.reward}</span>}
          </button>
        ))}
      </div>

      {active === 'tablas' && <MultiplicationTables onReward={reward} onClose={close} />}
      {active === 'hearts' && (
        <NumberMiniGame emoji="❤️" title="Reparte los Corazones" instruction="Divide en partes iguales" reward={10} accent="linear-gradient(135deg,#7B2FBE,#D4286A)" generate={genHearts} onReward={reward} onClose={close} />
      )}
      {active === 'clock' && (
        <NumberMiniGame emoji="🕒" title="Reto del Reloj" instruction="Convierte entre horas, minutos y segundos" reward={15} accent="linear-gradient(135deg,#E8650A,#FF8C2A)" generate={genClock} onReward={reward} onClose={close} />
      )}
      {active === 'store' && (
        <NumberMiniGame emoji="🏪" title="Tienda de Math — Da el cambio" instruction="¿Cuánto cambio recibe el cliente?" reward={20} accent="linear-gradient(135deg,#16876A,#24C496)" generate={genStore} onReward={reward} onClose={close} />
      )}
      {active === 'division' && (
        <div className="mg-overlay" onClick={close}>
          <div className="mg-card" onClick={(e) => e.stopPropagation()}>
            <button className="mg-close" onClick={close} aria-label="Cerrar">✕</button>
            <div className="mg-head">
              <div style={{ fontSize: 42 }}>🍫</div>
              <div className="mg-title">Chocolatinas de Math</div>
            </div>
            <DragDivisionGame onReward={(coins) => grantReward(5, coins)} />
          </div>
        </div>
      )}
      {active === 'stats' && <StatsLab onClose={close} />}
      {active === 'decomp' && <DecompositionTool onClose={close} />}
      {active === 'badges' && <BadgeShelf onClose={close} />}
    </div>
  );
}
