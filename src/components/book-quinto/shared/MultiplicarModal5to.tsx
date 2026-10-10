'use client';

import React, { useState } from 'react';

interface MultiplicarModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiplicarModal5to({ isOpen, onClose }: MultiplicarModal5toProps) {
  const [tableNum, setTableNum] = useState<number>(2); // Tabla seleccionada (1 a 12)
  const [multiplier, setMultiplier] = useState<number>(3); // Deslizador/fila (1 a 12)
  const [isPitagoras, setIsPitagoras] = useState<boolean>(false);
  const [pitHover, setPitHover] = useState<{ r: number; c: number } | null>(null);

  // Modo práctica (quiz)
  const [practicing, setPracticing] = useState<boolean>(false);
  const [quizK, setQuizK] = useState<number>(3);
  const [quizOpts, setQuizOpts] = useState<number[]>([]);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

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

  const handleSelectTable = (n: number) => {
    setTableNum(n);
    setMultiplier(3);
    setIsPitagoras(false);
    setPracticing(false);
    playTono(480);
  };

  const handleSliderChange = (k: number) => {
    setMultiplier(k);
    playTono(380 + k * 25);
  };

  // Escuchar toda la tabla con voz
  const handleEscucharTabla = () => {
    const frases: string[] = [];
    for (let i = 1; i <= 10; i++) {
      frases.push(`${tableNum} por ${i}, ${tableNum * i}`);
    }
    hablar(frases.join('. '));
  };

  // Iniciar práctica
  const handleStartPractica = () => {
    const k = 1 + Math.floor(Math.random() * 12);
    const ok = tableNum * k;
    const rawOpts = [
      ok,
      ok + tableNum,
      Math.max(1, ok - tableNum),
      ok + 1,
      ok + 2 * tableNum,
    ];
    const uniqueOpts = Array.from(new Set(rawOpts))
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    setQuizK(k);
    setQuizOpts(uniqueOpts);
    setQuizSelected(null);
    setPracticing(true);
    playTono(540);
  };

