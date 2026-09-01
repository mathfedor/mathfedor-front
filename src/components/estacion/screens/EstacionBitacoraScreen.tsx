import React from 'react';
import { EstadoEstacion } from '../types/estacion.types';
import { pesos } from '../data/estacion-data';

interface EstacionBitacoraScreenProps {
  estado: EstadoEstacion;
}

export default function EstacionBitacoraScreen({ estado }: EstacionBitacoraScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          📓 Bitácora del Cadete
        </h2>
        <p className="text-sm text-[#8FA3D9] mt-1">
          Registro cronológico de tus compras y movimientos en la Estación Fedor
        </p>
      </div>

      {estado.bitacora.length === 0 ? (
        <div className="bg-[#0E1638] p-8 rounded-3xl border-2 border-[#1A2650] text-center">
          <p className="text-[#8FA3D9] text-base">
            Tu bitácora está vacía. ¡Visita la Tienda Estelar para comprar y registrar tus productos!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {estado.bitacora.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0E1638] p-4 rounded-2xl border-2 border-[#1A2650] flex items-center justify-between flex-wrap gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#1A2650] text-[#4FD8CB] font-black flex items-center justify-center text-xs">
                  D{item.dia}
                </span>
                <div>
                  <h4 className="font-bold text-white text-base">{item.item}</h4>
                  <p className="text-xs text-[#8FA3D9]">
                    Pagó con: {pesos(item.pago)} · Cambio: {pesos(item.cambio)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm md:text-base font-black text-[#FFC94D] font-mono">
                  -{pesos(item.costo)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
