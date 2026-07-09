'use client';

import { useState, useEffect } from 'react';
import { useBook } from '../context/BookContext';
import problemasData from '@/mocks/data/problemas-cotidianos.json';

interface ProblemExercise {
  q: string;
  opts: string[];
  ans: string;
  op: 'Suma' | 'Resta' | 'Multiplicación' | 'División';
  mascot: string;
  hint: string;
  pts: number;
}

const EXERCISES: ProblemExercise[] = [
  { q: "Compras un cuaderno de $1.500 y un lápiz de $500. ¿Cuánto pagas en total?", opts: ["$1.800", "$2.000", "$1.500", "$2.500"], ans: "$2.000", op: "Suma", mascot: "🐼", hint: "Suma los dos precios: $1.500 + $500.", pts: 80 },
  { q: "Tienes 4 monedas de $200 y 3 monedas de $100. ¿Cuánto dinero tienes?", opts: ["$1.100", "$700", "$1.000", "$900"], ans: "$1.100", op: "Suma", mascot: "🦁", hint: "Multiplica primero: 4×200 + 3×100 luego suma.", pts: 80 },
  { q: "Una pizza cuesta $8.000 y un refresco $2.000. ¿Cuánto cuesta todo junto?", opts: ["$9.000", "$10.000", "$11.000", "$12.000"], ans: "$10.000", op: "Suma", mascot: "🦊", hint: "Pizza + refresco: $8.000 + $2.000.", pts: 80 },
  { q: "Tus padres te dan $3.000 y tu tía $5.000. ¿Cuánto dinero recibiste?", opts: ["$7.000", "$8.000", "$6.000", "$9.000"], ans: "$8.000", op: "Suma", mascot: "🐨", hint: "Recibiste regalos: súmalos juntos.", pts: 80 },
  { q: "En la tienda compras un jugo $700, galletas $1.500 y un helado $1.800. ¿Cuánto gastaste?", opts: ["$3.500", "$4.000", "$4.500", "$3.800"], ans: "$4.000", op: "Suma", mascot: "🐸", hint: "Suma los tres precios.", pts: 80 },
  { q: "Pagas $2.000 por un dulce que cuesta $1.300. ¿Cuánto te devuelven de vuelto?", opts: ["$300", "$500", "$700", "$900"], ans: "$700", op: "Resta", mascot: "🦄", hint: "Resta lo que pagaste menos lo que costó.", pts: 95 },
  { q: "Tenías $5.000 y gastaste $2.400 en la merienda. ¿Cuánto te queda?", opts: ["$2.600", "$2.400", "$3.000", "$2.800"], ans: "$2.600", op: "Resta", mascot: "🐯", hint: "Resta lo que tenías menos lo que gastaste.", pts: 95 },
  { q: "Un libro cuesta $9.500 y solo tienes $7.000. ¿Cuánto te falta?", opts: ["$2.000", "$2.500", "$3.000", "$1.500"], ans: "$2.500", op: "Resta", mascot: "🐰", hint: "Diferencia entre precio y dinero que tienes.", pts: 95 },
  { q: "Tu mamá te dio $10.000 y compraste útiles por $6.300. ¿Cuánto sobra?", opts: ["$3.700", "$4.000", "$3.500", "$4.300"], ans: "$3.700", op: "Resta", mascot: "🐙", hint: "Resta lo gastado al dinero total.", pts: 95 },
  { q: "Una camiseta cuesta $15.000 con descuento queda en $11.500. ¿Cuánto descontaron?", opts: ["$2.500", "$3.000", "$3.500", "$4.000"], ans: "$3.500", op: "Resta", mascot: "🐱", hint: "Diferencia entre precio original y precio rebajado.", pts: 95 },
  { q: "Cada banano cuesta $300. Si compras 5 bananos, ¿cuánto pagas?", opts: ["$1.500", "$1.800", "$1.200", "$2.000"], ans: "$1.500", op: "Multiplicación", mascot: "🐒", hint: "Multiplica el precio por la cantidad.", pts: 110 },
  { q: "Una bolsa de papas cuesta $2.500. Si compras 3 bolsas, ¿cuánto pagas?", opts: ["$6.500", "$7.500", "$5.000", "$8.000"], ans: "$7.500", op: "Multiplicación", mascot: "🐦", hint: "Multiplica precio × cantidad.", pts: 110 },
  { q: "Cada pasaje de bus cuesta $900. ¿Cuánto pagan 4 personas?", opts: ["$3.600", "$2.700", "$4.500", "$3.000"], ans: "$3.600", op: "Multiplicación", mascot: "🐻", hint: "Precio del pasaje × número de personas.", pts: 110 },
  { q: "Una caja de chocolates trae 6 dulces. Si compras 4 cajas, ¿cuántos dulces tienes?", opts: ["10", "24", "12", "20"], ans: "24", op: "Multiplicación", mascot: "🐹", hint: "Multiplica chocolates por cajas.", pts: 110 },
  { q: "Cada lápiz cuesta $400. Compras 7 lápices para el colegio. ¿Cuánto pagas?", opts: ["$2.400", "$3.200", "$2.800", "$3.500"], ans: "$2.800", op: "Multiplicación", mascot: " owls", hint: "Multiplica precio × cantidad de lápices.", pts: 110 },
  { q: "Tienes $1.200 y los repartes en partes iguales entre 4 amigos. ¿Cuánto recibe cada uno?", opts: ["$300", "$400", "$200", "$500"], ans: "$300", op: "División", mascot: "🐿️", hint: "Divide el total entre los amigos.", pts: 125 },
  { q: "Una pizza de $8.000 se paga entre 4 amigos por igual. ¿Cuánto pone cada uno?", opts: ["$1.500", "$2.000", "$2.500", "$1.000"], ans: "$2.000", op: "División", mascot: "🦒", hint: "Divide el precio entre el número de personas.", pts: 125 },
  { q: "Tu mamá te dio $5.000 para repartir entre 5 hermanos. ¿Cuánto le toca a cada uno?", opts: ["$500", "$1.000", "$2.000", "$1.500"], ans: "$1.000", op: "División", mascot: "🦕", hint: "Divide entre los hermanos.", pts: 125 },
  { q: "15 caramelos se reparten en 3 bolsas iguales. ¿Cuántos caramelos van en cada bolsa?", opts: ["3", "5", "4", "6"], ans: "5", op: "División", mascot: "🐝", hint: "Divide caramelos entre bolsas.", pts: 125 },
  { q: "Vendieron 20 cupcakes y juntaron $10.000. ¿Cuánto costó cada cupcake?", opts: ["$300", "$500", "$700", "$400"], ans: "$500", op: "División", mascot: "🦋", hint: "Divide total ganado entre cantidad vendida.", pts: 125 }
];

