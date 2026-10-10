'use client';

import React, { useState, useEffect } from 'react';

interface CurriculoModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── DATOS OFICIALES DEL CURRÍCULO MEN COLOMBIA · GRADO 4° ──
const PENSAMIENTOS_DATA = [
  {
    id: 'numerico',
    nombre: 'Pensamiento numérico y sistemas numéricos',
    desc: 'Comprensión del uso y significados de los números y numeración; comprensión del sentido de las operaciones y relaciones numéricas, y desarrollo de técnicas de cálculo y estimación.',
  },
  {
    id: 'variacional',
    nombre: 'Pensamiento variacional y sistemas algebraicos y analíticos',
    desc: 'Reconocimiento, percepción, identificación y caracterización de la variación y el cambio en diferentes contextos, así como su descripción, modelación y representación en registros simbólicos.',
  },
  {
    id: 'espacial',
    nombre: 'Pensamiento espacial y sistemas geométricos',
    desc: 'Construcción y manipulación de representaciones mentales de objetos en el espacio, relaciones entre ellos, sus transformaciones, y traducciones materiales en dos y tres dimensiones.',
  },
  {
    id: 'metrico',
    nombre: 'Pensamiento métrico y sistemas de medidas',
    desc: 'Comprensión de magnitudes y cantidades, su medición y el uso flexible de sistemas métricos o de medidas en diferentes situaciones cotidianas y científicas.',
  },
  {
    id: 'aleatorio',
    nombre: 'Pensamiento aleatorio y sistemas de datos',
    desc: 'Toma de decisiones en situaciones de incertidumbre o azar apoyándose en conceptos de probabilidad, estadística descriptiva y combinatoria.',
  },
];

const ESTANDARES_DATA: Record<string, string[]> = {
  numerico: [
    'Interpreto las fracciones en diferentes contextos: situaciones de medición, relaciones parte-todo, cociente, razones y proporciones.',
    'Identifico y uso medidas relativas en distintos contextos.',
    'Utilizo la notación decimal para expresar fracciones en diferentes contextos y relaciono estas dos notaciones con la de los porcentajes.',
    'Justifico el valor de posición en el sistema de numeración decimal en relación con el conteo recurrente de unidades.',
    'Resuelvo y formulo problemas cuya estrategia de solución requiera de las relaciones y propiedades de los números naturales y sus operaciones.',
    'Resuelvo y formulo problemas en situaciones aditivas de composición, transformación, comparación e igualación.',
    'Resuelvo y formulo problemas en situaciones de proporcionalidad directa, inversa y producto de medidas.',
    'Identifico la potenciación y la radicación en contextos matemáticos y no matemáticos.',
    'Uso diversas estrategias de cálculo y de estimación para resolver problemas en situaciones aditivas y multiplicativas.',
    'Justifico regularidades y propiedades de los números, sus relaciones y operaciones.',
  ],
  variacional: [
    'Describo e interpreto variaciones representadas en gráficos.',
    'Predigo patrones de variación en una secuencia numérica, geométrica o gráfica.',
    'Represento y relaciono patrones numéricos con tablas y reglas verbales.',
    'Analizo y explico relaciones de dependencia entre cantidades que varían en el tiempo con cierta regularidad.',
    'Construyo igualdades y desigualdades numéricas como representación de relaciones entre distintos datos.',
  ],
  espacial: [
    'Comparo y clasifico objetos tridimensionales de acuerdo con componentes (caras, lados) y propiedades.',
    'Comparo y clasifico figuras bidimensionales de acuerdo con sus componentes (ángulos, vértices) y características.',
    'Identifico, represento y utilizo ángulos en giros, aberturas, inclinaciones, figuras, puntas y esquinas.',
    'Utilizo sistemas de coordenadas para especificar localizaciones y describir relaciones espaciales.',
    'Identifico y justifico relaciones de congruencia y semejanza entre figuras.',
    'Construyo y descompongo figuras y sólidos a partir de condiciones dadas.',
    'Conjeturo y verifico los resultados de aplicar transformaciones a figuras en el plano para construir diseños.',
  ],
  metrico: [
    'Diferencio y ordeno, en objetos y eventos, propiedades o atributos que se puedan medir (longitud, área, volumen, masa, duración).',
    'Selecciono unidades, tanto convencionales como estandarizadas, apropiadas para diferentes mediciones.',
    'Utilizo y justifico el uso de la estimación para resolver problemas utilizando rangos de variación.',
    'Utilizo diferentes procedimientos de cálculo para hallar el área de la superficie exterior y el volumen de cuerpos sólidos.',
    'Justifico relaciones de dependencia del área y volumen, respecto a las dimensiones de figuras y sólidos.',
    'Describo y argumento relaciones entre el perímetro y el área de figuras diferentes, cuando se fija una de estas medidas.',
  ],
  aleatorio: [
    'Represento datos usando tablas y gráficas (pictogramas, gráficas de barras, diagramas de líneas, circulares).',
    'Comparo diferentes representaciones del mismo conjunto de datos.',
    'Interpreto información presentada en tablas y gráficas estadísticas.',
    'Conjeturo y pongo a prueba predicciones acerca de la posibilidad de ocurrencia de eventos.',
    'Describo la manera como parecen distribuirse los distintos datos de un conjunto de ellos.',
    'Uso e interpreto la media (o promedio) y la mediana y comparo lo que indican.',
    'Resuelvo y formulo problemas a partir de un conjunto de datos provenientes de observaciones o experimentos.',
  ],
};

