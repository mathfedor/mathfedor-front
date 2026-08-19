'use client';

import React, { useState, useEffect } from 'react';
import { useBook } from '../context/BookContext';
import Swal from 'sweetalert2';

interface MinijuegosPickerModalProps {
  onClose: () => void;
}

export const BADGES_2DO = [
  { id: 'b_decena', icon: '🔟', name: 'Maestro de la Decena', desc: 'Completa Conteo y Secuencias N1' },
  { id: 'b_docena', icon: '🥚', name: 'Cazador de la Docena', desc: 'Cuenta correctamente hasta 12' },
  { id: 'b_pares', icon: '🐲', name: 'Conoce a Negoran', desc: 'Clasifica 5 números pares e impares' },
  { id: 'b_decimal', icon: '💯', name: 'Capitán del Sistema Decimal', desc: 'Domina la descomposición' },
  { id: 'b_millon', icon: '🏆', name: 'Explorador del Millón', desc: 'Lee correctamente un número de 7 cifras' },
  { id: 'b_tienda', icon: '🏪', name: 'Vendedor de la Tienda de Math', desc: 'Resuelve 3 problemas de la tienda' },
  { id: 'b_resta', icon: '➖', name: 'Resta sin Préstamo', desc: 'Completa 10 restas sin pedir' },
  { id: 'b_prestamo', icon: '🔁', name: 'Maestro del Préstamo', desc: 'Hace 5 restas con préstamo seguidas' },
  { id: 'b_reloj', icon: '🕒', name: 'Guardián del Reloj', desc: 'Domina horas, minutos y segundos' },
  { id: 'b_tablas', icon: '📚', name: 'Tabla Mágica Encontrada', desc: 'Aprueba todas las tablas hasta el 9' },
  { id: 'b_repartir', icon: '❤️', name: 'Reparte como Math', desc: 'Resuelve 10 divisiones exactas' },
  { id: 'b_residuo', icon: '❓', name: 'Detector de Residuos', desc: 'Halla el residuo en 5 divisiones inexactas' },
  { id: 'b_fiesta', icon: '🎉', name: 'Anfitrión de la Fiesta', desc: 'Reparte el costo entre estudiantes' },
  { id: 'b_saber', icon: '🎯', name: 'Pre-SABER', desc: 'Resuelve 3 problemas tipo prueba SABER' },
  { id: 'b_perfecto', icon: '⭐', name: 'Nivel Perfecto', desc: 'Completa un nivel con todas correctas' },
  { id: 'b_racha7', icon: '🔥', name: 'Racha de 7', desc: '7 días consecutivos jugando' },
  { id: 'b_galaxia', icon: '🌌', name: 'Viajero Galáctico', desc: 'Visita los planetas del libro' },
  { id: 'b_universo', icon: '🚀', name: 'Conquistador del Universo', desc: 'Termina el libro de 2°' },
];

