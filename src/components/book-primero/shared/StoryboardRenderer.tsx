'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface StoryboardConfig {
  type: 'count' | 'add' | 'sub' | 'compare' | 'jump' | 'decena' | 'docena';
  title?: string;
  captions?: string[];
  emoji?: string;
  count?: number;
  a?: number;
  b?: number;
  start?: number;
  end?: number;
  step?: number;
}

/**
 * Infiere la configuración del Storyboard a partir de la pregunta y la respuesta.
 * Réplica exacta de la lógica de FEDOR_1RO_STORYBOARD_FRAMEWORK de MatematicasDeFedor_1.html.
 */
export function inferSb(qRaw: string, aRaw: string | number): StoryboardConfig | null {
  const qStr = qRaw || '';
  const q = qStr.toLowerCase();
  const a = String(aRaw ?? '').trim();

  // Detección de emoji: primero desde la pregunta directamente
  let em = '⭐';
  const emojiMatch = qStr.match(/([\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}])/u);
  if (emojiMatch) {
    em = emojiMatch[1];
  } else if (/manzanas?/i.test(q)) em = '🍎';
  else if (/estrellas?/i.test(q)) em = '⭐';
  else if (/pollit/i.test(q)) em = '🐣';
  else if (/pl[aá]tanos?/i.test(q)) em = '🍌';
  else if (/naranjas?/i.test(q)) em = '🍊';
  else if (/uvas?/i.test(q)) em = '🍇';
  else if (/perros?/i.test(q)) em = '🐶';
  else if (/gatos?/i.test(q)) em = '🐱';
  else if (/globos?/i.test(q)) em = '🎈';
  else if (/flores?/i.test(q)) em = '🌸';
  else if (/mariposas?/i.test(q)) em = '🦋';
  else if (/hormigas?/i.test(q)) em = '🐜';
  else if (/peces?/i.test(q)) em = '🐟';
  else if (/dulces?|caramelos?/i.test(q)) em = '🍬';
  else if (/regalos?/i.test(q)) em = '🎁';

  // Decena
  if (/decena/i.test(q)) {
    return {
      type: 'decena',
      title: 'La Decena',
      captions: ['10 unidades sueltas', 'Las agrupamos', '1 Decena = 10 U'],
    };
  }

  // Docena
  if (/docena/i.test(q)) {
    return {
      type: 'docena',
      title: 'La Docena',
      captions: ['12 objetos', 'Los empacamos', '1 Docena = 12'],
    };
  }

  // Suma
  const mAdd = q.match(/(\d+)\s*\+\s*(\d+)/);
  if (mAdd) {
    const a1 = parseInt(mAdd[1], 10);
    const b1 = parseInt(mAdd[2], 10);
    if (a1 <= 9 && b1 <= 9) {
      return {
        type: 'add',
        a: a1,
        b: b1,
        emoji: em,
        title: `Suma ${a1} + ${b1}`,
        captions: [`Grupo 1: ${a1} ${em}`, `Grupo 2: ${b1} ${em}`, `Total: ${a1 + b1}`],
      };
    }
  }

  // Resta
  const mSub = q.match(/(\d+)\s*[-−]\s*(\d+)/);
  if (mSub) {
    const a2 = parseInt(mSub[1], 10);
    const b2 = parseInt(mSub[2], 10);
    if (a2 <= 15 && b2 <= 9) {
      return {
        type: 'sub',
        a: a2,
        b: b2,
        emoji: em,
        title: `Resta ${a2} - ${b2}`,
        captions: [`Tenemos ${a2}`, `Quitamos ${b2}`, `Quedan ${a2 - b2}`],
      };
    }
  }

  // Comparar
  if (/mayor|menor/i.test(q)) {
    const mAB = q.match(/(\d+)\s*(?:u|o|y|,)\s*(\d+)/i);
    if (mAB) {
      const va = parseInt(mAB[1], 10);
      const vb = parseInt(mAB[2], 10);
      return {
        type: 'compare',
        a: va,
        b: vb,
        emoji: em,
        title: 'Comparación',
        captions: [`Primer número: ${va}`, 'Comparamos', `Mayor: ${Math.max(va, vb)}`],
      };
    }
  }

  // Secuencia
  const mSeq = q.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*\?/);
  if (mSeq) {
    const n1 = parseInt(mSeq[1], 10);
    const n2 = parseInt(mSeq[2], 10);
    const d = n2 - n1;
    const next = parseInt(a, 10);
    if (d > 0 && next <= 20 && !isNaN(next)) {
      return {
        type: 'jump',
        start: 0,
        end: next,
        step: d,
        title: `De ${d} en ${d}`,
        captions: ['Empezamos', `🐸 salta de ${d} en ${d}`, `Llegamos a ${next}`],
      };
    }
  }

  // Contar
  const mCount = a.match(/^(\d+)$/);
  if (/¿cuánt(o|a)s?/i.test(q) && mCount && parseInt(mCount[1], 10) <= 10) {
    const n = parseInt(mCount[1], 10);
    return {
      type: 'count',
      count: n,
      emoji: em,
      title: `Cuenta ${em}`,
      captions: [`Mira los ${em}`, 'Cuenta 1, 2, 3…', `Total: ${n}`],
    };
  }

  // Fallback para conteo / visualización numérica de hasta 10
  if (mCount && parseInt(mCount[1], 10) <= 10) {
    const n2 = parseInt(mCount[1], 10);
    const kidEmojis = ['🐬', '🍌', '🚗', '🚢', '✈️', '🪙', '🍎', '🎈', '🌸', '🐶', '🐱', '🐣', '🦋', '🌟', '⭐'];
    const pickedEmoji = em && em !== '⭐' ? em : kidEmojis[n2 % kidEmojis.length];
    return {
      type: 'count',
      count: n2,
      emoji: pickedEmoji,
      title: `Cuenta ${pickedEmoji}`,
      captions: ['Observa', (n2 === 1 ? 'Cuenta el número 1' : 'Cuenta 1, 2, 3…'), `¡Total! ${n2}`],
    };
  }

  return null;
}