const COMPETENCIAS_DATA = [
  {
    nombre: 'Formulación, tratamiento y resolución de problemas',
    desc: 'Eje organizador donde el quehacer matemático cobra sentido; desarrolla actitud perseverante, estrategias de solución y verificación de resultados.',
  },
  {
    nombre: 'La modelación',
    desc: 'Construcción de esquemas y modelos matemáticos de la realidad para identificar variables y realizar predicciones.',
  },
  {
    nombre: 'La comunicación',
    desc: 'Expresión, representación e interpretación de ideas, problemas y conjeturas a través del lenguaje matemático.',
  },
  {
    nombre: 'El razonamiento',
    desc: 'Percepción de regularidades, formulación de conjeturas, justificación de argumentos y validación de conclusiones.',
  },
  {
    nombre: 'Formulación, comparación y ejercitación de procedimientos',
    desc: 'Ejecución segura, ágil y reflexiva de algoritmos y procedimientos matemáticos adaptados al contexto.',
  },
];

const DESEMPENO_DATA = [
  { nivel: 'Insuficiente', desc: 'No demuestra desempeños mínimos de la prueba Saber (100 a 264 pts).' },
  { nivel: 'Mínimo', desc: 'Utiliza operaciones básicas para resolver problemas, identifica mediciones y clasifica datos (265 a 330 pts).' },
  { nivel: 'Satisfactorio', desc: 'Nivel esperado: modela dependencia lineal, calcula áreas y perímetros, halla media y formula conjeturas (331 a 396 pts).' },
  { nivel: 'Avanzado', desc: 'Estructura multiplicativa avanzada, fracción como operador, compara sólidos y analiza probabilidad (397 a 500 pts).' },
];