export default function MinijuegosPickerModal({ onClose }: MinijuegosPickerModalProps) {
  const { grantReward } = useBook();
  const [activeGame, setActiveGame] = useState<'picker' | 'corazones' | 'reloj' | 'tienda' | 'insignias'>('picker');

  // Game state: Reparte los Corazones
  const [corazonesState, setCorazonesState] = useState<{ total: number; kids: number; ans: number; userAns: string; feedback: string; score: number }>({
    total: 12,
    kids: 3,
    ans: 4,
    userAns: '',
    feedback: '',
    score: 0,
  });

  // Game state: Reto del Reloj
  const [relojState, setRelojState] = useState<{ q: string; ans: number; userAns: string; feedback: string; score: number }>({
    q: '',
    ans: 0,
    userAns: '',
    feedback: '',
    score: 0,
  });

  // Game state: Tienda de Math
  const [tiendaState, setTiendaState] = useState<{ q: string; ans: number; userAns: string; feedback: string; score: number }>({
    q: '',
    ans: 0,
    userAns: '',
    feedback: '',
    score: 0,
  });

  // Badges state
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('fedor2_badges') || '[]');
      setEarnedBadges(stored);
    } catch {
      setEarnedBadges([]);
    }
  }, []);

  // Generate round for Corazones
  const nextCorazonesRound = () => {
    const kids = 2 + Math.floor(Math.random() * 4); // 2 to 5
    const ans = 2 + Math.floor(Math.random() * 6); // 2 to 7
    const total = kids * ans;
    setCorazonesState((prev) => ({
      ...prev,
      total,
      kids,
      ans,
      userAns: '',
      feedback: '',
    }));
  };

  // Generate round for Reloj
  const nextRelojRound = () => {
    const types = ['h_to_m', 'm_to_s', 'm_to_h', 's_to_m'];
    const t = types[Math.floor(Math.random() * types.length)];
    let q = '';
    let ans = 0;

    if (t === 'h_to_m') {
      const h = 1 + Math.floor(Math.random() * 5);
      q = `¿Cuántos minutos hay en ${h} hora${h > 1 ? 's' : ''}?`;
      ans = h * 60;
    } else if (t === 'm_to_s') {
      const m = 1 + Math.floor(Math.random() * 5);
      q = `¿Cuántos segundos hay en ${m} minuto${m > 1 ? 's' : ''}?`;
      ans = m * 60;
    } else if (t === 'm_to_h') {
      const h = 1 + Math.floor(Math.random() * 5);
      const m = h * 60;
      q = `¿Cuántas horas son ${m} minutos?`;
      ans = h;
    } else {
      const m = 1 + Math.floor(Math.random() * 5);
      const s = m * 60;
      q = `¿Cuántos minutos son ${s} segundos?`;
      ans = m;
    }

    setRelojState((prev) => ({
      ...prev,
      q,
      ans,
      userAns: '',
      feedback: '',
    }));
  };

  // Generate round for Tienda
  const nextTiendaRound = () => {
    const productos = ['lápiz', 'borrador', 'regla', 'caja de colores', 'sacapuntas', 'cuaderno', 'marcador'];
    const prod = productos[Math.floor(Math.random() * productos.length)];
    const precio = (1 + Math.floor(Math.random() * 8)) * 100; // 100 to 800
    const billetes = [500, 1000, 2000].filter((b) => b > precio);
    const pago = billetes[Math.floor(Math.random() * billetes.length)] || 1000;
    const cambio = pago - precio;

    const q = `Un cliente compra un(a) ${prod} por $${precio}. Paga con un billete de $${pago}. ¿Cuánto dinero le devuelves de cambio?`;

    setTiendaState((prev) => ({
      ...prev,
      q,
      ans: cambio,
      userAns: '',
      feedback: '',
    }));
  };

  // Check Corazones
  const handleCheckCorazones = () => {
    const val = parseInt(corazonesState.userAns, 10);
    if (isNaN(val)) return;

    if (val === corazonesState.ans) {
      setCorazonesState((prev) => ({
        ...prev,
        score: prev.score + 1,
        feedback: '🎉 ¡Excelente! ¡Reparto exacto! (+10 monedas)',
      }));
      grantReward(0, 10);
      setTimeout(() => nextCorazonesRound(), 1400);
    } else {
      setCorazonesState((prev) => ({
        ...prev,
        feedback: `❌ Casi. Eran ${prev.ans} corazones para cada uno. ¡Sigue practicando!`,
      }));
      setTimeout(() => nextCorazonesRound(), 2000);
    }
  };

  // Check Reloj
  const handleCheckReloj = () => {
    const val = parseInt(relojState.userAns, 10);
    if (isNaN(val)) return;

    if (val === relojState.ans) {
      setRelojState((prev) => ({
        ...prev,
        score: prev.score + 1,
        feedback: '🎉 ¡Correcto! ¡Dominas el tiempo! (+15 monedas)',
      }));
      grantReward(0, 15);
      setTimeout(() => nextRelojRound(), 1400);
    } else {
      setRelojState((prev) => ({
        ...prev,
        feedback: `❌ La respuesta correcta era ${prev.ans}. ¡Inténtalo de nuevo!`,
      }));
      setTimeout(() => nextRelojRound(), 2000);
    }
  };

  // Check Tienda
  const handleCheckTienda = () => {
    const val = parseInt(tiendaState.userAns, 10);
    if (isNaN(val)) return;

    if (val === tiendaState.ans) {
      setTiendaState((prev) => ({
        ...prev,
        score: prev.score + 1,
        feedback: '🎉 ¡Cobro perfecto! ¡Buen vendedor! (+20 monedas)',
      }));
      grantReward(0, 20);
      setTimeout(() => nextTiendaRound(), 1400);
    } else {
      setTiendaState((prev) => ({
        ...prev,
        feedback: `❌ El cambio correcto era $${prev.ans}. ¡Prueba con otro cliente!`,
      }));
      setTimeout(() => nextTiendaRound(), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14, 8, 48, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: activeGame === 'insignias' ? '520px' : '420px',
          width: '100%',
          padding: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#F0EDFF',
            border: 'none',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 900,
            color: '#6C28B4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* --- 1. PICKER SCREEN --- */}
        {activeGame === 'picker' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '42px' }}>🎮</div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#3D1468',
                }}
              >
                Mini-juegos de 2°
              </div>
              <div style={{ fontSize: '12px', color: '#7A7299', fontWeight: 700 }}>
                Practica jugando y gana monedas extra
              </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {/* Option 1: Reparte los Corazones */}
              <button
                type="button"
                onClick={() => {
                  nextCorazonesRound();
                  setActiveGame('corazones');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'linear-gradient(135deg, #F8F5FF, #EEEDFE)',
                  border: '2px solid #C5BFEE',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'transform .15s',
                }}
              >
                <span style={{ fontSize: '32px' }}>❤️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#3D1468' }}>
                    Reparte los Corazones
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 700 }}>
                    División visual · +10 monedas por acierto
                  </div>
                </div>
                <span style={{ color: '#6C28B4', fontWeight: 900, fontSize: '18px' }}>›</span>
              </button>

              {/* Option 2: Reto del Reloj */}
              <button
                type="button"
                onClick={() => {
                  nextRelojRound();
                  setActiveGame('reloj');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
                  border: '2px solid #FBBF7A',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'transform .15s',
                }}
              >
                <span style={{ fontSize: '32px' }}>🕒</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#7A3200' }}>
                    Reto del Reloj
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 700 }}>
                    Horas, minutos, segundos · +15 monedas
                  </div>
                </div>
                <span style={{ color: '#E8650A', fontWeight: 900, fontSize: '18px' }}>›</span>
              </button>

              {/* Option 3: Tienda de Math */}
              <button
                type="button"
                onClick={() => {
                  nextTiendaRound();
                  setActiveGame('tienda');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'linear-gradient(135deg, #DCF5EE, #B8F0DE)',
                  border: '2px solid #8FD9C0',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'transform .15s',
                }}
              >
                <span style={{ fontSize: '32px' }}>🏪</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#074F3A' }}>
                    Tienda de Math
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 700 }}>
                    Da el cambio correcto · +20 monedas
                  </div>
                </div>
                <span style={{ color: '#16876A', fontWeight: 900, fontSize: '18px' }}>›</span>
              </button>

              {/* Option 4: Mis Insignias */}
              <button
                type="button"
                onClick={() => setActiveGame('insignias')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'linear-gradient(135deg, #FAECE7, #F5C7B8)',
                  border: '2px solid #F5B09A',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'transform .15s',
                }}
              >
                <span style={{ fontSize: '32px' }}>🏅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#7A1B00' }}>
                    Mis Insignias
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A7299', fontWeight: 700 }}>
                    18 insignias por ganar
                  </div>
                </div>
                <span style={{ color: '#C94B22', fontWeight: 900, fontSize: '18px' }}>›</span>
              </button>
            </div>
          </div>
        )}

        {/* --- 2. GAME: REPARTE LOS CORAZONES --- */}
        {activeGame === 'corazones' && (
          <div>
            <button
              type="button"
              onClick={() => setActiveGame('picker')}
              style={{
                background: '#F0EDFF',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 12px',
                fontWeight: 900,
                color: '#6C28B4',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              ⬅ Volver a juegos
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '36px' }}>❤️</div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#3D1468',
                }}
              >
                Reparte los Corazones
              </div>
              <div style={{ fontSize: '13px', color: '#7A7299', fontWeight: 700, marginTop: '4px' }}>
                Math tiene <b>{corazonesState.total}</b> corazones para <b>{corazonesState.kids}</b> niños. ¿Cuántos para cada uno?
              </div>
            </div>

            {/* Visual Hearts */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                background: '#FFF0F5',
                padding: '12px',
                borderRadius: '14px',
                marginBottom: '1rem',
                minHeight: '60px',
              }}
            >
              {Array.from({ length: corazonesState.total }).map((_, i) => (
                <span key={i} style={{ fontSize: '24px' }}>❤️</span>
              ))}
            </div>

            <input
              type="number"
              value={corazonesState.userAns}
              onChange={(e) => setCorazonesState({ ...corazonesState, userAns: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckCorazones(); }}
              placeholder="?"
              style={{
                width: '140px',
                fontSize: '30px',
                fontWeight: 900,
                textAlign: 'center',
                border: '2.5px solid #C5BFEE',
                borderRadius: '12px',
                padding: '8px',
                background: '#F7F5FF',
                color: '#180D38',
                outline: 'none',
                display: 'block',
                margin: '0 auto',
                fontFamily: "'Nunito', sans-serif",
              }}
              autoFocus
            />

            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 900, minHeight: '24px', margin: '.6rem 0', color: corazonesState.feedback.startsWith('🎉') ? '#059669' : '#DC2626' }}>
              {corazonesState.feedback}
            </div>

            <button
              type="button"
              onClick={handleCheckCorazones}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 900,
                background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 6px 18px rgba(123,47,190,.4)',
              }}
            >
              Comprobar
            </button>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#7A7299', fontWeight: 800, marginTop: '.6rem' }}>
              Puntaje: {corazonesState.score}
            </div>
          </div>
        )}

        {/* --- 3. GAME: RETO DEL RELOJ --- */}
        {activeGame === 'reloj' && (
          <div>
            <button
              type="button"
              onClick={() => setActiveGame('picker')}
              style={{
                background: '#FEF0E6',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 12px',
                fontWeight: 900,
                color: '#C2410C',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              ⬅ Volver a juegos
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '36px' }}>🕒</div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#3D1468',
                }}
              >
                Reto del Reloj
              </div>
              <div style={{ fontSize: '13px', color: '#7A7299', fontWeight: 700, marginTop: '4px' }}>
                Convierte entre horas, minutos y segundos
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: '17px',
                fontWeight: 900,
                color: '#180D38',
                background: '#FEF0E6',
                padding: '1rem',
                borderRadius: '14px',
                marginBottom: '1rem',
                border: '1.5px solid #FDBA74',
              }}
            >
              {relojState.q}
            </div>

            <input
              type="number"
              value={relojState.userAns}
              onChange={(e) => setRelojState({ ...relojState, userAns: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckReloj(); }}
              placeholder="?"
              style={{
                width: '140px',
                fontSize: '30px',
                fontWeight: 900,
                textAlign: 'center',
                border: '2.5px solid #FDBA74',
                borderRadius: '12px',
                padding: '8px',
                background: '#FFF7ED',
                color: '#180D38',
                outline: 'none',
                display: 'block',
                margin: '0 auto',
                fontFamily: "'Nunito', sans-serif",
              }}
              autoFocus
            />

            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 900, minHeight: '24px', margin: '.6rem 0', color: relojState.feedback.startsWith('🎉') ? '#059669' : '#DC2626' }}>
              {relojState.feedback}
            </div>

            <button
              type="button"
              onClick={handleCheckReloj}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 900,
                background: 'linear-gradient(135deg,#E8650A,#FF8C2A)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 6px 18px rgba(232,101,10,.4)',
              }}
            >
              Comprobar
            </button>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#7A7299', fontWeight: 800, marginTop: '.6rem' }}>
              Puntaje: {relojState.score}
            </div>
          </div>
        )}

        {/* --- 4. GAME: TIENDA DE MATH --- */}
        {activeGame === 'tienda' && (
          <div>
            <button
              type="button"
              onClick={() => setActiveGame('picker')}
              style={{
                background: '#DCF5EE',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 12px',
                fontWeight: 900,
                color: '#047857',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              ⬅ Volver a juegos
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '36px' }}>🏪</div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#3D1468',
                }}
              >
                Tienda de Math — Da el cambio
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: '14.5px',
                fontWeight: 700,
                color: '#180D38',
                background: '#DCF5EE',
                padding: '1rem',
                borderRadius: '14px',
                marginBottom: '1rem',
                lineHeight: 1.5,
                border: '1.5px solid #6EE7B7',
              }}
            >
              {tiendaState.q}
            </div>

            <input
              type="number"
              value={tiendaState.userAns}
              onChange={(e) => setTiendaState({ ...tiendaState, userAns: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckTienda(); }}
              placeholder="$ ?"
              style={{
                width: '160px',
                fontSize: '30px',
                fontWeight: 900,
                textAlign: 'center',
                border: '2.5px solid #6EE7B7',
                borderRadius: '12px',
                padding: '8px',
                background: '#ECFDF5',
                color: '#180D38',
                outline: 'none',
                display: 'block',
                margin: '0 auto',
                fontFamily: "'Nunito', sans-serif",
              }}
              autoFocus
            />

            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 900, minHeight: '24px', margin: '.6rem 0', color: tiendaState.feedback.startsWith('🎉') ? '#059669' : '#DC2626' }}>
              {tiendaState.feedback}
            </div>

            <button
              type="button"
              onClick={handleCheckTienda}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                fontWeight: 900,
                background: 'linear-gradient(135deg,#16876A,#24C496)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 6px 18px rgba(22,135,106,.4)',
              }}
            >
              Cobrar
            </button>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#7A7299', fontWeight: 800, marginTop: '.6rem' }}>
              Puntaje: {tiendaState.score}
            </div>
          </div>
        )}

        {/* --- 5. GAME: MIS INSIGNIAS --- */}
        {activeGame === 'insignias' && (
          <div>
            <button
              type="button"
              onClick={() => setActiveGame('picker')}
              style={{
                background: '#FAECE7',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 12px',
                fontWeight: 900,
                color: '#B91C1C',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              ⬅ Volver a juegos
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '36px' }}>🏅</div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#3D1468',
                }}
              >
                Mis Insignias
              </div>
              <div style={{ fontSize: '12px', color: '#7A7299', fontWeight: 700 }}>
                {earnedBadges.length} de {BADGES_2DO.length} desbloqueadas
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                maxHeight: '52vh',
                overflowY: 'auto',
                padding: '4px',
              }}
            >
              {BADGES_2DO.map((b) => {
                const got = earnedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    style={{
                      background: got ? 'linear-gradient(135deg,#FFF8E0,#FFE066)' : '#F7F4FF',
                      border: got ? '2px solid #F5C518' : '2px solid #DDD8F5',
                      borderRadius: '14px',
                      padding: '10px 8px',
                      textAlign: 'center',
                      opacity: got ? 1 : 0.45,
                      filter: got ? 'none' : 'grayscale(0.6)',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '4px' }}>{b.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#3D1468', lineHeight: 1.2 }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#7A7299', fontWeight: 700, marginTop: '3px' }}>
                      {b.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
