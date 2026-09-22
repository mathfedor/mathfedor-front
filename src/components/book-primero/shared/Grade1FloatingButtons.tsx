'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';

export default function Grade1FloatingButtons() {
  const { screen, goScreen, student } = useBook1();
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  // Ocultar en lección activa
  if (screen === 'lesson') return null;

  const handleMascotClick = () => {
    const messages = [
      '¡Hola cadete! ¿Listo para contar? 🚀',
      '¡Tú puedes resolver todos los ejercicios! 🌟',
      '¡Cada nivel completado te da monedas y estrellas! 🪙',
      '¡Aprender matemáticas con Fedor es divertido! ✨',
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(msg);
    fedorTTS.speak(msg);
    setTimeout(() => setBubbleText(null), 4000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Globo de diálogo */}
      {bubbleText && (
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #F0C674',
            borderRadius: '16px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#1A0A3C',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            maxWidth: '220px',
            textAlign: 'center',
            animation: 'popIn 0.3s ease',
          }}
        >
          {bubbleText}
        </div>
      )}

      {/* Botón flotante mascota */}
      <button
        type="button"
        onClick={handleMascotClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          border: '3px solid #FFE066',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(16, 185, 129, 0.45)',
          transition: 'transform 0.15s',
        }}
        title="Tu mascota Fedor"
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {student?.avatar || '🐉'}
      </button>
    </div>
  );
}
