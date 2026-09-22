'use client';

import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useBook1, type StudentProfile1 } from '../context/Book1Context';
import Starfield from '@/components/book/shared/Starfield';
import { authService } from '@/services/auth.service';
import Swal from 'sweetalert2';

const AVATARS = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];

/** Pantalla de bienvenida y captura de datos del estudiante para 1° Grado. */
export default function SetupScreen1ro() {
  const { startStudent, goScreen } = useBook1();
  const router = useRouter();

  const [avatar, setAvatar] = useState('🧑‍🚀');
  const [hasStudentData, setHasStudentData] = useState(true);
  const [form, setForm] = useState<Omit<StudentProfile1, 'avatar'>>({
    name: '',
    school: '',
    city: '',
    teacher: '',
    email: '',
  });

  /** Al montar, pre-carga los datos del estudiante tomados del perfil del usuario logueado. */
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const student = user.student;
    const studentComplete = !!(student && (student.name || student.institution || student.city));
    setHasStudentData(studentComplete);

    const name = student?.name || user.name || '';
    const school = student?.institution || '';
    const city = student?.city || '';
    const email = student?.email || user.email || '';

    setForm((prev) => ({
      ...prev,
      name: name || prev.name,
      school: school || prev.school,
      city: city || prev.city,
      email: email || prev.email,
    }));
  }, []);

  const update = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const launch = () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: '¡Falta tu nombre!',
        text: 'Por favor ingresa tu nombre para comenzar la aventura de Matemáticas de Fedor.',
        confirmButtonColor: '#7B2FBE',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    startStudent({
      ...form,
      name: trimmedName,
      avatar,
    });
  };

  return (
    <div className="screen active" id="screen-setup">
      <div className="setup-wrap">
        <div className="setup-hero">
          <Starfield count={40} />
          <div className="setup-planet" />
          <div className="setup-ring" />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.5rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 52,
                boxShadow: '0 0 0 4px rgba(245,197,24,.6),0 8px 32px rgba(0,0,0,.5)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              {avatar}
            </div>
          </div>
          <div className="setup-title">
            ¡Bienvenido a<br />
            <em>Matemáticas de Fedor 1°!</em>
          </div>
          <div className="setup-sub">
            El mejor libro interactivo de matemáticas para 1° grado
          </div>
          <div className="setup-badges">
            <span className="s-badge sb-purple">🎮 Gamificado</span>
            <span className="s-badge sb-teal">✅ MEN Colombia</span>
            <span className="s-badge sb-orange">🏆 5 Niveles</span>
            <span className="s-badge sb-blue">📊 Reporte Docente</span>
          </div>
        </div>

        <div className="setup-body">
          <div
            style={{
              background: 'linear-gradient(135deg,#FEF0E6,#FFE2C8)',
              border: '1.5px solid #FBBF7A',
              borderRadius: 'var(--r-md)',
              padding: '12px 16px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22 }}>💡</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7A3200' }}>
              Este libro es el <strong>complemento digital</strong> del método Fedor para 1° de primaria.
              Aprenderás Conteo, Suma, Decena, Recta numérica y más.
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
            Elige tu astronauta
          </div>
          <div className="avatar-pick" id="avatarPick">
            {AVATARS.map((a) => (
              <div key={a} className={`av-btn${a === avatar ? ' sel' : ''}`} onClick={() => setAvatar(a)}>
                {a}
              </div>
            ))}
          </div>

          <div className="field-grid">
            <div className="field field-full">
              <label className="flabel">Tu nombre</label>
              <input
                className="finput"
                value={form.name}
                onChange={update('name')}
                placeholder="Ej: Valentina García"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label className="flabel">Colegio</label>
              <input
                className="finput"
                value={form.school}
                onChange={update('school')}
                placeholder="Nombre del colegio"
              />
            </div>
            <div className="field">
              <label className="flabel">Ciudad</label>
              <input
                className="finput"
                value={form.city}
                onChange={update('city')}
                placeholder="Tu ciudad"
              />
            </div>
            <div className="field">
              <label className="flabel">Docente</label>
              <input
                className="finput"
                value={form.teacher}
                onChange={update('teacher')}
                placeholder="Nombre del docente"
              />
            </div>
            <div className="field">
              <label className="flabel">Correo (opcional)</label>
              <input
                className="finput"
                value={form.email}
                onChange={update('email')}
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <button className="btn-launch" onClick={launch}>
            🚀 ¡Comenzar aventura!
          </button>
          <div className="launch-note">Tus avances se guardan en este dispositivo</div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 2rem' }}>
        <div
          className="feat-btn"
          onClick={() => goScreen('estandares')}
          style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0 }}
        >
          <div className="feat-icon" style={{ background: '#fff', fontSize: '26px', border: '1.5px solid #C5BFEE', boxShadow: 'none' }}>
            🇨🇴
          </div>
          <div className="feat-info">
            <div className="feat-name">Estándares MEN</div>
            <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>
              Programa de 1° Colombia
            </div>
          </div>
          <div className="feat-arrow">→</div>
        </div>

        <div
          className="feat-btn"
          onClick={() => goScreen('problemas')}
          style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0 }}
        >
          <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)', color: '#fff' }}>
            🛒
          </div>
          <div className="feat-info" style={{ textAlign: 'left' }}>
            <div className="feat-name">Problemas Cotidianos</div>
            <div className="feat-meta">
              Conteo de monedas + compras + 4 operaciones
            </div>
          </div>
          <div className="feat-arrow">→</div>
        </div>
      </div>
    </div>
  );
}
