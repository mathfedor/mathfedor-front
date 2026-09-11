'use client';

import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useBook3, type StudentProfile3 } from '../context/Book3Context';
import Starfield from '@/components/book/shared/Starfield';
import { authService } from '@/services/auth.service';
import Swal from 'sweetalert2';

const AVATARS = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];

interface SetupScreen3roProps {
  onStartAdventure: (student: StudentProfile3) => void;
}

export default function SetupScreen3ro({ onStartAdventure }: SetupScreen3roProps) {
  const { student: initialStudent } = useBook3();
  const router = useRouter();

  const [avatar, setAvatar] = useState('🧑‍🚀');
  const [hasStudentData, setHasStudentData] = useState(true);
  const [form, setForm] = useState({
    name: '',
    school: '',
    city: '',
    teacher: '',
    email: '',
  });

  // Pre-cargar datos del estudiante desde el perfil configurado en BD
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const student = user.student;
    const studentComplete = Boolean(student && (student.name || student.institution || student.city));
    setHasStudentData(studentComplete);

    if (student) {
      setForm((prev) => ({
        ...prev,
        name: student.name || prev.name,
        school: student.institution || prev.school,
        city: student.city || prev.city,
        email: student.email || user.email || prev.email,
      }));
    }
  }, []);

  const update = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const showProfileIncompleteAlert = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¡Perfil incompleto!',
      html: `
        <p style="color:#555;margin-bottom:0.5rem">
          Para comenzar la aventura necesitas completar los datos de tu estudiante en tu perfil.
        </p>
        <p style="color:#888;font-size:13px">
          Ve a <strong>Mi Perfil</strong> y llena la información de nombre, ciudad y colegio.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: '📝 Ir a Mi Perfil',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7B2FBE',
      cancelButtonColor: '#aaa',
    });
    if (result.isConfirmed) {
      router.push('/dashboard/profile');
    }
  };

  const handleLaunch = async () => {
    if (!form.name.trim()) {
      await showProfileIncompleteAlert();
      return;
    }

    if (!hasStudentData) {
      await showProfileIncompleteAlert();
      return;
    }

    onStartAdventure({
      ...form,
      avatar,
    });
  };

  return (
    <div className="setup-screen-container">
      <div className="setup-wrap">
        {/* ═══ HERO BANNER (TOP) ═══ */}
        <div className="setup-hero">
          <Starfield count={40} />
          <div className="setup-planet" />
          <div className="setup-ring" />

          {/* Floating Astronaut Avatar Circle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', position: 'relative', zIndex: 1, paddingTop: '1.5rem' }}>
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: '50%',
                boxShadow: '0 0 0 4px rgba(245,197,24,.6),0 8px 32px rgba(0,0,0,.5)',
                animation: 'float 3s ease-in-out infinite',
                background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
              }}
            >
              <span>{avatar}</span>
            </div>
          </div>

          {/* Grade 3 Pill & Subtitles */}
          <div style={{ position: 'relative', zIndex: 2, margin: '0 auto .6rem', maxWidth: 560 }}>
            <div
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg,#F5C518,#FFA726)',
                color: '#2A1070',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                padding: '5px 16px',
                borderRadius: 999,
                boxShadow: '0 4px 14px rgba(0,0,0,.3)',
              }}
            >
              Libro Digital · Tercer Grado
            </div>
            <h1
              style={{
                margin: '.55rem 0 .2rem',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 30,
                lineHeight: 1.15,
                color: '#fff',
                textShadow: '0 3px 14px rgba(0,0,0,.5)',
              }}
            >
              LIBRO DIGITAL DE MATEMÁTICAS<br />
              <span style={{ color: '#F5C518' }}>3<sup style={{ fontSize: '.55em' }}>er</sup> GRADO</span>
            </h1>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: '#E8DFFF', opacity: 0.95 }}>
              Método Fedor · Educación Primaria
            </div>
          </div>

          <div className="setup-title">
            ¡Bienvenido a<br />
            <em>Matemáticas de Fedor!</em>
          </div>
          <div className="setup-sub">
            Libro digital interactivo de matemáticas para 3<sup>er</sup> grado
          </div>

          <div className="setup-badges">
            <span className="s-badge sb-purple">🎮 Gamificado</span>
            <span className="s-badge sb-teal">✅ MEN Colombia</span>
            <span className="s-badge sb-orange">🏆 5 Niveles</span>
            <span className="s-badge sb-blue">📊 Reporte Docente</span>
          </div>
        </div>

        {/* ═══ FORM BODY (BOTTOM - LIGHT THEME) ═══ */}
        <div className="setup-body">
          {/* Peach Alert Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg,#FEF0E6,#FFE2C8)',
              border: '1.5px solid #FBBF7A',
              borderRadius: 16,
              padding: '12px 16px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7A3200', lineHeight: 1.4 }}>
              Este libro es el <strong>complemento digital</strong> del método Fedor para 3° de primaria. Aprenderás Adición de 3 cifras, Sustracción, Multiplicación, División y Problemas SABER.
            </div>
          </div>

          {/* Avatar Selector */}
          <div style={{ fontSize: 12, fontWeight: 900, color: '#6C28B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
            Elige tu astronauta
          </div>
          <div className="avatar-pick" id="avatarPick">
            {AVATARS.map((a) => (
              <div
                key={a}
                className={`av-btn${a === avatar ? ' sel' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </div>
            ))}
          </div>

          {/* Form Fields */}
          <div className="field-grid">
            <div className="field field-full">
              <label className="flabel">Tu nombre</label>
              <input
                className="finput"
                id="f-name"
                value={form.name}
                onChange={update('name')}
                placeholder="Escribe tu nombre aquí"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label className="flabel">Colegio</label>
              <input
                className="finput"
                id="f-school"
                value={form.school}
                onChange={update('school')}
                placeholder="Nombre del colegio"
              />
            </div>
            <div className="field">
              <label className="flabel">Ciudad</label>
              <input
                className="finput"
                id="f-city"
                value={form.city}
                onChange={update('city')}
                placeholder="Tu ciudad"
              />
            </div>
            <div className="field">
              <label className="flabel">Docente</label>
              <input
                className="finput"
                id="f-teacher"
                value={form.teacher}
                onChange={update('teacher')}
                placeholder="Nombre del docente"
              />
            </div>
            <div className="field">
              <label className="flabel">Correo (opcional)</label>
              <input
                className="finput"
                id="f-email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          {/* Big Orange Action Button */}
          <button type="button" className="btn-launch" onClick={handleLaunch}>
            🚀 ¡Comenzar aventura!
          </button>
          <div className="launch-note">
            Tus avances se guardan por cada nivel
          </div>
        </div>
      </div>

      {/* Scoped CSS to ensure 100% fidelity with the reference HTML */}
      <style jsx>{`
        .setup-screen-container {
          width: 100%;
          background: #F0EDFF;
          font-family: 'Nunito', sans-serif;
          color: #180D38;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1.25rem 1rem 5rem;
          box-sizing: border-box;
          user-select: none;
        }

        .setup-wrap {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1.5px solid #DDD8F5;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(108, 40, 180, 0.18);
        }

        .setup-hero {
          background: linear-gradient(160deg, #140830 0%, #2A0F6A 55%, #1A4030 100%);
          padding: 3.5rem 1.5rem 2.25rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .setup-planet {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle at 40% 35%, #E8650A, #8B3500);
          border-radius: 50%;
          opacity: 0.18;
          pointer-events: none;
        }

        .setup-ring {
          position: absolute;
          bottom: 20px;
          right: -20px;
          width: 200px;
          height: 60px;
          border: 8px solid rgba(232, 101, 10, 0.12);
          border-radius: 50%;
          transform: rotate(-20deg);
          pointer-events: none;
        }

        .setup-title {
          font-family: 'Baloo 2', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #fff;
          position: relative;
          z-index: 1;
          margin-bottom: 4px;
        }

        .setup-title em {
          color: #FF8C2A;
          font-style: normal;
        }

        .setup-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 1;
        }

        .setup-badges {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 14px;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
        }

        .s-badge {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1.5px solid;
        }

        .sb-purple {
          background: rgba(108, 40, 180, 0.3);
          color: #C5BFEE;
          border-color: rgba(108, 40, 180, 0.5);
        }

        .sb-teal {
          background: rgba(22, 135, 106, 0.3);
          color: #7DE5CC;
          border-color: rgba(22, 135, 106, 0.5);
        }

        .sb-orange {
          background: rgba(232, 101, 10, 0.3);
          color: #FFBA87;
          border-color: rgba(232, 101, 10, 0.5);
        }

        .sb-blue {
          background: rgba(26, 108, 180, 0.3);
          color: #87C4FF;
          border-color: rgba(26, 108, 180, 0.5);
        }

        .setup-body {
          padding: 2rem 1.75rem;
          background: #FFFFFF;
        }

        .avatar-pick {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 1.5rem;
        }

        .av-btn {
          font-size: 28px;
          padding: 8px;
          background: #F7F5FF;
          border: 2.5px solid #DDD8F5;
          border-radius: 16px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          user-select: none;
        }

        .av-btn.sel {
          border-color: #6C28B4;
          background: #EEEDFE;
          transform: scale(1.08);
          box-shadow: 0 0 0 4px rgba(108, 40, 180, 0.15);
        }

        .av-btn:hover {
          transform: scale(1.06);
          border-color: #9B5CE5;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 1.5rem;
        }

        .field-full {
          grid-column: 1 / -1;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .flabel {
          font-size: 10px;
          font-weight: 900;
          color: #6C28B4;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .finput {
          padding: 11px 14px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          border: 2px solid #DDD8F5;
          border-radius: 16px;
          background: #F7F5FF;
          color: #180D38;
          outline: none;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .finput::placeholder {
          color: #9B94B8;
        }

        .finput:focus {
          border-color: #6C28B4;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(108, 40, 180, 0.1);
        }

        .btn-launch {
          width: 100%;
          padding: 15px;
          font-size: 16px;
          font-weight: 900;
          background: linear-gradient(135deg, #E8650A, #FF8C2A);
          color: #fff;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.03em;
          box-shadow: 0 6px 20px rgba(232, 101, 10, 0.4);
          transition: all 0.2s;
        }

        .btn-launch:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(232, 101, 10, 0.45);
        }

        .btn-launch:active {
          transform: scale(0.98);
        }

        .launch-note {
          text-align: center;
          font-size: 12px;
          color: #7A7299;
          font-weight: 700;
          margin-top: 10px;
        }

        @media (max-width: 640px) {
          .field-grid {
            grid-template-columns: 1fr;
          }
          .setup-body {
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}

