'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '@/services/tts.service';

interface DefCard {
  icon: string;
  term: string;
  def: string;
  ana: string;
  ej?: string;
}

interface ModuleData {
  id: string;
  label: string;
  icon: string;
  cards: DefCard[];
}

const DEFINICIONES_MODULES: ModuleData[] = [
  {
    id: 'conteo',
    label: 'Conteo',
    icon: '🔢',
    cards: [
      {
        icon: '🔢',
        term: 'Contar',
        def: 'Contar es decir los números en orden mientras señalamos las cosas una por una. Cada cosa recibe un número. El último número dice cuántas hay.',
        ana: 'Como cuando cuentas tus juguetes tocándolos: uno, dos, tres…',
        ej: 'Si tienes 5 fichas y las tocas una por una, cuentas 1, 2, 3, 4, 5. Hay 5 fichas.',
      },
      {
        icon: '🔢',
        term: 'Cantidad',
        def: 'La cantidad es cuántas cosas hay. Se dice con un número. Nos dice si hay pocas o muchas.',
        ana: 'Como cuando dices que tienes 3 globos: 3 es la cantidad.',
        ej: 'Si en la mesa hay 6 manzanas, la cantidad es 6.',
      },
      {
        icon: '🔢',
        term: 'Uno más',
        def: 'Uno más quiere decir que agregas una cosa más al grupo. La cantidad crece en uno. Es el número que viene justo después.',
        ana: 'Como cuando llega un amigo más a tu fiesta.',
        ej: 'Si tienes 4 caramelos y te dan 1 más, ahora tienes 5.',
      },
      {
        icon: '🔢',
        term: 'Uno menos',
        def: 'Uno menos quiere decir que quitas una cosa del grupo. La cantidad se hace más pequeña en uno. Es el número que viene justo antes.',
        ana: 'Como cuando alguien se lleva un globo de tu montón.',
        ej: 'Si tienes 5 galletas y te comes 1, te quedan 4.',
      },
    ],
  },
  {
    id: 'adicion',
    label: 'Adición',
    icon: '➕',
    cards: [
      {
        icon: '➕',
        term: 'Sumar',
        def: 'Sumar es juntar dos grupos y contar cuántas cosas hay entre todas. Cuando sumas, la cantidad se hace más grande.',
        ana: 'Como juntar dos cajas de fichas en una sola caja grande.',
        ej: '3 canicas en una mano y 2 en la otra son 5 canicas en total.',
      },
      {
        icon: '➕',
        term: 'Más',
        def: 'Más es la palabra que usamos cuando agregamos cosas. Cuando decimos más, sabemos que hay que sumar. La cantidad crece.',
        ana: 'Como cuando pides un dulce más, y ahora tienes uno adicional.',
        ej: '2 lápices más 3 lápices son 5 lápices.',
      },
      {
        icon: '➕',
        term: 'Total',
        def: 'El total es la cantidad final después de sumar. Es cuando todo se junta y se cuenta. Nos dice cuántas cosas hay en total.',
        ana: 'Como cuando cuentas todas las fichas de dos cajas juntas.',
        ej: 'En total hay 8 juguetes reunidos en la mesa.',
      },
    ],
  },
  {
    id: 'sustraccion',
    label: 'Sustracción',
    icon: '➖',
    cards: [
      {
        icon: '➖',
        term: 'Restar',
        def: 'Restar es quitar cosas de un grupo. Cuando restas, la cantidad se hace más pequeña. Nos dice cuántas quedan.',
        ana: 'Como cuando te comes algunos dulces de tu bolsa.',
        ej: 'Tenías 6 manzanas y regalaste 2, te quedan 4.',
      },
      {
        icon: '➖',
        term: 'Menos',
        def: 'Menos es la palabra que usamos cuando quitamos cosas. Cuando decimos menos, sabemos que hay que restar. La cantidad se hace más chica.',
        ana: 'Como cuando pierdes un globo y ya no lo tienes.',
        ej: '8 pajaritos menos 3 que volaron dejan 5.',
      },
      {
        icon: '➖',
        term: 'Diferencia',
        def: 'La diferencia es cuántas cosas quedan después de restar. Nos dice cuánto quitamos o cuántas sobran. Siempre es un número más chico.',
        ana: 'Como cuando quitas fichas de una caja y cuentas las que quedan.',
        ej: 'La diferencia entre 10 y 4 es 6.',
      },
    ],
  },
  {
    id: 'numeros',
    label: 'Números',
    icon: '🔢',
    cards: [
      {
        icon: '🔢',
        term: 'Número',
        def: 'Un número es un símbolo que nos dice cuántas cosas hay. Los usamos para contar y para ordenar. Cada número tiene un nombre.',
        ana: 'Como los números que ves en el reloj o en tu edad.',
        ej: '5 es un número. Nos dice que hay cinco cosas.',
      },
      {
        icon: '🔢',
        term: 'Antes',
        def: 'Antes es el número que viene justo primero. Es uno menos que el número que ves. Se dice cuando queremos saber qué número vino atrás.',
        ana: 'Como el niño que estaba en la fila antes que tú.',
        ej: 'El 8 está antes del 9.',
      },
      {
        icon: '🔢',
        term: 'Después',
        def: 'Después es el número que viene justo enseguida. Es uno más que el número que ves. Se dice cuando queremos saber qué número sigue.',
        ana: 'Como el niño que está en la fila detrás de ti.',
        ej: 'El 10 está después del 9.',
      },
    ],
  },
  {
    id: 'valor_posicional',
    label: 'Valor Posicional',
    icon: '💯',
    cards: [
      {
        icon: '💯',
        term: 'Unidad',
        def: 'La unidad es una sola cosa contada por sí misma. Cada objeto vale uno. Las unidades son las cosas sueltas del grupo.',
        ana: 'Como una sola manzana que agarras con la mano.',
        ej: '5 fichas sueltas son 5 unidades.',
      },
      {
        icon: '💯',
        term: 'Decena',
        def: 'Una decena es un grupo de 10 cosas juntas. Cuando juntas 10 fichas sueltas, tienes una decena. Las decenas nos ayudan a contar más rápido.',
        ana: 'Como una bolsa con 10 caramelos adentro.',
        ej: '10 borradores amarillos forman 1 decena.',
      },
    ],
  },
  {
    id: 'decenas',
    label: 'Decenas',
    icon: '🔟',
    cards: [
      {
        icon: '🔟',
        term: 'Contar decenas',
        def: 'Contar decenas es contar de diez en diez. Cada decena vale 10 unidades. Es una manera rápida de contar grupos grandes.',
        ana: 'Como contar bolsas de 10 caramelos: una bolsa, dos bolsas…',
        ej: '10, 20, 30, 40 es contar de 10 en 10.',
      },
      {
        icon: '🔟',
        term: 'Formar una decena',
        def: 'Formar una decena es juntar 10 cosas sueltas en un solo grupo. Se hace cuando tenemos 10 fichas y las guardamos juntas.',
        ana: 'Como cuando guardas 10 fichas dentro de una bolsa.',
        ej: 'Juntar 10 colores en una cartuchera forma 1 decena.',
      },
    ],
  },
  {
    id: 'comparacion',
    label: 'Comparación',
    icon: '⚖️',
    cards: [
      {
        icon: '⚖️',
        term: 'Mayor',
        def: 'Mayor quiere decir que un número tiene más cantidad que otro. El número mayor viene después. Tiene más cosas contadas.',
        ana: 'Como cuando comparas dos cajas y una tiene más fichas.',
        ej: '8 es mayor que 5.',
      },
      {
        icon: '⚖️',
        term: 'Menor',
        def: 'Menor quiere decir que un número tiene menos cantidad que otro. El número menor viene antes. Tiene menos cosas contadas.',
        ana: 'Como cuando comparas dos cajas y una tiene menos fichas.',
        ej: '3 es menor que 7.',
      },
      {
        icon: '⚖️',
        term: 'Igual',
        def: 'Igual quiere decir que dos grupos tienen la misma cantidad. Los dos tienen el mismo número. No sobra ni falta ninguna cosa.',
        ana: 'Como cuando tú y tu amigo tienen la misma cantidad de fichas.',
        ej: '4 coches y 4 pelotas son cantidades iguales.',
      },
    ],
  },
  {
    id: 'figuras',
    label: 'Figuras Geométricas',
    icon: '📐',
    cards: [
      {
        icon: '📐',
        term: 'Círculo',
        def: 'Un círculo es una figura redonda sin puntas. Es una línea cerrada que gira. No tiene lados rectos.',
        ana: 'Como una pelota vista desde arriba o un plato.',
        ej: 'La rueda de una bicicleta tiene forma de círculo.',
      },
      {
        icon: '📐',
        term: 'Cuadrado',
        def: 'Un cuadrado es una figura con 4 lados iguales. Todos sus lados son del mismo tamaño. Tiene 4 puntas o esquinas.',
        ana: 'Como una ficha de dominó cuadrada o una galleta cuadrada.',
        ej: 'Una ventana con 4 lados iguales.',
      },
      {
        icon: '📐',
        term: 'Triángulo',
        def: 'Un triángulo es una figura con 3 lados. Tiene 3 puntas o esquinas. Sus lados pueden ser iguales o distintos.',
        ana: 'Como un cono de pizza visto de lado.',
        ej: 'La vela de un barco de juguete.',
      },
      {
        icon: '📐',
        term: 'Rectángulo',
        def: 'Un rectángulo es una figura con 4 lados. Dos lados son más largos y dos son más cortos. Tiene 4 esquinas.',
        ana: 'Como una puerta o una hoja de cuaderno.',
        ej: 'La pantalla de una televisión.',
      },
    ],
  },
  {
    id: 'medidas',
    label: 'Medidas Básicas',
    icon: '📏',
    cards: [
      {
        icon: '📏',
        term: 'Largo',
        def: 'Largo quiere decir cuánto se extiende una cosa de un lado a otro. Un objeto largo es más grande al medirlo.',
        ana: 'Como cuando una cinta larga se estira mucho.',
        ej: 'Un lápiz nuevo es más largo que un lápiz usado.',
      },
      {
        icon: '📏',
        term: 'Corto',
        def: 'Corto quiere decir que una cosa mide poco de un lado a otro. Un objeto corto es más chico al medirlo.',
        ana: 'Como cuando una cinta está apenas estirada.',
        ej: 'Un gusanito pequeño es corto.',
      },
      {
        icon: '📏',
        term: 'Metro',
        def: 'El metro es una medida para saber qué tan largo es algo. Se usa para medir cosas grandes como una mesa o una puerta.',
        ana: 'Como cuando el papá dice que la mesa mide 1 metro de largo.',
        ej: 'La pizarra del salón mide 2 metros.',
      },
    ],
  },
];

