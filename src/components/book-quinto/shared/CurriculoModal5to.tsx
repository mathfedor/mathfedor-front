'use client';

import React, { useState, useEffect } from 'react';

interface CurriculoModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── 1. DEFINICIÓN DE BLOQUES PRINCIPALES (CURRÍCULO MEN 5°) ──
interface BloqueCurricular {
  id: 'mat' | 'geo' | 'est';
  icono: string;
  nombre: string;
  color: string;
  claro: string;
  pens: string[];
  dbaPens: string[];
}

const BLOQUES: BloqueCurricular[] = [
  {
    id: 'mat',
    icono: '🔢',
    nombre: 'Matemáticas',
    color: '#5C21A6',
    claro: '#F1EAFE',
    pens: ['numerico', 'variacional'],
    dbaPens: ['Numérico', 'Variacional'],
  },
  {
    id: 'geo',
    icono: '📐',
    nombre: 'Geometría',
    color: '#0D9488',
    claro: '#DCF5EE',
    pens: ['espacial', 'metrico'],
    dbaPens: ['Métrico', 'Espacial'],
  },
  {
    id: 'est',
    icono: '📊',
    nombre: 'Estadística y probabilidad',
    color: '#1E3A8A',
    claro: '#DBEAFE',
    pens: ['aleatorio'],
    dbaPens: ['Aleatorio'],
  },
];

// ── 2. PENSAMIENTOS MATEMÁTICOS MEN (CICLO 4°–5°) ──
const PENSAMIENTOS = [
  {
    id: 'numerico',
    nombre: 'Pensamiento numérico y sistemas numéricos',
    desc: 'Los Lineamientos Curriculares de Matemáticas plantean el desarrollo de los procesos curriculares y la organización de actividades centradas en la comprensión del uso y de los significados de los números y de la numeración; la comprensión del sentido y significado de las operaciones y de las relaciones entre números, y el desarrollo de diferentes técnicas de cálculo y estimación.',
  },
  {
    id: 'variacional',
    nombre: 'Pensamiento variacional y sistemas algebraicos y analíticos',
    desc: 'Como su nombre lo indica, este tipo de pensamiento tiene que ver con el reconocimiento, la percepción, la identificación y la caracterización de la variación y el cambio en diferentes contextos, así como con su descripción, modelación y representación en distintos sistemas o registros simbólicos, ya sean verbales, icónicos, gráficos o algebraicos.',
  },
  {
    id: 'espacial',
    nombre: 'Pensamiento espacial y sistemas geométricos',
    desc: 'El pensamiento espacial, entendido como el conjunto de los procesos cognitivos mediante los cuales se construyen y se manipulan las representaciones mentales de los objetos del espacio, las relaciones entre ellos, sus transformaciones, y sus diversas traducciones o representaciones materiales.',
  },
  {
    id: 'metrico',
    nombre: 'Pensamiento métrico y sistemas de medidas',
    desc: 'Los conceptos y procedimientos propios de este pensamiento hacen referencia a la comprensión general que tiene una persona sobre las magnitudes y las cantidades, su medición y el uso flexible de los sistemas métricos o de medidas en diferentes situaciones.',
  },
  {
    id: 'aleatorio',
    nombre: 'Pensamiento aleatorio y sistemas de datos',
    desc: 'Este tipo de pensamiento, llamado también probabilístico o estocástico, ayuda a tomar decisiones en situaciones de incertidumbre, de azar, de riesgo o de ambigüedad por falta de información confiable, en las que no es posible predecir con seguridad lo que va a pasar.',
  },
];