  const handleQuizAnswer = (opt: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(opt);
    const ok = tableNum * quizK;
    if (opt === ok) {
      playAcierto();
      hablar('¡Correcto!');
      setTimeout(() => {
        handleStartPractica();
      }, 1100);
    } else {
      playError();
      setTimeout(() => {
        setQuizSelected(null);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  // Tamaño de los círculos en la visualización
  const maxDim = Math.max(tableNum, multiplier);
  const dz = maxDim <= 4 ? 24 : maxDim <= 7 ? 20 : maxDim <= 9 ? 16 : 13;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 18px;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #F97316, #EA580C);
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
          flex-wrap: nowrap;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .t5-pills::-webkit-scrollbar {
          height: 4px;
        }
        .t5-pills::-webkit-scrollbar-thumb {
          background: rgba(108, 40, 180, 0.2);
          border-radius: 4px;
        }
        .t5-pill {
          border: none;
          border-radius: 14px;
          padding: 8px 13px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          transition: transform .12s, box-shadow .12s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .t5-pill:hover {
          transform: translateY(-2px);
        }
        .t5-pill.on {
          outline: 3px solid #FFE066;
          transform: scale(1.06);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        }
        .t5-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: stretch;
          margin-bottom: 12px;
        }
        .t5-card {
          background: #FFFFFF;
          border: 2px solid #E4DCFA;
          border-radius: 18px;
          padding: 16px 20px;
        }
        .t5-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          min-width: 280px;
        }
        .t5-list button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          border-radius: 12px;
          background: #FFF7E6;
          border: 1.5px solid #FBD38D;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          color: #1A1033;
          transition: all .15s;
          min-width: 135px;
        }
        .t5-list button span {
          color: #1A1033;
        }
        .t5-list button:hover {
          border-color: #E8650A;
          transform: scale(1.02);
        }
        .t5-list button.on {
          background: #FF8C2A !important;
          color: #FFFFFF !important;
          border-color: #E8650A !important;
          transform: scale(1.03);
          box-shadow: 0 3px 10px rgba(255, 140, 42, 0.35);
        }
        .t5-list button.on span {
          color: #FFFFFF !important;
        }
        .t5-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 220px;
          height: 6px;
          border-radius: 3px;
          outline: none;
          margin-top: 10px;
          transition: background 0.1s;
        }
        .t5-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0084FF;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 132, 255, 0.45);
          cursor: pointer;
          transition: transform .1s;
        }
        .t5-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
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
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
        }
        .fz-btn.w {
          background: #FFFFFF;
          color: #5C21A6 !important;
          border: 2px solid #C5BFEE;
          box-shadow: none;
        }
        .t5-pit {
          display: grid;
          grid-template-columns: repeat(13, 1fr);
          gap: 2px;
          max-width: 560px;
          margin: 0 auto;
        }
        .t5-pit span {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          border-radius: 5px;
          background: #FFFFFF;
          border: 1px solid #EEE8FB;
          cursor: pointer;
          color: #3D1468;
          transition: all .15s;
        }
        .t5-pit span.h {
          background: #5C21A6 !important;
          color: #fff !important;
        }
        .t5-pit span.r {
          background: #FFE8CC !important;
        }
        .t5-pit span.x {
          background: #FF8C2A !important;
          color: #fff !important;
          transform: scale(1.18);
          z-index: 2;
        }
      `}</style>

      {/* Tarjeta Modal Principal */}
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#3D1468] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span className="text-2xl">✖️</span>
            <span>Tablas de Multiplicar</span>
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

        {/* Cuerpo del Modal */}
        <div className="overflow-y-auto pr-1 flex-1">
          {/* Banner Hero */}
          <div className="t5-hero">
            <h3>✖️ Tablas de multiplicar</h3>
            <p>Mueve la barra y mira cómo crece el arreglo. Multiplicar es sumar filas iguales.</p>
          </div>

          {/* Fila de píldoras ×1 a ×12 */}
          <div className="t5-pills">
            {Array.from({ length: 12 }).map((_, i) => {
              const n = i + 1;
              const active = !isPitagoras && tableNum === n;
              const bg = `hsl(${20 + n * 25}, 75%, 45%)`;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleSelectTable(n)}
                  className={`t5-pill ${active ? 'on' : ''}`}
                  style={{ background: bg }}
                >
                  ×{n}
                </button>
              );
            })}
          </div>

          {/* Botón Tabla Pitagórica */}
          <div style={{ margin: '6px 0 10px 0' }}>
            <button
              type="button"
              onClick={() => {
                setIsPitagoras(true);
                setPracticing(false);
                playTono(420);
              }}
              className={`t5-pill ${isPitagoras ? 'on' : ''}`}
              style={{ background: '#3D1468' }}
            >
              🔲 Tabla pitagórica
            </button>
          </div>

          {/* VISTA 1: Arreglo Visual + Lista de la Tabla (Idéntico a Imagen 3) */}
          {!isPitagoras ? (
            <div>
              <div className="t5-row">
                {/* Tarjeta Izquierda: Visualización Gráfica + Deslizador */}
                <div
                  className="t5-card"
                  style={{
                    textAlign: 'center',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '270px',
                    flex: '1 1 320px',
                  }}
                >
                  {/* Contenedor de puntos arreglados */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '260px',
                      minHeight: '125px',
                      background: '#FFF7E6',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${tableNum}, ${dz}px)`,
                        gap: '6px',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Array.from({ length: multiplier }).map((_, r) =>
                        Array.from({ length: tableNum }).map((_, c) => (
                          <span
                            key={`${r}-${c}`}
                            style={{
                              width: `${dz}px`,
                              height: `${dz}px`,
                              borderRadius: '50%',
                              background: `hsl(${20 + r * 25}, 80%, 55%)`,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Barra deslizadora */}
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={multiplier}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                    className="t5-slider"
                    style={{
                      background: `linear-gradient(to right, #0084FF 0%, #0084FF ${
                        ((multiplier - 1) / 11) * 100
                      }%, #E2E8F0 ${((multiplier - 1) / 11) * 100}%, #E2E8F0 100%)`,
                    }}
                  />

                  {/* Fórmula destacada */}
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#2A0F60',
                      marginTop: '12px',
                      fontFamily: "'Baloo 2', sans-serif",
                    }}
                  >
                    {multiplier} filas de {tableNum} ={' '}
                    <span style={{ color: '#E8650A' }}>{multiplier * tableNum}</span>
                  </div>
                </div>

                {/* Tarjeta Derecha: Lista de las 12 multiplicaciones */}
                <div
                  className="t5-card"
                  style={{
                    flex: '1 1 320px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div className="t5-list">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const k = i + 1;
                      const active = multiplier === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => handleSliderChange(k)}
                          className={active ? 'on' : ''}
                        >
                          <span>
                            {tableNum} × {k}
                          </span>
                          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px' }}>
                            {tableNum * k}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botones de acción inferiores */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={handleStartPractica}
                  className="fz-btn o"
                >
                  🎯 Practicar la tabla del {tableNum}
                </button>
                <button
                  type="button"
                  onClick={handleEscucharTabla}
                  className="fz-btn w"
                >
                  🔊 Escuchar la tabla
                </button>
              </div>

              {/* Modo Práctica interactivo */}
              {practicing && (
                <div
                  className="t5-card"
                  style={{
                    marginTop: '14px',
                    background: '#FFF8F0',
                    border: '2px solid #FBD38D',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '15px', color: '#B45309', marginBottom: '8px' }}>
                    🎯 ¿Cuánto es {tableNum} × {quizK}?
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {quizOpts.map((opt) => {
                      const isSelected = quizSelected === opt;
                      const isOk = opt === tableNum * quizK;
                      let bg = '#FFFFFF';
                      let color = '#3D1468';
                      if (isSelected) {
                        bg = isOk ? '#16876A' : '#DC2626';
                        color = '#FFFFFF';
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleQuizAnswer(opt)}
                          className="fz-btn"
                          style={{
                            background: bg,
                            color: color,
                            border: '2px solid #FBD38D',
                            fontSize: '17px',
                            minWidth: '65px',
                            padding: '8px 16px',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* VISTA 2: Tabla Pitagórica Completa (1 al 12) */
            <div className="t5-card" style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 900, color: '#3D1468', fontSize: '14px', marginBottom: '8px' }}>
                Pasa el mouse o toca una casilla para ver el producto cruzado:
              </div>
              <div className="t5-pit">
                {/* Esquina superior */}
                <span className="h">×</span>
                {Array.from({ length: 12 }).map((_, c) => (
                  <span key={c} className="h">
                    {c + 1}
                  </span>
                ))}

                {/* Filas */}
                {Array.from({ length: 12 }).map((_, r) => {
                  const f = r + 1;
                  return (
                    <React.Fragment key={f}>
                      <span className="h">{f}</span>
                      {Array.from({ length: 12 }).map((_, c) => {
                        const col = c + 1;
                        const val = f * col;
                        const isCross = pitHover?.r === f && pitHover?.c === col;
                        const isRelated = pitHover?.r === f || pitHover?.c === col;
                        let cls = '';
                        if (isCross) cls = 'x';
                        else if (isRelated) cls = 'r';
                        return (
                          <span
                            key={col}
                            className={cls}
                            onMouseEnter={() => setPitHover({ r: f, c: col })}
                            onClick={() => {
                              hablar(`${f} por ${col} es igual a ${val}`);
                              playTono(420 + val * 3);
                            }}
                          >
                            {val}
                          </span>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              {pitHover && (
                <div style={{ fontWeight: 900, color: '#E8650A', fontSize: '16px', marginTop: '10px' }}>
                  {pitHover.r} × {pitHover.c} = {pitHover.r * pitHover.c}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
