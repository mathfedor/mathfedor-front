'use client';

import React, { useState, useEffect } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

export interface ShopItem4to {
  id: string;
  cat: 'avatar' | 'mascota' | 'fondo' | 'power' | 'access';
  emoji: string;
  name: string;
  price: number;
}

export const SHOP_ITEMS_4TO: ShopItem4to[] = [
  // 👤 Personajes (10 exactos de Imagen 2 y HTML)
  { id: 'av_numerix', cat: 'avatar', emoji: '🧙‍♂️', name: 'Numerix el Mago', price: 200 },
  { id: 'av_sumalia', cat: 'avatar', emoji: '🧝‍♀️', name: 'Sumalia la Hada', price: 250 },
  { id: 'av_reston', cat: 'avatar', emoji: '🦸', name: 'Restón Veloz', price: 200 },
  { id: 'av_multiplex', cat: 'avatar', emoji: '🤖', name: 'Multiplex 3000', price: 280 },
  { id: 'av_divisor', cat: 'avatar', emoji: '🦸‍♀️', name: 'Divisora Mágica', price: 280 },
  { id: 'av_ninja', cat: 'avatar', emoji: '🥷', name: 'Niño Ninja', price: 320 },
  { id: 'av_astro2', cat: 'avatar', emoji: '👨‍🚀', name: 'Astronauta Pro', price: 300 },
  { id: 'av_dragoncito', cat: 'avatar', emoji: '🐲', name: 'Dragoncito Negoran', price: 400 },
  { id: 'av_principe', cat: 'avatar', emoji: '🤴', name: 'Príncipe del Cálculo', price: 350 },
  { id: 'av_princesa', cat: 'avatar', emoji: '👸', name: 'Princesa Matemática', price: 350 },

  // 🐾 Mascotas
  { id: 'pet_unicorn', cat: 'mascota', emoji: '🦄', name: 'Unicornio Brillante', price: 450 },
  { id: 'pet_dragon', cat: 'mascota', emoji: '🐉', name: 'Dragón de Fuego', price: 500 },
  { id: 'pet_oso', cat: 'mascota', emoji: '🐻', name: 'Oso Calculín', price: 380 },
  { id: 'pet_pulpo', cat: 'mascota', emoji: '🐙', name: 'Pulpo 8-brazos', price: 420 },
  { id: 'pet_buho', cat: 'mascota', emoji: '🦉', name: 'Búho Sabio', price: 360 },
  { id: 'pet_robot', cat: 'mascota', emoji: '🤖', name: 'Robot Suma 9000', price: 550 },

  // 🏙️ Fondos
  { id: 'bg_nebula', cat: 'fondo', emoji: '🌌', name: 'Nebulosa Violeta', price: 300 },
  { id: 'bg_galaxy', cat: 'fondo', emoji: '🌠', name: 'Galaxia Espiral', price: 350 },
  { id: 'bg_meteor', cat: 'fondo', emoji: '☄️', name: 'Lluvia de Meteoros', price: 400 },
  { id: 'bg_planet', cat: 'fondo', emoji: '🪐', name: 'Planeta de Anillos', price: 350 },
  { id: 'bg_sunset', cat: 'fondo', emoji: '🌅', name: 'Atardecer Cósmico', price: 280 },

  // ⚡ Power-ups
  { id: 'pw_50', cat: 'power', emoji: '🎯', name: '50/50 (×3)', price: 100 },
  { id: 'pw_hint', cat: 'power', emoji: '💡', name: 'Pista Extra (×3)', price: 80 },
  { id: 'pw_doublecoin', cat: 'power', emoji: '💰', name: 'Monedas ×2 (1 nivel)', price: 150 },
  { id: 'pw_time', cat: 'power', emoji: '⏰', name: '+15s de tiempo', price: 120 },
  { id: 'pw_shield', cat: 'power', emoji: '🛡️', name: 'Escudo (1 error gratis)', price: 140 },

  // 💎 Accesorios
  { id: 'ac_corona', cat: 'access', emoji: '👑', name: 'Corona Real', price: 600 },
  { id: 'ac_gafas', cat: 'access', emoji: '🕶️', name: 'Gafas Cool', price: 180 },
  { id: 'ac_capa', cat: 'access', emoji: '🦹', name: 'Capa de Héroe', price: 240 },
  { id: 'ac_medalla', cat: 'access', emoji: '🏅', name: 'Medalla Dorada', price: 320 },
  { id: 'ac_estrella', cat: 'access', emoji: '⭐', name: 'Estrella en la frente', price: 260 },
];

interface ShopModal4toProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function ShopModal4to({ isOpen = true, onClose }: ShopModal4toProps) {
  const { coins, updateStats, student, startStudent } = useBook4();
  const [activeTab, setActiveTab] = useState<'avatar' | 'mascota' | 'fondo' | 'power' | 'access'>('avatar');
  const [ownedItems, setOwnedItems] = useState<Record<string, boolean>>({});

  // Load owned items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fedor4_shop');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.owned) setOwnedItems(parsed.owned);
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const currentItems = SHOP_ITEMS_4TO.filter((item) => item.cat === activeTab);

