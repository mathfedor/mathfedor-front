'use client';

import React, { useEffect } from 'react';

interface HistoriaModal5toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoriaModal5to({ isOpen, onClose }: HistoriaModal5toProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="tool-modal-bg animate-fadeIn"
    >
      <style>{`
        .tool-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 99999;
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
          background: #ffffff;
          border-radius: 18px;
          max-width: 580px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 18px 20px 22px;
          position: relative;
          box-shadow: 0 24px 70px rgba(20, 8, 50, 0.5);
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          box-sizing: border-box;
          animation: popIn 0.18s ease-out;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .tool-modal::-webkit-scrollbar {
          width: 6px;
        }
        .tool-modal::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .tool-modal::-webkit-scrollbar-thumb {
          background: #C5BFEE;
          border-radius: 8px;
        }
        .tool-modal::-webkit-scrollbar-thumb:hover {
          background: #8B3EDB;
        }

        .tm-close {
          position: absolute;
          right: 14px;
          top: 14px;
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
          transition: all 0.15s ease;
          z-index: 2;
        }

        .tm-close:hover {
          background: #6C28B4;
          color: #ffffff;
          transform: scale(1.05);
        }

        .tm-title {
          font-family: 'Baloo 2', 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #2A0F60;
          margin: 0 40px 14px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }

        .tm-body {
          font-size: 14px;
          line-height: 1.6;
          color: #180D38;
        }

        .historia-featured-box {
          background: #FFFFFF;
          border: 2px solid #C5BFEE;
          border-left: 6px solid #5C21A6;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .historia-featured-box h3 {
          color: #5C21A6;
          margin: 0 0 8px 0;
          font-family: 'Baloo 2', sans-serif;
          font-size: 17px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.25;
        }

        .historia-featured-box p {
          margin: 0 0 10px 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: #180D38;
          font-weight: 600;
        }

        .historia-featured-box .section-label {
          font-weight: 900;
          color: #E8650A;
          margin: 14px 0 6px 0;
          font-size: 14.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .historia-featured-box ul {
          margin: 0 0 12px 0;
          padding-left: 20px;
          list-style-type: disc !important;
          box-sizing: border-box;
        }

        .historia-featured-box li {
          font-size: 13.5px;
          line-height: 1.55;
          color: #180D38;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .historia-featured-box li:last-child {
          margin-bottom: 0;
        }

        .historia-featured-box b {
          font-weight: 900;
          color: #180D38;
        }

        .historia-mod {
          background: #F8F5FF;
          border-left: 4px solid #6C28B4;
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }

        .historia-mod h3 {
          margin: 0 0 6px 0;
          font-family: 'Baloo 2', sans-serif;
          font-size: 16px;
          font-weight: 900;
          color: #5C21A6;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .historia-mod p {
          margin: 0 0 6px 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: #180D38;
          font-weight: 600;
        }

        .historia-mod ul {
          margin: 0;
          padding-left: 22px;
          list-style-type: disc !important;
        }

        .historia-mod li {
          font-size: 13.5px;
          line-height: 1.5;
          color: #180D38;
          font-weight: 600;
          margin-bottom: 4px;
        }
      `}</style>

      <div className="tool-modal">
        {/* Botón cerrar idéntico */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="tm-close"
        >
          ✕
        </button>

        {/* Título idéntico a la imagen */}
        <div className="tm-title">
          <span>📜</span>
          <span>Historia del Método Fedor</span>
        </div>

        {/* Contenido idéntico a la imagen de referencia */}
        <div className="tm-body">
          <div className="f5hist">
            {/* Tarjeta principal con borde morado izquierdo */}
            <div className="historia-featured-box">
              <h3>
                <span>🧠</span>
                <span>Fernando Bastidas Parra · creador del Método Fedor</span>
              </h3>
              <p>
                Educador, investigador y creador de contenidos educativos con impacto territorial. Especialista en matemáticas, sistemas y pedagogía digital. Líder del <b>Método Fedor</b>, con resultados destacados en las Pruebas Saber y en la transformación de las prácticas docentes.
              </p>

              <div className="section-label">
                <span>🎯</span>
                <span>Logros destacados</span>
              </div>
              <ul>
                <li>
                  <b>2024:</b> el grupo de la I.E. INEM Jorge Isaacs que aplicó el Método Fedor obtuvo el promedio más alto del sector oficial en Cali (330,9), superando al primer colegio oficial (317).
                </li>
                <li>
                  <b>2022–2023:</b> mejoramiento sostenido de los promedios de Pruebas Saber en grupos de 11° del INEM Jorge Isaacs con el Método Fedor.
                </li>
                <li>
                  <b>2017–2023:</b> acompañamiento pedagógico con el software Matemáticas de Fedor en dos colegios oficiales con docentes de primaria.
                </li>
                <li>
                  <b>2015:</b> acompañamiento pedagógico a docentes de primaria en matemáticas, con prueba diagnóstica y ajuste del programa en grado 11°: cumplimiento del ISCE y reconocimiento oficial del Ministerio de Educación Nacional, con incentivo salarial colectivo.
                </li>
                <li>
                  <b>2013:</b> tutor de docentes del Ministerio de Educación Nacional y proyecto seleccionado por el SENA: “Videojuego para aprender matemáticas por competencias”.
                </li>
                <li>
                  <b>2012:</b> asesor de matemáticas en colegio privado.
                </li>
                <li>
                  <b>2020:</b> nominado al Premio Compartir al Maestro (suspendido por la pandemia). <b>2007 y 2005:</b> Mención de Honor del Premio Compartir al Maestro.
                </li>
                <li>
                  <b>2008:</b> Mención de Honor al Mérito Investigativo de la Secretaría de Educación de Cali.
                </li>
                <li>
                  Investigador y ponente desde 2004 en eventos nacionales e internacionales: Redipe, Universidad Santiago de Cali, Universidad San Buenaventura, Universidad Pedagógica y Tecnológica de Colombia y el Foro Educativo Nacional del MEN.
                </li>
              </ul>

              <div className="section-label">
                <span>📚</span>
                <span>Producción intelectual</span>
              </div>
              <ul>
                <li>
                  Libros digitales registrados para Básica Primaria (1° a 5°) en 2018 y 2020, y para Secundaria (6° a 11°) en 2025 y 2026.
                </li>
                <li>
                  Artículo “Desarrollo de videojuegos educativos 3D” (Revista ISSN 1390-938x, N° 17, 2019).
                </li>
                <li>
                  Plataforma educativa Matemáticas de Fedor (matematicasdefedor.com), con presencia en medios digitales y YouTube.
                </li>
              </ul>

              <div className="section-label">
                <span>🎓</span>
                <span>Formación</span>
              </div>
              <ul>
                <li>
                  Maestría en Investigación Integrativa – Multiversidad Mundo Real Edgar Morin (2015–2019).
                </li>
                <li>
                  Especialización en Sistemas – Universidad del Valle (1999).
                </li>
                <li>
                  Licenciatura en Matemáticas – Universidad Santiago de Cali (1992).
                </li>
                <li>
                  Estudios de Magíster en Educación con énfasis en Matemáticas – Universidad del Valle (1995, pendiente).
                </li>
                <li>
                  Actualización en pedagogía mediada por TIC (2014–2016) y actualización disciplinar – Universidad Autónoma (2019).
                </li>
              </ul>

              <div className="section-label">
                <span>🏫</span>
                <span>Experiencia docente</span>
              </div>
              <p>
                Docente universitario en la Universidad del Valle, Universidad San Buenaventura, CUAO, CECEP, Universidad Inca, Universidad Antonio Nariño y Multiversidad Mundo Real (Matemáticas, Cálculo, Álgebra Lineal, Estadística, Investigación de Operaciones, Inteligencia Artificial, entre otras). Profesor de matemáticas del INEM Jorge Isaacs (2008–2026) y del Juan Pablo II (2003–2008), además de otros colegios de Cali.
              </p>

              <div className="section-label">
                <span>🏆</span>
                <span>Reconocimientos</span>
              </div>
              <ul>
                <li>
                  Expositor en el I Foro Departamental de Producción Intelectual – Gobernación del Valle.
                </li>
                <li>
                  Instructor en cursos de razonamiento abstracto para docentes – Universidad del Valle, ICFES, Centro Piloto de Cali.
                </li>
                <li>
                  Primer puesto en evaluación docente en matemáticas – Universidad del Valle (1995) y placa de honor por excelencia educativa – CECEP (1999).
                </li>
              </ul>
            </div>

            {/* Módulos pedagógicos complementarios del Método Fedor */}
            <div className="historia-mod">
              <h3>
                <span>📖</span>
                <span>Origen del Método Fedor</span>
              </h3>
              <p>
                El <b>Método Fedor</b> nació de la observación pedagógica de que los niños aprenden matemáticas mucho mejor cuando el contenido se presenta en 4 pasos claros: <b>VERTICAL</b> (visualización), <b>Instrucción</b>, <b>Procedimiento</b> y <b>Resultado</b>.
              </p>
            </div>

            <div className="historia-mod">
              <h3>
                <span>🚀</span>
                <span>Grados</span>
              </h3>
              <p>
                <b>3° grado:</b> Fundamentos - adición, sustracción, multiplicación (tablas 2-9), división exacta.
              </p>
              <p>
                <b>5° grado (este libro):</b> Ampliación a millones, MCD/MCM, fracciones completas, potencias, sistema métrico decimal, geometría y probabilidad.
              </p>
            </div>

            <div className="historia-mod">
              <h3>
                <span>🎯</span>
                <span>Los 5 niveles</span>
              </h3>
              <ul>
                <li><b>N1 Cadete</b> — Reconoce conceptos básicos</li>
                <li><b>N2 Piloto</b> — Aplica procedimientos</li>
                <li><b>N3 Capitán</b> — Resuelve contextos variados</li>
                <li><b>N4 Comandante</b> — Analiza y compara</li>
                <li><b>N5 SABER</b> — Prueba nacional</li>
              </ul>
            </div>

            <div className="historia-mod">
              <h3>
                <span>💫</span>
                <span>Gamificación</span>
              </h3>
              <p>
                El sistema de XP recompensa cada ejercicio (N1=65, N2=110, N3=145, N4=170, N5=200). Los 5 rangos van desde <b>🌱 Aprendiz Cósmico</b> hasta <b>🏆 Gran Maestro</b>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