export default function DefinicionesScreen() {
  const { goScreen } = useBook();
  const [activeModId, setActiveModId] = useState<string>('numeros');
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  const activeModule =
    DEFINICIONES_MODULES.find((m) => m.id === activeModId) || DEFINICIONES_MODULES[0];

  const handleSpeakText = (text: string, termKey: string) => {
    if (speakingTerm === termKey) {
      fedorTTS.stop();
      setSpeakingTerm(null);
      return;
    }

    setSpeakingTerm(termKey);
    fedorTTS.speak(text, () => setSpeakingTerm(null));
  };

  return (
    <div className="min-h-screen py-4 px-2 md:px-6 flex flex-col select-none bg-[#F7F4FD] w-full">
      <div className="w-full flex flex-col gap-4">
        {/* Top Navigation Row */}
        <div className="w-full flex items-center justify-between py-1 px-2">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="text-purple-900 font-bold text-xs md:text-sm hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-sm">←</span>
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Hero Banner (Estilo idéntico al HTML original) */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#7B2FBE] via-[#A864E8] to-[#F5A623] p-6 text-white shadow-lg text-center relative overflow-hidden flex flex-col items-center justify-center gap-1.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner mb-1">
            📚
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight drop-shadow-sm">
            Definiciones FEDOR
          </h1>
          <p className="text-xs md:text-sm font-bold opacity-95 tracking-wide">
            Conceptos matemáticos claros y con ejemplos para 1° de Primaria
          </p>
        </div>

        {/* Módulos Tabs Navbar (100% Ancho Completo con cuadrícula fluida) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 my-2">
          {DEFINICIONES_MODULES.map((mod) => {
            const isActive = activeModId === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModId(mod.id)}
                className={`w-full px-3 py-3.5 rounded-2xl font-black text-xs md:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center leading-tight ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7B2FBE] to-[#A864E8] text-white border-2 border-[#3D1468] shadow-md scale-102 z-10'
                    : 'bg-[#7B2FBE]/12 text-[#3D1468] border-2 border-[#7B2FBE]/30 hover:bg-[#7B2FBE]/20'
                }`}
              >
                <span>{mod.icon}</span>
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        {/* Card Container (Desplegado a 100% del Ancho Completo con CSS idéntico al HTML maestro) */}
        <div className="w-full flex flex-col gap-6 pb-12">
          {activeModule.cards.map((card, idx) => {
            const fullCardText = `${card.term}. Definición FEDOR: ${card.def}. Analogía concreta: ${card.ana}. ${card.ej ? 'Ejemplo simple: ' + card.ej : ''}`;
            const isSpeakingCard = speakingTerm === `card_${card.term}`;

            return (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,.08)',
                  marginBottom: '16px',
                }}
              >
                {/* Header del concepto (.fdef-concepto del HTML maestro) */}
                <div
                  style={{
                    background: '#F8F5FF',
                    padding: '14px 18px',
                    fontSize: '17px',
                    fontWeight: 900,
                    fontFamily: "'Baloo 2', sans-serif",
                    borderLeft: '5px solid #7B2FBE',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A3A6A' }}>
                    <span style={{ fontSize: '24px' }}>{card.icon}</span>
                    <span>{card.term}</span>
                  </div>

                  {/* Botón 🔊 de voz sintetizada circular cian/verde (.fdef-voz del HTML) */}
                  <button
                    type="button"
                    onClick={() => handleSpeakText(fullCardText, `card_${card.term}`)}
                    style={{
                      background: isSpeakingCard
                        ? 'linear-gradient(135deg, #FFB066, #FF7300)'
                        : 'linear-gradient(135deg, #3AA0FF, #06A570)',
                      border: '2px solid #fff',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      fontSize: '18px',
                      cursor: 'pointer',
                      boxShadow: '0 3px 10px rgba(58,160,255,.4)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Escuchar tarjeta completa"
                    aria-label="Escuchar definición"
                  >
                    🔊
                  </button>
                </div>

                {/* Body de la tarjeta (.fdef-body del HTML maestro) */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Bloque 1: DEFINICIÓN FEDOR (.fdef-def) */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: '#7A7299',
                        textTransform: 'uppercase',
                        letterSpacing: '.5px',
                        margin: '8px 0 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>📖 DEFINICIÓN FEDOR</span>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(card.def, `def_${card.term}`)}
                        style={{
                          background: 'linear-gradient(135deg, #3AA0FF, #06A570)',
                          border: '2px solid #fff',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(58,160,255,.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Escuchar definición"
                      >
                        🔊
                      </button>
                    </div>

                    <div
                      style={{
                        background: '#F0FFF4',
                        borderLeft: '5px solid #16876A',
                        borderRadius: '16px',
                        padding: '16px 24px',
                        color: '#1a1a1a',
                        fontSize: '15px',
                        fontWeight: 500,
                        lineHeight: '1.6',
                        textAlign: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ display: 'inline-block' }}>{card.def}</span>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(card.def, `def_box_${card.term}`)}
                        style={{
                          background: 'linear-gradient(135deg, #3AA0FF, #06A570)',
                          border: '2px solid #fff',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 3px 10px rgba(58,160,255,.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: '8px',
                          verticalAlign: 'middle',
                        }}
                        title="Escuchar"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  {/* Bloque 2: ANALOGÍA CONCRETA (.fdef-ana) */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: '#7A7299',
                        textTransform: 'uppercase',
                        letterSpacing: '.5px',
                        margin: '8px 0 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>💡 ANALOGÍA CONCRETA</span>
                    </div>

                    <div
                      style={{
                        background: '#FFF8DC',
                        borderLeft: '5px solid #F5C518',
                        borderRadius: '16px',
                        padding: '16px 24px',
                        color: '#7A3200',
                        fontSize: '15px',
                        fontWeight: 500,
                        lineHeight: '1.6',
                        textAlign: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ display: 'inline-block' }}>{card.ana}</span>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(card.ana, `ana_box_${card.term}`)}
                        style={{
                          background: 'linear-gradient(135deg, #3AA0FF, #06A570)',
                          border: '2px solid #fff',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 3px 10px rgba(58,160,255,.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: '8px',
                          verticalAlign: 'middle',
                        }}
                        title="Escuchar"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  {/* Bloque 3: EJEMPLO SIMPLE (.fdef-ej) */}
                  {card.ej && (
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          color: '#7A7299',
                          textTransform: 'uppercase',
                          letterSpacing: '.5px',
                          margin: '8px 0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>🎯 EJEMPLO SIMPLE</span>
                      </div>

                      <div
                        style={{
                          background: '#FEE8E8',
                          borderLeft: '5px solid #E24B4A',
                          borderRadius: '16px',
                          padding: '16px 24px',
                          color: '#7A1B00',
                          fontSize: '15px',
                          fontWeight: 500,
                          lineHeight: '1.6',
                          textAlign: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span style={{ display: 'inline-block' }}>{card.ej}</span>
                        <button
                          type="button"
                          onClick={() => handleSpeakText(card.ej || '', `ej_box_${card.term}`)}
                          style={{
                            background: 'linear-gradient(135deg, #3AA0FF, #06A570)',
                            border: '2px solid #fff',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(58,160,255,.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '8px',
                            verticalAlign: 'middle',
                          }}
                          title="Escuchar"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
