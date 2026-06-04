'use client';

import { useState, type MouseEvent } from 'react';

interface Round {
  total: number;
  groups: number;
  per: number;
}

const ITEM = '🍫';
const PERSON = '🧒';

function makeRound(): Round {
  const groups = 2 + Math.floor(Math.random() * 2); // 2 o 3
  const per = 2 + Math.floor(Math.random() * 4); // 2..5
  return { total: groups * per, groups, per };
}

/**
 * Mini-juego de división por reparto equitativo.
 * Toca un cesto para enviarle una chocolatina; reparte el total en partes iguales.
 */
export default function DragDivisionGame({ onReward }: { onReward: (coins: number) => void }) {
  const [round, setRound] = useState<Round>(makeRound);
  const [buckets, setBuckets] = useState<number[]>(() => Array<number>(round.groups).fill(0));
  const [status, setStatus] = useState<'playing' | 'ok' | 'bad'>('playing');
  const [solved, setSolved] = useState(0);

  const placed = buckets.reduce((a, b) => a + b, 0);
  const remaining = round.total - placed;

  const addTo = (i: number) => {
    if (status === 'ok' || remaining <= 0) return;
    setStatus('playing');
    setBuckets((b) => b.map((v, idx) => (idx === i ? v + 1 : v)));
  };

  const removeFrom = (i: number, e: MouseEvent) => {
    e.stopPropagation();
    if (status === 'ok') return;
    setStatus('playing');
    setBuckets((b) => b.map((v, idx) => (idx === i && v > 0 ? v - 1 : v)));
  };

  const reset = () => {
    setBuckets(Array<number>(round.groups).fill(0));
    setStatus('playing');
  };

  const check = () => {
    const ok = buckets.every((v) => v === round.per);
    if (ok) {
      setStatus('ok');
      setSolved((s) => s + 1);
      onReward(10);
      setTimeout(() => {
        const r = makeRound();
        setRound(r);
        setBuckets(Array<number>(r.groups).fill(0));
        setStatus('playing');
      }, 1400);
    } else {
      setStatus('bad');
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 15, marginBottom: 4 }}>
        Reparte {round.total} {ITEM} entre {round.groups} amigos en partes iguales
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 12 }}>
        Resueltos: {solved} · Quedan por repartir: {remaining}
      </div>

      <div className="game-pool">
        {remaining > 0
          ? Array.from({ length: remaining }, (_, i) => (
              <span key={i} className="game-item">{ITEM}</span>
            ))
          : <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 800 }}>¡Todo repartido! Comprueba 👇</span>}
      </div>

      <div className="game-buckets" style={{ gridTemplateColumns: `repeat(${round.groups}, 1fr)` }}>
        {buckets.map((count, i) => (
          <div key={i} className={`game-bucket${count === round.per && remaining === 0 ? ' full' : ''}`} onClick={() => addTo(i)}>
            <div className="game-bucket-emoji">{PERSON}</div>
            <div className="game-bucket-items">
              {Array.from({ length: count }, (_, k) => (
                <span key={k} style={{ fontSize: 18 }} onClick={(e) => removeFrom(i, e)}>{ITEM}</span>
              ))}
            </div>
            <div className="game-bucket-count">{count}</div>
          </div>
        ))}
      </div>

      <div className="game-feedback" style={{ color: status === 'ok' ? 'var(--teal-d)' : status === 'bad' ? 'var(--red)' : 'transparent' }}>
        {status === 'ok' ? `✅ ¡Correcto! ${round.total} ÷ ${round.groups} = ${round.per} · +10 🪙` : status === 'bad' ? '❌ No es equitativo. Toca las chocolatinas para reacomodar.' : '·'}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={reset} disabled={status === 'ok'}>Reiniciar</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={check} disabled={remaining !== 0 || status === 'ok'}>Comprobar</button>
      </div>
    </div>
  );
}
