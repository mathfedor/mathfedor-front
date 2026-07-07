export interface Sticker {
  id: string;
  e: string;
  name: string;
}

export const STICKERS: Sticker[] = [
  { id: 'st_dragon', e: '🐲', name: 'Dragoncito' },
  { id: 'st_unicor', e: '🦄', name: 'Unicornio' },
  { id: 'st_buho', e: '🦉', name: 'Búho Sabio' },
  { id: 'st_robot', e: '🤖', name: 'Robot Amigo' },
  { id: 'st_corona', e: '👑', name: 'Corona' },
  { id: 'st_estrella', e: '🌟', name: 'Estrellita' },
  { id: 'st_mago', e: '🧙', name: 'Mago' },
  { id: 'st_principe', e: '🤴', name: 'Príncipe' },
  { id: 'st_astro', e: '👨‍🚀', name: 'Astronauta' },
  { id: 'st_dinos', e: '🦕', name: 'Dinosaurio' },
  { id: 'st_arcoiris', e: '🌈', name: 'Arcoíris' },
  { id: 'st_cohete', e: '🚀', name: 'Cohete' },
  { id: 'st_planeta', e: '🪐', name: 'Planeta' },
  { id: 'st_luna', e: '🌙', name: 'Luna' },
  { id: 'st_galaxy', e: '🌌', name: 'Galaxia' },
  { id: 'st_medall', e: '🏅', name: 'Medalla' },
  { id: 'st_trofeo', e: '🏆', name: 'Trofeo' },
  { id: 'st_helado', e: '🍦', name: 'Helado' },
  { id: 'st_torta', e: '🍰', name: 'Torta' },
  { id: 'st_pizza', e: '🍕', name: 'Pizza' },
];

export function getStickerState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const v = localStorage.getItem('fedor1_stickers');
    return v ? JSON.parse(v) : {};
  } catch (e) {
    return {};
  }
}

export function saveStickerState(s: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('fedor1_stickers', JSON.stringify(s));
  } catch (e) {}
}

export function unlockRandomSticker(): Sticker | null {
  const st = getStickerState();
  const locked = STICKERS.filter((s) => !st[s.id]);
  if (!locked.length) return null;
  const pick = locked[Math.floor(Math.random() * locked.length)];
  st[pick.id] = true;
  saveStickerState(st);
  return pick;
}

export function resetStickers() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('fedor1_stickers');
  } catch (e) {}
}
