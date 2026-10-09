'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

interface MinijuegosModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

const BADGES_4TO = [
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
  { id: 'b_galaxia', icon: '🌌', name: 'Viajero Galáctico', desc: 'Visita los 4 planetas del Multiverso' },
  { id: 'b_universo', icon: '🚀', name: 'Conquistador del Universo', desc: 'Termina el libro de 4°' },
];

export default function MinijuegosModal4to({
  isOpen = true,
  onClose,
}: MinijuegosModal4toProps) {
  const { updateStats } = useBook4();

  const [earnedBadges] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('fedor4_badges') || localStorage.getItem('fedor2_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mode: 'menu' (Imagen 1) | 'corazones' (Imagen 2) | 'reloj' (Imagen 3) | 'tienda' (Imagen 4) | 'insignias'
  const [mode, setMode] = useState<'menu' | 'corazones' | 'reloj' | 'tienda' | 'insignias'>('menu');

  // ── 1. ESTADO DE CORAZONES (Imagen 2: inicia con 16 corazones para 2 niños) ──
  const [corazonesTotal, setCorazonesTotal] = useState(16);
  const [corazonesNinos, setCorazonesNinos] = useState(2);
  const [corazonesInput, setCorazonesInput] = useState('');
  const [scoreCorazones, setScoreCorazones] = useState(0);

  // ── 2. ESTADO DE RELOJ (Imagen 3: inicia con "¿Cuántos segundos hay en 2 minutos?") ──
  const [relojQ, setRelojQ] = useState({
    q: '¿Cuántos segundos hay en 2 minutos?',
    ans: 120,
  });
  const [relojInput, setRelojInput] = useState('');
  const [scoreReloj, setScoreReloj] = useState(0);

  // ── 3. ESTADO DE TIENDA DE MATH (Imagen 4: inicia con sacapuntas $300, billete $2000) ──
  const [tiendaQ, setTiendaQ] = useState({
    articulo: 'sacapuntas',
    costo: 300,
    billete: 2000,
    ans: 1700,
  });
  const [tiendaInput, setTiendaInput] = useState('');
  const [scoreTienda, setScoreTienda] = useState(0);

  if (!isOpen) return null;

  // ── GENERADORES DE PROBLEMAS SIGUIENTES ──
  const nextCorazones = () => {
    const k = [2, 3, 4][Math.floor(Math.random() * 3)];
    const t = (3 + Math.floor(Math.random() * 5)) * 2; // número de corazones por niño
    const total = t * k;
    setCorazonesTotal(total);
    setCorazonesNinos(k);
    setCorazonesInput('');
  };

  const nextReloj = () => {
    const tipos = [
      { q: (h: number) => `¿Cuántos minutos hay en ${h} horas?`, gen: () => { const h = 1 + Math.floor(Math.random() * 6); return { text: `¿Cuántos minutos hay en ${h} horas?`, ans: 60 * h }; } },
      { q: (m: number) => `¿Cuántos segundos hay en ${m} minutos?`, gen: () => { const m = 1 + Math.floor(Math.random() * 5); return { text: `¿Cuántos segundos hay en ${m} minutos?`, ans: 60 * m }; } },
      { q: (h: number) => `¿Cuántos segundos hay en ${h} hora${h > 1 ? 's' : ''}?`, gen: () => { const h = 1 + Math.floor(Math.random() * 2); return { text: `¿Cuántos segundos hay en ${h} hora${h > 1 ? 's' : ''}?`, ans: 3600 * h }; } },
    ];
    const item = tipos[Math.floor(Math.random() * tipos.length)];
    const generated = item.gen();
    setRelojQ({ q: generated.text, ans: generated.ans });
    setRelojInput('');
  };

  const nextTienda = () => {
    const productos = ['lápiz', 'borrador', 'regla', 'colores', 'sacapuntas', 'cuaderno', 'marcador', 'tijeras'];
    const prod = productos[Math.floor(Math.random() * productos.length)];
    const precio = 100 * (2 + Math.floor(Math.random() * 8)); // 200..900
    const billete = [1000, 2000, 5000][Math.floor(Math.random() * 3)];
    if (billete <= precio) {
      setTiendaQ({
        articulo: prod,
        costo: precio,
        billete: 2000,
        ans: 2000 - precio,
      });
    } else {
      setTiendaQ({
        articulo: prod,
        costo: precio,
        billete: billete,
        ans: billete - precio,
      });
    }
    setTiendaInput('');
  };

  // ── VALIDACIÓN CORAZONES ──
  const handleCheckCorazones = () => {
    const ans = corazonesTotal / corazonesNinos;
    const v = parseInt(corazonesInput, 10);
    if (isNaN(v)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Escribe un número!',
        text: 'Escribe tu respuesta en el cuadro.',
        confirmButtonColor: '#7B2FBE',
      });
      return;
    }
    if (v === ans) {
      updateStats(10, 0, 5);
      setScoreCorazones((s) => s + 10);
      Swal.fire({
        icon: 'success',
        title: '¡Correcto! 🎉 +10 monedas',
        text: `Cada niño recibe ${ans} corazones.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(nextCorazones, 800);
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Inténtalo otra vez!',
        text: `Pista: ${corazonesTotal} ÷ ${corazonesNinos}`,
        confirmButtonColor: '#7B2FBE',
      });
    }
  };

  // ── VALIDACIÓN RELOJ ──
  const handleCheckReloj = () => {
    const v = parseInt(relojInput, 10);
    if (isNaN(v)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Escribe un número!',
        text: 'Escribe tu respuesta en el cuadro.',
        confirmButtonColor: '#E8650A',
      });
      return;
    }
    if (v === relojQ.ans) {
      updateStats(15, 0, 10);
      setScoreReloj((s) => s + 15);
      Swal.fire({
        icon: 'success',
        title: '¡Correcto! 🌟 +15 monedas',
        text: '¡Excelente cálculo del tiempo!',
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(nextReloj, 800);
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Casi! Inténtalo de nuevo',
        text: 'Recuerda: 1 hora = 60 minutos y 1 minuto = 60 segundos.',
        confirmButtonColor: '#E8650A',
      });
    }
  };

  // ── VALIDACIÓN TIENDA ──
  const handleCheckTienda = () => {
    const v = parseInt(tiendaInput, 10);
    if (isNaN(v)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Escribe el cambio!',
        text: 'Escribe tu respuesta en el cuadro.',
        confirmButtonColor: '#16876A',
      });
      return;
    }
    if (v === tiendaQ.ans) {
      updateStats(20, 0, 15);
      setScoreTienda((s) => s + 20);
      Swal.fire({
        icon: 'success',
        title: '¡Correcto! 💰 +20 monedas',
        text: `El cambio exacto es $${tiendaQ.ans}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(nextTienda, 800);
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Revisa la resta!',
        text: `Resta el costo ($${tiendaQ.costo}) del billete con que pagó ($${tiendaQ.billete}).`,
        confirmButtonColor: '#16876A',
      });
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(14, 8, 48, 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: mode === 'insignias' ? '460px' : '380px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          padding: mode === 'insignias' ? '22px 18px 20px 18px' : '24px 22px 20px 22px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Botón de Cierre Superior Derecho (Idéntico al original en las 4 imágenes) */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
          <button
            type="button"
            onClick={() => {
              if (mode === 'menu') {
                onClose();
              } else {
                setMode('menu');
              }
            }}
            title={mode === 'menu' ? 'Cerrar' : 'Volver al Menú de Juegos'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F0EDFF',
              color: '#6C28B4',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VISTA 1: MENÚ DE MINI-JUEGOS 4° (IDÉNTICO A IMAGEN 1)
           ══════════════════════════════════════════════════════════════ */}
        {mode === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Ícono de Control */}
            <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '6px' }}>
              🎮
            </div>

            {/* Título Principal */}
            <h2
              style={{
                margin: '0 0 4px 0',
                fontSize: '22px',
                fontWeight: 900,
                color: '#3D1468',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              Mini-juegos 4°
            </h2>

            {/* Subtítulo */}
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '12px',
                fontWeight: 700,
                color: '#7A7299',
                textAlign: 'center',
              }}
            >
              Practica jugando y gana monedas extra
            </p>

            {/* Opciones de Menú */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1. Reparte los Corazones */}
              <button
                type="button"
                onClick={() => setMode('corazones')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F8F5FF, #EEEDFE)',
                  border: '2px solid #C5BFEE',
                  borderRadius: '16px',
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(108, 40, 180, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '30px', lineHeight: 1 }}>❤️</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#3D1468' }}>
                      Reparte los Corazones
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', marginTop: '2px' }}>
                      División visual · +10 monedas por acierto
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#6C28B4' }}>›</span>
              </button>

              {/* 2. Reto del Reloj */}
              <button
                type="button"
                onClick={() => setMode('reloj')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
                  border: '2px solid #FBBF7A',
                  borderRadius: '16px',
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(232, 101, 10, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '30px', lineHeight: 1 }}>🕒</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#7A3200' }}>
                      Reto del Reloj
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', marginTop: '2px' }}>
                      Horas, minutos, segundos · +15 monedas
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#E8650A' }}>›</span>
              </button>

              {/* 3. Tienda de Math */}
              <button
                type="button"
                onClick={() => setMode('tienda')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #DCF5EE, #B8F0DE)',
                  border: '2px solid #8FD9C0',
                  borderRadius: '16px',
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(22, 135, 106, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '30px', lineHeight: 1 }}>🏪</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#074F3A' }}>
                      Tienda de Math
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', marginTop: '2px' }}>
                      Da el cambio correcto · +20 monedas
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#16876A' }}>›</span>
              </button>

              {/* 4. Mis Insignias */}
              <button
                type="button"
                onClick={() => setMode('insignias')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FAECE7, #F5C7B8)',
                  border: '2px solid #F5B09A',
                  borderRadius: '16px',
                  padding: '13px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(201, 75, 34, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '30px', lineHeight: 1 }}>🏅</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#7A1B00' }}>
                      Mis Insignias
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', marginTop: '2px' }}>
                      18 insignias por ganar
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#C94B22' }}>›</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 2: REPARTE LOS CORAZONES (IDÉNTICO A IMAGEN 2)
           ══════════════════════════════════════════════════════════════ */}
        {mode === 'corazones' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Ícono de Corazón */}
            <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '6px' }}>
              ❤️
            </div>

            {/* Título */}
            <h2
              style={{
                margin: '0 0 6px 0',
                fontSize: '20px',
                fontWeight: 900,
                color: '#3D1468',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              Reparte los Corazones
            </h2>

            {/* Enunciado */}
            <p
              style={{
                margin: '0 0 14px 0',
                fontSize: '13px',
                fontWeight: 700,
                color: '#7A7299',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Math tiene <b style={{ color: '#180D38' }}>{corazonesTotal}</b> corazones para <b style={{ color: '#180D38' }}>{corazonesNinos}</b> niños. ¿Cuántos para cada uno?
            </p>

            {/* Caja Rosada con Grilla de Corazones */}
            <div
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FFEAEA, #FAECE7)',
                borderRadius: '16px',
                padding: '16px 12px',
                marginBottom: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px 12px',
                minHeight: '110px',
                boxSizing: 'border-box',
              }}
            >
              {Array.from({ length: corazonesTotal }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '28px',
                    lineHeight: 1,
                    display: 'inline-block',
                    filter: 'drop-shadow(0 2px 4px rgba(225,29,72,0.2))',
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Input con Spinner */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '14px' }}>
              <input
                type="number"
                inputMode="numeric"
                placeholder="?"
                value={corazonesInput}
                onChange={(e) => setCorazonesInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckCorazones();
                }}
                style={{
                  width: '120px',
                  height: '46px',
                  borderRadius: '12px',
                  border: '2.5px solid #C5BFEE',
                  backgroundColor: '#F7F5FF',
                  fontSize: '26px',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: '#180D38',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Nunito', sans-serif",
                }}
              />
            </div>

            {/* Botón Morado: Comprobar */}
            <button
              type="button"
              onClick={handleCheckCorazones}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(123, 47, 190, 0.4)',
                marginBottom: '8px',
                fontFamily: "'Nunito', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.94';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Comprobar
            </button>

            {/* Puntaje */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', textAlign: 'center' }}>
              Puntaje: {scoreCorazones}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 3: RETO DEL RELOJ (IDÉNTICO A IMAGEN 3)
           ══════════════════════════════════════════════════════════════ */}
        {mode === 'reloj' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Ícono de Reloj */}
            <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '6px' }}>
              🕒
            </div>

            {/* Título */}
            <h2
              style={{
                margin: '0 0 4px 0',
                fontSize: '20px',
                fontWeight: 900,
                color: '#3D1468',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              Reto del Reloj
            </h2>

            {/* Subtítulo */}
            <p
              style={{
                margin: '0 0 14px 0',
                fontSize: '13px',
                fontWeight: 700,
                color: '#7A7299',
                textAlign: 'center',
              }}
            >
              Convierte entre horas, minutos y segundos
            </p>

            {/* Caja Lavanda con Pregunta */}
            <div
              style={{
                width: '100%',
                backgroundColor: '#F0EDFF',
                borderRadius: '14px',
                padding: '20px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#180D38',
                  textAlign: 'center',
                  lineHeight: 1.35,
                }}
              >
                {relojQ.q}
              </div>
            </div>

            {/* Input con Spinner */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '14px' }}>
              <input
                type="number"
                inputMode="numeric"
                placeholder="?"
                value={relojInput}
                onChange={(e) => setRelojInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckReloj();
                }}
                style={{
                  width: '140px',
                  height: '46px',
                  borderRadius: '12px',
                  border: '2.5px solid #C5BFEE',
                  backgroundColor: '#F7F5FF',
                  fontSize: '26px',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: '#180D38',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Nunito', sans-serif",
                }}
              />
            </div>

            {/* Botón Naranja: Comprobar */}
            <button
              type="button"
              onClick={handleCheckReloj}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #E8650A, #FF8C2A)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(232, 101, 10, 0.4)',
                marginBottom: '8px',
                fontFamily: "'Nunito', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.94';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Comprobar
            </button>

            {/* Puntaje */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', textAlign: 'center' }}>
              Puntaje: {scoreReloj}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 4: TIENDA DE MATH — DA EL CAMBIO (IDÉNTICO A IMAGEN 4)
           ══════════════════════════════════════════════════════════════ */}
        {mode === 'tienda' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Ícono de Tienda */}
            <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '6px' }}>
              🏪
            </div>

            {/* Título */}
            <h2
              style={{
                margin: '0 0 14px 0',
                fontSize: '20px',
                fontWeight: 900,
                color: '#3D1468',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              Tienda de Math — Da el cambio
            </h2>

            {/* Caja Durazno con Problema */}
            <div
              style={{
                width: '100%',
                backgroundColor: '#FEF0E6',
                borderRadius: '14px',
                padding: '18px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#180D38',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                Un cliente compra un <b style={{ color: '#180D38' }}>{tiendaQ.articulo}</b> que cuesta <b style={{ color: '#180D38' }}>${tiendaQ.costo}</b> y paga con un billete de <b style={{ color: '#180D38' }}>${tiendaQ.billete}</b>.<br />
                ¿Cuánto cambio le das?
              </div>
            </div>

            {/* Input con Spinner */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '14px' }}>
              <input
                type="number"
                inputMode="numeric"
                placeholder="?"
                value={tiendaInput}
                onChange={(e) => setTiendaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckTienda();
                }}
                style={{
                  width: '140px',
                  height: '46px',
                  borderRadius: '12px',
                  border: '2.5px solid #C5BFEE',
                  backgroundColor: '#F7F5FF',
                  fontSize: '26px',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: '#180D38',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Nunito', sans-serif",
                }}
              />
            </div>

            {/* Botón Esmeralda: Cobrar */}
            <button
              type="button"
              onClick={handleCheckTienda}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #16876A, #24C496)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(22, 135, 106, 0.4)',
                marginBottom: '8px',
                fontFamily: "'Nunito', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.94';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Cobrar
            </button>

            {/* Puntaje */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7299', textAlign: 'center' }}>
              Puntaje: {scoreTienda}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA 5: MIS INSIGNIAS (IDÉNTICO A IMAGEN)
           ══════════════════════════════════════════════════════════════ */}
        {mode === 'insignias' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Ícono de Medalla con Cinta */}
            <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '6px' }}>
              🎖️
            </div>

            {/* Título Principal */}
            <h2
              style={{
                margin: '0 0 4px 0',
                fontSize: '22px',
                fontWeight: 900,
                color: '#3D1468',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              Mis Insignias
            </h2>

            {/* Subtítulo: "0 de 18 desbloqueadas" */}
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '12px',
                fontWeight: 700,
                color: '#7A7299',
                textAlign: 'center',
              }}
            >
              {earnedBadges.length} de {BADGES_4TO.length} desbloqueadas
            </p>

            {/* Cuadrícula de 18 Insignias (3 Columnas con Scroll) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
                maxHeight: '66vh',
                overflowY: 'auto',
                padding: '2px 4px',
                boxSizing: 'border-box',
              }}
            >
              {BADGES_4TO.map((b) => {
                const got = earnedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    style={{
                      backgroundColor: got ? '#FFFDF5' : '#FFFFFF',
                      border: got ? '2px solid #F5C518' : '1.5px solid #EDE8F8',
                      borderRadius: '16px',
                      padding: '14px 6px 12px 6px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      boxSizing: 'border-box',
                      minHeight: '110px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '32px',
                        marginBottom: '6px',
                        lineHeight: 1,
                        opacity: got ? 1 : 0.65,
                        filter: got ? 'none' : 'grayscale(0.35)',
                      }}
                    >
                      {b.icon}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#4A3E68',
                        lineHeight: 1.25,
                        marginBottom: '3px',
                        textAlign: 'center',
                      }}
                    >
                      {b.name}
                    </div>
                    <div
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color: '#8C84A6',
                        lineHeight: 1.25,
                        textAlign: 'center',
                      }}
                    >
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
