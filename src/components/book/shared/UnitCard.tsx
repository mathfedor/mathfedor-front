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

interface Props {
  unit: Unit;
  pct: number;
  onClick: () => void;
}

/** Tarjeta de unidad reutilizable (migrada de `.unit-card`). */
export default function UnitCard({ unit, pct, onClick }: Props) {
  const colorClass = UNIT_COLOR_CLASS[unit.index % UNIT_COLOR_CLASS.length];
  const topicTitles = unit.topics.map((t) => t.title.trim()).join(', ');

  return (
    <div className={`unit-card ${colorClass}`} onClick={onClick}>
      <div className="uc-row">
        <div className="uc-icon-wrap">
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
    </div>
  );
}
