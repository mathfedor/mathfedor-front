'use client';

import { useState } from 'react';
import { bookAudio } from '@/services/book-audio.service';

interface RetoQ {
  a: number;
  b: number;
}

function randReto(table: number): RetoQ {
  return { a: table, b: 1 + Math.floor(Math.random() * 10) };
}

/** Tablas de Multiplicar (réplica de `openTablas`): práctica y reto rápido. */
export default function MultiplicationTables({ onReward, onClose }: { onReward: (coins: number) => void; onClose: () => void }) {
  const [table, setTable] = useState(2);
  const [mode, setMode] = useState<'practica' | 'reto'>('practica');
  const [q, setQ] = useState<RetoQ>(() => randReto(2));
  const [val, setVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);

  const startReto = (t: number) => {
    setMode('reto');
    setScore(0);
    setStreak(0);
    setQ(randReto(t));
    setVal('');
    setFb(null);
  };

  const checkReto = () => {
    const v = parseInt(val, 10);
    if (Number.isNaN(v)) return;
    if (v === q.a * q.b) {
      const gain = 5;
      setScore((s) => s + gain);
      setStreak((s) => s + 1);
      onReward(gain);
      bookAudio.correct();
      setFb({ msg: `¡Correcto! +${gain} 🪙`, ok: true });
      setTimeout(() => {
        setQ(randReto(table));
        setVal('');
        setFb(null);
      }, 700);
    } else {
      setStreak(0);
      bookAudio.wrong();
      setFb({ msg: `${q.a} × ${q.b} = ${q.a * q.b}`, ok: false });
    }
  };

  return (
    <div className="mg-overlay" onClick={onClose}>
      <div className="mg-card tb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="mg-head">
          <div style={{ fontSize: 42 }}>🎯</div>
          <div className="mg-title">Tablas de Multiplicar</div>
          <div className="mg-inst">Aprende jugando · 🏆 {score} pts</div>
        </div>

        <div className="tb-selector">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              className={`tb-num-btn${table === i ? ' active' : ''}`}
              onClick={() => {
                setTable(i);
                if (mode === 'reto') startReto(i);
              }}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="tb-mode-toggle">
          <button className={`tb-mode-btn${mode === 'practica' ? ' active' : ''}`} onClick={() => setMode('practica')}>📖 Práctica</button>
          <button className={`tb-mode-btn${mode === 'reto' ? ' active' : ''}`} onClick={() => startReto(table)}>⚡ Reto rápido</button>
        </div>

        {mode === 'practica' ? (
          <div className="tb-table">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <div className="tb-row" key={n}>
                <span>{table} × {n}</span>
                <span className="tb-eq">=</span>
                <span className="tb-res">{table * n}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="tb-reto">
            <div className="tb-reto-streak">🔥 Racha: {streak}</div>
            <div className="tb-reto-q">{q.a} × {q.b} = ?</div>
            <input
              className="finput"
              inputMode="numeric"
              value={val}
              onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && checkReto()}
              placeholder="?"
              autoComplete="off"
            />
            <div className="mg-feedback" style={{ color: fb ? (fb.ok ? 'var(--teal-d)' : 'var(--red)') : 'transparent' }}>{fb?.msg ?? '·'}</div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={checkReto}>Comprobar</button>
          </div>
        )}
      </div>
    </div>
  );
}
