import React, { useState } from 'react';
import { EstadoEstacion, BitacoraItem } from '../types/estacion.types';
import { CATALOGO, TIER_NOMBRE, pesos } from '../data/estacion-data';
import { PiezaDinero } from '../shared/EstacionScenes';
import { estacionAudio } from '../services/estacion-audio';

interface EstacionTiendaScreenProps {
  estado: EstadoEstacion;
  onActualizarSaldo: (nuevoSaldo: number) => void;
  onRegistrarCompra: (item: BitacoraItem) => void;
  onSetMeta: (meta: string | null) => void;
  onIrMonitor: () => void;
}

const PASOS = ['Observa', 'Lee el costo', 'Paga', 'Recibe el cambio', 'Revisa tu gráfica'];

export default function EstacionTiendaScreen({
  estado,
  onActualizarSaldo,
  onRegistrarCompra,
  onSetMeta,
  onIrMonitor,
}: EstacionTiendaScreenProps) {
  const [paso, setPaso] = useState<number>(0);
  const [itemElegido, setItemElegido] = useState<string | null>(null);
  const [dineroEntregado, setDineroEntregado] = useState<number[]>([]);
  const [cambioEntregado, setCambioEntregado] = useState<number[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const producto = itemElegido ? CATALOGO[itemElegido] : null;
  const sumaEntregada = dineroEntregado.reduce((a, b) => a + b, 0);
  const sumaCambio = cambioEntregado.reduce((a, b) => a + b, 0);
  const cambioExactoEsperado = producto ? sumaEntregada - producto.p : 0;

  // Paso 0: Selección de Producto
  const handleSeleccionarProducto = (k: string) => {
    const c = CATALOGO[k];
    if (c.p > estado.saldo) {
      estacionAudio.mal();
      setMensajeError(`Aún no te alcanza para ${c.n}. ¡Gana más en las misiones!`);
      return;
    }
    estacionAudio.click();
    setItemElegido(k);
    setPaso(1);
    setMensajeError(null);
  };

  // Paso 2: Agregar Dinero para Pagar
  const handleAgregarDineroPago = (val: number) => {
    estacionAudio.moneda();
    setDineroEntregado((prev) => [...prev, val]);
  };

  // Validar Pago
  const handleConfirmarPago = () => {
    if (!producto) return;
    if (sumaEntregada < producto.p) {
      estacionAudio.mal();
      setMensajeError(`Llevas ${pesos(sumaEntregada)} y el costo es ${pesos(producto.p)}. Agrega más dinero.`);
      return;
    }
    estacionAudio.bien();
    setMensajeError(null);
    if (sumaEntregada === producto.p) {
      // Pago exacto: saltar a paso final
      completarTransaccion(0);
    } else {
      setPaso(3); // Ir a dar cambio
    }
  };

  // Paso 3: Agregar Dinero para Cambio
  const handleAgregarDineroCambio = (val: number) => {
    estacionAudio.moneda();
    setCambioEntregado((prev) => [...prev, val]);
  };

  const handleConfirmarCambio = () => {
    if (sumaCambio !== cambioExactoEsperado) {
      estacionAudio.mal();
      setMensajeError(
        `Has contado ${pesos(sumaCambio)} y el cambio exacto es ${pesos(cambioExactoEsperado)}.`
      );
      return;
    }
    estacionAudio.bien();
    setMensajeError(null);
    completarTransaccion(cambioExactoEsperado);
  };

  const completarTransaccion = (cambio: number) => {
    if (!producto) return;
    estacionAudio.compra();
    const nuevoSaldo = estado.saldo - producto.p;
    onActualizarSaldo(nuevoSaldo);

    const registro: BitacoraItem = {
      dia: estado.dia,
      item: producto.n,
      costo: producto.p,
      pago: sumaEntregada,
      cambio,
    };
    onRegistrarCompra(registro);
    setPaso(4);
  };

  const reiniciarTienda = () => {
    setPaso(0);
    setItemElegido(null);
    setDineroEntregado([]);
    setCambioEntregado([]);
    setMensajeError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Pasos de Compra */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-[#1A2650]">
        {PASOS.map((nombrePaso, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              idx === paso
                ? 'bg-[#FFC94D] text-[#070C1F] shadow'
                : idx < paso
                ? 'bg-[#173B2C] text-[#5BD672]'
                : 'bg-[#101B42] text-gray-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span>{nombrePaso}</span>
          </div>
        ))}
      </div>

      {mensajeError && (
        <div className="p-3 bg-[#3B1717] border-2 border-[#FF6B5E] text-[#FF6B5E] font-bold text-center rounded-xl text-sm animate-shake">
          {mensajeError}
        </div>
      )}

      {/* ============================================================
          PASO 0: CATÁLOGO DE PRODUCTOS
          ============================================================ */}
      {paso === 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-[#0A1028] p-4 rounded-2xl border-2 border-[#1A2650]">
            <span className="text-sm md:text-base font-bold text-white">
              Tu saldo disponible:{' '}
              <strong className="text-[#5BD672] font-black text-lg">{pesos(estado.saldo)}</strong>
            </span>
            <span className="text-xs text-[#8FA3D9]">Observa y toca un producto para comprar</span>
          </div>

          {(['eco', 'com', 'pre'] as const).map((tier) => (
            <div key={tier} className="flex flex-col gap-3">
              <h4 className="text-sm font-black uppercase text-[#4FD8CB]">{TIER_NOMBRE[tier]}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(CATALOGO)
                  .filter((k) => CATALOGO[k].tier === tier)
                  .map((k) => {
                    const c = CATALOGO[k];
                    const esMeta = estado.meta === k;
                    const puedeComprar = estado.saldo >= c.p;

                    return (
                      <div
                        key={k}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-3 border-[#070C1F] bg-[#0E1638] transition-all cursor-pointer group ${
                          puedeComprar
                            ? 'hover:scale-105 hover:bg-[#162354]'
                            : 'opacity-50 hover:opacity-75'
                        }`}
                        onClick={() => handleSeleccionarProducto(k)}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            estacionAudio.click();
                            onSetMeta(esMeta ? null : k);
                          }}
                          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            esMeta ? 'bg-[#FFC94D] text-[#070C1F]' : 'bg-[#1A2650] text-gray-400 hover:text-white'
                          }`}
                          title="Fijar meta de ahorro"
                        >
                          {esMeta ? '🎯' : '◎'}
                        </button>

                        <div className="w-14 h-14 my-2 flex items-center justify-center">
                          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
                            <use href={`#${c.ic}`} />
                          </svg>
                        </div>

                        <span className="text-xs md:text-sm font-bold text-white text-center line-clamp-1">
                          {c.n}
                        </span>
                        <span className="text-xs font-black text-[#5BD672] mt-1">{pesos(c.p)}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================
          PASO 1: LEER EL COSTO
          ============================================================ */}
      {paso === 1 && producto && (
        <div className="flex flex-col items-center gap-6 bg-[#0E1638] p-6 rounded-3xl border-3 border-[#1A2650]">
          <h3 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Revisa el costo antes de pagar
          </h3>

          <div className="w-24 h-24 flex items-center justify-center p-3 bg-[#0A1028] rounded-2xl border-2 border-[#1A2650]">
            <svg viewBox="0 0 64 64" width="80" height="80" aria-hidden="true">
              <use href={`#${producto.ic}`} />
            </svg>
          </div>

          <div className="text-center">
            <h4 className="text-lg font-black text-white">{producto.n}</h4>
            <p className="text-3xl font-black text-[#5BD672] mt-2 font-mono">{pesos(producto.p)}</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={reiniciarTienda}
              className="px-5 py-2.5 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl text-sm"
            >
              ← Escoger otro
            </button>
            <button
              type="button"
              onClick={() => {
                estacionAudio.click();
                setPaso(2);
              }}
              className="px-6 py-2.5 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-xl text-sm shadow"
            >
              Ya leí el costo → Ir a pagar
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PASO 2: PAGAR
          ============================================================ */}
      {paso === 2 && producto && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 bg-[#0A1028] px-6 py-3 rounded-2xl border-2 border-[#1A2650]">
            <span className="text-white font-bold">Costo: {pesos(producto.p)}</span>
            <span className="text-gray-500">|</span>
            <span className="text-[#5BD672] font-black">Llevas entregado: {pesos(sumaEntregada)}</span>
          </div>

          {/* Bandeja de dinero entregado */}
          <div className="w-full min-h-[90px] bg-[#0A1028] border-3 border-dashed border-[#4FD8CB] rounded-2xl p-4 flex items-center justify-center gap-2 flex-wrap">
            {dineroEntregado.length === 0 ? (
              <p className="text-xs text-[#8FA3D9]">Toca los billetes y monedas para entregarlos</p>
            ) : (
              dineroEntregado.map((val, idx) => (
                <div key={idx} className="scale-90">
                  <PiezaDinero v={val} disabled />
                </div>
              ))
            )}
          </div>

          {/* Selector de dinero */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[500, 1000, 2000, 5000, 10000, 20000].map((v) => (
              <PiezaDinero key={v} v={v} onClick={() => handleAgregarDineroPago(v)} />
            ))}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setDineroEntregado([])}
              className="px-4 py-2 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl text-xs"
            >
              ↺ Reiniciar dinero
            </button>
            <button
              type="button"
              onClick={handleConfirmarPago}
              className="px-8 py-3 bg-[#5BD672] hover:bg-[#4EBD63] text-[#070C1F] font-black rounded-2xl text-base shadow-xl active:scale-95 cursor-pointer"
            >
              Confirmar Pago ✓
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PASO 3: RECIBIR EL CAMBIO
          ============================================================ */}
      {paso === 3 && producto && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Calcula el cambio exacto
            </h3>
            <p className="text-sm text-[#8FA3D9] mt-1">
              Pagaste {pesos(sumaEntregada)} por un producto de {pesos(producto.p)}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0A1028] px-6 py-3 rounded-2xl border-2 border-[#1A2650]">
            <span className="text-white font-bold">Cambio esperado: {pesos(cambioExactoEsperado)}</span>
            <span className="text-gray-500">|</span>
            <span className="text-[#FFC94D] font-black">Has tomado: {pesos(sumaCambio)}</span>
          </div>

          {/* Bandeja de cambio */}
          <div className="w-full min-h-[90px] bg-[#0A1028] border-3 border-dashed border-[#FFC94D] rounded-2xl p-4 flex items-center justify-center gap-2 flex-wrap">
            {cambioEntregado.length === 0 ? (
              <p className="text-xs text-[#8FA3D9]">Toca el dinero exacto que debes recibir de cambio</p>
            ) : (
              cambioEntregado.map((val, idx) => (
                <div key={idx} className="scale-90">
                  <PiezaDinero v={val} disabled />
                </div>
              ))
            )}
          </div>

          {/* Selector de dinero */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[100, 200, 500, 1000, 2000, 5000].map((v) => (
              <PiezaDinero key={v} v={v} onClick={() => handleAgregarDineroCambio(v)} />
            ))}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setCambioEntregado([])}
              className="px-4 py-2 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl text-xs"
            >
              ↺ Reiniciar cambio
            </button>
            <button
              type="button"
              onClick={handleConfirmarCambio}
              className="px-8 py-3 bg-[#FFC94D] hover:bg-[#FFE3A1] text-[#070C1F] font-black rounded-2xl text-base shadow-xl active:scale-95 cursor-pointer"
            >
              Recibir Cambio ✓
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PASO 4: COMPRA COMPLETADA
          ============================================================ */}
      {paso === 4 && producto && (
        <div className="flex flex-col items-center gap-6 bg-[#0E1638] p-8 rounded-3xl border-3 border-[#5BD672] text-center">
          <span className="text-4xl">🎉</span>
          <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            ¡Compra Estelar Exitosa!
          </h3>
          <p className="text-sm text-[#B9C4E8] max-w-md">
            Has adquirido tu <strong className="text-[#5BD672]">{producto.n}</strong> por{' '}
            <strong className="text-[#FFC94D]">{pesos(producto.p)}</strong>. Esta compra se ha registrado en tu
            bitácora y monitor financiero.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={reiniciarTienda}
              className="px-6 py-3 bg-[#1A2650] hover:bg-[#243468] text-white font-bold rounded-xl text-sm"
            >
              Seguir en la Tienda
            </button>
            <button
              type="button"
              onClick={() => {
                estacionAudio.click();
                onIrMonitor();
              }}
              className="px-6 py-3 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-xl text-sm shadow"
            >
              Ver Monitor Financiero 📊
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
