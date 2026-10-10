'use client';

import React, { useState, useEffect } from 'react';
import { FZ } from './fedor-visual-lab-engine-5to';

interface ConceptoModal5toProps {
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

// ── 13 Conceptos Matemáticos del HTML original de 5° ──
export const CONCEPTOS_5TO: ConceptoItem[] = [
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
    t: 'MCD (Máximo Común Divisor)',
    txt: 'El mayor divisor común entre dos o más números.',
    ej: 'MCD(12, 18) = 6',
    q: '¿Cuál es el MCD de 12 y 18?',
  },
  {
    id: 'mcm',
    t: 'MCM (Mínimo Común Múltiplo)',
    txt: 'El menor múltiplo común positivo entre dos números.',
    ej: 'MCM(4, 6) = 12',
    q: '¿Cuál es el MCM de 4 y 6?',
  },
  {
    id: 'frac_homog',
    t: 'Fracción Homogénea',
    txt: 'Fracciones que tienen el mismo denominador.',
    ej: '3/7 + 2/7 = 5/7',
    q: '3/7 + 2/7 = ?',
  },
  {
    id: 'frac_heter',
    t: 'Fracción Heterogénea',
    txt: 'Fracciones con distinto denominador. Requieren hallar el MCM.',
    ej: '1/2 + 1/3 = 3/6 + 2/6 = 5/6',
    q: '1/2 + 1/3 = ?',
  },
  {
    id: 'simpl_frac',
    t: 'Simplificar Fracciones',
    txt: 'Dividir numerador y denominador entre su MCD hasta la mínima expresión.',
    ej: '6/8 → MCD=2 → 3/4',
    q: 'Simplifica la fracción 6/8 a su mínima expresión.',
  },
  {
    id: 'perimetro',
    t: 'Perímetro',
    txt: 'Suma de las longitudes de todos los lados de un polígono.',
    ej: 'Cuadrado L=5m → P = 4×5 = 20m',
    q: '¿Cuál es el perímetro de un cuadrado cuyo lado mide 5 m?',
  },
  {
    id: 'area',
    t: 'Área',
    txt: 'Medida de la superficie encerrada por el contorno de una figura plana.',
    ej: 'Rectángulo 6×4 → A = 24 m²',
    q: 'Calcula el área (en m²) de un rectángulo de 6 m × 4 m.',
  },
  {
    id: 'volumen',
    t: 'Volumen',
    txt: 'Medida del espacio tridimensional ocupado por un cuerpo. V = L × A × H.',
    ej: 'Cubo L=3 → V = 27 m³',
    q: '¿Cuál es el volumen de un cubo cuyo lado mide 3 m?',
  },
  {
    id: 'potencia',
    t: 'Potenciación',
    txt: 'Multiplicación abreviada de factores iguales: a^n = a × a × ... × a.',
    ej: '2³ = 2×2×2 = 8',
    q: 'Calcula: 2^3 = ?',
  },
  {
    id: 'raiz',
    t: 'Radicación',
    txt: 'Operación inversa a la potenciación. Halla la base conociendo potencia y exponente.',
    ej: '√36 = 6 porque 6² = 36',
    q: 'Calcula: √36 = ?',
  },
  {
    id: 'porcentaje',
    t: 'Porcentaje y Razón',
    txt: 'Fracción con denominador 100 que representa una proporción de un total.',
    ej: '25% de 200 = (25 × 200) ÷ 100 = 50',
    q: 'Halla el 25% de 200.',
  },
];

export default function ConceptoModal5to({ isOpen, onClose }: ConceptoModal5toProps) {
  // Rotación diaria automática idéntica al HTML de 5°
  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    try {
      const d = new Date();
      return (d.getDate() + d.getMonth() * 31) % CONCEPTOS_5TO.length;
    } catch {
      return 0;
    }
  });

  const [demoHtml, setDemoHtml] = useState<string>('');

  const currentConcept = CONCEPTOS_5TO[selectedIdx];

  // Voz de narración
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

  // Renderizar interactivo FZ
  useEffect(() => {
    if (!isOpen || !currentConcept) return;
    try {
      if (FZ && FZ.crear) {
        const html = FZ.crear({ q: currentConcept.q, ctx: '' }, 'ej');
        setDemoHtml(html || '');
      }
    } catch {
      setDemoHtml('');
    }
  }, [isOpen, selectedIdx, currentConcept]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <h2
            className="text-2xl font-black text-[#5C21A6] flex items-center gap-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span>📘</span>
            <span>Concepto Matemático del Día (5°)</span>
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
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* Card Principal del Concepto */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm relative">
            <div className="text-[11px] font-black tracking-widest uppercase text-amber-700 mb-1">
              💡 CONCEPTO DESTACADO DE HOY
            </div>
            <div
              className="text-2xl font-black text-[#3D1468] mb-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {currentConcept.t}
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed mb-3">
              {currentConcept.txt}
            </p>
            <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 text-xs sm:text-sm font-black text-amber-950 flex items-center justify-between gap-2">
              <div>
                <span className="text-amber-600 mr-2">📌 Ejemplo:</span>
                <span>{currentConcept.ej}</span>
              </div>
              <button
                type="button"
                onClick={() => hablar(`${currentConcept.t}. ${currentConcept.txt}. Ejemplo: ${currentConcept.ej}`)}
                className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                title="Escuchar explicación"
              >
                🔊
              </button>
            </div>
          </div>

          {/* Demostración interactiva en Pizarra FZ */}
          {demoHtml && (
            <div className="bg-[#FAF8FF] border-2 border-[#D9CCFF] rounded-3xl p-4 shadow-sm">
              <div className="text-xs font-black text-[#5C21A6] mb-2 flex items-center gap-1.5">
                <span>🧠</span>
                <span>Visualización interactiva con el Método Fedor:</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: demoHtml }} />
            </div>
          )}

          {/* Carrusel de los 13 conceptos */}
          <div>
            <div className="text-xs font-black text-[#3D1468] mb-2">
              Explora los 13 conceptos clave de 5°:
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CONCEPTOS_5TO.map((c, idx) => {
                const active = selectedIdx === idx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedIdx(idx);
                      hablar(c.t);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-[#5C21A6] text-white shadow-md scale-105'
                        : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {c.t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
