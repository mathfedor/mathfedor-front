'use client';

import type { Unit } from '@/types/book.types';

const UNIT_COLOR_CLASS = ['uc-purple', 'uc-teal', 'uc-purple', 'uc-orange', 'uc-orange', 'uc-teal', 'uc-blue', 'uc-pink'];
const BAR_GRADIENT = [
  'linear-gradient(90deg,#7B2FBE,#A864E8)',
  'linear-gradient(90deg,#16876A,#24C496)',
  'linear-gradient(90deg,#7B2FBE,#A864E8)',
  'linear-gradient(90deg,#E8650A,#FF8C2A)',
  'linear-gradient(90deg,#C25400,#FF8C2A)',
  'linear-gradient(90deg,#0A3A7A,#5BBFFF)',
  'linear-gradient(90deg,#0E6BA8,#3AA0FF)',
  'linear-gradient(90deg,#6A1B9A,#9B5CFF)',
];

const ICON_BG = ['#EEEDFE', '#DCF5EE', '#F3E8FF', '#FAECE7', '#E8F0FF', '#E8F5FF'];

interface PillInfo {
  icon: string;
  label: string;
  bg: string;
  color: string;
  borderColor: string;
}

const UNIT_PILLS: Record<number, PillInfo[]> = {
  0: [
    { icon: '🔢', label: 'Conteo', bg: '#EEEDFE', color: '#3D1468', borderColor: '#C5BFEE' },
    { icon: '➕', label: 'Suma', bg: '#DCF5EE', color: '#074F3A', borderColor: '#95DAC4' },
    { icon: '🔟', label: 'Decena', bg: '#FEF3E8', color: '#7A3200', borderColor: '#FBBF7A' },
    { icon: '📏', label: 'Recta', bg: '#E8F0FF', color: '#1A3A6A', borderColor: '#8EBBF0' },
  ],
  1: [
    { icon: '🏪', label: 'Tienda', bg: '#DCF5EE', color: '#074F3A', borderColor: '#95DAC4' },
    { icon: '📐', label: 'Vertical', bg: '#FEF3E8', color: '#7A3200', borderColor: '#FBBF7A' },
    { icon: '📏', label: 'Recta', bg: '#E8F0FF', color: '#1A3A6A', borderColor: '#8EBBF0' },
  ],
  2: [
    { icon: '🔁', label: 'Suma repetida', bg: '#F3E8FF', color: '#4A1070', borderColor: '#C5BFEE' },
    { icon: '📊', label: 'Tablas 1-9', bg: '#FEF3E8', color: '#7A3200', borderColor: '#FBBF7A' },
    { icon: '🔄', label: 'Conmutativa', bg: '#DCF5EE', color: '#054F38', borderColor: '#8FD9C0' },
  ],
  3: [
    { icon: '🍫', label: 'Repartir', bg: '#FAECE7', color: '#7A1800', borderColor: '#F5B09A' },
    { icon: '✅', label: 'Exacta', bg: '#FEF3E8', color: '#7A3200', borderColor: '#FBBF7A' },
    { icon: '🔄', label: 'Inversa ×', bg: '#EEEDFE', color: '#3D1468', borderColor: '#C5BFEE' },
  ],
  4: [
    { icon: '📏', label: 'Magnitudes', bg: '#E8F0FF', color: '#1A3A6A', borderColor: '#8EBBF0' },
    { icon: '🔺', label: 'Geometría', bg: '#FEF3E8', color: '#7A3200', borderColor: '#FBBF7A' },
    { icon: '📐', label: 'Perímetro/Área', bg: '#DCF5EE', color: '#054F38', borderColor: '#8FD9C0' },
  ],
  5: [
    { icon: '📊', label: 'Gráficos', bg: '#E8F5FF', color: '#0E6BA8', borderColor: '#8EBBF0' },
    { icon: '📋', label: 'Encuestas', bg: '#E8F5FF', color: '#0E6BA8', borderColor: '#8EBBF0' },
  ],
};

interface Props {
  unit: Unit;
  pct: number;
  onClick: () => void;
  isGrade1?: boolean;
}

/** Tarjeta de unidad reutilizable (migrada de `.unit-card`). */
export default function UnitCard({ unit, pct, onClick, isGrade1 }: Props) {
  const colorClass = UNIT_COLOR_CLASS[unit.index % UNIT_COLOR_CLASS.length];
  const topicTitles = unit.topics.map((t) => t.title.trim()).join(', ');

  return (
    <div className={`unit-card ${colorClass}`} onClick={onClick}>
      <div className="uc-row">
        <div className="uc-icon-wrap" style={{ background: ICON_BG[unit.index % ICON_BG.length] }}>
          <span style={{ fontSize: 26 }}>{unit.icon}</span>
        </div>
        <div className="uc-info">
          <div className="uc-name">{unit.name}</div>
          <div className="uc-meta">
            {unit.topics.length} temas · {topicTitles}
          </div>
          <div className="uc-prog-bar">
            <div
              className="uc-prog-fill"
              style={{ width: `${pct}%`, background: BAR_GRADIENT[unit.index % BAR_GRADIENT.length] }}
            />
          </div>
        </div>
        <div className="uc-right">
          <div className="uc-pct">{pct}%</div>
        </div>
      </div>

      {isGrade1 && UNIT_PILLS[unit.index] && (
        <div className="pills">
          {UNIT_PILLS[unit.index].map((pill, idx) => (
            <span 
              key={idx} 
              className="pill" 
              style={{ background: pill.bg, color: pill.color, borderColor: pill.borderColor }}
            >
              {pill.icon} {pill.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