const DBA_DATA = [
  {
    n: 1,
    p: 'Numérico',
    t: 'Interpreta y utiliza los números naturales y racionales en su representación fraccionaria para formular y resolver problemas aditivos, multiplicativos y que involucren operaciones de potenciación.',
    ev: [
      'Interpreta la relación parte-todo y la representa por medio de fracciones, razones o cocientes.',
      'Interpreta y utiliza números naturales y racionales asociados con un contexto para solucionar problemas.',
      'Determina las operaciones suficientes y necesarias para solucionar diferentes tipos de problemas.',
      'Resuelve problemas que requieran reconocer un patrón de medida asociado a un número natural o racional.',
    ],
  },
  {
    n: 2,
    p: 'Numérico',
    t: 'Describe y desarrolla estrategias (algoritmos, propiedades de las operaciones básicas y sus relaciones) para hacer estimaciones y cálculos al solucionar problemas de potenciación.',
    ev: [
      'Utiliza las propiedades de las operaciones con números naturales y fraccionarios para justificar estrategias de cálculo.',
      'Descompone un número en sus factores primos.',
      'Identifica y utiliza las propiedades de la potenciación para resolver problemas aritméticos.',
      'Determina y argumenta acerca de la validez o no de estrategias para calcular potencias.',
    ],
  },
  {
    n: 3,
    p: 'Numérico',
    t: 'Compara y ordena números fraccionarios a través de diversas interpretaciones, recursos y representaciones.',
    ev: [
      'Representa fracciones con la ayuda de la recta numérica.',
      'Determina criterios para ordenar fracciones y expresiones decimales de mayor a menor o viceversa.',
    ],
  },
  {
    n: 4,
    p: 'Métrico',
    t: 'Justifica relaciones entre superficie y volumen, respecto a dimensiones de figuras y sólidos, y elige las unidades apropiadas según el tipo de medición, instrumentos y procedimientos.',
    ev: [
      'Determina las medidas reales de una figura a partir de un plano.',
      'Mide superficies y longitudes utilizando diferentes estrategias (composición, recubrimiento, cálculo).',
      'Construye y descompone figuras planas y sólidos a partir de medidas establecidas.',
      'Realiza estimaciones y mediciones con unidades apropiadas según sea longitud, área o volumen.',
    ],
  },
  {
    n: 5,
    p: 'Métrico',
    t: 'Explica las relaciones entre el perímetro y el área de diferentes figuras a partir de mediciones, superposición de figuras y cálculo.',
    ev: [
      'Compara diferentes figuras a partir de las medidas de sus lados.',
      'Calcula las medidas de los lados de una figura a partir de su área.',
      'Dibuja figuras planas cuando se dan las medidas de los lados.',
      'Reconoce que figuras con áreas diferentes pueden tener el mismo perímetro.',
    ],
  },
  {
    n: 6,
    p: 'Espacial',
    t: 'Identifica y describe propiedades que caracterizan un cuerpo en términos de la bidimensionalidad y tridimensionalidad y resuelve problemas de composición y descomposición de formas.',
    ev: [
      'Relaciona objetos tridimensionales y sus propiedades con sus respectivos desarrollos planos.',
      'Reconoce relaciones intra e interfigurales.',
      'Construye y descompone figuras planas y sólidos a partir de medidas establecidas.',
      'Utiliza transformaciones en el plano para describirlas y calcular sus medidas.',
    ],
  },
  {
    n: 7,
    p: 'Espacial',
    t: 'Resuelve y propone situaciones en las que es necesario describir y localizar la posición y la trayectoria de un objeto con referencia al plano cartesiano.',
    ev: [
      'Localiza puntos en un mapa a partir de coordenadas cartesianas.',
      'Interpreta los elementos de un sistema de referencia (ejes, cuadrantes, coordenadas).',
      'Emplea el plano cartesiano al plantear y resolver situaciones de localización.',
      'Representa en forma gráfica y simbólica la localización y trayectoria de un objeto.',
    ],
  },
  {
    n: 8,
    p: 'Variacional',
    t: 'Describe e interpreta variaciones de dependencia entre cantidades y las representa por medio de gráficas.',
    ev: [
      'Propone patrones de comportamiento numéricos y patrones de comportamiento gráficos.',
      'Realiza cálculos numéricos, organiza la información en tablas y elabora representaciones gráficas.',
      'Trabaja sobre números desconocidos para dar respuestas a los problemas.',
    ],
  },
  {
    n: 9,
    p: 'Variacional',
    t: 'Utiliza operaciones no convencionales, encuentra propiedades y resuelve ecuaciones en donde están involucradas.',
    ev: [
      'Interpreta y opera con operaciones no convencionales.',
      'Explora y busca propiedades de tales operaciones.',
      'Compara las propiedades de las operaciones convencionales con las operaciones no convencionales.',
      'Resuelve ecuaciones numéricas cuando se involucran operaciones no convencionales.',
    ],
  },
  {
    n: 10,
    p: 'Aleatorio',
    t: 'Formula preguntas que requieren comparar dos grupos de datos, para lo cual recolecta, organiza y usa tablas de frecuencia, gráficos de barras, circulares y de líneas.',
    ev: [
      'Formula preguntas y elabora encuestas para obtener los datos requeridos.',
      'Registra, organiza y presenta la información recolectada usando tablas y gráficos.',
      'Selecciona los gráficos teniendo en cuenta el tipo de datos.',
      'Interpreta la información obtenida y produce conclusiones que permiten comparar dos grupos.',
    ],
  },
  {
    n: 11,
    p: 'Aleatorio',
    t: 'Utiliza la media y la mediana para resolver problemas en los que se requiere presentar o resumir el comportamiento de un conjunto de datos.',
    ev: [
      'Interpreta y encuentra la media y la mediana usando estrategias gráficas y numéricas.',
      'Explica la información que brinda cada medida en relación con el conjunto de datos.',
      'Selecciona una de las medidas como la más representativa del comportamiento estudiado.',
    ],
  },
  {
    n: 12,
    p: 'Aleatorio',
    t: 'Predice la posibilidad de ocurrencia de un evento simple a partir de la relación entre los elementos del espacio muestral y los elementos del evento definido.',
    ev: [
      'Reconoce situaciones aleatorias en contextos cotidianos.',
      'Enumera todos los posibles resultados de un experimento aleatorio simple.',
      'Identifica y enumera los resultados favorables de ocurrencia de un evento simple.',
      'Anticipa la ocurrencia de un evento simple.',
    ],
  },
];

