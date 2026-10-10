'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ConteoModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Configuraciones de Conteo del HTML original de 5° ──
const CONT_GRANDES: Record<number, number> = {
  1000: 10000,
  5000: 50000,
  10000: 100000,
  50000: 1000000,
  100000: 1000000,
  1000000: 10000000,
  10000000: 100000000,
};

const CONT_OBJ: Record<number, string> = {
  1: '🍎',
  2: '🧦',
  3: '🍭',
  5: '✋',
  10: '✏️',
  20: '⚽',
  50: '🎈',
  100: '⭐',
};

// Formato colombiano de números (con punto de miles)
function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ConteoModal5to({ isOpen, onClose }: ConteoModal5toProps) {
  const [step, setStep] = useState<number>(2);
  const [jumpCount, setJumpCount] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Toca "Saltar" o los números del tablero');
  const [isAutoCounting, setIsAutoCounting] = useState<boolean>(false);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());

  // Estado del juego "¿Qué número sigue?"
  const [juegoActive, setJuegoActive] = useState<boolean>(false);
  const [juegoSerie, setJuegoSerie] = useState<number[]>([]);
  const [juegoAnswer, setJuegoAnswer] = useState<number>(0);
  const [juegoOpts, setJuegoOpts] = useState<number[]>([]);
  const [juegoSelected, setJuegoSelected] = useState<number | null>(null);

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cálculos de paso y saltos N
  const isGrande = Boolean(CONT_GRANDES[step]);
  const N = isGrande ? Math.min(10, Math.floor(CONT_GRANDES[step] / step)) : 10;
  const dx = 600 / N;

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

  const playAcierto = () => {
    playTono(600);
    setTimeout(() => playTono(800), 120);
  };

  const playError = () => {
    playTono(280);
    setTimeout(() => playTono(220), 120);
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

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const handleSelectStep = (newStep: number) => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setIsAutoCounting(false);
    setStep(newStep);
    setJumpCount(0);
    setClickedNumbers(new Set());
    setJuegoActive(false);
    setStatusMsg('Toca "Saltar" o los números del tablero');
    playTono(480);
  };

  // Realizar un salto de la rana
  const handleSalto = (customJumpCount?: number) => {
    setJumpCount((prev) => {
      const next = typeof customJumpCount === 'number' ? customJumpCount : (prev >= N ? 1 : prev + 1);
      const val = step * next;
      setStatusMsg(`${fmt(step)} × ${next} = ${fmt(val)}`);
      hablar(String(val));
      playTono(520 + next * 20);
      return next;
    });
  };

  // Modo auto-conteo
  const handleAutoCount = () => {
    if (isAutoCounting) {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
      setIsAutoCounting(false);
      return;
    }

    setIsAutoCounting(true);
    let cur = 0;
    setJumpCount(0);
    handleSalto(1);
    cur = 1;

    autoTimerRef.current = setInterval(() => {
      cur += 1;
      if (cur > N) {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
        setIsAutoCounting(false);
        return;
      }
      handleSalto(cur);
    }, 900);
  };

  // Clic en números del tablero
  const handleNumberClick = (n: number) => {
    setClickedNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

    const isMultiple = n % step === 0;
    if (isMultiple) {
      setStatusMsg(`✅ ${fmt(n)} está en el conteo de ${fmt(step)} en ${fmt(step)}`);
      playTono(650);
    } else {
      setStatusMsg(`❌ ${fmt(n)} no está: ${fmt(n)} ÷ ${fmt(step)} no es exacta`);
      playTono(320);
    }
  };

  // Iniciar mini-juego "¿Qué número sigue?"
  const handleStartJuego = () => {
    const a = 1 + Math.floor(Math.random() * 10);
    const serie = [a * step, (a + 1) * step, (a + 2) * step];
    const answer = (a + 3) * step;

    const rawOpts = [
      answer,
      answer + step,
      Math.max(1, answer - step),
      answer + Math.max(1, Math.round(step / 2)),
    ];
    const uniqueOpts = Array.from(new Set(rawOpts)).sort(() => Math.random() - 0.5);

    setJuegoSerie(serie);
    setJuegoAnswer(answer);
    setJuegoOpts(uniqueOpts);
    setJuegoSelected(null);
    setJuegoActive(true);
    playTono(580);
  };

  const handleSelectOption = (opt: number) => {
    if (juegoSelected !== null) return;
    setJuegoSelected(opt);
    const isCorrect = opt === juegoAnswer;
    if (isCorrect) {
      playAcierto();
      hablar('¡Muy bien!');
      setTimeout(() => {
        handleStartJuego();
      }, 1100);
    } else {
      playError();
      setTimeout(() => {
        setJuegoSelected(null);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  // Cálculos para imágenes
  const T = Math.min(100, Math.max(20, step * 10));
  const ob = CONT_OBJ[step] || '🍎';
  const cols = step >= 10 ? 10 : Math.min(10, step * Math.max(1, Math.floor(10 / step)));

  // Pills pequeñas (1 a 100)
  const smallPills = [
    { s: 1, c: '#7C3AED' },
    { s: 2, c: '#6D28D9' },
    { s: 3, c: '#4F46E5' },
    { s: 5, c: '#0EA5E9' },
    { s: 10, c: '#0891B2' },
    { s: 20, c: '#16876A' },
    { s: 50, c: '#E8650A' },
    { s: 100, c: '#BE185D' },
  ];

  // Pills grandes (exactas de la imagen 2)
  const bigPills = [
    { s: 1000, c: '#1E40AF', hasta: 10000 },
    { s: 5000, c: '#0F766E', hasta: 50000 },
    { s: 10000, c: '#B45309', hasta: 100000 },
    { s: 50000, c: '#9D174D', hasta: 1000000 },
    { s: 100000, c: '#3D1468', hasta: 1000000 },
    { s: 1000000, c: '#0891B2', hasta: 10000000 },
    { s: 10000000, c: '#92400E', hasta: 100000000 },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 16px;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #5C21A6, #8B3EDB);
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
        }
        .t5-pill {
          border: none;
          border-radius: 14px;
          padding: 9px 14px;
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
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        }
        .t5-card {
          background: #FFFFFF;
          border: 2px solid #E4DCFA;
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 10px;
        }
        .t5-100 {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 3px;
          max-width: 430px;
          margin: 10px auto;
        }
        .t5-100 span {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: #FFFFFF;
          border: 1.5px solid #E4DCFA;
          font-weight: 900;
          font-size: 13px;
          color: #6B5E8A;
          transition: all .25s;
          cursor: pointer;
        }
        .t5-100 span:hover {
          border-color: #5C21A6;
          transform: scale(1.08);
        }
        .t5-100 span.on {
          background: linear-gradient(135deg, #FFB547, #FF8C2A) !important;
          color: #fff !important;
          border-color: #E8650A !important;
          transform: scale(1.08);
        }
        .fz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }
        .fz-chip {
          min-width: 44px;
          padding: 6px 12px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 2px solid #D9CCFF;
          font-weight: 900;
          font-size: 13px;
          text-align: center;
          color: #5C21A6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
      `}</style>

      {/* Main Modal Box */}
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-100">
          <h2
            className="text-2xl font-black text-[#5C21A6] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span>🔢</span>
            <span>Tablas de Conteo</span>
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Banner Hero */}
          <div className="t5-hero">
            <h3>🔢 Contar de salto en salto</h3>
            <p>Elige de cuánto en cuánto quieres contar y mira cómo salta la rana.</p>
          </div>

          {/* Grupo 1: Con imágenes (hasta 100) */}
          <div style={{ fontWeight: 900, color: '#3D1468', fontSize: '13px', marginTop: '4px' }}>
            🖼️ Con imágenes (hasta 100)
          </div>
          <div className="t5-pills">
            {smallPills.map((p) => {
              const active = step === p.s;
              return (
                <button
                  key={p.s}
                  type="button"
                  id={`t5c${p.s}`}
                  onClick={() => handleSelectStep(p.s)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: p.c }}
                >
                  De {p.s} en {p.s}
                </button>
              );
            })}
          </div>

          {/* Grupo 2: Números grandes (sin imágenes) */}
          <div style={{ fontWeight: 900, color: '#3D1468', fontSize: '13px', marginTop: '6px' }}>
            🔢 Números grandes (sin imágenes)
          </div>
          <div className="t5-pills">
            {bigPills.map((p) => {
              const active = step === p.s;
              return (
                <button
                  key={p.s}
                  type="button"
                  id={`t5c${p.s}`}
                  onClick={() => handleSelectStep(p.s)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: p.c }}
                >
                  De {fmt(p.s)} en {fmt(p.s)} hasta {fmt(p.hasta)}
                </button>
              );
            })}
          </div>

          {/* Tarjeta 1: Recta numérica con la rana 🐸 */}
          <div className="t5-card" style={{ marginBottom: 10, background: '#FFFFFF' }}>
            <svg viewBox="0 0 640 120" width="100%" id="t5cSvg" className="overflow-visible select-none">
              <line x1="20" y1="85" x2="620" y2="85" stroke="#3D1468" strokeWidth="3" />
              {Array.from({ length: N + 1 }).map((_, i) => {
                const x = 20 + i * dx;
                const isReached = i <= jumpCount;
                const labelText = i === 0 ? '0' : isReached ? fmt(step * i) : '';
                return (
                  <g key={i}>
                    <line x1={x} y1="77" x2={x} y2="93" stroke="#3D1468" strokeWidth="2" />
                    <text
                      x={x}
                      y={N > 10 && i % 2 !== 0 ? 104 : 114}
                      fontSize={N > 10 ? 10 : 13}
                      fontWeight="900"
                      textAnchor="middle"
                      fill="#3D1468"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}

              {/* Arcos de los saltos */}
              <g id="t5cJ">
                {Array.from({ length: jumpCount }).map((_, j) => {
                  const x0 = 20 + j * dx;
                  const x1 = x0 + dx;
                  const midX = x0 + dx / 2;
                  return (
                    <g key={j} className="animate-fadeIn">
                      <path
                        d={`M ${x0} 77 Q ${midX} 20 ${x1} 77`}
                        stroke="#16876A"
                        strokeWidth="3"
                        fill="none"
                      />
                      {N <= 10 && (
                        <text
                          x={midX}
                          y="32"
                          fontSize="12"
                          fontWeight="900"
                          textAnchor="middle"
                          fill="#16876A"
                        >
                          +{fmt(step)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Rana */}
              <text
                id="t5cFrog"
                x={20 + jumpCount * dx}
                y="70"
                fontSize="30"
                textAnchor="middle"
                className="transition-all duration-300"
              >
                🐸
              </text>
            </svg>
          </div>

          {/* Tarjeta 2: Cuenta con imágenes (si no es número grande) */}
          {!isGrande ? (
            <div className="t5-card" style={{ marginBottom: 10, background: '#FFFFFF' }}>
              <div style={{ fontWeight: 900, color: '#3D1468', marginBottom: 6 }}>
                🖼️ Cuenta con imágenes: cada imagen tiene su número
              </div>
              <div
                id="t5cImg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: '4px',
                  maxHeight: '190px',
                  overflowY: 'auto',
                }}
              >
                {Array.from({ length: T }).map((_, i) => {
                  const num = i + 1;
                  const isMultiple = num % step === 0;
                  const isReached = num <= step * jumpCount;
                  return (
                    <div
                      key={num}
                      style={{
                        padding: '4px',
                        background: isMultiple
                          ? isReached
                            ? '#FFE066'
                            : '#FFF7D6'
                          : '#FFFFFF',
                        border: isMultiple ? '2px solid #F5A524' : '1px solid #E4DCFA',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 900,
                        color: isMultiple ? '#7A3200' : '#8B80AA',
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>{ob}</div>
                      <div>{num}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Tarjeta 3: Controles interactivos y tabla del 1 al 100 */}
          <div className="t5-card" style={{ marginBottom: 10, background: '#FFFFFF' }}>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <button
                type="button"
                id="t5cJump"
                onClick={() => handleSalto()}
                className="px-4 py-2 bg-[#5C21A6] hover:bg-[#4C198A] text-white font-black text-sm rounded-xl shadow cursor-pointer transition-transform active:scale-95"
              >
                🐸 ¡Saltar!
              </button>
              <button
                type="button"
                id="t5cAuto"
                onClick={handleAutoCount}
                className={`px-4 py-2 font-black text-sm rounded-xl shadow cursor-pointer transition-transform active:scale-95 text-white ${
                  isAutoCounting ? 'bg-[#DC2626]' : 'bg-[#16876A] hover:bg-[#126B54]'
                }`}
              >
                {isAutoCounting ? '⏹ Parar' : '▶ Contar solo'}
              </button>
              <button
                type="button"
                id="t5cReset"
                onClick={() => {
                  if (autoTimerRef.current) clearInterval(autoTimerRef.current);
                  setIsAutoCounting(false);
                  setJumpCount(0);
                  setClickedNumbers(new Set());
                  setStatusMsg('Reiniciado');
                  playTono(380);
                }}
                className="px-4 py-2 bg-white border-2 border-[#C5BFEE] hover:bg-[#F8F5FF] text-[#5C21A6] font-black text-sm rounded-xl cursor-pointer"
              >
                🔄 Reiniciar
              </button>
              <button
                type="button"
                id="t5cPlay"
                onClick={handleStartJuego}
                className="px-4 py-2 bg-[#FF8C2A] hover:bg-[#E8650A] text-white font-black text-sm rounded-xl shadow cursor-pointer ml-auto"
              >
                🎮 ¿Qué número sigue?
              </button>
            </div>

            {/* Barra de estado con mensaje */}
            <div
              id="t5cStatus"
              className="p-3 bg-[#F8F5FF] border border-[#D9CCFF] rounded-xl text-center font-black text-sm text-[#3D1468]"
            >
              {statusMsg}
            </div>

            {/* Tablero del 1 al 100 si no es número grande */}
            {!isGrande && (
              <div className="mt-3">
                <div className="text-center font-extrabold text-xs text-[#6B5E8A] mb-1">
                  Toca cualquier número para ver si pertenece a la tabla del {step}:
                </div>
                <div id="t5c100" className="t5-100">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const n = i + 1;
                    const isJumpTarget = n <= step * jumpCount && n % step === 0;
                    const isUserClicked = clickedNumbers.has(n);
                    const on = isJumpTarget || isUserClicked;
                    return (
                      <span
                        key={n}
                        onClick={() => handleNumberClick(n)}
                        className={on ? 'on' : ''}
                      >
                        {n}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chips con múltiplos en números grandes */}
            {isGrande && (
              <div className="mt-3 text-center">
                <div className="font-extrabold text-xs text-[#6B5E8A] mb-1">
                  Múltiplos de {fmt(step)} alcanzados:
                </div>
                <div className="fz-chips">
                  {Array.from({ length: N }).map((_, i) => {
                    const val = step * (i + 1);
                    const reached = i < jumpCount;
                    return (
                      <span
                        key={i}
                        className="fz-chip"
                        style={{
                          background: reached ? '#FFE066' : '#FFFFFF',
                          borderColor: reached ? '#F5A524' : '#D9CCFF',
                          color: reached ? '#7A3200' : '#5C21A6',
                          transform: reached ? 'scale(1.05)' : 'none',
                        }}
                      >
                        {fmt(val)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mini-juego interactivo "¿Qué número sigue?" */}
          {juegoActive && (
            <div className="t5-card bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300">
              <div className="text-center font-black text-base text-orange-950 mb-2">
                🎮 ¿Qué número sigue en la secuencia?
              </div>
              <div className="flex justify-center items-center gap-3 font-black text-2xl text-[#2A0F60] my-2">
                {juegoSerie.map((num, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-xl shadow-xs border border-purple-200">
                    {fmt(num)}
                  </span>
                ))}
                <span className="text-orange-600 animate-pulse font-black">❓</span>
              </div>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {juegoOpts.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="px-5 py-2.5 rounded-xl font-black text-base cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-white border-2 border-orange-400 text-orange-900 shadow-sm"
                  >
                    {fmt(opt)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
