'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideosModal4toProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntro?: () => void;
}

interface RawVideoTopic {
  k: string;
  t: string;
  frames: [string, string][];
}

interface VideoFrame {
  text: string;
  subt: string;
  isDraw?: boolean;
}

interface VideoOperation {
  a: number;
  b: number;
  op: string;
  r: number;
}

// ── 25 Videos temáticos originales del 4° grado ──
const RAW_VIDEO_TOPICS: RawVideoTopic[] = [
  {
    k: 'adicion_basica',
    t: 'Adición Básica · 4°',
    frames: [
      ['Ejemplo: 234 + 512', 'Observa la suma'],
      ['  234\n+ 512\n─────', 'Escribe en columna'],
      ['  234\n+ 512\n─────\n    6', 'Unidades: 4+2=6'],
      ['  234\n+ 512\n─────\n   46', 'Decenas: 3+1=4'],
      ['  234\n+ 512\n─────\n  746', 'Centenas: 2+5=7'],
      ['✅ 234 + 512 = 746', '¡Correcto!'],
    ],
  },
  {
    k: 'adicion_llevadas',
    t: 'Adición con Llevadas · 4°',
    frames: [
      ['Ejemplo: 456 + 278', 'Con llevadas'],
      ['  456\n+ 278\n─────', 'En columna'],
      ['  4 5 6\n+ 2 7 8\n─────\n      4', 'Unidades: 6+8=14, llevo 1'],
      ['  4 5 6\n+ 2 7 8\n─────\n    3 4', 'Decenas: 5+7+1=13, llevo 1'],
      ['  4 5 6\n+ 2 7 8\n─────\n  7 3 4', 'Centenas: 4+2+1=7'],
      ['✅ 456 + 278 = 734', 'Suma completa'],
    ],
  },
  {
    k: 'sustraccion_basica',
    t: 'Sustracción Básica · 4°',
    frames: [
      ['Ejemplo: 785 - 342', 'Resta simple'],
      ['  785\n- 342\n─────', 'Columnas'],
      ['  785\n- 342\n─────\n    3', '5-2=3'],
      ['  785\n- 342\n─────\n   43', '8-4=4'],
      ['  785\n- 342\n─────\n  443', '7-3=4'],
      ['✅ 785 - 342 = 443', 'Correcto'],
    ],
  },
  {
    k: 'sustraccion_prestamo',
    t: 'Sustracción con Préstamo · 4°',
    frames: [
      ['Ejemplo: 632 - 158', 'Con préstamo'],
      ['  632\n- 158\n─────', 'Vertical'],
      ['  6 3 2\n- 1 5 8\n─────\n      4', '2 no le quita a 8, pide prestado: 12-8=4'],
      ['  6 3 2\n- 1 5 8\n─────\n    7 4', 'Ahora quedan 2 decenas, pide prestado: 12-5=7'],
      ['  6 3 2\n- 1 5 8\n─────\n  4 7 4', '5-1=4 en centenas'],
      ['✅ 632 - 158 = 474', '¡Excelente!'],
    ],
  },
  {
    k: 'multi_1cifra',
    t: 'Multiplicación por 1 cifra · 4°',
    frames: [
      ['Ejemplo: 234 × 5', 'Multiplicación'],
      ['  234\n×   5\n─────', 'En columna'],
      ['  2 3 4\n×     5\n─────\n      0', '4×5=20, escribo 0 llevo 2'],
      ['  2 3 4\n×     5\n─────\n    7 0', '3×5=15+2=17, escribo 7 llevo 1'],
      ['  2 3 4\n×     5\n─────\n  1 1 7 0', '2×5=10+1=11'],
      ['✅ 234 × 5 = 1.170', 'Correcto'],
    ],
  },
  {
    k: 'multi_2cifras',
    t: 'Multiplicación por 2 cifras · 4°',
    frames: [
      ['Ejemplo: 45 × 23', 'Con 2 cifras'],
      ['  4 5\n× 2 3\n─────', 'Vertical'],
      ['   4 5\n×  2 3\n─────\n  1 3 5', 'Primero por 3: 45×3=135'],
      ['   4 5\n×  2 3\n─────\n  1 3 5\n+ 9 0', 'Luego por 20: 45×2=90 (decenas)'],
      ['   4 5\n×  2 3\n─────\n  1 3 5\n+ 9 0 _\n─────\n1 0 3 5', 'Suma final'],
      ['✅ 45 × 23 = 1.035', 'Producto'],
    ],
  },
  {
    k: 'division_exacta',
    t: 'División Exacta · 4°',
    frames: [
      ['Ejemplo: 84 ÷ 4', 'División'],
      ['84 | 4', 'Empezamos'],
      ['8÷4=2', 'Primer paso'],
      ['84 | 4\n8   | 2\n─\n 4', 'Bajamos el 4'],
      ['84 | 4\n8   | 21\n─\n 4\n 4\n─\n 0', '4÷4=1, resto 0'],
      ['✅ 84 ÷ 4 = 21', 'Exacta'],
    ],
  },
  {
    k: 'division_residuo',
    t: 'División con Residuo · 4°',
    frames: [
      ['Ejemplo: 97 ÷ 4', 'Con residuo'],
      ['97 | 4', 'Empezamos'],
      ['9÷4=2 (2×4=8, resta 1)', 'Primer paso'],
      ['97 | 4\n8   | 24\n─\n 17\n 16\n─\n  1', 'Bajamos 7, 17÷4=4 residuo 1'],
      ['✅ 97 ÷ 4 = 24 residuo 1', '24×4+1=97'],
    ],
  },
  {
    k: 'divisores',
    t: 'Divisores · 4°',
    frames: [
      ['Ejemplo: divisores de 12', 'Números que dividen a 12'],
      ['12 ÷ 1 = 12', '1 es divisor'],
      ['12 ÷ 2 = 6', '2 es divisor'],
      ['12 ÷ 3 = 4', '3 es divisor'],
      ['12 ÷ 4 = 3', '4 es divisor'],
      ['12 ÷ 6 = 2', '6 es divisor'],
      ['✅ 12 = {1, 2, 3, 4, 6, 12}', '6 divisores'],
    ],
  },
  {
    k: 'primos',
    t: 'Números Primos · 4°',
    frames: [
      ['Un número PRIMO tiene solo 2 divisores', '1 y él mismo'],
      ['2 = {1, 2}', 'Es primo'],
      ['3 = {1, 3}', 'Es primo'],
      ['5 = {1, 5}', 'Es primo'],
      ['7 = {1, 7}', 'Es primo'],
      ['11 = {1, 11}', 'Es primo'],
      ['✅ Primeros primos: 2, 3, 5, 7, 11, 13...', 'Recordar'],
    ],
  },
  {
    k: 'mcd',
    t: 'MCD · 4°',
    frames: [
      ['Ejemplo: MCD(12, 18)', 'Máximo Común Divisor'],
      ['Divisores de 12: 1, 2, 3, 4, 6, 12', 'Escribe'],
      ['Divisores de 18: 1, 2, 3, 6, 9, 18', 'Compara'],
      ['Comunes: 1, 2, 3, 6', 'Intersección'],
      ['El mayor común es 6', 'MCD'],
      ['✅ MCD(12, 18) = 6', 'Solución'],
    ],
  },
  {
    k: 'mcm',
    t: 'MCM · 4°',
    frames: [
      ['Ejemplo: MCM(4, 6)', 'Mínimo Común Múltiplo'],
      ['Múltiplos de 4: 4, 8, 12, 16, 20, 24', 'Lista'],
      ['Múltiplos de 6: 6, 12, 18, 24', 'Lista'],
      ['Comunes: 12, 24, ...', 'Coincidencias'],
      ['El menor común es 12', 'MCM'],
      ['✅ MCM(4, 6) = 12', 'Solución'],
    ],
  },
  {
    k: 'frac_simpl',
    t: 'Simplificar Fracciones · 4°',
    frames: [
      ['Ejemplo: 8/12', 'Simplificar'],
      ['MCD(8, 12) = 4', 'Buscar MCD'],
      ['8 ÷ 4 = 2', 'Numerador'],
      ['12 ÷ 4 = 3', 'Denominador'],
      ['✅ 8/12 = 2/3', 'Fracción reducida'],
    ],
  },
  {
    k: 'frac_homog',
    t: 'Fracciones Homogéneas · 4°',
    frames: [
      ['Ejemplo: 3/7 + 2/7', 'Mismo denominador'],
      ['Sumar solo numeradores', '3 + 2 = 5'],
      ['Denominador queda igual', '7'],
      ['✅ 3/7 + 2/7 = 5/7', 'Homogénea'],
    ],
  },
  {
    k: 'frac_heter',
    t: 'Fracciones Heterogéneas · 4°',
    frames: [
      ['Ejemplo: 1/2 + 1/3', 'Distinto denominador'],
      ['MCM(2, 3) = 6', 'Buscar MCM'],
      ['1/2 = 3/6', 'Convertir'],
      ['1/3 = 2/6', 'Convertir'],
      ['3/6 + 2/6 = 5/6', 'Sumar'],
      ['✅ 1/2 + 1/3 = 5/6', 'Resultado'],
    ],
  },
  {
    k: 'frac_multi',
    t: 'Multiplicación de Fracciones · 4°',
    frames: [
      ['Ejemplo: 2/3 × 4/5', 'Multiplicación'],
      ['Numerador × numerador: 2×4=8', 'Nueva parte'],
      ['Denominador × denominador: 3×5=15', 'Nuevo total'],
      ['✅ 2/3 × 4/5 = 8/15', 'Producto'],
    ],
  },
  {
    k: 'frac_div',
    t: 'División de Fracciones · 4°',
    frames: [
      ['Ejemplo: 2/3 ÷ 4/5', 'División'],
      ['Invertir la segunda: 4/5 → 5/4', 'Inverso'],
      ['Multiplicar: 2/3 × 5/4', 'Producto'],
      ['2×5=10, 3×4=12', 'Calcular'],
      ['✅ 2/3 ÷ 4/5 = 10/12 = 5/6', 'Simplificar'],
    ],
  },
  {
    k: 'sistema_metrico',
    t: 'Sistema Métrico · 4°',
    frames: [
      ['km, hm, dam, m, dm, cm, mm', 'Escala'],
      ['1 km = 1.000 m', 'Kilómetro'],
      ['1 m = 100 cm', 'Metro'],
      ['1 m = 1.000 mm', 'Milímetros'],
      ['Bajar (mayor → menor): ×10', 'Regla'],
      ['Subir (menor → mayor): ÷10', 'Regla'],
      ['✅ 5 m = 500 cm = 5.000 mm', 'Ejemplos'],
    ],
  },
  {
    k: 'perimetro',
    t: 'Perímetro · 4°',
    frames: [
      ['Perímetro = suma de lados', 'Definición'],
      ['Cuadrado L = 5 m', 'Ejemplo'],
      ['P = 4 × L = 4 × 5', 'Fórmula'],
      ['✅ P = 20 m', 'Cuadrado'],
      ['Rectángulo 6 × 4 m', 'Otro'],
      ['P = 2 × (6 + 4) = 20 m', 'Rectángulo'],
    ],
  },
  {
    k: 'area',
    t: 'Área de Figuras · 4°',
    frames: [
      ['Área = base × altura', 'Rectángulo'],
      ['Ejemplo: 8 m × 5 m', 'Datos'],
      ['A = 8 × 5', 'Multiplicar'],
      ['✅ A = 40 m²', 'Área rectángulo'],
      ['Cuadrado L = 6 m', 'Otro'],
      ['A = L² = 6 × 6', 'Fórmula'],
      ['✅ A = 36 m²', 'Cuadrado'],
    ],
  },
  {
    k: 'volumen',
    t: 'Volumen · 4°',
    frames: [
      ['Volumen = L × A × H', 'Prisma'],
      ['Ejemplo: 4 × 3 × 2 m', 'Datos'],
      ['V = 4 × 3 × 2', 'Multiplicar'],
      ['V = 24 m³', 'Resultado'],
      ['Cubo L = 3 m', 'Otro'],
      ['V = L³ = 27 m³', 'Cubo'],
    ],
  },
  {
    k: 'potencias',
    t: 'Potencias · 4°',
    frames: [
      ['Potencia: base ^ exponente', 'Definición'],
      ['Ejemplo: 2³', 'Base 2, exponente 3'],
      ['2³ = 2 × 2 × 2', 'Multiplicar 3 veces'],
      ['2 × 2 = 4', 'Primer paso'],
      ['4 × 2 = 8', 'Segundo'],
      ['✅ 2³ = 8', 'Potencia'],
    ],
  },
  {
    k: 'raiz_cuadrada',
    t: 'Raíz Cuadrada · 4°',
    frames: [
      ['√25 = ?', 'Raíz cuadrada'],
      ['Busca número que × sí mismo = 25', 'Definición'],
      ['5 × 5 = 25', 'Prueba'],
      ['✅ √25 = 5', 'Correcto'],
      ['√81 = ?', 'Otro'],
      ['9 × 9 = 81', 'Prueba'],
      ['✅ √81 = 9', 'Solución'],
    ],
  },
  {
    k: 'estadistica',
    t: 'Estadística · 4°',
    frames: [
      ['Datos: 3, 5, 3, 7, 5, 3', 'Ejemplo'],
      ['MODA = valor más repetido', 'Definición'],
      ['3 aparece 3 veces', 'Contar'],
      ['✅ Moda = 3', 'Resultado'],
      ['MEDIA = suma / cantidad', 'Otra medida'],
      ['(3+5+3+7+5+3) ÷ 6 = 26 ÷ 6', 'Calcular'],
      ['✅ Media ≈ 4.3', 'Aproximado'],
    ],
  },
  {
    k: 'probabilidad',
    t: 'Probabilidad · 4°',
    frames: [
      ['P = favorables / posibles', 'Fórmula'],
      ['Dado tiene 6 caras', 'Total posibles'],
      ['Sacar un 3: 1 favorable', 'Buscar 3'],
      ['P(3) = 1/6', 'Resultado'],
      ['Sacar par: 2, 4, 6 = 3 casos', '3 favorables'],
      ['P(par) = 3/6 = 1/2', 'Simplificado'],
    ],
  },
];