// ═══ GENERADORES SVG ═══

function buildCountPanels(cfg: StoryboardConfig): [string, string, string] {
  const n = Math.max(1, Math.min(cfg.count || 1, 10));
  const kidRotate = ['🐬', '🍌', '🚗', '🚢', '✈️', '🪙', '🍎', '🎈', '🌸', '🐣'];
  const em = cfg.emoji || kidRotate[n % kidRotate.length];
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function positions(count: number) {
    let cols: number;
    let rows: number;
    if (count === 1) {
      cols = 1;
      rows = 1;
    } else if (count === 2) {
      cols = 2;
      rows = 1;
    } else if (count <= 4) {
      cols = 2;
      rows = 2;
    } else if (count <= 6) {
      cols = 3;
      rows = 2;
    } else if (count <= 9) {
      cols = 3;
      rows = 3;
    } else {
      cols = 5;
      rows = 2;
    }
    const pts = [];
    const xGap = 60 / Math.max(1, cols);
    const yGap = 30 / Math.max(1, rows);
    const xStart = 50 - ((cols - 1) * xGap) / 2;
    const yStart = 50 - ((rows - 1) * yGap) / 2;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pts.push({ x: xStart + col * xGap, y: yStart + row * yGap });
    }
    return pts;
  }

  const pts = positions(n);
  const fontSize = n === 1 ? 40 : n <= 4 ? 18 : n <= 6 ? 14 : 11;

  // Panel 1: Observa
  let p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="7" fill="#7A4400" font-weight="bold">${n === 1 ? 'Observa' : 'Observa los elementos'}</text>`;
  pts.forEach((p) => {
    p1 += `<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="${fontSize}" class="sb-anim-pop">${em}</text>`;
  });
  p1 += '</svg>';

  // Panel 2: Cuenta 1, 2, 3...
  let p2 = `${svgOpen}<rect width="100" height="100" fill="#EEF0FF"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="7" fill="#3D1468" font-weight="bold">Cuenta ${n === 1 ? 'el número 1' : '1, 2' + (n >= 3 ? '…' : '')}</text>`;
  const badgeR = n <= 3 ? 5 : 4;
  const badgeF = n <= 3 ? 7 : 6;
  const badgeOff = n === 1 ? 12 : 8;
  pts.forEach((p, i) => {
    p2 += `<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="${fontSize}">${em}</text>`;
    p2 += `<circle cx="${p.x + badgeOff}" cy="${p.y - badgeOff + 2}" r="${badgeR}" fill="#7B2FBE"/>`;
    p2 += `<text x="${p.x + badgeOff}" y="${p.y - badgeOff + 5}" text-anchor="middle" font-size="${badgeF}" fill="#fff" font-weight="bold">${i + 1}</text>`;
  });
  p2 += '</svg>';

  // Panel 3: ¡Total!
  let p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="7" fill="#0F5D2B" font-weight="bold">¡Total!</text>' +
    '<circle cx="50" cy="50" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    `<text x="50" y="60" text-anchor="middle" font-size="30" fill="#fff" font-weight="bold" class="sb-anim-pop">${n}</text>`;
  if (n <= 5) {
    let emStr = '';
    for (let k = 0; k < n; k++) emStr += em;
    p3 += `<text x="50" y="92" text-anchor="middle" font-size="10">${emStr}</text>`;
  } else {
    p3 += `<text x="50" y="92" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">${n} ${em}</text>`;
  }
  p3 += '</svg>';

  return [p1, p2, p3];
}

