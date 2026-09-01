'use client';

import { useMemo, useState } from 'react';
import { useBook } from '../context/BookContext';
import { bookAudio } from '@/services/book-audio.service';
import ConfettiLayer from '../shared/ConfettiLayer';
import { authService } from '@/services/auth.service';
import type { McqExercise } from '@/types/book.types';

const TOTAL = 20;
const PASS = 14;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Examen Final (réplica de `openExamenFinal`): 20 preguntas tomadas de los
 * primeros 3 ejercicios de cada nivel. Aprobado con ≥14; otorga 300 monedas.
 */
export default function FinalExamScreen() {
  const { book, goScreen, grantReward } = useBook();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const questions = useMemo<McqExercise[]>(() => {
    if (!book) return [];
    const pool: McqExercise[] = [];
    book.units.forEach((u) =>
      u.topics.forEach((t) =>
        t.levels.forEach((lv) =>
          lv.exercises.slice(0, 3).forEach((e) => {
            if (e.type === 'mcq' && e.opts.length > 0) pool.push(e);
          })
        )
      )
    );
    return shuffle(pool).slice(0, TOTAL);
  }, [book]);

  const options = useMemo(() => (questions[idx] ? shuffle(questions[idx].opts) : []), [questions, idx]);

  if (!book) return null;
  if (questions.length === 0) {
    return (
      <div className="screen active" id="screen-examen">
        <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>
        <p style={{ textAlign: 'center', padding: '2rem' }}>No hay preguntas disponibles.</p>
      </div>
    );
  }

  const q = questions[idx];

  const pick = (opt: string) => {
    if (answered) return;
    const isOk = opt === q.ans;
    setAnswered(opt);
    if (isOk) {
      setCorrect((c) => c + 1);
      bookAudio.correct();
    } else {
      bookAudio.wrong();
    }
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx((i) => i + 1);
        setAnswered(null);
      } else {
        finish(isOk ? correct + 1 : correct);
      }
    }, 1100);
  };

  const finish = (finalCorrect: number) => {
    setCorrect(finalCorrect);
    setDone(true);
    const passed = finalCorrect >= PASS;
    if (passed && !rewarded) {
      grantReward(0, 300);
      setRewarded(true);
      bookAudio.levelUp();
    }
  };

  if (done) {
    const passed = correct >= PASS;
    const pct = Math.round((correct / questions.length) * 100);
    const isGrade2 = book?.slug !== 'libro-1ro';
    const rankText = pct >= 90 ? 'CON EXCELENCIA 🏆' : pct >= 70 ? 'SATISFACTORIAMENTE ⭐' : 'CON DEDICACIÓN 🌟';
    const studentName = authService.getCurrentUser()?.name || 'Cadete Fedor';
    const currentDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleDownloadCert = () => {
      const svgElement = document.getElementById('cert-svg-printable');
      if (!svgElement) return;
      const serializer = new XMLSerializer();
      const svgStr = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(svgElement);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-fedor-${studentName.replace(/\s+/g, '_')}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
      <div className="screen active" id="screen-examen">
        {passed && <ConfettiLayer pieces={120} />}
        <div className="exam-result" style={{ maxWidth: isGrade2 ? '780px' : '520px', margin: '0 auto' }}>
          <div style={{ fontSize: 64 }}>{passed ? '🎓' : '📊'}</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: passed ? '#16876A' : '#A30041', fontFamily: "'Baloo 2',sans-serif", margin: '.4rem 0' }}>
            {correct}/{questions.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--muted)', marginBottom: '0.8rem' }}>{pct}% de aciertos</div>
          <div className="exam-verdict" style={{ background: passed ? '#DCF5EE' : '#FBE4E9', color: passed ? '#074F3A' : '#7A1B00', border: `2px solid ${passed ? '#16876A' : '#A30041'}`, marginBottom: '1.2rem' }}>
            {passed ? '🏆 ¡Aprobado! Has demostrado dominio. +300 🪙' : '💪 Sigue practicando y vuelve a intentarlo.'}
          </div>

          {/* Certificado oficial para Grado 2 */}
          {isGrade2 && (
            <div className="my-4 p-2 bg-white rounded-2xl shadow-xl border-4 border-[#7B2FBE]">
              <svg
                id="cert-svg-printable"
                viewBox="0 0 800 600"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto rounded-xl bg-white"
              >
                <defs>
                  <linearGradient id="cBg" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FFF8E0" />
                    <stop offset="100%" stopColor="#F0EDFF" />
                  </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#cBg)" />
                <rect x="20" y="20" width="760" height="560" fill="none" stroke="#FFB800" strokeWidth="3" strokeDasharray="8,5" rx="10" />
                <text x="400" y="80" textAnchor="middle" fontSize="36" fontWeight="900" fill="#7B2FBE" fontFamily="'Baloo 2', sans-serif">🎓 CERTIFICADO 🎓</text>
                <text x="400" y="120" textAnchor="middle" fontSize="22" fontWeight="700" fill="#6C28B4">de Matemáticas de Fedor — 2° Primaria</text>
                <text x="400" y="180" textAnchor="middle" fontSize="18" fontWeight="600" fill="#1A0A3C">Se otorga el presente certificado a</text>
                <text x="400" y="240" textAnchor="middle" fontSize="40" fontWeight="900" fill="#7A3200" fontFamily="'Baloo 2', sans-serif">{studentName}</text>
                <text x="400" y="320" textAnchor="middle" fontSize="16" fill="#1A0A3C">por haber completado el Examen Final Integrador</text>
                <text x="400" y="355" textAnchor="middle" fontSize="20" fontWeight="900" fill="#16876A">{rankText}</text>
                <text x="400" y="405" textAnchor="middle" fontSize="18" fill="#1A0A3C">Resultado: <tspan fontWeight="900" fill="#7B2FBE">{correct} / {questions.length} ({pct}%)</tspan></text>
                <text x="400" y="490" textAnchor="middle" fontSize="14" fill="#666">{currentDate}</text>
                <text x="400" y="525" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3D1054" fontFamily="'Baloo 2', sans-serif">🚀 Matemáticas de Fedor 🚀</text>
                <text x="400" y="555" textAnchor="middle" fontSize="11" fill="#999">Sistema de evaluación integrado · Curriculum MEN Colombia</text>
              </svg>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
            {isGrade2 && (
              <>
                <button
                  type="button"
                  onClick={handleDownloadCert}
                  className="btn-primary"
                  style={{ flex: 1, minWidth: '160px', background: 'linear-gradient(135deg,#06A570,#16876A)' }}
                >
                  📥 Descargar SVG
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{ flex: 1, minWidth: '140px', background: 'linear-gradient(135deg,#FFB800,#FF8C2A)' }}
                >
                  🖨️ Imprimir
                </button>
              </>
            )}
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1, minWidth: '160px' }}
              onClick={() => goScreen('home')}
            >
              🏠 Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen active" id="screen-examen">
      <div className="back-row" onClick={() => goScreen('home')}>← Salir del examen</div>

      <div className="exam-head">📝 Examen Final · Pregunta {idx + 1}/{questions.length}</div>
      <div className="exam-progress"><div className="exam-progress-fill" style={{ width: `${(idx / questions.length) * 100}%` }} /></div>

      <div className="exam-q">{q.q}</div>

      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {options.map((o) => {
          const isAns = o === q.ans;
          const isPick = answered === o;
          const cls = answered ? (isAns ? 'exam-opt ok' : isPick ? 'exam-opt bad' : 'exam-opt') : 'exam-opt';
          return (
            <button key={o} className={cls} disabled={!!answered} onClick={() => pick(o)}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
