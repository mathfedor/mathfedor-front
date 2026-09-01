import React, { useState, useEffect, useRef } from 'react';
import {
  ModuloEstacion,
  NivelData,
  EstadoEstacion,
  BitacoraItem,
} from './types/estacion.types';
import { MODULOS, CATALOGO, PAGO_ESTRELLA, pesos } from './data/estacion-data';
import { estacionAudio } from './services/estacion-audio';
import EstacionSvgDefs from './shared/EstacionSvgDefs';
import ConfettiCanvas, { ConfettiRef } from './shared/ConfettiCanvas';

import EstacionMapScreen from './screens/EstacionMapScreen';
import EstacionModuleScreen from './screens/EstacionModuleScreen';
import EstacionLevelScreen from './screens/EstacionLevelScreen';
import EstacionTiendaScreen from './screens/EstacionTiendaScreen';
import EstacionBitacoraScreen from './screens/EstacionBitacoraScreen';
import EstacionMonitorScreen from './screens/EstacionMonitorScreen';
import EstacionDocenteScreen from './screens/EstacionDocenteScreen';
import EstacionJuegosScreen from './screens/EstacionJuegosScreen';

type VistaSec =
  | 'mapa'
  | 'modulo'
  | 'nivel'
  | 'tienda'
  | 'bitacora'
  | 'monitor'
  | 'docente'
  | 'juegos';

const STORAGE_KEY = 'fedor_estacion_v9_estado';

const ESTADO_INICIAL: EstadoEstacion = {
  progreso: {},
  saldo: 1000,
  vidas: 3,
  dia: 1,
  bitacora: [],
  meta: null,
  registro: {},
  nombre: 'Cadete Fedor',
};