function buildAddPanels(cfg: StoryboardConfig): [string, string, string] {
  const a = cfg.a || 1;
  const b = cfg.b || 1;
  const em = cfg.emoji || '🍎';
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function grp(count: number, cx: number, cy: number, size: number) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      out += `<text x="${cx - 12 + col * 10}" y="${cy + row * 10}" text-anchor="middle" font-size="${size}">${em}</text>`;
    }
    return out;
  }

  const p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">Grupo 1: ${a}</text>` +
    '<circle cx="50" cy="55" r="30" fill="#FFE4A8" stroke="#F0C674" stroke-width="2"/>' +
    `${grp(a, 50, 45, 10)}</svg>`;

  const p2 = `${svgOpen}<rect width="100" height="100" fill="#EEF0FF"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="8" fill="#3D1468" font-weight="bold">Grupo 2: ${b}</text>` +
    '<circle cx="50" cy="55" r="30" fill="#D6DCFF" stroke="#7B2FBE" stroke-width="2"/>' +
    `${grp(b, 50, 45, 10)}</svg>`;

  const total = a + b;
  let p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">${a} + ${b} = ${total}</text>` +
    '<circle cx="50" cy="55" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    `<text x="50" y="66" text-anchor="middle" font-size="26" fill="#fff" font-weight="bold" class="sb-anim-pop">${total}</text>`;
  if (total <= 6) {
    p3 += `<text x="50" y="92" text-anchor="middle" font-size="10">${em.repeat(total)}</text>`;
  } else {
    p3 += `<text x="50" y="92" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">${total} ${em}</text>`;
  }
  p3 += '</svg>';

  return [p1, p2, p3];
}

function buildSubPanels(cfg: StoryboardConfig): [string, string, string] {
  const a = cfg.a || 2;
  const b = cfg.b || 1;
  const em = cfg.emoji || '🍬';
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function grpMark(n: number, take: number) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const cx = 22 + col * 18;
      const cy = 40 + row * 14;
      const isTaken = i >= n - take;
      out += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="10" opacity="${isTaken ? '.35' : '1'}">${em}</text>`;
      if (isTaken) {
        out += `<line x1="${cx - 6}" y1="${cy - 5}" x2="${cx + 6}" y2="${cy + 5}" stroke="#E24B4A" stroke-width="2"/>`;
      }
    }
    return out;
  }

  const p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">Tenemos ${a}</text>` +
    `${grpMark(a, 0)}</svg>`;

  const p2 = `${svgOpen}<rect width="100" height="100" fill="#FEE8E4"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#7A1B00" font-weight="bold">Quitamos ${b}</text>` +
    `${grpMark(a, b)}</svg>`;

  const rest = a - b;
  const p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">Quedan: ${rest}</text>` +
    '<circle cx="50" cy="55" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    `<text x="50" y="66" text-anchor="middle" font-size="26" fill="#fff" font-weight="bold" class="sb-anim-pop">${rest}</text>` +
    '</svg>';

  return [p1, p2, p3];
}

function buildComparePanels(cfg: StoryboardConfig): [string, string, string] {
  const a = cfg.a || 1;
  const b = cfg.b || 2;
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function bar(n: number, cx: number) {
    const maxN = Math.max(a, b, 1);
    const maxH = 55;
    const h = (n / maxN) * maxH;
    return (
      `<rect x="${cx - 15}" y="${85 - h}" width="30" height="${h}" fill="#7B2FBE" rx="4"/>` +
      `<text x="${cx}" y="${85 - h - 4}" text-anchor="middle" font-size="11" fill="#3D1468" font-weight="bold">${n}</text>`
    );
  }

  const p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">A = ${a}</text>` +
    `${bar(a, 50)}</svg>`;

  const maxVal = Math.max(a, b, 1);
  const p2 = `${svgOpen}<rect width="100" height="100" fill="#EEF0FF"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#3D1468" font-weight="bold">Comparemos</text>' +
    `<rect x="10" y="${85 - (a / maxVal) * 55}" width="30" height="${(a / maxVal) * 55}" fill="#F0C674" rx="4"/>` +
    `<text x="25" y="${82 - (a / maxVal) * 55}" text-anchor="middle" font-size="9" fill="#7A4400" font-weight="bold">${a}</text>` +
    `<rect x="60" y="${85 - (b / maxVal) * 55}" width="30" height="${(b / maxVal) * 55}" fill="#7B2FBE" rx="4"/>` +
    `<text x="75" y="${82 - (b / maxVal) * 55}" text-anchor="middle" font-size="9" fill="#3D1468" font-weight="bold">${b}</text>` +
    '</svg>';

  const win = a > b ? a : b;
  const p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">Mayor: ${win}</text>` +
    '<circle cx="50" cy="55" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    `<text x="50" y="66" text-anchor="middle" font-size="26" fill="#fff" font-weight="bold">${win}</text>` +
    '<text x="50" y="92" text-anchor="middle" font-size="10">🏆</text>' +
    '</svg>';

  return [p1, p2, p3];
}

