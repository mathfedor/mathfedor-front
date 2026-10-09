'use client';

import React, { useState } from 'react';
import { useBook5 } from '../context/Book5Context';

type TabType = 'pensamientos' | 'estandares' | 'competencias' | 'dba';

const ESTANDARES_MEN_5 = [
  {
    title: '🔢 Pensamiento Numérico y Sistemas Numéricos',
    desc: 'Números naturales hasta millones, operaciones básicas y combinadas con jerarquía, teoría de números (múltiplos, divisores, primos, compuestos, MCD, MCM), potenciación y radicación, fracciones y decimales, razones y porcentajes.',
    items: [
      'Interpreto las fracciones en diferentes contextos: medición, relaciones parte-todo, cociente, razones y proporciones.',
      'Identifico y uso medidas relativas en distintos contextos para justificar el valor posicional de las cifras.',
      'Utilizo la notación decimal para expresar fracciones y relaciono estas representaciones con porcentajes.',
      'Resuelvo y formulo problemas cuya estrategia de solución requiera de las relaciones y propiedades de los números naturales y sus operaciones.',
      'Descompongo números en factores primos y aplico el MCD y el MCM para resolver situaciones problema.',
    ],
  },
  {
    title: '📐 Pensamiento Espacial y Sistemas Geométricos',
    desc: 'Polígonos regulares e irregulares, clasificación de triángulos y cuadriláteros, sólidos geométricos (prismas y pirámides), plano cartesiano y transformaciones en el plano (rotación, traslación, reflexión).',
    items: [
      'Comparo y clasifico figuras bidimensionales y tridimensionales de acuerdo con sus componentes y características.',
      'Utilizo sistemas de coordenadas cartesianas para ubicar figuras, describir trayectorias y aplicar traslaciones o reflexiones.',
      'Construyo y descompongo figuras y sólidos a partir de condiciones y medidas dadas.',
    ],
  },
  {
    title: '⚖️ Pensamiento Métrico y Sistemas de Medidas',
    desc: 'Unidades de longitud, área, volumen, masa y capacidad del Sistema Métrico Decimal. Perímetro y área de polígonos regulares e irregulares. Volumen de prismas rectangulares.',
    items: [
      'Diferencio y ordeno atributos medibles (longitud, área, volumen, capacidad, peso y masa).',
      'Selecciono unidades estandarizadas apropiadas para diferentes mediciones y realizo conversiones de escala.',
      'Calculo el área y el perímetro de polígonos y el volumen de prismas mediante diferentes estrategias.',
    ],
  },
  {
    title: '📊 Pensamiento Aleatorio y Sistemas de Datos',
    desc: 'Tablas de distribución de frecuencias, diagramas de barras, líneas y sectores circulares. Medidas de tendencia central (media, mediana, moda). Probabilidad frecuencial y teórica de eventos simples.',
    items: [
      'Interpreto y comparo información presentada en tablas de frecuencia y gráficos estadísticos.',
      'Resuelvo y formulo preguntas que requieran coleccionar, organizar y analizar datos del entorno.',
      'Calculo e interpreto la moda, la mediana y el promedio en un conjunto de datos.',
      'Estimo la probabilidad de ocurrencia de un evento a partir de datos experimentales.',
    ],
  },
  {
    title: '🔄 Pensamiento Variacional y Sistemas Algebraicos',
    desc: 'Patrones y regularidades numéricas y geométricas. Relaciones de proporcionalidad directa e inversa. Planteamiento y resolución de ecuaciones de primer grado con balanzas y operaciones inversas.',
    items: [
      'Describo e interpreto variaciones representadas en gráficos y tablas.',
      'Predigo patrones en una secuencia numérica o geométrica y formulo una regla general.',
      'Planteo y resuelvo ecuaciones lineales simples para hallar valores desconocidos.',
    ],
  },
];

const DBA_5 = [
  {
    num: 'DBA 1',
    txt: 'Interpreta y utiliza los números naturales y racionales en sus representaciones fraccionaria y decimal para formular y resolver problemas en diferentes contextos.',
  },
  {
    num: 'DBA 2',
    txt: 'Describe y desarrolla estrategias (cálculo mental, estimación y algoritmos) para calcular sumas, restas, multiplicaciones y divisiones con números naturales y racionales.',
  },
  {
    num: 'DBA 3',
    txt: 'Compara y ordena números fraccionarios y decimales a través de diversas representaciones, recursos y situaciones de la vida cotidiana.',
  },
  {
    num: 'DBA 4',
    txt: 'Identifica y describe patrones en secuencias numéricas y geométricas para resolver problemas que involucren proporcionalidad.',
  },
  {
    num: 'DBA 5',
    txt: 'Explica las relaciones entre el perímetro y el área de diferentes figuras bidimensionales cuando se modifican sus dimensiones.',
  },
  {
    num: 'DBA 6',
    txt: 'Aplica el concepto de volumen para medir y calcular la capacidad de recipientes y sólidos geométricos prismaicos.',
  },
  {
    num: 'DBA 7',
    txt: 'Recolecta, clasifica y analiza datos usando medidas de tendencia central y gráficos estadísticos para responder preguntas de investigación.',
  },
];

export default function EstandaresScreen5to() {
  const { goScreen } = useBook5();
  const [tab, setTab] = useState<TabType>('estandares');

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
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl mb-6 shadow-md">
          <div className="text-xs font-black text-emerald-300 uppercase tracking-wider mb-2">
            Ministerio de Educación Nacional (MEN) · Colombia
          </div>
          <h1
            className="text-2xl sm:text-4xl font-black mb-2"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Estándares Básicos de Competencias y DBA · 5° Grado
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-bold max-w-2xl">
            Alineación curricular completa con los lineamientos oficiales del MEN Colombia para el grado quinto de educación básica primaria.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setTab('estandares')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all ${
              tab === 'estandares'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Estándares por Pensamiento
          </button>
          <button
            type="button"
            onClick={() => setTab('dba')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all ${
              tab === 'dba'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Derechos Básicos de Aprendizaje (DBA)
          </button>
        </div>

        {/* Content */}
        {tab === 'estandares' && (
          <div className="space-y-6">
            {ESTANDARES_MEN_5.map((est, i) => (
              <div key={i} className="border-2 border-emerald-100 rounded-2xl p-5 bg-emerald-50/20">
                <h2 className="text-base sm:text-lg font-black text-emerald-950 mb-2">{est.title}</h2>
                <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-4 leading-relaxed">
                  {est.desc}
                </p>
                <div className="bg-white p-4 rounded-xl border border-emerald-100">
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">
                    Desempeños esperados:
                  </div>
                  <ul className="space-y-2">
                    {est.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-800 font-bold flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-black">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'dba' && (
          <div className="space-y-4">
            {DBA_5.map((dba, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl border-2 border-teal-100 bg-white hover:border-teal-300 transition-colors shadow-xs"
              >
                <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-800 mb-2">
                  {dba.num}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-bold leading-relaxed">
                  {dba.txt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
