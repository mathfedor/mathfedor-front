'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import Swal from 'sweetalert2';

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  avatar?: string;
  desc: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'helm_basic', emoji: '🧑‍🚀', name: 'Casco básico', price: 0, avatar: '🧑‍🚀', desc: 'Tu casco clásico de explorador estelar.' },
  { id: 'helm_girl', emoji: '👩‍🚀', name: 'Astronauta Pro', price: 50, avatar: '👩‍🚀', desc: 'Para valientes exploradoras espaciales.' },
  { id: 'pet_cat', emoji: '🐱', name: 'Michi Galáctico', price: 60, avatar: '🐱', desc: 'Un tierno gatito con traje presurizado.' },
  { id: 'pet_dog', emoji: '🐶', name: 'Perrito Cósmico', price: 60, avatar: '🐶', desc: 'El mejor amigo del astronauta en órbita.' },
  { id: 'pet_fox', emoji: '🦊', name: 'Zorro Estelar', price: 80, avatar: '🦊', desc: 'Ágil y veloz entre las constelaciones.' },
  { id: 'pet_lion', emoji: '🦁', name: 'León Solar', price: 100, avatar: '🦁', desc: 'El rey supremo de la galaxia.' },
  { id: 'pet_dragon', emoji: '🐉', name: 'Dragón del Espacio', price: 150, avatar: '🐉', desc: 'Guardián mítico de los números cósmicos.' },
  { id: 'pet_robot', emoji: '🤖', name: 'Droide Fedor', price: 120, avatar: '🤖', desc: 'Asistente robótico experto en matemáticas.' },
];

export default function ShopScreen1ro() {
  const { student, coins, selectAvatar, updateStats, goScreen } = useBook1();
  const [owned, setOwned] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fedor1_owned_items');
      return saved ? JSON.parse(saved) : ['helm_basic'];
    } catch {
      return ['helm_basic'];
    }
  });

  const handleBuy = (item: ShopItem) => {
    if (owned.includes(item.id)) {
      if (item.avatar) {
        selectAvatar(item.avatar);
        Swal.fire({
          icon: 'success',
          title: '¡Equipado!',
          text: `Ahora tu avatar es ${item.emoji} ${item.name}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
      return;
    }

    if (coins < item.price) {
      Swal.fire({
        icon: 'info',
        title: 'Monedas insuficientes',
        text: `Necesitas ${item.price} 🪙 pero tienes ${coins} 🪙. ¡Resuelve lecciones para ganar más!`,
      });
      return;
    }

    const nextOwned = [...owned, item.id];
    setOwned(nextOwned);
    try {
      localStorage.setItem('fedor1_owned_items', JSON.stringify(nextOwned));
    } catch {}

    updateStats(-item.price, 0, 0);

    if (item.avatar) {
      selectAvatar(item.avatar);
    }

    Swal.fire({
      icon: 'success',
      title: '¡Compra exitosa!',
      text: `Has desbloqueado ${item.name} por ${item.price} 🪙.`,
    });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => goScreen('home')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDD8F5',
            color: '#7B2FBE',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,47,190,0.1)',
          }}
        >
          ← Volver al Inicio
        </button>
        <div style={{ background: '#FEF3E8', border: '1.5px solid #FFD66B', borderRadius: '18px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🪙</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#7A3200' }}>{coins}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#7A3200' }}>monedas</span>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg,#0A4030,#16876A,#24C496)',
          borderRadius: '22px',
          padding: '1.5rem',
          color: '#fff',
          boxShadow: '0 12px 40px rgba(22,135,106,.4)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#FFE066', letterSpacing: '.12em' }}>
            🛒 TIENDA INTERESTELAR
          </div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '24px', fontWeight: 900 }}>
            Equipa a tu Astronauta
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.85)', marginTop: '2px' }}>
            Usa tus monedas de 1° grado para desbloquear avatares y trajes especiales.
          </div>
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#7B2FBE,#A864E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 4px 18px rgba(0,0,0,.3)',
          }}
        >
          {student?.avatar || '🧑‍🚀'}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        {SHOP_ITEMS.map((item) => {
          const isOwned = owned.includes(item.id);
          const isEquipped = student?.avatar === item.avatar;

          return (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.2rem 1rem',
                border: isEquipped ? '2.5px solid #24C496' : isOwned ? '2px solid #FFD66B' : '1.5px solid #DDD8F5',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(108,40,180,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '48px', margin: '4px 0 8px' }}>{item.emoji}</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '16px', fontWeight: 900, color: '#2A0F60' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '11px', color: '#666', margin: '4px 0 10px', minHeight: '32px' }}>
                {item.desc}
              </div>

              <button
                type="button"
                onClick={() => handleBuy(item)}
                style={{
                  width: '100%',
                  background: isEquipped
                    ? '#24C496'
                    : isOwned
                    ? 'linear-gradient(135deg, #7B2FBE, #A864E8)'
                    : 'linear-gradient(135deg, #E8650A, #FF8C2A)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {isEquipped ? '✓ Puesto' : isOwned ? 'Equipar' : `Comprar · ${item.price} 🪙`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