export default function ProblemasScreen() {
  const { progress, goScreen, book, cameFromLesson } = useBook();
  const [step, setStep] = useState<'intro' | 'playing' | 'final'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const backScreen = cameFromLesson ? 'lesson' : (progress ? 'home' : 'setup');

  useEffect(() => {
    if (step !== 'playing' || isAnswered) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step, isAnswered]);

  const startPractice = () => {
    setStep('playing');
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(30);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleAnswer = (option: string | null) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentEx = EXERCISES[currentIndex];
    const isCorrect = option === currentEx.ans;

    if (isCorrect) {
      setScore((prev) => prev + currentEx.pts);
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < EXERCISES.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setStep('final');
    }
  };

  const currentEx = EXERCISES[currentIndex];
  const progressPct = Math.round((currentIndex / EXERCISES.length) * 100);

  const opColors: Record<string, string> = {
    Suma: '#16876A',
    Resta: '#C94B22',
    Multiplicación: '#7B2FBE',
    División: '#1A6CB4',
  };

  const opEmojis: Record<string, string> = {
    Suma: '➕',
    Resta: '➖',
    Multiplicación: '✖️',
    División: '➗',
  };



  return (
    <div className="screen active" id="screen-problemas-cotidianos">
      {book?.slug === 'libro-1ro' && step === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1rem' }}>
          <div
            className="feat-btn"
            onClick={() => goScreen('estandares')}
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0 }}
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
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0, cursor: 'default' }}
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

      {step === 'intro' && (
        <div style={{ padding: '0 0.5rem' }}>
          <div className="hero-banner" style={{ background: 'linear-gradient(135deg,#0E5240,#16876A,#34D399)', padding: '1.5rem 1rem', marginBottom: '1.5rem' }}>
            <div className="hero-title" style={{ color: '#fff', fontSize: '24px' }}>🛒 Problemas Cotidianos</div>
            <div className="hero-tag" style={{ color: '#FFE066', fontSize: '13px', fontWeight: 800, marginTop: '.3rem' }}>
              Conteo y compras con billetes, monedas y productos
            </div>
          </div>
          <div className="pcp-intro">
            <h3>📝 Practica 20 ejercicios interactivos</h3>
            <p>Selección múltiple · 4 opciones · puntuación · tiempo · sonidos y efectos</p>
            <button className="pcp-go-btn" onClick={startPractice}>
              🚀 ¡Empezar!
            </button>
          </div>

          {/* Sección de Niveles Pedagógicos */}
          <div style={{ marginTop: '2rem' }}>
            {problemasData.map((lvl) => (
              <div key={lvl.level} className="pcg-level">
                <div className="pcg-level-h">{lvl.header}</div>
                
                {lvl.guide && (
                  <div className="pcg-guide">
                    <div className="pcg-guide-h">{lvl.guide.title}</div>
                    {lvl.guide.sections.map((sec, idx) => (
                      <div key={idx} className="pcg-sec">
                        <div className="pcg-label">{sec.label}</div>
                        <div
                          className={
                            sec.label.includes('Enunciado') ? 'pcg-enun' :
                            sec.label.includes('Operación') ? 'pcg-op' :
                            sec.label.includes('Representación') ? 'pcg-viz' :
                            sec.label.includes('Respuesta') ? 'pcg-ans' : ''
                          }
                          dangerouslySetInnerHTML={{ __html: sec.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {lvl.cards && lvl.cards.map((card, cIdx) => (
                  <div key={cIdx} className="pcg-card">
                    <div className="pcg-num">{card.title}</div>
                    {card.sections.map((sec, idx) => (
                      <div key={idx} className="pcg-sec">
                        <div className="pcg-label">{sec.label}</div>
                        <div
                          className={
                            sec.label.includes('Enunciado') ? 'pcg-enun' :
                            sec.label.includes('Operación') ? 'pcg-op' :
                            sec.label.includes('Representación') ? 'pcg-viz' :
                            sec.label.includes('Respuesta') ? 'pcg-ans' : ''
                          }
                          dangerouslySetInnerHTML={{ __html: sec.content }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'playing' && (
        <div style={{ padding: '0 0.5rem' }}>
          <div className="pcp-modal">
            <div className="pcp-header">
              <span className="pcp-badge">Pregunta {currentIndex + 1} de {EXERCISES.length}</span>
              <span className="pcp-timer" style={{ background: timeLeft <= 5 ? '#FEE2E8' : '#E8F5FF', color: timeLeft <= 5 ? '#A30041' : '#1A6CB4' }}>
                ⏱️ {timeLeft}s
              </span>
              <span className="pcp-score">⭐ {score} pts</span>
            </div>

            <div className="pcp-progress">
              <div className="pcp-progress-bar" style={{ width: `${progressPct}%` }} />
            </div>

            <div
              className="pcp-op-badge"
              style={{ background: opColors[currentEx.op] }}
            >
              {opEmojis[currentEx.op]} {currentEx.op}
            </div>

            <div className="pcp-q">
              {currentEx.q}
            </div>

            <div className="pcp-opts">
              {currentEx.opts.map((opt) => {
                let btnCls = '';
                if (isAnswered) {
                  if (opt === currentEx.ans) {
                    btnCls = 'ok';
                  } else if (opt === selectedOption) {
                    btnCls = 'bad';
                  }
                }
                return (
                  <button
                    key={opt}
                    className={`pcp-opt ${btnCls}`}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div>
                <div className={`pcp-result ${selectedOption === currentEx.ans ? 'ok' : 'bad'}`}>
                  {selectedOption === currentEx.ans ? (
                    <span>🎉 ¡Correcto! +{currentEx.pts} pts</span>
                  ) : (
                    <span>
                      😢 Incorrecto. Respuesta correcta: <strong>{currentEx.ans}</strong>
                      <br />
                      <small style={{ display: 'block', marginTop: '4px', fontWeight: 600 }}>
                        💡 Pista: {currentEx.hint}
                      </small>
                    </span>
                  )}
                </div>

                <button className="pcp-next" onClick={handleNext}>
                  {currentIndex + 1 < EXERCISES.length ? 'Siguiente Pregunta →' : 'Ver Resultados 🏆'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'final' && (() => {
        const total = EXERCISES.length;
        const pct = Math.round((correctCount / total) * 100);
        let medal = '📚';
        let title = '¡SIGUE PRACTICANDO!';
        if (pct >= 95) {
          medal = '🥇';
          title = '¡PERFECTO!';
        } else if (pct >= 85) {
          medal = '🏅';
          title = '¡EXCELENTE!';
        } else if (pct >= 70) {
          medal = '⭐';
          title = '¡MUY BIEN!';
        } else if (pct >= 50) {
          medal = '💪';
          title = '¡APROBADO!';
        }

        return (
          <div style={{ padding: '0 0.5rem' }}>
            <div className="pcp-modal">
              <div className="pcp-final">
                <div className="medal">{medal}</div>
                <div className="title">{title}</div>
                <div className="sub">Completaste {total} problemas cotidianos</div>

                <div className="scorebig">
                  {score} <span style={{ fontSize: '18px', color: '#7A7299' }}>pts</span>
                </div>

                <div className="breakdown">
                  <div className="stat">✅ Correctas: {correctCount}</div>
                  <div className="stat">❌ Incorrectas: {wrongCount}</div>
                  <div className="stat">📊 Acierto: {pct}%</div>
                </div>

                <button className="pcp-next" onClick={startPractice}>
                  🔄 Volver a intentar
                </button>
                <button
                  className="pcp-next"
                  style={{ background: '#16876A', marginTop: '8px' }}
                  onClick={() => setStep('intro')}
                >
                  ✓ Terminar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
