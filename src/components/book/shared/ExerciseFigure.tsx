'use client';

import type { ReactNode } from 'react';
import type { ExerciseFigureData } from '@/types/book.types';

/**
 * Renderiza la figura/diagrama de un ejercicio a partir de `figure` + `fig_data`.
 * Cubre los 8 tipos extraídos del HTML original (550 ejercicios):
 *   fraccion (pie | compare | sum_frac), bar_chart, tabla_directa, tabla_inversa,
 *   y geometría: cuadrado, rectangulo, cubo, prisma.
 */
export default function ExerciseFigure({
  figure,
  data,
}: {
  figure: string;
  data?: ExerciseFigureData;
}) {
  const d = data ?? {};
  let body: ReactNode = null;

  switch (figure) {
    case 'fraccion':
      body = <Fraccion data={d} />;
      break;
    case 'bar_chart':
      body = <BarChart data={d} />;
      break;
    case 'tabla_directa':
      body = <ProportionTable data={d} kind="directa" />;
      break;
    case 'tabla_inversa':
      body = <ProportionTable data={d} kind="inversa" />;
      break;
    case 'cuadrado':
    case 'rectangulo':
    case 'cubo':
    case 'prisma':
      body = <GeometryFigure figure={figure} data={d} />;
      break;
    default:
      return null;
  }

  return <div className="ex-figure">{body}</div>;
}

/* ── helpers de acceso seguro a fig_data ──────────────────────── */
const num = (v: unknown, fallback = 0): number => (typeof v === 'number' ? v : fallback);
const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/* ── FRACCIÓN ─────────────────────────────────────────────────── */
function Fraccion({ data }: { data: ExerciseFigureData }) {
  const kind = str(data.kind, 'pie');

  if (kind === 'compare') {
    const a = arr<number>(data.a);
    const b = arr<number>(data.b);
    return (
      <div className="fig-row">
        <PieFraction num={a[0] ?? 1} den={a[1] ?? 2} />
        <span className="fig-vs">vs</span>
        <PieFraction num={b[0] ?? 1} den={b[1] ?? 2} />
      </div>
    );
  }

  if (kind === 'sum_frac') {
    const parts = arr<string>(data.parts);
    return (
      <div className="fig-frac-sum">
        {parts.map((p, i) => {
          const [n, de] = p.split('/');
          return (
            <span key={i} className="fig-frac-term">
              <FractionGlyph num={n} den={de} />
              {i < parts.length - 1 && <span className="fig-plus">+</span>}
            </span>
          );
        })}
      </div>
    );
  }

  // pie
  return <PieFraction num={num(data.num, 1)} den={num(data.den, 2)} />;
}

