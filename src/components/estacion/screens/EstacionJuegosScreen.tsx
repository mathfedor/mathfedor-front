import React, { useState, useEffect } from 'react';
import { JuegoZona } from '../types/estacion.types';
import { JUEGOS_ZONA } from '../data/estacion-data';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionJuegosScreenProps {
  onGanarGemas: (gemas: number) => void;
}

export default function EstacionJuegosScreen({ onGanarGemas }: EstacionJuegosScreenProps) {
  const [juegoActivo, setJuegoActivo] = useState<JuegoZona | null>(null);

  useEffect(() => {
    const handleMensaje = (e: MessageEvent) => {
      const data = e.data;
      if (data && typeof data === 'object') {
        if (data.evento === 'juego_completado' || data.evento === 'gemas_ganadas') {
          const gemas = Number(data.gemas || data.pago || 500);
          onGanarGemas(gemas);
          estacionAudio.victoria();
        }
      }
    };

    window.addEventListener('message', handleMensaje);
    return () => window.removeEventListener('message', handleMensaje);
  }, [onGanarGemas]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          🕹️ Zona de Mini-Juegos Estelares
        </h2>
        <p className="text-sm text-[#8FA3D9] mt-1">
          Compite y juega para ganar gemas 💎 adicionales para tu alcancía
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JUEGOS_ZONA.map((juego) => (
          <div
            key={juego.id}
            className="flex flex-col justify-between p-5 rounded-2xl border-3 border-[#070C1F] bg-[#0E1638] hover:bg-[#162354] transition-all hover:scale-[1.02] shadow-lg"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{juego.emoji}</span>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {juego.nombre}
                </h3>
              </div>
              <p className="text-xs md:text-sm text-[#8FA3D9] mt-1">{juego.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1F2C5C] flex items-center justify-between">
              <span className="text-xs font-black text-[#5BD672]">💎 Otorga gemas al ganar</span>
              <button
                type="button"
                onClick={() => {
                  estacionAudio.click();
                  setJuegoActivo(juego);
                }}
                className="px-4 py-2 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-xl text-xs shadow transition-transform active:scale-95 cursor-pointer"
              >
                Jugar Ahora →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal del Juego Activo */}
      {juegoActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#070C1F] rounded-3xl border-4 border-[#1A2650] overflow-hidden flex flex-col shadow-2xl">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-4 bg-[#0E1638] border-b-2 border-[#1A2650]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{juegoActivo.emoji}</span>
                <span className="text-base font-bold text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {juegoActivo.nombre}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  estacionAudio.click();
                  setJuegoActivo(null);
                }}
                className="px-3 py-1.5 bg-[#FF6B5E] hover:bg-[#E04B38] text-white font-black rounded-xl text-xs shadow"
              >
                ✕ Cerrar Juego
              </button>
            </div>

            {/* Iframe del Minijuego */}
            <div className="flex-1 w-full h-full bg-[#050814]">
              <iframe
                src={juegoActivo.archivo}
                title={juegoActivo.nombre}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
