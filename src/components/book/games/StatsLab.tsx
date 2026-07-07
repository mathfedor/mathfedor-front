'use client';

import { useMemo, useState, useEffect } from 'react';
import { useBook } from '../context/BookContext';

interface Row {
  id: number;
  label: string;
  value: number;
  color: string;
}

const DEFAULT_COLORS = ['#FF1D4E', '#F5C518', '#16876A', '#3AA0FF', '#9B5CFF', '#FF8C2A', '#24C496', '#D4286A'];

const START: Row[] = [
  { id: 1, label: 'Rojo', value: 8, color: '#FF1D4E' },
  { id: 2, label: 'Amarillo', value: 5, color: '#F5C518' },
  { id: 3, label: 'Verde', value: 3, color: '#16876A' },
  { id: 4, label: 'Azul', value: 6, color: '#3AA0FF' },
];

type ChartType = 'bar' | 'pie' | 'line' | '3d';

interface QuizQuestion {
  q: string;
  opts: string[];
  ans: string;
}

const STYLE_SHEET = `
.stats-lab-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 4, 30, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99990;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
}
.stats-lab-card {
  background: #fff;
  border-radius: 22px;
  max-width: 920px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
}
.stats-lab-header {
  background: linear-gradient(135deg, #16876A, #24C496);
  color: #fff;
  padding: 1.2rem 1.4rem;
  border-radius: 22px 22px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Baloo 2', sans-serif;
  font-weight: 900;
  font-size: 18px;
}
.stats-lab-header-close {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.stats-lab-header-close:hover {
  background: rgba(255, 255, 255, 0.5);
}
.stats-lab-body {
  padding: 1.2rem 1.4rem;
  overflow-y: auto;
}
.stats-lab-tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
}
.stats-lab-tab-btn {
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  min-height: 44px;
  font-size: 14px;
  transition: transform 0.15s, filter 0.15s;
}
.stats-lab-tab-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
.stats-lab-tip-box {
  font-size: 13px;
  color: #666;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  background: #FFF8DC;
  padding: 10px;
  border-radius: 10px;
  border-left: 4px solid #F5C518;
}
.stats-lab-title-box {
  background: #FFF8DC;
  border: 2px solid #F5C518;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 900;
  font-size: 15px;
  color: #5A3A00;
  font-family: 'Nunito', sans-serif;
  width: 100%;
  margin-bottom: 0.8rem;
  text-align: center;
}
.stats-lab-title-box:focus {
  outline: none;
  border-color: #d97706;
}
.stats-lab-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stats-lab-row {
  display: grid;
  grid-template-columns: 38px 1fr 110px 38px;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}
.stats-lab-color-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1.5px #C5BFEE;
  cursor: pointer;
  justify-self: center;
  transition: transform 0.15s;
}
.stats-lab-color-dot:hover {
  transform: scale(1.1);
}
.stats-lab-label-input {
  padding: 8px 12px;
  font-size: 15px;
  font-weight: 800;
  border: 2px solid #C5BFEE;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  background: #fff;
  color: #000;
  width: 100%;
}
.stats-lab-label-input:focus {
  outline: none;
  border-color: #16876A;
  box-shadow: 0 0 0 3px rgba(22, 135, 106, 0.2);
}
.stats-lab-value-input {
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 900;
  border: 2px solid #C5BFEE;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  text-align: center;
  background: #fff;
  color: #16876A;
  width: 100%;
}
.stats-lab-value-input:focus {
  outline: none;
  border-color: #16876A;
  box-shadow: 0 0 0 3px rgba(22, 135, 106, 0.2);
}
.stats-lab-delete-btn {
  background: #FBE4E9;
  color: #A30041;
  border: 2px solid #A30041;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-weight: 900;
  font-size: 16px;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.2s, transform 0.15s;
}
.stats-lab-delete-btn:hover:not(:disabled) {
  background: #FDA4AF;
  transform: scale(1.05);
}
.stats-lab-delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.stats-lab-toolbar {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
.stats-lab-tool-btn {
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 900;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  color: #fff;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.15s, box-shadow 0.15s;
}
.stats-lab-tool-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.stats-lab-tool-btn.add {
  background: linear-gradient(135deg, #16876A, #24C496);
}
.stats-lab-tool-btn.rnd {
  background: linear-gradient(135deg, #F5C518, #FF8C2A);
  color: #3D1054;
}
.stats-lab-tool-btn.clr {
  background: linear-gradient(135deg, #A30041, #FF1D4E);
}
.stats-lab-tool-btn.quiz {
  background: linear-gradient(135deg, #6C28B4, #9B5CFF);
}
.stats-lab-chart-container {
  background: linear-gradient(135deg, #F0FFF7, #fff);
  border: 3px solid #16876A;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  box-shadow: 0 4px 14px rgba(22, 135, 106, 0.18);
}
.stats-lab-summary {
  background: #F0EDFF;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  margin-top: 1rem;
  font-size: 13px;
  font-weight: 800;
  color: #3D1054;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.stats-lab-quiz-question {
  background: #FFF8DC;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid #FFC58A;
  font-weight: 800;
  font-size: 15px;
  color: #000;
  margin-bottom: 1rem;
}
.stats-lab-quiz-options {
  display: grid;
  gap: 8px;
}
.stats-lab-quiz-opt-btn {
  padding: 12px;
  font-weight: 900;
  font-size: 15px;
  border: 2.5px solid #C5BFEE;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  min-height: 44px;
  color: #000;
  transition: all 0.2s;
}
.stats-lab-quiz-opt-btn:hover:not(:disabled) {
  background: #F3E8FF;
  border-color: #9B5CFF;
}
.stats-lab-empty {
  color: #666;
  padding: 2rem;
  font-weight: bold;
}
`;

