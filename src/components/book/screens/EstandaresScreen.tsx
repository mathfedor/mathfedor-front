'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';

type TabType = 'pensamientos' | 'estandares' | 'competencias' | 'dba' | 'desempeno';

export default function EstandaresScreen() {
  const { progress, goScreen, book } = useBook();
  const [activeTab, setActiveTab] = useState<TabType>('pensamientos');

  const backScreen = progress ? 'home' : 'setup';

  return (
    <div className="screen active" id="screen-estandares-men">
      {book?.slug === 'libro-1ro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1rem' }}>
          <div
            className="feat-btn"
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0, cursor: 'default' }}
          >
            <div className="feat-icon" style={{ background: '#fff', fontSize: '26px', border: '1.5px solid #C5BFEE', boxShadow: 'none' }}>
              🇨🇴
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Estándares MEN</div>
              <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Programa de 1° Colombia</div>
            </div>
          </div>

          <div
            className="feat-btn"
            onClick={() => goScreen('problemas')}
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0 }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)', color: '#fff' }}>
              🛒
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Problemas Cotidianos</div>
              <div className="feat-meta">Conteo de monedas + compras + 4 operaciones</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      )}

      <div className="back-row" onClick={() => goScreen(backScreen)}>
        ← Volver al inicio
      </div>

      <div className="men-hero">
        <div className="flag">🇨🇴</div>
        <h2>📐 Estándares M.E.N. Colombia · 1° Primaria</h2>
        <div className="sub">
          Pensamientos Matemáticos · Estándares · Competencias · DBA · Desempeño
        </div>
      </div>

      <div style={{ padding: '0 .5rem' }}>
        <div className="men-tabs" id="menTabs">
          <button
            className={`men-tab ${activeTab === 'pensamientos' ? 'on' : ''}`}
            onClick={() => setActiveTab('pensamientos')}
          >
            🧠 Pensamientos
          </button>
          <button
            className={`men-tab ${activeTab === 'estandares' ? 'on' : ''}`}
            onClick={() => setActiveTab('estandares')}
          >
            📜 Estándares
          </button>
          <button
            className={`men-tab ${activeTab === 'competencias' ? 'on' : ''}`}
            onClick={() => setActiveTab('competencias')}
          >
            🎯 Competencias
          </button>
          <button
            className={`men-tab ${activeTab === 'dba' ? 'on' : ''}`}
            onClick={() => setActiveTab('dba')}
          >
            📘 DBA
          </button>
          <button
            className={`men-tab ${activeTab === 'desempeno' ? 'on' : ''}`}
            onClick={() => setActiveTab('desempeno')}
          >
            ⭐ Desempeño
          </button>
        </div>

        {/* PENSAMIENTOS MATEMÁTICOS */}
        {activeTab === 'pensamientos' && (
          <div id="men-pensamientos" className="men-pane">
            <div className="men-section pensamiento">
              <h3>
                <span className="ic">🧮</span> Pensamiento Numérico
              </h3>
              <div className="desc">
                Comprende los números naturales, sus operaciones y propiedades.
              </div>
              <ul>
                <li>Reconoce, lee y escribe números del 0 al 99.</li>
                <li>Identifica unidades, decenas y centenas.</li>
                <li>Resuelve adiciones y sustracciones con números hasta el 100.</li>
                <li>Comprende la multiplicación como suma de grupos iguales.</li>
                <li>Comprende la división como reparto en partes iguales.</li>
              </ul>
            </div>

            <div className="men-section pensamiento">
              <h3>
                <span className="ic">📐</span> Pensamiento Espacial
              </h3>
              <div className="desc">
                Reconoce figuras y relaciones geométricas en el entorno.
              </div>
              <ul>
                <li>Identifica figuras planas: círculo, cuadrado, triángulo, rectángulo.</li>
                <li>Reconoce líneas: rectas, curvas, abiertas, cerradas.</li>
                <li>Calcula el perímetro de figuras simples.</li>
                <li>Reconoce posiciones: arriba/abajo, dentro/fuera, cerca/lejos.</li>
              </ul>
            </div>

            <div className="men-section pensamiento">
              <h3>
                <span className="ic">📏</span> Pensamiento Métrico
              </h3>
              <div className="desc">Comprende magnitudes y mediciones.</div>
              <ul>
                <li>Compara longitudes usando unidades no convencionales.</li>
                <li>Reconoce el metro como unidad de longitud.</li>
                <li>Identifica relaciones de proporcionalidad simple.</li>
              </ul>
            </div>

            <div className="men-section pensamiento">
              <h3>
                <span className="ic">📊</span> Pensamiento Aleatorio
              </h3>
              <div className="desc">Organiza, lee e interpreta datos.</div>
              <ul>
                <li>Recolecta datos a través de encuestas simples.</li>
                <li>Construye y lee gráficos de barras y tablas de frecuencia.</li>
                <li>Identifica el dato mayor, menor y el total.</li>
              </ul>
            </div>

            <div className="men-section pensamiento">
              <h3>
                <span className="ic">🔄</span> Pensamiento Variacional
              </h3>
              <div className="desc">Reconoce regularidades, patrones y secuencias.</div>
              <ul>
                <li>Identifica patrones numéricos: pares, impares, secuencias.</li>
                <li>
                  Continúa secuencias contando de 1 en 1, 2 en 2, 5 en 5, 10 en 10.
                </li>
                <li>Reconoce el antes y el después de un número.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ESTÁNDARES BÁSICOS */}
        {activeTab === 'estandares' && (
          <div id="men-estandares" className="men-pane">
            <div className="men-section">
              <h3>
                <span className="ic">📜</span> Estándares Básicos de Competencias
              </h3>
              <div className="desc">
                Lo que TODO estudiante de 1° debe saber y saber hacer.
              </div>
              <ul>
                <li>
                  <strong>Reconoce</strong> significados del número en diferentes
                  contextos (medición, conteo, comparación, codificación).
                </li>
                <li>
                  <strong>Describe</strong>, compara y cuantifica situaciones con
                  números, en diferentes contextos y con diversas representaciones.
                </li>
                <li>
                  <strong>Usa</strong> los números (en sus diferentes
                  representaciones) y las operaciones para formular y resolver
                  problemas.
                </li>
                <li>
                  <strong>Identifica</strong>, si a la luz de los datos de un
                  problema, los resultados obtenidos son o no razonables.
                </li>
                <li>
                  <strong>Reconoce</strong> figuras congruentes y semejantes.
                </li>
                <li>
                  <strong>Realiza</strong> y describe procesos de medición con
                  patrones arbitrarios y convencionales.
                </li>
                <li>
                  <strong>Interpreta</strong> cualitativamente datos referidos a
                  situaciones del entorno escolar.
                </li>
                <li>
                  <strong>Reconoce</strong> y describe regularidades y patrones en
                  distintos contextos.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* COMPETENCIAS */}
        {activeTab === 'competencias' && (
          <div id="men-competencias" className="men-pane">
            <div className="men-section competencia">
              <h3>
                <span className="ic">🎯</span> Competencias Matemáticas
              </h3>
              <ul>
                <li>
                  <strong>Comunicación matemática:</strong> Expresa, interpreta y
                  representa ideas matemáticas usando lenguaje natural y simbólico.
                </li>
                <li>
                  <strong>Razonamiento:</strong> Identifica patrones, formula
                  conjeturas y las justifica con argumentos.
                </li>
                <li>
                  <strong>Resolución de problemas:</strong> Aplica estrategias para
                  resolver situaciones del entorno.
                </li>
                <li>
                  <strong>Modelación:</strong> Representa situaciones reales mediante
                  modelos matemáticos sencillos.
                </li>
                <li>
                  <strong>Ejercitación de procedimientos:</strong> Aplica algoritmos
                  básicos de cálculo.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* DERECHOS BÁSICOS DE APRENDIZAJE (DBA) */}
        {activeTab === 'dba' && (
          <div id="men-dba" className="men-pane">
            <div className="men-section dba">
              <h3>
                <span className="ic">📘</span> Derechos Básicos de Aprendizaje · 1°
              </h3>
              <div className="desc">
                Conjunto de aprendizajes mínimos que el estudiante debe lograr en cada
                grado.
              </div>
              <ul>
                <li>
                  <strong>DBA 1:</strong> Identifica los usos de los números (cardinal,
                  ordinal, código) y las operaciones (suma, resta) en contextos de juego,
                  familiares, económicos, entre otros.
                </li>
                <li>
                  <strong>DBA 2:</strong> Utiliza diferentes estrategias para contar,
                  realizar operaciones y resolver problemas aditivos.
                </li>
                <li>
                  <strong>DBA 3:</strong> Compara objetos del entorno y establece
                  semejanzas y diferencias empleando características geométricas de las
                  formas bidimensionales y tridimensionales.
                </li>
                <li>
                  <strong>DBA 4:</strong> Describe y representa trayectorias y posiciones
                  de objetos y personas para orientar a otros o a sí mismo en el espacio
                  circundante.
                </li>
                <li>
                  <strong>DBA 5:</strong> Realiza medición de longitudes, capacidades,
                  peso, masa, etc. usando patrones e instrumentos no estandarizados.
                </li>
                <li>
                  <strong>DBA 6:</strong> Clasifica y organiza datos, los representa
                  utilizando tablas de conteo y pictogramas con escalas, y comunica los
                  resultados obtenidos para responder preguntas sencillas.
                </li>
                <li>
                  <strong>DBA 7:</strong> Reconoce, describe y representa los
                  desplazamientos y las posiciones de objetos en el plano y en el espacio.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* NIVELES DE DESEMPEÑO */}
        {activeTab === 'desempeno' && (
          <div id="men-desempeno" className="men-pane">
            <div className="men-section desempeno">
              <h3>
                <span className="ic">⭐</span> Niveles de Desempeño
              </h3>
              <div className="desc">
                Escala de valoración del aprendizaje del estudiante en Colombia.
              </div>
              <div className="men-niveles">
                <div className="men-nivel men-n-superior">
                  <div className="l">90 — 100</div>
                  <div className="n">🥇 Superior</div>
                  <div className="d">
                    Los estudiantes pueden aplicar las operaciones básicas para
                    resolver problemas cotidianos y reconocer y describir una variedad
                    de figuras geométricas sin dificultad, mostrando un entendimiento
                    más completo de cómo se relacionan entre sí.
                  </div>
                </div>
                <div className="men-nivel men-n-alto">
                  <div className="l">75 — 89</div>
                  <div className="n">🏅 Alto</div>
                  <div className="d">
                    Ya reconocen varias figuras geométricas y sus características, y
                    manejan sumas y restas con mayor fluidez. También comienzan a
                    resolver multiplicaciones muy sencillas y a entender conceptos de
                    división de forma muy básica.
                  </div>
                </div>
                <div className="men-nivel men-n-basico">
                  <div className="l">60 — 74</div>
                  <div className="n">⭐ Básico</div>
                  <div className="d">
                    Los estudiantes ya pueden reconocer más figuras geométricas, como
                    triángulos o rectángulos, y pueden sumar y restar sin tanto apoyo.
                    Tal vez comienzan a explorar la idea de la multiplicación como
                    suma de grupos iguales.
                  </div>
                </div>
                <div className="men-nivel men-n-bajo">
                  <div className="l">0 — 59</div>
                  <div className="n">📚 Bajo</div>
                  <div className="d">
                    Los estudiantes apenas están reconociendo las formas geométricas
                    más básicas y necesitan mucha guía para identificar figuras como
                    el círculo o el cuadrado. En cuanto a las operaciones, se enfocan
                    en sumar y restar con números muy pequeños, con bastante apoyo
                    visual y concreto.
                  </div>
                </div>
              </div>
            </div>

            <div className="men-card">
              <span className="em">🎯</span>
              <div className="info">
                <div className="t">Meta del año escolar</div>
                <div className="s">
                  Que TODOS los estudiantes alcancen al menos el nivel BÁSICO (60+)
                  en cada DBA.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
