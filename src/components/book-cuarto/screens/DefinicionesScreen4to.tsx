'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';

interface Term {
  t: string;
  d: string;
  ex: string;
}

interface TermCategory {
  cat: string;
  terms: Term[];
}

const DEFINICIONES_4: TermCategory[] = [
  {
    cat: '🔢 Sistema de Numeración y Operaciones',
    terms: [
      {
        t: 'Valor Posicional y Millones',
        d: 'El valor que tiene cada dígito según la posición que ocupa en el número (unidades, decenas, centenas, unidades de mil, decenas de mil, centenas de mil, unidades de millón).',
        ex: 'En 3.450.000, el 3 vale 3 millones (3.000.000) y el 4 vale 400.000.',
      },
      {
        t: 'Multiplicación de varias cifras',
        d: 'Operación aritmética que consiste en sumar un mismo número tantas veces como indica otro de 2 o más dígitos.',
        ex: '245 × 36 = 1.470 + 7.350 = 8.820.',
      },
      {
        t: 'División Inexacta y Residuo',
        d: 'División en la que el dividendo no contiene una cantidad exacta de veces al divisor; siempre queda un residuo menor que el divisor.',
        ex: '29 ÷ 4 = 7 con residuo 1, porque (4 × 7) + 1 = 29.',
      },
      {
        t: 'Propiedad Distributiva',
        d: 'La multiplicación de un número por una suma es igual a la suma de los productos de dicho número por cada sumando.',
        ex: '6 × (10 + 4) = (6 × 10) + (6 × 4) = 60 + 24 = 84.',
      },
    ],
  },
  {
    cat: '✨ Teoría de Números',
    terms: [
      {
        t: 'Múltiplos',
        d: 'Números que se obtienen al multiplicar un número dado por los números naturales (0, 1, 2, 3...). Son infinitos.',
        ex: 'Múltiplos de 6: {0, 6, 12, 18, 24, 30, 36...}',
      },
      {
        t: 'Divisores',
        d: 'Números que dividen exactamente a otro sin dejar residuo. Son finitos.',
        ex: 'Divisores de 12: {1, 2, 3, 4, 6, 12}.',
      },
      {
        t: 'Número Primo',
        d: 'Número natural mayor que 1 que tiene únicamente dos divisores distintos: él mismo y el 1.',
        ex: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29...',
      },
      {
        t: 'Número Compuesto',
        d: 'Número natural mayor que 1 que tiene más de dos divisores.',
        ex: '4, 6, 8, 9, 10, 12, 14, 15...',
      },
      {
        t: 'Criterios de Divisibilidad',
        d: 'Reglas prácticas que permiten saber si un número es divisible entre otro sin realizar la división completa.',
        ex: 'Un número es divisible por 5 si termina en 0 o en 5.',
      },
    ],
  },
  {
    cat: '🍕 Fracciones y Decimales',
    terms: [
      {
        t: 'Fracción Propia e Impropia',
        d: 'Una fracción propia tiene numerador menor que el denominador (menor que la unidad). La impropia tiene numerador mayor o igual (mayor o igual a la unidad).',
        ex: 'Propia: 3/5. Impropia: 7/4 = 1 3/4.',
      },
      {
        t: 'Fracciones Equivalentes',
        d: 'Fracciones que representan la misma porción de la unidad aunque tengan términos distintos. Se obtienen por amplificación o simplificación.',
        ex: '2/4 = 1/2 = 4/8.',
      },
      {
        t: 'Número Mixto',
        d: 'Número formado por una parte entera y una fracción propia.',
        ex: '2 1/3 = 7/3 (dos enteros y un tercio).',
      },
      {
        t: 'Números Decimales',
        d: 'Forma de expresar cantidades con parte entera y parte decimal separadas por coma o punto (décimas, centésimas, milésimas).',
        ex: '0,5 = 5/10; 0,25 = 25/100.',
      },
    ],
  },
  {
    cat: '📐 Geometría y Medición',
    terms: [
      {
        t: 'Rectas Paralelas y Perpendiculares',
        d: 'Paralelas: mantienen siempre la misma distancia y nunca se cruzan. Perpendiculares: se cortan formando ángulos rectos de 90°.',
        ex: 'Las líneas del tren son paralelas; una cruz (+) forma rectas perpendiculares.',
      },
      {
        t: 'Clasificación de Ángulos',
        d: 'Agudo: mide menos de 90°. Recto: mide exactamente 90°. Obtuso: mide más de 90° y menos de 180°. Llano: mide 180°.',
        ex: 'La esquina de una hoja forma un ángulo recto (90°).',
      },
      {
        t: 'Perímetro y Área',
        d: 'Perímetro es la suma de los lados de un contorno. Área es la cantidad de superficie que cubre una figura.',
        ex: 'Rectángulo de 6 cm × 4 cm: P = 6+4+6+4 = 20 cm; A = 6 × 4 = 24 cm².',
      },
      {
        t: 'Círculo y Circunferencia',
        d: 'La circunferencia es la línea curva cerrada que bordea el círculo; el círculo es la superficie plana interior.',
        ex: 'El aro de hula-hula es circunferencia; una moneda es círculo.',
      },
    ],
  },
  {
    cat: '📊 Estadística y Probabilidad',
    terms: [
      {
        t: 'Media Aritmética (Promedio)',
        d: 'Suma de todos los datos dividida entre el número total de datos.',
        ex: 'Notas 4, 5 y 3: Promedio = (4 + 5 + 3) ÷ 3 = 12 ÷ 3 = 4.',
      },
      {
        t: 'Moda',
        d: 'El valor o dato que aparece con mayor frecuencia en un conjunto.',
        ex: 'En {5, 7, 7, 8, 9, 7, 6}, la moda es 7 (se repite 3 veces).',
      },
      {
        t: 'Probabilidad de un Evento',
        d: 'Medida numérica o cualitativa de qué tan posible es que ocurra un suceso (seguro, probable, poco probable, imposible).',
        ex: 'Al lanzar un dado de 6 caras, la probabilidad de sacar 4 es 1/6.',
      },
    ],
  },
];

