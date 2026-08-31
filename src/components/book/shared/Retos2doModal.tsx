'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '@/services/tts.service';

export interface Reto2doItem {
  q: string;
  opts: string[];
  ans: string;
  t: number;
  tipo: string;
}

export const RETOS_2DO: Reto2doItem[] = [
  { q: '¿Cuánto es 15 + 9?', opts: ['24', '23', '25', '22'], ans: '24', t: 30, tipo: 'Suma' },
  { q: '¿Cuánto es 30 − 12?', opts: ['18', '17', '19', '20'], ans: '18', t: 30, tipo: 'Resta' },
  { q: '¿Cuánto es 7 × 6?', opts: ['42', '40', '44', '36'], ans: '42', t: 40, tipo: 'Multiplicación' },
  { q: '¿Cuánto es 36 ÷ 6?', opts: ['6', '5', '7', '8'], ans: '6', t: 40, tipo: 'División' },
  { q: '¿Qué número va después del 99?', opts: ['100', '98', '101', '110'], ans: '100', t: 20, tipo: 'Conteo' },
  { q: '¿Cuántos lados tiene un cuadrado?', opts: ['4', '3', '5', '6'], ans: '4', t: 20, tipo: 'Geometría' },
  { q: 'Si compro 4 manzanas a $200 c/u, ¿cuánto pago?', opts: ['$800', '$600', '$1000', '$400'], ans: '$800', t: 45, tipo: 'Problema' },
  { q: '¿Cuál es el doble de 12?', opts: ['24', '22', '26', '30'], ans: '24', t: 25, tipo: 'Multiplicación' },
  { q: '¿Cuál es la mitad de 18?', opts: ['9', '7', '10', '8'], ans: '9', t: 25, tipo: 'División' },
  { q: 'En 345, ¿cuál es la cifra de las centenas?', opts: ['3', '4', '5', '45'], ans: '3', t: 30, tipo: 'Posicional' },
  { q: '¿Cuántas decenas hay en 80?', opts: ['8', '9', '7', '80'], ans: '8', t: 30, tipo: 'Decenas' },
  { q: 'Patrón: 2, 4, 6, 8, ¿qué sigue?', opts: ['10', '9', '12', '11'], ans: '10', t: 25, tipo: 'Patrón' },
  { q: '¿Cuánto es 50 + 50?', opts: ['100', '90', '110', '99'], ans: '100', t: 20, tipo: 'Suma' },
  { q: '¿Cuánto es 100 − 25?', opts: ['75', '85', '65', '80'], ans: '75', t: 30, tipo: 'Resta' },
  { q: 'Una hora tiene ___ minutos', opts: ['60', '30', '100', '24'], ans: '60', t: 20, tipo: 'Tiempo' },
  { q: 'Si tengo 3 grupos de 4 cromos, ¿cuántos tengo?', opts: ['12', '7', '10', '15'], ans: '12', t: 40, tipo: 'Multiplicación' },
  { q: 'María reparte 20 dulces entre 5 niños, ¿cuántos recibe c/u?', opts: ['4', '5', '6', '3'], ans: '4', t: 45, tipo: 'División' },
  { q: '¿Cuál es par: 7, 12, 15, 9?', opts: ['12', '7', '15', '9'], ans: '12', t: 25, tipo: 'Pares' },
  { q: 'Perímetro de un cuadrado de 5cm de lado:', opts: ['20cm', '15cm', '25cm', '10cm'], ans: '20cm', t: 40, tipo: 'Geometría' },
  { q: '¿Qué fracción es la mitad?', opts: ['1/2', '1/3', '1/4', '2/3'], ans: '1/2', t: 30, tipo: 'Fracciones' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

interface Retos2doModalProps {
  onClose: () => void;
}

export default function Retos2doModal({ onClose }: Retos2doModalProps) {
  const { grantReward } = useBook();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentReto = RETOS_2DO[idx];
  const isFinished = idx >= RETOS_2DO.length;

  // Iniciar un nuevo reto
  useEffect(() => {
    if (isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (score > 0) {
        grantReward(0, score * 2);
      }
      return;
    }

    const opts = shuffleArray(currentReto.opts);
    setShuffledOpts(opts);
    setSelectedOpt(null);
    setIsAnswered(false);
    setTimeLeft(currentReto.t);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAttempts((a) => a + 1);
          setIdx((i) => i + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, isFinished]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered || isFinished) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOpt(opt);
    setIsAnswered(true);
    setAttempts((a) => a + 1);

    const isCorrect = String(opt) === String(currentReto.ans);
    if (isCorrect) {
      setScore((s) => s + 1);
      try {
        fedorTTS.speak('¡Correcto!');
      } catch {
        // ignore
      }
    } else {
      try {
        fedorTTS.speak('¡Sigue intentando!');
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setIdx((i) => i + 1);
    }, 1100);
  };

  const handleRestart = () => {
    setIdx(0);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14, 8, 48, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Nunito', sans-serif",
        userSelect: 'none',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '1.5rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vista cuando termina todos los retos */}
        {isFinished ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: '0 4px 12px rgba(108, 40, 180, 0.3)',
                }}
              >
                <span style={{ fontSize: '16px' }}>←</span> Regresar al Menú
              </button>
            </div>

            <div style={{ fontSize: '64px', marginBottom: '0.5rem' }}>🏆</div>
            <h2
              style={{
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                fontSize: '26px',
                fontWeight: 900,
                color: '#1A0A3C',
                margin: '0 0 0.5rem',
              }}
            >
              ¡Retos Completados!
            </h2>
            <div style={{ fontSize: '22px', color: '#16876A', fontWeight: 900, marginBottom: '0.25rem' }}>
              Puntaje: {score}/{RETOS_2DO.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 700, marginBottom: '1.5rem' }}>
              Intentos realizados: {attempts}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleRestart}
                style={{
                  padding: '11px 22px',
                  background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                🔄 Jugar de nuevo
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '11px 22px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '2px solid #D1D5DB',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cerrar
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                <span style={{ fontSize: '16px' }}>←</span> Regresar al Menú
              </button>
            </div>
          </div>
        ) : (
          /* Vista del Reto Activo */
          <div>
            {/* Botón Superior Regresar al Menú */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: '0 4px 12px rgba(108, 40, 180, 0.3)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span style={{ fontSize: '16px' }}>←</span> Regresar al Menú
              </button>
            </div>

            {/* Barra de Estadísticas */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0 4px',
              }}
            >
              <span style={{ color: '#7B2FBE', fontWeight: 900, fontSize: '15px' }}>
                ⚡ Reto {idx + 1}/{RETOS_2DO.length}
              </span>
              <span style={{ color: '#16876A', fontWeight: 900, fontSize: '15px' }}>
                ⭐ {score} puntos
              </span>
              <span style={{ color: '#A30041', fontWeight: 900, fontSize: '15px' }}>
                ⏱ {timeLeft}s
              </span>
            </div>

            {/* Tarjeta de Pregunta */}
            <div
              style={{
                background: '#FFFFFF',
                padding: '1.4rem 1.2rem',
                borderRadius: '16px',
                border: '2.5px solid #FF8C2A',
                textAlign: 'center',
                marginBottom: '1.2rem',
                boxShadow: '0 4px 14px rgba(255, 140, 42, 0.12)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#6B7280',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                {currentReto.tipo}
              </div>
              <div
                style={{
                  fontSize: '21px',
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: 1.25,
                  fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                }}
              >
                {currentReto.q}
              </div>
            </div>

            {/* Grid 2x2 de Opciones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
              {shuffledOpts.map((opt, i) => {
                let bgStyle = '#FFFFFF';
                let borderStyle = '2.5px solid #7B2FBE';
                let colorStyle = '#1A0A3C';

                if (isAnswered) {
                  if (String(opt) === String(currentReto.ans)) {
                    bgStyle = '#DCF5EE';
                    borderStyle = '2.5px solid #16876A';
                    colorStyle = '#065F46';
                  } else if (selectedOpt === opt) {
                    bgStyle = '#FBE4E9';
                    borderStyle = '2.5px solid #A30041';
                    colorStyle = '#9F1239';
                  }
                }

                return (
                  <button
                    key={`${idx}-${opt}-${i}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      padding: '14px 12px',
                      background: bgStyle,
                      border: borderStyle,
                      color: colorStyle,
                      borderRadius: '14px',
                      fontWeight: 900,
                      cursor: isAnswered ? 'default' : 'pointer',
                      fontSize: '18px',
                      fontFamily: "'Nunito', sans-serif",
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(123, 47, 190, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Botón Inferior Regresar al Menú */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1.2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #6C28B4, #9B5CFF)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: '0 4px 12px rgba(108, 40, 180, 0.3)',
                }}
              >
                <span style={{ fontSize: '16px' }}>←</span> Regresar al Menú
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
