import React, { useState } from 'react';
import { EstadoEstacion } from '../types/estacion.types';
import { MODULOS, pesos } from '../data/estacion-data';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionDocenteScreenProps {
  estado: EstadoEstacion;
}

export default function EstacionDocenteScreen({ estado }: EstacionDocenteScreenProps) {
  const [copiado, setCopiado] = useState(false);

  const totalEstrellas = Object.values(estado.progreso).reduce((a, b) => a + b, 0);
  const totalMisionesCompletadas = Object.keys(estado.progreso).length;
  const totalPosibles = MODULOS.reduce((a, m) => a + m.niveles.length, 0);

  const totalIntentos = Object.values(estado.registro).reduce((a, b) => a + b.int, 0);
  const totalAciertos = Object.values(estado.registro).reduce((a, b) => a + b.ok, 0);
  const precision = totalIntentos > 0 ? Math.round((totalAciertos / totalIntentos) * 100) : 100;
  const tiempoTotalSeg = Object.values(estado.registro).reduce((a, b) => a + b.seg, 0);

  const handleCopiarReporte = () => {
    estacionAudio.click();
    const dataReporte = {
      estudiante: estado.nombre,
      fecha: new Date().toISOString(),
      saldo: estado.saldo,
      estrellas: totalEstrellas,
      misionesCompletadas: `${totalMisionesCompletadas}/${totalPosibles}`,
      precision: `${precision}%`,
      tiempoTotalMinutos: Math.round(tiempoTotalSeg / 60),
      progresoPorModulo: MODULOS.map((m) => ({
        modulo: m.nombre,
        estrellas: m.niveles.reduce((a, _, i) => a + (estado.progreso[`${m.id}-${i}`] || 0), 0),
      })),
      comprasBitacora: estado.bitacora,
    };

    void navigator.clipboard.writeText(JSON.stringify(dataReporte, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            👩‍🏫 Panel Docente y Métricas
          </h2>
          <p className="text-sm text-[#8FA3D9] mt-1">
            Informe detallado de progreso, precisión y bitácora del estudiante
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopiarReporte}
          className="px-5 py-2.5 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-xl text-xs flex items-center gap-2 shadow"
        >
          <span>{copiado ? '✓ Copiado al portapapeles' : '📋 Copiar Reporte JSON'}</span>
        </button>
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E1638] p-4 rounded-2xl border-2 border-[#1A2650] text-center">
          <span className="text-xs text-[#8FA3D9] uppercase font-bold">Estrellas</span>
          <p className="text-2xl md:text-3xl font-black text-[#FFC94D] mt-1">★ {totalEstrellas}</p>
        </div>
        <div className="bg-[#0E1638] p-4 rounded-2xl border-2 border-[#1A2650] text-center">
          <span className="text-xs text-[#8FA3D9] uppercase font-bold">Misiones</span>
          <p className="text-2xl md:text-3xl font-black text-[#4FD8CB] mt-1">
            {totalMisionesCompletadas}/{totalPosibles}
          </p>
        </div>
        <div className="bg-[#0E1638] p-4 rounded-2xl border-2 border-[#1A2650] text-center">
          <span className="text-xs text-[#8FA3D9] uppercase font-bold">Precisión</span>
          <p className="text-2xl md:text-3xl font-black text-[#5BD672] mt-1">{precision}%</p>
        </div>
        <div className="bg-[#0E1638] p-4 rounded-2xl border-2 border-[#1A2650] text-center">
          <span className="text-xs text-[#8FA3D9] uppercase font-bold">Saldo</span>
          <p className="text-xl md:text-2xl font-black text-white mt-1">{pesos(estado.saldo)}</p>
        </div>
      </div>

      {/* Progreso por Estación */}
      <div className="bg-[#0E1638] p-6 rounded-3xl border-3 border-[#1A2650]">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Rendimiento por Estación Orbital
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULOS.map((m) => {
            const estrellas = m.niveles.reduce(
              (a, _, i) => a + (estado.progreso[`${m.id}-${i}`] || 0),
              0
            );
            const maxE = m.niveles.length * 3;
            const pct = Math.round((estrellas / maxE) * 100);

            return (
              <div
                key={m.id}
                className="bg-[#070C1F]/60 p-3.5 rounded-xl border border-[#1A2650] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: m.color + '22' }}>
                    <svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true">
                      <use href={`#${m.icono}`} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs md:text-sm">{m.nombre}</h4>
                    <p className="text-[11px] text-[#8FA3D9]">★ {estrellas} de {maxE} estrellas</p>
                  </div>
                </div>

                <span className="text-xs font-black text-[#4FD8CB] font-mono">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
