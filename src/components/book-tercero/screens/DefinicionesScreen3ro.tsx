'use client';

import React from 'react';
import { useBook3 } from '../context/Book3Context';
import { fedorSpeak } from '../shared/Grade3Speech';

const DEFINICIONES_3 = [
  {
    cat: '➕ Adición y Sustracción',
    terms: [
      { t: 'Adición (Suma)', d: 'Operación que combina dos o más números para obtener un total.', ex: '150 + 230 = 380' },
      { t: 'Sumandos', d: 'Los números que se suman en una adición.', ex: 'En 4 + 5 = 9, 4 y 5 son sumandos.' },
      { t: 'Sustracción (Resta)', d: 'Operación que halla la diferencia entre dos cantidades.', ex: '500 - 150 = 350' },
      { t: 'Minuendo y Sustraendo', d: 'El minuendo es la cantidad inicial y el sustraendo lo que se resta.', ex: 'En 80 - 20, 80 es minuendo y 20 sustraendo.' },
    ],
  },
  {
    cat: '✖️ Multiplicación y División',
    terms: [
      { t: 'Multiplicación', d: 'Suma abreviada de sumandos iguales.', ex: '4 × 6 = 24 (sumar 4 seis veces).' },
      { t: 'Factores y Producto', d: 'Los factores son los números que se multiplican; el producto es el resultado.', ex: '3 × 7 = 21' },
      { t: 'División', d: 'Reparto en partes iguales de una cantidad.', ex: '20 ÷ 4 = 5' },
      { t: 'Dividendo, Divisor, Cociente y Residuo', d: 'Dividendo es lo que se reparte; divisor entre cuántos; cociente el resultado y residuo lo que sobra.', ex: '17 ÷ 3 = 5 (residuo 2)' },
    ],
  },
  {
    cat: '🍕 Fracciones',
    terms: [
      { t: 'Fracción', d: 'Representación de una o varias partes de una unidad dividida en partes iguales.', ex: '1/2, 3/4' },
      { t: 'Numerador', d: 'Número superior que indica cuántas partes se toman de la unidad.', ex: 'En 3/4, el numerador es 3.' },
      { t: 'Denominador', d: 'Número inferior que indica en cuántas partes iguales se divide la unidad.', ex: 'En 3/4, el denominador es 4.' },
    ],
  },
  {
    cat: '📐 Geometría y Medición',
    terms: [
      { t: 'Perímetro', d: 'Longitud del contorno de una figura geométrica (suma de todos sus lados).', ex: 'Cuadrado de lado 5: P = 5+5+5+5 = 20 cm' },
      { t: 'Área', d: 'Medida de la superficie encerrada por el contorno de una figura.', ex: 'Rectángulo de 4 cm × 3 cm = 12 cm²' },
      { t: 'Volumen', d: 'Espacio tridimensional que ocupa un cuerpo.', ex: 'Cubo de lado 3 cm = 3 × 3 × 3 = 27 cm³' },
    ],
  },
];

export default function DefinicionesScreen3ro() {
  const { goScreen } = useBook3();

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      <button
        type="button"
        onClick={() => goScreen('home')}
        className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 cursor-pointer transition-colors mb-4"
      >
        <span>←</span>
        <span>Volver al Inicio</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-[#1E0942] via-[#2A0E5A] to-[#1E0942] border border-purple-500/40 rounded-3xl p-6 shadow-2xl mb-6">
          <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Glosario Matemático
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white mt-2">
            📖 Definiciones y Conceptos Fedor · 3°
          </h1>
          <p className="text-xs font-bold text-purple-200/80 mt-1">
            Consulta los términos clave para comprender a fondo los ejercicios y problemas.
          </p>
        </div>

        <div className="space-y-6">
          {DEFINICIONES_3.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <h2 className="text-sm font-black text-amber-400 tracking-wide uppercase px-1">
                {cat.cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.terms.map((term, tIdx) => (
                  <div
                    key={tIdx}
                    className="bg-[#120926]/90 border border-purple-500/25 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-sm font-black text-white">
                          {term.t}
                        </h3>
                        <button
                          type="button"
                          onClick={() => fedorSpeak(`${term.t}. ${term.d}`)}
                          title="Escuchar definición"
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-xs text-purple-200/80 font-medium leading-relaxed">
                        {term.d}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-800/30 text-[11px] font-mono text-amber-300">
                      Ej: {term.ex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
