'use client';

import React, { useState } from 'react';

interface CurriculoModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── DATOS OFICIALES DEL CURRÍCULO MEN COLOMBIA · GRADO 5° ──
const PENSAMIENTOS_DATA = [
  {
    id: 'numerico',
    nombre: 'Pensamiento numérico y sistemas numéricos',
    icono: '🔢',
    color: '#5C21A6',
    desc: 'Comprensión del uso y significados de los números hasta millones; comprensión de las operaciones y relaciones numéricas, teoría de números (primos, divisores, MCD, MCM) y desarrollo de cálculo mental y proporcionalidad.',
  },
  {
    id: 'variacional',
    nombre: 'Pensamiento variacional y sistemas algebraicos',
    icono: '📈',
    color: '#0891B2',
    desc: 'Identificación y modelación de la variación y el cambio en situaciones de proporcionalidad directa e inversa, secuencias y ecuaciones aditivas o multiplicativas simples.',
  },
  {
    id: 'espacial',
    nombre: 'Pensamiento espacial y sistemas geométricos',
    icono: '📐',
    color: '#059669',
    desc: 'Construcción y manipulación de representaciones de polígonos, prismas, pirámides, transformaciones en el plano (rotación, traslación, simetría) y coordenadas cartesianas.',
  },
  {
    id: 'metrico',
    nombre: 'Pensamiento métrico y sistemas de medidas',
    icono: '📏',
    color: '#D97706',
    desc: 'Comprensión de magnitudes de longitud, masa, capacidad, área y volumen. Conversión de unidades en el sistema métrico decimal y cálculo de perímetros y áreas compuestas.',
  },
  {
    id: 'aleatorio',
    nombre: 'Pensamiento aleatorio y sistemas de datos',
    icono: '📊',
    color: '#1E3A8A',
    desc: 'Análisis de tablas de frecuencia, diagramas de barras, líneas y circulares. Medidas de tendencia central (media, mediana, moda) y nociones de probabilidad clásica.',
  },
];

const ESTANDARES_DATA: Record<string, string[]> = {
  numerico: [
    'Interpreto las fracciones y decimales en diferentes contextos: relaciones parte-todo, cociente y razones de proporcionalidad.',
    'Utilizo la notación decimal y porcentajes para resolver problemas de descuentos, intereses y razones.',
    'Justifico el valor de posición en números naturales hasta 9 cifras (centenas de millón).',
    'Resuelvo problemas que involucren múltiplos, divisores, números primos y compuestos, MCD y MCM.',
    'Aplico algoritmos convencionales y estrategias de descomposición para la multiplicación y división con residuo.',
    'Resuelvo y formulo problemas de proporcionalidad directa e inversa mediante regla de tres.',
  ],
  variacional: [
    'Describo e interpreto variaciones en tablas y gráficas cartesianas.',
    'Predigo patrones de variación y formulo reglas generales para sucesiones numéricas y geométricas.',
    'Construyo igualdades y resuelvo ecuaciones con una incógnita (balanzas aritméticas).',
  ],
  espacial: [
    'Comparo y clasifico polígonos regulares e irregulares de acuerdo con sus ángulos y ejes de simetría.',
    'Identifico y construyo prismas y pirámides a partir de sus desarrollos planos.',
    'Aplico giros (rotación), traslaciones y reflexiones sobre figuras bidimensionales en el plano cartesiano.',
  ],
  metrico: [
    'Diferencio y relaciono las medidas de perímetro, área de superficie y volumen tridimensional.',
    'Convierto unidades métricas de longitud, capacidad y masa multiplicando o dividiendo por potencias de 10.',
    'Calculo el área de rectángulos, triángulos y paralelogramos usando fórmulas deducidas visualmente.',
    'Calculo el volumen de prismas rectangulares mediante el conteo de cubos unitarios.',
  ],
  aleatorio: [
    'Represento e interpreto datos mediante gráficas de barras dobles, líneas y pictogramas.',
    'Calculo e interpreto la media aritmética, la mediana y la moda de conjuntos de datos cotidianos.',
    'Determino la probabilidad de ocurrencia de eventos simples mediante la razón entre casos favorables y casos posibles.',
  ],
};

export default function CurriculoModal5to({ isOpen, onClose }: CurriculoModal5toProps) {
  const [selectedPensamiento, setSelectedPensamiento] = useState<string>('numerico');

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📚</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Currículo MEN · Grado 5° de Primaria
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* Banner Hero */}
          <div
            className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #5C21A6 0%, #1E40AF 60%, #0D9488 100%)' }}
          >
            <h3
              className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>🇨🇴</span>
              <span>Estándares Básicos de Competencias (MEN)</span>
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-white/95">
              Marco pedagógico oficial de Colombia para el ciclo 4°-5° de Educación Básica Primaria.
            </p>
          </div>

          {/* Selector de los 5 Pensamientos Matemáticos */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PENSAMIENTOS_DATA.map((p) => {
              const active = selectedPensamiento === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPensamiento(p.id)}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                    active
                      ? 'shadow-md scale-102 border-2 text-white'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-800'
                  }`}
                  style={{
                    backgroundColor: active ? p.color : undefined,
                    borderColor: active ? p.color : undefined,
                  }}
                >
                  <span className="text-xl">{p.icono}</span>
                  <span className="text-[11px] font-black leading-tight line-clamp-2">
                    {p.nombre.replace('Pensamiento ', '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detalle del Pensamiento Seleccionado */}
          {(() => {
            const current = PENSAMIENTOS_DATA.find((p) => p.id === selectedPensamiento);
            if (!current) return null;
            const estandares = ESTANDARES_DATA[current.id] || [];

            return (
              <div className="bg-[#FAF8FF] border-2 border-purple-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{current.icono}</span>
                  <div>
                    <h4
                      className="font-black text-lg text-[#2A0F60]"
                      style={{ fontFamily: "'Baloo 2', sans-serif" }}
                    >
                      {current.nombre}
                    </h4>
                    <p className="text-xs text-gray-600 font-semibold">{current.desc}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-100">
                  <div className="font-black text-xs uppercase tracking-wider text-[#5C21A6] mb-2">
                    Estándares Básicos de 5° Grado:
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-800 font-semibold">
                    {estandares.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
