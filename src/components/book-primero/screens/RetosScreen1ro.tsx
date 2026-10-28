'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';
import TopFeaturesSection1ro from '../shared/TopFeaturesSection1ro';

interface RetoCardData {
  id: number;
  q: string;
  ans: string;
  expl: string;
}

const RETO_CARDS: RetoCardData[] = [
  { id: 1, q: '¿Cuántos números pares hay entre 1 y 10?', ans: '5', expl: 'Pares: 2, 4, 6, 8, 10 → 5 números pares.' },
  { id: 2, q: 'Si tengo 7 manzanas y como 3, ¿cuántas me quedan?', ans: '4', expl: '7 − 3 = 4.' },
  { id: 3, q: '¿Cuánto es 5 + 6?', ans: '11', expl: '5 + 6 = 11.' },
  { id: 4, q: '¿Cuál es el número después del 19?', ans: '20', expl: 'El siguiente al 19 es 20.' },
  { id: 5, q: 'Si tengo 3 cajas con 4 dulces cada una, ¿cuántos dulces tengo?', ans: '12', expl: '3 × 4 = 12.' },
  { id: 6, q: '¿Cuántas decenas hay en el número 40?', ans: '4', expl: '40 = 4 decenas.' },
  { id: 7, q: '¿Cuánto es 8 + 7?', ans: '15', expl: '8 + 7 = 15. Se llevan 1.' },
  { id: 8, q: 'Reparte 12 chocolates entre 3 niños. ¿Cuántos le tocan a cada uno?', ans: '4', expl: '12 ÷ 3 = 4.' },
  { id: 9, q: 'El doble de 6 es:', ans: '12', expl: 'Doble = ×2. 6 × 2 = 12.' },
  { id: 10, q: '¿Cuántas patas tienen 3 vacas?', ans: '12', expl: 'Cada vaca tiene 4 patas. 3 × 4 = 12.' },
  { id: 11, q: 'Un cuadrado tiene lado 5. ¿Cuál es su perímetro?', ans: '20', expl: 'P = 4 × 5 = 20.' },
  { id: 12, q: 'Mitad de 20:', ans: '10', expl: '20 ÷ 2 = 10.' },
  { id: 13, q: '¿Cuántos lados tiene un hexágono?', ans: '6', expl: 'Hex = 6 lados.' },
  { id: 14, q: 'Si compras 5 lápices a $10 cada uno, ¿cuánto pagas?', ans: '50', expl: '5 × $10 = $50.' },
  { id: 15, q: '¿Cuánto es 100 − 35?', ans: '65', expl: '100 − 35 = 65.' },
  { id: 16, q: '¿Qué número está entre 9 y 11?', ans: '10', expl: '9, 10, 11 → 10.' },
  { id: 17, q: 'Continúa: 5, 10, 15, ?, 25', ans: '20', expl: 'Suman 5. 15+5=20.' },
  { id: 18, q: '¿Cuánto es 9 + 9?', ans: '18', expl: '9 + 9 = 18.' },
  { id: 19, q: 'Un triángulo equilátero tiene lado 4. ¿Perímetro?', ans: '12', expl: 'P = 3 × 4 = 12.' },
  { id: 20, q: 'Cuenta de 2 en 2 hasta 10: ¿cuántos números cuentas?', ans: '5', expl: '2, 4, 6, 8, 10 → 5.' },
];

interface RetoPracticeExercise {
  q: string;
  opts: string[];
  ans: string;
  cat: string;
  mascot: string;
  hint: string;
  pts: number;
}

