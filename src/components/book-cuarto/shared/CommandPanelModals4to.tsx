'use client';

import React, { useState } from 'react';
import { useBook4 } from '../context/Book4Context';
import Swal from 'sweetalert2';

interface CommandPanelModals4toProps {
  activeTool: string | null;
  onClose: () => void;
}

export default function CommandPanelModals4to({
  activeTool,
  onClose,
}: CommandPanelModals4toProps) {
  const { totalXP, coins, scores } = useBook4();

  // State for Conteo
  const [conteoStep, setConteoStep] = useState<number | null>(null);

  // State for Multiplication table
  const [multNum, setMultNum] = useState<number>(4);

  // State for Ábaco
  const [abacoValue, setAbacoValue] = useState<number>(1425);

  if (!activeTool) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-purple-500 relative overflow-hidden max-h-[88vh] overflow-y-auto"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {activeTool === 'conteo' && '🔢'}
              {activeTool === 'mult' && '✖️'}
              {activeTool === 'lab' && '🔬'}
              {activeTool === 'explicar' && '💡'}
              {activeTool === 'videos' && '🎬'}
              {activeTool === 'concepto' && '📘'}
              {activeTool === 'abaco' && '🧮'}
              {activeTool === 'historia' && '📜'}
              {activeTool === 'logros' && '🏆'}
              {activeTool === 'tienda' && '🏪'}
              {activeTool === 'misiones' && '🎯'}
              {activeTool === 'diario' && '📓'}
              {activeTool === 'stickers' && '📔'}
              {activeTool === 'juegos' && '🎮'}
            </span>
            <h2
              className="text-xl font-black text-[#1A1033]"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {activeTool === 'conteo' && 'Tablas de Conteo'}
              {activeTool === 'mult' && 'Tablas de Multiplicar'}
              {activeTool === 'lab' && 'Laboratorio de Estadística'}
              {activeTool === 'explicar' && 'Explicaciones Paso a Paso'}
              {activeTool === 'videos' && 'Videos Animados Fedor'}
              {activeTool === 'concepto' && 'Concepto del Día'}
              {activeTool === 'abaco' && 'Ábaco FEDOR Digital'}
              {activeTool === 'historia' && 'Historia del Método Fedor'}
              {activeTool === 'logros' && 'Salón de Trofeos y Medallas'}
              {activeTool === 'tienda' && 'Tienda Espacial'}
              {activeTool === 'misiones' && 'Misiones del Día'}
              {activeTool === 'diario' && 'Diario de Práctica Cósmica'}
              {activeTool === 'stickers' && 'Álbum de Stickers y Medallas'}
              {activeTool === 'juegos' && 'Juegos y Retos Rápidos'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-black flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ══ TOOL 1: CONTEO ══ */}
        {activeTool === 'conteo' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
              Toca un intervalo para ver la tabla de conteo de 4° grado:
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[10, 20, 25, 50, 100, 250, 500, 1000].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setConteoStep(step)}
                  className={`p-3 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-transform ${
                    conteoStep === step
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white scale-105 shadow-md'
                      : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  De {step} en {step}
                </button>
              ))}
            </div>

            {conteoStep && (
              <div className="bg-[#F8F5FF] border-2 border-[#C5BFEE] rounded-2xl p-4 animate-fadeIn">
                <div className="text-sm font-black text-purple-900 mb-3">
                  Conteo de {conteoStep} en {conteoStep} hasta {conteoStep * 20}:
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 bg-white rounded-xl border border-purple-100 text-center font-black text-xs text-[#2A0F60] shadow-xs"
                    >
                      {(i + 1) * conteoStep}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TOOL 2: MULTIPLICAR ══ */}
        {activeTool === 'mult' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
              Selecciona una tabla de multiplicar para repasar y dominar:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMultNum(n)}
                  className={`w-11 h-11 rounded-xl font-black text-sm cursor-pointer transition-transform ${
                    multNum === n
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105 shadow-md'
                      : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  ×{n}
                </button>
              ))}
            </div>

            <div className="bg-[#FFF8F0] border-2 border-[#FBD38D] rounded-2xl p-4">
              <div className="text-sm font-black text-orange-900 mb-3">
                Tabla del {multNum}:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const m = i + 1;
                  return (
                    <div
                      key={m}
                      className="p-2.5 bg-white rounded-xl border border-orange-100 text-center font-bold text-xs text-[#7A3200] shadow-xs"
                    >
                      {multNum} × {m} = <b className="text-orange-600">{multNum * m}</b>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ TOOL 3: LABORATORIO DE ESTADÍSTICA ══ */}
        {activeTool === 'lab' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-4 leading-relaxed">
              En 4° grado analizamos datos con frecuencias, promedios, moda y gráficos de barras:
            </p>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 mb-4">
              <div className="text-xs font-black uppercase text-purple-800 mb-2">
                📊 Gráfica de Mascotas Preferidas en 4°:
              </div>
              <div className="space-y-2">
                {[
                  { name: '🐶 Perros', n: 14, pct: 70, col: '#3B82F6' },
                  { name: '🐱 Gatos', n: 10, pct: 50, col: '#8B5CF6' },
                  { name: '🦜 Aves', n: 6, pct: 30, col: '#10B981' },
                  { name: '🐰 Conejos', n: 4, pct: 20, col: '#F59E0B' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center gap-3 text-xs font-bold text-gray-800">
                    <span className="w-24 shrink-0">{row.name}</span>
                    <div className="flex-1 h-5 bg-purple-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all flex items-center justify-end pr-2 text-[10px] text-white font-black"
                        style={{ width: `${row.pct}%`, background: row.col }}
                      >
                        {row.n}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900">
              💡 <strong>Moda:</strong> El perro es el dato que más se repite (14 votos). Total encuestados: 34 estudiantes.
            </div>
          </div>
        )}

        {/* ══ TOOL 4: EXPLICACIONES PASO A PASO ══ */}
        {activeTool === 'explicar' && (
          <div className="space-y-3">
            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
              <div className="text-xs font-black text-purple-900 mb-1">
                ➕ Suma de grandes números con llevadas
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                1. Alinea las unidades, decenas, centenas y unidades de mil.<br />
                2. Si la suma de una columna es 10 o más, anota las unidades y lleva las decenas arriba de la siguiente columna.
              </p>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <div className="text-xs font-black text-amber-900 mb-1">
                ✖️ Multiplicación de dos cifras
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                1. Multiplica las unidades por todo el número de arriba.<br />
                2. Deja un espacio en blanco y multiplica las decenas.<br />
                3. Suma ambos resultados parciales para hallar el producto final.
              </p>
            </div>
            <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200">
              <div className="text-xs font-black text-teal-900 mb-1">
                ➗ División con residuo
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                Dividendo = (Divisor × Cociente) + Residuo. El residuo SIEMPRE debe ser menor que el divisor.
              </p>
            </div>
          </div>
        )}

        {/* ══ TOOL 5: VIDEOS ANIMADOS ══ */}
        {activeTool === 'videos' && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
              Videos conceptuales animados de 4° grado:
            </p>
            {[
              { t: '🎬 1. Las Fracciones en la Vida Diaria', desc: 'Aprende qué es el numerador y denominador con pizzas y chocolates.' },
              { t: '🎬 2. El Teorema de la Multiplicación', desc: 'Visualiza la multiplicación como matrices rectangulares de área.' },
              { t: '🎬 3. Descubriendo el MCD y MCM', desc: 'Misiones de coincidencia y repartos exactos con Lucas y Sora.' },
            ].map((v, i) => (
              <div key={i} className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-purple-900">{v.t}</div>
                  <div className="text-[11px] text-gray-600 font-semibold">{v.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => Swal.fire('Reproductor Fedor', 'Video cargado en alta definición pedagógica.', 'info')}
                  className="px-3 py-1 bg-purple-700 text-white text-xs font-black rounded-lg cursor-pointer hover:bg-purple-800"
                >
                  Ver ▶
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══ TOOL 6: CONCEPTO DEL DÍA ══ */}
        {activeTool === 'concepto' && (
          <div className="p-4 bg-gradient-to-tr from-purple-50 to-amber-50 rounded-2xl border-2 border-purple-300 text-center">
            <span className="text-4xl mb-2 block">🌟</span>
            <h3 className="text-lg font-black text-[#2A0F60] mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              ¿Qué es un Número Primo?
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed max-w-md mx-auto mb-4">
              Un número primo es un número natural mayor que 1 que tiene <strong>únicamente dos divisores distintos:</strong> él mismo y el 1.<br />
              Por ejemplo: 2, 3, 5, 7, 11, 13, 17, 19, 23... ¡El número 2 es el único primo par!
            </p>
            <div className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-black">
              💡 Tip Fedor: Los números que tienen más de dos divisores se llaman compuestos.
            </div>
          </div>
        )}

        {/* ══ TOOL 7: ÁBACO DIGITAL FEDOR ══ */}
        {activeTool === 'abaco' && (
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
              Representa cantidades en el Ábaco Fedor de unidades de mil, centenas, decenas y unidades:
            </p>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                min="0"
                max="9999"
                value={abacoValue}
                onChange={(e) => setAbacoValue(Number(e.target.value) || 0)}
                className="p-2 border-2 border-purple-300 rounded-xl font-black text-sm text-purple-900 w-28"
              />
              <span className="text-xs font-bold text-gray-600">
                Escribe un número de 1 a 9.999
              </span>
            </div>

            <div className="bg-[#2A0F60] p-4 rounded-2xl text-white flex justify-around items-end h-48 border-4 border-amber-400">
              {[
                { label: 'UM', val: Math.floor((abacoValue % 10000) / 1000), col: '#EF4444' },
                { label: 'C', val: Math.floor((abacoValue % 1000) / 100), col: '#3B82F6' },
                { label: 'D', val: Math.floor((abacoValue % 100) / 10), col: '#10B981' },
                { label: 'U', val: abacoValue % 10, col: '#F59E0B' },
              ].map((col) => (
                <div key={col.label} className="flex flex-col items-center gap-1">
                  <div className="h-32 w-4 bg-purple-900/80 rounded-full flex flex-col justify-end p-0.5">
                    {Array.from({ length: col.val }).map((_, bi) => (
                      <div
                        key={bi}
                        className="w-full h-3 rounded-full mb-0.5 shadow-sm"
                        style={{ background: col.col }}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-black">{col.label}</div>
                  <div className="text-sm font-black text-amber-300">{col.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TOOL 8: HISTORIA FEDOR ══ */}
        {activeTool === 'historia' && (
          <div className="space-y-3 text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-black text-purple-900 mb-1">
                🚀 Origen del Método Fedor (Fernando Bastidas Parra)
              </h4>
              <p>
                El método matemático Fedor fue desarrollado en Colombia para convertir el aprendizaje abstracto en una travesía espacial tangible, visual y gamificada, donde cada estudiante es el comandante de su propia misión cognitiva.
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-black text-amber-900 mb-1">
                🧩 El poder de la Representación Visual
              </h4>
              <p>
                A través del ábaco por columnas, los bloques de centenas, matrices de rectángulos y problemas contextualizados con los personajes Sumy, Math, Leo, Sora, Apolo y Falco, las matemáticas se vuelven intuitivas y memorables.
              </p>
            </div>
          </div>
        )}

        {/* ══ TOOL 9: LOGROS Y TROFEOS ══ */}
        {activeTool === 'logros' && (
          <div>
            <div className="text-xs font-bold text-gray-600 mb-3">
              Has acumulado <strong>{totalXP} XP</strong> en tu bitácora espacial de 4°.
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: '🚀', name: 'Primer Despegue', desc: 'Comienza tu viaje en 4°', ok: true },
                { icon: '🔟', name: 'Sistema Decimal', desc: 'Domina los números hasta 100.000', ok: totalXP >= 100 },
                { icon: '✖️', name: 'Gran Multiplicador', desc: 'Resuelve 50 multiplicaciones', ok: totalXP >= 250 },
                { icon: '🛒', name: 'Experto SABER', desc: 'Supera retos de compras y vueltos', ok: totalXP >= 500 },
                { icon: '🪐', name: 'Conquistador Solar', desc: 'Visita los 15 mundos del libro', ok: totalXP >= 1000 },
                { icon: '👑', name: 'Almirante Cósmico', desc: 'Alcanza el rango Leyenda', ok: totalXP >= 2000 },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    t.ok ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="text-xs font-black text-gray-900">{t.name}</div>
                    <div className="text-[10px] text-gray-600 font-semibold">{t.desc}</div>
                    <div className="text-[9px] font-black text-amber-600 mt-0.5">
                      {t.ok ? '✅ Desbloqueado' : '🔒 Bloqueado'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TOOL 10: TIENDA ESPACIAL ══ */}
        {activeTool === 'tienda' && (
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-black text-purple-900">
              <span>Tus monedas disponibles:</span>
              <span className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-amber-800">
                🪙 {coins} Monedas
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { icon: '🪖', name: 'Casco Titán', cost: 50 },
                { icon: '🛸', name: 'Nave Apolo 4', cost: 120 },
                { icon: '✨', name: 'Propulsor Neón', cost: 80 },
                { icon: '🛡️', name: 'Escudo Estelar', cost: 100 },
                { icon: '🌌', name: 'Traje Nebulosa', cost: 200 },
                { icon: '🏆', name: 'Estatua Dorada', cost: 300 },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs font-black text-gray-900">{item.name}</div>
                  <div className="text-xs font-bold text-amber-700 my-1">🪙 {item.cost}</div>
                  <button
                    type="button"
                    onClick={() => {
                      if (coins >= item.cost) {
                        Swal.fire('¡Compra exitosa!', `Equipaste ${item.name}`, 'success');
                      } else {
                        Swal.fire('Monedas insuficientes', 'Resuelve más ejercicios para ganar monedas.', 'warning');
                      }
                    }}
                    className="w-full py-1 text-[11px] font-black rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer transition-colors"
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TOOL 11: MISIONES DEL DÍA ══ */}
        {activeTool === 'misiones' && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
              Cumple estas 3 misiones hoy para obtener monedas extra:
            </p>
            {[
              { icon: '🎯', title: '1. Resuelve 1 nivel de 4° con 100% de aciertos', reward: '+30 🪙', done: false },
              { icon: '🛒', title: '2. Practica 3 Problemas Cotidianos SABER', reward: '+25 🪙', done: false },
              { icon: '🔥', title: '3. Mantén tu racha de práctica activa', reward: '+20 🪙', done: true },
            ].map((m, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{m.title}</div>
                    <div className="text-[11px] font-black text-amber-600">{m.reward}</div>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${m.done ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                  {m.done ? '✅ Lista' : 'En progreso'}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* ══ TOOL 12: DIARIO ══ */}
        {activeTool === 'diario' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Registro de tus últimos 7 días de entrenamiento espacial. ¡Bonificación cósmica cada 5 días continuos!
            </p>
            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
                <div
                  key={d}
                  className={`p-3 rounded-2xl text-center border ${
                    i === 2 || i === 3
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase">{d}</div>
                  <div className="text-xl my-1">{i === 2 || i === 3 ? '⭐' : '⚪'}</div>
                  <div className="text-[10px] font-bold">{i === 2 || i === 3 ? 'Completado' : 'Pendiente'}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-purple-950">🔥 Racha de práctica</div>
                <div className="text-xs text-purple-700">Has practicado con regularidad esta semana.</div>
              </div>
              <button
                type="button"
                onClick={() => Swal.fire('¡Diario Registrado!', 'Tus minutos de práctica fueron contabilizados hoy.', 'success')}
                className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-black text-xs rounded-xl shadow cursor-pointer"
              >
                Registrar Hoy
              </button>
            </div>
          </div>
        )}

        {/* ══ TOOL 13: STICKERS ══ */}
        {activeTool === 'stickers' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Colecciona los 12 stickers espaciales de 4° grado resolviendo misiones y desafíos:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { name: 'Astronauta Fedor', icon: '🧑‍🚀', unlocked: true },
                { name: 'Planeta Tierra', icon: '🌍', unlocked: true },
                { name: 'Cohete Estelar', icon: '🚀', unlocked: true },
                { name: 'Cometa Veloz', icon: '☄️', unlocked: totalXP >= 300 },
                { name: 'Saturno Dorado', icon: '🪐', unlocked: totalXP >= 600 },
                { name: 'Supernova', icon: '💥', unlocked: totalXP >= 1000 },
                { name: 'Estación Alfa', icon: '🛰️', unlocked: totalXP >= 1500 },
                { name: 'Telescopio Web', icon: '🔭', unlocked: totalXP >= 2000 },
                { name: 'Galaxia Espiral', icon: '🌌', unlocked: totalXP >= 2500 },
                { name: 'Sol Ardiente', icon: '☀️', unlocked: totalXP >= 3000 },
                { name: 'Corona de Rey', icon: '👑', unlocked: totalXP >= 4000 },
                { name: 'Copa de Campeón', icon: '🏆', unlocked: totalXP >= 5000 },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-center border transition-all ${
                    s.unlocked
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-gray-100/60 border-dashed border-gray-300 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-1">{s.unlocked ? s.icon : '🔒'}</div>
                  <div className="text-[11px] font-black text-gray-800 leading-tight">{s.name}</div>
                  <div className="text-[9px] font-bold mt-1 text-purple-700">
                    {s.unlocked ? '✨ Coleccionado' : 'Bloqueado'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TOOL 14: JUEGOS Y RETOS RÁPIDOS ══ */}
        {activeTool === 'juegos' && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
              Elige un minijuego para ejercitar tu agilidad mental:
            </p>
            {[
              { title: '⚡ Carrera de Multiplicación', desc: 'Responde 10 multiplicaciones en 30 segundos', icon: '✖️', color: 'from-orange-500 to-amber-500' },
              { title: '🍕 Duelo de Fracciones', desc: 'Compara y suma fracciones equivalentes a máxima velocidad', icon: '🍕', color: 'from-purple-600 to-indigo-600' },
              { title: '🎯 Tiro al Blanco Posicional', desc: 'Identifica el valor en millones de cada cifra antes de que caiga', icon: '🎯', color: 'from-emerald-600 to-teal-500' },
            ].map((game, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center text-2xl shadow`}>
                    {game.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{game.title}</div>
                    <div className="text-xs text-gray-600">{game.desc}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => Swal.fire('🎮 ¡Minijuego!', `Iniciando ${game.title}... ¡Prepárate!`, 'info')}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow transition-colors cursor-pointer"
                >
                  Jugar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