// ── 3. ESTÁNDARES BÁSICOS DE COMPETENCIAS MEN (CICLO 4°–5°) ──
const ESTANDARES: Record<string, string[]> = {
  numerico: [
    'Interpreto las fracciones en diferentes contextos: situaciones de medición, relaciones parte todo, cociente, razones y proporciones.',
    'Identifico y uso medidas relativas en distintos contextos.',
    'Utilizo la notación decimal para expresar fracciones en diferentes contextos y relaciono estas dos notaciones con la de los porcentajes.',
    'Justifico el valor de posición en el sistema de numeración decimal en relación con el conteo recurrente de unidades.',
    'Resuelvo y formulo problemas cuya estrategia de solución requiera de las relaciones y propiedades de los números naturales y sus operaciones.',
    'Resuelvo y formulo problemas en situaciones aditivas de composición, transformación, comparación e igualación.',
    'Resuelvo y formulo problemas en situaciones de proporcionalidad directa, inversa y producto de medidas.',
    'Identifico la potenciación y la radicación en contextos matemáticos y no matemáticos.',
    'Modelo situaciones de dependencia mediante la proporcionalidad directa e inversa.',
    'Uso diversas estrategias de cálculo y de estimación para resolver problemas en situaciones aditivas y multiplicativas.',
    'Identifico, en el contexto de una situación, la necesidad de un cálculo exacto o aproximado y lo razonable de los resultados obtenidos.',
    'Justifico regularidades y propiedades de los números, sus relaciones y operaciones.',
  ],
  variacional: [
    'Describo e interpreto variaciones representadas en gráficos.',
    'Predigo patrones de variación en una secuencia numérica, geométrica o gráfica.',
    'Represento y relaciono patrones numéricos con tablas y reglas verbales.',
    'Analizo y explico relaciones de dependencia entre cantidades que varían en el tiempo con cierta regularidad en situaciones económicas, sociales y de las ciencias naturales.',
    'Construyo igualdades y desigualdades numéricas como representación de relaciones entre distintos datos.',
  ],
  espacial: [
    'Comparo y clasifico objetos tridimensionales de acuerdo con componentes (caras, lados) y propiedades.',
    'Comparo y clasifico figuras bidimensionales de acuerdo con sus componentes (ángulos, vértices) y características.',
    'Identifico, represento y utilizo ángulos en giros, aberturas, inclinaciones, figuras, puntas y esquinas en situaciones estáticas y dinámicas.',
    'Utilizo sistemas de coordenadas para especificar localizaciones y describir relaciones espaciales.',
    'Identifico y justifico relaciones de congruencia y semejanza entre figuras.',
    'Construyo y descompongo figuras y sólidos a partir de condiciones dadas.',
    'Conjeturo y verifico los resultados de aplicar transformaciones a figuras en el plano para construir diseños.',
    'Construyo objetos tridimensionales a partir de representaciones bidimensionales y puedo realizar el proceso contrario en contextos de arte, diseño y arquitectura.',
  ],
  metrico: [
    'Diferencio y ordeno, en objetos y eventos, propiedades o atributos que se puedan medir (longitudes, distancias, áreas de superficies, volúmenes de cuerpos sólidos, volúmenes de líquidos y capacidades de recipientes; pesos y masa de cuerpos sólidos; duración de eventos o procesos; amplitud de ángulos).',
    'Selecciono unidades, tanto convencionales como estandarizadas, apropiadas para diferentes mediciones.',
    'Utilizo y justifico el uso de la estimación para resolver problemas relativos a la vida social, económica y de las ciencias, utilizando rangos de variación.',
    'Utilizo diferentes procedimientos de cálculo para hallar el área de la superficie exterior y el volumen de algunos cuerpos sólidos.',
    'Justifico relaciones de dependencia del área y volumen, respecto a las dimensiones de figuras y sólidos.',
    'Reconozco el uso de algunas magnitudes (longitud, área, volumen, capacidad, peso y masa, duración, rapidez, temperatura) y de algunas de las unidades que se usan para medir cantidades de la magnitud respectiva en situaciones aditivas y multiplicativas.',
    'Describo y argumento relaciones entre el perímetro y el área de figuras diferentes, cuando se fija una de estas medidas.',
  ],
  aleatorio: [
    'Represento datos usando tablas y gráficas (pictogramas, gráficas de barras, diagramas de líneas, diagramas circulares).',
    'Comparo diferentes representaciones del mismo conjunto de datos.',
    'Interpreto información presentada en tablas y gráficas (pictogramas, gráficas de barras, diagramas de líneas, diagramas circulares).',
    'Conjeturo y pongo a prueba predicciones acerca de la posibilidad de ocurrencia de eventos.',
    'Describo la manera como parecen distribuirse los distintos datos de un conjunto de ellos y la comparo con la manera como se distribuyen en otros conjuntos de datos.',
    'Uso e interpreto la media (o promedio) y la mediana y comparo lo que indican.',
    'Resuelvo y formulo problemas a partir de un conjunto de datos provenientes de observaciones, consultas o experimentos.',
  ],
};