// Contextos narrativos espaciales del HTML original (Sumy, Jack, Leo, Sora)
const FV_CTX: Record<
  string,
  (a: number, b: number, r: number) => { hist: string; datos: string; preg: string; conc: string; moral: string }
> = {
  '+': (a, b) => ({
    hist: `🧑‍🚀 Sumy recogió ${a} cristales espaciales y Jack le regaló ${b} más.`,
    datos: `Datos: tenía ${a} · recibe ${b}`,
    preg: '🤔 ¿Cuántos cristales tiene ahora en total?',
    conc: '💡 SUMAR es juntar cantidades en un solo grupo.',
    moral: '🎉 ¡Sumando, Sumy llenó su nave! Tú también puedes.',
  }),
  '-': (a, b) => ({
    hist: `🧑‍🚀 Jack tenía ${a} monedas estelares y usó ${b} para reparar su nave.`,
    datos: `Datos: tenía ${a} · gastó ${b}`,
    preg: '🤔 ¿Cuántas monedas le quedan?',
    conc: '💡 RESTAR es quitar una cantidad de otra.',
    moral: '🎉 ¡Jack administró bien sus monedas! Sigue así.',
  }),
  '×': (a, b) => ({
    hist: `🧑‍🚀 Leo organiza ${b} cajas con ${a} balones espaciales cada una.`,
    datos: `Datos: ${b} cajas · ${a} balones por caja`,
    preg: '🤔 ¿Cuántos balones hay en total?',
    conc: '💡 MULTIPLICAR es sumar el mismo número varias veces.',
    moral: '🎉 ¡Leo contó todo en segundos gracias a la multiplicación!',
  }),
  '÷': (a, b) => ({
    hist: `🧑‍🚀 Sora reparte ${a} caramelos cósmicos entre ${b} amigos por igual.`,
    datos: `Datos: ${a} caramelos · ${b} amigos`,
    preg: '🤔 ¿Cuántos caramelos recibe cada amigo?',
    conc: '💡 DIVIDIR es repartir en partes iguales.',
    moral: '🎉 ¡Todos recibieron lo mismo! Así se comparte.',
  }),
};

