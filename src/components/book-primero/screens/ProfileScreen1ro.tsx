'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import Swal from 'sweetalert2';

const AVATARS = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖', '🐱', '🐶'];

export default function ProfileScreen1ro() {
  const { student, startStudent, selectAvatar, goScreen } = useBook1();

  const [form, setForm] = useState({
    name: student?.name || '',
    school: student?.school || '',
    city: student?.city || '',
    teacher: student?.teacher || '',
    email: student?.email || '',
  });

  const handleSave = () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta tu nombre',
        text: 'Por favor escribe tu nombre.',
      });
      return;
    }
    startStudent({
      ...form,
      name: form.name.trim(),
      avatar: student?.avatar || '🧑‍🚀',
    });
    Swal.fire({
      icon: 'success',
      title: '¡Perfil actualizado!',
      text: 'Tus datos de astronauta han sido guardados.',
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDD8F5',
            color: '#7B2FBE',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,47,190,0.1)',
          }}
        >
          ← Volver al Inicio
        </button>
        <span style={{ fontSize: '13px', fontWeight: 900, color: '#7B2FBE' }}>
          Perfil de Astronauta
        </span>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          border: '1.5px solid #DDD8F5',
          boxShadow: '0 4px 20px rgba(108,40,180,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
              margin: '0 auto .75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              boxShadow: '0 4px 20px rgba(123,47,190,0.3)',
            }}
          >
            {student?.avatar || '🧑‍🚀'}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#666' }}>Elige tu avatar espacial:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => selectAvatar(av)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: student?.avatar === av ? '#FEF0E6' : '#F6F5FD',
                  border: student?.avatar === av ? '2.5px solid #FF8C2A' : '1.5px solid #DDD8F5',
                  fontSize: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s',
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 900, color: '#333', display: 'block', marginBottom: '4px' }}>
              Nombre del Astronauta
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #DDD8F5',
                fontSize: '14px',
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 900, color: '#333', display: 'block', marginBottom: '4px' }}>
              Colegio / Escuela
            </label>
            <input
              type="text"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #DDD8F5',
                fontSize: '14px',
                fontWeight: 700,
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 900, color: '#333', display: 'block', marginBottom: '4px' }}>
                Ciudad
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #DDD8F5',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 900, color: '#333', display: 'block', marginBottom: '4px' }}>
                Docente
              </label>
              <input
                type="text"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #DDD8F5',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            style={{
              marginTop: '10px',
              width: '100%',
              background: 'linear-gradient(135deg, #7B2FBE, #A864E8)',
              border: 'none',
              borderRadius: '14px',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '15px',
              padding: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(123,47,190,0.3)',
            }}
          >
            💾 Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
