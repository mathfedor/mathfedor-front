'use client';

import React from 'react';

interface HistoriaModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoriaModal5to({ isOpen, onClose }: HistoriaModal5toProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Historia y Método Fedor (5°)
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
        <div className="overflow-y-auto pr-1 space-y-4 flex-1 text-gray-800 leading-relaxed text-sm">
          {/* Banner Hero */}
          <div
            className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #5C21A6 0%, #7C3AED 55%, #E8650A 100%)' }}
          >
            <h3
              className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>🚀</span>
              <span>Origen del Método Fedor</span>
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-white/95">
              Transformando la enseñanza de las matemáticas escolares a través de la visualización estructural y la resolución por etapas.
            </p>
          </div>

          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl">
            <p className="font-bold text-purple-950">
              El <b>Método Fedor</b> nació de la observación pedagógica en aulas de clase de educación básica primaria: los estudiantes retienen hasta un <b>85% más</b> de conceptos matemáticos complejos cuando el contenido se estructura visualmente antes de operar con algoritmos abstractos.
            </p>
          </div>

          <div>
            <h4
              className="font-black text-lg text-[#5C21A6] mb-3 flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>🧩</span>
              <span>Los 4 Pasos del Método Fedor:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white border-2 border-indigo-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-sm mb-1">
                  <span>1.</span>
                  <span>VERTICAL (Visualización)</span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">
                  Alineación espacial en cuadrícula posicional. Las unidades, decenas, centenas y millones se diferencian con colores vivos y bloques base 10.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-teal-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-teal-700 font-black text-sm mb-1">
                  <span>2.</span>
                  <span>Instrucción Guiada</span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">
                  Explicación clara y contextualizada en el mundo de Fedor. Reglas matemáticas expresadas sin jerga intimidante.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-amber-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-amber-700 font-black text-sm mb-1">
                  <span>3.</span>
                  <span>Procedimiento por Etapas</span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">
                  Cálculo interactivo de derecha a izquierda (en sumas y restas) o de izquierda a derecha (en divisiones), con casilla visible para llevadas y préstamos.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-rose-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-rose-700 font-black text-sm mb-1">
                  <span>4.</span>
                  <span>Resultado y Verificación</span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">
                  Comprobación mediante operación inversa y aplicación a un problema de la vida cotidiana (compras, medidas o presupuestos).
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-950 flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <span>
              En 5° grado, el método profundiza en múltiplos, divisores, fracciones heterogéneas, proporcionalidad y medidas de tendencia central.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
