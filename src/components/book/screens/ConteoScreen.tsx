'use client';

import { useBook } from '../context/BookContext';

const EMOJIS = ['⭐', '🍎', '🐱', '⚽', '🐶', '🌸', '🎈', '🌟', '🚀', '🍪'];

export default function ConteoScreen() {
  const { progress, goScreen, book } = useBook();
  const backScreen = progress ? 'home' : 'setup';

  // 1 to 10
  const table10 = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const emoji = EMOJIS[i];
    return { num, emojis: emoji.repeat(num) };
  });

  // 1 to 20
  const table20 = Array.from({ length: 20 }, (_, i) => {
    const num = i + 1;
    if (num <= 10) {
      return { num, emojis: EMOJIS[i].repeat(num) };
    } else {
      const baseEmoji = EMOJIS[(num - 1) % 10];
      return { num, emojis: baseEmoji.repeat(10) + `+${num - 10}` };
    }
  });

  // 1 to 30
  const table30 = Array.from({ length: 30 }, (_, i) => {
    const num = i + 1;
    if (num <= 10) {
      return { num, emojis: EMOJIS[i].repeat(num) };
    } else {
      const baseEmoji = EMOJIS[(num - 1) % 10];
      return { num, emojis: baseEmoji.repeat(10) + `+${num - 10}` };
    }
  });

  // 1 to 50 (steps of 5)
  const table50 = Array.from({ length: 10 }, (_, i) => {
    const num = (i + 1) * 5;
    const emoji = EMOJIS[i];
    return { num, emojis: emoji.repeat(5) + '+' };
  });

  // 1 to 100 (steps of 10)
  const table100 = Array.from({ length: 10 }, (_, i) => {
    const num = (i + 1) * 10;
    const emoji = EMOJIS[i];
    return { num, emojis: emoji.repeat(num) };
  });

  return (
    <div className="screen active" id="screen-tablas-conteo">
      {book?.slug === 'libro-1ro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 0.5rem 1.25rem' }}>
          <div
            className="feat-btn"
            onClick={() => goScreen('estandares')}
            style={{ background: 'linear-gradient(135deg,#fff,#F0FDF9)', margin: 0, cursor: 'pointer' }}
          >
            <div className="feat-icon" style={{ background: '#fff', fontSize: '26px', border: '1.5px solid #C5BFEE', boxShadow: 'none' }}>
              🇨🇴
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Estándares MEN</div>
              <div className="feat-sub" style={{ fontSize: '11px', color: 'rgba(20,60,100,.65)' }}>Programa de 1° Colombia</div>
            </div>
          </div>

          <div
            className="feat-btn"
            onClick={() => goScreen('problemas')}
            style={{ background: 'linear-gradient(135deg,#fff,#E8FAF1)', margin: 0, cursor: 'pointer' }}
          >
            <div className="feat-icon" style={{ background: 'linear-gradient(135deg,#0E5240,#34D399)', color: '#fff' }}>
              🛒
            </div>
            <div className="feat-info" style={{ textAlign: 'left' }}>
              <div className="feat-name">Problemas Cotidianos</div>
              <div className="feat-meta">Conteo de monedas + compras + 4 operaciones</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      )}

      <div className="back-row" onClick={() => goScreen(backScreen)}>
        ← Volver al inicio
      </div>

      <div className="hero-banner" style={{ background: 'linear-gradient(135deg,#0A3A6A,#1A6CB4,#4DA6FF)', padding: '1.2rem 1rem', marginBottom: '1rem' }}>
        <div className="hero-title" style={{ color: '#fff' }}>🔢 Tablas de Conteo</div>
        <div className="hero-tag" style={{ color: '#FFE066', fontSize: '13px', fontWeight: 800, marginTop: '.3rem' }}>
          Aprende a contar visualmente
        </div>
      </div>

      <div style={{ padding: '0 .8rem' }}>
        {/* Tabla 1 al 10 */}
        <div className="tc-card">
          <div className="tc-title">📊 Tabla 1 al 10</div>
          <div className="tc-grid">
            {table10.map((cell) => (
              <div key={cell.num} className="tc-cell">
                <div className="tc-cell-emojis">{cell.emojis}</div>
                <div className="tc-cell-num">{cell.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla 1 al 20 */}
        <div className="tc-card">
          <div className="tc-title">📊 Tabla 1 al 20</div>
          <div className="tc-grid">
            {table20.map((cell) => (
              <div key={cell.num} className="tc-cell">
                <div className="tc-cell-emojis">{cell.emojis}</div>
                <div className="tc-cell-num">{cell.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla 1 al 30 */}
        <div className="tc-card">
          <div className="tc-title">📊 Tabla 1 al 30</div>
          <div className="tc-grid">
            {table30.map((cell) => (
              <div key={cell.num} className="tc-cell">
                <div className="tc-cell-emojis">{cell.emojis}</div>
                <div className="tc-cell-num">{cell.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla 1 al 50 */}
        <div className="tc-card">
          <div className="tc-title">📊 Tabla 1 al 50</div>
          <div className="tc-grid">
            {table50.map((cell) => (
              <div key={cell.num} className="tc-cell">
                <div className="tc-cell-emojis">{cell.emojis}</div>
                <div className="tc-cell-num">{cell.num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla 1 al 100 */}
        <div className="tc-card">
          <div className="tc-title">📊 Tabla 1 al 100</div>
          <div className="tc-grid">
            {table100.map((cell) => (
              <div key={cell.num} className="tc-cell">
                <div
                  className="tc-cell-emojis"
                  style={{
                    lineHeight: '1.2',
                    fontSize: cell.num > 30 ? '11px' : '14px',
                    maxHeight: '90px',
                    overflow: 'hidden',
                    wordBreak: 'break-all',
                  }}
                >
                  {cell.emojis}
                </div>
                <div className="tc-cell-num">{cell.num}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
