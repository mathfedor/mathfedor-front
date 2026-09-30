'use client';

import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useBook4, type StudentProfile4 } from '../context/Book4Context';
import Starfield from '@/components/book/shared/Starfield';
import { authService } from '@/services/auth.service';
import Swal from 'sweetalert2';

const AVATARS = ['🧑‍🚀', '👩‍🚀', '🦁', '🐯', '🦊', '🐸', '🦋', '🦄', '🐉', '🤖'];

interface SetupScreen4toProps {
  onStartAdventure: (student: StudentProfile4) => void;
}

export default function SetupScreen4to({ onStartAdventure }: SetupScreen4toProps) {
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

  // Pre-cargar datos del estudiante desde el perfil configurado en BD / localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const student = user.student;
    const studentComplete = Boolean(student && (student.name || student.institution || student.city));
    setHasStudentData(studentComplete);

    if (student) {
      setForm((prev) => ({
        ...prev,
        name: student.name || user.name || prev.name,
        school: student.institution || prev.school,
        city: student.city || prev.city,
        email: student.email || user.email || prev.email,
      }));
    } else if (user.name) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
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
          Para comenzar la aventura espacial de 4° necesitas completar los datos de tu estudiante en tu perfil.
        </p>
        <p style="color:#888;font-size:13px">
          Ve a <strong>Mi Perfil</strong> y llena la información de nombre, ciudad y colegio.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: '📝 Ir a Mi Perfil',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E8650A',
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
                background: 'linear-gradient(135deg,#E8650A,#F5C518)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
              }}
            >
              <span>{avatar}</span>
            </div>
          </div>

          {/* Grade 4 Pill & Subtitles */}
          <div style={{ position: 'relative', zIndex: 2, margin: '0 auto .6rem', maxWidth: 880 }}>
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
              Libro Digital · Cuarto Grado
            </div>
            <h1
              style={{
                margin: '.55rem 0 .2rem',
                fontFamily: "'Baloo 2', Nunito, sans-serif",
                fontWeight: 900,
                fontSize: 32,
                lineHeight: 1.15,
                color: '#fff',
                textShadow: '0 3px 14px rgba(0,0,0,.5)',
              }}
            >
              LIBRO DIGITAL DE MATEMÁTICAS<br />
              <span style={{ color: '#F5C518' }}>4<sup style={{ fontSize: '.55em' }}>to</sup> GRADO</span>
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
            El mejor libro interactivo de matemáticas para 4° grado
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
              background: 'linear-gradient(135deg, #FEF0E6, #FFE2C8)',
              border: '1.5px solid #FBBF7A',
              borderRadius: 16,
              padding: '12px 18px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>💡</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#7A3200', lineHeight: 1.4 }}>
              Este libro es el <strong>complemento digital</strong> del método Fedor para 4°. Úsalo para practicar tus misiones y dominar las operaciones matemáticas.
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 900, color: '#3D1468', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Elige tu astronauta de 4°
          </div>

          {/* Avatar Selector Grid */}
          <div className="avatar-pick">
            {AVATARS.map((av) => (
              <div
                key={av}
                className={`av-btn ${avatar === av ? 'sel' : ''}`}
                onClick={() => setAvatar(av)}
              >
                {av}
              </div>
            ))}
          </div>

          {/* Input Fields */}
          <div className="field-grid">
            <div className="field field-full">
              <label className="flabel">Tu nombre *</label>
              <input
                className="finput"
                id="f-name"
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

          <button
            type="button"
            className="btn-launch"
            onClick={handleLaunch}
          >
            🚀 ¡Comenzar aventura!
          </button>
          <div className="launch-note">
            Tus avances se guardan automáticamente en este dispositivo
          </div>
        </div>
      </div>

      <style>{`
        .setup-screen-container {
          padding: 1.5rem 1rem 4rem;
          display: flex;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        .setup-wrap {
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          border-radius: 28px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 20px 50px rgba(42, 15, 96, 0.22);
          border: 3.5px solid #f5c518;
        }

        .setup-hero {
          background: linear-gradient(160deg, #1a0848, #2a0f60 55%, #4a154b);
          padding: 3rem 2.5rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          color: #ffffff;
        }

        .setup-planet {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ff8c2a, #e8650a 60%, #5c21a6);
          opacity: 0.35;
          pointer-events: none;
        }

        .setup-ring {
          position: absolute;
          top: -20px;
          right: -60px;
          width: 220px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid rgba(255, 224, 102, 0.4);
          transform: rotate(-25deg);
          pointer-events: none;
        }

        .setup-title {
          font-family: 'Baloo 2', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .setup-title em {
          color: #ffe066;
          font-style: normal;
        }

        .setup-sub {
          font-size: 14px;
          font-weight: 700;
          color: #c5bfee;
          margin-bottom: 1.2rem;
        }

        .setup-badges {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .s-badge {
          font-size: 12px;
          font-weight: 900;
          padding: 5px 14px;
          border-radius: 12px;
        }

        .sb-purple {
          background: rgba(139, 62, 219, 0.3);
          color: #ffe066;
          border: 1px solid rgba(255, 224, 102, 0.4);
        }

        .sb-teal {
          background: rgba(36, 196, 150, 0.25);
          color: #6ee7b7;
          border: 1px solid rgba(110, 231, 183, 0.4);
        }

        .sb-orange {
          background: rgba(245, 165, 36, 0.25);
          color: #fdba74;
          border: 1px solid rgba(253, 186, 116, 0.4);
        }

        .sb-blue {
          background: rgba(56, 189, 248, 0.25);
          color: #bae6fd;
          border: 1px solid rgba(186, 230, 253, 0.4);
        }

        .setup-body {
          padding: 2.5rem 3.5rem 3rem;
          background: #ffffff;
          box-sizing: border-box;
        }

        .avatar-pick {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 12px;
          margin-bottom: 2rem;
        }

        .av-btn {
          height: 58px;
          border-radius: 16px;
          border: 2px solid #eee8fb;
          background: #fbf9ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .av-btn:hover {
          transform: translateY(-2px);
          border-color: #8b3edb;
          background: #f3ecff;
        }

        .av-btn.sel {
          border-color: #f5c518;
          background: #fef0e6;
          box-shadow: 0 4px 14px rgba(245, 197, 24, 0.4);
          transform: scale(1.08);
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 2rem;
        }

        .field-full {
          grid-column: span 2;
        }

        @media (max-width: 900px) {
          .setup-body {
            padding: 2rem 2rem 2.5rem;
          }
          .avatar-pick {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 640px) {
          .setup-body {
            padding: 1.5rem 1.2rem 2rem;
          }
          .field-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .field-full {
            grid-column: 1;
          }
        }

        .flabel {
          display: block;
          font-size: 11px;
          font-weight: 900;
          color: #3d1468;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .finput {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 14px;
          border-radius: 12px;
          border: 2px solid #ddd8f5;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1a1033;
          outline: none;
          transition: border-color 0.15s;
        }

        .finput:focus {
          border-color: #8b3edb;
          background: #faf7ff;
        }

        .btn-launch {
          width: 100%;
          padding: 14px;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg, #f5c518, #e8650a);
          color: #ffffff;
          font-family: 'Baloo 2', sans-serif;
          font-size: 20px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(232, 101, 10, 0.45);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-launch:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(232, 101, 10, 0.55);
        }

        .launch-note {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: #7a7299;
          margin-top: 8px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @media (max-width: 600px) {
          .setup-body {
            padding: 1.2rem;
          }
          .field-grid {
            grid-template-columns: 1fr;
          }
          .field-full {
            grid-column: span 1;
          }
          .avatar-pick {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