export default function EstacionExperience() {
  const [estado, setEstado] = useState<EstadoEstacion>(ESTADO_INICIAL);
  const [secActiva, setSecActiva] = useState<VistaSec>('mapa');
  const [moduloActivo, setModuloActivo] = useState<ModuloEstacion | null>(null);
  const [nivelActivo, setNivelActivo] = useState<{ n: NivelData; ni: number } | null>(null);
  const [sonidoOn, setSonidoOn] = useState(true);
  const [vozOn, setVozOn] = useState(true);

  // Modal de Victoria / Nivel Terminado
  const [modalVictoria, setModalVictoria] = useState<{
    visible: boolean;
    estrellas: number;
    sinCorazones: boolean;
    pago: number;
  }>({
    visible: false,
    estrellas: 3,
    sinCorazones: false,
    pago: 0,
  });

  const confettiRef = useRef<ConfettiRef | null>(null);

  // Cargar estado guardado
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        setEstado(JSON.parse(guardado));
      }
    } catch {
      // ignore
    }
  }, []);

  // Guardar estado en cambios
  const actualizarEstado = (nuevo: EstadoEstacion) => {
    setEstado(nuevo);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
    } catch {
      // ignore
    }
  };

  const totalEstrellas = Object.values(estado.progreso).reduce((a, b) => a + b, 0);

  // Navegación
  const irA = (sec: VistaSec) => {
    estacionAudio.click();
    setSecActiva(sec);
  };

  // Manejador al terminar nivel
  const handleCompletarNivel = (
    estrellas: number,
    sinCorazones: boolean,
    ahorroGanado?: number
  ) => {
    if (!moduloActivo || !nivelActivo) return;
    const { n, ni } = nivelActivo;
    const id = `${moduloActivo.id}-${ni}`;
    const previo = estado.progreso[id] || 0;
    let pago = 0;

    if (!sinCorazones) {
      if (n.ahorro) {
        pago = ahorroGanado || 0;
      } else {
        if (estrellas > previo) {
          pago = (estrellas - previo) * PAGO_ESTRELLA;
        }
      }
      if (confettiRef.current) {
        confettiRef.current.lanzar(estrellas === 3 ? 160 : 80);
      }
      estacionAudio.victoria();
    }

    const nuevoProgreso = {
      ...estado.progreso,
      [id]: Math.max(previo, sinCorazones ? 0 : estrellas),
    };

    const nuevoSaldo = estado.saldo + pago;

    const rPrev = estado.registro[id] || { int: 0, ok: 0, seg: 0, est: 0 };
    const nuevoRegistro = {
      ...estado.registro,
      [id]: {
        ...rPrev,
        int: rPrev.int + 1,
        ok: rPrev.ok + (sinCorazones ? 0 : 1),
        est: Math.max(rPrev.est, sinCorazones ? 0 : estrellas),
      },
    };

    actualizarEstado({
      ...estado,
      progreso: nuevoProgreso,
      saldo: nuevoSaldo,
      registro: nuevoRegistro,
    });

    setModalVictoria({
      visible: true,
      estrellas,
      sinCorazones,
      pago,
    });
  };

  const metaProducto = estado.meta ? CATALOGO[estado.meta] : null;
  const [toastGuardado, setToastGuardado] = useState(false);

  const handleGuardarManual = () => {
    estacionAudio.moneda();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
      setToastGuardado(true);
      setTimeout(() => setToastGuardado(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1836] text-[#F2F6FF] flex flex-col font-sans select-none relative overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(1.5px 1.5px at 12% 22%, #fff 50%, transparent 51%),
          radial-gradient(1.6px 1.6px at 34% 8%, #fff 50%, transparent 51%),
          radial-gradient(1.7px 1.7px at 58% 30%, #FFD98A 50%, transparent 51%),
          radial-gradient(1.4px 1.4px at 76% 12%, #fff 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 90% 42%, #A7E9E2 50%, transparent 51%),
          radial-gradient(1.4px 1.4px at 22% 64%, #fff 50%, transparent 51%),
          radial-gradient(1.6px 1.6px at 48% 82%, #C9B8FF 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 84% 84%, #FFD98A 50%, transparent 51%),
          radial-gradient(ellipse at 50% -20%, #21316B 0%, #0F1836 52%, #0A1028 100%)
        `,
      }}
    >
      <EstacionSvgDefs />
      <ConfettiCanvas ref={confettiRef} />

      {/* Contenedor Principal Centrado con margen superior */}
      <div className="max-w-[1040px] w-full mx-auto pt-6 md:pt-8 px-4 pb-12 flex flex-col gap-5">
        {/* ============================================================
            ENCABEZADO / HUD ESPACIAL (SEGÚN LA IMAGEN DE REFERENCIA)
            ============================================================ */}
        <header
          className="relative bg-gradient-to-b from-[#243468] to-[#1A2650] border-[4px] border-[#070C1F] rounded-[22px] p-4 md:p-5 flex items-center gap-4 flex-wrap shadow-[0_0_0_2px_rgba(79,216,203,0.25),7px_8px_0_rgba(0,0,0,0.45)]"
        >
          {/* Tres Puntos de Ventana Superior Izquierda */}
          <div className="absolute top-2.5 left-4 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5BD672] shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC94D] shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B5E] shadow-sm" />
          </div>

          {/* Mascota Fedor Robot */}
          <div
            className="w-[84px] h-[92px] shrink-0 flex items-center justify-center cursor-pointer pt-2"
            onClick={() => irA('mapa')}
          >
            <svg
              className="w-full h-full drop-shadow-[3px_4px_0_rgba(0,0,0,0.4)]"
              viewBox="0 0 130 150"
              aria-hidden="true"
            >
              <use href="#fx-feliz" />
            </svg>
          </div>

          {/* Título y Subtítulo */}
          <div className="mr-auto cursor-pointer pt-1" onClick={() => irA('mapa')}>
            <h1
              className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-[#4FD8CB] to-[#FFC94D] bg-clip-text text-transparent"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              ESTACIÓN FEDOR
            </h1>
            <span className="text-[10px] md:text-[11px] font-extrabold tracking-[2px] md:tracking-[2.4px] uppercase text-[#B9C4E8] block mt-1">
              MATEMÁTICAS APLICADAS · 8 MÓDULOS · 1º A 5º
            </span>
          </div>

          {/* Marcadores y Botones de Acción */}
          <div className="flex items-center gap-2 md:gap-2.5 flex-wrap pt-1">
            {/* Pastilla de Saldo */}
            <span className="bg-[#0A1028] border-[2.5px] border-[#070C1F] text-[#4FD8CB] rounded-full px-3.5 py-1.5 font-black text-sm whitespace-nowrap shadow-[inset_0_0_0_1.5px_rgba(79,216,203,0.35)] flex items-center gap-1.5">
              <span>💎</span>
              <b className="font-mono text-base">{pesos(estado.saldo)}</b>
            </span>

            {/* Pastilla de Estrellas */}
            <span className="bg-[#0A1028] border-[2.5px] border-[#070C1F] text-[#FFC94D] rounded-full px-3.5 py-1.5 font-black text-sm whitespace-nowrap shadow-[inset_0_0_0_1.5px_rgba(255,201,77,0.3)] flex items-center gap-1.5">
              <span>★</span>
              <b className="font-mono text-base">{totalEstrellas}/120</b>
            </span>

            {/* Botón Sonido */}
            <button
              type="button"
              onClick={() => {
                const act = estacionAudio.toggleAudio();
                setSonidoOn(act);
              }}
              className={`w-10 h-10 rounded-full bg-[#0A1028] border-[2.5px] border-[#070C1F] flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-all shadow ${
                sonidoOn ? 'text-[#FFC94D]' : 'text-gray-500 opacity-60'
              }`}
              title="Activar / Desactivar Sonido"
              aria-label="Sonido"
            >
              🔊
            </button>

            {/* Botón Voz */}
            <button
              type="button"
              onClick={() => {
                const act = estacionAudio.toggleVoz();
                setVozOn(act);
              }}
              className={`w-10 h-10 rounded-full bg-[#0A1028] border-[2.5px] border-[#070C1F] flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-all shadow ${
                vozOn ? 'text-[#9B7BFF]' : 'text-gray-500 opacity-60'
              }`}
              title="Activar / Desactivar Voz de Fedor"
              aria-label="Voz de Fedor"
            >
              🗣️
            </button>

            {/* Botón Guardar */}
            <button
              type="button"
              onClick={handleGuardarManual}
              className="w-10 h-10 rounded-full bg-[#0A1028] border-[2.5px] border-[#070C1F] text-[#9CCBFF] flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-all shadow"
              title="Guardar progreso"
              aria-label="Guardar"
            >
              💾
            </button>

            {/* Botón Salir / Puerta */}
            <button
              type="button"
              onClick={() => irA('mapa')}
              className="w-10 h-10 rounded-full bg-[#0A1028] border-[2.5px] border-[#070C1F] text-[#FF8A5C] flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-all shadow"
              title="Volver a la Estación Central"
              aria-label="Salir"
            >
              🚪
            </button>

            {/* Botón Llave Docente */}
            <button
              type="button"
              onClick={() => irA('docente')}
              className={`w-10 h-10 rounded-full bg-[#0A1028] border-[2.5px] border-[#070C1F] flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-all shadow ${
                secActiva === 'docente' ? 'text-[#FFC94D]' : 'text-[#FFC94D]/80'
              }`}
              title="Panel Docente"
              aria-label="Panel Docente"
            >
              🔑
            </button>
          </div>

          {/* Toast de Guardado */}
          {toastGuardado && (
            <div className="absolute -bottom-8 right-6 bg-[#173B2C] border-2 border-[#5BD672] text-[#5BD672] text-xs font-black px-3 py-1 rounded-full shadow-lg animate-bounce">
              ✓ Progreso guardado
            </div>
          )}
        </header>

        {/* ============================================================
            BARRA DE NAVEGACIÓN (PUERTAS DE LA ESTACIÓN)
            ============================================================ */}
        <nav className="flex items-center gap-2.5 overflow-x-auto pb-1 mt-1 flex-wrap" aria-label="Zonas de la estación">
          {[
            { id: 'mapa', icon: '🗺️', label: 'Mapa' },
            { id: 'tienda', icon: '🛒', label: 'Tienda' },
            { id: 'bitacora', icon: '📒', label: 'Bitácora', count: estado.bitacora.length },
            { id: 'monitor', icon: '📊', label: 'Monitor' },
            { id: 'juegos', icon: '🕹️', label: 'Juegos' },
          ].map((door) => {
            const isActiva = secActiva === door.id;
            return (
              <button
                key={door.id}
                type="button"
                onClick={() => irA(door.id as VistaSec)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] font-black text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActiva
                    ? 'bg-[#4FD8CB] text-[#070C1F] border-[3.5px] border-[#070C1F] shadow-[4px_4px_0_rgba(0,0,0,0.4),0_0_14px_rgba(79,216,203,0.45)] scale-[1.02]'
                    : 'bg-[#1A2650] hover:bg-[#243468] text-[#B9C4E8] hover:text-white border-[3.5px] border-[#070C1F] shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
                }`}
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span className="text-base">{door.icon}</span>
                <span>{door.label}</span>
                {door.count !== undefined && (
                  <span
                    className={`min-w-[22px] h-[22px] rounded-full text-xs font-bold flex items-center justify-center px-1.5 ${
                      isActiva ? 'bg-[#070C1F]/80 text-[#FFC94D]' : 'bg-[#0A1028] text-[#FFC94D]'
                    }`}
                  >
                    {door.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ============================================================
            VISTAS PRINCIPALES
            ============================================================ */}
        <main className="w-full mt-2">
        {secActiva === 'mapa' && (
          <EstacionMapScreen
            estado={estado}
            onSelectModulo={(m) => {
              setModuloActivo(m);
              setSecActiva('modulo');
            }}
          />
        )}

        {secActiva === 'modulo' && moduloActivo && (
          <EstacionModuleScreen
            modulo={moduloActivo}
            estado={estado}
            onSelectNivel={(n, ni) => {
              setNivelActivo({ n, ni });
              setSecActiva('nivel');
            }}
            onVolverMapa={() => setSecActiva('mapa')}
          />
        )}

        {secActiva === 'nivel' && moduloActivo && nivelActivo && (
          <EstacionLevelScreen
            modulo={moduloActivo}
            nivel={nivelActivo.n}
            nivelIndex={nivelActivo.ni}
            estado={estado}
            onCompletarNivel={handleCompletarNivel}
            onVolverModulo={() => setSecActiva('modulo')}
          />
        )}

        {secActiva === 'tienda' && (
          <EstacionTiendaScreen
            estado={estado}
            onActualizarSaldo={(s) => actualizarEstado({ ...estado, saldo: s })}
            onRegistrarCompra={(item) =>
              actualizarEstado({ ...estado, bitacora: [item, ...estado.bitacora] })
            }
            onSetMeta={(meta) => actualizarEstado({ ...estado, meta })}
            onIrMonitor={() => setSecActiva('monitor')}
          />
        )}

        {secActiva === 'bitacora' && <EstacionBitacoraScreen estado={estado} />}

        {secActiva === 'monitor' && <EstacionMonitorScreen estado={estado} />}

        {secActiva === 'docente' && <EstacionDocenteScreen estado={estado} />}

        {secActiva === 'juegos' && (
          <EstacionJuegosScreen
            onGanarGemas={(gemas) => {
              const nuevoSaldo = estado.saldo + gemas;
              actualizarEstado({ ...estado, saldo: nuevoSaldo });
            }}
          />
        )}
      </main>
      </div>

      {/* ============================================================
          MODAL DE VICTORIA / FIN DE MISIÓN
          ============================================================ */}
      {modalVictoria.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0E1638] rounded-3xl border-4 border-[#1A2650] p-6 text-center flex flex-col items-center gap-4 shadow-2xl">
            {/* Fedor Cara */}
            <div className="w-20 h-20">
              <svg viewBox="0 0 130 150" width="80" height="92" aria-hidden="true">
                <use href={modalVictoria.sinCorazones ? '#fx-triste' : '#fx-wow'} />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              {modalVictoria.sinCorazones
                ? '¡Casi lo logras!'
                : modalVictoria.estrellas === 3
                ? '¡Misión Perfecta!'
                : '¡Misión Cumplida!'}
            </h3>

            {/* Estrellas Obtenidas */}
            <div className="flex text-3xl">
              {[1, 2, 3].map((star) => (
                <span
                  key={star}
                  className={
                    !modalVictoria.sinCorazones && star <= modalVictoria.estrellas
                      ? 'text-[#FFC94D] animate-bounce'
                      : 'text-gray-600'
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* Recompensa */}
            {modalVictoria.pago > 0 && (
              <div className="px-5 py-2 bg-[#173B2C] border-2 border-[#5BD672] text-[#5BD672] font-black rounded-2xl text-base">
                💎 Ganaste +{pesos(modalVictoria.pago)}
              </div>
            )}

            <p className="text-xs md:text-sm text-[#8FA3D9] max-w-xs">
              {modalVictoria.sinCorazones
                ? 'Se acabaron las vidas, pero no te preocupes: puedes reintentarlo de inmediato.'
                : modalVictoria.estrellas === 3
                ? '¡Sin errores! Sigue adelante con las siguientes estaciones orbitales.'
                : '¡Muy bien hecho! Puedes repetir la misión para ganar las 3 estrellas.'}
            </p>

            <button
              type="button"
              onClick={() => {
                estacionAudio.click();
                setModalVictoria({ ...modalVictoria, visible: false });
                setSecActiva('modulo');
              }}
              className="w-full py-3.5 bg-[#4FD8CB] hover:bg-[#38C0B2] text-[#070C1F] font-black rounded-2xl text-base shadow-xl transition-transform active:scale-95 cursor-pointer mt-2"
            >
              Continuar al Módulo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
