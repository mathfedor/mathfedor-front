'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';
import Retos1Game from '../games/Retos1Game';

interface RetoItem {
  id: number;
  q: string;
  ans: string;
  explanation: string;
}

const RETOS_LIST: RetoItem[] = [
  { id: 1, q: "¿Cuántos números pares hay entre 1 y 10?", ans: "5", explanation: "Pares: 2, 4, 6, 8, 10 → 5 números pares." },
  { id: 2, q: "Si tengo 7 manzanas y como 3, ¿cuántas me quedan?", ans: "4", explanation: "7 − 3 = 4." },
  { id: 3, q: "¿Cuánto es 5 + 6?", ans: "11", explanation: "5 + 6 = 11." },
  { id: 4, q: "¿Cuál es el número después del 19?", ans: "20", explanation: "El siguiente al 19 es 20." },
  { id: 5, q: "Si tengo 3 cajas con 4 dulces cada una, ¿cuántos dulces tengo?", ans: "12", explanation: "3 × 4 = 12." },
  { id: 6, q: "¿Cuántas decenas hay en el número 40?", ans: "4", explanation: "40 = 4 decenas." },
  { id: 7, q: "¿Cuánto es 8 + 7?", ans: "15", explanation: "8 + 7 = 15. Se llevan 1." },
  { id: 8, q: "Reparte 12 chocolates entre 3 niños. ¿Cuántos le tocan a cada uno?", ans: "4", explanation: "12 ÷ 3 = 4." },
  { id: 9, q: "El doble de 6 es:", ans: "12", explanation: "Doble = ×2. 6 × 2 = 12." },
  { id: 10, q: "¿Cuántas patas tienen 3 vacas?", ans: "12", explanation: "Cada vaca tiene 4 patas. 3 × 4 = 12." },
  { id: 11, q: "Un cuadrado tiene lado 5. ¿Cuál es su perímetro?", ans: "20", explanation: "P = 4 × 5 = 20." },
  { id: 12, q: "Mitad de 20:", ans: "10", explanation: "20 ÷ 2 = 10." },
  { id: 13, q: "¿Cuántos lados tiene un hexágono?", ans: "6", explanation: "Hex = 6 lados." },
  { id: 14, q: "Si compras 5 lápices a $10 cada uno, ¿cuánto pagas?", ans: "50", explanation: "5 × $10 = $50." },
  { id: 15, q: "¿Cuánto es 100 − 35?", ans: "65", explanation: "100 − 35 = 65." },
  { id: 16, q: "¿Qué número está entre 9 y 11?", ans: "10", explanation: "9, 10, 11 → 10." },
  { id: 17, q: "Continúa: 5, 10, 15, ?, 25", ans: "20", explanation: "Suman 5. 15+5=20." },
  { id: 18, q: "¿Cuánto es 9 + 9?", ans: "18", explanation: "9 + 9 = 18." },
  { id: 19, q: "Un triángulo equilátero tiene lado 4. ¿Perímetro?", ans: "12", explanation: "P = 3 × 4 = 12." },
  { id: 20, q: "Cuenta de 2 en 2 hasta 10: ¿cuántos números cuentas?", ans: "5", explanation: "2, 4, 6, 8, 10 → 5." },
];

export default function RetosScreen() {
  const { progress, goScreen, book, grantReward } = useBook();
  const [showGame, setShowGame] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  const backScreen = progress ? 'home' : 'setup';

  const toggleAnswer = (id: number) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReward = (coins: number) => {
    grantReward(0, coins);
  };

  return (
    <div className="screen active" id="screen-retos">
      {book?.slug === 'libro-1ro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1.25rem' }}>
          <div
            className="feat-btn"
            onClick={() => goScreen('estandares')}
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0, cursor: 'pointer' }}
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
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0, cursor: 'pointer' }}
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

      <div className="hero-banner" style={{ background: 'linear-gradient(135deg,#7A3200,#FF8A1F,#FFB066)', padding: '1.2rem 1rem', marginBottom: '1rem' }}>
        <div className="hero-title" style={{ color: '#fff' }}>🏆 Retos Matemáticos</div>
        <div className="hero-tag" style={{ color: '#FFE066', fontSize: '13px', fontWeight: 800, marginTop: '.3rem' }}>
          Desafíos para primer grado
        </div>
      </div>

      <div style={{ padding: '0 .8rem' }}>
        {/* Intro con botón para empezar */}
        <div
          style={{
            background: 'linear-gradient(135deg,#7A3200,#FF8A1F,#FFB066)',
            borderRadius: '14px',
            padding: '1.5rem 1rem',
            margin: '0.8rem 0',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(255,138,31,.25)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 6px' }}>🎯 Practica 20 Retos Matemáticos</h3>
          <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px', opacity: 0.95 }}>
            Selección múltiple · 4 opciones · puntuación · tiempo · sonidos y efectos
          </p>
          <button
            onClick={() => setShowGame(true)}
            style={{
              background: '#fff',
              color: '#7A3200',
              fontWeight: 900,
              fontSize: '14px',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 22px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,.18)',
              transition: 'transform .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🚀 ¡Empezar Retos!
          </button>
        </div>

        {/* Lista de Retos */}
        <div style={{ marginTop: '1.5rem' }}>
          {RETOS_LIST.map((reto) => {
            const isVisible = !!visibleAnswers[reto.id];
            return (
              <div key={reto.id} className="reto-card">
                <div className="reto-q">
                  <strong>🎯 Reto {reto.id}</strong>: {reto.q}
                </div>
                <button className="reto-btn" onClick={() => toggleAnswer(reto.id)}>
                  💡 {isVisible ? 'Ocultar respuesta' : 'Ver respuesta'}
                </button>
                <div className={`reto-ans ${isVisible ? 'show' : ''}`}>
                  ✅ Respuesta: {reto.ans}
                  <br />
                  📖 {reto.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showGame && (
        <Retos1Game
          onReward={handleReward}
          onClose={() => setShowGame(false)}
        />
      )}
    </div>
  );
}
