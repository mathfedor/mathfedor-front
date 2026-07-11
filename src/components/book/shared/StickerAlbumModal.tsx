'use client';

import { useState, useEffect } from 'react';
import { STICKERS, getStickerState, Sticker } from '../utils/stickerService';

interface StickerAlbumModalProps {
  onClose: () => void;
}

export default function StickerAlbumModal({ onClose }: StickerAlbumModalProps) {
  const [stickerState, setStickerState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setStickerState(getStickerState());
  }, []);

  const ownedCount = STICKERS.filter((s) => !!stickerState[s.id]).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,4,30,.85)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '88vh',
          overflow: 'hidden',
          border: '3px solid #FFE066',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,.55)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem',
            background: 'linear-gradient(135deg, #9B5CFF, #FF1D4E)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: "'Baloo 2', sans-serif",
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '34px', lineHeight: 1 }}>📔</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1.2 }}>Mi Álbum</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '2px' }}>
              {ownedCount} / {STICKERS.length} coleccionados
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,.25)',
              border: 'none',
              color: '#fff',
              fontSize: '28px',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.25)')}
          >
            ×
          </button>
        </div>

        {/* Stickers Grid */}
        <div
          style={{
            padding: '1.1rem',
            overflowY: 'auto',
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            background: '#FAF9F6',
          }}
        >
          {STICKERS.map((s) => {
            const has = !!stickerState[s.id];
            return (
              <div
                key={s.id}
                style={{
                  background: has ? '#FFF7E0' : '#FFF',
                  border: has ? '3.5px solid #FF8C2A' : '2.5px dashed #BBB',
                  borderRadius: '16px',
                  padding: '12px 6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1 / 1',
                  boxShadow: has ? '0 4px 10px rgba(255,140,42,.15)' : 'none',
                  transition: 'transform 0.2s',
                  cursor: has ? 'default' : 'help',
                }}
                title={has ? s.name : 'Sticker bloqueado'}
              >
                <div 
                  style={{ 
                    fontSize: has ? '40px' : '48px', 
                    lineHeight: 1, 
                    color: has ? 'inherit' : 'rgba(0,0,0,0.12)',
                    fontWeight: has ? '900' : 'bold',
                  }}
                >
                  {has ? s.e : '?'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: has ? '#7A3200' : '#999',
                    marginTop: '6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {has ? s.name : '???'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
