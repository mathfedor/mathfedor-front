'use client';

import React from 'react';

interface GuiaDocenteModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuiaDocenteModal5to({ isOpen, onClose }: GuiaDocenteModal5toProps) {
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
            <span className="text-2xl">👩‍🏫</span>
            <h2
              className="text-2xl font-black text-[#2A0F60]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Guía Pedagógica del Docente (MEN 5°)
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
            style={{ background: 'linear-gradient(135deg, #059669 0%, #0D9488 55%, #1E3A8A 100%)' }}
          >
            <h3
              className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>📖</span>
              <span>Orientaciones Pedagógicas MEN · Grado 5°</span>
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-white/95">
              Alineación curricular con los Estándares Básicos de Competencias (EBC) y Derechos Básicos de Aprendizaje (DBA).
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
            <h4
              className="font-black text-emerald-950 mb-1 text-base"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              🎯 Enfoque Pedagógico
            </h4>
            <p className="font-semibold text-emerald-900 text-xs sm:text-sm">
              El texto interactivo de 5° grado fomenta el tránsito desde la intuición aritmética y el pensamiento concreto hacia la formalización algebraica y el razonamiento proporcional.
            </p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2 shadow-xs">
            <div className="font-black text-gray-900 text-sm">
              Competencias Matemáticas Desarrolladas:
            </div>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-1.5 font-semibold">
              <li>
                <b>Comunicación y modelación:</b> Capacidad de traducir situaciones verbales y gráficas a expresiones aritméticas y ecuaciones básicas.
              </li>
              <li>
                <b>Razonamiento y argumentación:</b> Justificación del procedimiento mediante propiedades numéricas (conmutativa, distributiva, asociativa).
              </li>
              <li>
                <b>Resolución de problemas:</b> Aplicación en compras, presupuestos familiares, áreas de cultivo y análisis de encuestas cotidianas.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5">
            <div className="font-black text-[#5C21A6] text-xs uppercase tracking-wider">
              Recomendación para el Aula:
            </div>
            <p className="text-xs text-gray-800 font-semibold">
              Inicie cada sesión proyectando el <b>Laboratorio Visual</b> para que los estudiantes manipulen las cantidades en equipo antes de resolver los ejercicios individuales del libro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
