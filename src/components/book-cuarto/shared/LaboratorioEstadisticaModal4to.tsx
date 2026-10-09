'use client';

import React, { useState } from 'react';

interface LaboratorioEstadisticaModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

type TipoGrafico = 'barras' | 'lineas' | 'circular' | 'picto' | 'puntos';

interface LabAnalysis {
  nums: number[];
  n: number;
  suma: number;
  media: number;
  mediana: number;
  modas: number[];
  rango: number;
  sorted: number[];
  midIndices: number[];
  frecuencia: Record<number, number>;
  maxFreq: number;
  keys: number[];
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(2)).toString();
}

const PALETA = [
  '#14B8A6', '#FF8C2A', '#7C3AED', '#0EA5E9',
  '#E11D48', '#16A34A', '#F59E0B', '#6366F1',
  '#DB2777', '#0891B2', '#65A30D', '#B45309'
];

export default function LaboratorioEstadisticaModal4to({ isOpen, onClose }: LaboratorioEstadisticaModal4toProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [analysis, setAnalysis] = useState<LabAnalysis | null>(null);
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('barras');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Audio helpers
  const playTono = (freq = 520) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const hablar = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CO';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  };

  const analizarDatos = (rawStr: string) => {
    const nums = String(rawStr)
      .split(/[,;\s]+/)
      .map((x) => parseFloat(x.replace(',', '.')))
      .filter((x) => !isNaN(x))
      .slice(0, 20);

    if (!nums.length) {
      setErrorMsg('Escribe algunos números separados por coma');
      setAnalysis(null);
      return;
    }

    setErrorMsg('');
    const n = nums.length;
    const suma = nums.reduce((a, b) => a + b, 0);
    const media = suma / n;
    const sorted = nums.slice().sort((a, b) => a - b);
    const mediana = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    const frecuencia: Record<number, number> = {};
    nums.forEach((v) => {
      frecuencia[v] = (frecuencia[v] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(frecuencia));
    const modas = Object.keys(frecuencia)
      .filter((k) => frecuencia[Number(k)] === maxFreq)
      .map(Number);
    const rango = sorted[n - 1] - sorted[0];
    const keys = Object.keys(frecuencia)
      .map(Number)
      .sort((a, b) => a - b);

    const midIndices = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];

    setAnalysis({
      nums,
      n,
      suma,
      media,
      mediana,
      modas,
      rango,
      sorted,
      midIndices,
      frecuencia,
      maxFreq,
      keys,
    });

    playTono(560);
    hablar(`La media es ${fmt(media)}, la mediana ${fmt(mediana)} y la moda ${modas.map(fmt).join(' y ')}`);
  };

  const handlePreset = (val: string) => {
    setInputValue(val);
    analizarDatos(val);
  };

  const handleRandom = () => {
    const count = 6 + Math.floor(Math.random() * 7);
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(1 + Math.floor(Math.random() * 10));
    }
    const val = arr.join(', ');
    setInputValue(val);
    analizarDatos(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Estilos originales del HTML MatematicasDeFedor_4°.html */}
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 18px;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0F766E, #14B8A6);
        }
        .t5-hero h3 {
          font-family: 'Baloo 2', sans-serif;
          font-size: 22px;
          margin: 0 0 4px;
          color: #fff;
          font-weight: 900;
        }
        .t5-hero p {
          margin: 0;
          font-weight: 700;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95) !important;
        }
        .t5-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 8px 0;
          align-items: center;
        }
        .t5-pill {
          border: none;
          border-radius: 14px;
          padding: 8px 14px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s, box-shadow .12s;
          white-space: nowrap;
        }
        .t5-pill:hover {
          transform: translateY(-2px);
        }
        .t5-pill.on {
          outline: 3px solid #FFE066;
          transform: scale(1.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        .t5-card {
          background: #FFFFFF;
          border: 2px solid #E4DCFA;
          border-radius: 16px;
          padding: 14px;
        }
        .t5-stat {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 8px;
          margin: 10px 0;
        }
        .t5-stat div {
          border-radius: 14px;
          padding: 10px;
          text-align: center;
          color: #fff;
          font-weight: 900;
        }
        .t5-stat b {
          display: block;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          line-height: 1;
        }
        .t5-stat small {
          font-size: 11px;
          opacity: .95;
        }
        .fz-btn {
          border: none;
          border-radius: 14px;
          padding: 10px 22px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.g {
          background: #0F766E;
        }
        .fz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 6px 0;
        }
        .fz-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          border-radius: 10px;
          background: #F1EAFE;
          border: 1.5px solid #D9CCFF;
          font-weight: 900;
          font-size: 14px;
          color: #3D1468;
        }
        .fz-chip.cm {
          background: #A7F3D0 !important;
          border-color: #059669 !important;
          color: #065F46 !important;
        }
      `}</style>

      {/* Tarjeta Modal Principal */}
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[94vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal (Idéntico a la imagen de referencia) */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#3D1468] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span className="text-2xl">🔬</span>
            <span>Laboratorio de Estadística</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Modal con scroll suave */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Banner Hero Verde Azulado */}
          <div className="t5-hero">
            <h3>🔬 Laboratorio de datos</h3>
            <p>Escribe números o usa un ejemplo, y mira el gráfico, la media, la mediana y la moda.</p>
          </div>

          {/* Fila de Input y Botón Analizar */}
          <div className="flex gap-2.5 flex-wrap sm:flex-nowrap items-center mb-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') analizarDatos(inputValue);
              }}
              placeholder="Ej: 5, 3, 8, 5, 2, 8, 5"
              className="flex-1 min-w-[200px] p-3 border-2 border-[#99F6E4] rounded-xl text-base font-extrabold text-[#134E4A] placeholder-gray-400 outline-none focus:border-[#0F766E] transition-colors"
            />
            <button
              type="button"
              onClick={() => analizarDatos(inputValue)}
              className="fz-btn g flex-shrink-0"
            >
              <span>🔬</span>
              <span>Analizar</span>
            </button>
          </div>

          {/* Fila de Botones Predefinidos y Al Azar */}
          <div className="t5-pills">
            <button
              type="button"
              className="t5-pill"
              style={{ background: '#0891B2' }}
              onClick={() => handlePreset('7, 8, 6, 9, 8, 7, 8, 10')}
            >
              📝 Notas
            </button>
            <button
              type="button"
              className="t5-pill"
              style={{ background: '#16876A' }}
              onClick={() => handlePreset('3, 5, 2, 5, 4, 5, 1')}
            >
              ⚽ Goles
            </button>
            <button
              type="button"
              className="t5-pill"
              style={{ background: '#E8650A' }}
              onClick={() => handlePreset('10, 11, 10, 12, 9, 11, 10')}
            >
              🎂 Edades
            </button>
            <button
              type="button"
              className="t5-pill"
              style={{ background: '#7C3AED' }}
              onClick={handleRandom}
            >
              🎲 Al azar
            </button>
          </div>

          {/* Mensaje de error si la entrada está vacía */}
          {errorMsg && (
            <div className="p-3 my-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold text-sm text-center">
              {errorMsg}
            </div>
          )}

          {/* RESULTADOS DEL ANÁLISIS ESTADÍSTICO (cuando hay datos calculados) */}
          {analysis && (
            <div className="mt-3 space-y-3 animate-fadeIn">
              {/* Tarjetas de Estadísticas Principales */}
              <div className="t5-stat">
                <div style={{ background: '#0891B2' }}>
                  <b>{analysis.n}</b>
                  <small>datos</small>
                </div>
                <div style={{ background: '#7C3AED' }}>
                  <b>{fmt(analysis.media)}</b>
                  <small>media (promedio)</small>
                </div>
                <div style={{ background: '#16876A' }}>
                  <b>{fmt(analysis.mediana)}</b>
                  <small>mediana (el centro)</small>
                </div>
                <div style={{ background: '#E8650A' }}>
                  <b>{analysis.modas.map(fmt).join(' y ')}</b>
                  <small>moda (más se repite)</small>
                </div>
                <div style={{ background: '#BE185D' }}>
                  <b>{fmt(analysis.rango)}</b>
                  <small>rango (mayor − menor)</small>
                </div>
              </div>

              {/* Selector de Tipo de Gráfico */}
              <div className="t5-card">
                <div className="t5-pills justify-center sm:justify-start">
                  {[
                    { id: 'barras', label: '📊 Barras' },
                    { id: 'lineas', label: '📈 Líneas' },
                    { id: 'circular', label: '🥧 Circular' },
                    { id: 'picto', label: '⭐ Pictograma' },
                    { id: 'puntos', label: '⚫ Puntos' },
                  ].map((t) => {
                    const active = tipoGrafico === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTipoGrafico(t.id as TipoGrafico);
                          playTono(500);
                        }}
                        className={`t5-pill ${active ? 'on' : ''}`}
                        style={{ background: '#0F766E' }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Zona de Renderizado del Gráfico */}
                <div className="bg-white rounded-xl p-2 pt-4">
                  {renderGrafico(tipoGrafico, analysis)}
                </div>
              </div>

              {/* Datos Ordenados y Fórmula de la Media */}
              <div className="t5-card">
                <div style={{ fontWeight: 900, color: '#0F766E', marginBottom: '6px' }}>
                  ↕ Datos ordenados (en verde, el centro):
                </div>
                <div className="fz-chips">
                  {analysis.sorted.map((val, idx) => {
                    const isMid = analysis.midIndices.includes(idx);
                    return (
                      <span key={idx} className={`fz-chip ${isMid ? 'cm' : ''}`}>
                        {fmt(val)}
                      </span>
                    );
                  })}
                </div>
                <div style={{ marginTop: '8px', fontWeight: 800, color: '#3D1468', fontSize: '13px' }}>
                  Media = {analysis.sorted.map(fmt).join(' + ')} = {fmt(analysis.suma)} ÷ {analysis.n} ={' '}
                  <span style={{ color: '#E8650A', fontWeight: 900 }}>{fmt(analysis.media)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── RENDERIZADOR DE LOS 5 TIPOS DE GRÁFICO (SVG y HTML) ──
function renderGrafico(tipo: TipoGrafico, d: LabAnalysis) {
  const { keys, frecuencia: f, maxFreq: mx, modas, n } = d;
  const W = 600;
  const H = 260;
  const top = 34;
  const base = H - 40;
  const left = 50;

  const col = (k: number) => (modas.includes(k) ? '#FF8C2A' : '#14B8A6');

  if (tipo === 'barras' || tipo === 'lineas' || tipo === 'puntos') {
    const paso = (W - left - 20) / keys.length;
    const bw = Math.min(46, paso * 0.6);
    const pts: [number, number][] = [];

    // Líneas de guía horizontal
    const gridLines = [];
    for (let g = 0; g <= mx; g++) {
      const yy = base - (g / mx) * (base - top);
      gridLines.push(
        <React.Fragment key={`grid-${g}`}>
          <line x1={left} y1={yy} x2={W - 10} y2={yy} stroke="#EEE8FB" strokeWidth="1" />
          <text
            x={left - 8}
            y={yy + 4}
            fontSize="11"
            fontWeight="800"
            textAnchor="end"
            fill="#6B5E8A"
          >
            {g}
          </text>
        </React.Fragment>
      );
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="bg-white overflow-visible">
        {gridLines}
        {/* Ejes X e Y */}
        <line x1={left} y1={base} x2={W - 10} y2={base} stroke="#3D1468" strokeWidth="2" />
        <line x1={left} y1={top} x2={left} y2={base} stroke="#3D1468" strokeWidth="2" />

        {/* Barras, puntos o líneas */}
        {keys.map((k, i) => {
          const cx = left + paso * i + paso / 2;
          const h = (f[k] / mx) * (base - top);
          const y = base - h;
          pts.push([cx, y]);

          return (
            <React.Fragment key={`elem-${k}`}>
              {tipo === 'barras' && (
                <rect
                  x={cx - bw / 2}
                  y={y}
                  width={bw}
                  height={h}
                  rx="6"
                  fill={col(k)}
                />
              )}

              {tipo === 'puntos' &&
                (() => {
                  const r = Math.min(9, (base - top) / mx / 2 - 1);
                  return Array.from({ length: f[k] }).map((_, dotIdx) => (
                    <circle
                      key={`dot-${k}-${dotIdx}`}
                      cx={cx}
                      cy={base - (dotIdx + 0.5) * ((base - top) / mx)}
                      r={Math.max(4, r)}
                      fill={col(k)}
                    />
                  ));
                })()}

              {/* Burbuja con la frecuencia sobre la barra/punto */}
              <rect
                x={cx - 14}
                y={y - 26}
                width={28}
                height={20}
                rx={6}
                fill="#FFFFFF"
                stroke={col(k)}
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={y - 11}
                fontSize="13"
                fontWeight="900"
                textAnchor="middle"
                fill="#3D1468"
              >
                {f[k]}
              </text>

              {/* Etiqueta del valor en el eje X */}
              <text
                x={cx}
                y={base + 18}
                fontSize="13"
                fontWeight="900"
                textAnchor="middle"
                fill="#3D1468"
              >
                {fmt(k)}
              </text>
            </React.Fragment>
          );
        })}

        {/* Línea continua si tipo === lineas */}
        {tipo === 'lineas' && (
          <>
            <polyline
              points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="3"
            />
            {pts.map((p, i) => (
              <circle
                key={`circ-${i}`}
                cx={p[0]}
                cy={p[1]}
                r={6}
                fill={col(keys[i])}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        <text
          x={W / 2}
          y={H - 6}
          fontSize="12"
          fontWeight="800"
          textAnchor="middle"
          fill="#6B5E8A"
        >
          valores · la altura es la frecuencia (cuántas veces aparece)
        </text>
      </svg>
    );
  }

  if (tipo === 'circular') {
    const R = 100;
    const cx0 = 150;
    const cy0 = 130;
    let ang = -Math.PI / 2;

    const paths: React.ReactNode[] = [];
    keys.forEach((k, i) => {
      const fr = f[k] / n;
      const a2 = ang + fr * 2 * Math.PI;
      const large = fr > 0.5 ? 1 : 0;
      const x1 = cx0 + R * Math.cos(ang);
      const y1 = cy0 + R * Math.sin(ang);
      const x2 = cx0 + R * Math.cos(a2);
      const y2 = cy0 + R * Math.sin(a2);

      const color = PALETA[i % PALETA.length];

      if (fr >= 0.9999) {
        paths.push(
          <circle key={`pie-${k}`} cx={cx0} cy={cy0} r={R} fill={color} />
        );
      } else {
        const dStr = `M${cx0} ${cy0} L${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
        paths.push(
          <path
            key={`pie-${k}`}
            d={dStr}
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        );
      }

      if (fr >= 0.08) {
        const am = (ang + a2) / 2;
        const tx = cx0 + R * 0.62 * Math.cos(am);
        const ty = cy0 + R * 0.62 * Math.sin(am) + 5;
        paths.push(
          <text
            key={`text-${k}`}
            x={tx.toFixed(1)}
            y={ty.toFixed(1)}
            fontSize="13"
            fontWeight="900"
            textAnchor="middle"
            fill="#FFFFFF"
          >
            {f[k]}
          </text>
        );
      }

      ang = a2;
    });

    return (
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white p-2">
        <svg viewBox="0 0 300 260" width="280" className="bg-white">
          {paths}
        </svg>
        <div className="flex flex-col gap-2">
          {keys.map((k, i) => {
            const color = PALETA[i % PALETA.length];
            const pct = Math.round((f[k] / n) * 1000) / 10;
            return (
              <div
                key={`leg-${k}`}
                className="flex items-center gap-2 font-black text-[#1A1033] text-sm"
              >
                <span
                  className="w-4 h-4 rounded"
                  style={{ background: color }}
                />
                <span>
                  Valor {fmt(k)}: {f[k]} ({pct} %)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (tipo === 'picto') {
    return (
      <div className="bg-white p-3 space-y-2">
        {keys.map((k) => (
          <div key={`picto-${k}`} className="flex items-center gap-3">
            <b className="min-w-[44px] text-right text-[#3D1468] text-base">
              {fmt(k)}
            </b>
            <span className="text-xl tracking-wider">
              {'⭐'.repeat(f[k])}
            </span>
            <span className="fz-chip !min-w-0">
              {f[k]}
            </span>
          </div>
        ))}
        <div className="text-xs text-gray-500 font-bold mt-2">
          Cada ⭐ representa 1 dato.
        </div>
      </div>
    );
  }

  return null;
}
