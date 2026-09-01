import React from 'react';
import { EstadoEstacion } from '../types/estacion.types';
import { pesos } from '../data/estacion-data';

interface EstacionMonitorScreenProps {
  estado: EstadoEstacion;
}

export default function EstacionMonitorScreen({ estado }: EstacionMonitorScreenProps) {
  // Agrupar gastos por día
  const gastosPorDia: Record<number, number> = {};
  for (let d = 1; d <= Math.max(estado.dia, 5); d++) {
    gastosPorDia[d] = 0;
  }
  estado.bitacora.forEach((b) => {
    gastosPorDia[b.dia] = (gastosPorDia[b.dia] || 0) + b.costo;
  });

  const dias = Object.keys(gastosPorDia).map(Number).sort((a, b) => a - b);
  const valores = dias.map((d) => gastosPorDia[d]);
  const maxGasto = Math.max(...valores, 1000);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          📊 Monitor Financiero
        </h2>
        <p className="text-sm text-[#8FA3D9] mt-1">
          Gráfica de gastos diarios realizados en la Tienda Estelar
        </p>
      </div>

      <div className="bg-[#0E1638] p-6 rounded-3xl border-3 border-[#1A2650] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#4FD8CB]">Gastos por Día</span>
          <span className="text-xs text-[#8FA3D9]">Total gastado: {pesos(valores.reduce((a, b) => a + b, 0))}</span>
        </div>

        {/* Gráfica de Barras SVG */}
        <div className="w-full flex justify-center py-4">
          <svg viewBox="0 0 450 200" className="w-full max-w-[500px] h-auto" aria-hidden="true">
            {/* Ejes y líneas de cuadrícula */}
            {[0, 0.5, 1].map((p, idx) => {
              const y = 160 - p * 130;
              return (
                <g key={idx}>
                  <line x1="45" y1={y} x2="430" y2={y} stroke="rgba(185,196,232,.15)" strokeWidth="1" />
                  <text
                    x="40"
                    y={y + 4}
                    textAnchor="end"
                    fontFamily="Nunito, sans-serif"
                    fontWeight="700"
                    fontSize="10"
                    fill="#8FA3D9"
                  >
                    {pesos(maxGasto * p)}
                  </text>
                </g>
              );
            })}

            {/* Barras de Días */}
            {dias.map((d, idx) => {
              const val = gastosPorDia[d] || 0;
              const barH = (val / maxGasto) * 130;
              const x = 60 + idx * 75;
              const y = 160 - barH;
              const esDiaActual = d === estado.dia;

              return (
                <g key={d}>
                  <rect
                    x={x}
                    y={y}
                    width="44"
                    height={Math.max(barH, 4)}
                    rx="8"
                    fill={esDiaActual ? '#FFC94D' : '#4FD8CB'}
                    stroke="#070C1F"
                    strokeWidth="2.5"
                  />
                  <text
                    x={x + 22}
                    y="180"
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="12"
                    fill="#F2F6FF"
                  >
                    Día {d}
                  </text>
                  {val > 0 && (
                    <text
                      x={x + 22}
                      y={y - 6}
                      textAnchor="middle"
                      fontFamily="'Baloo 2', sans-serif"
                      fontWeight="800"
                      fontSize="10"
                      fill="#FFC94D"
                    >
                      {pesos(val)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
