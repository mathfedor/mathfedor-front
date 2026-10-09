'use client';

import React, { useState } from 'react';
import { useBook5 } from '../context/Book5Context';

interface Term {
  t: string;
  d: string;
  ex: string;
}

interface TermCategory {
  cat: string;
  terms: Term[];
}

const DEFINICIONES_5: TermCategory[] = [
  {
    cat: '🔢 Sistema de Numeración y Operaciones',
    terms: [
      {
        t: 'Valor Posicional y Millones',
        d: 'El valor que tiene cada dígito según la posición que ocupa en el número (unidades, decenas, centenas, unidades de mil, decenas de mil, centenas de mil, unidades de millón).',
        ex: 'En 3.450.000, el 3 vale 3 millones (3.000.000) y el 4 vale 400.000.',
      },
      {
        t: 'Operaciones Combinadas y Jerarquía',
        d: 'Regla matemática que determina el orden en que se deben resolver las operaciones: primero paréntesis, luego potencias/raíces, después multiplicaciones/divisiones, y finalmente sumas/restas de izquierda a derecha.',
        ex: '5 + 3 × 4 = 5 + 12 = 17 (no 32).',
      },
      {
        t: 'Propiedad Distributiva',
        d: 'La multiplicación de un número por una suma es igual a la suma de los productos de dicho número por cada sumando.',
        ex: '6 × (10 + 4) = (6 × 10) + (6 × 4) = 60 + 24 = 84.',
      },
      {
        t: 'Potenciación',
        d: 'Operación que consiste en multiplicar un número (base) por sí mismo tantas veces como indica otro (exponente).',
        ex: '3⁴ = 3 × 3 × 3 × 3 = 81.',
      },
      {
        t: 'Radicación',
        d: 'Operación inversa a la potenciación que busca la base conocida la potencia y el índice radical.',
        ex: '√49 = 7 porque 7² = 49.',
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
        ex: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...',
      },
      {
        t: 'Número Compuesto',
        d: 'Número natural que tiene más de dos divisores.',
        ex: '4, 6, 8, 9, 10, 12, 14, 15...',
      },
      {
        t: 'Máximo Común Divisor (MCD)',
        d: 'El mayor de los divisores comunes de dos o más números.',
        ex: 'MCD(12, 18) = 6.',
      },
      {
        t: 'Mínimo Común Múltiplo (MCM)',
        d: 'El menor múltiplo común distinto de cero de dos o más números.',
        ex: 'MCM(4, 6) = 12.',
      },
    ],
  },
  {
    cat: '🍕 Fracciones y Decimales',
    terms: [
      {
        t: 'Fracción Propia e Impropia',
        d: 'Una fracción propia tiene numerador menor que denominador (<1). La impropia tiene numerador mayor o igual que denominador (≥1).',
        ex: '3/4 es propia; 5/3 es impropia.',
      },
      {
        t: 'Fracciones Equivalentes',
        d: 'Fracciones que representan la misma cantidad o parte de la unidad.',
        ex: '1/2 = 2/4 = 4/8.',
      },
      {
        t: 'Suma de Fracciones Heterogéneas',
        d: 'Suma de fracciones con diferente denominador usando el MCM de los denominadores.',
        ex: '1/2 + 1/3 = 3/6 + 2/6 = 5/6.',
      },
      {
        t: 'Número Decimal',
        d: 'Número que tiene una parte entera y una parte decimal separadas por una coma o punto.',
        ex: '3,75 tiene 3 enteros, 7 décimas y 5 centésimas.',
      },
      {
        t: 'Porcentaje',
        d: 'Razón que compara una cantidad con 100.',
        ex: '25% de 200 = (25 × 200) / 100 = 50.',
      },
    ],
  },
  {
    cat: '📐 Geometría y Medición',
    terms: [
      {
        t: 'Perímetro',
        d: 'Suma de las longitudes de todos los lados de una figura geométrica cerrada.',
        ex: 'Cuadrado de lado 5 cm → P = 4 × 5 = 20 cm.',
      },
      {
        t: 'Área',
        d: 'Medida de la superficie que ocupa una figura geométrica bidimensional.',
        ex: 'Rectángulo de 6 m × 4 m → Área = 24 m².',
      },
      {
        t: 'Volumen',
        d: 'Medida del espacio tridimensional que ocupa un cuerpo.',
        ex: 'Prisma de 3 m × 2 m × 4 m → V = 24 m³.',
      },
      {
        t: 'Plano Cartesiano',
        d: 'Sistema de coordenadas formado por dos rectas numéricas perpendiculares (eje X horizontal y eje Y vertical).',
        ex: 'El punto (3, 5) indica 3 unidades a la derecha y 5 hacia arriba.',
      },
    ],
  },
];

export default function DefinicionesScreen5to() {
  const { goScreen } = useBook5();
  const [search, setSearch] = useState('');

  const filtered = DEFINICIONES_5.map((cat) => ({
    ...cat,
    terms: cat.terms.filter(
      (t) =>
        t.t.toLowerCase().includes(search.toLowerCase()) ||
        t.d.toLowerCase().includes(search.toLowerCase()) ||
        t.ex.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.terms.length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-3 sm:px-6 select-none font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-200">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="text-xs sm:text-sm font-black text-purple-700 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span> Volver al Inicio
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 sm:p-8 rounded-2xl mb-6 shadow-md">
          <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
            Glosario Matemático · 5° Grado
          </div>
          <h1
            className="text-2xl sm:text-4xl font-black mb-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Conceptos y Definiciones Clave
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-bold max-w-2xl">
            Aprende y repasa los términos matemáticos fundamentales del currículo nacional de 5° grado.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar término o concepto..."
            className="w-full p-4 rounded-xl border-2 border-purple-200 text-sm font-bold outline-none focus:border-purple-600 shadow-xs"
          />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {filtered.map((cat, i) => (
            <div key={i} className="border-2 border-purple-100 rounded-2xl p-5 bg-purple-50/20">
              <h2 className="text-base sm:text-lg font-black text-[#1A1033] mb-4 pb-2 border-b border-purple-200">
                {cat.cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.terms.map((term, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-4 rounded-xl bg-white border border-purple-100 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="font-black text-sm text-purple-900 mb-1">{term.t}</div>
                    <p className="text-xs text-gray-700 font-semibold mb-2 leading-relaxed">
                      {term.d}
                    </p>
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      💡 <strong>Ejemplo:</strong> {term.ex}
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
