'use client';

import { useBook } from '../context/BookContext';
import type { ShopItem } from '@/types/gamification.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GRADE1_SHOP_ITEMS: ShopItem[] = [
  { id: 'sp_robot', cat: 'casco', emoji: '🤖', name: 'Cyborg estelar', desc: 'Procesador cuántico. Avatar raro.', price: 300, unlockXP: 0, avatar: '🤖' },
  { id: 'sp_dragon', cat: 'casco', emoji: '🐲', name: 'Dragón cósmico', desc: 'Vuela entre nebulosas. Avatar raro.', price: 400, unlockXP: 0, avatar: '🐲' },
  { id: 'sp_alien', cat: 'casco', emoji: '👾', name: 'Alien clásico', desc: 'Visitante intergaláctico. Avatar raro.', price: 350, unlockXP: 0, avatar: '👾' },
  { id: 'sp_ninja', cat: 'casco', emoji: '🥷', name: 'Astro-ninja', desc: 'Silencioso y veloz entre asteroides.', price: 450, unlockXP: 0, avatar: '🥷' },
  { id: 'sp_witch', cat: 'casco', emoji: '🧙‍♀️', name: 'Maga estelar', desc: 'Convierte errores en lecciones. Legendaria.', price: 600, unlockXP: 0, avatar: '🧙‍♀️' },
  { id: 'sp_ghost', cat: 'casco', emoji: '👻', name: 'Fantasma cósmico', desc: 'Atraviesa las paredes del tiempo.', price: 500, unlockXP: 0, avatar: '👻' },
  
  { id: 'sp_ice', cat: 'traje', emoji: '❄️', name: 'Escudo de Hielo', desc: 'Detiene el cronómetro 10s · 1 vez por lección.', price: 150, unlockXP: 0, avatar: null },
  { id: 'sp_time', cat: 'traje', emoji: '⏰', name: 'Reloj cuántico', desc: '+20 segundos al cronómetro · 1 vez por lección.', price: 200, unlockXP: 0, avatar: null },
  { id: 'sp_hint', cat: 'traje', emoji: '💡', name: 'Chip de pista', desc: 'Revela una pista extra · 1 vez por lección.', price: 120, unlockXP: 0, avatar: null },
  { id: 'sp_life', cat: 'traje', emoji: '❤️', name: 'Vida extra', desc: 'Te perdona una respuesta incorrecta por lección.', price: 180, unlockXP: 0, avatar: null },
  { id: 'sp_magnet', cat: 'traje', emoji: '🧲', name: 'Magneto de monedas', desc: 'Duplica las monedas ganadas en la próxima lección.', price: 250, unlockXP: 0, avatar: null },
  { id: 'sp_xp2x', cat: 'traje', emoji: '⭐', name: 'Doble XP', desc: 'Duplica el XP ganado en la próxima lección.', price: 300, unlockXP: 0, avatar: null },
  { id: 'sp_lucky', cat: 'traje', emoji: '🍀', name: 'Estrella de la suerte', desc: 'Aciertos cuentan triple en la próxima lección.', price: 400, unlockXP: 0, avatar: null },
  { id: 'sp_bomb', cat: 'traje', emoji: '💣', name: 'Bomba de XP', desc: '+200 XP al instante. Un solo uso.', price: 350, unlockXP: 0, avatar: null },
];

export default function ShopModal({ isOpen, onClose }: Props) {
  const { progress, buyItem, equipItem } = useBook();

  if (!isOpen || !progress) return null;

  const g = progress.gamification;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 8, 48, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '80vh',
          maxHeight: '680px',
          background: 'linear-gradient(160deg, #180C36, #2E1273 60%, #0D2C24)',
          borderRadius: '24px',
          border: '2px solid rgba(155, 92, 255, 0.35)',
          boxShadow: '0 20px 80px rgba(108, 40, 180, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0.5rem', textAlign: 'left', position: 'relative' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: "'Baloo 2', sans-serif" }}>
            🛍️ Tienda Espacial
          </h2>
          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0', fontWeight: 700 }}>
            Avatares raros y power-ups · pagas con monedas 🪙
          </p>

          {/* Close button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Coins indicator aligned to right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1.5rem 0.75rem' }}>
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '6px 14px',
              color: '#FFE066',
              fontWeight: 900,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            🪙 {g.coins}
          </div>
        </div>

        {/* Scrollable grid area */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 1.5rem 1.5rem',
            marginRight: '4px',
          }}
          className="custom-shop-scroll"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {GRADE1_SHOP_ITEMS.map((item) => {
              const owned = g.shop.owned.includes(item.id);
              const equipped = g.shop.equipped[item.cat] === item.id || g.avatar === item.emoji;
              const canBuy = g.coins >= item.price;

              return (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: equipped ? '1.5px solid #9B5CFF' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '180px',
                    transition: 'transform 0.2s, border-color 0.2s',
                    boxShadow: equipped ? '0 0 12px rgba(155,92,255,0.2)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
                    {item.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '13px', color: '#fff', marginBottom: '2px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', minHeight: '28px', margin: '4px 0', lineHeight: '1.3' }}>
                      {item.desc}
                    </div>
                  </div>

                  <div style={{ width: '100%', marginTop: '6px' }}>
                    {owned ? (
                      item.avatar ? (
                        <button
                          onClick={() => equipItem(item)}
                          disabled={equipped}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '11px',
                            fontWeight: 900,
                            backgroundColor: equipped ? 'rgba(36, 196, 150, 0.15)' : 'linear-gradient(135deg, #7B2FBE, #9B5CFF)',
                            color: equipped ? '#24C496' : '#fff',
                            border: equipped ? '1.5px solid #24C496' : 'none',
                            borderRadius: '14px',
                            cursor: equipped ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            background: equipped ? 'none' : 'linear-gradient(135deg, #7B2FBE, #9B5CFF)',
                          }}
                        >
                          {equipped ? '✅ Equipado' : 'Equipar'}
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '11px',
                            fontWeight: 900,
                            backgroundColor: 'rgba(36, 196, 150, 0.15)',
                            color: '#24C496',
                            border: '1.5px solid #24C496',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: 'default',
                          }}
                        >
                          ✔️ Comprado
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => buyItem(item)}
                        disabled={!canBuy}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: 900,
                          backgroundColor: canBuy ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: '1.5px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '14px',
                          color: '#FFE066',
                          cursor: canBuy ? 'pointer' : 'not-allowed',
                          opacity: canBuy ? 1 : 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        {item.price} 🪙
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS for custom scrollbar in shop modal */}
        <style jsx global>{`
          .custom-shop-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-shop-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-shop-scroll::-webkit-scrollbar-thumb {
            background: #9B5CFF;
            border-radius: 10px;
          }
          .custom-shop-scroll::-webkit-scrollbar-thumb:hover {
            background: #7B2FBE;
          }
        `}</style>
      </div>
    </div>
  );
}
