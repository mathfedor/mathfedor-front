'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';

type TabType = 'pensamientos' | 'estandares' | 'competencias' | 'dba';

export default function EstandaresScreen1ro() {
  const { goScreen } = useBook1();
  const [activeTab, setActiveTab] = useState<TabType>('pensamientos');

  return (
    <div
      style={{
        maxWidth: '1140px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 800,
          color: '#16876A',
          fontSize: '13px',
          marginBottom: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Volver al inicio
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0A3D28, #16876A)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '4px' }}>🇨🇴</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '0 0 4px',
          }}
        >
          Estándares M.E.N. Colombia · 1° Primaria
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          Lineamientos curriculares oficiales y Derechos Básicos de Aprendizaje (DBA).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'pensamientos', label: '🧠 Pensamientos' },
          { id: 'estandares', label: '📐 Estándares' },
          { id: 'competencias', label: '🎯 Competencias' },
          { id: 'dba', label: '📚 DBA 1°' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              padding: '8px 16px',
              borderRadius: '99px',
              border: activeTab === tab.id ? '2px solid #16876A' : '1.5px solid #E5E7EB',
              background: activeTab === tab.id ? '#DCF5EE' : '#FFFFFF',
              color: activeTab === tab.id ? '#074F3A' : '#4B5563',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Tabs */}
      <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1.5px solid #E5E7EB' }}>
        {activeTab === 'pensamientos' && (
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: '#074F3A', marginTop: 0 }}>
              Los 5 Pensamientos Matemáticos (Grado 1°)
            </h3>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8, fontSize: '14px', color: '#374151' }}>
              <li><strong>Pensamiento Numérico:</strong> Conteo del 1 al 99, valor posicional (decenas y unidades), suma y resta con y sin reagrupación.</li>
              <li><strong>Pensamiento Espacial:</strong> Posiciones espaciales (arriba, abajo, dentro, fuera, izquierda, derecha) y figuras geométricas básicas (círculo, cuadrado, triángulo, rectángulo).</li>
              <li><strong>Pensamiento Métrico:</strong> Comparación de longitudes, masas y capacidades (más largo que, más pesado que).</li>
              <li><strong>Pensamiento Aleatorio:</strong> Recolección y conteo de datos sencillos mediante pictogramas y tablas de conteo.</li>
              <li><strong>Pensamiento Variacional:</strong> Reconocimiento y continuación de secuencias numéricas y patrones visuales.</li>
            </ul>
          </div>
        )}

        {activeTab === 'estandares' && (
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: '#074F3A', marginTop: 0 }}>
              Estándares Básicos de Competencias
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
              El estudiante reconoce el significado del número en diferentes contextos (medición, conteo, comparación, codificación, localización) y describe, compara y cuantifica situaciones cotidianas usando números del 1 al 99.
            </p>
          </div>
        )}

        {activeTab === 'competencias' && (
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: '#074F3A', marginTop: 0 }}>
              Competencias Clave en 1°
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <div>🔹 <strong>Comunicación:</strong> Expresa oralmente y por escrito cantidades y relaciones numéricas.</div>
              <div>🔹 <strong>Razonamiento:</strong> Deduce qué número va antes, después o entre dos cantidades.</div>
              <div>🔹 <strong>Resolución de Problemas:</strong> Modela y soluciona problemas de adición (juntar, agregar) y sustracción (quitar, comparar).</div>
            </div>
          </div>
        )}

        {activeTab === 'dba' && (
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', fontWeight: 900, color: '#074F3A', marginTop: 0 }}>
              Derechos Básicos de Aprendizaje (DBA 1°)
            </h3>
            <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.8, fontSize: '14px', color: '#374151' }}>
              <li>Identifica los usos de los números (como código, cardinal, medida, ordinal) y las operaciones en contextos de juego y vida cotidiana.</li>
              <li>Utiliza diferentes estrategias para contar, realizar operaciones (suma y resta) y resolver problemas aditivos.</li>
              <li>Compara y ordena objetos de acuerdo con su longitud, peso, capacidad y superficie.</li>
              <li>Clasifica y organiza datos en tablas de conteo y pictogramas sencillos.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