export default function StatsLab({ onClose }: { onClose: () => void }) {
  const { grantReward } = useBook();

  // --- Persistent State ---
  const [title, setTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const v = localStorage.getItem('fedor1_stats_lab');
        if (v) return JSON.parse(v).title;
      } catch (e) {}
    }
    return 'Color preferido por mis amigos';
  });

  const [rows, setRows] = useState<Row[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const v = localStorage.getItem('fedor1_stats_lab');
        if (v) return JSON.parse(v).rows;
      } catch (e) {}
    }
    return START;
  });

  const [type, setType] = useState<ChartType>('bar');

  // --- Quiz States ---
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizSelectedOpt, setQuizSelectedOpt] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'ok' | 'bad' | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fedor1_stats_lab', JSON.stringify({ title, rows }));
    } catch (e) {}
  }, [title, rows]);

  // Statistics values
  const total = useMemo(() => rows.reduce((s, r) => s + (r.value || 0), 0), [rows]);

  const { maxRow, minRow, maxVal, minVal, average } = useMemo(() => {
    const values = rows.map((r) => r.value || 0);
    if (!values.length) {
      return { maxRow: null, minRow: null, maxVal: 0, minVal: 0, average: '0' };
    }
    const maxV = Math.max(...values);
    const minV = Math.min(...values);
    const mxR = rows[values.indexOf(maxV)];
    const mnR = rows[values.indexOf(minV)];
    const avg = rows.length > 0 ? (total / rows.length).toFixed(1) : '0';
    return { maxRow: mxR, minRow: mnR, maxVal: maxV, minVal: minV, average: avg };
  }, [rows, total]);

  // Row manipulators
  const setVal = (id: number, val: number) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, value: Math.max(0, Math.min(100, val)) } : r)));
  };

  const setLabel = (id: number, label: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, label } : r)));
  };

  const cycleColor = (index: number) => {
    setRows((rs) =>
      rs.map((r, idx) => {
        if (idx === index) {
          const colorIdx = DEFAULT_COLORS.indexOf(r.color);
          const nextColor = DEFAULT_COLORS[(colorIdx + 1) % DEFAULT_COLORS.length];
          return { ...r, color: nextColor };
        }
        return r;
      })
    );
  };

  const addRow = () => {
    if (rows.length >= 8) return;
    const nextColor = DEFAULT_COLORS[rows.length % DEFAULT_COLORS.length];
    setRows((rs) => [...rs, { id: Date.now() + Math.random(), label: 'Nuevo', value: 1, color: nextColor }]);
  };

  const removeRow = (id: number) => {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  };

  const randomizeValues = () => {
    setRows((rs) => rs.map((r) => ({ ...r, value: Math.floor(Math.random() * 20) + 1 })));
  };

  const clearData = () => {
    if (window.confirm('¿Borrar todos los datos?')) {
      setRows([{ id: Date.now(), label: 'A', value: 0, color: DEFAULT_COLORS[0] }]);
    }
  };

  // Dynamic Quiz Generator
  const generateQuiz = () => {
    const validRows = rows.filter((r) => r.label.trim() && r.value > 0);
    if (validRows.length < 2) {
      alert('Necesitas al menos 2 filas con datos para generar preguntas.');
      return;
    }

    const values = validRows.map((r) => r.value);
    const mxVal = Math.max(...values);
    const mnVal = Math.min(...values);
    const mxRow = validRows[values.indexOf(mxVal)];
    const mnRow = validRows[values.indexOf(mnVal)];
    const tot = values.reduce((a, b) => a + b, 0);
    const sumTopTwo = (validRows[0].value || 0) + (validRows[1].value || 0);

    const questions: QuizQuestion[] = [];

    // Q1: Highest
    questions.push({
      q: `Mirando tu gráfico "${title}", ¿cuál tiene la barra más alta / el valor más alto?`,
      opts: validRows.slice(0, 4).map((r) => r.label),
      ans: mxRow.label,
    });

    // Q2: Max value count
    questions.push({
      q: `¿Cuántos votos o datos tiene "${mxRow.label}"?`,
      opts: [String(mxVal), String(mxVal + 1), String(Math.max(0, mxVal - 1)), String(mxVal + 2)],
      ans: String(mxVal),
    });

    // Q3: Lowest
    questions.push({
      q: `¿Cuál tuvo el valor más BAJO en tu gráfico?`,
      opts: validRows.slice(0, 4).map((r) => r.label),
      ans: mnRow.label,
    });

    // Q4: Total
    questions.push({
      q: `¿Cuál es el TOTAL si sumas todos los valores del gráfico?`,
      opts: [String(tot), String(tot + 2), String(Math.max(0, tot - 3)), String(tot + 1)],
      ans: String(tot),
    });

    // Q5: Sum of top 2
    if (validRows.length >= 2) {
      questions.push({
        q: `¿Cuánto suman "${validRows[0].label}" y "${validRows[1].label}" juntos?`,
        opts: [String(sumTopTwo), String(sumTopTwo + 1), String(Math.max(0, sumTopTwo - 1)), String(validRows[0].value)],
        ans: String(sumTopTwo),
      });
    }

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizCorrect(0);
    setQuizFinished(false);
    setQuizSelectedOpt(null);
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (opt: string) => {
    setQuizSelectedOpt(opt);
    const currentQ = quizQuestions![quizIndex];
    const isCorrect = opt === currentQ.ans;

    if (isCorrect) {
      setQuizFeedback('ok');
      setQuizCorrect((prev) => prev + 1);
    } else {
      setQuizFeedback('bad');
    }

    setTimeout(() => {
      setQuizFeedback(null);
      setQuizSelectedOpt(null);
      if (quizIndex + 1 < quizQuestions!.length) {
        setQuizIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
        // Award gamification coins
        const finalCorrect = quizCorrect + (isCorrect ? 1 : 0);
        const passed = finalCorrect >= 3;
        const coins = passed ? 60 : 20;
        grantReward(0, coins);

        if (passed && typeof window !== 'undefined') {
          const anyWin = window as any;
          if (typeof anyWin.kjConfetti === 'function') {
            anyWin.kjConfetti(60);
          } else if (typeof anyWin.confetti === 'function') {
            anyWin.confetti();
          }
        }
      }
    }, 1000);
  };

  // --- SVG Renderers ---
  const renderBigBarChart = () => {
    if (!rows || !rows.length) return <div className="stats-lab-empty">Agrega datos para ver el gráfico</div>;
    const values = rows.map((r) => r.value || 0);
    const maxV = Math.max(...values, 1);
    const W = 480;
    const H = 240;
    const barW = (W - 80) / rows.length - 10;

    return (
      <svg viewBox={`0 0 ${W} ${H + 10}`} width="100%" height="auto" style={{ maxWidth: W, margin: '0 auto', display: 'block' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="15" fontWeight="900" fill="#16876A" fontFamily="'Baloo 2', sans-serif">
          {title || 'Mi gráfico'}
        </text>
        <line x1={50} y1={H - 40} x2={W - 10} y2={H - 40} stroke="#444" strokeWidth={2} />
        <line x1={50} y1={20} x2={50} y2={H - 40} stroke="#444" strokeWidth={2} />

        {/* Y ticks */}
        {Array.from({ length: 5 }).map((_, t) => {
          const v = Math.round((maxV * t) / 4);
          const ty = H - 40 - (t / 4) * (H - 70);
          return (
            <g key={t}>
              <line x1={45} y1={ty} x2={50} y2={ty} stroke="#888" strokeWidth={1.5} />
              <text x={40} y={ty + 4} textAnchor="end" fontSize="10" fontWeight="700" fill="#666" fontFamily="monospace">
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {rows.map((r, i) => {
          const h = maxV > 0 ? Math.round((r.value / maxV) * (H - 70)) : 0;
          const x = 50 + i * (barW + 10);
          const y = H - 40 - h;
          const color = r.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

          return (
            <g key={r.id}>
              <rect x={x} y={y} width={barW} height={h} fill={color} stroke="#000" strokeWidth="1.5" rx="4" />
              <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="13" fontWeight="900" fill="#1A0A3C" fontFamily="Nunito, sans-serif">
                {r.value}
              </text>
              <text x={x + barW / 2} y={H - 15} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1A0A3C" fontFamily="Nunito, sans-serif">
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    if (!rows || !rows.length) return <div className="stats-lab-empty">Sin datos</div>;
    const cx = 160;
    const cy = 160;
    const r = 110;
    if (total <= 0) return <div className="stats-lab-empty">Suma de datos = 0</div>;

    let angle = -Math.PI / 2;
    const slices: React.ReactNode[] = [];
    const legends: React.ReactNode[] = [];

    rows.forEach((d, i) => {
      const v = d.value || 0;
      if (v <= 0) return;
      const pct = v / total;
      const sweep = pct * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle + sweep);
      const y2 = cy + r * Math.sin(angle + sweep);
      const large = sweep > Math.PI ? 1 : 0;
      const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

      slices.push(
        <path
          key={`slice-${d.id}`}
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
      );

      const labAngle = angle + sweep / 2;
      const lx = cx + (r * 0.65) * Math.cos(labAngle);
      const ly = cy + (r * 0.65) * Math.sin(labAngle);

      slices.push(
        <text
          key={`pct-${d.id}`}
          x={lx}
          y={ly}
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fill="#fff"
          fontFamily="'Baloo 2', sans-serif"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {Math.round(pct * 100)}%
        </text>
      );

      legends.push(
        <div key={`legend-${d.id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: color, border: '2px solid #1A0A3C' }} />
          <span style={{ fontWeight: 800, fontSize: 13, color: '#1A0A3C' }}>
            {d.label} = {v}
          </span>
        </div>
      );

      angle += sweep;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <svg viewBox="0 0 320 340" width="100%" height="auto" style={{ maxWidth: 340, margin: '0 auto', display: 'block' }}>
          <text x={160} y={22} textAnchor="middle" fontSize="14" fontWeight="900" fill="#6C28B4" fontFamily="'Baloo 2', sans-serif">
            {title || 'Gráfico'}
          </text>
          <circle cx={160} cy={160} r={115} fill="#fff" stroke="#1A0A3C" strokeWidth="1.5" />
          {slices}
          <circle cx={160} cy={160} r={32} fill="#fff" stroke="#1A0A3C" strokeWidth="2" />
          <text x={160} y={166} textAnchor="middle" fontSize="13" fontWeight="900" fill="#1A0A3C">
            Total {total}
          </text>
        </svg>
        <div style={{ marginTop: '0.6rem', padding: '0.5rem', background: '#F8F5FF', borderRadius: 8, textAlign: 'left', width: '100%' }}>
          {legends}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    if (!rows || rows.length < 2) return <div className="stats-lab-empty">Necesitas al menos 2 datos</div>;
    const values = rows.map((r) => r.value || 0);
    const maxV = Math.max(...values, 1);
    const W = 480;
    const H = 240;
    const stepX = (W - 70) / (rows.length - 1);

    let pts = '';
    const circles: React.ReactNode[] = [];
    const labels: React.ReactNode[] = [];

    rows.forEach((d, i) => {
      const x = 45 + i * stepX;
      const y = H - 40 - ((d.value || 0) / maxV) * (H - 70);
      pts += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;

      circles.push(
        <g key={`circle-${d.id}`}>
          <circle cx={x} cy={y} r={6} fill={d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} stroke="#fff" strokeWidth="2.5" />
          <text x={x} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="900" fill="#1A0A3C">
            {d.value}
          </text>
        </g>
      );

      labels.push(
        <text key={`label-${d.id}`} x={x} y={H - 15} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1A0A3C">
          {d.label}
        </text>
      );
    });

    return (
      <svg viewBox={`0 0 ${W} ${H + 10}`} width="100%" height="auto" style={{ maxWidth: W, margin: '0 auto', display: 'block' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="15" fontWeight="900" fill="#16876A" fontFamily="'Baloo 2', sans-serif">
          {title || 'Línea'}
        </text>
        <line x1={45} y1={H - 40} x2={W - 10} y2={H - 40} stroke="#444" strokeWidth={2} />
        <line x1={45} y1={20} x2={45} y2={H - 40} stroke="#444" strokeWidth={2} />

        {/* Y ticks */}
        {Array.from({ length: 5 }).map((_, t) => {
          const v = Math.round((maxV * t) / 4);
          const ty = H - 40 - (t / 4) * (H - 70);
          return (
            <g key={t}>
              <line x1={40} y1={ty} x2={45} y2={ty} stroke="#888" strokeWidth={1.5} />
              <text x={36} y={ty + 4} textAnchor="end" fontSize="9" fontWeight="700" fill="#666" fontFamily="monospace">
                {v}
              </text>
            </g>
          );
        })}

        <path d={pts} stroke="url(#linG)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="linG">
            <stop offset="0%" stopColor="#FF1D4E" />
            <stop offset="50%" stopColor="#F5C518" />
            <stop offset="100%" stopColor="#16876A" />
          </linearGradient>
        </defs>
        {circles}
        {labels}
      </svg>
    );
  };

  const render3DBars = () => {
    if (!rows || !rows.length) return <div className="stats-lab-empty">Sin datos</div>;
    const values = rows.map((r) => r.value || 0);
    const maxV = Math.max(...values, 1);
    const W = 520;
    const H = 260;
    const barW = 40;
    const depth = 20;
    const gap = 30;
    const startX = 60;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ maxWidth: W, margin: '0 auto', display: 'block' }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="15" fontWeight="900" fill="#6C28B4" fontFamily="'Baloo 2', sans-serif">
          {title || 'Gráfico 3D'}
        </text>
        <line x1={40} y1={H - 50} x2={W - 10} y2={H - 50} stroke="#444" strokeWidth={2} />
        <line x1={40} y1={30} x2={40} y2={H - 50} stroke="#444" strokeWidth={2} />

        {rows.map((d, i) => {
          const h = ((d.value || 0) / maxV) * (H - 90);
          const x = startX + i * (barW + gap);
          const y = H - 50 - h;
          const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

          return (
            <g key={d.id}>
              {/* Front face */}
              <rect x={x} y={y} width={barW} height={h} fill={color} stroke="#1A0A3C" strokeWidth="1.5" />
              {/* Top face */}
              <polygon
                points={`${x},${y} ${x + depth},${y - depth} ${x + barW + depth},${y - depth} ${x + barW},${y}`}
                fill={color}
                stroke="#1A0A3C"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {/* Right side */}
              <polygon
                points={`${x + barW},${y} ${x + barW + depth},${y - depth} ${x + barW + depth},${H - 50 - depth} ${x + barW},${H - 50}`}
                fill={color}
                stroke="#1A0A3C"
                strokeWidth="1.5"
                opacity="0.65"
              />
              {/* Value */}
              <text x={x + barW / 2 + depth / 2} y={y - depth - 6} textAnchor="middle" fontSize="13" fontWeight="900" fill="#1A0A3C">
                {d.value}
              </text>
              {/* Label */}
              <text x={x + barW / 2} y={H - 30} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1A0A3C">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderActiveChart = () => {
    if (type === 'pie') return renderPieChart();
    if (type === 'line') return renderLineChart();
    if (type === '3d') return render3DBars();
    return renderBigBarChart();
  };

  // --- Render Layout ---
  return (
    <div className="stats-lab-overlay" onClick={onClose}>
      <style>{STYLE_SHEET}</style>

      {quizQuestions === null ? (
        // --- EDITOR MODE ---
        <div className="stats-lab-card" onClick={(e) => e.stopPropagation()}>
          <div className="stats-lab-header">
            <span>🧪 Laboratorio de Estadística</span>
            <button className="stats-lab-header-close" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          </div>

          <div className="stats-lab-body">
            {/* Tabs */}
            <div className="stats-lab-tab-bar">
              <button
                type="button"
                className="stats-lab-tab-btn"
                style={{
                  background: type === 'bar' ? 'linear-gradient(135deg,#16876A,#24C496)' : '#DCF5EE',
                  color: type === 'bar' ? '#fff' : '#16876A',
                }}
                onClick={() => setType('bar')}
              >
                📊 Barras
              </button>
              <button
                type="button"
                className="stats-lab-tab-btn"
                style={{
                  background: type === 'pie' ? 'linear-gradient(135deg,#6C28B4,#9B5CFF)' : '#EEEDFE',
                  color: type === 'pie' ? '#fff' : '#6C28B4',
                }}
                onClick={() => setType('pie')}
              >
                🍰 Pastel
              </button>
              <button
                type="button"
                className="stats-lab-tab-btn"
                style={{
                  background: type === 'line' ? 'linear-gradient(135deg,#E8650A,#FF8C2A)' : '#FEF3E8',
                  color: type === 'line' ? '#fff' : '#7A3200',
                }}
                onClick={() => setType('line')}
              >
                📈 Línea
              </button>
              <button
                type="button"
                className="stats-lab-tab-btn"
                style={{
                  background: type === '3d' ? 'linear-gradient(135deg,#9B0066,#FF1D4E)' : '#FFE6F2',
                  color: type === '3d' ? '#fff' : '#9B0066',
                }}
                onClick={() => setType('3d')}
              >
                🎲 3D
              </button>
            </div>

            {/* Tip Box */}
            <div className="stats-lab-tip-box">
              💡 Escribe tus propios datos en la tabla y mira cómo el gráfico cambia al instante. Puedes cambiar los nombres, los números y los colores. ¡Después prueba el botón "Generar preguntas"!
            </div>

            {/* Title Input */}
            <input
              type="text"
              className="stats-lab-title-box"
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de tu encuesta o tabla"
            />

            {/* Rows list */}
            <div className="stats-lab-rows">
              {rows.map((r, i) => (
                <div className="stats-lab-row" key={r.id}>
                  <div
                    className="stats-lab-color-dot"
                    style={{ backgroundColor: r.color }}
                    onClick={() => cycleColor(i)}
                    title="Click para cambiar color"
                  />
                  <input
                    type="text"
                    className="stats-lab-label-input"
                    maxLength={20}
                    value={r.label}
                    onChange={(e) => setLabel(r.id, e.target.value)}
                    placeholder="Etiqueta"
                  />
                  <input
                    type="number"
                    className="stats-lab-value-input"
                    min={0}
                    max={100}
                    value={r.value}
                    onChange={(e) => setVal(r.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <button
                    type="button"
                    className="stats-lab-delete-btn"
                    onClick={() => removeRow(r.id)}
                    disabled={rows.length <= 1}
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="stats-lab-toolbar">
              <button type="button" className="stats-lab-tool-btn add" onClick={addRow} disabled={rows.length >= 8}>
                ➕ Agregar fila
              </button>
              <button type="button" className="stats-lab-tool-btn rnd" onClick={randomizeValues}>
                🎲 Aleatorio
              </button>
              <button type="button" className="stats-lab-tool-btn clr" onClick={clearData}>
                🗑️ Limpiar
              </button>
              <button type="button" className="stats-lab-tool-btn quiz" onClick={generateQuiz}>
                💡 Generar preguntas
              </button>
            </div>

            {/* Chart Wrapper */}
            <div className="stats-lab-chart-container">
              {renderActiveChart()}
            </div>

            {/* Statistics summary */}
            <div className="stats-lab-summary">
              <div>🔢 <b>Total:</b> {total}</div>
              <div>📈 <b>Máximo:</b> {maxVal} ({maxRow?.label || ''})</div>
              <div>📉 <b>Mínimo:</b> {minVal} ({minRow?.label || ''})</div>
              <div>📊 <b>Promedio:</b> {average}</div>
            </div>
          </div>
        </div>
      ) : quizFinished ? (
        // --- QUIZ COMPLETED SCREEN ---
        <div className="stats-lab-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
          <div
            className="stats-lab-header"
            style={{
              background: quizCorrect >= Math.ceil(quizQuestions.length * 0.6)
                ? 'linear-gradient(135deg, #16876A, #24C496)'
                : 'linear-gradient(135deg, #A30041, #FF1D4E)',
            }}
          >
            <span>{quizCorrect >= Math.ceil(quizQuestions.length * 0.6) ? '🏆 ¡Bien hecho!' : '📊 Resultado'}</span>
            <button className="stats-lab-header-close" onClick={() => setQuizQuestions(null)}>
              ✕
            </button>
          </div>

          <div className="stats-lab-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: '0.4rem' }}>
              {quizCorrect >= Math.ceil(quizQuestions.length * 0.6) ? '🎉' : '💡'}
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: quizCorrect >= Math.ceil(quizQuestions.length * 0.6) ? '#16876A' : '#A30041', fontFamily: "'Baloo 2', sans-serif" }}>
              {quizCorrect} / {quizQuestions.length}
            </div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: '0.8rem', fontWeight: 800 }}>
              {Math.round((quizCorrect / quizQuestions.length) * 100)}% de aciertos · +
              {quizCorrect >= Math.ceil(quizQuestions.length * 0.6) ? 60 : 20} 🪙
            </div>
            <button
              type="button"
              className="stats-lab-tool-btn add"
              onClick={() => setQuizQuestions(null)}
              style={{ marginTop: '0.6rem' }}
            >
              Volver al editor
            </button>
          </div>
        </div>
      ) : (
        // --- ACTIVE QUIZ QUESTION SCREEN ---
        <div className="stats-lab-card" onClick={(e) => e.stopPropagation()}>
          <div className="stats-lab-header">
            <span>🎯 Pregunta {quizIndex + 1}/{quizQuestions.length}</span>
            <button className="stats-lab-header-close" onClick={() => setQuizQuestions(null)}>
              ✕
            </button>
          </div>

          <div className="stats-lab-body">
            <div className="stats-lab-chart-container">
              {renderActiveChart()}
            </div>

            <div className="stats-lab-quiz-question">
              {quizQuestions[quizIndex].q}
            </div>

            <div className="stats-lab-quiz-options">
              {quizQuestions[quizIndex].opts.map((opt) => {
                let extraStyles = {};
                if (quizSelectedOpt === opt) {
                  if (quizFeedback === 'ok') {
                    extraStyles = { background: '#DCF5EE', color: '#074F3A', borderColor: '#16876A' };
                  } else if (quizFeedback === 'bad') {
                    extraStyles = { background: '#FBE4E9', color: '#7A1B00', borderColor: '#A30041' };
                  }
                } else if (quizFeedback && opt === quizQuestions[quizIndex].ans) {
                  extraStyles = { background: '#DCF5EE', color: '#074F3A', borderColor: '#16876A' };
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    className="stats-lab-quiz-opt-btn"
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={quizFeedback !== null}
                    style={extraStyles}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