function buildJumpPanels(cfg: StoryboardConfig): [string, string, string] {
  const start = cfg.start || 0;
  const end = cfg.end || 6;
  const step = cfg.step || 2;
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
  const arrDef = '<defs><marker id="sbArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#E24B4A"/></marker></defs>';

  function line(showJumps: boolean) {
    let out = '<line x1="10" y1="60" x2="90" y2="60" stroke="#333" stroke-width="1.5"/>';
    const max = Math.max(end + 2, 8);
    for (let n = 0; n <= max; n++) {
      const x = 10 + (n / max) * 80;
      out += `<line x1="${x}" y1="57" x2="${x}" y2="63" stroke="#333" stroke-width="1"/>`;
      if (n % 2 === 0 || n === end) {
        out += `<text x="${x}" y="75" text-anchor="middle" font-size="7" fill="#333">${n}</text>`;
      }
    }
    if (showJumps) {
      for (let n = start; n < end; n += step) {
        const x1 = 10 + (n / max) * 80;
        const x2 = 10 + ((n + step) / max) * 80;
        const xm = (x1 + x2) / 2;
        out += `<path d="M ${x1} 60 Q ${xm} 30 ${x2} 60" stroke="#E24B4A" stroke-width="1.5" fill="none" marker-end="url(#sbArr)"/>`;
      }
    }
    return out;
  }

  const p1 = `${svgOpen}${arrDef}<rect width="100" height="100" fill="#FEF4D2"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">Recta numérica</text>' +
    `${line(false)}<text x="10" y="52" text-anchor="middle" font-size="16">🐸</text></svg>`;

  const p2 = `${svgOpen}${arrDef}<rect width="100" height="100" fill="#EEF0FF"/>` +
    `<text x="50" y="14" text-anchor="middle" font-size="8" fill="#3D1468" font-weight="bold">Salta de ${step} en ${step}</text>` +
    `${line(true)}</svg>`;

  const p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    `<text x="50" y="16" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">Llegó a ${end}</text>` +
    '<circle cx="50" cy="55" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    `<text x="50" y="66" text-anchor="middle" font-size="26" fill="#fff" font-weight="bold">${end}</text>` +
    '</svg>';

  return [p1, p2, p3];
}

