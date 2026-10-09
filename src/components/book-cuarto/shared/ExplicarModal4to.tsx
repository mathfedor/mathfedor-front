'use client';

import React, { useState, useEffect } from 'react';
import { FZ } from './fedor-visual-lab-engine';

interface ExplicarModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── 24 Explicaciones completas del HTML original ──
const EXP_OPS = [
  {
    t: 'Adición (suma)',
    txt: 'Sumar es juntar dos o más cantidades en una sola. Los números que se suman se llaman sumandos y el resultado se llama suma o total. Se suma columna por columna, empezando por las unidades.',
  },
  {
    t: 'Sustracción (resta)',
    txt: 'Restar es quitar una cantidad de otra. Minuendo − sustraendo = diferencia. Se resta columna por columna, empezando por las unidades; si arriba hay menos, se pide prestado a la columna de la izquierda.',
  },
  {
    t: 'Multiplicación',
    txt: 'Multiplicar es sumar varias veces el mismo número. Los números que se multiplican se llaman factores y el resultado se llama producto. 6 × 4 es 6 filas de 4.',
  },
  {
    t: 'División',
    txt: 'Dividir es repartir en partes iguales. Dividendo ÷ divisor = cociente, y lo que sobra se llama residuo. El residuo siempre es menor que el divisor.',
  },
  {
    t: 'Suma con llevada',
    txt: 'Cuando sumas y una columna pasa de 10, escribes las unidades y llevas 1 a la siguiente columna.',
  },
  {
    t: 'Resta con préstamo',
    txt: 'Si el número de arriba es menor que el de abajo, pides prestado 10 a la columna izquierda.',
  },
  {
    t: 'Tabla del 9',
    txt: 'Truco: en la tabla del 9, los dígitos siempre suman 9. Ejemplo: 9×3=27, 2+7=9.',
  },
  {
    t: 'Divisores',
    txt: 'Los divisores de un número son los que lo dividen exactamente sin dejar residuo.',
  },
  {
    t: 'Números primos',
    txt: 'Un número primo tiene solo 2 divisores: el 1 y él mismo. Ejemplo: 2, 3, 5, 7, 11.',
  },
  {
    t: 'MCD',
    txt: 'El Máximo Común Divisor es el mayor número que divide a dos o más de forma exacta.',
  },
  {
    t: 'MCM',
    txt: 'El Mínimo Común Múltiplo es el menor múltiplo común de dos o más números.',
  },
  {
    t: 'Fracción propia',
    txt: 'Es aquella cuyo numerador es menor que el denominador. Ejemplo: 3/4.',
  },
  {
    t: 'Simplificar fracciones',
    txt: 'Divide numerador y denominador entre su MCD. 6/8 = 3/4.',
  },
  {
    t: 'Fracciones homogéneas',
    txt: 'Tienen el mismo denominador. Se suman o restan solo los numeradores.',
  },
  {
    t: 'Fracciones heterogéneas',
    txt: 'Tienen distinto denominador. Primero se busca el MCM para igualarlos.',
  },
  {
    t: 'Multiplicar fracciones',
    txt: 'Numerador × numerador, denominador × denominador. 2/3 × 4/5 = 8/15.',
  },
  {
    t: 'Dividir fracciones',
    txt: 'Se multiplica la primera por el inverso de la segunda. 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.',
  },
  {
    t: 'Sistema Métrico',
    txt: 'Para pasar a unidad menor, multiplica por 10. Para pasar a unidad mayor, divide por 10.',
  },
  {
    t: 'Perímetro',
    txt: 'Es la suma de todos los lados de una figura. En un cuadrado: P = 4 × L.',
  },
  {
    t: 'Área rectángulo',
    txt: 'Se calcula multiplicando base por altura. A = b × h.',
  },
  {
    t: 'Volumen prisma',
    txt: 'Se calcula multiplicando largo × ancho × alto. V = L × A × H.',
  },
  {
    t: 'Potencia',
    txt: 'Es la multiplicación repetida de un mismo número. 2^3 = 2 × 2 × 2 = 8.',
  },
  {
    t: 'Raíz cuadrada',
    txt: 'Es la operación inversa de elevar al cuadrado. √25 = 5 porque 5×5=25.',
  },
  {
    t: 'Probabilidad',
    txt: 'Es la posibilidad de que ocurra un evento. P = casos favorables / casos posibles.',
  },
];