  const handleBuyOrEquip = (item: ShopItem4to) => {
    const isOwned = !!ownedItems[item.id];

    if (isOwned) {
      if (item.cat === 'avatar') {
        startStudent({ ...student, avatar: item.emoji });
        Swal.fire({
          icon: 'success',
          title: '¡Personaje Equipado!',
          text: `Ahora tu avatar es ${item.name} ${item.emoji}`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: item.name,
          text: 'Ya tienes este artículo adquirido.',
          timer: 1600,
          showConfirmButton: false,
        });
      }
      return;
    }

    if (coins < item.price) {
      Swal.fire({
        icon: 'warning',
        title: 'Monedas insuficientes 🪙',
        html: `Necesitas <b>${item.price} 🪙</b> pero tienes <b>${coins} 🪙</b>.<br/><br/><span style="color:#6D28D9;font-weight:700">¡Resuelve más misiones del libro para ganar monedas!</span>`,
        confirmButtonColor: '#E8650A',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    Swal.fire({
      title: `¿Comprar "${item.name}"?`,
      html: `¿Deseas gastar <b>${item.price} 🪙</b> de tu saldo?<br/><span style="font-size:38px;display:block;margin:12px 0">${item.emoji}</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: '¡Sí, comprar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Deduct coins
        updateStats(-item.price, 0, 0);

        // Mark as owned
        const updated = { ...ownedItems, [item.id]: true };
        setOwnedItems(updated);
        try {
          localStorage.setItem('fedor4_shop', JSON.stringify({ owned: updated }));
        } catch {}

        // If avatar, equip automatically
        if (item.cat === 'avatar') {
          startStudent({ ...student, avatar: item.emoji });
        }

        Swal.fire({
          icon: 'success',
          title: '🎉 ¡Compra Exitosa!',
          text: `Has adquirido ${item.name} por ${item.price} 🪙.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

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
          maxWidth: '560px',
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
        {/* ══ CABECERA VERDE ESMERALDA (IDÉNTICA A IMAGEN 1 Y HTML) ══ */}
        <div
          style={{
            background: 'linear-gradient(135deg, #16876A, #24C496)',
            borderTopLeftRadius: '26px',
            borderTopRightRadius: '26px',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px', lineHeight: 1 }}>🛒</span>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                letterSpacing: '0.02em',
              }}
            >
              Tienda Espacial 2°
            </h2>
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

        {/* ══ CUERPO CON MÁRGENES Y ESPACIOS GENEROSOS (IMÁGENES 1, 2 Y 3) ══ */}
        <div
          style={{
            padding: '20px 24px 24px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {/* 1. Barra de Saldo (Imagen 2) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '14px',
              padding: '10px 18px',
              marginBottom: '14px',
              backgroundColor: '#F8F5FF',
              border: '1.5px solid #EAE5FC',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1E1B4B',
                fontWeight: 800,
                fontSize: '13px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>🪙</span>
              <span>Tu saldo</span>
            </span>
            <span
              style={{
                color: '#7C28BE',
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '0.02em',
              }}
            >
              {coins}
            </span>
          </div>

          {/* 2. 4 Pestañas Superiores (Imagen 2) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '14px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {[
              { id: 'avatar', lbl: 'PERSONAJES', ico: '👤' },
              { id: 'mascota', lbl: 'MASCOTAS', ico: '🐾' },
              { id: 'fondo', lbl: 'FONDOS', ico: '🌌' },
              { id: 'power', lbl: 'POWER-UPS', ico: '⚡' },
            ].map((tb) => {
              const isActive = activeTab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setActiveTab(tb.id as typeof activeTab)}
                  style={{
                    height: '54px',
                    borderRadius: '16px',
                    border: isActive ? '2px solid #7C28BE' : '2px solid #E8DBFF',
                    backgroundColor: isActive ? '#7C28BE' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#6C28B4',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    padding: '4px 6px',
                    boxShadow: isActive ? '0 4px 12px rgba(124, 40, 190, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1, userSelect: 'none' }}>{tb.ico}</span>
                  {tb.id === 'power' ? (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        lineHeight: 1.05,
                        textAlign: 'center',
                      }}
                    >
                      POWER-<br />UPS
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        lineHeight: 1.1,
                        textAlign: 'center',
                      }}
                    >
                      {tb.lbl}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Letrero de ACCESORIOS: Cápsula rounded-full con separación (Imagen 3) */}
          <div style={{ marginBottom: '18px', width: '100%', boxSizing: 'border-box' }}>
            <button
              type="button"
              onClick={() => setActiveTab('access')}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '9999px',
                border: activeTab === 'access' ? '2px solid #7C28BE' : '2px solid #E8DBFF',
                backgroundColor: activeTab === 'access' ? '#7C28BE' : '#FFFFFF',
                color: activeTab === 'access' ? '#FFFFFF' : '#6C28B4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxSizing: 'border-box',
                padding: '0 16px',
                boxShadow: activeTab === 'access' ? '0 4px 12px rgba(124, 40, 190, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>💎</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                ACCESORIOS
              </span>
            </button>
          </div>

          {/* 4. Grilla de Artículos: 4 Columnas idéntica a Imagen 1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              paddingBottom: '10px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {currentItems.map((item) => {
              const isOwned = !!ownedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleBuyOrEquip(item)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isOwned ? '2px solid #8B5CF6' : '2px solid #E8DBFF',
                    borderRadius: '18px',
                    padding: '14px 6px 12px 6px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '158px',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(108, 40, 180, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* Emoji Avatar */}
                  <div
                    style={{
                      fontSize: '38px',
                      lineHeight: 1,
                      margin: '4px 0 6px 0',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.emoji}
                  </div>

                  {/* Nombre */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#100344',
                      textAlign: 'center',
                      lineHeight: 1.25,
                      minHeight: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {item.name}
                  </div>

                  {/* Píldora de Precio o Comprado */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    {isOwned ? (
                      <span
                        style={{
                          backgroundColor: '#DCF5EE',
                          color: '#074F3A',
                          fontSize: '11px',
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          display: 'inline-block',
                          lineHeight: 1.2,
                        }}
                      >
                        Comprado
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: '#FEEDDB',
                          color: '#E06A02',
                          fontSize: '11px',
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          lineHeight: 1.2,
                        }}
                      >
                        <span>{item.price}</span>
                        <span style={{ fontSize: '11px' }}>🪙</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
