'use client';

import React from 'react';

interface FigureProps {
  ctx?: string;
  countEmoji?: string;
  countN?: number;
  visObjs?: Array<{ e: string; n: number; label?: string }>;
  pA?: number;
  pB?: number;
  pOp?: string;
  pIco?: string;
  pIco2?: string;
  pNameA?: string;
  pNameB?: string;
  className?: string;
}

export default function FigureRenderer3ro({
  ctx,
  countEmoji,
  countN,
  visObjs,
  pA,
  pB,
  pOp,
  pIco,
  pIco2,
  pNameA,
  pNameB,
  className = '',
}: FigureProps) {
  // 1. If visObjs is present (grouped visual objects with labels)
  if (visObjs && visObjs.length > 0) {
    const items = visObjs.map((g, gi) => {
      const objs = Array.from({ length: g.n }).map((_, i) => (
        <span
          key={i}
          className="inline-block text-2xl m-0.5 animate-bounce"
          style={{ animationDelay: `${(gi * g.n + i) * 0.04}s`, animationDuration: '1.5s' }}
        >
          {g.e}
        </span>
      ));

      return (
        <div
          key={gi}
          className="p-3 rounded-xl shadow-sm text-center min-w-[100px]"
          style={{
            background:
              gi === 0
                ? 'linear-gradient(135deg, #EEEDFE, #F0EDFF)'
                : 'linear-gradient(135deg, #FEF3E8, #FFF0E0)',
          }}
        >
          <div className="flex flex-wrap justify-center gap-1">{objs}</div>
          <div className="text-xs font-black text-gray-700 mt-2">
            {g.label || `${g.n} ${g.e}`}
          </div>
        </div>
      );
    });

    return (
      <div className={`flex items-center justify-center gap-3 flex-wrap my-3 ${className}`}>
        {items[0]}
        {visObjs.length > 1 && (
          <>
            <span className="text-2xl font-black text-amber-500">+</span>
            {items[1]}
            <span className="text-2xl font-black text-amber-500">=</span>
            <div
              className="p-3 rounded-xl shadow-sm flex items-center justify-center min-w-[60px] min-h-[60px]"
              style={{ background: 'linear-gradient(135deg, #E0FFF5, #F0FDF9)' }}
            >
              <span className="text-2xl font-black text-emerald-600">?</span>
            </div>
          </>
        )}
      </div>
    );
  }

  // 2. Count emoji with countN
  if (countEmoji && countN) {
    const objs = Array.from({ length: countN }).map((_, i) => (
      <span
        key={i}
        className="inline-block text-2xl m-0.5"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        {countEmoji}
      </span>
    ));

    return (
      <div className={`p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center my-3 ${className}`}>
        <div className="flex flex-wrap justify-center gap-1">{objs}</div>
        <div className="text-xs font-bold text-purple-800 mt-2">
          Cuenta cada {countEmoji} → escribe el total
        </div>
      </div>
    );
  }

  // 3. Problem scene (pA, pB, pOp)
  if (pA || pIco) {
    const a = pA || 3;
    const b = pB || 2;
    const op = pOp || '+';
    const icoA = pIco || '🔵';
    const icoB = pIco2 || (op === '÷' ? '🙍' : pIco || '🔵');

    const showA = Math.min(a, 20);
    const objsA = Array.from({ length: showA }).map((_, i) => (
      <span key={i} className="inline-block text-2xl m-0.5">
        {icoA}
      </span>
    ));

    const objsB = Array.from({ length: b }).map((_, j) => (
      <span key={j} className="inline-block text-2xl m-0.5">
        {icoB}
      </span>
    ));

    if (op === '÷') {
      return (
        <div className={`flex items-center justify-center gap-4 flex-wrap my-3 p-3 bg-purple-50 rounded-2xl ${className}`}>
          <div className="flex-1 min-w-[120px] text-center">
            <div className="flex flex-wrap justify-center gap-1">{objsA}</div>
            <div className="text-xs font-black text-purple-900 mt-1">{a} {pNameA || 'elementos'}</div>
          </div>
          <div className="text-2xl font-black text-amber-500">÷</div>
          <div className="min-w-[80px] text-center">
            <div className="flex justify-center gap-1">{objsB}</div>
            <div className="text-xs font-black text-purple-900 mt-1">{b} {pNameB || 'personas'}</div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center justify-center gap-4 flex-wrap my-3 p-3 bg-purple-50 rounded-2xl ${className}`}>
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-1">{objsA}</div>
          <div className="text-xs font-black text-purple-900 mt-1">{a} {pNameA || ''}</div>
        </div>
        <div className="text-2xl font-black text-amber-500">{op}</div>
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-1">{objsB}</div>
          <div className="text-xs font-black text-purple-900 mt-1">{b} {pNameB || ''}</div>
        </div>
      </div>
    );
  }

  // 4. If ctx is provided, render HTML/SVG or text
  if (ctx) {
    const isHtml = ctx.includes('<') && ctx.includes('>');

    if (isHtml) {
      return (
        <div
          className={`flex justify-center items-center my-3 overflow-x-auto ${className}`}
          dangerouslySetInnerHTML={{ __html: ctx }}
        />
      );
    }

    return (
      <div className={`text-base font-bold text-purple-950 dark:text-purple-200 text-center my-2 p-2 bg-purple-50/70 dark:bg-purple-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 ${className}`}>
        {ctx}
      </div>
    );
  }

  return null;
}