// ── 4. COMPETENCIAS · PROCESOS GENERALES ──
const COMPETENCIAS = [
  {
    nombre: 'La formulación, tratamiento y resolución de problemas',
    desc: 'Es un proceso presente a lo largo de todas las actividades curriculares de matemáticas y no una actividad aislada y esporádica; podría convertirse en el principal eje organizador del currículo, porque las situaciones problema proporcionan el contexto inmediato en donde el quehacer matemático cobra sentido.',
  },
  {
    nombre: 'La modelación',
    desc: 'Un modelo puede entenderse como un sistema figurativo mental, gráfico o tridimensional que reproduce o representa la realidad en forma esquemática para hacerla más comprensible.',
  },
  {
    nombre: 'La comunicación',
    desc: 'A pesar de que suele repetirse lo contrario, las matemáticas no son un lenguaje, pero ellas pueden construirse, refinarse y comunicarse a través de diferentes lenguajes con los que se expresan y representan.',
  },
  {
    nombre: 'El razonamiento',
    desc: 'El desarrollo del razonamiento lógico empieza en los primeros grados apoyado en los contextos y materiales físicos que permiten percibir regularidades y relaciones; hacer predicciones y conjeturas.',
  },
  {
    nombre: 'La formulación, comparación y ejercitación de procedimientos',
    desc: 'Este proceso implica comprometer a los estudiantes en la construcción y ejecución segura y rápida de procedimientos mecánicos o de rutina, también llamados algoritmos.',
  },
];

// ── 5. NIVELES DE DESEMPEÑO SABER 5° ──
const DESEMPENO = [
  {
    nivel: 'Insuficiente',
    puntos: '100 a 264 puntos',
    desc: 'El estudiante promedio ubicado en este nivel no demuestra los desempeños mínimos establecidos; no responde correctamente las preguntas más fáciles de la prueba Saber 5°.',
  },
  {
    nivel: 'Mínimo',
    puntos: '265 a 330 puntos',
    desc: 'El estudiante promedio ubicado en este nivel muestra un desempeño mínimo en las competencias exigibles para el área y el grado evaluado: utiliza operaciones básicas para solucionar situaciones problema; identifica información relacionada con la medición; hace recubrimientos y descomposiciones de figuras planas; organiza y clasifica información estadística.',
  },
  {
    nivel: 'Satisfactorio',
    puntos: '331 a 396 puntos',
    desc: 'El estudiante promedio ubicado en este nivel tiene un desempeño adecuado en las competencias exigidas para el área y el grado evaluado. Este es el nivel esperado que todos los estudiantes deberían alcanzar: identifica y utiliza propiedades de las operaciones, modela dependencia lineal, diferencia y calcula medidas de longitud y superficie, identifica transformaciones en el plano, usa la media aritmética y estima probabilidades.',
  },
  {
    nivel: 'Avanzado',
    puntos: '397 a 500 puntos',
    desc: 'El estudiante promedio ubicado en este nivel muestra un desempeño sobresaliente: soluciona problemas de la estructura multiplicativa, reconoce y utiliza la fracción como operador, compara atributos de sólidos y figuras a partir de medidas, establece conjeturas sobre datos y probabilidad.',
  },
];

