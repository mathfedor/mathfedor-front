'use client';

import React from 'react';

interface ExamenIntegradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: () => void;
}

export default function ExamenIntegradorModal({
  isOpen,
  onClose,
  onStartExam,
}: ExamenIntegradorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(15,5,40,0.92)] z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="examen-modal-title"
    >
      <div className="bg-white max-w-[500px] w-full rounded-[18px] overflow-hidden text-center shadow-2xl animate-scale-up">
        {/* Cabecera Gradiente Fucsia / Rojo */}
        <div className="bg-gradient-to-br from-[#A30041] to-[#FF1D4E] text-white py-6 px-5 flex flex-col items-center justify-center">
          <div className="text-5xl md:text-6xl select-none">📝</div>
          <div
            id="examen-modal-title"
            className="font-black text-2xl mt-2 tracking-wide"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Examen Final Integrador
          </div>
          <div className="text-xs text-white/90 font-bold mt-1 tracking-wider uppercase">
            20 preguntas de todas las unidades
          </div>
        </div>

        {/* Contenido / Información de Certificación */}
        <div className="p-6 text-[#3D1054] text-left">
          <p className="text-sm text-[#3D1054] leading-relaxed text-center font-medium">
            Al completar este examen recibirás un{' '}
            <strong className="font-extrabold text-[#7B2FBE]">certificado descargable</strong> con tu puntaje y rango.
          </p>

          <ul className="text-xs md:text-sm text-[#3D1054] leading-loose pl-6 my-4 list-disc space-y-1 font-semibold">
            <li>
              <span className="font-mono font-bold">≥ 90%</span> → 🏆 <strong className="font-bold">Con Excelencia</strong>
            </li>
            <li>
              <span className="font-mono font-bold">≥ 70%</span> → ⭐ <strong className="font-bold">Satisfactoriamente</strong>
            </li>
            <li>
              <span className="font-mono font-bold">&lt; 70%</span> → 🌟 <strong className="font-bold">Con Dedicación</strong>
            </li>
          </ul>

          {/* Botones de Acción */}
          <div className="flex flex-col gap-2 mt-5">
            <button
              type="button"
              onClick={onStartExam}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#A30041] to-[#FF1D4E] hover:from-[#8A0037] hover:to-[#E61543] text-white border-none rounded-xl font-black font-sans cursor-pointer text-base shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>📝</span> Empezar examen
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#6C28B4] border-2 border-[#7B2FBE] rounded-xl font-black font-sans cursor-pointer text-sm transition-colors"
            >
              ← Volver al Menú Principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
