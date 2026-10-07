'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

export interface DailyMission {
  id: string;
  txt: string;
  goal: number;
  metric: 'correct' | 'streak' | 'xp';
  xp: number;
  coins: number;
}

export const DAILY_MISSIONS_4TO: DailyMission[] = [
  { id: 'm_corr5', txt: 'Acierta 5 ejercicios hoy', goal: 5, metric: 'correct', xp: 60, coins: 40 },
  { id: 'm_corr10', txt: 'Acierta 10 ejercicios hoy', goal: 10, metric: 'correct', xp: 120, coins: 80 },
  { id: 'm_streak3', txt: 'Logra una racha de 3 correctas', goal: 3, metric: 'streak', xp: 80, coins: 50 },
  { id: 'm_streak5', txt: 'Logra una racha de 5 correctas', goal: 5, metric: 'streak', xp: 140, coins: 90 },
  { id: 'm_xp200', txt: 'Gana 200 XP en el día', goal: 200, metric: 'xp', xp: 100, coins: 60 },
];

export const DAILY_STORAGE_KEY_4TO = 'fedor4_daily_v2';

export function getDailyDayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export interface DailyMissionState4to {
  day: string;
  missionId: string;
  progress: number;
  claimed: boolean;
  baselineXP: number;
}

export function loadDailyMissionState(currentTotalXP = 0): DailyMissionState4to {
  const dk = getDailyDayKey();
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(DAILY_STORAGE_KEY_4TO);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.day === dk) {
          return s;
        }
      }
    } catch {
      // ignore
    }
  }

  // Pick deterministic mission for today
  const idx = Math.floor(Math.abs(hashCode(dk)) % DAILY_MISSIONS_4TO.length);
  const m = DAILY_MISSIONS_4TO[idx];
  const newState: DailyMissionState4to = {
    day: dk,
    missionId: m.id,
    progress: 0,
    claimed: false,
    baselineXP: currentTotalXP,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DAILY_STORAGE_KEY_4TO, JSON.stringify(newState));
    } catch {
      // ignore
    }
  }

  return newState;
}

export function saveDailyMissionState(state: DailyMissionState4to): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DAILY_STORAGE_KEY_4TO, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
}

export function recordDailyMissionProgress(metric: 'correct' | 'streak', val = 1): void {
  const state = loadDailyMissionState();
  if (state.claimed) return;
  const m = DAILY_MISSIONS_4TO.find((item) => item.id === state.missionId) || DAILY_MISSIONS_4TO[0];

  if (m.metric === metric) {
    if (metric === 'correct') {
      state.progress = Math.min(m.goal, state.progress + val);
    } else if (metric === 'streak') {
      state.progress = Math.min(m.goal, Math.max(state.progress, val));
    }
    saveDailyMissionState(state);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('fedor4_daily_update'));
    }
  }
}

export function DailyMissionCard4to() {
  const { totalXP, streak, updateStats } = useBook4();
  const [dailyState, setDailyState] = useState<DailyMissionState4to>(() => loadDailyMissionState(totalXP));

  useEffect(() => {
    // Reload state if day changed or totalXP initialised
    const st = loadDailyMissionState(totalXP);
    setDailyState(st);

    const handleUpdate = () => {
      setDailyState(loadDailyMissionState(totalXP));
    };

    window.addEventListener('fedor4_daily_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('fedor4_daily_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [totalXP]);

  const mission = useMemo(() => {
    return DAILY_MISSIONS_4TO.find((m) => m.id === dailyState.missionId) || DAILY_MISSIONS_4TO[0];
  }, [dailyState.missionId]);

  // Compute actual progress based on metric
  const currentProgress = useMemo(() => {
    if (mission.metric === 'xp') {
      const delta = Math.max(0, totalXP - (dailyState.baselineXP || 0));
      return Math.min(mission.goal, Math.max(dailyState.progress, delta));
    }
    if (mission.metric === 'streak') {
      return Math.min(mission.goal, Math.max(dailyState.progress, streak));
    }
    return Math.min(mission.goal, dailyState.progress);
  }, [mission, dailyState, totalXP, streak]);

  const pct = Math.min(100, Math.round((currentProgress / mission.goal) * 100));
  const isDone = currentProgress >= mission.goal;

  const handleClaim = () => {
    if (dailyState.claimed || !isDone) return;
    const nextState: DailyMissionState4to = {
      ...dailyState,
      progress: mission.goal,
      claimed: true,
    };
    setDailyState(nextState);
    saveDailyMissionState(nextState);
    updateStats(mission.coins, 0, mission.xp);

    Swal.fire({
      icon: 'success',
      title: '¡Misión completada! 🎉',
      html: `
        <div style="font-size:15px;color:#3D1468;font-weight:700;line-height:1.5;">
          Has recibido <b>+${mission.xp} XP</b> y <b>+${mission.coins} 🪙</b>
        </div>
      `,
      confirmButtonText: '¡Genial! 🚀',
      confirmButtonColor: '#7B2FBE',
    });
  };

  return (
    <>
      <div id="dailyMissionCard" className="daily-mission-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
          {/* Target Icon Badge */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0,
              border: '1.5px solid rgba(255, 224, 102, 0.4)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            🎯
          </div>

          {/* Mission Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: 'rgba(255, 224, 102, 0.85)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Misión del día
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', cursive, sans-serif",
                fontSize: '16px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.25,
                marginTop: '2px',
              }}
            >
              {mission.txt}
            </div>

            {/* Progress Track */}
            <div className="dm-progress-track">
              <div className="dm-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* Progress Count & Reward */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.75)',
                marginTop: '4px',
              }}
            >
              <span>
                {currentProgress} / {mission.goal}
              </span>
              <span style={{ color: '#F5C518' }}>
                +{mission.xp} XP · +{mission.coins} 🪙
              </span>
            </div>
          </div>

          {/* Right Action / Lock */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDone && !dailyState.claimed ? (
              <button
                type="button"
                onClick={handleClaim}
                style={{
                  background: 'linear-gradient(135deg, #F5C518, #FF8C2A)',
                  color: '#2A0F60',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: '0 4px 14px rgba(245, 197, 24, 0.5)',
                  animation: 'dmPulse 1.6s ease-in-out infinite',
                }}
              >
                🎁 RECLAMAR
              </button>
            ) : dailyState.claimed ? (
              <div
                style={{
                  background: 'rgba(36, 196, 150, 0.2)',
                  border: '1px solid #24C496',
                  color: '#24C496',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 900,
                }}
              >
                ✅ HECHO
              </div>
            ) : (
              <div
                style={{
                  fontSize: '32px',
                  opacity: 0.75,
                  userSelect: 'none',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
                }}
                title="Completa la misión para desbloquear"
              >
                🔒
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .daily-mission-card {
          background: linear-gradient(135deg, #1E0848, #7B2FBE, #E8650A);
          border-radius: 18px;
          padding: 1rem 1.15rem;
          margin-top: 1.25rem;
          margin-bottom: 0.85rem;
          color: #fff;
          box-shadow: 0 8px 30px rgba(123, 47, 190, 0.4);
          position: relative;
          overflow: hidden;
        }

        .dm-progress-track {
          height: 8px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .dm-progress-fill {
          height: 8px;
          background: linear-gradient(90deg, #F5C518, #FF8C2A);
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes dmPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
