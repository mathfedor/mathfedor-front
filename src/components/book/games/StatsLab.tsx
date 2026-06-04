'use client';

import { useMemo, useState } from 'react';

interface Row {
  id: number;
  label: string;
  value: number;
}

const PALETTE: Array<[string, string]> = [
  ['#FF8C2A', '#E8650A'],
  ['#FFE066', '#F5C518'],
  ['#A864E8', '#7B2FBE'],
  ['#F054A0', '#D4286A'],
  ['#24C496', '#16876A'],
  ['#3D9BE8', '#1A6CB4'],
  ['#FF6B6B', '#C94B22'],
  ['#9B5CFF', '#6A1B9A'],
];

const START: Row[] = [
  { id: 1, label: 'Manzanas', value: 4 },
  { id: 2, label: 'Bananos', value: 6 },
  { id: 3, label: 'Uvas', value: 3 },
  { id: 4, label: 'Fresas', value: 5 },
];

type ChartType = 'bar' | 'pie' | 'line';

/** Laboratorio de Estadística completo (réplica de `openLab`/`openStatsLab`):
 * edita filas y título, elige tipo de gráfico (barras, pastel, líneas). */
export default function StatsLab({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('Mi encuesta de frutas');
  const [rows, setRows] = useState<Row[]>(START);
  const [type, setType] = useState<ChartType>('bar');
  const [nextId, setNextId] = useState(5);

  const max = useMemo(() => Math.max(1, ...rows.map((r) => r.value)), [rows]);
  const total = useMemo(() => rows.reduce((s, r) => s + r.value, 0), [rows]);
  const colorOf = (i: number) => PALETTE[i % PALETTE.length];

  const setVal = (id: number, delta: number) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, value: Math.max(0, Math.min(20, r.value + delta)) } : r)));
  const setLabel = (id: number, label: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, label } : r)));
  const addRow = () => {
    if (rows.length >= 8) return;
    setRows((rs) => [...rs, { id: nextId, label: `Dato ${rs.length + 1}`, value: 1 }]);
    setNextId((n) => n + 1);
  };
  const removeRow = (id: number) => setRows((rs) => (rs.length > 2 ? rs.filter((r) => r.id !== id) : rs));

  return (
    <div className="mg-overlay" onClick={onClose}>
      <div className="mg-card lab-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mg-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="mg-head">
          <div style={{ fontSize: 42 }}>📊</div>
          <div className="mg-title">Laboratorio de Estadística</div>
          <div className="mg-inst">¡Crea tus propios gráficos! Edita los datos.</div>
        </div>

        <input
          className="finput lab-title-in"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 60))}
          placeholder="Título del gráfico"
        />

        <div className="lab-controls">
          {rows.map((r, i) => (
            <div className="lab-ctl" key={r.id}>
              <span className="lab-swatch" style={{ background: `linear-gradient(135deg, ${colorOf(i)[0]}, ${colorOf(i)[1]})` }} />
              <input className="lab-row-in" value={r.label} onChange={(e) => setLabel(r.id, e.target.value.slice(0, 16))} />
              <button className="lab-btn" onClick={() => setVal(r.id, -1)} aria-label="menos">−</button>
              <span className="lab-ctl-val">{r.value}</span>
              <button className="lab-btn" onClick={() => setVal(r.id, 1)} aria-label="más">+</button>
              <button className="lab-del" onClick={() => removeRow(r.id)} aria-label="quitar fila" disabled={rows.length <= 2}>🗑️</button>
            </div>
          ))}
        </div>

        <button className="lab-add" onClick={addRow} disabled={rows.length >= 8}>➕ Agregar fila</button>

        <div className="lab-toggle">
          <button className={`tb-mode-btn${type === 'bar' ? ' active' : ''}`} onClick={() => setType('bar')}>📊 Barras</button>
          <button className={`tb-mode-btn${type === 'pie' ? ' active' : ''}`} onClick={() => setType('pie')}>🥧 Pastel</button>
          <button className={`tb-mode-btn${type === 'line' ? ' active' : ''}`} onClick={() => setType('line')}>📈 Líneas</button>
        </div>

        <div className="lab-stage">
          {title && <div className="lab-chart-title">{title}</div>}
          {type === 'bar' && (
            <div className="lab-bars">
              {rows.map((r, i) => {
                const [light, dark] = colorOf(i);
                return (
                  <div className="lab-bar-col" key={r.id}>
                    <div className="lab-bar-val">{r.value}</div>
                    <div className="lab-bar" style={{ height: `${Math.max(6, (r.value / max) * 110)}px`, background: `linear-gradient(180deg, ${light}, ${dark})`, boxShadow: `0 6px 14px ${dark}66` }} />
                    <div className="lab-bar-name">{r.label}</div>
                  </div>
                );
              })}
            </div>
          )}
          {type === 'pie' && <Donut rows={rows} total={total} colorOf={colorOf} />}
          {type === 'line' && <Line rows={rows} max={max} colorOf={colorOf} />}
        </div>
      </div>
    </div>
  );
}

function Donut({ rows, total, colorOf }: { rows: Row[]; total: number; colorOf: (i: number) => [string, string] }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const safe = Math.max(1, total);
  let offset = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg viewBox="0 0 120 120" width="160" height="160" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={20} />
        {rows.map((row, i) => {
          if (row.value === 0) return null;
          const len = (row.value / safe) * circ;
          const el = (
            <circle key={row.id} cx="60" cy="60" r={r} fill="none" stroke={colorOf(i)[1]} strokeWidth={20} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)" />
          );
          offset += len;
          return el;
        })}
        <text x="60" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fill="#fff">{total}</text>
        <text x="60" y="73" textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(255,255,255,.6)">TOTAL</text>
      </svg>
      <div className="lab-legend">
        {rows.map((row, i) => (
          <span className="lab-legend-item" key={row.id}>
            <span className="lab-dot" style={{ background: colorOf(i)[1] }} />
            {row.label} {total > 0 ? Math.round((row.value / safe) * 100) : 0}%
          </span>
        ))}
      </div>
    </div>
  );
}

function Line({ rows, max, colorOf }: { rows: Row[]; max: number; colorOf: (i: number) => [string, string] }) {
  const w = 280;
  const h = 130;
  const padX = 20;
  const padY = 16;
  const step = rows.length > 1 ? (w - padX * 2) / (rows.length - 1) : 0;
  const pts = rows.map((r, i) => {
    const x = padX + i * step;
    const y = h - padY - (r.value / max) * (h - padY * 2);
    return { x, y, r };
  });
  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} aria-hidden>
        <polyline points={poly} fill="none" stroke="#FFE066" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={colorOf(i)[0]} stroke="#fff" strokeWidth={1.5} />
            <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">{p.r.value}</text>
            <text x={p.x} y={h - 3} textAnchor="middle" fontSize="8" fontWeight="800" fill="rgba(255,255,255,.7)">{p.r.label.slice(0, 6)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