function buildDecenaPanels(): [string, string, string] {
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function ten() {
    let out = '';
    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      out += `<circle cx="${25 + col * 12}" cy="${45 + row * 14}" r="4" fill="#F0C674" stroke="#7A4400" stroke-width="1"/>`;
    }
    return out;
  }

  const p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">10 unidades</text>' +
    `${ten()}</svg>`;

  const p2 = `${svgOpen}<rect width="100" height="100" fill="#EEF0FF"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#3D1468" font-weight="bold">Agrupamos ▼</text>' +
    '<rect x="25" y="35" width="50" height="45" fill="#D6DCFF" stroke="#7B2FBE" stroke-width="2" stroke-dasharray="3 2" rx="6"/>' +
    `${ten()}</svg>`;

  const p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">= 1 Decena</text>' +
    '<rect x="30" y="30" width="40" height="60" fill="#4CAF50" rx="6" class="sb-anim-pop"/>' +
    '<text x="50" y="55" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">1 D</text>' +
    '<text x="50" y="75" text-anchor="middle" font-size="8" fill="#fff">= 10 U</text>' +
    '</svg>';

  return [p1, p2, p3];
}

function buildDocenaPanels(): [string, string, string] {
  const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

  function twelve() {
    let out = '';
    for (let i = 0; i < 12; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      out += `<text x="${22 + col * 18}" y="${42 + row * 18}" text-anchor="middle" font-size="12">🥚</text>`;
    }
    return out;
  }

  const p1 = `${svgOpen}<rect width="100" height="100" fill="#FEF4D2"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#7A4400" font-weight="bold">Contamos huevos</text>' +
    `${twelve()}</svg>`;

  const p2 = `${svgOpen}<rect width="100" height="100" fill="#EEF0FF"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#3D1468" font-weight="bold">Los agrupamos</text>' +
    '<rect x="12" y="20" width="76" height="72" fill="#F0C674" stroke="#7A4400" stroke-width="2" rx="6"/>' +
    `${twelve()}</svg>`;

  const p3 = `${svgOpen}<rect width="100" height="100" fill="#E8F8E5"/>` +
    '<text x="50" y="14" text-anchor="middle" font-size="8" fill="#0F5D2B" font-weight="bold">= 1 Docena</text>' +
    '<circle cx="50" cy="55" r="26" fill="#4CAF50" class="sb-anim-pop"/>' +
    '<text x="50" y="60" text-anchor="middle" font-size="22" fill="#fff" font-weight="bold">12</text>' +
    '<text x="50" y="75" text-anchor="middle" font-size="9" fill="#fff">huevos</text>' +
    '</svg>';

  return [p1, p2, p3];
}

function buildPanels(cfg: StoryboardConfig): [string, string, string] {
  switch (cfg.type) {
    case 'count':
      return buildCountPanels(cfg);
    case 'add':
      return buildAddPanels(cfg);
    case 'sub':
      return buildSubPanels(cfg);
    case 'compare':
      return buildComparePanels(cfg);
    case 'jump':
      return buildJumpPanels(cfg);
    case 'decena':
      return buildDecenaPanels();
    case 'docena':
      return buildDocenaPanels();
    default:
      return buildCountPanels(cfg);
  }
}

/**
 * Componente interactivo del Storyboard con 3 paneles animados
 */
export default function StoryboardRenderer({ cfg }: { cfg: StoryboardConfig }) {
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const panels = buildPanels(cfg);
  const captions = cfg.captions || ['Panel 1', 'Panel 2', 'Panel 3'];

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handlePlay = () => {
    clearTimers();
    setActiveIdx(0);
    timersRef.current.push(
      setTimeout(() => setActiveIdx(1), 1400),
      setTimeout(() => setActiveIdx(2), 2800)
    );
  };

  const handleSelectPanel = (idx: number) => {
    clearTimers();
    setActiveIdx(idx);
  };

  const currentCaption =
    activeIdx >= 0 && captions[activeIdx]
      ? captions[activeIdx]
      : 'Presiona ▶ Ver para animar';

  return (
    <div
      className="sb-container"
      style={{
        margin: '12px 0 10px',
        padding: '12px',
        background: 'linear-gradient(135deg, #FFF8E7, #FFE4A8)',
        border: '2px solid #F0C674',
        borderRadius: '16px',
        fontFamily: "'Nunito', sans-serif",
        boxShadow: '0 4px 12px rgba(240, 198, 116, 0.25)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#7A4400',
            flex: 1,
            fontFamily: "'Baloo 2', sans-serif",
            textAlign: 'left',
          }}
        >
          🎬 {cfg.title || 'Mini-cómic didáctico'}
        </div>
        <button
          type="button"
          onClick={handlePlay}
          style={{
            background: 'linear-gradient(135deg, #7B2FBE, #E24B4A)',
            color: '#fff',
            border: 'none',
            borderRadius: '99px',
            padding: '5px 14px',
            fontSize: '11px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(123, 47, 190, 0.35)',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ▶ Ver
        </button>
      </div>

      {/* 3 Paneles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          marginBottom: '8px',
        }}
      >
        {panels.map((svgHtml, idx) => {
          const isActive = activeIdx === idx;
          const isDimmed = activeIdx !== -1 && !isActive;
          return (
            <div
              key={idx}
              onClick={() => handleSelectPanel(idx)}
              style={{
                background: '#FFF',
                border: isActive ? '2.5px solid #7B2FBE' : '2px solid #F0C674',
                borderRadius: '12px',
                padding: '6px',
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                opacity: isDimmed ? 0.5 : 1,
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isActive ? '0 0 0 3px rgba(123, 47, 190, 0.25)' : 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '6px',
                  background: '#7B2FBE',
                  color: '#fff',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  zIndex: 2,
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            </div>
          );
        })}
      </div>

      {/* Caption bar */}
      <div
        style={{
          background: '#FFF',
          borderRadius: '10px',
          padding: '6px 10px',
          fontSize: '12px',
          color: '#3D1468',
          fontWeight: 800,
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          border: '2px dashed #C5BFEE',
          lineHeight: 1.3,
        }}
      >
        {currentCaption}
      </div>
    </div>
  );
}