function fvParseOp(v: RawVideoTopic): VideoOperation | null {
  const f0 = (v.frames && v.frames[0] && v.frames[0][0]) || '';
  const m = f0.match(/(\d+)\s*([+\-×x÷])\s*(\d+)/);
  if (/\d\s*\/\s*\d/.test(f0)) return null;
  if (!m) return null;
  const a = parseInt(m[1], 10);
  const b = parseInt(m[3], 10);
  let op = m[2];
  if (op === 'x') op = '×';
  if (op === '/') op = '÷';
  let r = 0;
  if (op === '+') r = a + b;
  else if (op === '-') r = a - b;
  else if (op === '×') r = a * b;
  else {
    if (b === 0) return null;
    r = Math.floor(a / b);
  }
  return { a, b, op, r };
}

// Expansión a 12 fotogramas (historia, dibujo matemático, pasos y moraleja)
function expandFrames(v: RawVideoTopic): { frames: VideoFrame[]; op: VideoOperation | null } {
  const op = fvParseOp(v);
  if (op && FV_CTX[op.op]) {
    const c = FV_CTX[op.op](op.a, op.b, op.r);
    const proceso = v.frames.slice(1, Math.max(1, v.frames.length - 1));
    const list: VideoFrame[] = [
      { text: c.hist, subt: 'Historia' },
      { text: c.datos, subt: 'Los datos del problema' },
      { text: c.preg, subt: 'Piensa antes de operar' },
      { text: c.conc, subt: 'El concepto clave' },
      { text: `${op.a} ${op.op} ${op.b} = ?`, subt: 'Planteamos la operación' },
      { text: `DRAW:${op.a}${op.op}${op.b}`, subt: 'Míralo con dibujos', isDraw: true },
    ];
    proceso.forEach(([t, s]) => list.push({ text: t, subt: s }));
    list.push({ text: `✅ ${op.a} ${op.op} ${op.b} = ${op.r}`, subt: '¡Resultado!' });
    list.push({ text: c.moral, subt: 'Lo lograste' });
    return { frames: list, op };
  } else {
    const list: VideoFrame[] = [
      { text: `🧑‍🚀 Fedor te explica: ${v.t.replace(/ · 4°$/, '')}`, subt: 'Atento a cada paso' },
    ];
    v.frames.forEach(([t, s]) => list.push({ text: t, subt: s }));
    list.push({ text: '🎉 ¡Ahora practícalo en los ejercicios!', subt: 'Tú puedes' });
    return { frames: list, op: null };
  }
}

