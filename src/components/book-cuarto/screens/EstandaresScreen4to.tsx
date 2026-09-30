'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';

type TabType = 'pensamientos' | 'estandares' | 'competencias' | 'dba';

const ESTANDARES_MEN_4 = [
  {
    title: '🔢 Pensamiento Numérico y Sistemas Numéricos',
    desc: 'Uso de números hasta 6 o más cifras (millones), valor posicional, operaciones avanzadas (adición, sustracción, multiplicación de varias cifras, división exacta e inexacta), múltiplos, divisores y números primos. Comprensión de fracciones (propias, impropias, equivalentes) y números decimales (décimas, centésimas).',
    items: [
      'Interpreto las fracciones en diferentes contextos: situaciones de medición, relaciones parte-todo, cociente, razones y proporciones.',
      'Identifico y uso medidas relativas en distintos contextos para justificar el valor posicional de las cifras.',
      'Utilizo la notación decimal para expresar fracciones en diferentes contextos y relaciono estas dos notaciones con los porcentajes.',
      'Justifico el valor posicional en el sistema de numeración decimal en relación con el conteo recurrente de diez en diez.',
      'Resuelvo y formulo problemas cuya estrategia de solución requiera de las relaciones y propiedades de los números naturales y sus operaciones.',
    ],
  },
  {
    title: '📐 Pensamiento Espacial y Sistemas Geométricos',
    desc: 'Rectas paralelas, perpendiculares y secantes. Clasificación de ángulos (agudo, recto, obtuso, llano). Polígonos regulares e irregulares, triángulos (equilátero, isósceles, escaleno; acutángulo, rectángulo, obtusángulo), cuadriláteros. Círculo y circunferencia. Transformaciones geométricas: rotación, traslación y simetría.',
    items: [
      'Comparo y clasifico figuras bidimensionales de acuerdo con sus componentes (lados, vértices) y características.',
      'Identifico, represento y utilizo ángulos en giros, aberturas, inclinaciones, figuras, puntas y esquinas en situaciones estáticas y dinámicas.',
      'Utilizo sistemas de coordenadas para ubicar figuras y describir trayectorias.',
      'Construyo y descompongo figuras y sólidos a partir de condiciones dadas.',
    ],
  },
  {
    title: '⚖️ Pensamiento Métrico y Sistemas de Medidas',
    desc: 'Unidades estandarizadas de longitud (km, m, dm, cm, mm), superficie (m², cm²), volumen y capacidad (litro, mililitro), masa (tonelada, kg, g) y tiempo (siglos, décadas, años, horas, minutos, segundos). Cálculo de perímetro y área en polígonos.',
    items: [
      'Diferencio y ordeno, en objetos y situaciones, propiedades o atributos que se puedan medir (longitud, área, volumen, capacidad, peso y masa).',
      'Selecciono unidades, tanto convencionales como estandarizadas, apropiadas para diferentes mediciones.',
      'Utilizo y justifico el uso de la estimación para resolver problemas relativos a la vida social, económica y de las ciencias.',
      'Calculo el área y el perímetro de figuras regulares e irregulares mediante diferentes estrategias.',
    ],
  },
  {
    title: '📊 Pensamiento Aleatorio y Sistemas de Datos',
    desc: 'Tablas de distribución de frecuencias absolutas y relativas. Diagramas de barras simples y dobles, diagramas de líneas, diagramas circulares. Medidas de tendencia central: moda y media aritmética (promedio). Probabilidad cualitativa y cuantitativa de eventos sencillos.',
    items: [
      'Interpreto información presentada en tablas y gráficas (pictogramas, gráficas de barras, diagramas de líneas).',
      'Comparo diferentes representaciones del mismo conjunto de datos.',
      'Resuelvo y formulo preguntas que requieran para su solución coleccionar y analizar datos del entorno escolar y familiar.',
      'Describo la manera como parece distribuirse un conjunto de datos (moda y media).',
    ],
  },
  {
    title: '🔄 Pensamiento Variacional y Sistemas Algebraicos',
    desc: 'Patrones numéricos y geométricos crecientes y decrecientes. Secuencias con multiplicación y división. Relaciones de igualdad y ecuaciones sencillas con incógnitas.',
    items: [
      'Describo e interpreto variaciones representadas en gráficos y tablas.',
      'Predigo patrones en una secuencia numérica o geométrica y formulo una regla general.',
      'Construyo igualdades y desigualdades numéricas con operaciones combinadas.',
    ],
  },
];

