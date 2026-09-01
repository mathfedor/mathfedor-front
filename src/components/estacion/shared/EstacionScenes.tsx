import React from 'react';
import { EscenaData } from '../types/estacion.types';
import { COLOR_DINERO, esBillete, pesos } from '../data/estacion-data';

export const SvgDinero: React.FC<{ v: number }> = ({ v }) => {
  const col = COLOR_DINERO[v] || '#E6C88A';
  if (esBillete(v)) {
    return (
      <svg viewBox="0 0 120 60" width="116" height="58" aria-hidden="true" style={{ verticalAlign: 'middle' }}>
        <rect x="3" y="3" width="114" height="54" rx="8" fill={col} stroke="#070C1F" strokeWidth="4" />
        <rect
          x="11"
          y="11"
          width="98"
          height="38"
          rx="5"
          fill="none"
          stroke="rgba(7,12,31,.4)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <circle cx="26" cy="30" r="11" fill="rgba(255,255,255,.55)" stroke="#070C1F" strokeWidth="2.5" />
        <text
          x="70"
          y="38"
          textAnchor="middle"
          fontFamily="'Baloo 2', sans-serif"
          fontWeight="800"
          fontSize="20"
          fill="#070C1F"
        >
          {v / 1000} mil
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true" style={{ verticalAlign: 'middle' }}>
      <circle cx="32" cy="32" r="28" fill={col} stroke="#070C1F" strokeWidth="4" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(7,12,31,.35)" strokeWidth="2.5" />
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontFamily="'Baloo 2', sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#070C1F"
      >
        {v >= 1000 ? v / 1000 + 'mil' : '$' + v}
      </text>
    </svg>
  );
};

export const PiezaDinero: React.FC<{
  v: number;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ v, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center p-1 rounded-2xl transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
        esBillete(v) ? 'w-[124px] h-[64px]' : 'w-[68px] h-[68px]'
      }`}
      style={{
        background: 'transparent',
        border: 'none',
      }}
      aria-label={(esBillete(v) ? 'Billete' : 'Moneda') + ' de ' + pesos(v)}
    >
      <SvgDinero v={v} />
    </button>
  );
};

export const RenderEscena: React.FC<{ escena?: EscenaData }> = ({ escena }) => {
  if (!escena) return null;
  const { tipo, args } = escena;

  switch (tipo) {
    case 'dinero': {
      const v = args[0];
      return (
        <div className="flex justify-center p-3">
          <SvgDinero v={v} />
        </div>
      );
    }
    case 'semillas': {
      const n: number = args[0];
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 300 120" width="300" height="120" className="max-w-full h-auto" aria-hidden="true">
            <rect x="4" y="70" width="292" height="46" rx="10" fill="#6B4527" stroke="#070C1F" strokeWidth="3.5" />
            {Array.from({ length: n }).map((_, i) => {
              const x = 30 + (i % 5) * 56;
              const y = i < 5 ? 38 : 92;
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="14"
                  ry="18"
                  fill="#FFC94D"
                  stroke="#070C1F"
                  strokeWidth="3"
                  transform={`rotate(18 ${x} ${y})`}
                />
              );
            })}
          </svg>
        </div>
      );
    }
    case 'planta': {
      const cm: number = args[0];
      const esc = 8;
      const alto = cm * esc;
      const base = 160;
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 280 190" width="280" height="190" className="max-w-full h-auto" aria-hidden="true">
            <rect x="40" y={base} width="70" height="24" rx="5" fill="#FF8A5C" stroke="#070C1F" strokeWidth="3.5" />
            <line x1="75" y1={base} x2="75" y2={base - alto} stroke="#5BD672" strokeWidth="6" strokeLinecap="round" />
            <path
              d={`M75 ${base - alto + 12} q-22 -4 -26 -24 q20 2 26 24 M75 ${base - alto + 4} q22 -4 26 -24 q-20 2 -26 24`}
              fill="#5BD672"
              stroke="#070C1F"
              strokeWidth="2.5"
            />
            <rect x="160" y="20" width="34" height="164" rx="5" fill="#FFC94D" stroke="#070C1F" strokeWidth="3.5" />
            {Array.from({ length: 19 }).map((_, c) => {
              const y = base - c * esc;
              if (y < 24) return null;
              return (
                <g key={c}>
                  <line
                    x1="160"
                    y1={y}
                    x2={c % 5 === 0 ? 182 : 172}
                    y2={y}
                    stroke="#070C1F"
                    strokeWidth="2"
                  />
                  {c % 5 === 0 && (
                    <text
                      x="187"
                      y={y + 4}
                      fontFamily="Nunito, sans-serif"
                      fontWeight="800"
                      fontSize="11"
                      fill="#070C1F"
                    >
                      {c}
                    </text>
                  )}
                </g>
              );
            })}
            <line
              x1="108"
              y1={base - alto}
              x2="160"
              y2={base - alto}
              stroke="#FF6B5E"
              strokeWidth="3"
              strokeDasharray="6 5"
            />
          </svg>
        </div>
      );
    }
    case 'podio': {
      const corredores: Array<[string, number]> = args[0];
      let x = 14;
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 340 110" width="340" height="110" className="max-w-full h-auto" aria-hidden="true">
            {corredores.map(([n, t], i) => {
              const curX = x + i * 110;
              return (
                <g key={i}>
                  <rect x={curX} y="14" width="96" height="80" rx="12" fill="#243468" stroke="#070C1F" strokeWidth="3" />
                  <circle cx={curX + 48} cy="40" r="14" fill="#E8A45C" stroke="#070C1F" strokeWidth="2.5" />
                  <text
                    x={curX + 48}
                    y="70"
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="13"
                    fill="#F2F6FF"
                  >
                    {n}
                  </text>
                  <text
                    x={curX + 48}
                    y="88"
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="13"
                    fill="#FFC94D"
                  >
                    {t} s
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }
    case 'dados': {
      const [a, b] = args as [number, number];
      const P: Record<number, Array<[number, number]>> = {
        1: [[0.5, 0.5]],
        2: [[0.28, 0.28], [0.72, 0.72]],
        3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
        4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
        5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
        6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5], [0.72, 0.5], [0.28, 0.75], [0.72, 0.75]],
      };
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 240 110" width="240" height="110" className="max-w-full h-auto" aria-hidden="true">
            {[
              [a, 16, '#FFC94D'],
              [b, 130, '#4FD8CB'],
            ].map(([num, xPos, col], idx) => (
              <g key={idx}>
                <rect x={Number(xPos)} y="16" width="80" height="80" rx="16" fill={String(col)} stroke="#070C1F" strokeWidth="4" />
                {(P[Number(num)] || []).map(([px, py], pIdx) => (
                  <circle
                    key={pIdx}
                    cx={Number(xPos) + px * 80}
                    cy={16 + py * 80}
                    r="7"
                    fill="#070C1F"
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>
      );
    }
    case 'domino': {
      const [a, b] = args as [number, number];
      const P: Record<number, Array<[number, number]>> = {
        1: [[0.5, 0.5]],
        2: [[0.3, 0.3], [0.7, 0.7]],
        3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
        4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
        5: [[0.3, 0.3], [0.7, 0.3], [0.5, 0.5], [0.3, 0.7], [0.7, 0.7]],
        6: [[0.3, 0.26], [0.7, 0.26], [0.3, 0.5], [0.7, 0.5], [0.3, 0.74], [0.7, 0.74]],
      };
      return (
        <div className="flex justify-center p-1">
          <svg viewBox="0 0 150 80" width="150" height="80" aria-hidden="true">
            <rect x="4" y="10" width="142" height="62" rx="10" fill="#F2F6FF" stroke="#070C1F" strokeWidth="4" />
            <line x1="75" y1="10" x2="75" y2="72" stroke="#070C1F" strokeWidth="3" />
            {[
              [a, 4],
              [b, 75],
            ].map(([num, x0], idx) => (
              <g key={idx}>
                {(P[Number(num)] || []).map(([px, py], pIdx) => (
                  <circle
                    key={pIdx}
                    cx={Number(x0) + px * 71}
                    cy={10 + py * 62}
                    r="5.5"
                    fill="#070C1F"
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>
      );
    }
    case 'bolsa': {
      const [rojas, azules] = args as [number, number];
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 230 150" width="230" height="150" className="max-w-full h-auto" aria-hidden="true">
            <path
              d="M55 40 Q40 20 70 18 L160 18 Q190 20 175 40 L188 118 Q190 140 165 140 L65 140 Q40 140 42 118 Z"
              fill="#243468"
              stroke="#070C1F"
              strokeWidth="4"
            />
            {Array.from({ length: rojas }).map((_, i) => {
              const x = 68 + (i % 4) * 32;
              const y = 58 + Math.floor(i / 4) * 32;
              return <circle key={'r-' + i} cx={x} cy={y} r="12" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3" />;
            })}
            {Array.from({ length: azules }).map((_, i) => {
              const idx = rojas + i;
              const x = 68 + (idx % 4) * 32;
              const y = 58 + Math.floor(idx / 4) * 32;
              return <circle key={'a-' + i} cx={x} cy={y} r="12" fill="#4FA3E8" stroke="#070C1F" strokeWidth="3" />;
            })}
          </svg>
        </div>
      );
    }
    case 'figura': {
      const tipoFig: string = args[0];
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 180 150" width="180" height="150" aria-hidden="true">
            {tipoFig === 'tri' && (
              <path d="M90 18 L164 130 L16 130 Z" fill="#FFC94D" stroke="#070C1F" strokeWidth="4" />
            )}
            {tipoFig === 'cua' && (
              <rect x="35" y="25" width="110" height="110" fill="#4FD8CB" stroke="#070C1F" strokeWidth="4" />
            )}
            {tipoFig === 'hex' && (
              <path d="M90 14 L152 48 L152 112 L90 146 L28 112 L28 48 Z" fill="#9B7BFF" stroke="#070C1F" strokeWidth="4" />
            )}
            {tipoFig === 'pent' && (
              <path d="M90 12 L160 64 L133 140 L47 140 L20 64 Z" fill="#F5A3B8" stroke="#070C1F" strokeWidth="4" />
            )}
            {tipoFig === 'rect' && (
              <rect x="20" y="45" width="140" height="70" fill="#FFC94D" stroke="#070C1F" strokeWidth="4" />
            )}
          </svg>
        </div>
      );
    }
    case 'cuadricula': {
      const [w, h2] = args as [number, number];
      const cel = 34;
      const W = w * cel;
      const H = h2 * cel;
      return (
        <div className="flex justify-center p-2">
          <svg
            viewBox={`0 0 ${W + 8} ${H + 8}`}
            width={Math.min(420, W + 8)}
            height={H + 8}
            className="max-w-full h-auto"
            aria-hidden="true"
          >
            <rect x="4" y="4" width={W} height={H} fill="#4FD8CB" opacity=".85" stroke="#070C1F" strokeWidth="4" />
            {Array.from({ length: w - 1 }).map((_, i) => (
              <line
                key={'v-' + i}
                x1={4 + (i + 1) * cel}
                y1="4"
                x2={4 + (i + 1) * cel}
                y2={4 + H}
                stroke="#070C1F"
                strokeWidth="2"
              />
            ))}
            {Array.from({ length: h2 - 1 }).map((_, j) => (
              <line
                key={'h-' + j}
                x1="4"
                y1={4 + (j + 1) * cel}
                x2={4 + W}
                y2={4 + (j + 1) * cel}
                stroke="#070C1F"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      );
    }
    case 'cubos': {
      const [l, an, al] = args as [number, number, number];
      const u = 26;
      const ox = 30;
      const oy = 34 + al * u * 0.5;
      const viewW = l * u + an * u * 0.6 + 60;
      const viewH = al * u + an * u * 0.5 + 50;
      const cubes = [];
      for (let z = an - 1; z >= 0; z--) {
        for (let y = 0; y < al; y++) {
          for (let x = 0; x < l; x++) {
            const px = ox + x * u + z * u * 0.5;
            const py = oy + (al - 1 - y) * u - z * u * 0.3;
            cubes.push(
              <g key={`${x}-${y}-${z}`} stroke="#070C1F" strokeWidth="2">
                <path d={`M${px} ${py} l${u} 0 l0 ${u} l-${u} 0 Z`} fill="#9CCBFF" />
                <path
                  d={`M${px} ${py} l${u * 0.5} -${u * 0.3} l${u} 0 l-${u * 0.5} ${u * 0.3} Z`}
                  fill="#C9DFF5"
                />
                <path
                  d={`M${px + u} ${py} l${u * 0.5} -${u * 0.3} l0 ${u} l-${u * 0.5} ${u * 0.3} Z`}
                  fill="#6FA8DC"
                />
              </g>
            );
          }
        }
      }
      return (
        <div className="flex justify-center p-2">
          <svg viewBox={`0 0 ${viewW} ${viewH}`} width={viewW} height={viewH} className="max-w-full h-auto" aria-hidden="true">
            {cubes}
          </svg>
        </div>
      );
    }
    case 'barras': {
      const [vals, labels] = args as [number[], string[]];
      const W = 380;
      const H = 190;
      const mI = 44;
      const mA = 34;
      const mT = 14;
      const max = Math.max(...vals, 1);
      const aU = H - mA - mT;
      const anU = W - mI - 14;
      const bw = Math.min(64, (anU / vals.length) * 0.6);
      const paso = anU / vals.length;
      return (
        <div className="flex justify-center p-2">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full h-auto" aria-hidden="true">
            {[0, 1, 2].map((i2) => {
              const y = mT + aU - (aU * i2) / 2;
              return (
                <g key={i2}>
                  <line x1={mI} y1={y} x2={W - 8} y2={y} stroke="rgba(185,196,232,.2)" strokeWidth="1.5" />
                  <text
                    x={mI - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontFamily="Nunito, sans-serif"
                    fontWeight="700"
                    fontSize="11"
                    fill="#B9C4E8"
                  >
                    {(max * i2) / 2}
                  </text>
                </g>
              );
            })}
            {vals.map((v, i2) => {
              const bh = (aU * v) / max;
              const x = mI + paso * i2 + (paso - bw) / 2;
              const y = mT + aU - bh;
              return (
                <g key={i2}>
                  <rect
                    x={x}
                    y={y}
                    width={bw}
                    height={bh}
                    rx="6"
                    fill={v === max ? '#FFC94D' : '#4FD8CB'}
                    stroke="#070C1F"
                    strokeWidth="3"
                  />
                  <text
                    x={x + bw / 2}
                    y={H - 14}
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="12"
                    fill="#F2F6FF"
                  >
                    {labels[i2]}
                  </text>
                  <text
                    x={x + bw / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="12"
                    fill="#B9C4E8"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }
    case 'picto': {
      const filas: Array<[string, number]> = args;
      return (
        <div className="flex justify-center p-2">
          <div
            className="grid gap-2 p-4 rounded-2xl max-w-[340px] w-full"
            style={{ background: '#0A1028', border: '3px solid #070C1F' }}
          >
            {filas.map(([emoji, n], idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span style={{ fontSize: '20px' }}>{emoji}</span>
                <span style={{ fontSize: '22px', letterSpacing: '4px' }}>{emoji.repeat(n)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'reloj': {
      const [hh, mm] = args as [number, number];
      const cx = 95;
      const cy = 95;
      const aM = ((mm * 6 - 90) * Math.PI) / 180;
      const aH = (((hh % 12) * 30 + mm * 0.5 - 90) * Math.PI) / 180;
      return (
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 190 190" width="190" height="190" aria-hidden="true">
            <circle cx={cx} cy={cy} r="86" fill="#F2F6FF" stroke="#070C1F" strokeWidth="5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i + 1;
              const a = ((num * 30 - 90) * Math.PI) / 180;
              return (
                <text
                  key={num}
                  x={cx + 66 * Math.cos(a)}
                  y={cy + 66 * Math.sin(a) + 5}
                  textAnchor="middle"
                  fontFamily="'Baloo 2', sans-serif"
                  fontWeight="800"
                  fontSize="16"
                  fill="#070C1F"
                >
                  {num}
                </text>
              );
            })}
            <line
              x1={cx}
              y1={cy}
              x2={cx + 38 * Math.cos(aH)}
              y2={cy + 38 * Math.sin(aH)}
              stroke="#070C1F"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx + 56 * Math.cos(aM)}
              y2={cy + 56 * Math.sin(aM)}
              stroke="#FF6B5E"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r="6" fill="#070C1F" />
          </svg>
        </div>
      );
    }
    case 'linea': {
      const vals: number[] = args[0];
      const W = 380;
      const H = 150;
      const mI = 30;
      const mA = 30;
      const mT = 16;
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const aU = H - mA - mT;
      const anU = W - mI - 20;
      let pathD = '';
      const points = vals.map((v, i2) => {
        const x = mI + (anU * i2) / (vals.length - 1 || 1);
        const y = mT + aU - (max === min ? aU / 2 : (aU * (v - min)) / (max - min));
        pathD += (i2 ? ' L' : 'M') + x + ' ' + y;
        return { x, y, v };
      });
      return (
        <div className="flex justify-center p-2">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full h-auto" aria-hidden="true">
            <line x1={mI} y1={H - mA} x2={W - 12} y2={H - mA} stroke="#B9C4E8" strokeWidth="2.5" />
            <path d={pathD} fill="none" stroke="#5BD672" strokeWidth="3.5" strokeLinecap="round" />
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="6" fill="#FFC94D" stroke="#070C1F" strokeWidth="2.5" />
                <text
                  x={p.x}
                  y={H - 10}
                  textAnchor="middle"
                  fontFamily="'Baloo 2', sans-serif"
                  fontWeight="800"
                  fontSize="11"
                  fill="#B9C4E8"
                >
                  {p.v}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    }
    default:
      return null;
  }
};
