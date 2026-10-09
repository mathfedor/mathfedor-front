'use client';

import React, { useState, useEffect } from 'react';

export interface StickerItem {
  id: string;
  e: string;
  name: string;
}

export const STICKERS_4TO: StickerItem[] = [
  { id: 'st_dragon', e: '🐲', name: 'Dragoncito Negoran' },
  { id: 'st_unicor', e: '🦄', name: 'Unicornio Brillante' },
  { id: 'st_buho', e: '🦉', name: 'Búho Sabio' },
  { id: 'st_robot', e: '🤖', name: 'Robot Sumador' },
  { id: 'st_corona', e: '👑', name: 'Corona del Saber' },
  { id: 'st_estrella', e: '⭐', name: 'Estrella Dorada' },
  { id: 'st_mago', e: '🧙‍♂️', name: 'Mago Numerix' },
  { id: 'st_principe', e: '🤴', name: 'Príncipe Calculín' },
  { id: 'st_pirata', e: '🏴‍☠️', name: 'Pirata del Número' },
  { id: 'st_astro', e: '👨‍🚀', name: 'Astronauta de las Cuentas' },
  { id: 'st_dinos', e: '🦖', name: 'Dino Calculador' },
  { id: 'st_arcoiris', e: '🌈', name: 'Arcoíris Mágico' },
  { id: 'st_cohete', e: '🚀', name: 'Cohete del Saber' },
  { id: 'st_planeta', e: '🪐', name: 'Planeta Anillado' },
  { id: 'st_galaxy', e: '🌌', name: 'Galaxia Espiral' },
  { id: 'st_medall', e: '🏅', name: 'Medalla Dorada' },
  { id: 'st_trofeo', e: '🏆', name: 'Trofeo Mayor' },
  { id: 'st_pizza', e: '🍕', name: 'Pizza de Premio' },
  { id: 'st_torta', e: '🎂', name: 'Torta de Fiesta' },
  { id: 'st_helado', e: '🍦', name: 'Helado Galáctico' },
];

interface StickerAlbumModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function StickerAlbumModal4to({
  isOpen = true,
  onClose,
}: StickerAlbumModal4toProps) {
  const [ownedStickers, setOwnedStickers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fedor4_stickers') || localStorage.getItem('fedor2_stickers');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) setOwnedStickers(parsed);
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const ownedCount = STICKERS_4TO.filter((s) => !!ownedStickers[s.id]).length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(8, 4, 30, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Nunito', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* Cabecera Degradada Morada-Magenta (Idéntica a la Imagen) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #9B5CFF, #FF1D4E)',
            borderTopLeftRadius: '26px',
            borderTopRightRadius: '26px',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>📓</span>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                  letterSpacing: '0.01em',
                  lineHeight: 1.15,
                }}
              >
                Mi Álbum de Stickers
              </h2>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginTop: '2px',
                }}
              >
                {ownedCount} / {STICKERS_4TO.length} coleccionados
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Grilla 4×5 de Stickers (20 Casillas Exactas) */}
        <div
          style={{
            padding: '20px 22px 24px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {STICKERS_4TO.map((s) => {
              const has = !!ownedStickers[s.id];
              return (
                <div
                  key={s.id}
                  style={{
                    backgroundColor: has ? '#FFF7E0' : '#FFFFFF',
                    border: has ? '2px solid #FF8C2A' : '2px dashed #D1D5DB',
                    borderRadius: '16px',
                    padding: '14px 6px 12px 6px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '102px',
                    boxSizing: 'border-box',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {has ? (
                    <>
                      <div
                        style={{
                          fontSize: '36px',
                          lineHeight: 1,
                          marginBottom: '4px',
                        }}
                      >
                        {s.e}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          color: '#7A3200',
                          lineHeight: 1.2,
                          padding: '0 2px',
                        }}
                      >
                        {s.name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: '36px',
                          lineHeight: 1,
                          color: '#E5E7EB',
                          fontWeight: 900,
                          marginBottom: '6px',
                          userSelect: 'none',
                        }}
                      >
                        ?
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#D1D5DB',
                          userSelect: 'none',
                        }}
                      >
                        ???
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