const RETOS_PRACTICE_EXERCISES: RetoPracticeExercise[] = [
  { q: '¿Cuántos números pares hay entre 1 y 10?', opts: ['3', '4', '5', '6'], ans: '5', cat: 'Pares', mascot: '🔢', hint: 'Pares: 2, 4, 6, 8, 10.', pts: 80 },
  { q: '¿Cuántos números impares hay entre 1 y 10?', opts: ['3', '4', '5', '6'], ans: '5', cat: 'Impares', mascot: '🎲', hint: 'Impares: 1, 3, 5, 7, 9.', pts: 80 },
  { q: '¿Cuánto es 5 + 6?', opts: ['10', '11', '12', '9'], ans: '11', cat: 'Suma', mascot: '➕', hint: '5 más 5 = 10, luego +1.', pts: 80 },
  { q: '¿Cuál es el número antes del 20?', opts: ['18', '19', '21', '22'], ans: '19', cat: 'Antes', mascot: '⬅️', hint: 'Resta 1 a 20.', pts: 80 },
  { q: '¿Cuál es el número después del 19?', opts: ['20', '18', '21', '22'], ans: '20', cat: 'Después', mascot: '➡️', hint: 'Suma 1 a 19.', pts: 80 },
  { q: 'Si tengo 7 manzanas y como 3, ¿cuántas me quedan?', opts: ['3', '4', '5', '10'], ans: '4', cat: 'Resta', mascot: '🍎', hint: '7 - 3.', pts: 90 },
  { q: 'Si tengo 3 cajas con 4 dulces cada una, ¿cuántos dulces tengo?', opts: ['7', '10', '12', '16'], ans: '12', cat: 'Multiplicación', mascot: '🍬', hint: '3 × 4.', pts: 90 },
  { q: 'Reparto 12 galletas entre 4 niños por igual. ¿Cuántas recibe cada uno?', opts: ['2', '3', '4', '6'], ans: '3', cat: 'División', mascot: '🍪', hint: '12 ÷ 4.', pts: 90 },
  { q: '¿Cuánto es 8 + 7?', opts: ['13', '14', '15', '16'], ans: '15', cat: 'Suma', mascot: '➕', hint: '8 + 2 = 10, luego +5.', pts: 90 },
  { q: '¿Cuánto es 10 - 4?', opts: ['5', '6', '7', '4'], ans: '6', cat: 'Resta', mascot: '➖', hint: '10 - 4 = 6.', pts: 90 },
  { q: '¿Cuántas decenas hay en el número 40?', opts: ['2', '3', '4', '5'], ans: '4', cat: 'Decenas', mascot: '🔟', hint: '40 = 4 decenas.', pts: 100 },
  { q: '¿Cuántas decenas hay en 70?', opts: ['5', '6', '7', '8'], ans: '7', cat: 'Decenas', mascot: '🔟', hint: '70 = 7 decenas.', pts: 100 },
  { q: '¿Cuántas unidades tiene una centena?', opts: ['10', '100', '1000', '50'], ans: '100', cat: 'Centena', mascot: '💯', hint: '1 centena = 100 unidades.', pts: 100 },
  { q: '¿Cuál es el número MAYOR? 23 ó 32', opts: ['23', '32', 'Iguales', 'No sé'], ans: '32', cat: 'Mayor', mascot: '📈', hint: 'Compara las decenas.', pts: 100 },
  { q: '¿Cuál es el número MENOR? 45 ó 54', opts: ['45', '54', 'Iguales', 'No sé'], ans: '45', cat: 'Menor', mascot: '📉', hint: 'Compara las decenas.', pts: 100 },
  { q: '¿Cuántos lados tiene un triángulo?', opts: ['2', '3', '4', '5'], ans: '3', cat: 'Geometría', mascot: '🔺', hint: 'Tri = 3.', pts: 110 },
  { q: '¿Cuántos lados tiene un cuadrado?', opts: ['3', '4', '5', '6'], ans: '4', cat: 'Geometría', mascot: '🟩', hint: 'Cuatro lados iguales.', pts: 110 },
  { q: 'Hay 6 patos en el lago. Llegan 4 más. ¿Cuántos hay ahora?', opts: ['8', '9', '10', '11'], ans: '10', cat: 'Problema', mascot: '🦆', hint: 'Suma: 6 + 4.', pts: 110 },
  { q: 'Hay 15 globos. Se pinchan 7. ¿Cuántos quedan?', opts: ['7', '8', '9', '10'], ans: '8', cat: 'Problema', mascot: '🎈', hint: 'Resta: 15 - 7.', pts: 110 },
  { q: 'Compré 4 paquetes con 5 chicles cada uno. ¿Cuántos chicles tengo?', opts: ['15', '20', '25', '9'], ans: '20', cat: 'Problema', mascot: '📦', hint: 'Multiplica: 4 × 5.', pts: 110 },
];

function CyanAudioBtn({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        fedorTTS.speak(text);
      }}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.4)',
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        marginLeft: '8px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      title="Escuchar"
    >
      🔊
    </button>
  );
}

