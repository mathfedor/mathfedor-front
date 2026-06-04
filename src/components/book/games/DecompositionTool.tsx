'use client';

import { useMemo, useState } from 'react';

const PLACES = [
  { name: 'Unidad de mil', short: 'UM', value: 1000, color: '#7B2FBE', grad: 'linear-gradient(160deg,#A864E8,#7B2FBE)' },
  { name: 'Centena', short: 'C', value: 100, color: '#E8650A', grad: 'linear-gradient(160deg,#FF8C2A,#E8650A)' },
  { name: 'Decena', short: 'D', value: 10, color: '#16876A', grad: 'linear-gradient(160deg,#24C496,#16876A)' },
  { name: 'Unidad', short: 'U', value: 1, color: '#1A6CB4', grad: 'linear-gradient(160deg,#3D9BE8,#1A6CB4)' },
];

/** Descomposición Posicional (réplica de `showDecompList`). */
export default function DecompositionTool({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('247');
  const n = useMemo(() => {
    const v = parseInt(text, 10);
    return Number.isFinite(v) ? Math.max(0, Math.min(9999, v)) : 0;
  }, [text]);

  const parts = useMemo(() => {
    let rest = n;
    return PLACES.map((p) => {
      const digit = Math.floor(rest / p.value);
      rest -= digit * p.value;
      return { ...p, digit, amount: digit * p.value };
    }).filter((p) => p.digit > 0 || (n === 0 && p.value === 1));
  }, [n]);

  return (
    <div className="mg-overlay" onClick={onClose}>
      <div className="mg-card" onClick={(e) => e.stopPropagation()}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="mg-head">
          <div style={{ fontSize: 42 }}>🔢</div>
          <div className="mg-title">Descomposición Posicional</div>
          <div className="mg-inst">Escribe un número (0–9999) y mira cómo se descompone.</div>
        </div>

        <input
          className="finput"
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          placeholder="Ej: 247"
          style={{ textAlign: 'center', fontSize: 26, fontWeight: 900 }}
          autoComplete="off"
        />

        <div className="decomp-sum">
          {parts.map((p, i) => (
            <span key={p.short} className="decomp-term" style={{ color: p.color }}>
              {p.amount}{i < parts.length - 1 ? <span className="decomp-plus"> + </span> : null}
            </span>
          ))}
          <span className="decomp-eq"> = {n}</span>
        </div>

        <div className="decomp-cards">
          {parts.map((p) => (
            <div className="decomp-card" key={p.short} style={{ background: p.grad, boxShadow: `0 6px 16px ${p.color}55` }}>
              <div className="decomp-digit">{p.digit}</div>
              <div className="decomp-name">{(p.digit === 1 ? p.name : p.name + (p.name.endsWith('mil') ? 'es' : 's')).toUpperCase()}</div>
              <div className="decomp-amount">{p.amount}</div>
            </div>
          ))}
        </div>

        <div className="decomp-words">
          {parts.map((p, i) => (
            <span key={p.short}>
              {p.digit} {p.digit === 1 ? p.name.toLowerCase() : p.name.toLowerCase() + (p.name.endsWith('mil') ? 'es' : 's')}
              {i < parts.length - 1 ? ' + ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