// ── Ejercicios interactivos vinculados a cada explicación ──
const DEMO_OPS = [
  '345 + 278 = ?',
  '532 - 247 = ?',
  '6 × 4 = ?',
  'Se reparten 23 dulces entre 4 niños',
];

const DEMO_EXP = [
  '234 + 567 = ?',
  '800 - 235 = ?',
  '9 × 3 = ?',
  '¿Es 12 divisible por 3?',
  '¿El número 7 es PRIMO o COMPUESTO?',
  '¿Cuál es el MCD de 12 y 18?',
  '¿Cuál es el MCM de 4 y 6?',
  'Escribe 3/4 como número decimal.',
  'Simplifica la fracción 6/8 a su mínima expresión.',
  '3/7 + 2/7 = ?',
  '1/2 + 1/3 = ?',
  '2/3 × 4/5 = ?',
  '2/3 ÷ 4/5 = ?',
  '¿A cuántos cm equivalen 3 m?',
  '¿Cuál es el perímetro de un cuadrado cuyo lado mide 5 m?',
  'Calcula el área (en m²) de un rectángulo de 6 m × 4 m.',
  'Calcula el volumen (en m³) de un prisma de 3 m × 3 m × 3 m.',
  'Calcula: 2^3 = ?',
  'Calcula: √25 = ?',
  '¿Cuál es la probabilidad de sacar el 3 al lanzar un dado de 6 caras?',
];

function getDemoQuery(index: number): string {
  if (index < DEMO_OPS.length) {
    return DEMO_OPS[index];
  }
  return DEMO_EXP[index - DEMO_OPS.length] || '';
}

