'use client';

import React, { useState, useEffect } from 'react';
import { FZ } from './fedor-visual-lab-engine';

interface ConceptoModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ConceptoItem {
  id: string;
  t: string;
  txt: string;
  ej: string;
  q: string;
}

// ── 13 Conceptos Matemáticos del HTML original ──
export const CONCEPTOS_4TO: ConceptoItem[] = [
  {
    id: 'divisor',
    t: 'Divisor',
    txt: 'Un divisor es un número que divide a otro sin dejar residuo.',
    ej: '12 ÷ 3 = 4 (residuo 0) → 3 es divisor de 12',
    q: '¿Es 12 divisible por 3?',
  },
  {
    id: 'primo',
    t: 'Número Primo',
    txt: 'Tiene solo 2 divisores: 1 y él mismo.',
    ej: '7 → divisores: {1, 7} ✓ primo',
    q: '¿El número 7 es PRIMO o COMPUESTO?',
  },
  {
    id: 'mcd',
    t: 'MCD',
    txt: 'Máximo Común Divisor: el mayor divisor común entre dos números.',
    ej: 'MCD(12, 18) = 6',
    q: '¿Cuál es el MCD de 12 y 18?',
  },
  {
    id: 'mcm',
    t: 'MCM',
    txt: 'Mínimo Común Múltiplo: el menor múltiplo común entre dos números.',
    ej: 'MCM(4, 6) = 12',
    q: '¿Cuál es el MCM de 4 y 6?',
  },
  {
    id: 'frac_homog',
    t: 'Fracción Homogénea',
    txt: 'Tiene el mismo denominador.',
    ej: '3/7 + 2/7 = 5/7',
    q: '3/7 + 2/7 = ?',
  },
  {
    id: 'frac_heter',
    t: 'Fracción Heterogénea',
    txt: 'Tiene distinto denominador. Usa MCM.',
    ej: '1/2 + 1/3 = 3/6 + 2/6 = 5/6',
    q: '1/2 + 1/3 = ?',
  },
  {
    id: 'simpl_frac',
    t: 'Simplificar Fracción',
    txt: 'Dividir numerador y denominador entre su MCD.',
    ej: '6/8 → MCD=2 → 3/4',
    q: 'Simplifica la fracción 6/8 a su mínima expresión.',
  },
  {
    id: 'perimetro',
    t: 'Perímetro',
    txt: 'Suma de todos los lados de una figura.',
    ej: 'Cuadrado L=5m → P = 4×5 = 20m',
    q: '¿Cuál es el perímetro de un cuadrado cuyo lado mide 5 m?',
  },
  {
    id: 'area',
    t: 'Área',
    txt: 'Superficie interior de una figura.',
    ej: 'Rectángulo 6×4 → A = 24 m²',
    q: 'Calcula el área (en m²) de un rectángulo de 6 m × 4 m.',
  },
  {
    id: 'volumen',
    t: 'Volumen',
    txt: 'Espacio 3D. V = L × A × H.',
    ej: 'Cubo L=3 → V = 27 m³',
    q: '¿Cuál es el volumen de un cubo cuyo lado mide 3 m?',
  },
  {
    id: 'potencia',
    t: 'Potencia',
    txt: 'a^n = a × a × ... × a (n veces).',
    ej: '2³ = 2×2×2 = 8',
    q: 'Calcula: 2^3 = ?',
  },
  {
    id: 'raiz',
    t: 'Raíz Cuadrada',
    txt: '√n es el número que × sí mismo = n.',
    ej: '√25 = 5 (5×5=25)',
    q: 'Calcula: √25 = ?',
  },
  {
    id: 'probabilidad',
    t: 'Probabilidad',
    txt: 'P = casos favorables / casos posibles.',
    ej: 'P(sacar 3 en dado) = 1/6',
    q: '¿Cuál es la probabilidad de sacar el 3 al lanzar un dado de 6 caras?',
  },
];

