'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';

const DEFINICIONES_1RO = [
  { term: 'Adición', def: 'Operación que consiste en juntar dos o más cantidades.', cat: 'Aritmética' },
  { term: 'Centena', def: 'Conjunto de 100 unidades o 10 decenas.', cat: 'Numeración' },
  { term: 'Círculo', def: 'Figura geométrica redonda y plana sin lados rectos ni esquinas.', cat: 'Geometría' },
  { term: 'Cuadrado', def: 'Figura geométrica plana con 4 lados rectos iguales y 4 esquinas.', cat: 'Geometría' },
  { term: 'Decena', def: 'Grupo formado por exactamente 10 unidades.', cat: 'Numeración' },
  { term: 'Diferencia', def: 'El resultado que se obtiene al hacer una resta.', cat: 'Aritmética' },
  { term: 'Docena', def: 'Conjunto formado por 12 elementos.', cat: 'Numeración' },
  { term: 'Igual (=)', def: 'Signo que indica que dos cantidades o valores son los mismos.', cat: 'Símbolos' },
  { term: 'Mayor que (>)', def: 'Signo que indica que un número tiene más valor que otro.', cat: 'Símbolos' },
  { term: 'Menor que (<)', def: 'Signo que indica que un número tiene menos valor que otro.', cat: 'Símbolos' },
  { term: 'Rectángulo', def: 'Figura de 4 lados con dos lados largos y dos lados cortos.', cat: 'Geometría' },
  { term: 'Secuencia', def: 'Orden de números u objetos que sigue una regla fija o patrón.', cat: 'Patrones' },
  { term: 'Suma', def: 'El total o resultado de sumar dos o más números.', cat: 'Aritmética' },
  { term: 'Sustracción', def: 'Operación que consiste en quitar una cantidad de otra.', cat: 'Aritmética' },
  { term: 'Triángulo', def: 'Figura geométrica plana que tiene 3 lados y 3 esquinas.', cat: 'Geometría' },
  { term: 'Unidad', def: 'El elemento más pequeño que se usa para contar (del 0 al 9).', cat: 'Numeración' },
];

export default function DefinicionesScreen1ro() {
  const { goScreen } = useBook1();
  const [search, setSearch] = useState('');

  const filtered = DEFINICIONES_1RO.filter(
    (d) =>
      d.term.toLowerCase().includes(search.toLowerCase()) ||
      d.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: '760px',
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
          background: 'linear-gradient(135deg, #5A0A28, #C94B22)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '28px' }}>📖</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            margin: '4px 0',
          }}
        >
          Diccionario Matemático de 1°
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Glosario de términos y definiciones clave de matemáticas.
        </p>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: '1.2rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar término o palabra..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '2px solid #E5E7EB',
            fontSize: '14px',
            fontWeight: 700,
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {filtered.map((item) => (
          <div
            key={item.term}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1.5px solid #E5E7EB',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '15px', color: '#074F3A', fontFamily: "'Baloo 2', sans-serif" }}>
                {item.term}
              </strong>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#FF8C2A', background: '#FEF3E8', padding: '2px 6px', borderRadius: '6px' }}>
                {item.cat}
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#4B5563', margin: 0, lineHeight: 1.4 }}>
              {item.def}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
