'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ConceptoModal4to from './ConceptoModal4to';

export type TopHeaderModalType = 'concepto' | 'desafio' | 'historia' | null;

interface TopHeaderModals4toProps {
  modal: TopHeaderModalType;
  onClose: () => void;
  onUpdateStats?: (coinsToAdd: number, streakToAdd: number, xpToAdd: number) => void;
}

// ── Audio tone synthesis helper matching fedor5Tono ──
function playTono(freq = 520, duration = 0.12) {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

// ── Speech synthesis helper matching fedor5Hablar ──
function hablarTexto(texto: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const clean = texto.replace(/<[^>]*>/g, ' ');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'es-ES';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {}
}

export default function TopHeaderModals4to({
  modal,
  onClose,
  onUpdateStats,
}: TopHeaderModals4toProps) {
  // ── State for Desafío Modal ──
  const [desafioMinimized, setDesafioMinimized] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [digitC, setDigitC] = useState('');
  const [digitD, setDigitD] = useState('');
  const [digitU, setDigitU] = useState('');
  const [carryC, setCarryC] = useState('');
  const [carryD, setCarryD] = useState('');
  const [carryU, setCarryU] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [desafioFeedback, setDesafioFeedback] = useState<{
    type: 'success' | 'error' | null;
    msg: string;
  }>({ type: null, msg: '' });

  // Reset or initialize when modal changes
  useEffect(() => {
    if (modal === 'desafio') {
      setDigitC('');
      setDigitD('');
      setDigitU('');
      setCarryC('');
      setCarryD('');
      setCarryU('');
      setUserAnswer('');
      setShowBlocks(false);
      setDesafioFeedback({ type: null, msg: '' });
      setDesafioMinimized(false);
    }
  }, [modal]);

  // Desafío check
  const handleCheckDesafio = () => {
    const entered = userAnswer.trim() || `${digitC}${digitD}${digitU}`.trim();
    if (entered === '801') {
      playTono(780, 0.25);
      setDesafioFeedback({
        type: 'success',
        msg: '🎉 ¡Correcto! 234 + 567 = 801. ¡Ganaste +150 XP y +30 🪙!',
      });
      if (onUpdateStats) {
        onUpdateStats(30, 1, 150);
      }
      try {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`fedor4_desafio_${today}`, '1');
      } catch {}
      Swal.fire({
        icon: 'success',
        title: '¡Desafío Acertado! 🎯',
        html: '<div style="font-size:15px;font-weight:bold;color:#3D1468">¡Excelente cálculo! <b>234 + 567 = 801</b><br/><span style="color:#059669">+150 XP · +30 🪙</span></div>',
        confirmButtonColor: '#E8650A',
        confirmButtonText: '¡Genial!',
      });
    } else {
      playTono(320, 0.2);
      setDesafioFeedback({
        type: 'error',
        msg: '❌ Vuelve a intentarlo. Recuerda sumar columna por columna empezando por las unidades.',
      });
      Swal.fire({
        icon: 'warning',
        title: '¡Casi lo logras!',
        text: 'Pista: 4 + 7 = 11 (escribes 1 y llevas 1 a las decenas).',
        confirmButtonColor: '#E8650A',
        confirmButtonText: 'Intentar de nuevo',
      });
    }
  };

  if (!modal) return null;

  if (modal === 'concepto') {
    return <ConceptoModal4to isOpen={true} onClose={onClose} />;
  }

  return (
    <div
      className="modal-overlay-4to"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card-4to">


        {/* ══════════════════════════════════════════════════
            2. MODAL: DESAFÍO DEL DÍA (IMAGEN 2)
        ══════════════════════════════════════════════════ */}
        {modal === 'desafio' && (
          <div className="modal-content-wrap">
            {/* Modal Header */}
            <div className="modal-hdr-row">
              <div className="modal-title-main">
                <span className="modal-icon">🎯</span>
                <span>Desafío del Día</span>
              </div>
              <button
                type="button"
                className="modal-close-circle"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Subheader and Math Expression */}
            <div className="desafio-meta-header">
              <div className="desafio-kicker">🎯 DESAFÍO DEL DÍA</div>
              <div className="desafio-topic-title">Suma rápida</div>
              <div className="desafio-math-equation">234 + 567 = ?</div>
            </div>

            {/* Purple Card: Pizarra de suma columna por columna */}
            <div className={`widget-card-purple ${desafioMinimized ? 'minimized' : ''}`}>
              <div className="widget-header-purple">
                <div className="widget-title-area">
                  <span className="widget-brain-icon">🧠</span>
                  <span className="widget-title-text">Pizarra de suma</span>
                  <span className="widget-subtitle-text">columna por columna</span>
                </div>
                <button
                  type="button"
                  className="widget-toggle-btn"
                  onClick={() => setDesafioMinimized(!desafioMinimized)}
                  title="Mostrar u ocultar"
                >
                  ▾
                </button>
              </div>

              {!desafioMinimized && (
                <>
                  <div className="widget-body-purple">
                    {/* Column Addition Table */}
                    <div className="pizarra-table-wrapper">
                      <table className="pizarra-math-table">
                        <thead>
                          <tr>
                            <th className="op-empty-th"></th>
                            <th>
                              <span className="col-badge badge-c">C</span>
                            </th>
                            <th>
                              <span className="col-badge badge-d">D</span>
                            </th>
                            <th>
                              <span className="col-badge badge-u">U</span>
                            </th>
                          </tr>
                          <tr className="carry-row">
                            <td className="op-cell"></td>
                            <td>
                              <input
                                className="carry-input"
                                maxLength={1}
                                value={carryC}
                                onChange={(e) => setCarryC(e.target.value.replace(/[^0-9]/g, ''))}
                                title="Llevada Centenas"
                              />
                            </td>
                            <td>
                              <input
                                className="carry-input"
                                maxLength={1}
                                value={carryD}
                                onChange={(e) => setCarryD(e.target.value.replace(/[^0-9]/g, ''))}
                                title="Llevada Decenas"
                              />
                            </td>
                            <td>
                              <input
                                className="carry-input"
                                maxLength={1}
                                value={carryU}
                                onChange={(e) => setCarryU(e.target.value.replace(/[^0-9]/g, ''))}
                                title="Llevada Unidades"
                              />
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Row 1: 2 3 4 */}
                          <tr className="num-row">
                            <td className="op-cell"></td>
                            <td className="digit-cell color-c">2</td>
                            <td className="digit-cell color-d">3</td>
                            <td className="digit-cell color-u">4</td>
                          </tr>
                          {/* Row 2: + 5 6 7 */}
                          <tr className="num-row">
                            <td className="op-cell op-plus">+</td>
                            <td className="digit-cell color-c">5</td>
                            <td className="digit-cell color-d">6</td>
                            <td className="digit-cell color-u">7</td>
                          </tr>
                          {/* Solid Divider Line */}
                          <tr className="divider-line-row">
                            <td colSpan={4}>
                              <div className="pizarra-thick-line" />
                            </td>
                          </tr>
                          {/* Result Inputs: Yellow Dashed */}
                          <tr className="res-row">
                            <td className="op-cell"></td>
                            <td className="res-input-td">
                              <input
                                id="colInpC"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="col-input-yellow"
                                value={digitC}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setDigitC(val);
                                  setUserAnswer(`${val}${digitD}${digitU}`);
                                }}
                              />
                            </td>
                            <td className="res-input-td">
                              <input
                                id="colInpD"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="col-input-yellow"
                                value={digitD}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setDigitD(val);
                                  setUserAnswer(`${digitC}${val}${digitU}`);
                                  if (val) {
                                    const prev = document.getElementById('colInpC');
                                    if (prev) prev.focus();
                                  }
                                }}
                              />
                            </td>
                            <td className="res-input-td">
                              <input
                                id="colInpU"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="col-input-yellow"
                                value={digitU}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setDigitU(val);
                                  setUserAnswer(`${digitC}${digitD}${val}`);
                                  if (val) {
                                    const prev = document.getElementById('colInpD');
                                    if (prev) prev.focus();
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pizarra-instruccion-tip">
                      <span>☝️</span> Escribe en las casillas amarillas de derecha a izquierda.
                      Arriba, en rojo, anota lo que llevas.
                    </div>

                    {/* Interactive Action Bar inside purple card */}
                    <div className="pizarra-buttons-row">
                      <button
                        type="button"
                        className="btn-como-se-hace"
                        onClick={() =>
                          hablarTexto(
                            'Suma columna por columna, empezando por las unidades. 4 más 7 da 11; escribes 1 en las unidades y llevas 1 a las decenas. Luego 3 más 6 más 1 que llevabas da 10; escribes 0 y llevas 1. Finalmente 2 más 5 más 1 da 8.'
                          )
                        }
                      >
                        📢 ¿Cómo se hace?
                      </button>
                      <button
                        type="button"
                        className="btn-ver-bloques"
                        onClick={() => setShowBlocks(!showBlocks)}
                      >
                        🧱 Ver con bloques
                      </button>
                      <div className="msg-bubble-unidades">
                        Empieza por la columna de la derecha (unidades) ➔ ←
                      </div>
                    </div>

                    {/* Optional Base-10 Blocks Visualization */}
                    {showBlocks && (
                      <div className="bloques-visual-box">
                        <div className="bloques-grupo">
                          <div className="bloques-grid">
                            {/* 234: 2 centenas, 3 decenas, 4 unidades */}
                            <div className="bloques-col">
                              <span className="blq-label">234:</span>
                              <div className="blq-centenas">
                                <span className="blq-c100" />
                                <span className="blq-c100" />
                              </div>
                              <div className="blq-decenas">
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                              </div>
                              <div className="blq-unidades">
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                              </div>
                            </div>
                            <div className="blq-plus">+</div>
                            {/* 567: 5 centenas, 6 decenas, 7 unidades */}
                            <div className="bloques-col">
                              <span className="blq-label">567:</span>
                              <div className="blq-centenas">
                                <span className="blq-c100" />
                                <span className="blq-c100" />
                                <span className="blq-c100" />
                                <span className="blq-c100" />
                                <span className="blq-c100" />
                              </div>
                              <div className="blq-decenas">
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                                <span className="blq-c10" />
                              </div>
                              <div className="blq-unidades">
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                                <span className="blq-c1" />
                              </div>
                            </div>
                          </div>
                          <div className="bloques-legend">
                            🟦 centena = 100 · 🟩 decena = 10 · 🟧 unidad = 1 · Cada 10 unidades se
                            cambian por 1 decena.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Submission Area */}
            <div className="desafio-submit-area">
              <input
                type="text"
                className="input-tu-respuesta"
                placeholder="Tu respuesta"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckDesafio();
                }}
              />

              <button
                type="button"
                className="btn-comprobar-desafio"
                onClick={handleCheckDesafio}
              >
                ✅ Comprobar
              </button>

              <div className="pista-desafio-text">
                <span>💡</span> Pista: Suma columna por columna
              </div>

              {desafioFeedback.msg && (
                <div className={`feedback-alert ${desafioFeedback.type}`}>
                  {desafioFeedback.msg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            3. MODAL: HISTORIA DEL MÉTODO FEDOR (IMAGEN 3)
        ══════════════════════════════════════════════════ */}
        {modal === 'historia' && (
          <div className="modal-content-wrap">
            {/* Modal Header */}
            <div className="modal-hdr-row">
              <div className="modal-title-main">
                <span className="modal-icon">📜</span>
                <span>Historia del Método Fedor</span>
              </div>
              <button
                type="button"
                className="modal-close-circle"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Container with exact text and cards matching Image 3 and HTML */}
            <div className="historia-cards-scroll">
              {/* Card 1: Fernando Bastidas Parra */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🧠</span> Fernando Bastidas Parra
                </h3>
                <p className="historia-card-paragraph">
                  Educador, investigador y creador de contenidos educativos con impacto
                  territorial. Especialista en matemáticas, sistemas y pedagogía digital. Líder del
                  método Fedor, con resultados destacados en pruebas Saber y transformación de
                  prácticas docentes.
                </p>
              </div>

              {/* Card 2: Logros Profesionales Destacados */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🎯</span> Logros Profesionales Destacados
                </h3>
                <ul className="historia-card-list">
                  <li>
                    <b>2024:</b> El grupo de la I.E. Inem Jorge Isaacs que aplicó el método Fedor
                    obtuvo el promedio más alto del sector oficial en Cali (330.9), superando al
                    primer colegio oficial (317).
                  </li>
                  <li>
                    <b>2022–2023:</b> Mejoramiento sostenido en los promedios de Pruebas Saber en
                    grupos de 11° del INEM Jorge Isaacs, gracias al método Fedor.
                  </li>
                  <li>
                    <b>2017-2023:</b> Pruebas de Acompañamiento pedagógico con el software de
                    Matemáticas de Fedor en dos colegios oficiales con docentes de primaria.
                  </li>
                  <li>
                    <b>2015:</b> Acompañamiento pedagógico a docentes de primaria en matemáticas, con
                    aplicación de prueba diagnóstica y ajuste del programa en grado 11°. Resultado:
                    cumplimiento del ISCE y reconocimiento oficial del Ministerio de Educación
                    Nacional, con incentivo salarial colectivo.
                  </li>
                  <li>
                    <b>2020:</b> Nominado al Premio Compartir al Maestro (suspendido por pandemia).
                  </li>
                  <li>
                    <b>2008:</b> Mención de Honor al Mérito Investigativo por la Secretaría de
                    Educación de Cali.
                  </li>
                  <li>
                    <b>2013:</b> Tutor de docentes en el Ministerio de Educación Nacional.
                  </li>
                  <li>
                    <b>2013:</b> Proyecto seleccionado por el SENA: “Videojuego para aprender
                    matemáticas por competencias”.
                  </li>
                  <li>
                    <b>2007 y 2005:</b> Mención de Honor del Premio Compartir al Maestro.
                  </li>
                  <li>
                    Investigador y ponente en múltiples eventos nacionales e internacionales desde
                    2004, incluyendo Redipe, Universidad Santiago de Cali, Universidad San
                    Buenaventura, Universidad Pedagógica y Tecnológica de Colombia, y el Foro
                    Educativo Nacional del M.E.N. de Colombia.
                  </li>
                </ul>
              </div>

              {/* Card 3: Producción Intelectual y Recursos Educativos */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>📚</span> Producción Intelectual y Recursos Educativos
                </h3>
                <ul className="historia-card-list">
                  <li>
                    <a
                      href="https://www.matematicasdefedor.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="historia-link"
                    >
                      https://www.matematicasdefedor.com/
                    </a>
                  </li>
                  <li>
                    Libros digitales registrados para Educación Secundaria (grados 6° a 11°) en 2025
                    y 2026.
                  </li>
                  <li>
                    Libros digitales registrados para Educación Básica Primaria (grados 1° a 5°) en
                    2018 y 2020.
                  </li>
                  <li>
                    Artículo académico: “Desarrollo de videojuegos educativos 3D” (Revista ISSN
                    1390-938x, N°17, 2019).
                  </li>
                  <li>
                    Plataforma educativa: Matemáticas de Fedor, con presencia en medios digitales y
                    YouTube. Suricata Labs | Canal YouTube | Video destacado
                  </li>
                </ul>
              </div>

              {/* Card 4: Formación Académica */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🎓</span> Formación Académica
                </h3>
                <ul className="historia-card-list">
                  <li>
                    Maestría en Investigación Integrativa – Multiversidad Mundo Real Edgar Morín
                    (2015–2019).
                  </li>
                  <li>Especialización en Sistemas – Universidad del Valle (1999).</li>
                  <li>Licenciatura en Matemáticas – Universidad Santiago de Cali (1992).</li>
                  <li>
                    Estudios de Magíster en Educación con énfasis en Matemáticas – Universidad del
                    Valle (1995, pendiente).
                  </li>
                  <li>Bachillerato – Colegio Rafael Pombo (1977).</li>
                </ul>
              </div>

              {/* Card 5: Actualización Profesional */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🔄</span> Actualización Profesional
                </h3>
                <ul className="historia-card-list">
                  <li>Formación en pedagogía mediada por TIC (2014–2016).</li>
                  <li>
                    Actualización disciplinar en áreas básicas – Universidad Autónoma (2019).
                  </li>
                  <li>
                    Formación de formadores en ambientes de aprendizaje mediados por tecnología.
                  </li>
                </ul>
              </div>

              {/* Card 6: Experiencia Docente Universitaria */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🏫</span> Experiencia Docente Universitaria
                </h3>
                <p className="historia-card-paragraph">
                  <b>Instituciones:</b> Universidad del Valle, Universidad San Buenaventura, CUAO,
                  CECEP, Universidad Inca, Universidad Antonio Nariño, Multiversidad Mundo Real.
                </p>
                <p className="historia-card-paragraph" style={{ marginTop: '6px' }}>
                  <b>Asignaturas dictadas:</b> Matemáticas I y II, Cálculo, Álgebra Lineal,
                  Estadística, Investigación de Operaciones, Inteligencia Artificial, Teoría de la
                  Decisión, Simulación, Cibernética, Programación y Control, Procesos Estocásticos.
                </p>
              </div>

              {/* Card 7: Experiencia Docente en Educación Básica y Media */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🧮</span> Experiencia Docente en Educación Básica y Media
                </h3>
                <ul className="historia-card-list">
                  <li>
                    <b>INEM Jorge Isaacs (2008–2026):</b> Profesor de matemáticas en bachillerato.
                  </li>
                  <li>
                    <b>Juan Pablo II (2003–2008):</b> Docente de sistemas, física y matemáticas en
                    bachillerato y primaria.
                  </li>
                  <li>
                    <b>Otros colegios:</b> Cañaverales Bilingual School, León de Greiff, Colombo
                    Británico, Lauretta Bender, Alférez Real, Martin Luther King, San Vicente
                    Ferrer.
                  </li>
                </ul>
              </div>

              {/* Card 8: Reconocimientos y Proyectos Especiales */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🏆</span> Reconocimientos y Proyectos Especiales
                </h3>
                <ul className="historia-card-list">
                  <li>
                    Expositor en el I Foro Departamental de Producción Intelectual – Gobernación del
                    Valle.
                  </li>
                  <li>
                    Instructor en cursos de razonamiento abstracto para docentes – Universidad del
                    Valle, ICFES, Centro Piloto de Cali.
                  </li>
                  <li>
                    Primer puesto en evaluación docente en matemáticas – Universidad del Valle
                    (1995).
                  </li>
                  <li>Placa de honor por excelencia educativa – CECEP (1999).</li>
                </ul>
              </div>

              {/* Card 9: Origen del Método Fedor */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>📖</span> Origen del Método Fedor
                </h3>
                <p className="historia-card-paragraph">
                  El <b>Método Fedor</b> nació de la observación pedagógica de que los niños
                  aprenden matemáticas mucho mejor cuando el contenido se presenta en 4 pasos
                  claros: <b>VERTICAL</b> (visualización), <b>Instrucción</b>, <b>Procedimiento</b>{' '}
                  y <b>Resultado</b>.
                </p>
              </div>

              {/* Card 10: Grados (4° grado) */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🚀</span> Grados
                </h3>
                <p className="historia-card-paragraph">
                  <b>4° grado (este libro):</b> Ampliación a millones, MCD/MCM, fracciones
                  completas, potencias, sistema métrico decimal, geometría y probabilidad.
                </p>
                <p className="historia-card-paragraph" style={{ marginTop: '8px' }}>
                  <b>Unidades del libro:</b>
                </p>
                <ul className="historia-card-list">
                  <li>Unidad 1 — Adición y Sistema Decimal</li>
                  <li>Unidad 2 — Sustracción</li>
                  <li>Unidad 3 — Multiplicación</li>
                  <li>Unidad 4 — División</li>
                  <li>Unidad 5 — Problemas Mixtos</li>
                  <li>Unidad 6 — Divisores y Factores</li>
                  <li>Unidad 7 — MCD y MCM</li>
                  <li>Unidad 8 — Fracciones</li>
                  <li>Unidad 9 — Aplicaciones con Fracciones</li>
                  <li>Unidad 10 — Sistema Métrico Decimal</li>
                  <li>Unidad 11 — Potenciación</li>
                  <li>Unidad 12 — Geometría</li>
                  <li>Unidad 13 — Estadística y Probabilidad</li>
                  <li>Unidad 14 — Bonus: Cálculo Mental</li>
                  <li>Unidad 15 — Bonus: Retos Multiplicativos</li>
                </ul>
              </div>

              {/* Card 11: Los 5 niveles */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>🎯</span> Los 5 niveles
                </h3>
                <ul className="historia-card-list">
                  <li>
                    <b>N1 Cadete</b> — Reconoce conceptos básicos
                  </li>
                  <li>
                    <b>N2 Piloto</b> — Aplica procedimientos
                  </li>
                  <li>
                    <b>N3 Capitán</b> — Resuelve contextos variados
                  </li>
                  <li>
                    <b>N4 Comandante</b> — Analiza y compara
                  </li>
                  <li>
                    <b>N5 SABER</b> — Prueba nacional
                  </li>
                </ul>
              </div>

              {/* Card 12: Gamificación */}
              <div className="historia-card-box">
                <h3 className="historia-card-heading">
                  <span>💫</span> Gamificación
                </h3>
                <p className="historia-card-paragraph">
                  El sistema de XP recompensa cada ejercicio (N1=65, N2=110, N3=145, N4=170,
                  N5=200). Los 5 rangos van desde <b>🌱 Aprendiz Cósmico</b> hasta{' '}
                  <b>🏆 Gran Maestro</b>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay-4to {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(15, 7, 32, 0.75);
          backdrop-filter: blur(6px);
          animation: fzFadeIn 0.2s ease-out;
          font-family: 'Nunito', sans-serif;
        }

        @keyframes fzFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-card-4to {
          width: 100%;
          max-width: 740px;
          max-height: 92vh;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(42, 15, 96, 0.25), 0 0 0 1px rgba(232, 219, 255, 0.8);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .modal-content-wrap {
          padding: 24px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* ── Header ── */
        .modal-hdr-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .modal-title-main {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #2b1055;
          letter-spacing: -0.01em;
        }

        .modal-icon {
          font-size: 26px;
          line-height: 1;
        }

        .modal-close-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f5f2fe;
          border: 1.5px solid #e5dbff;
          color: #6d28d9;
          font-size: 15px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-close-circle:hover {
          background: #ede8ff;
          transform: scale(1.08);
          color: #4c1d95;
        }

        /* ── Concepto Hero Card ── */
        .concepto-hero-card {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          border-radius: 18px;
          padding: 16px 20px;
          color: #ffffff;
          margin-bottom: 16px;
          box-shadow: 0 8px 22px rgba(30, 64, 175, 0.25);
        }

        .hero-card-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-card-desc {
          margin: 0 0 10px 0;
          font-size: 14.5px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }

        .hero-card-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 12px;
          padding: 7px 14px;
          font-weight: 900;
          font-size: 13.5px;
          color: #ffffff;
        }

        /* ── Widget Green (Buscador Divisores) ── */
        .widget-card-green {
          border-radius: 20px;
          background: #ffffff;
          border: 2px solid #5eead4;
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.12);
          overflow: hidden;
          margin-bottom: 20px;
        }

        .widget-header-green {
          background: #10b981;
          padding: 11px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
        }

        .widget-title-area {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 16.5px;
          color: #ffffff;
        }

        .widget-brain-icon {
          font-size: 18px;
        }

        .widget-subtitle-text {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 12px;
          opacity: 0.9;
          margin-left: 4px;
        }

        .widget-toggle-btn {
          background: rgba(255, 255, 255, 0.22);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          color: #ffffff;
          border-radius: 10px;
          padding: 2px 10px;
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
        }

        .widget-body-green {
          padding: 18px 20px 14px;
        }

        .buscador-grid-row {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .dots-outer-box {
          background: #ffffff;
          border: 2px solid #eeebfb;
          border-radius: 16px;
          padding: 12px 18px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
        }

        .dots-grid-container {
          display: grid;
          gap: 6px;
          align-items: center;
          justify-content: center;
        }

        .fz-dot-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ffd27a, #e8650a);
          box-shadow: 0 2px 4px rgba(232, 101, 10, 0.35);
          display: inline-block;
          transition: all 0.25s ease;
        }

        .fz-dot-circle.is-remainder {
          background: radial-gradient(circle at 35% 30%, #ff9aa2, #c94b22);
          box-shadow: 0 2px 4px rgba(201, 75, 34, 0.35);
        }

        .buscador-info-col {
          flex: 1;
          min-width: 230px;
          max-width: 320px;
        }

        .dashed-msg-box {
          background: #ffffff;
          border: 2px dashed #c4b5fd;
          border-radius: 14px;
          padding: 10px 14px;
          font-weight: 900;
          font-size: 13.5px;
          color: #2b1055;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        .divisores-label {
          font-size: 12.5px;
          font-weight: 900;
          color: #0f766e;
          margin-top: 8px;
        }

        .chips-list-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .divisor-chip-green {
          min-width: 38px;
          height: 36px;
          padding: 0 10px;
          border-radius: 12px;
          background: #6ee7b7;
          border: 2px solid #0f766e;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 15px;
          color: #042f2e;
        }

        .info-tip-note {
          font-size: 11.5px;
          font-weight: 800;
          color: #6b5e8a;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .rule-tip-note {
          font-size: 12px;
          font-weight: 800;
          color: #4b5563;
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .widget-footer-green {
          padding: 0 20px 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .footer-label-filas {
          font-weight: 900;
          color: #0f766e;
          font-size: 13.5px;
        }

        .btn-filas-num {
          border: none;
          border-radius: 12px;
          width: 38px;
          height: 38px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
          transition: transform 0.12s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-filas-num:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }

        .btn-resolver-anim {
          border: none;
          border-radius: 12px;
          padding: 9px 16px;
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(135deg, #ff8c2a, #e8650a);
          box-shadow: 0 3px 10px rgba(232, 101, 10, 0.3);
          transition: transform 0.12s ease;
        }

        .btn-resolver-anim:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }

        .concepto-bottom-actions {
          display: flex;
          justify-content: center;
          margin-top: 4px;
        }

        .btn-escuchar-concepto {
          border: none;
          border-radius: 14px;
          padding: 12px 28px;
          font-weight: 900;
          font-size: 14.5px;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(135deg, #ff8c2a, #e8650a);
          box-shadow: 0 4px 16px rgba(232, 101, 10, 0.35);
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-escuchar-concepto:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(232, 101, 10, 0.45);
        }

        /* ── Desafío Section ── */
        .desafio-meta-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .desafio-kicker {
          font-size: 12px;
          font-weight: 900;
          color: #6b5e8a;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .desafio-topic-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #c2410c;
          margin-bottom: 12px;
        }

        .desafio-math-equation {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 30px;
          font-weight: 900;
          color: #1a1033;
          margin: 8px 0 16px;
        }

        /* ── Widget Purple (Pizarra de Suma) ── */
        .widget-card-purple {
          border-radius: 20px;
          background: #ffffff;
          border: 2px solid #c4b5fd;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12);
          overflow: hidden;
          margin-bottom: 20px;
        }

        .widget-header-purple {
          background: linear-gradient(90deg, #7c3aed, #8b3edb);
          padding: 11px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
        }

        .widget-body-purple {
          padding: 18px 20px 16px;
        }

        .pizarra-table-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .pizarra-math-table {
          border-collapse: separate;
          border-spacing: 6px;
          margin: 0 auto;
        }

        .pizarra-math-table th {
          padding: 0;
          text-align: center;
        }

        .col-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 28px;
          border-radius: 8px;
          font-weight: 900;
          font-size: 13px;
          color: #ffffff;
        }

        .badge-c {
          background: #c94b22;
        }
        .badge-d {
          background: #16876a;
        }
        .badge-u {
          background: #e8650a;
        }

        .carry-row td {
          text-align: center;
          height: 24px;
        }

        .carry-input {
          width: 32px;
          height: 24px;
          border: 1px dashed #fca5a5;
          border-radius: 6px;
          background: #fff5f5;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 14px;
          font-weight: 900;
          color: #c94b22;
          outline: none;
        }

        .digit-cell {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #ffffff;
          border: 2px solid #eeebfb;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .color-c {
          color: #c94b22;
        }
        .color-d {
          color: #16876a;
        }
        .color-u {
          color: #e8650a;
        }

        .op-cell {
          width: 30px;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
        }

        .op-plus {
          color: #e8650a;
        }

        .pizarra-thick-line {
          height: 4px;
          background: #1a1033;
          border-radius: 2px;
          width: 100%;
          margin: 4px 0;
        }

        .res-input-td {
          width: 44px;
          height: 44px;
          text-align: center;
        }

        .col-input-yellow {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #fffbea;
          border: 2.5px dashed #f5c518;
          text-align: center;
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #16876a;
          outline: none;
          transition: all 0.15s ease;
        }

        .col-input-yellow:focus {
          background: #fef08a;
          border-color: #eab308;
          transform: scale(1.05);
        }

        .pizarra-instruccion-tip {
          font-size: 12px;
          font-weight: 800;
          color: #4b5563;
          margin: 10px 0 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pizarra-buttons-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-como-se-hace {
          border-radius: 12px;
          border: 2px solid #c5bfee;
          background: #ffffff;
          color: #5c21a6;
          font-weight: 900;
          font-size: 13px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-como-se-hace:hover {
          background: #f7f4ff;
          transform: translateY(-1px);
        }

        .btn-ver-bloques {
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-ver-bloques:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .msg-bubble-unidades {
          flex: 1;
          min-width: 200px;
          background: #ffffff;
          border: 2px dashed #c5bfee;
          border-radius: 12px;
          padding: 8px 12px;
          font-weight: 900;
          font-size: 12.5px;
          color: #3d1468;
          text-align: center;
        }

        /* ── Bloques base 10 ── */
        .bloques-visual-box {
          margin-top: 14px;
          padding: 14px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
        }

        .bloques-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .bloques-col {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .blq-label {
          font-weight: 900;
          font-size: 14px;
          color: #3d1468;
        }

        .blq-centenas,
        .blq-decenas,
        .blq-unidades {
          display: flex;
          gap: 3px;
          align-items: flex-end;
        }

        .blq-c100 {
          width: 32px;
          height: 32px;
          background: repeating-linear-gradient(0deg, #1a6cb4 0 3px, #4da6ff 3px 4px), #4da6ff;
          border: 1.5px solid #0a3d6e;
          border-radius: 3px;
          display: inline-block;
        }

        .blq-c10 {
          width: 6px;
          height: 32px;
          background: repeating-linear-gradient(0deg, #16876a 0 3px, #6ee7b7 3px 4px), #6ee7b7;
          border: 1px solid #074f3a;
          border-radius: 2px;
          display: inline-block;
        }

        .blq-c1 {
          width: 8px;
          height: 8px;
          background: #ff8c2a;
          border: 1px solid #7a3200;
          border-radius: 2px;
          display: inline-block;
        }

        .blq-plus {
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #e8650a;
        }

        .bloques-legend {
          font-size: 11px;
          font-weight: 800;
          color: #6b5e8a;
          text-align: center;
          margin-top: 10px;
        }

        /* ── Submit Area ── */
        .desafio-submit-area {
          margin-top: 4px;
        }

        .input-tu-respuesta {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid #f97316;
          background: #ffffff;
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 900;
          text-align: center;
          color: #1a1033;
          outline: none;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .input-tu-respuesta:focus {
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.25);
        }

        .btn-comprobar-desafio {
          width: 100%;
          margin-top: 10px;
          padding: 13px 20px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #ffffff;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
        }

        .btn-comprobar-desafio:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .pista-desafio-text {
          font-size: 12px;
          font-weight: 800;
          color: #92400e;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .feedback-alert {
          margin-top: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 900;
          text-align: center;
        }

        .feedback-alert.success {
          background: #dcfce7;
          border: 1.5px solid #86efac;
          color: #15803d;
        }

        .feedback-alert.error {
          background: #fee2e2;
          border: 1.5px solid #fca5a5;
          color: #b91c1c;
        }

        /* ── Historia Modal ── */
        .historia-cards-scroll {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 72vh;
          overflow-y: auto;
          padding-right: 4px;
        }

        .historia-card-box {
          background: #ffffff;
          border: 2px solid #e9d5ff;
          border-left: 5px solid #7c3aed;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.04);
        }

        .historia-card-heading {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #5c21a6;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .historia-card-paragraph {
          margin: 0;
          font-size: 13.5px;
          font-weight: 600;
          color: #3d1468;
          line-height: 1.55;
        }

        .historia-card-list {
          margin: 0;
          padding-left: 20px;
          list-style-type: disc;
          font-size: 13.5px;
          font-weight: 600;
          color: #3d1468;
          line-height: 1.6;
        }

        .historia-card-list li {
          margin-bottom: 6px;
        }

        .historia-card-list li:last-child {
          margin-bottom: 0;
        }

        .historia-link {
          color: #5c21a6;
          font-weight: 900;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .modal-content-wrap {
            padding: 16px 16px;
          }
          .modal-title-main {
            font-size: 20px;
          }
          .desafio-math-equation {
            font-size: 24px;
          }
          .digit-cell,
          .col-input-yellow {
            width: 38px;
            height: 38px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