export default function ConceptoModal4to({ isOpen, onClose }: ConceptoModal4toProps) {
  // Inicializar en MCD (índice 2, coincidente con la fórmula del día de octubre y la imagen de referencia)
  const [conceptIdx, setConceptIdx] = useState<number>(() => {
    try {
      const d = new Date();
      const calculated = (d.getDate() + d.getMonth() * 31) % CONCEPTOS_4TO.length;
      return calculated >= 0 && calculated < CONCEPTOS_4TO.length ? calculated : 2;
    } catch {
      return 2; // MCD por defecto
    }
  });

  const [demoHtml, setDemoHtml] = useState<string>('');

  // Helpers de Audio & SpeechSynthesis
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

  const currentConcept = CONCEPTOS_4TO[conceptIdx] || CONCEPTOS_4TO[2];

  // Sincronizar manipulativo con el motor pedagógico FZ
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      (window as any).FZ = FZ;
      (window as any).fedor5Hablar = hablar;
      (window as any).fedor5Tono = playTono;
      (window as any).hablar = hablar;
      (window as any).tono = playTono;

      const html = FZ.crear ? FZ.crear({ q: currentConcept.q, ctx: '' }, 'ej') : '';
      setDemoHtml(html || '');
    }
  }, [currentConcept, isOpen]);

  const handleEscuchar = () => {
    playTono(600);
    hablar(`${currentConcept.t}. ${currentConcept.txt} Ejemplo: ${currentConcept.ej}`);
  };

  const handleCambiar = (delta: number) => {
    playTono(520);
    setConceptIdx((prev) => (prev + delta + CONCEPTOS_4TO.length) % CONCEPTOS_4TO.length);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      {/* Estilos del Motor FZ y del Popup idénticos a public/cuarto/MatematicasDeFedor_4°.html */}
      <style>{`
        .t5-hero-blue {
          border-radius: 20px;
          padding: 16px 20px;
          color: #fff;
          margin-bottom: 14px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1E40AF, #3B82F6);
          box-shadow: 0 6px 18px rgba(30, 64, 175, 0.25);
        }
        .t5-hero-blue h3 {
          font-family: 'Baloo 2', sans-serif;
          font-size: 22px;
          margin: 0 0 4px;
          color: #fff;
          font-weight: 900;
        }
        .t5-hero-blue p {
          margin: 0;
          font-weight: 700;
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.95) !important;
          line-height: 1.4;
        }
        .t5-hero-pill {
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 12px;
          padding: 8px 14px;
          font-weight: 900;
          color: #fff;
          font-size: 14.5px;
          display: inline-block;
          width: 100%;
        }
        .fz {
          margin: 10px 0 14px;
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
          padding: 10px 14px;
          background: linear-gradient(90deg, #16876A, #24C496);
          color: #fff;
        }
        .fz-h .t {
          flex: 1;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 16px;
          color: #fff;
        }
        .fz-h .t small {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 12px;
          opacity: .9;
          margin-left: 8px;
          color: #fff;
        }
        .fz-h button {
          background: rgba(255, 255, 255, 0.2);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          color: #fff;
          border-radius: 10px;
          padding: 3px 12px;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: background .15s;
        }
        .fz-h button:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .fz-b {
          padding: 14px 16px;
          overflow-x: auto;
        }
        .fz.min .fz-b, .fz.min .fz-f {
          display: none;
        }
        .fz-rowlab {
          font-weight: 900;
          font-size: 15px;
          color: #3D1468;
          min-width: 85px;
        }
        .fz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .fz-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
          height: 38px;
          padding: 4px 12px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 2px solid #D9CCFF;
          font-weight: 900;
          font-size: 15px;
          color: #3D1468;
          cursor: pointer;
          transition: all .15s ease;
        }
        .fz-chip:hover {
          transform: scale(1.05);
          border-color: #A78BFA;
        }
        .fz-chip.on {
          background: #FFE066 !important;
          border-color: #E8650A !important;
          color: #3D1468 !important;
          transform: scale(1.08);
        }
        .fz-chip.cm {
          background: #6EE7B7 !important;
          border-color: #16876A !important;
          color: #064E3B !important;
          font-weight: 900;
        }
        .fz-tip {
          font-size: 13px;
          font-weight: 800;
          color: #6B5E8A;
          margin-top: 10px;
        }
        .fz-f {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 16px 16px;
          align-items: center;
        }
        .fz-btn {
          border: none;
          border-radius: 14px;
          padding: 10px 18px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          color: #fff;
          transition: transform .12s, box-shadow .12s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .fz-btn:hover {
          transform: translateY(-2px);
        }
        .fz-btn.g {
          background: linear-gradient(135deg, #16876A, #24C496);
          box-shadow: 0 4px 12px rgba(22, 135, 106, 0.3);
        }
        .fz-btn.b {
          background: linear-gradient(135deg, #0284C7, #38BDF8);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        .fz-btn.o {
          background: linear-gradient(135deg, #FF8C2A, #E8650A);
          box-shadow: 0 4px 12px rgba(232, 101, 10, 0.3);
        }
        .fz-msg {
          font-weight: 900;
          font-size: 14px;
          color: #3D1468;
          padding: 10px 16px;
          background: #FFFFFF;
          border-radius: 14px;
          border: 2px dashed #C5BFEE;
          width: 100%;
          margin-top: 8px;
          display: block;
        }
      `}</style>

      {/* Tarjeta Modal Principal con bordes redondeados y espaciado generoso */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal (Idéntico a la imagen de referencia) */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📘</span>
            <h2
              className="text-2xl font-black text-[#3D1468]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Concepto del Día
            </h2>
          </div>
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
          {/* Tarjeta Hero Azul: Concepto y Definición */}
          <div className="t5-hero-blue">
            <div className="flex items-center justify-between">
              <h3>📘 {currentConcept.t}</h3>
              {/* Navegador sutil entre conceptos */}
              <div className="flex items-center gap-1.5 opacity-90">
                <button
                  type="button"
                  onClick={() => handleCambiar(-1)}
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/35 text-white font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                  title="Concepto anterior"
                >
                  ◀
                </button>
                <span className="text-xs font-bold text-white px-1">
                  {conceptIdx + 1}/{CONCEPTOS_4TO.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleCambiar(1)}
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/35 text-white font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                  title="Concepto siguiente"
                >
                  ▶
                </button>
              </div>
            </div>
            <p>{currentConcept.txt}</p>
            <div className="t5-hero-pill">
              <span>✏️ {currentConcept.ej}</span>
            </div>
          </div>

          {/* Manipulativo Pedagógico Interactivo FZ (MCD, Primos, etc.) */}
          {demoHtml && (
            <div
              className="w-full animate-fadeIn"
              dangerouslySetInnerHTML={{ __html: demoHtml }}
            />
          )}

          {/* Botón Inferior Centrado: Escuchar el concepto */}
          <div className="flex justify-center mt-3 pt-1">
            <button
              type="button"
              onClick={handleEscuchar}
              className="fz-btn o text-sm sm:text-base px-6 py-2.5 rounded-2xl shadow-lg"
            >
              <span>🔊</span>
              <span>Escuchar el concepto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