export default function ExplicarModal4to({ isOpen, onClose }: ExplicarModal4toProps) {
  const [expi, setExpi] = useState<number>(0);
  const [demoHtml, setDemoHtml] = useState<string>('');

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

  // Sincronizar motor interactivo FZ y HTML del ejercicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).FZ = FZ;
      (window as any).fedor5Hablar = hablar;
      (window as any).fedor5Tono = playTono;

      const q = getDemoQuery(expi);
      const html = FZ.crear ? FZ.crear({ q, ctx: '' }, 'ej') : '';
      setDemoHtml(html || '');
    }
  }, [expi]);

  const handleIrA = (newIdx: number) => {
    setExpi(newIdx);
    playTono(540);
  };

  const handleAnterior = () => {
    const prev = (expi - 1 + EXP_OPS.length) % EXP_OPS.length;
    handleIrA(prev);
  };

  const handleSiguiente = () => {
    const next = (expi + 1) % EXP_OPS.length;
    handleIrA(next);
  };

  const handleEscuchar = () => {
    const item = EXP_OPS[expi];
    hablar(`${item.t}. ${item.txt}`);
  };

  if (!isOpen) return null;

  const current = EXP_OPS[expi];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Estilos del Motor FZ y Explicaciones del HTML original */}
      <style>{`
        .t5-hero {
          border-radius: 18px;
          padding: 14px 18px;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #3D1468, #7C3AED);
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
        .t5-dots {
          display: flex;
          gap: 5px;
          justify-content: center;
          margin: 8px 0;
          flex-wrap: wrap;
          align-items: center;
        }
        .t5-dots i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #D9CCFF;
          cursor: pointer;
          display: inline-block;
          transition: all .2s;
        }
        .t5-dots i.on {
          background: #5C21A6;
          width: 22px;
          border-radius: 5px;
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
          background: linear-gradient(135deg, #5C21A6, #8B3EDB);
          box-shadow: 0 3px 10px rgba(92, 33, 166, 0.3);
          transition: transform .12s, box-shadow .12s;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
          box-shadow: 0 3px 10px rgba(232, 101, 10, 0.3);
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496);
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0E6BA8, #38BDF8);
        }
        .fz-btn.w {
          background: #FFFFFF;
          color: #5C21A6 !important;
          border: 2px solid #C5BFEE;
          box-shadow: none;
        }
        .fz {
          margin: 10px 0 12px;
          border-radius: 20px;
          background: linear-gradient(160deg, #F8F5FF, #EEF7FF);
          border: 2.5px solid #D9CCFF;
          box-shadow: 0 8px 22px rgba(60, 20, 120, 0.10);
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          color: #1A1033;
          text-align: left;
        }
        .fz-h {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: linear-gradient(90deg, #5C21A6, #8B3EDB);
          color: #fff;
        }
        .fz-h .t {
          flex: 1;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 15px;
          color: #fff;
        }
        .fz-h .t small {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 11px;
          opacity: .85;
          margin-left: 6px;
          color: #fff;
        }
        .fz-h button {
          background: rgba(255, 255, 255, 0.2);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          color: #fff;
          border-radius: 10px;
          padding: 3px 10px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
        }
        .fz-b {
          padding: 12px;
          overflow-x: auto;
        }
        .fz.min .fz-b, .fz.min .fz-f {
          display: none;
        }
        .fz-f {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 12px 12px;
          align-items: center;
        }
        .fz-col {
          border-collapse: separate;
          border-spacing: 4px;
          margin: 0 auto;
        }
        .fz-col th {
          font-size: 12px;
          font-weight: 900;
          color: #fff;
          border-radius: 8px;
          padding: 4px 6px;
          width: 44px;
          min-width: 40px;
        }
        .fz-col td {
          width: 44px;
          height: 44px;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #1A1033;
          border-radius: 10px;
          background: #FFFFFF;
          border: 2px solid #EEE8FB;
        }
        .fz-col td.op {
          background: transparent;
          border: none;
          color: #E8650A;
        }
        .fz-col td.nb {
          background: transparent;
          border: none;
        }
        .fz-col td.cm {
          width: 14px;
          background: transparent;
          border: none;
          font-size: 30px;
          color: #C94B22;
        }
        .fz-col tr.cr td {
          height: 28px;
          font-size: 15px;
          background: transparent;
          border: none;
        }
        .fz-col input {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #16876A;
          outline: none;
        }
        .fz-col tr.cr input {
          font-size: 15px;
          color: #C94B22;
        }
        .fz-col tr.rs td {
          background: #FFFBEA;
          border: 2.5px dashed #F5C518;
        }
        .fz-col tr.rs td.op, .fz-col tr.rs td.cm {
          background: transparent;
          border: none;
        }
        .fz-col tr.ln td {
          height: 4px;
          background: #1A1033;
          border: none;
          border-radius: 2px;
          padding: 0;
        }
        .fz-col td.hl {
          background: #FFE066 !important;
          transform: scale(1.08);
          transition: all .2s;
        }
        .fz-msg {
          font-weight: 900;
          font-size: 14px;
          color: #3D1468;
          padding: 8px 12px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 2px dashed #C5BFEE;
          min-height: 20px;
          margin-top: 8px;
        }
        .fz-tip {
          font-size: 12px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 8px;
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
            <span className="text-2xl">💡</span>
            <span>Explicaciones interactivas</span>
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
          {/* Banner Hero Morado */}
          <div className="t5-hero">
            <h3>💡 {current.t}</h3>
            <p>{current.txt}</p>
          </div>

          {/* Fila de 24 puntos de navegación */}
          <div className="t5-dots">
            {EXP_OPS.map((op, idx) => (
              <i
                key={idx}
                className={idx === expi ? 'on' : ''}
                onClick={() => handleIrA(idx)}
                title={`${idx + 1}. ${op.t}`}
              />
            ))}
          </div>

          {/* Tablero / Manipulativo Pedagógico Interactivo de la Lección */}
          {demoHtml && (
            <div
              className="w-full animate-fadeIn"
              dangerouslySetInnerHTML={{ __html: demoHtml }}
            />
          )}

          {/* Botones de Navegación Inferiores (◀ Anterior | 🔊 Escuchar | Siguiente ▶) */}
          <div className="flex items-center gap-2.5 mt-3 pt-1">
            <button
              type="button"
              onClick={handleAnterior}
              className="fz-btn flex-1"
            >
              ◀ Anterior
            </button>
            <button
              type="button"
              onClick={handleEscuchar}
              className="fz-btn o flex-shrink-0"
            >
              🔊 Escuchar
            </button>
            <button
              type="button"
              onClick={handleSiguiente}
              className="fz-btn flex-1"
            >
              Siguiente ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