// Paleta cromática por temática
function fvPalette(k: string) {
  const s = String(k || '');
  if (/adicion/.test(s)) return { bg1: '#2E1065', bg2: '#5B21B6', acc: '#38D8A5', icon: '➕' };
  if (/sustraccion/.test(s)) return { bg1: '#7A1B00', bg2: '#B45309', acc: '#FCD34D', icon: '➖' };
  if (/multi/.test(s)) return { bg1: '#7A3200', bg2: '#D97706', acc: '#FEF3C7', icon: '✖️' };
  if (/division/.test(s)) return { bg1: '#0A3D6E', bg2: '#1E40AF', acc: '#38D8A5', icon: '➗' };
  if (/frac/.test(s)) return { bg1: '#7A3200', bg2: '#EA580C', acc: '#FDE68A', icon: '🧊' };
  if (/potencia|raiz/.test(s)) return { bg1: '#3D1468', bg2: '#7C3AED', acc: '#FFE066', icon: '⚡' };
  if (/estadistica|probabilidad/.test(s)) return { bg1: '#5A0A28', bg2: '#BE185D', acc: '#FBCFE8', icon: '🎲' };
  if (/metrico|perimetro|area|volumen/.test(s)) return { bg1: '#0A4030', bg2: '#0F766E', acc: '#99F6E4', icon: '📏' };
  if (/divisores|primos|mcd|mcm/.test(s)) return { bg1: '#1E3A8A', bg2: '#3B82F6', acc: '#DBEAFE', icon: '🔢' };
  return { bg1: '#0F172A', bg2: '#1E293B', acc: '#F5C518', icon: '🌟' };
}

