'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importar Plotly dinámicamente para evitar problemas de SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function MathGraph3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generar datos para la función 7xy/e^(x^2 + y^2)
  const generateData = () => {
    const resolution = 40;
    const xRange = [-2, 2]; // Ajustar para mejor visualización
    const yRange = [-2, 2];
    
    const x = [];
    const y = [];
    const z = [];
    
    for (let i = 0; i <= resolution; i++) {
      const xVal = xRange[0] + (i / resolution) * (xRange[1] - xRange[0]);
      const row = [];
      x.push(xVal);
      for (let j = 0; j <= resolution; j++) {
        const yVal = yRange[0] + (j / resolution) * (yRange[1] - yRange[0]);
        if (i === 0) {
          y.push(yVal);
        }
        const r2 = xVal * xVal + yVal * yVal;
        const zVal = 7 * xVal * yVal / Math.exp(r2);
        row.push(zVal);
      }
      z.push(row);
    }
    
    return { x, y, z };
  };

  const data = generateData();

  // Opciones de configuración para el gráfico
  const layout = {
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: { title: 'X', showgrid: true, gridwidth: 1, gridcolor: 'rgba(0,0,0,0.1)' },
      yaxis: { title: 'Y', showgrid: true, gridwidth: 1, gridcolor: 'rgba(0,0,0,0.1)' },
      zaxis: { title: 'Z', showgrid: true, gridwidth: 1, gridcolor: 'rgba(0,0,0,0.1)' },
      camera: {
        eye: { x: 0.75, y: 0.75, z: 0.75 }
      },
      aspectratio: { x: 1, y: 1, z: 0.8 }
    },
    paper_bgcolor: 'rgba(255,255,255,1)',
    plot_bgcolor: 'rgba(255,255,255,1)'
  };

  const config = {
    displayModeBar: false, // Ocultar la barra de herramientas
    responsive: true
  };

  if (!mounted) return <div className="w-full h-full bg-gray-100"></div>;

  return (
    <div className="w-full h-full">
      <Plot
        data={[
          {
            type: 'surface',
            x: data.x,
            y: data.y,
            z: data.z,
            colorscale: [
              [0, 'rgb(70, 50, 120)'],      // Morado oscuro
              [0.2, 'rgb(110, 80, 170)'],   // Morado medio
              [0.4, 'rgb(65, 105, 225)'],   // Azul royal
              [0.6, 'rgb(30, 144, 255)'],   // Azul brillante
              [0.8, 'rgb(254, 213, 255)'],  // Naranja pálido (Papaya Whip)
              [1, 'rgb(255, 248, 240)']     // Naranja muy pálido (casi blanco)
            ],
            showscale: false,
            lighting: {
              roughness: 0.2,
              fresnel: 0.8
            },
            contours: {
              x: { show: true, width: 2, color: 'rgba(0,0,0,0.3)' },
              y: { show: true, width: 2, color: 'rgba(0,0,0,0.3)' },
              z: { show: true, width: 2, color: 'rgba(0,0,0,0.3)' }
            }
          }
        ]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
        useResizeHandler={true}
      />
    </div>
  );
} 