// ── 6. DERECHOS BÁSICOS DE APRENDIZAJE · GRADO 5° (12 DBA) ──
interface DbaItem {
  n: number;
  p: 'Numérico' | 'Variacional' | 'Métrico' | 'Espacial' | 'Aleatorio';
  t: string;
  ev: string[];
}

const DBA5_DATA: DbaItem[] = [
  {
    n: 1,
    p: 'Numérico',
    t: 'Interpreta y utiliza los números naturales y racionales en su representación fraccionaria para formular y resolver problemas aditivos, multiplicativos y que involucren operaciones de potenciación.',
    ev: [
      'Interpreta la relación parte - todo y la representa por medio de fracciones, razones o cocientes.',
      'Interpreta y utiliza números naturales y racionales (fraccionarios) asociados con un contexto para solucionar problemas.',
      'Determina las operaciones suficientes y necesarias para solucionar diferentes tipos de problemas.',
      'Resuelve problemas que requieran reconocer un patrón de medida asociado a un número natural o a un racional (fraccionario).',
    ],
  },
  {
    n: 2,
    p: 'Numérico',
    t: 'Describe y desarrolla estrategias (algoritmos, propiedades de las operaciones básicas y sus relaciones) para hacer estimaciones y cálculos al solucionar problemas de potenciación.',
    ev: [
      'Utiliza las propiedades de las operaciones con números naturales y racionales (fraccionarios) para justificar algunas estrategias de cálculo o estimación relacionados con áreas de cuadrados y volúmenes de cubos.',
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
    t: 'Justifica relaciones entre superficie y volumen, respecto a dimensiones de figuras y sólidos, y elige las unidades apropiadas según el tipo de medición (directa e indirecta), los instrumentos y los procedimientos.',
    ev: [
      'Determina las medidas reales de una figura a partir de un registro gráfico (un plano).',
      'Mide superficies y longitudes utilizando diferentes estrategias (composición, recubrimiento, bordeado, cálculo).',
      'Construye y descompone figuras planas y sólidos a partir de medidas establecidas.',
      'Realiza estimaciones y mediciones con unidades apropiadas según sea longitud, área o volumen.',
    ],
  },
  {
    n: 5,
    p: 'Métrico',
    t: 'Explica las relaciones entre el perímetro y el área de diferentes figuras (variaciones en el perímetro no implican variaciones en el área y viceversa) a partir de mediciones, superposición de figuras, cálculo, entre otras.',
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
    t: 'Identifica y describe propiedades que caracterizan un cuerpo en términos de la bidimensionalidad y la tridimensionalidad y resuelve problemas en relación con la composición y descomposición de las formas.',
    ev: [
      'Relaciona objetos tridimensionales y sus propiedades con sus respectivos desarrollos planos.',
      'Reconoce relaciones intra e interfigurales.',
      'Construye y descompone figuras planas y sólidos a partir de medidas establecidas.',
      'Utiliza transformaciones a figuras en el plano para describirlas y calcular sus medidas.',
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
      'Propone patrones de comportamiento numéricos y patrones de comportamientos gráficos.',
      'Realiza cálculos numéricos, organiza la información en tablas, elabora representaciones gráficas y las interpreta.',
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
      'Compara las propiedades de las operaciones convencionales de suma, resta, producto y división con las propiedades de las operaciones no convencionales.',
      'Resuelve ecuaciones numéricas cuando se involucran operaciones no convencionales.',
    ],
  },
  {
    n: 10,
    p: 'Aleatorio',
    t: 'Formula preguntas que requieren comparar dos grupos de datos, para lo cual recolecta, organiza y usa tablas de frecuencia, gráficos de barras, circulares, de línea, entre otros. Analiza la información presentada y comunica los resultados.',
    ev: [
      'Formula preguntas y elabora encuestas para obtener los datos requeridos e identifica quiénes deben responder.',
      'Registra, organiza y presenta la información recolectada usando tablas, gráficos de barras, gráficos de línea, y gráficos circulares.',
      'Selecciona los gráficos teniendo en cuenta el tipo de datos que se va a representar.',
      'Interpreta la información obtenida y produce conclusiones que le permiten comparar dos grupos de datos de una misma población.',
    ],
  },
  {
    n: 11,
    p: 'Aleatorio',
    t: 'Utiliza la media y la mediana para resolver problemas en los que se requiere presentar o resumir el comportamiento de un conjunto de datos.',
    ev: [
      'Interpreta y encuentra la media y la mediana en un conjunto de datos usando estrategias gráficas y numéricas.',
      'Explica la información que brinda cada medida en relación con el conjunto de datos.',
      'Selecciona una de las medidas como la más representativa del comportamiento del conjunto de datos estudiado.',
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

const PCOL: Record<string, string> = {
  Numérico: '#5C21A6',
  Variacional: '#7C3AED',
  Métrico: '#0D9488',
  Espacial: '#0F766E',
  Aleatorio: '#1E3A8A',
};

export default function CurriculoModal5to({ isOpen, onClose }: CurriculoModal5toProps) {
  const [selectedBlock, setSelectedBlock] = useState<'mat' | 'geo' | 'est' | 'dba' | null>(null);

  // Cierre con Escape
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

  const currentBloque = BLOQUES.find((b) => b.id === selectedBlock);

  return (
    <div
      className="tool-modal-bg animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 9995;
          background: rgba(18, 8, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .tool-modal {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 580px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 22px 24px 26px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
        }

        .tool-modal::-webkit-scrollbar {
          width: 6px;
        }
        .tool-modal::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .tool-modal::-webkit-scrollbar-thumb {
          background: #C4B5FD;
          border-radius: 8px;
        }

        .tm-close {
          position: absolute;
          right: 18px;
          top: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid #E4DFF5;
          background: #F7F4FF;
          color: #6C28B4;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s ease;
          padding: 0;
          outline: none;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #FFFFFF;
          transform: scale(1.05);
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 21px;
          font-weight: 900;
          color: #3D1468;
          margin: 0 44px 0 0;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.2;
        }

        .tm-subtitle {
          margin: 12px 0 16px 0;
          font-size: 14px;
          font-weight: 700;
          color: #180D38;
          line-height: 1.45;
        }

        .curriculo-btn-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .curriculo-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 15.5px;
          font-weight: 900;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .curriculo-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.02);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .curriculo-btn:active {
          transform: scale(0.99);
        }

        /* ── SECCIONES DE DETALLE ── */
        .curr-section {
          margin-bottom: 14px;
        }

        .curr-section-title {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .curr-ul {
          margin: 0;
          padding-left: 18px;
          font-size: 13.5px;
          line-height: 1.65;
          color: #1A1033;
        }

        .curr-ul li {
          margin-bottom: 5px;
        }

        .curr-back-btn {
          margin-top: 10px;
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
          transition: all 0.15s ease;
        }

        .curr-back-btn:hover {
          background: #4C1D95;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="tool-modal animate-popIn">
        {/* Botón Cerrar circular idéntico al diseño */}
        <button
          type="button"
          onClick={onClose}
          className="tm-close"
          title="Cerrar"
          aria-label="Cerrar currículo"
        >
          ✕
        </button>

        {/* Header idéntico a la imagen */}
        <div className="tm-title">
          <span style={{ fontSize: '22px', lineHeight: 1 }}>📑</span>
          <span>Currículo MEN · Grado 5°</span>
        </div>

        {/* ── 1. MENÚ PRINCIPAL (REPRODUCCIÓN EXACTA DE LA IMAGEN) ── */}
        {!selectedBlock && (
          <>
            <p className="tm-subtitle">
              Referentes de calidad del Ministerio de Educación Nacional (Colombia) para el ciclo 4° a 5°.
            </p>

            <div className="curriculo-btn-stack">
              {/* Botón 1: Matemáticas */}
              <button
                type="button"
                onClick={() => setSelectedBlock('mat')}
                className="curriculo-btn"
                style={{
                  background: '#F1EAFE',
                  border: '2px solid #5C21A6',
                  color: '#5C21A6',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>🔢</span>
                <span>Matemáticas</span>
              </button>

              {/* Botón 2: Geometría */}
              <button
                type="button"
                onClick={() => setSelectedBlock('geo')}
                className="curriculo-btn"
                style={{
                  background: '#DCF5EE',
                  border: '2px solid #0D9488',
                  color: '#0D9488',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>📐</span>
                <span>Geometría</span>
              </button>

              {/* Botón 3: Estadística y probabilidad */}
              <button
                type="button"
                onClick={() => setSelectedBlock('est')}
                className="curriculo-btn"
                style={{
                  background: '#DBEAFE',
                  border: '2px solid #1E3A8A',
                  color: '#1E3A8A',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>📊</span>
                <span>Estadística y probabilidad</span>
              </button>

              {/* Botón 4: DBA · Derechos Básicos de Aprendizaje · Grado 5° (12 DBA) */}
              <button
                type="button"
                onClick={() => setSelectedBlock('dba')}
                className="curriculo-btn"
                style={{
                  background: '#FFF8EC',
                  border: '2px solid #EA580C',
                  color: '#7A3200',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>🎯</span>
                <span>DBA · Derechos Básicos de Aprendizaje · Grado 5° (12 DBA)</span>
              </button>
            </div>
          </>
        )}

        {/* ── 2. VISTA DETALLE DE MATEMÁTICAS / GEOMETRÍA / ESTADÍSTICA ── */}
        {selectedBlock && selectedBlock !== 'dba' && currentBloque && (
          <div style={{ marginTop: '14px' }}>
            {/* Banner superior */}
            <div
              style={{
                background: currentBloque.claro,
                borderLeft: `5px solid ${currentBloque.color}`,
                padding: '12px 14px',
                borderRadius: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 900,
                  color: currentBloque.color,
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                {currentBloque.icono} {currentBloque.nombre} · Grado 5°
              </div>
              <div style={{ fontSize: '12px', color: '#555', fontWeight: 700, marginTop: '2px' }}>
                Referentes de calidad · Ministerio de Educación Nacional de Colombia
              </div>
            </div>

            {/* Pensamientos y sistemas */}
            <div className="curr-section">
              <div className="curr-section-title" style={{ color: currentBloque.color }}>
                Pensamientos y sistemas
              </div>
              <ul className="curr-ul">
                {currentBloque.pens.map((pId) => {
                  const p = PENSAMIENTOS.find((item) => item.id === pId);
                  if (!p) return null;
                  return (
                    <li key={p.id}>
                      <b>{p.nombre}</b>
                      <br />
                      <span style={{ color: '#4B5563', fontSize: '13px' }}>{p.desc}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Estándares básicos de competencias (4° a 5°) */}
            <div className="curr-section">
              <div className="curr-section-title" style={{ color: currentBloque.color }}>
                Estándares básicos de competencias (4° a 5°)
              </div>
              <ul className="curr-ul">
                {currentBloque.pens.flatMap((pId) => ESTANDARES[pId] || []).map((std, i) => (
                  <li key={i}>{std}</li>
                ))}
              </ul>
            </div>

            {/* Competencias · procesos generales */}
            <div className="curr-section">
              <div className="curr-section-title" style={{ color: currentBloque.color }}>
                Competencias · procesos generales
              </div>
              <ul className="curr-ul">
                {COMPETENCIAS.map((c, i) => (
                  <li key={i}>
                    <b>{c.nombre}</b>
                    <br />
                    <span style={{ color: '#4B5563', fontSize: '13px' }}>{c.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Niveles de desempeño · Saber 5° */}
            <div className="curr-section">
              <div className="curr-section-title" style={{ color: currentBloque.color }}>
                Niveles de desempeño · Saber 5°
              </div>
              <ul className="curr-ul">
                {DESEMPENO.map((d, i) => (
                  <li key={i}>
                    <b>{d.nivel} ({d.puntos}):</b>{' '}
                    <span style={{ color: '#4B5563', fontSize: '13px' }}>{d.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DBA correspondientes a este bloque */}
            <div className="curr-section">
              <div className="curr-section-title" style={{ color: '#EA580C' }}>
                Derechos Básicos de Aprendizaje (DBA) · Grado 5°
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DBA5_DATA.filter((d) => currentBloque.dbaPens.includes(d.p)).map((d) => {
                  const col = PCOL[d.p] || '#5C21A6';
                  return (
                    <div
                      key={d.n}
                      style={{
                        background: '#FFFFFF',
                        border: `1.5px solid ${col}33`,
                        borderLeft: `5px solid ${col}`,
                        borderRadius: '12px',
                        padding: '10px 14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            background: col,
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '2px 9px',
                            fontWeight: 900,
                            fontSize: '11px',
                          }}
                        >
                          DBA {d.n}
                        </span>
                        <span style={{ fontSize: '11.5px', fontWeight: 900, color: col }}>
                          Pensamiento {d.p}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: '#1A1033',
                          fontSize: '13px',
                          lineHeight: '1.5',
                        }}
                      >
                        {d.t}
                      </div>
                      {d.ev.length > 0 && (
                        <details style={{ marginTop: '6px' }}>
                          <summary
                            style={{
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 900,
                              color: col,
                              userSelect: 'none',
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
                              color: '#374151',
                            }}
                          >
                            {d.ev.map((e, idx) => (
                              <li key={idx} style={{ marginBottom: '3px' }}>
                                {e}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón Volver */}
            <button
              type="button"
              onClick={() => setSelectedBlock(null)}
              className="curr-back-btn"
            >
              ◀ Volver
            </button>
          </div>
        )}

        {/* ── 3. VISTA DETALLE DE TODOS LOS 12 DBA DE 5° ── */}
        {selectedBlock === 'dba' && (
          <div style={{ marginTop: '14px' }}>
            {/* Banner superior */}
            <div
              style={{
                background: '#FFF8EC',
                borderLeft: '5px solid #EA580C',
                padding: '12px 14px',
                borderRadius: '12px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#7A3200',
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                🎯 DBA · Derechos Básicos de Aprendizaje · Matemáticas 5°
              </div>
              <div style={{ fontSize: '12px', color: '#555', fontWeight: 700, marginTop: '2px' }}>
                Ministerio de Educación Nacional de Colombia · DBA versión 2 y Mallas de Aprendizaje de 5°
              </div>
            </div>

            {/* Lista completa de los 12 DBA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {DBA5_DATA.map((d) => {
                const col = PCOL[d.p] || '#5C21A6';
                return (
                  <div
                    key={d.n}
                    style={{
                      background: '#FFFFFF',
                      border: `1.5px solid ${col}33`,
                      borderLeft: `5px solid ${col}`,
                      borderRadius: '12px',
                      padding: '10px 14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          background: col,
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '2px 9px',
                          fontWeight: 900,
                          fontSize: '11px',
                        }}
                      >
                        DBA {d.n}
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 900, color: col }}>
                        Pensamiento {d.p}
                      </span>
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#1A1033',
                        fontSize: '13px',
                        lineHeight: '1.5',
                      }}
                    >
                      {d.t}
                    </div>
                    {d.ev.length > 0 && (
                      <details style={{ marginTop: '6px' }}>
                        <summary
                          style={{
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 900,
                            color: col,
                            userSelect: 'none',
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
                            color: '#374151',
                          }}
                        >
                          {d.ev.map((e, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {e}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botón Volver */}
            <button
              type="button"
              onClick={() => setSelectedBlock(null)}
              className="curr-back-btn"
            >
              ◀ Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
