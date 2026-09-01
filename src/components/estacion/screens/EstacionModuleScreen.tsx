import React from 'react';
import { ModuloEstacion, NivelData, EstadoEstacion } from '../types/estacion.types';
import { BANDAS, PAGO_ESTRELLA, pesos } from '../data/estacion-data';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionModuleScreenProps {
  modulo: ModuloEstacion;
  estado: EstadoEstacion;
  onSelectNivel: (n: NivelData, ni: number) => void;
  onVolverMapa: () => void;
}

export default function EstacionModuleScreen({
  modulo,
  estado,
  onSelectNivel,
  onVolverMapa,
}: EstacionModuleScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Botón Volver y Cabecera del Módulo */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            estacionAudio.click();
            onVolverMapa();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl border-2 border-[#070C1F] shadow transition-transform active:scale-95"
        >
          <span>←</span>
          <span>Volver al Mapa</span>
        </button>
      </div>

      <div
        className="flex items-center gap-4 p-6 rounded-3xl border-4 border-[#070C1F] shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #101B42 0%, #1A2650 100%)',
          borderColor: modulo.color,
        }}
      >
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
            <use href={`#${modulo.icono}`} />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {modulo.nombre}
          </h2>
          <p className="text-sm md:text-base text-[#B9C4E8] mt-1">{modulo.desc}</p>
        </div>
      </div>

      {/* Rejilla de Misiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modulo.niveles.map((n, ni) => {
          const nivelId = `${modulo.id}-${ni}`;
          const e = estado.progreso[nivelId] || 0;
          return (
            <button
              key={ni}
              type="button"
              onClick={() => {
                estacionAudio.click();
                onSelectNivel(n, ni);
              }}
              className="flex flex-col text-left p-5 rounded-2xl border-3 border-[#070C1F] bg-[#0E1638] hover:bg-[#162354] transition-all hover:scale-[1.02] shadow-lg cursor-pointer group"
              style={{ borderLeft: `6px solid ${modulo.color}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[#1A2650] text-[#4FD8CB]">
                  {n.et || BANDAS[ni]}
                </span>
                <div className="flex text-lg">
                  {[1, 2, 3].map((star) => (
                    <span
                      key={star}
                      className={star <= e ? 'text-[#FFC94D]' : 'text-gray-600'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#4FD8CB] transition-colors" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {n.t}
              </h3>
              <p className="text-xs md:text-sm text-[#8FA3D9] mt-1 line-clamp-2">{n.o}</p>

              <div className="mt-4 pt-3 border-t border-[#1F2C5C] flex items-center justify-between text-xs">
                {n.ahorro ? (
                  <span className="font-bold text-[#FFC94D]">🏦 Paga por pregunta</span>
                ) : e < 3 ? (
                  <span className="font-bold text-[#5BD672]">
                    💎 Recompensa: +{pesos((3 - e) * PAGO_ESTRELLA)}
                  </span>
                ) : (
                  <span className="text-[#8FA3D9] font-medium">✓ Misión completada</span>
                )}
                <span className="text-[#4FD8CB] font-bold group-hover:translate-x-1 transition-transform">
                  Jugar →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
