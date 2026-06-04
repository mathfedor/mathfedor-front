'use client';

import { useBook, useRank, useUnlockedAvatars } from '../context/BookContext';
import { resolveBadges } from '@/services/gamification.service';
import { evaluateMissions } from '@/services/missions.service';

/** Perfil del estudiante: avatar, rango, insignias, misiones y ajustes. */
export default function ProfileScreen() {
  const { book, progress, catalog, goScreen, selectAvatar, resetAll, claimMission, dark, soundOn, toggleDark, toggleSound } = useBook();
  const rank = useRank();
  const unlocked = useUnlockedAvatars();
  if (!book || !progress || !catalog) return null;

  const g = progress.gamification;
  const earned = resolveBadges(catalog, g.earnedBadges);
  const missions = evaluateMissions(book, progress);

  return (
    <div className="screen active" id="screen-profile">
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div style={{ textAlign: 'center', padding: '1.5rem' }}>
        <div style={{ fontSize: 72 }}>{g.avatar}</div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>{progress.student.name || 'Astronauta'}</div>
        <div style={{ color: rank?.color, fontWeight: 800 }}>{rank?.label}</div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 8 }}>
          <span className="hs-item">{g.totalXP} XP</span>
          <span className="hs-item">{g.coins}🪙</span>
          <span className="hs-item">{g.maxStreak}🔥</span>
        </div>
      </div>

      <div className="sec-title">🏅 Insignias ({earned.length}/{catalog.badges.length})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 8 }}>
        {catalog.badges.map((b) => {
          const has = g.earnedBadges.includes(b.id);
          return (
            <div key={b.id} title={b.tip} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 12, background: has ? b.bg : '#EEE', border: `1.5px solid ${has ? b.bc : '#DDD'}`, opacity: has ? 1 : 0.4 }}>
              <div style={{ fontSize: 26 }}>{b.emoji}</div>
              <div style={{ fontSize: 9, fontWeight: 700 }}>{b.name}</div>
            </div>
          );
        })}
      </div>

      <div className="sec-title" style={{ marginTop: '1.25rem' }}>🧑‍🚀 Avatares</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(56px,1fr))', gap: 8 }}>
        {catalog.avatars.map((a) => {
          const isUnlocked = unlocked.some((u) => u.av === a.av);
          return (
            <button
              key={a.av}
              disabled={!isUnlocked}
              title={isUnlocked ? a.label : `Desbloquea con ${a.xp} XP`}
              onClick={() => selectAvatar(a.av)}
              style={{ fontSize: 28, padding: 8, borderRadius: 12, cursor: isUnlocked ? 'pointer' : 'not-allowed', opacity: isUnlocked ? 1 : 0.35, border: g.avatar === a.av ? '2px solid var(--purple)' : '2px solid var(--border)', background: 'var(--white)' }}
            >
              {a.av}
            </button>
          );
        })}
      </div>

      <div className="sec-title" style={{ marginTop: '1.25rem' }}>🎯 Misiones</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {missions.map(({ mission, current, done, claimed, claimable }) => (
          <div key={mission.id} className="mission-row">
            <span className="mission-emoji">{mission.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mission-title">{mission.title}</div>
              <div className="mission-track">
                <div className="mission-fill" style={{ width: `${Math.round((current / mission.target) * 100)}%` }} />
              </div>
              <div className="mission-meta">{current}/{mission.target} · 🪙 {mission.reward}</div>
            </div>
            {claimed ? (
              <span className="mission-claimed">✅</span>
            ) : (
              <button
                className="mission-claim"
                disabled={!claimable}
                onClick={() => claimMission(mission.id, mission.reward)}
              >
                {done ? 'Reclamar' : '…'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="sec-title" style={{ marginTop: '1.25rem' }}>⚙️ Ajustes</div>
      <div className="settings-row">
        <span>🌙 Modo oscuro</span>
        <button className={`toggle${dark ? ' on' : ''}`} onClick={toggleDark} aria-pressed={dark}>
          <span className="toggle-knob" />
        </button>
      </div>
      <div className="settings-row">
        <span>🔊 Sonido</span>
        <button className={`toggle${soundOn ? ' on' : ''}`} onClick={toggleSound} aria-pressed={soundOn}>
          <span className="toggle-knob" />
        </button>
      </div>

      <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={resetAll}>
        🔄 Reiniciar progreso
      </button>
    </div>
  );
}