export default function DefinicionesScreen4to() {
  const { goScreen } = useBook4();
  const [filter, setFilter] = useState('');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-CO';
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const filteredCategories = DEFINICIONES_4.map((c) => ({
    ...c,
    terms: c.terms.filter(
      (t) =>
        t.t.toLowerCase().includes(filter.toLowerCase()) ||
        t.d.toLowerCase().includes(filter.toLowerCase()) ||
        t.ex.toLowerCase().includes(filter.toLowerCase())
    ),
  })).filter((c) => c.terms.length > 0);

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 cursor-pointer transition-colors mb-4"
        >
          <span>←</span>
          <span>Volver al Inicio</span>
        </button>

        <div className="bg-gradient-to-r from-[#170E38] via-[#2A155C] to-[#170E38] border border-purple-500/40 rounded-3xl p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                GLOSARIO DE 4° GRADO
              </span>
              <h1 className="text-2xl font-black text-white mt-1">Definiciones y Conceptos Matemáticos</h1>
              <p className="text-xs text-white/70">
                Aprende y repasa los términos clave de matemáticas con explicaciones y ejemplos
              </p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="🔍 Buscar concepto..."
                className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-base font-black text-amber-300 tracking-wide border-b border-white/10 pb-1.5">
                {cat.cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.terms.map((t, i) => (
                  <div
                    key={i}
                    className="bg-[#12163A]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/40 transition-colors shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white">{t.t}</h3>
                        <button
                          type="button"
                          onClick={() => speak(`${t.t}. ${t.d}. Ejemplo: ${t.ex}`)}
                          title="Escuchar explicación"
                          className="w-7 h-7 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 flex items-center justify-center text-xs transition-colors"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed mb-3">{t.d}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                      <span className="text-[10px] font-black text-amber-300 block mb-0.5">Ejemplo:</span>
                      <span className="text-xs text-emerald-300 font-mono">{t.ex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-white/60 text-xs">
              No se encontraron conceptos para &quot;{filter}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