const DBA_GRADO_4 = [
  {
    num: 1,
    desc: 'Interpreta las fracciones como razón, relación parte-todo, cociente y operador en diferentes contextos.',
  },
  {
    num: 2,
    desc: 'Describe y justifica diferentes estrategias para representar, operar y hacer estimaciones con números naturales y fracciones.',
  },
  {
    num: 3,
    desc: 'Establece relaciones mayor que, menor que, igual que y relaciones multiplicativas entre números racionales (fracciones y decimales).',
  },
  {
    num: 4,
    desc: 'Caracteriza y compara atributos medibles de los objetos (longitud, superficie, capacidad, masa, volumen del espacio ocupado).',
  },
  {
    num: 5,
    desc: 'Elige instrumentos y unidades estandarizadas para estimar y medir masa, peso, capacidad, volumen, área y tiempo.',
  },
  {
    num: 6,
    desc: 'Identifica, describe y representa figuras bidimensionales y cuerpos tridimensionales y establece relaciones entre ellos.',
  },
  {
    num: 7,
    desc: 'Comprende y explica el carácter relativo de las medidas de tendencias central (media y moda) y organiza datos en tablas y diagramas.',
  },
];

export default function EstandaresScreen4to() {
  const { goScreen } = useBook4();
  const [tab, setTab] = useState<TabType>('pensamientos');

  return (
    <div className="min-h-screen bg-[#07091B] text-white font-sans p-4 md:p-6 pb-24 select-none">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => goScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 cursor-pointer transition-colors mb-4"
        >
          <span>←</span>
          <span>Volver a la Galaxia</span>
        </button>

        <div className="bg-gradient-to-r from-[#170E38] via-[#2A155C] to-[#170E38] border border-amber-400/40 rounded-3xl p-6 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🇨🇴</span>
            <div>
              <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                MALLA CURRICULAR OFICIAL
              </span>
              <h1 className="text-2xl font-black text-white mt-1">Estándares Básicos de Competencias y DBA</h1>
              <p className="text-xs text-white/70">
                Ministerio de Educación Nacional de Colombia — Grado 4° de Primaria
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 border-b border-white/10 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setTab('pensamientos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                tab === 'pensamientos'
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              🧠 5 Pensamientos Matemáticos
            </button>
            <button
              type="button"
              onClick={() => setTab('dba')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                tab === 'dba'
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              🎯 Derechos Básicos (DBA 4°)
            </button>
          </div>
        </div>

        {tab === 'pensamientos' && (
          <div className="space-y-4">
            {ESTANDARES_MEN_4.map((est, idx) => (
              <div
                key={idx}
                className="bg-[#12163A]/80 border border-white/10 rounded-2xl p-5 hover:border-amber-400/40 transition-colors shadow-lg"
              >
                <h3 className="text-base font-black text-amber-300 mb-1.5">{est.title}</h3>
                <p className="text-xs text-white/80 mb-3 leading-relaxed">{est.desc}</p>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1.5">
                  <div className="text-[11px] font-black text-indigo-300 uppercase tracking-wide">
                    Desempeños clave en Grado 4°:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-white/70">
                    {est.items.map((item, i) => (
                      <li key={i} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'dba' && (
          <div className="space-y-3">
            {DBA_GRADO_4.map((d) => (
              <div
                key={d.num}
                className="bg-[#12163A]/80 border border-white/10 rounded-2xl p-4 flex gap-4 items-start shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black text-base flex items-center justify-center shrink-0 shadow">
                  #{d.num}
                </div>
                <div>
                  <div className="text-xs font-black text-amber-300 mb-1">Derecho Básico de Aprendizaje {d.num}</div>
                  <div className="text-xs text-white/85 leading-relaxed">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
