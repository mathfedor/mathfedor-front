'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';
import type { ShopCategory, ShopItem } from '@/types/gamification.types';

const TABS: Array<{ id: ShopCategory; label: string }> = [
  { id: 'casco', label: '🪖 Cascos' },
  { id: 'traje', label: '🦸 Trajes' },
  { id: 'mascota', label: '🐉 Mascotas' },
  { id: 'nave', label: '🚀 Naves' },
];

/** Tienda espacial: comprar y equipar ítems con monedas. */
export default function ShopScreen() {
  const { catalog, progress, goScreen, buyItem, equipItem } = useBook();
  const [tab, setTab] = useState<ShopCategory>('casco');
  if (!catalog || !progress) return null;

  const g = progress.gamification;
  const items = catalog.shopItems.filter((it) => it.cat === tab);

  return (
    <div className="screen active" id="screen-shop">
      <div className="back-row" onClick={() => goScreen('home')}>← Volver al inicio</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, fontWeight: 900 }}>🛒 Tienda espacial</div>
        <div style={{ fontWeight: 900, color: 'var(--orange)' }}>{g.coins}🪙</div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ padding: '8px 14px', borderRadius: 999, fontWeight: 800, fontSize: 12, cursor: 'pointer', border: '1.5px solid var(--border)', background: tab === t.id ? 'var(--purple)' : 'var(--white)', color: tab === t.id ? '#fff' : 'var(--text)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
        {items.map((item) => (
          <ShopCard
            key={item.id}
            item={item}
            owned={g.shop.owned.includes(item.id)}
            equipped={g.shop.equipped[item.cat] === item.id}
            canBuy={g.coins >= item.price && g.totalXP >= item.unlockXP}
            xpLocked={g.totalXP < item.unlockXP}
            onBuy={() => buyItem(item)}
            onEquip={() => equipItem(item)}
          />
        ))}
      </div>
    </div>
  );
}

interface CardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  canBuy: boolean;
  xpLocked: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

function ShopCard({ item, owned, equipped, canBuy, xpLocked, onBuy, onEquip }: CardProps) {
  return (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--r-md)', padding: '14px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: equipped ? '2px solid var(--purple)' : '2px solid transparent' }}>
      <div style={{ fontSize: 40 }}>{item.emoji}</div>
      <div style={{ fontWeight: 900, fontSize: 13 }}>{item.name}</div>
      <div style={{ fontSize: 10, color: 'var(--muted)', minHeight: 28, margin: '4px 0' }}>{item.desc}</div>
      {owned ? (
        <button className="btn-secondary" style={{ width: '100%', fontSize: 12 }} onClick={onEquip} disabled={equipped}>
          {equipped ? '✅ Equipado' : 'Equipar'}
        </button>
      ) : (
        <button
          className="btn-primary"
          style={{ width: '100%', fontSize: 12, opacity: canBuy ? 1 : 0.5 }}
          onClick={onBuy}
          disabled={!canBuy}
        >
          {xpLocked ? `🔒 ${item.unlockXP} XP` : `${item.price}🪙`}
        </button>
      )}
    </div>
  );
}
