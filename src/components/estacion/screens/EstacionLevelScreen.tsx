import React, { useState, useEffect, useCallback } from 'react';
import {
  ModuloEstacion,
  NivelData,
  EstadoEstacion,
  RondaData,
  UbicarData,
  UbicarItem,
} from '../types/estacion.types';
import { RenderEscena, PiezaDinero } from '../shared/EstacionScenes';
import { BANDAS, PAGO_AHORRO, pesos } from '../data/estacion-data';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionLevelScreenProps {
  modulo: ModuloEstacion;
  nivel: NivelData;
  nivelIndex: number;
  estado: EstadoEstacion;
  onCompletarNivel: (estrellas: number, sinCorazones: boolean, ahorroGanado?: number) => void;
  onVolverModulo: () => void;
}

export default function EstacionLevelScreen({
  modulo,
  nivel,
  nivelIndex,
  estado,
  onCompletarNivel,
  onVolverModulo,
}: EstacionLevelScreenProps) {
  const [vidas, setVidas] = useState(3);
  const [rondaIdx, setRondaIdx] = useState(0);
  const [fedorCara, setFedorCara] = useState<'feliz' | 'wow' | 'triste'>('feliz');
  const [fedorFrase, setFedorFrase] = useState<string>(nivel.frase || '¡A la misión!');
  const [avisoMsg, setAvisoMsg] = useState<{ texto: string; bien: boolean } | null>(null);
  const [bloqueado, setBloqueado] = useState(false);

  // Estados específicos por mecánica
  // 1. Entradas
  const [inputsVal, setInputsVal] = useState<Record<number, string>>({});
  const [inputErrors, setInputErrors] = useState<Record<number, boolean>>({});

  // 2. Ordenar
  const [ordenPuestos, setOrdenPuestos] = useState<Array<[string, number]>>([]);
  const [ordenDisponibles, setOrdenDisponibles] = useState<Array<[string, number]>>([]);

  // 3. Armar
  const [armarSuma, setArmarSuma] = useState(0);
  const [armarPiezasUsadas, setArmarPiezasUsadas] = useState<number[]>([]);
  const [armarPiezasDisponibles, setArmarPiezasDisponibles] = useState<Array<{ id: number; v: number; used: boolean }>>([]);

  // 4. Ubicar
  const [ubicarSel, setUbicarSel] = useState<UbicarItem | null>(null);
  const [ubicarPuestos, setUbicarPuestos] = useState<Record<string, UbicarItem[]>>({});
  const [ubicarItemsRestantes, setUbicarItemsRestantes] = useState<UbicarItem[]>([]);

  // 5. Ahorro
  const [ahorroRondas, setAhorroRondas] = useState<Array<{ recibo: number; pago: number; queda: number }>>([]);
  const [ahorroGanado, setAhorroGanado] = useState(0);
  const [ahorroInput, setAhorroInput] = useState('');

  // 6. Fracción
  const [fraccionSel, setFraccionSel] = useState<Set<number>>(new Set());

  // Rondas del nivel
  const rondas: RondaData[] = nivel.datos?.rondas || [];
  const rondaActual: RondaData = rondas[rondaIdx] || {};

  const hablarConsigna = useCallback(() => {
    if (rondaActual.consigna) {
      estacionAudio.hablar(`${rondaActual.consigna}. ${rondaActual.ayuda || ''}`);
    } else if (nivel.o) {
      estacionAudio.hablar(`${nivel.t}. ${nivel.o}`);
    }
  }, [rondaActual, nivel]);

  // Inicialización de rondas y mecánicas
  useEffect(() => {
    setVidas(3);
    setRondaIdx(0);
    setBloqueado(false);
    setFedorCara('feliz');
    setFedorFrase(nivel.frase || '¡A la misión!');

    if (nivel.mec === 'ordenar' && rondas[0]?.items) {
      setOrdenDisponibles([...rondas[0].items].sort(() => Math.random() - 0.5));
      setOrdenPuestos([]);
    }

    if (nivel.mec === 'armar' && rondas[0]?.piezas) {
      setArmarSuma(0);
      setArmarPiezasUsadas([]);
      setArmarPiezasDisponibles(
        rondas[0].piezas.map((v, i) => ({ id: i, v, used: false })).sort(() => Math.random() - 0.5)
      );
    }

    if (nivel.mec === 'ubicar') {
      const ubicarData = nivel.datos as UbicarData;
      if (ubicarData?.items) {
        setUbicarItemsRestantes([...ubicarData.items].sort(() => Math.random() - 0.5));
        setUbicarPuestos({});
        setUbicarSel(null);
      }
    }

    if (nivel.mec === 'ahorro') {
      const generated: Array<{ recibo: number; pago: number; queda: number }> = [];
      for (let r = 0; r < 10; r++) {
        const recibo = (2 + Math.floor(Math.random() * 17)) * 500;
        const pago = (1 + Math.floor(Math.random() * (recibo / 100 - 1))) * 100;
        generated.push({ recibo, pago, queda: recibo - pago });
      }
      setAhorroRondas(generated);
      setAhorroGanado(0);
      setAhorroInput('');
    }

    if (nivel.mec === 'fraccion') {
      setFraccionSel(new Set());
    }

    hablarConsigna();
  }, [nivel]);

  const registrarFallo = (msg: string) => {
    estacionAudio.mal();
    const nuevasVidas = Math.max(0, vidas - 1);
    setVidas(nuevasVidas);
    setFedorCara('triste');
    setFedorFrase('Uy, casi. Vuelve a revisar con calma.');
    setAvisoMsg({ texto: msg, bien: false });

    if (nuevasVidas === 0) {
      setBloqueado(true);
      setTimeout(() => {
        onCompletarNivel(1, true, ahorroGanado);
      }, 900);
    }
  };

  const registrarAcierto = (msg: string) => {
    estacionAudio.bien();
    setFedorCara('wow');
    setFedorFrase('¡Excelente cadete! ¡Punto exacto!');
    setAvisoMsg({ texto: msg, bien: true });
    setBloqueado(true);
    setTimeout(() => {
      onCompletarNivel(vidas, false, ahorroGanado);
    }, 900);
  };

  // 1. Manejo Mecánica OPCIONES
  const handleSelectOpcion = (opcion: string | number) => {
    if (bloqueado) return;
    const esCorrecto = String(opcion) === String(rondaActual.corr);
    if (esCorrecto) {
      estacionAudio.moneda();
      if (rondaIdx + 1 >= rondas.length) {
        registrarAcierto('¡Ronda completada con éxito!');
      } else {
        setFedorCara('feliz');
        setFedorFrase('¡Muy bien!');
        setAvisoMsg({ texto: '¡Correcto!', bien: true });
        setTimeout(() => {
          setRondaIdx((prev) => prev + 1);
          setAvisoMsg(null);
        }, 650);
      }
    } else {
      registrarFallo('Esa no es la respuesta correcta. Revisa con cuidado.');
    }
  };

  // 2. Manejo Mecánica ENTRADAS
  const handleComprobarEntradas = () => {
    if (bloqueado) return;
    const campos = rondaActual.campos || [];
    let malas = 0;
    const nuevosErrores: Record<number, boolean> = {};

    campos.forEach((c, idx) => {
      const valStr = (inputsVal[idx] || '').replace(',', '.').trim();
      const valNum = Number(valStr);
      const tol = c.tol != null ? c.tol : 0.01;
      const ok = Math.abs(valNum - c.esp) <= tol;
      if (!ok) {
        malas++;
        nuevosErrores[idx] = true;
      }
    });

    setInputErrors(nuevosErrores);

    if (malas > 0) {
      registrarFallo(`Hay ${malas} casilla${malas > 1 ? 's' : ''} por corregir.`);
    } else {
      estacionAudio.moneda();
      if (rondaIdx + 1 >= rondas.length) {
        registrarAcierto('¡Todas las cuentas correctas!');
      } else {
        setFedorCara('feliz');
        setFedorFrase('¡Cálculo exacto!');
        setAvisoMsg({ texto: '¡Correcto!', bien: true });
        setTimeout(() => {
          setRondaIdx((prev) => prev + 1);
          setInputsVal({});
          setInputErrors({});
          setAvisoMsg(null);
        }, 750);
      }
    }
  };

  // 3. Manejo Mecánica ORDENAR
  const handlePonerFichaOrdenar = (item: [string, number]) => {
    if (bloqueado) return;
    const todos = rondaActual.items || [];
    const ordenados = [...todos].sort((a, b) => a[1] - b[1]);
    const proxEsperado = ordenados[ordenPuestos.length];

    if (item[1] === proxEsperado[1]) {
      estacionAudio.moneda();
      const nuevosPuestos = [...ordenPuestos, item];
      setOrdenPuestos(nuevosPuestos);
      setOrdenDisponibles((prev) => prev.filter((x) => x !== item));

      if (nuevosPuestos.length === todos.length) {
        if (rondaIdx + 1 >= rondas.length) {
          registrarAcierto('¡Orden de llegada perfecto!');
        } else {
          setFedorCara('feliz');
          setAvisoMsg({ texto: '¡Llegada ordenada!', bien: true });
          setTimeout(() => {
            setRondaIdx((prev) => prev + 1);
            const proxRonda = rondas[rondaIdx + 1];
            if (proxRonda?.items) {
              setOrdenDisponibles([...proxRonda.items].sort(() => Math.random() - 0.5));
              setOrdenPuestos([]);
            }
            setAvisoMsg(null);
          }, 700);
        }
      }
    } else {
      registrarFallo('Ese no es el menor de los que quedan. ¡Comienza la ronda de nuevo!');
      setTimeout(() => {
        if (vidas > 1 && rondaActual.items) {
          setOrdenDisponibles([...rondaActual.items].sort(() => Math.random() - 0.5));
          setOrdenPuestos([]);
        }
      }, 700);
    }
  };

  // 4. Manejo Mecánica ARMAR
  const handlePonerPiezaDinero = (pieceObj: { id: number; v: number }) => {
    if (bloqueado) return;
    estacionAudio.moneda();
    const meta = rondaActual.meta || 0;
    const nuevaSuma = armarSuma + pieceObj.v;
    setArmarSuma(nuevaSuma);
    setArmarPiezasUsadas((prev) => [...prev, pieceObj.v]);
    setArmarPiezasDisponibles((prev) =>
      prev.map((p) => (p.id === pieceObj.id ? { ...p, used: true } : p))
    );

    if (nuevaSuma === meta) {
      if (rondaIdx + 1 >= rondas.length) {
        registrarAcierto('¡Armaste todas las cantidades exactas!');
      } else {
        setFedorCara('feliz');
        setAvisoMsg({ texto: '¡Valor exacto!', bien: true });
        setTimeout(() => {
          setRondaIdx((prev) => prev + 1);
          const proxRonda = rondas[rondaIdx + 1];
          if (proxRonda?.piezas) {
            setArmarSuma(0);
            setArmarPiezasUsadas([]);
            setArmarPiezasDisponibles(
              proxRonda.piezas.map((v, i) => ({ id: i, v, used: false })).sort(() => Math.random() - 0.5)
            );
          }
          setAvisoMsg(null);
        }, 700);
      }
    } else if (nuevaSuma > meta) {
      registrarFallo(`Te pasaste: llevas ${pesos(nuevaSuma)} y la meta es ${pesos(meta)}.`);
      setTimeout(() => {
        if (vidas > 1 && rondaActual.piezas) {
          setArmarSuma(0);
          setArmarPiezasUsadas([]);
          setArmarPiezasDisponibles(
            rondaActual.piezas.map((v, i) => ({ id: i, v, used: false })).sort(() => Math.random() - 0.5)
          );
        }
      }, 850);
    }
  };

  // 5. Manejo Mecánica UBICAR
  const handleSlotUbicar = (contenedorId: string) => {
    if (bloqueado) return;
    if (!ubicarSel) {
      setAvisoMsg({ texto: 'Primero toca un elemento de la izquierda.', bien: false });
      estacionAudio.mal();
      return;
    }

    if (ubicarSel.c === contenedorId) {
      estacionAudio.moneda();
      const itemColocado = ubicarSel;
      setUbicarSel(null);
      setUbicarItemsRestantes((prev) => prev.filter((x) => x !== itemColocado));
      setUbicarPuestos((prev) => ({
        ...prev,
        [contenedorId]: [...(prev[contenedorId] || []), itemColocado],
      }));

      const ubicarData = nivel.datos as UbicarData;
      const totalColocados = Object.values(ubicarPuestos).reduce((a, b) => a + b.length, 0) + 1;

      if (totalColocados >= ubicarData.items.length) {
        registrarAcierto('¡Todo clasificado en su lugar!');
      } else {
        setAvisoMsg({ texto: `¡Correcto! ${itemColocado.t} clasificado.`, bien: true });
      }
    } else {
      registrarFallo(`${ubicarSel.t} no pertenece a este grupo. Piensa con calma.`);
    }
  };

  // 6. Manejo Mecánica AHORRO
  const handleComprobarAhorro = () => {
    if (bloqueado) return;
    const curAhorro = ahorroRondas[rondaIdx];
    if (!curAhorro) return;

    if (Number(ahorroInput.trim()) === curAhorro.queda) {
      estacionAudio.moneda();
      const nuevoAhorro = ahorroGanado + PAGO_AHORRO;
      setAhorroGanado(nuevoAhorro);

      if (rondaIdx + 1 >= ahorroRondas.length) {
        registrarAcierto(`¡10 de 10! Guardaste ${pesos(nuevoAhorro)} en tu alcancía.`);
      } else {
        setFedorCara('feliz');
        setAvisoMsg({ texto: `¡Correcto! +${pesos(PAGO_AHORRO)} a la alcancía.`, bien: true });
        setTimeout(() => {
          setRondaIdx((prev) => prev + 1);
          setAhorroInput('');
          setAvisoMsg(null);
        }, 750);
      }
    } else {
      registrarFallo(`Resta: ${pesos(curAhorro.recibo)} − ${pesos(curAhorro.pago)}.`);
    }
  };

  // 7. Manejo Mecánica FRACCIÓN
  const handleTogglePorcionFraccion = (sliceIdx: number) => {
    if (bloqueado) return;
    estacionAudio.moneda();
    setFraccionSel((prev) => {
      const next = new Set(prev);
      if (next.has(sliceIdx)) next.delete(sliceIdx);
      else next.add(sliceIdx);
      return next;
    });
  };

  const handleComprobarFraccion = () => {
    if (bloqueado) return;
    const reqK = rondaActual.k || 0;
    const reqN = rondaActual.n || 1;

    if (fraccionSel.size === reqK) {
      estacionAudio.moneda();
      if (rondaIdx + 1 >= rondas.length) {
        registrarAcierto('¡Fracciones espaciales dominadas!');
      } else {
        setFedorCara('feliz');
        setAvisoMsg({ texto: `¡${reqK}/${reqN} perfecto!`, bien: true });
        setTimeout(() => {
          setRondaIdx((prev) => prev + 1);
          setFraccionSel(new Set());
          setAvisoMsg(null);
        }, 750);
      }
    } else {
      registrarFallo(`Llevas ${fraccionSel.size} porción${fraccionSel.size === 1 ? '' : 'es'} y se piden ${reqK} de ${reqN}.`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-5">
      {/* Barra superior de estado */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#0A1028] p-4 rounded-2xl border-3 border-[#1A2650]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              estacionAudio.click();
              onVolverModulo();
            }}
            className="px-3 py-1.5 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl text-xs border border-[#070C1F]"
          >
            ← Salir
          </button>
          <span className="text-xs md:text-sm font-black uppercase text-[#4FD8CB] bg-[#141E42] px-3 py-1 rounded-full border border-[#2B3A70]">
            {modulo.nombre} · {nivel.et || BANDAS[nivelIndex]}
          </span>
        </div>

        {/* Vidas */}
        <div className="flex items-center gap-1.5 text-2xl">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < vidas ? 'animate-pulse' : 'opacity-30'}>
              {i < vidas ? '❤️' : '🖤'}
            </span>
          ))}
        </div>

        {/* Indicador de Rondas */}
        {rondas.length > 1 && (
          <div className="flex items-center gap-1.5">
            {rondas.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < rondaIdx ? 'bg-[#5BD672]' : i === rondaIdx ? 'bg-[#FFC94D] scale-125' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fedor Guía con Globo de Diálogo */}
      <div className="flex items-center gap-4 bg-[#101B42] p-4 rounded-2xl border-3 border-[#070C1F] shadow-lg">
        <div className="w-16 h-16 shrink-0 relative">
          <svg viewBox="0 0 130 150" width="64" height="74" aria-hidden="true">
            <use href={`#fx-${fedorCara}`} />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm md:text-base font-bold text-white leading-snug">{fedorFrase}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            estacionAudio.click();
            hablarConsigna();
          }}
          className="px-3 py-2 bg-[#FFC94D] hover:bg-[#FFE3A1] text-[#070C1F] font-black rounded-xl text-xs flex items-center gap-1.5 shadow"
          title="Escuchar consigna"
        >
          <span>🔊</span>
          <span>Escuchar</span>
        </button>
      </div>

      {/* Consigna y Ayuda */}
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          {nivel.mec === 'ahorro'
            ? `Recibes ${pesos(ahorroRondas[rondaIdx]?.recibo || 0)} y pagas ${pesos(ahorroRondas[rondaIdx]?.pago || 0)}`
            : rondaActual.consigna || nivel.t}
        </h3>
        <p className="text-sm text-[#8FA3D9] mt-1">
          {nivel.mec === 'ahorro'
            ? '¿Cuánto dinero te queda? Cada acierto suma a tu alcancía.'
            : rondaActual.ayuda || nivel.o}
        </p>
      </div>

      {/* Mensaje de retroalimentación */}
      {avisoMsg && (
        <div
          className={`p-3 rounded-xl text-center font-bold text-sm border-2 animate-bounce ${
            avisoMsg.bien
              ? 'bg-[#173B2C] border-[#5BD672] text-[#5BD672]'
              : 'bg-[#3B1717] border-[#FF6B5E] text-[#FF6B5E]'
          }`}
        >
          {avisoMsg.texto}
        </div>
      )}

      {/* Escena Gráfica (si existe) */}
      {rondaActual.escena && (
        <div className="bg-[#070C1F]/60 p-4 rounded-2xl border-2 border-[#1A2650] flex justify-center">
          <RenderEscena escena={rondaActual.escena} />
        </div>
      )}

      {/* ============================================================
          ZONA DE JUEGO INTERACTIVA POR MECÁNICA
          ============================================================ */}

      {/* 1. MECÁNICA: OPCIONES */}
      {nivel.mec === 'opciones' && rondaActual.ops && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {rondaActual.ops.map((op, idx) => {
            const esObj = typeof op === 'object';
            const val = esObj ? op.v : op;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOpcion(val)}
                className="p-4 rounded-2xl bg-[#1A2650] hover:bg-[#283C78] border-3 border-[#070C1F] text-white font-black text-lg md:text-xl shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-2"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                {esObj && op.escena && <RenderEscena escena={op.escena} />}
                <span>{String(val)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. MECÁNICA: ENTRADAS */}
      {nivel.mec === 'entradas' && rondaActual.campos && (
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {rondaActual.campos.map((campo, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[#1A2650] px-4 py-3 rounded-2xl border-2 border-[#070C1F]">
                <strong className="text-sm md:text-base text-white">{campo.etq}</strong>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={inputsVal[idx] || ''}
                  onChange={(e) => setInputsVal({ ...inputsVal, [idx]: e.target.value })}
                  className={`w-24 text-center text-lg font-black rounded-xl p-2 bg-[#0A1028] text-white border-2 outline-none ${
                    inputErrors[idx] ? 'border-[#FF6B5E] animate-shake' : 'border-[#4FD8CB]'
                  }`}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleComprobarEntradas}
            className="px-8 py-3 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-2xl text-base shadow-xl transition-all active:scale-95 cursor-pointer mt-2"
          >
            Comprobar Cuenta ✓
          </button>
        </div>
      )}

      {/* 3. MECÁNICA: ORDENAR */}
      {nivel.mec === 'ordenar' && (
        <div className="flex flex-col items-center gap-6 mt-2">
          {/* Bandeja de orden de llegada */}
          <div className="w-full min-h-[70px] bg-[#0A1028] border-3 border-dashed border-[#4FD8CB] rounded-2xl p-3 flex items-center justify-center gap-3 flex-wrap">
            {ordenPuestos.length === 0 ? (
              <p className="text-xs md:text-sm text-[#8FA3D9]">Toca los tiempos del menor al mayor para ubicarlos aquí →</p>
            ) : (
              ordenPuestos.map((item, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[#5BD672] text-[#070C1F] font-black rounded-xl text-base border-2 border-[#070C1F] shadow"
                >
                  {item[0]}
                </span>
              ))
            )}
          </div>

          {/* Fichas disponibles */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ordenDisponibles.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePonerFichaOrdenar(item)}
                className="px-5 py-3 bg-[#1A2650] hover:bg-[#283C78] text-white font-black rounded-2xl text-lg border-3 border-[#070C1F] shadow-lg transition-transform active:scale-95"
              >
                {item[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. MECÁNICA: ARMAR */}
      {nivel.mec === 'armar' && (
        <div className="flex flex-col items-center gap-5 mt-2">
          {/* Contador de Meta */}
          <div className="flex items-center gap-3 text-lg md:text-xl font-bold bg-[#141E42] px-6 py-2.5 rounded-full border-2 border-[#4FD8CB]">
            <span className="text-[#5BD672] font-black">{pesos(armarSuma)}</span>
            <span className="text-[#8FA3D9]">de</span>
            <span className="text-[#FFC94D] font-black">{pesos(rondaActual.meta || 0)}</span>
          </div>

          {/* Bandeja de Dinero Acumulado */}
          <div className="w-full min-h-[90px] bg-[#0A1028] border-3 border-dashed border-[#2F3E75] rounded-2xl p-4 flex items-center justify-center gap-3 flex-wrap">
            {armarPiezasUsadas.length === 0 ? (
              <p className="text-xs md:text-sm text-[#8FA3D9]">La bandeja está vacía: toca las monedas y billetes de abajo</p>
            ) : (
              armarPiezasUsadas.map((val, idx) => (
                <div key={idx} className="scale-90">
                  <PiezaDinero v={val} disabled />
                </div>
              ))
            )}
          </div>

          {/* Rejilla de piezas disponibles */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {armarPiezasDisponibles.map((p) => (
              <PiezaDinero
                key={p.id}
                v={p.v}
                disabled={p.used}
                onClick={() => handlePonerPiezaDinero(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. MECÁNICA: UBICAR */}
      {nivel.mec === 'ubicar' && (
        <div className="flex flex-col gap-5 mt-2">
          {/* Barra de progreso de ubicar */}
          <div className="flex items-center justify-between text-xs md:text-sm font-bold text-[#8FA3D9] bg-[#0A1028] p-3 rounded-xl border border-[#1A2650]">
            <span>👤 {estado.nombre}</span>
            <span>💎 Puntos: {pesos(estado.saldo)}</span>
            <span>
              Ubicados:{' '}
              {Object.values(ubicarPuestos).reduce((a, b) => a + b.length, 0)} /{' '}
              {(nivel.datos as UbicarData)?.items?.length || 0}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna Izquierda: Elementos restantes */}
            <div className="bg-[#0A1028] p-4 rounded-2xl border-2 border-[#1A2650]">
              <h4 className="text-xs font-black uppercase text-[#4FD8CB] mb-3">Elementos por ubicar</h4>
              <div className="flex flex-wrap gap-2">
                {ubicarItemsRestantes.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      estacionAudio.click();
                      setUbicarSel(ubicarSel === item ? null : item);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                      ubicarSel === item
                        ? 'bg-[#FFC94D] text-[#070C1F] border-white scale-105 shadow-lg'
                        : 'bg-[#1A2650] text-white border-[#070C1F] hover:bg-[#253770]'
                    }`}
                  >
                    <span>{item.e}</span>
                    <span>{item.t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Contenedores */}
            <div className="flex flex-col gap-3">
              {(nivel.datos as UbicarData)?.contenedores?.map((c) => {
                const itemsEnSlot = ubicarPuestos[c.id] || [];
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSlotUbicar(c.id)}
                    className="p-3 rounded-2xl border-2 border-[#1A2650] bg-[#101B42] hover:border-[#4FD8CB] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-white text-sm">
                        <span className="text-lg">{c.e}</span>
                        <span>{c.n}</span>
                      </div>
                      <span className="text-xs text-[#8FA3D9] font-semibold">{itemsEnSlot.length} items</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[32px] bg-[#070C1F]/60 p-2 rounded-xl">
                      {itemsEnSlot.length === 0 ? (
                        <span className="text-xs text-gray-500 italic">(vacío)</span>
                      ) : (
                        itemsEnSlot.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="px-2 py-0.5 bg-[#1A2650] text-[#5BD672] font-bold rounded-lg text-xs flex items-center gap-1 border border-[#070C1F]"
                          >
                            <span>{item.e}</span>
                            <span>{item.t}</span>
                            {item.p != null && <span className="text-[#FFC94D] font-mono">({pesos(item.p)})</span>}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. MECÁNICA: AHORRO */}
      {nivel.mec === 'ahorro' && (
        <div className="flex flex-col items-center gap-5 mt-2">
          {/* Alcancía acumulada */}
          <div className="bg-[#141E42] px-6 py-2.5 rounded-full border-2 border-[#FFC94D] flex items-center gap-2 font-bold text-[#FFC94D]">
            <span>🏦 Alcancía:</span>
            <span className="text-lg font-black">{pesos(ahorroGanado)}</span>
          </div>

          <div className="flex items-center gap-3 bg-[#1A2650] px-5 py-3.5 rounded-2xl border-2 border-[#070C1F]">
            <strong className="text-white text-base">Te queda:</strong>
            <input
              type="number"
              placeholder="0"
              value={ahorroInput}
              onChange={(e) => setAhorroInput(e.target.value)}
              className="w-36 text-center text-xl font-black rounded-xl p-2 bg-[#0A1028] text-white border-2 border-[#4FD8CB] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleComprobarAhorro}
            className="px-8 py-3 bg-[#FFC94D] hover:bg-[#FFE3A1] text-[#070C1F] font-black rounded-2xl text-base shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Guardar en Alcancía ✓
          </button>
        </div>
      )}

      {/* 7. MECÁNICA: FRACCIÓN */}
      {nivel.mec === 'fraccion' && rondaActual.n && (
        <div className="flex flex-col items-center gap-5 mt-2">
          <div className="flex justify-center p-2">
            <svg viewBox="0 0 240 240" width="240" height="240" aria-hidden="true">
              {Array.from({ length: rondaActual.n }).map((_, k2) => {
                const n = rondaActual.n || 1;
                const cx = 120;
                const cy = 120;
                const R = 104;
                const a0 = ((k2 * 360) / n - 90) * (Math.PI / 180);
                const a1 = (((k2 + 1) * 360) / n - 90) * (Math.PI / 180);
                const grande = a1 - a0 > Math.PI ? 1 : 0;
                const isSelected = fraccionSel.has(k2);

                return (
                  <path
                    key={k2}
                    d={`M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 ${grande} 1 ${
                      cx + R * Math.cos(a1)
                    } ${cy + R * Math.sin(a1)} Z`}
                    fill={isSelected ? '#FF6B5E' : '#F5C6C0'}
                    stroke="#070C1F"
                    strokeWidth="4"
                    className="cursor-pointer transition-colors hover:opacity-80"
                    onClick={() => handleTogglePorcionFraccion(k2)}
                  />
                );
              })}
            </svg>
          </div>

          <p className="text-xs text-[#8FA3D9]">Torta dividida en {rondaActual.n} porciones iguales</p>

          <button
            type="button"
            onClick={handleComprobarFraccion}
            className="px-8 py-3 bg-[#FF6B5E] hover:bg-[#FF8A5C] text-white font-black rounded-2xl text-base shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Servir Porciones ✓
          </button>
        </div>
      )}
    </div>
  );
}