export default function RetosScreen1ro() {
  const { goScreen, grantReward } = useBook1();

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showPractice, setShowPractice] = useState(false);

  // Estados del mini motor interactivo de retos
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [tLeft, setTLeft] = useState(30);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar práctica interactiva de los 20 retos
  const handleStartPractice = () => {
    setQIdx(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTLeft(30);
    setSelectedOpt(null);
    setAnswered(false);
    setShowHint(false);
    setFinished(false);
    setShowPractice(true);
  };

  const handleClosePractice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowPractice(false);
  };

  // Temporizador para cada pregunta
  useEffect(() => {
    if (!showPractice || answered || finished) return;

    setTLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPractice, qIdx, answered, finished]);

  // Narrar la pregunta al cambiar
  useEffect(() => {
    if (showPractice && !finished && RETOS_PRACTICE_EXERCISES[qIdx]) {
      fedorTTS.speak(RETOS_PRACTICE_EXERCISES[qIdx].q);
    }
  }, [showPractice, qIdx, finished]);

  const handleAnswer = (optIndex: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(optIndex);

    if (timerRef.current) clearInterval(timerRef.current);

    const currentEx = RETOS_PRACTICE_EXERCISES[qIdx];
    const isOk = optIndex >= 0 && currentEx.opts[optIndex] === currentEx.ans;

    if (isOk) {
      const earned = Math.max(20, (currentEx.pts || 100) - (30 - tLeft) * 2);
      setScore((s) => s + earned);
      setCorrectCount((c) => c + 1);
      fedorTTS.speak('¡Excelente! Respuesta correcta.');
    } else {
      setWrongCount((w) => w + 1);
      fedorTTS.speak(`La respuesta correcta es ${currentEx.ans}.`);
    }
  };

  const handleNextQuestion = () => {
    if (qIdx + 1 >= RETOS_PRACTICE_EXERCISES.length) {
      setFinished(true);
      grantReward(score, Math.round(score / 5));
    } else {
      setQIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setAnswered(false);
      setShowHint(false);
    }
  };

  const currentEx = RETOS_PRACTICE_EXERCISES[qIdx];

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '1.25rem 1rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      {/* Secciones superiores: Definiciones FEDOR, Estándares MEN, Problemas Cotidianos */}
      <TopFeaturesSection1ro />

      {/* Botón Volver al inicio */}
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 900,
          color: '#6C28B4',
          fontSize: '14px',
          marginBottom: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-3px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        ← Volver al inicio
      </div>

      {/* ════ HERO BANNER NARANJA (Imagen 1) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7A3200, #FF8A1F, #FFB066)',
          borderRadius: '24px',
          padding: '1.75rem 1.5rem',
          color: '#ffffff',
          marginBottom: '1.25rem',
          boxShadow: '0 10px 30px rgba(255, 138, 31, 0.25)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '32px',
              fontWeight: 900,
              margin: 0,
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>🏆</span>
            <span>Retos Matemáticos</span>
          </h1>
          <CyanAudioBtn text="Retos Matemáticos. Desafíos para primer grado." />
        </div>

        <div
          style={{
            marginTop: '0.4rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 900,
              color: '#FFE066',
              letterSpacing: '0.02em',
            }}
          >
            Desafíos para primer grado
          </span>
          <CyanAudioBtn text="Desafíos para primer grado." />
        </div>
      </div>

      {/* ════ CARD BANNER PRÁCTICA (20 Retos Interactivos) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7A3200, #FF8A1F, #FFB066)',
          borderRadius: '20px',
          padding: '1.5rem 1.25rem',
          color: '#ffffff',
          marginBottom: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(122, 50, 0, 0.18)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '22px',
            fontWeight: 900,
            margin: '0 0 6px',
            color: '#ffffff',
          }}
        >
          🎯 Practica 20 Retos Matemáticos
        </h2>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            margin: '0 0 14px',
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Selección múltiple · 4 opciones · puntuación · tiempo · sonidos y efectos
        </p>
        <button
          type="button"
          onClick={handleStartPractice}
          style={{
            background: '#ffffff',
            color: '#7A3200',
            fontWeight: 900,
            fontSize: '15px',
            border: 'none',
            borderRadius: '99px',
            padding: '11px 26px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            fontFamily: "'Nunito', sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🚀 ¡Empezar Retos!
        </button>
      </div>

      {/* ════ LISTA DE 20 TARJETAS DE RETOS CON BOTÓN "VER RESPUESTA" ════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {RETO_CARDS.map((reto) => (
          <div
            key={reto.id}
            style={{
              background: '#FFFDF9',
              borderRadius: '20px',
              border: '2px solid #FFB066',
              padding: '1.25rem 1.4rem',
              boxShadow: '0 4px 15px rgba(255, 138, 31, 0.08)',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#1A0A3C',
                  lineHeight: 1.35,
                  fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                }}
              >
                <span>🎯 Reto {reto.id}: </span>
                <span>{reto.q}</span>
              </div>
              <CyanAudioBtn text={`Reto ${reto.id}: ${reto.q}`} />
            </div>

            <button
              type="button"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [reto.id]: !prev[reto.id],
                }))
              }
              style={{
                padding: '9px 20px',
                background: 'linear-gradient(135deg, #FF8A1F, #FFB066)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(255, 138, 31, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Nunito', sans-serif",
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span>💡</span>
              <span>{expanded[reto.id] ? 'Ocultar respuesta' : 'Ver respuesta'}</span>
            </button>

            {expanded[reto.id] && (
              <div
                style={{
                  marginTop: '0.9rem',
                  padding: '0.9rem 1.15rem',
                  background: '#FFF8E0',
                  borderLeft: '5px solid #FF8A1F',
                  borderRadius: '12px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: '#7A1B00',
                  animation: 'popIn 0.25s ease',
                  lineHeight: 1.45,
                }}
              >
                <div style={{ marginBottom: '4px', fontSize: '15px' }}>
                  ✅ Respuesta: <strong>{reto.ans}</strong>
                </div>
                <div style={{ color: '#854D0E', fontSize: '13.5px' }}>
                  📖 {reto.expl}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ════ MODAL INTERACTIVO DE PRÁCTICA CON TIMER Y PUNTAJE (rtpOverlay) ════ */}
      {showPractice && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 8, 48, 0.92)',
            zIndex: 99995,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: "'Nunito', sans-serif",
            backdropFilter: 'blur(6px)',
          }}
          onClick={handleClosePractice}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.4rem 1.25rem',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={handleClosePractice}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#FEE2E8',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#A30041',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            {!finished && currentEx ? (
              <>
                {/* Cabecera del Reto */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      background: '#FAEEDA',
                      color: '#7A3200',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 900,
                    }}
                  >
                    🎯 Reto {qIdx + 1} / {RETOS_PRACTICE_EXERCISES.length}
                  </div>
                  <div
                    style={{
                      background: '#FEE2E8',
                      color: '#A30041',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 900,
                    }}
                  >
                    ⏱️ <span>{tLeft}</span>s
                  </div>
                  <div
                    style={{
                      background: '#DCF5EE',
                      color: '#074F3A',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 900,
                    }}
                  >
                    ⭐ {score} pts
                  </div>
                </div>

                {/* Barra de progreso */}
                <div
                  style={{
                    height: '8px',
                    background: '#F1EFE8',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    margin: '6px 0 14px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #7A3200, #FFB066)',
                      width: `${Math.round((qIdx / RETOS_PRACTICE_EXERCISES.length) * 100)}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>

                {/* Categoría y Mascota */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#ffffff',
                      background: '#7A3200',
                    }}
                  >
                    {currentEx.cat}
                  </div>
                  <div style={{ fontSize: '32px' }}>{currentEx.mascot}</div>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#888' }}>
                    +{currentEx.pts} pts
                  </div>
                </div>

                {/* Pregunta */}
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#1A0848',
                    lineHeight: 1.4,
                    marginBottom: '14px',
                    background: '#FFF8E0',
                    padding: '14px',
                    borderRadius: '12px',
                    borderLeft: '5px solid #FFB066',
                    fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                  }}
                >
                  {currentEx.q}
                </div>

                {/* Opciones 2x2 */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {currentEx.opts.map((opt, k) => {
                    let bg = '#ffffff';
                    let color = '#7A3200';
                    let borderColor = '#F5C518';

                    if (answered) {
                      if (opt === currentEx.ans) {
                        bg = '#16876A';
                        color = '#ffffff';
                        borderColor = '#0E5240';
                      } else if (selectedOpt === k && opt !== currentEx.ans) {
                        bg = '#C94B22';
                        color = '#ffffff';
                        borderColor = '#7A1B00';
                      }
                    }

                    return (
                      <button
                        key={k}
                        type="button"
                        disabled={answered}
                        onClick={() => handleAnswer(k)}
                        style={{
                          background: bg,
                          border: `2px solid ${borderColor}`,
                          color: color,
                          padding: '13px 14px',
                          borderRadius: '14px',
                          fontSize: '15px',
                          fontWeight: 900,
                          cursor: answered ? 'default' : 'pointer',
                          fontFamily: "'Nunito', sans-serif",
                          textAlign: 'center',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Pista si existe */}
                {currentEx.hint && (
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setShowHint((prev) => !prev)}
                      style={{
                        background: 'transparent',
                        border: '1px dashed #F5C518',
                        color: '#7A3200',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      💡 {showHint ? 'Ocultar pista' : 'Ver pista'}
                    </button>
                    {showHint && (
                      <div
                        style={{
                          background: '#FFF8E0',
                          borderLeft: '4px solid #F5C518',
                          padding: '9px 12px',
                          marginTop: '6px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          color: '#7A3200',
                        }}
                      >
                        {currentEx.hint}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback tras responder */}
                {answered && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '12px',
                      fontSize: '15px',
                      fontWeight: 900,
                      marginTop: '12px',
                      borderRadius: '12px',
                      background:
                        selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans
                          ? '#DCF5EE'
                          : '#FEE2E8',
                      color:
                        selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans
                          ? '#074F3A'
                          : '#A30041',
                      animation: 'popIn 0.25s ease',
                    }}
                  >
                    {selectedOpt !== null && currentEx.opts[selectedOpt] === currentEx.ans ? (
                      <div>
                        ✅ ¡Correcto! Ganaste{' '}
                        <strong>
                          {Math.max(20, (currentEx.pts || 100) - (30 - tLeft) * 2)}
                        </strong>{' '}
                        puntos · ⏱️ {30 - tLeft}s
                      </div>
                    ) : (
                      <div>
                        {selectedOpt === -1
                          ? '⏱️ ¡Se acabó el tiempo! '
                          : '❌ '}
                        La respuesta correcta era <strong>{currentEx.ans}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Botón Siguiente */}
                {answered && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    style={{
                      background: '#7A3200',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '12px 24px',
                      fontSize: '14.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      marginTop: '14px',
                      width: '100%',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {qIdx + 1 >= RETOS_PRACTICE_EXERCISES.length
                      ? 'Ver Resultados Finales 🏆'
                      : 'Siguiente Reto →'}
                  </button>
                )}
              </>
            ) : (
              /* Pantalla final de resultados */
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '72px', lineHeight: 1 }}>
                  {correctCount >= 18
                    ? '🥇'
                    : correctCount >= 15
                    ? '🏅'
                    : correctCount >= 12
                    ? '⭐'
                    : '💪'}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#7A3200',
                    margin: '8px 0 4px',
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                >
                  {correctCount >= 18
                    ? '¡PERFECTO!'
                    : correctCount >= 15
                    ? '¡EXCELENTE!'
                    : correctCount >= 12
                    ? '¡MUY BIEN!'
                    : '¡SIGUE PRACTICANDO!'}
                </div>
                <div style={{ fontSize: '14px', color: '#BA7517', fontWeight: 800 }}>
                  Completaste los 20 Retos Matemáticos
                </div>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    color: '#16876A',
                    margin: '12px 0 8px',
                  }}
                >
                  {score} <span style={{ fontSize: '18px', color: '#BA7517' }}>pts</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    margin: '14px 0',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      background: '#FFF8E0',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#7A3200',
                    }}
                  >
                    ✅ Correctas: {correctCount}
                  </div>
                  <div
                    style={{
                      background: '#FFF8E0',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#7A3200',
                    }}
                  >
                    ❌ Incorrectas: {wrongCount}
                  </div>
                  <div
                    style={{
                      background: '#FFF8E0',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#7A3200',
                    }}
                  >
                    📊 Acierto:{' '}
                    {Math.round((correctCount / RETOS_PRACTICE_EXERCISES.length) * 100)}%
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartPractice}
                  style={{
                    background: '#7A3200',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 24px',
                    fontSize: '14.5px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '8px',
                  }}
                >
                  🔄 Volver a intentar
                </button>
                <button
                  type="button"
                  onClick={handleClosePractice}
                  style={{
                    background: '#16876A',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 24px',
                    fontSize: '14.5px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  ✓ Terminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