const BLOQUES_INFO: Record<
  string,
  {
    id: string;
    icono: string;
    nombre: string;
    color: string;
    claro: string;
    pensIds: string[];
    dbaFiltro: string[];
  }
> = {
  mat: {
    id: 'mat',
    icono: '🔢',
    nombre: 'Matemáticas',
    color: '#5C21A6',
    claro: '#F1EAFE',
    pensIds: ['numerico', 'variacional'],
    dbaFiltro: ['Numérico', 'Variacional'],
  },
  geo: {
    id: 'geo',
    icono: '📐',
    nombre: 'Geometría',
    color: '#0D9488',
    claro: '#DCF5EE',
    pensIds: ['espacial', 'metrico'],
    dbaFiltro: ['Espacial', 'Métrico'],
  },
  est: {
    id: 'est',
    icono: '📊',
    nombre: 'Estadística y probabilidad',
    color: '#1E3A8A',
    claro: '#DBEAFE',
    pensIds: ['aleatorio'],
    dbaFiltro: ['Aleatorio'],
  },
};

export default function CurriculoModal4to({ isOpen, onClose }: CurriculoModal4toProps) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Escuchar tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedBlock) {
          setSelectedBlock(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedBlock, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="curr-modal-overlay animate-fadeIn"
    >
      <style>{`
        .curr-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: rgba(10, 5, 30, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-sizing: border-box;
        }

        .curr-modal-container {
          width: 100%;
          max-width: ${selectedBlock ? '720px' : '520px'};
          max-height: 90vh;
          background-color: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.40);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-sizing: border-box;
          padding: 24px 28px 28px;
          transition: max-width 0.2s ease;
        }

        .curr-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .curr-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .curr-header-icon {
          font-size: 24px;
          line-height: 1;
        }

        .curr-title-wrap h2 {
          margin: 0;
          font-size: 23px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .curr-close-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #F3EEFF;
          color: #5C21A6;
          font-size: 20px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.12s ease;
          flex-shrink: 0;
          padding: 0;
          line-height: 1;
        }

        .curr-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .curr-subtitle {
          margin: 0 0 16px 0;
          font-size: 14.5px;
          font-weight: 800;
          color: #1A1033;
          font-family: 'Nunito', sans-serif;
          line-height: 1.45;
        }

        .curr-menu-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .curr-menu-btn {
          width: 100%;
          padding: 15px 22px;
          border-radius: 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 15.5px;
          font-weight: 900;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .curr-menu-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.10);
        }

        .curr-menu-btn:active {
          transform: scale(0.99);
        }

        /* ── VISTA DETALLE SCROLLABLE ── */
        .curr-detail-scroll {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 4px;
        }

        .curr-detail-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .curr-detail-scroll::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .curr-detail-scroll::-webkit-scrollbar-thumb {
          background: #C4B5FD;
          border-radius: 8px;
        }

        .curr-banner {
          border-radius: 14px;
          padding: 12px 16px;
          box-sizing: border-box;
        }

        .curr-banner-title {
          font-size: 17px;
          font-weight: 900;
          font-family: 'Baloo 2', sans-serif;
          line-height: 1.25;
        }

        .curr-banner-sub {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-top: 2px;
        }

        .curr-section-block {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 14px 18px;
          box-sizing: border-box;
        }

        .curr-section-title {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }

        .curr-bullets {
          list-style-type: disc !important;
          padding-left: 20px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .curr-bullets li {
          font-size: 13.5px;
          line-height: 1.55;
          color: #1E293B;
        }

        .curr-dba-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 12px 16px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }

        .curr-back-btn {
          align-self: flex-start;
          padding: 10px 20px;
          background: #5C21A6;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background-color 0.15s ease, transform 0.12s ease;
          margin-top: 4px;
        }

        .curr-back-btn:hover {
          background: #4C1D95;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="curr-modal-container animate-popIn">
        {/* Header */}
        <div className="curr-header-row">
          <div className="curr-title-wrap">
            <span className="curr-header-icon">📑</span>
            <h2>Currículo MEN · Grado 4°</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="curr-close-circle"
            title="Cerrar"
            aria-label="Cerrar currículo"
          >
            ✕
          </button>
        </div>

        {/* ── 1. MENÚ PRINCIPAL (REPRODUCCIÓN FIEL DE LA IMAGEN) ── */}
        {!selectedBlock && (
          <>
            <p className="curr-subtitle">
              Referentes de calidad del Ministerio de Educación Nacional (Colombia) para el ciclo 4° a 5°.
            </p>

            <div className="curr-menu-stack">
              {/* Botón 1: Matemáticas */}
              <button
                type="button"
                onClick={() => setSelectedBlock('mat')}
                className="curr-menu-btn"
                style={{
                  background: '#F1EAFE',
                  border: '2px solid #5C21A6',
                  color: '#5C21A6',
                }}
              >
                <span>🔢</span>
                <span>Matemáticas</span>
              </button>

              {/* Botón 2: Geometría */}
              <button
                type="button"
                onClick={() => setSelectedBlock('geo')}
                className="curr-menu-btn"
                style={{
                  background: '#DCF5EE',
                  border: '2px solid #0D9488',
                  color: '#0D9488',
                }}
              >
                <span>📐</span>
                <span>Geometría</span>
              </button>

              {/* Botón 3: Estadística y probabilidad */}
              <button
                type="button"
                onClick={() => setSelectedBlock('est')}
                className="curr-menu-btn"
                style={{
                  background: '#DBEAFE',
                  border: '2px solid #1E3A8A',
                  color: '#1E3A8A',
                }}
              >
                <span>📊</span>
                <span>Estadística y probabilidad</span>
              </button>

              {/* Botón 4: DBA 12 */}
              <button
                type="button"
                onClick={() => setSelectedBlock('dba')}
                className="curr-menu-btn"
                style={{
                  background: '#FFF7E6',
                  border: '2px solid #E8650A',
                  color: '#7A3200',
                }}
              >
                <span>🎯</span>
                <span>DBA · Derechos Básicos de Aprendizaje · Grado 4° (12 DBA)</span>
              </button>
            </div>
          </>
        )}

        {/* ── 2. VISTA DETALLE DE CADA SECCIÓN CURRICULAR ── */}
        {selectedBlock && (
          <div className="curr-detail-scroll">
            {/* Si es DBA completo */}
            {selectedBlock === 'dba' && (
              <>
                <div
                  className="curr-banner"
                  style={{
                    background: '#FFF7E6',
                    borderLeft: '5px solid #E8650A',
                  }}
                >
                  <div className="curr-banner-title" style={{ color: '#7A3200' }}>
                    🎯 Derechos Básicos de Aprendizaje (DBA) · Grado 4°
                  </div>
                  <div className="curr-banner-sub">
                    Ministerio de Educación Nacional de Colombia · Mallas de Aprendizaje y DBA Versión 2
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {DBA_DATA.map((d) => (
                    <div
                      key={d.n}
                      className="curr-dba-card"
                      style={{ borderLeft: '5px solid #E8650A' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            background: '#E8650A',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '2px 9px',
                            fontWeight: 900,
                            fontSize: '11.5px',
                          }}
                        >
                          DBA {d.n}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 900, color: '#E8650A' }}>
                          Pensamiento {d.p}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: '#1E293B',
                          fontSize: '13.5px',
                          lineHeight: '1.5',
                        }}
                      >
                        {d.t}
                      </div>

                      <details style={{ marginTop: '8px' }}>
                        <summary
                          style={{
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 900,
                            color: '#E8650A',
                            outline: 'none',
                          }}
                        >
                          Evidencias de aprendizaje ({d.ev.length})
                        </summary>
                        <ul
                          style={{
                            margin: '6px 0 0',
                            paddingLeft: '18px',
                            fontSize: '12.5px',
                            lineHeight: '1.55',
                            color: '#334155',
                          }}
                        >
                          {d.ev.map((ev, i) => (
                            <li key={i} style={{ marginBottom: '3px' }}>
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Si es Matemáticas, Geometría o Estadística */}
            {selectedBlock !== 'dba' && BLOQUES_INFO[selectedBlock] && (() => {
              const b = BLOQUES_INFO[selectedBlock];
              const est = b.pensIds.flatMap((p) => ESTANDARES_DATA[p] || []);
              const dbas = DBA_DATA.filter((d) => b.dbaFiltro.includes(d.p));

              return (
                <>
                  <div
                    className="curr-banner"
                    style={{
                      background: b.claro,
                      borderLeft: `5px solid ${b.color}`,
                    }}
                  >
                    <div className="curr-banner-title" style={{ color: b.color }}>
                      {b.icono} {b.nombre} · Grado 4°
                    </div>
                    <div className="curr-banner-sub">
                      Referentes de calidad · Ministerio de Educación Nacional de Colombia
                    </div>
                  </div>

                  {/* Pensamientos */}
                  <div className="curr-section-block">
                    <div className="curr-section-title" style={{ color: b.color }}>
                      Pensamientos y sistemas
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {b.pensIds.map((pId) => {
                        const pObj = PENSAMIENTOS_DATA.find((x) => x.id === pId);
                        if (!pObj) return null;
                        return (
                          <div key={pId}>
                            <b style={{ color: b.color, fontSize: '13.5px' }}>{pObj.nombre}</b>
                            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#475569', lineHeight: '1.45' }}>
                              {pObj.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estándares Básicos */}
                  <div className="curr-section-block">
                    <div className="curr-section-title" style={{ color: b.color }}>
                      Estándares básicos de competencias (4° a 5°)
                    </div>
                    <ul className="curr-bullets">
                      {est.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Competencias Clave */}
                  <div className="curr-section-block">
                    <div className="curr-section-title" style={{ color: b.color }}>
                      Competencias · procesos generales
                    </div>
                    <ul className="curr-bullets">
                      {COMPETENCIAS_DATA.map((c, idx) => (
                        <li key={idx}>
                          <b>{c.nombre}:</b> {c.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Niveles de Desempeño Saber 4° */}
                  <div className="curr-section-block">
                    <div className="curr-section-title" style={{ color: b.color }}>
                      Niveles de desempeño · Saber 4°
                    </div>
                    <ul className="curr-bullets">
                      {DESEMPENO_DATA.map((d, idx) => (
                        <li key={idx}>
                          <b>{d.nivel}:</b> {d.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DBAs Relacionados */}
                  {dbas.length > 0 && (
                    <div className="curr-section-block">
                      <div className="curr-section-title" style={{ color: b.color }}>
                        Derechos Básicos de Aprendizaje (DBA)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {dbas.map((d) => (
                          <div
                            key={d.n}
                            style={{
                              background: '#FAF8FF',
                              border: '1px solid #E2E8F0',
                              borderLeft: `4px solid ${b.color}`,
                              borderRadius: '10px',
                              padding: '10px 12px',
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 900, color: b.color, marginBottom: '2px' }}>
                              DBA {d.n} · Pensamiento {d.p}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', lineHeight: '1.45' }}>
                              {d.t}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Botón Volver */}
            <div>
              <button
                type="button"
                onClick={() => setSelectedBlock(null)}
                className="curr-back-btn"
              >
                ◀ Volver al menú de currículo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
