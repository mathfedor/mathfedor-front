'use client';

import React from 'react';

interface HistoriaModal4toProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoriaModal4to({ isOpen, onClose }: HistoriaModal4toProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="historia-modal-overlay animate-fadeIn"
    >
      <style>{`
        .historia-modal-overlay {
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

        .historia-modal-container {
          width: 100%;
          max-width: 620px;
          background-color: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.40);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-sizing: border-box;
        }

        .historia-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 26px 14px;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .historia-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .historia-title-wrap h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #2A0F60;
          font-family: 'Baloo 2', sans-serif;
          letter-spacing: 0.01em;
        }

        .historia-close-circle {
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
        }

        .historia-close-circle:hover {
          background-color: #E9DEFF;
          transform: scale(1.06);
        }

        .historia-scroll-content {
          overflow-y: auto;
          padding: 6px 26px 26px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-sizing: border-box;
        }

        .historia-scroll-content::-webkit-scrollbar {
          width: 6px;
        }
        .historia-scroll-content::-webkit-scrollbar-track {
          background: rgba(243, 238, 255, 0.5);
          border-radius: 8px;
        }
        .historia-scroll-content::-webkit-scrollbar-thumb {
          background: #D9CCFF;
          border-radius: 8px;
        }
        .historia-scroll-content::-webkit-scrollbar-thumb:hover {
          background: #A78BFA;
        }

        /* ══ Tarjetas con borde morado izquierdo idénticas a la imagen ══ */
        .historia-card-item {
          background-color: #FAF8FF;
          border: 1.5px solid #E9DEFF;
          border-left: 5px solid #7C3AED;
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 0 4px 14px rgba(92, 33, 166, 0.04);
          box-sizing: border-box;
        }

        .historia-card-item h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 900;
          color: #5C21A6;
          font-family: 'Baloo 2', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.25;
        }

        .historia-card-item p {
          margin: 0;
          font-size: 14.5px;
          font-weight: 600;
          color: #334155;
          line-height: 1.65;
          font-family: 'Nunito', sans-serif;
        }

        .historia-card-item ul {
          margin: 0;
          padding-left: 20px;
          list-style-type: disc !important;
          box-sizing: border-box;
        }

        .historia-card-item li {
          margin-bottom: 13px !important;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          line-height: 1.6;
          font-family: 'Nunito', sans-serif;
        }

        .historia-card-item li:last-child {
          margin-bottom: 0 !important;
        }

        .historia-card-item b {
          font-weight: 900;
          color: #1E293B;
        }
      `}</style>

      <div className="historia-modal-container">
        {/* Encabezado Modal (Idéntico a la imagen de referencia) */}
        <div className="historia-header-row">
          <div className="historia-title-wrap">
            <span style={{ fontSize: '24px', lineHeight: 1 }}>📜</span>
            <h2>Historia del Método Fedor</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="historia-close-circle"
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll y tarjetas con márgenes generosos */}
        <div className="historia-scroll-content">
          {/* Tarjeta 1: Fernando Bastidas Parra */}
          <div className="historia-card-item">
            <h3>
              <span>🧠</span> Fernando Bastidas Parra
            </h3>
            <p>
              Educador, investigador y creador de contenidos educativos con impacto
              territorial. Especialista en matemáticas, sistemas y pedagogía digital. Líder del
              método Fedor, con resultados destacados en pruebas Saber y transformación de
              prácticas docentes.
            </p>
          </div>

          {/* Tarjeta 2: Logros Profesionales Destacados */}
          <div className="historia-card-item">
            <h3>
              <span>🎯</span> Logros Profesionales Destacados
            </h3>
            <ul>
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

          {/* Tarjeta 3: Producción Intelectual y Recursos Educativos */}
          <div className="historia-card-item">
            <h3>
              <span>📚</span> Producción Intelectual y Recursos Educativos
            </h3>
            <ul>
              <li>
                <a
                  href="https://www.matematicasdefedor.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5C21A6', fontWeight: 900, textDecoration: 'underline' }}
                >
                  https://www.matematicasdefedor.com/
                </a>
              </li>
              <li>
                Libros digitales registrados para Educación Secundaria (grados 6° a 11°) en 2025 y 2026.
              </li>
              <li>
                Libros digitales registrados para Educación Básica Primaria (grados 1° a 5°) en 2018 y 2020.
              </li>
              <li>
                Artículo académico: “Desarrollo de videojuegos educativos 3D” (Revista ISSN 1390-938x, N°17, 2019).
              </li>
              <li>
                Plataforma educativa: Matemáticas de Fedor, con presencia en medios digitales y YouTube.
              </li>
            </ul>
          </div>

          {/* Tarjeta 4: Formación Académica */}
          <div className="historia-card-item">
            <h3>
              <span>🎓</span> Formación Académica
            </h3>
            <ul>
              <li>
                Maestría en Investigación Integrativa – Multiversidad Mundo Real Edgar Morín (2015–2019).
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
                Bachillerato – Colegio Rafael Pombo (1977).
              </li>
            </ul>
          </div>

          {/* Tarjeta 5: Actualización Profesional */}
          <div className="historia-card-item">
            <h3>
              <span>🔄</span> Actualización Profesional
            </h3>
            <ul>
              <li>
                Formación en pedagogía mediada por TIC (2014–2016).
              </li>
              <li>
                Actualización disciplinar en áreas básicas – Universidad Autónoma (2019).
              </li>
              <li>
                Formación de formadores en ambientes de aprendizaje mediados por tecnología.
              </li>
            </ul>
          </div>

          {/* Tarjeta 6: Experiencia Docente */}
          <div className="historia-card-item">
            <h3>
              <span>🏫</span> Experiencia Docente Universitaria y Básica
            </h3>
            <p style={{ marginBottom: '10px' }}>
              <b>Instituciones:</b> Universidad del Valle, Universidad San Buenaventura, CUAO, CECEP, Universidad Inca, Universidad Antonio Nariño, Multiversidad Mundo Real.
            </p>
            <ul>
              <li>
                <b>INEM Jorge Isaacs (2008–2026):</b> Profesor de matemáticas en bachillerato.
              </li>
              <li>
                <b>Juan Pablo II (2003–2008):</b> Docente de sistemas, física y matemáticas en bachillerato y primaria.
              </li>
              <li>
                <b>Otros colegios:</b> Cañaverales Bilingual School, León de Greiff, Colombo Británico, Lauretta Bender, Alférez Real, Martin Luther King, San Vicente Ferrer.
              </li>
            </ul>
          </div>

          {/* Tarjeta 7: Reconocimientos Especiales */}
          <div className="historia-card-item">
            <h3>
              <span>🏆</span> Reconocimientos y Proyectos Especiales
            </h3>
            <ul>
              <li>
                Expositor en el I Foro Departamental de Producción Intelectual – Gobernación del Valle.
              </li>
              <li>
                Instructor en cursos de razonamiento abstracto para docentes – Universidad del Valle, ICFES, Centro Piloto de Cali.
              </li>
              <li>
                Primer puesto en evaluación docente en matemáticas – Universidad del Valle (1995).
              </li>
              <li>
                Placa de honor por excelencia educativa – CECEP (1999).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
