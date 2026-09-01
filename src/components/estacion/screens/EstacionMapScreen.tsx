import React from 'react';
import { ModuloEstacion, EstadoEstacion } from '../types/estacion.types';
import { MODULOS, POS } from '../data/estacion-data';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionMapScreenProps {
  estado: EstadoEstacion;
  onSelectModulo: (m: ModuloEstacion) => void;
}

export default function EstacionMapScreen({
  estado,
  onSelectModulo,
}: EstacionMapScreenProps) {
  const estrellasModulo = (m: ModuloEstacion) => {
    return m.niveles.reduce((a, _, i) => a + (estado.progreso[`${m.id}-${i}`] || 0), 0);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          🛰️ Estaciones de la Órbita Fedor
        </h2>
        <p className="text-sm md:text-base text-[#B9C4E8]">
          Selecciona una estación para iniciar sus misiones matemáticas y ganar gemas 💎
        </p>
      </div>

      <div className="w-full max-w-[1000px] aspect-[1000/620] relative bg-[#070C1F]/80 rounded-3xl border-4 border-[#1A2650] shadow-2xl overflow-hidden">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full select-none"
          id="mapa"
          aria-label="Mapa orbital de la Estación Fedor"
        >
          {/* Fondo espacial: estrellas y órbitas */}
          <ellipse
            cx="500"
            cy="310"
            rx="400"
            ry="210"
            fill="none"
            stroke="rgba(79, 216, 203, 0.12)"
            strokeWidth="3"
            strokeDasharray="6 8"
          />
          <ellipse
            cx="500"
            cy="310"
            rx="270"
            ry="140"
            fill="none"
            stroke="rgba(255, 201, 77, 0.1)"
            strokeWidth="2.5"
            strokeDasharray="4 6"
          />

          {/* Núcleo Central de la Estación */}
          <g transform="translate(500, 310)">
            <circle cx="0" cy="0" r="54" fill="#0E1638" stroke="#070C1F" strokeWidth="4" />
            <circle cx="0" cy="0" r="44" fill="url(#halo)" />
            <circle cx="0" cy="0" r="36" fill="#172454" stroke="#4FD8CB" strokeWidth="2.5" strokeDasharray="5 3" />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fontFamily="'Baloo 2', sans-serif"
              fontWeight="800"
              fontSize="16"
              fill="#F2F6FF"
            >
              FEDOR
            </text>
            <text
              x="0"
              y="20"
              textAnchor="middle"
              fontFamily="'Baloo 2', sans-serif"
              fontWeight="800"
              fontSize="10"
              fill="#4FD8CB"
            >
              BASE CORE
            </text>
          </g>

          {/* 8 Estaciones Orbitantes */}
          {MODULOS.map((m, i) => {
            const [x, y] = POS[i];
            const est = estrellasModulo(m);
            const maxE = m.niveles.length * 3;
            const comp = est === maxE;
            const C = 2 * Math.PI * 50;
            const [l1, l2] = m.mapa;

            return (
              <g
                key={m.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 origin-center"
                style={{ transformOrigin: `${x}px ${y}px` }}
                tabIndex={0}
                role="button"
                aria-label={`${m.nombre}, ${est} de ${maxE} estrellas`}
                onClick={() => {
                  estacionAudio.click();
                  onSelectModulo(m);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    estacionAudio.click();
                    onSelectModulo(m);
                  }
                }}
              >
                {comp && <circle cx={x} cy={y} r="72" fill="url(#halo)" />}
                {/* Cápsula */}
                <circle
                  cx={x}
                  cy={y}
                  r="50"
                  fill={est > 0 ? '#173B2C' : '#1A2650'}
                  stroke="#070C1F"
                  strokeWidth="5"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="40"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="1.6"
                  strokeDasharray="3 7"
                  opacity="0.45"
                />
                {/* Anillo de progreso */}
                <circle cx={x} cy={y} r="50" fill="none" stroke="rgba(7,12,31,.55)" strokeWidth="5" />
                {est > 0 && (
                  <circle
                    cx={x}
                    cy={y}
                    r="50"
                    fill="none"
                    stroke={m.color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(C * est) / maxE} ${C}`}
                    transform={`rotate(-90 ${x} ${y})`}
                  />
                )}
                <circle cx={x} cy={y - 2} r="33" fill={m.color} opacity="0.16" />
                <use href={`#${m.icono}`} x={x - 32} y={y - 36} width="64" height="64" />

                {/* Insignia de estrellas */}
                <rect
                  x={x - 33}
                  y={y + 34}
                  width="66"
                  height="24"
                  rx="12"
                  fill="#0A1028"
                  stroke="#070C1F"
                  strokeWidth="3"
                />
                <text
                  x={x}
                  y={y + 51}
                  textAnchor="middle"
                  fontFamily="'Baloo 2', sans-serif"
                  fontWeight="800"
                  fontSize="13.5"
                  fill={est > 0 ? '#FFC94D' : '#8B97BD'}
                >
                  ★ {est}/{maxE}
                </text>

                {/* Placa del nombre */}
                <rect
                  x={x - 80}
                  y={y + 66}
                  width="160"
                  height={l2 ? 46 : 34}
                  rx="12"
                  fill="#0A1028"
                  stroke="#070C1F"
                  strokeWidth="3.5"
                />
                <circle
                  cx={x - 66}
                  cy={y + (l2 ? 89 : 83)}
                  r="5"
                  fill={m.color}
                  stroke="#070C1F"
                  strokeWidth="2"
                />
                {l2 ? (
                  <>
                    <text
                      x={x + 6}
                      y={y + 86}
                      textAnchor="middle"
                      fontFamily="'Baloo 2', sans-serif"
                      fontWeight="800"
                      fontSize="15"
                      fill="#F2F6FF"
                    >
                      {l1}
                    </text>
                    <text
                      x={x + 6}
                      y={y + 104}
                      textAnchor="middle"
                      fontFamily="'Baloo 2', sans-serif"
                      fontWeight="800"
                      fontSize="15"
                      fill="#F2F6FF"
                    >
                      {l2}
                    </text>
                  </>
                ) : (
                  <text
                    x={x + 6}
                    y={y + 89}
                    textAnchor="middle"
                    fontFamily="'Baloo 2', sans-serif"
                    fontWeight="800"
                    fontSize="15"
                    fill="#F2F6FF"
                  >
                    {l1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