// Dibujo matemático interactivo del frame DRAW
function fvDrawMath(ctx: CanvasRenderingContext2D, op: VideoOperation, pal: any, W: number, H: number) {
  const { a, b, op: tipo, r } = op;
  ctx.fillStyle = 'rgba(255,255,255,.95)';
  ctx.fillRect(20, 40, W - 40, H - 80);

  function circles(n: number, x0: number, y0: number, color: string) {
    const per = Math.min(10, n);
    const gap = 20;
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i % per) * gap;
      const cy = y0 + Math.floor(i / per) * gap;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function bars() {
    const maxV = Math.max(a, b, 1);
    const bw = W - 120;
    ctx.fillStyle = pal.bg2;
    ctx.fillRect(60, 70, bw * (a / maxV), 34);
    ctx.fillStyle = pal.bg1;
    ctx.fillRect(60, 130, bw * (b / maxV), 34);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(a), 66 + bw * (a / maxV), 93);
    ctx.fillText(String(b), 66 + bw * (b / maxV), 153);
    ctx.textAlign = 'center';
    ctx.fillText(`${tipo} resultado: ${r}`, W / 2, 200);
  }

  ctx.textAlign = 'center';
  if (tipo === '+' && a <= 30 && b <= 30) {
    circles(a, 60, 75, '#7C3AED');
    ctx.fillStyle = '#111';
    ctx.font = 'bold 22px Nunito';
    ctx.fillText('+', W / 2, 120);
    circles(b, 60, 150, '#38D8A5');
    ctx.fillStyle = '#111';
    ctx.font = 'bold 15px Nunito';
    ctx.fillText(`${a} + ${b} = ${r}`, W / 2, H - 52);
  } else if (tipo === '-' && a <= 30) {
    circles(a, 60, 90, '#7C3AED');
    const per = Math.min(10, a);
    const gap = 20;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    for (let i = 0; i < Math.min(b, a); i++) {
      const cx = 60 + (i % per) * gap;
      const cy = 90 + Math.floor(i / per) * gap;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10);
      ctx.lineTo(cx + 10, cy + 10);
      ctx.stroke();
    }
    ctx.fillStyle = '#111';
    ctx.font = 'bold 15px Nunito';
    ctx.fillText(`${a} elementos · tachamos ${b} · quedan ${r}`, W / 2, H - 52);
  } else if (tipo === '×' && a <= 12 && b <= 12) {
    const gap2 = 18;
    const x0 = W / 2 - (a * gap2) / 2 + 9;
    const y0 = 80;
    for (let rr = 0; rr < b; rr++) {
      for (let cc = 0; cc < a; cc++) {
        ctx.beginPath();
        ctx.arc(x0 + cc * gap2, y0 + rr * gap2, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#F97316';
        ctx.fill();
        ctx.strokeStyle = '#7A3200';
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#111';
    ctx.font = 'bold 15px Nunito';
    ctx.fillText(`${b} filas × ${a} columnas = ${r}`, W / 2, H - 52);
  } else if (tipo === '÷' && b <= 8 && r <= 12) {
    const gw = (W - 100) / b;
    for (let g = 0; g < b; g++) {
      const gx = 50 + g * gw + gw / 2;
      ctx.strokeStyle = pal.bg2;
      ctx.lineWidth = 2;
      ctx.strokeRect(50 + g * gw + 4, 70, gw - 8, 110);
      for (let e2 = 0; e2 < r; e2++) {
        ctx.beginPath();
        ctx.arc(gx, 90 + e2 * 14, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#38D8A5';
        ctx.fill();
      }
    }
    ctx.fillStyle = '#111';
    ctx.font = 'bold 15px Nunito';
    ctx.fillText(`${a} ÷ ${b} = ${r} en cada grupo`, W / 2, H - 52);
  } else {
    bars();
  }
}

export default function VideosModal4to({ isOpen, onClose, onOpenIntro }: VideosModal4toProps) {
  const [selectedVideoIdx, setSelectedVideoIdx] = useState<number | null>(null);
  const [frameIdx, setFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoVoice, setAutoVoice] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio helper
  const hablar = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CO';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  };

  const currentRawVideo = selectedVideoIdx !== null ? RAW_VIDEO_TOPICS[selectedVideoIdx] : null;
  const expandedData = currentRawVideo ? expandFrames(currentRawVideo) : null;
  const currentFrames = expandedData?.frames || [];
  const currentOp = expandedData?.op || null;
  const currentFrame = currentFrames[frameIdx] || null;

  // Renderizar fotograma en Canvas 2D
  useEffect(() => {
    if (selectedVideoIdx === null || !currentRawVideo || !currentFrame) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pal = fvPalette(currentRawVideo.k);
    const W = 480;
    const H = 270;

    // Fondo degradado estelar
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, pal.bg1);
    grad.addColorStop(1, pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Estrellas de fondo
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let s = 0; s < 30; s++) {
      ctx.beginPath();
      ctx.arc((s * 47) % W, (s * 61) % H, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Título de la lección en la parte superior del Canvas
    ctx.fillStyle = pal.acc;
    ctx.font = 'bold 13px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentRawVideo.t, W / 2, 22);

    // Si es frame de dibujo matemático
    if (currentFrame.isDraw && currentOp) {
      fvDrawMath(ctx, currentOp, pal, W, H);
    } else {
      ctx.fillStyle = '#FFFFFF';
      const mono = currentFrame.text.indexOf('\n') >= 0;
      ctx.font = mono ? '900 20px monospace' : '900 18px "Baloo 2", Nunito, sans-serif';
      const lines = currentFrame.text.split('\n');
      const lineH = mono ? 26 : 24;
      const startY = 140 - ((lines.length - 1) * lineH) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, W / 2, startY + i * lineH);
      });
    }

    // Narrar con voz automática si está habilitado
    if (autoVoice && currentFrame.subt) {
      const narText = currentFrame.isDraw
        ? currentFrame.subt
        : `${currentFrame.text}. ${currentFrame.subt}`;
      hablar(narText.replace(/DRAW:[^\s]+/g, ''));
    }
  }, [selectedVideoIdx, frameIdx, autoVoice]);

  // Manejo de reproducción automática
  useEffect(() => {
    if (!isPlaying || selectedVideoIdx === null) return;

    playTimerRef.current = setTimeout(() => {
      if (frameIdx < currentFrames.length - 1) {
        setFrameIdx((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 2800);

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, frameIdx, selectedVideoIdx, currentFrames.length]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <style>{`
        .video-grid::-webkit-scrollbar {
          width: 6px;
        }
        .video-grid::-webkit-scrollbar-track {
          background: #F3EEFF;
          border-radius: 4px;
        }
        .video-grid::-webkit-scrollbar-thumb {
          background: #D9CCFF;
          border-radius: 4px;
        }
        .video-grid::-webkit-scrollbar-thumb:hover {
          background: #C5BFEE;
        }
      `}</style>

      {/* Tarjeta Modal Principal */}
      <div
        className={`w-full ${
          selectedVideoIdx === null ? 'max-w-2xl' : 'max-w-xl'
        } bg-white rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[94vh] overflow-hidden`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Encabezado Modal */}
        <div className="flex items-center justify-between mb-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            {selectedVideoIdx !== null && (
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedVideoIdx(null);
                }}
                className="w-8 h-8 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
                title="Volver al catálogo de videos"
              >
                ←
              </button>
            )}
            <h2
              className="text-xl sm:text-2xl font-black text-[#3D1468] flex items-center gap-2"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="text-xl sm:text-2xl">🎬</span>
              <span>{selectedVideoIdx === null ? 'Videos animados' : 'Video Fedor'}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 rounded-full bg-[#F3EEFF] hover:bg-[#E9DEFF] text-[#5C21A6] font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ══ VISTA 1: Catálogo de 25 Videos ══ */}
        {selectedVideoIdx === null ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Botón Destacado: Ver intro de despegue */}
            <button
              type="button"
              onClick={() => {
                if (onOpenIntro) onOpenIntro();
                else {
                  hablar('¡Iniciando secuencia de despegue estelar de cuarto grado!');
                }
              }}
              className="w-full mb-3.5 py-3 px-5 rounded-2xl font-black text-sm tracking-wide text-[#38BDF8] border-2 border-[#38BDF8] bg-gradient-to-r from-[#02070F] to-[#0a1f4a] shadow-lg hover:brightness-125 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-lg">🚀</span>
              <span>Ver intro de despegue</span>
            </button>

            {/* Cuadrícula de 2 columnas con los 25 videos */}
            <div className="video-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 max-h-[440px]">
              {RAW_VIDEO_TOPICS.map((v, i) => {
                const pal = fvPalette(v.k);
                return (
                  <button
                    key={v.k}
                    type="button"
                    onClick={() => {
                      setSelectedVideoIdx(i);
                      setFrameIdx(0);
                      setIsPlaying(true);
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${pal.bg1}, ${pal.bg2})`,
                    }}
                    className="p-3 rounded-2xl text-white font-black text-[13px] text-left shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <span className="text-base flex-shrink-0">{pal.icon}</span>
                    <span className="truncate">{v.t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ══ VISTA 2: Reproductor Idéntico a la Imagen 1 ══ */
          <div className="flex flex-col items-center flex-1 overflow-visible">
            {/* Título de la lección centrado */}
            <div
              className="text-base sm:text-lg font-black text-[#5C21A6] text-center mb-2 flex items-center justify-center gap-1.5"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>{fvPalette(currentRawVideo?.k || '').icon}</span>
              <span>{currentRawVideo?.t}</span>
            </div>

            {/* Canvas de Animación 16:9 */}
            <div className="w-full flex justify-center">
              <canvas
                ref={canvasRef}
                width={480}
                height={270}
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '16/9',
                  height: 'auto',
                  borderRadius: '16px',
                  border: '3px solid #5C21A6',
                  boxShadow: '0 8px 24px rgba(92, 33, 166, 0.20)',
                  display: 'block',
                }}
              />
            </div>

            {/* Barra de Progreso */}
            <div className="w-full max-w-[480px] mx-auto mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#5C21A6] to-[#8B3EDB] transition-all duration-300"
                style={{
                  width: `${Math.round(((frameIdx + 1) / (currentFrames.length || 1)) * 100)}%`,
                }}
              />
            </div>

            {/* Subtítulo de Orientación */}
            <div
              className="mt-2 text-sm sm:text-base font-extrabold text-[#3D1468] text-center min-h-[22px]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {currentFrame?.subt || ''}
            </div>

            {/* Fila 1 de Controles: Reproducir | Pausa | Narrar paso | Voz auto: SÍ */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#16876A] to-[#24C496] text-white font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center gap-1.5 transition-transform"
              >
                <span>▶</span>
                <span>Reproducir</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#B45309] text-white font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center gap-1.5 transition-transform"
              >
                <span>⏸</span>
                <span>Pausa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentFrame) {
                    const nar = currentFrame.isDraw
                      ? currentFrame.subt
                      : `${currentFrame.text}. ${currentFrame.subt}`;
                    hablar(nar.replace(/DRAW:[^\s]+/g, ''));
                  }
                }}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#0E6BA8] text-white font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center gap-1.5 transition-transform"
              >
                <span>🔊</span>
                <span>Narrar paso</span>
              </button>
              <button
                type="button"
                onClick={() => setAutoVoice(!autoVoice)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#3D1468] text-[#FFE066] border border-[#F5C518] font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center gap-1.5 transition-transform"
              >
                <span>{autoVoice ? '🔊' : '🔇'}</span>
                <span>{autoVoice ? 'Voz auto: SÍ' : 'Voz auto: NO'}</span>
              </button>
            </div>

            {/* Fila 2 de Controles: ◀ Anterior | Siguiente ▶ */}
            <div className="flex items-center justify-center gap-2.5 mt-2">
              <button
                type="button"
                disabled={frameIdx <= 0}
                onClick={() => {
                  setIsPlaying(false);
                  setFrameIdx((p) => Math.max(0, p - 1));
                }}
                className="px-5 py-2 rounded-xl bg-[#5C21A6] text-white font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center justify-center min-w-[110px] disabled:opacity-40 transition-transform"
              >
                ◀ Anterior
              </button>
              <button
                type="button"
                disabled={frameIdx >= currentFrames.length - 1}
                onClick={() => {
                  setIsPlaying(false);
                  setFrameIdx((p) => Math.min(currentFrames.length - 1, p + 1));
                }}
                className="px-5 py-2 rounded-xl bg-[#5C21A6] text-white font-black text-xs sm:text-sm shadow cursor-pointer hover:brightness-110 flex items-center justify-center min-w-[110px] disabled:opacity-40 transition-transform"
              >
                Siguiente ▶
              </button>
            </div>

            {/* Indicador de Paso al pie */}
            <div className="text-[11px] font-bold text-[#7A7299] text-center mt-2 pb-1">
              Paso {frameIdx + 1} de {currentFrames.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