function PieFraction({ num: n, den }: { num: number; den: number }) {
  const slices = Math.max(1, den);
  const r = 46;
  const cx = 50;
  const cy = 50;
  const paths = Array.from({ length: slices }, (_, i) => {
    const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return {
      d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`,
      filled: i < n,
    };
  });
  return (
    <div className="fig-pie-wrap">
      <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden>
        <defs>
          <radialGradient id="fracGrad" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#FFB066" />
            <stop offset="100%" stopColor="#E8650A" />
          </radialGradient>
        </defs>
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.filled ? 'url(#fracGrad)' : '#EDE8FF'} stroke="#fff" strokeWidth={1.5} />
        ))}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6C28B4" strokeWidth={2} />
      </svg>
      <FractionGlyph num={String(n)} den={String(den)} />
    </div>
  );
}

function FractionGlyph({ num: n, den }: { num?: string; den?: string }) {
  return (
    <span className="fig-frac-glyph">
      <span className="fig-frac-num">{n ?? '?'}</span>
      <span className="fig-frac-bar" />
      <span className="fig-frac-den">{den ?? '?'}</span>
    </span>
  );
}

/* ── GRÁFICO DE BARRAS ────────────────────────────────────────── */
function BarChart({ data }: { data: ExerciseFigureData }) {
  const labels = arr<string>(data.labels);
  const values = arr<number>(data.values);
  const title = str(data.title);
  const max = Math.max(1, ...values);
  const palette: Array<[string, string]> = [
    ['#A864E8', '#7B2FBE'],
    ['#FF8C2A', '#E8650A'],
    ['#24C496', '#16876A'],
    ['#3D9BE8', '#1A6CB4'],
    ['#F054A0', '#D4286A'],
    ['#FFE066', '#D4A017'],
  ];

  return (
    <div className="fig-bar-chart">
      {title && <div className="fig-bar-title">{title}</div>}
      <div className="fig-bars">
        {labels.map((label, i) => {
          const v = values[i] ?? 0;
          const [light, dark] = palette[i % palette.length];
          return (
            <div className="fig-bar-col" key={i}>
              <div className="fig-bar-val">{v}</div>
              <div
                className="fig-bar"
                style={{ height: `${Math.max(6, (v / max) * 100)}px`, background: `linear-gradient(180deg, ${light}, ${dark})`, boxShadow: `0 5px 12px ${dark}66` }}
              />
              <div className="fig-bar-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TABLAS DE PROPORCIONALIDAD ───────────────────────────────── */
function ProportionTable({ data, kind }: { data: ExerciseFigureData; kind: 'directa' | 'inversa' }) {
  const item = str(data.item, 'cantidad');
  const pairs = arr<[number, number]>(data.pairs);
  const ask = num(data.ask, -1);
  const headRight = kind === 'directa' ? 'Precio' : 'Cada uno';

  return (
    <table className="fig-table">
      <thead>
        <tr>
          <th>{item}</th>
          <th>{headRight}</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map(([q, val], i) => {
          const highlight = q === ask;
          return (
            <tr key={i} className={highlight ? 'fig-table-ask' : ''}>
              <td>{q}</td>
              <td>{highlight ? '?' : val}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ── GEOMETRÍA ────────────────────────────────────────────────── */
function GeometryFigure({ figure, data }: { figure: string; data: ExerciseFigureData }) {
  const unit = str(data.unit, '');
  const areaKind = str(data.area_kind, '');
  const label = areaKind === 'perimetro' ? 'Perímetro' : areaKind === 'area' ? 'Área' : 'Volumen';
  const theme =
    areaKind === 'perimetro'
      ? { accent: '#16876A', light: '#24C496' }
      : areaKind === 'area'
        ? { accent: '#7B2FBE', light: '#A864E8' }
        : { accent: '#E8650A', light: '#FF8C2A' };
  const gradId = `geo-${areaKind || 'x'}`;

  return (
    <div className="fig-geo">
      <svg viewBox="0 0 120 110" width="134" height="124" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.light} stopOpacity={0.85} />
            <stop offset="100%" stopColor={theme.accent} stopOpacity={0.95} />
          </linearGradient>
        </defs>
        <GeometryShape figure={figure} accent={theme.accent} gradId={gradId} />
      </svg>
      <div className="fig-geo-tag" style={{ background: `linear-gradient(135deg, ${theme.light}, ${theme.accent})` }}>
        {label}
        {unit ? ` · ${unit}` : ''}
      </div>
    </div>
  );
}

function GeometryShape({ figure, accent, gradId }: { figure: string; accent: string; gradId: string }) {
  const fill = `url(#${gradId})`;
  switch (figure) {
    case 'cuadrado':
      return <rect x={28} y={18} width={64} height={64} rx={4} fill={fill} stroke={accent} strokeWidth={2.5} />;
    case 'rectangulo':
      return <rect x={14} y={28} width={92} height={50} rx={4} fill={fill} stroke={accent} strokeWidth={2.5} />;
    case 'cubo':
      return (
        <g fill={fill} stroke={accent} strokeWidth={2.2}>
          <rect x={28} y={34} width={50} height={50} />
          <polygon points="28,34 46,18 96,18 78,34" />
          <polygon points="78,34 96,18 96,68 78,84" />
        </g>
      );
    case 'prisma':
      return (
        <g fill={fill} stroke={accent} strokeWidth={2.2}>
          <rect x={20} y={40} width={62} height={40} />
          <polygon points="20,40 40,22 102,22 82,40" />
          <polygon points="82,40 102,22 102,62 82,80" />
        </g>
      );
    default:
      return null;
  }
}
