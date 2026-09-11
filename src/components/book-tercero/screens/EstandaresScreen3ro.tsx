'use client';

import React from 'react';
import { useBook3 } from '../context/Book3Context';

const ESTANDARES_MEN_3 = [
  {
    title: '🔢 Pensamiento Numérico y Sistemas Numéricos',
    desc: 'Uso de números hasta 5 cifras, descomposición en centenas, decenas y unidades. Algoritmos con llevadas y desagrupación en suma y resta.',
    items: [
      'Reconozco significados del número en diferentes contextos (medición, conteo, comparación, codificación, localización).',
      'Describo, comparo y cuantifico situaciones con números, en diferentes contextos y con diversas representaciones.',
      'Uso diversas estrategias de cálculo (especialmente mental) y de estimación para resolver problemas en situaciones aditivas y multiplicativas.',
      'Identifico regularidades y propiedades de los números utilizando diferentes instrumentos de cálculo.',
    ],
  },
  {
    title: '📐 Pensamiento Espacial y Sistemas Geométricos',
    desc: 'Figuras planas (polígonos, triángulos, cuadriláteros) y sólidos geométricos (cubos, prismas). Cálculo de perímetro y área.',
    items: [
      'Diferencio atributos y propiedades de objetos tridimensionales.',
      'Reconozco nociones de horizontalidad, verticalidad, paralelismo y perpendicularidad en distintos contextos.',
      'Represento el espacio circundante para establecer relaciones espaciales (distancia, dirección, orientación).',
    ],
  },
  {
    title: '⚖️ Pensamiento Métrico y Sistemas de Medidas',
    desc: 'Unidades de longitud (metro, centímetro), masa (kilogramo, gramo), capacidad (litro) y tiempo (horas, minutos).',
    items: [
      'Reconozco en los objetos propiedades o atributos que se puedan medir (longitud, área, volumen, capacidad, peso y masa).',
      'Comparo y ordeno objetos respecto a atributos medibles.',
      'Realizo y describo procesos de medición con patrones arbitrarios y algunos estandarizados.',
    ],
  },
  {
    title: '📊 Pensamiento Aleatorio y Sistemas de Datos',
    desc: 'Tablas de frecuencia, gráficos de barras y pictogramas. Nociones elementales de probabilidad (seguro, probable, imposible).',
    items: [
      'Clasifico y organizo datos de acuerdo a cualidades y atributos y los presento en tablas.',
      'Interpreto cualitativamente datos referidos a situaciones del entorno escolar.',
      'Describo situaciones o eventos a partir de un conjunto de datos.',
    ],
  },
];

export default function EstandaresScreen3ro() {
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
            Curriculum Oficial · MEN Colombia
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white mt-2">
            📐 Estándares Básicos de Competencias · 3° Primaria
          </h1>
          <p className="text-xs font-bold text-purple-200/80 mt-1">
            Matemáticas de Fedor está 100% alineado con los estándares del Ministerio de Educación Nacional de Colombia.
          </p>
        </div>

        <div className="space-y-4">
          {ESTANDARES_MEN_3.map((est, idx) => (
            <div
              key={idx}
              className="bg-[#120926]/90 border border-purple-500/25 rounded-2xl p-5 shadow-lg"
            >
              <h2 className="text-base font-black text-amber-300 mb-1">
                {est.title}
              </h2>
              <p className="text-xs font-bold text-purple-200/70 mb-3">
                {est.desc}
              </p>
              <ul className="space-y-2">
                {est.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
