'use client';

import React, { useState } from 'react';
import { useBook1 } from '../context/Book1Context';
import { fedorTTS } from '@/services/tts.service';
import TopFeaturesSection1ro from '../shared/TopFeaturesSection1ro';

interface DefCardData {
  id: string;
  icon: string;
  term: string;
  def: string;
  ana: string;
  ej: string;
}

interface DefModule {
  id: string;
  label: string;
  icon: string;
  color: string;
  cards: DefCardData[];
}

const DEFINICIONES_MODULES: DefModule[] = [
  {
    id: 'conteo',
    label: 'Conteo',
    icon: '🔢',
    color: '#1A6CB4',
    cards: [
      {
        id: 'contar',
        icon: '🔢',
        term: 'Contar',
        def: 'Contar es decir los números en orden mientras señalamos las cosas una por una. Cada cosa recibe un número. El último número dice cuántas hay.',
        ana: 'Como cuando cuentas tus juguetes tocándolos: uno, dos, tres…',
        ej: 'Si tienes 5 fichas y las tocas una por una, cuentas 1, 2, 3, 4, 5. Hay 5 fichas.',
      },
      {
        id: 'cantidad',
        icon: '🔢',
        term: 'Cantidad',
        def: 'La cantidad es cuántas cosas hay. Se dice con un número. Nos dice si hay pocas o muchas.',
        ana: 'Como cuando dices que tienes 3 globos: 3 es la cantidad.',
        ej: 'Si en la mesa hay 6 manzanas, la cantidad es 6.',
      },
      {
        id: 'uno-mas',
        icon: '🔢',
        term: 'Uno más',
        def: 'Uno más quiere decir que agregas una cosa más al grupo. La cantidad crece en uno. Es el número que viene justo después.',
        ana: 'Como cuando llega un amigo más a tu fiesta.',
        ej: 'Si tienes 4 estrellas y agregas 1, ahora tienes 5.',
      },
      {
        id: 'uno-menos',
        icon: '🔢',
        term: 'Uno menos',
        def: 'Uno menos quiere decir que quitas una cosa del grupo. La cantidad se hace más pequeña en uno. Es el número que viene justo antes.',
        ana: 'Como cuando alguien se lleva un globo de tu montón.',
        ej: 'Si tienes 7 fichas y quitas 1, ahora tienes 6.',
      },
    ],
  },
  {
    id: 'adicion',
    label: 'Adición',
    icon: '➕',
    color: '#7B2FBE',
    cards: [
      {
        id: 'sumar',
        icon: '➕',
        term: 'Sumar',
        def: 'Sumar es juntar dos grupos y contar cuántas cosas hay entre todas. Cuando sumas, la cantidad se hace más grande.',
        ana: 'Como juntar dos cajas de fichas en una sola caja grande.',
        ej: 'Si tienes 3 estrellas y te dan 2 más, en total tienes 5 estrellas.',
      },
      {
        id: 'mas',
        icon: '➕',
        term: 'Más',
        def: 'Más es la palabra que usamos cuando agregamos cosas. Cuando decimos más, sabemos que hay que sumar. La cantidad crece.',
        ana: 'Como cuando pides un dulce más, y ahora tienes uno adicional.',
        ej: '2 más 3 es igual a 5.',
      },
      {
        id: 'total',
        icon: '➕',
        term: 'Total',
        def: 'El total es la cantidad final después de sumar. Es cuando todo se junta y se cuenta. Nos dice cuántas cosas hay en total.',
        ana: 'Como cuando cuentas todas las fichas de dos cajas juntas.',
        ej: 'Si sumas 4 globos y 2 globos, el total es 6 globos.',
      },
    ],
  },
  {
    id: 'sustraccion',
    label: 'Sustracción',
    icon: '➖',
    color: '#C94B22',
    cards: [
      {
        id: 'restar',
        icon: '➖',
        term: 'Restar',
        def: 'Restar es quitar cosas de un grupo. Cuando restas, la cantidad se hace más pequeña. Nos dice cuántas quedan.',
        ana: 'Como cuando te comes algunos dulces de tu bolsa.',
        ej: 'Si tienes 8 fichas y quitas 3, quedan 5 fichas.',
      },
      {
        id: 'menos',
        icon: '➖',
        term: 'Menos',
        def: 'Menos es la palabra que usamos cuando quitamos cosas. Cuando decimos menos, sabemos que hay que restar. La cantidad se hace más chica.',
        ana: 'Como cuando pierdes un globo y ya no lo tienes.',
        ej: '7 menos 2 es igual a 5.',
      },
      {
        id: 'diferencia',
        icon: '➖',
        term: 'Diferencia',
        def: 'La diferencia es cuántas cosas quedan después de restar. Nos dice cuánto quitamos o cuántas sobran. Siempre es un número más chico.',
        ana: 'Como cuando quitas fichas de una caja y cuentas las que quedan.',
        ej: 'La diferencia entre 9 y 4 es 5.',
      },
    ],
  },
  {
    id: 'numeros',
    label: 'Números',
    icon: '🔢',
    color: '#0E6BA8',
    cards: [
      {
        id: 'numero',
        icon: '🔢',
        term: 'Número',
        def: 'Un número es un símbolo que nos dice cuántas cosas hay. Los usamos para contar y para ordenar. Cada número tiene un nombre.',
        ana: 'Como los números que ves en el reloj o en tu edad.',
        ej: '5 es un número. Nos dice que hay cinco cosas.',
      },
      {
        id: 'antes',
        icon: '🔢',
        term: 'Antes',
        def: 'Antes es el número que viene justo primero. Es uno menos que el número que ves. Se dice cuando queremos saber qué número vino atrás.',
        ana: 'Como el niño que estaba en la fila antes que tú.',
        ej: 'El número antes de 8 es 7.',
      },
      {
        id: 'despues',
        icon: '🔢',
        term: 'Después',
        def: 'Después es el número que viene justo enseguida. Es uno más que el número que ves. Se dice cuando queremos saber qué número sigue.',
        ana: 'Como el niño que está en la fila detrás de ti.',
        ej: 'El número después de 8 es 9.',
      },
    ],
  },
  {
    id: 'valor_posicional',
    label: 'Valor Posicional',
    icon: '💯',
    color: '#16876A',
    cards: [
      {
        id: 'unidad',
        icon: '💯',
        term: 'Unidad',
        def: 'La unidad es una sola cosa contada por sí misma. Cada objeto vale uno. Las unidades son las cosas sueltas del grupo.',
        ana: 'Como una sola manzana que agarras con la mano.',
        ej: 'Si tienes 6 fichas sueltas, cada ficha es una unidad. Son 6 unidades.',
      },
      {
        id: 'decena',
        icon: '💯',
        term: 'Decena',
        def: 'Una decena es un grupo de 10 cosas juntas. Cuando juntas 10 fichas sueltas, tienes una decena. Las decenas nos ayudan a contar más rápido.',
        ana: 'Como una bolsa con 10 caramelos adentro.',
        ej: '10 fichas sueltas forman 1 decena.',
      },
    ],
  },
  {
    id: 'decenas',
    label: 'Decenas',
    icon: '🔟',
    color: '#0F6E56',
    cards: [
      {
        id: 'contar-decenas',
        icon: '🔟',
        term: 'Contar decenas',
        def: 'Contar decenas es contar de diez en diez. Cada decena vale 10 unidades. Es una manera rápida de contar grupos grandes.',
        ana: 'Como contar bolsas de 10 caramelos: una bolsa, dos bolsas…',
        ej: '2 decenas son 20. 1 decena y 5 unidades son 15.',
      },
      {
        id: 'formar-decena',
        icon: '🔟',
        term: 'Formar una decena',
        def: 'Formar una decena es juntar 10 cosas sueltas en un solo grupo. Se hace cuando tenemos 10 fichas y las guardamos juntas. Después ya es una decena.',
        ana: 'Como cuando guardas 10 fichas dentro de una bolsa.',
        ej: '10 estrellas sueltas se pueden juntar y formar 1 decena.',
      },
    ],
  },
  {
    id: 'comparacion',
    label: 'Comparación',
    icon: '⚖️',
    color: '#BA7517',
    cards: [
      {
        id: 'mayor',
        icon: '⚖️',
        term: 'Mayor',
        def: 'Mayor quiere decir que un número tiene más cantidad que otro. El número mayor viene después. Tiene más cosas contadas.',
        ana: 'Como cuando comparas dos cajas y una tiene más fichas.',
        ej: 'Entre 5 y 8, el número mayor es 8.',
      },
      {
        id: 'menor',
        icon: '⚖️',
        term: 'Menor',
        def: 'Menor quiere decir que un número tiene menos cantidad que otro. El número menor viene antes. Tiene menos cosas contadas.',
        ana: 'Como cuando comparas dos cajas y una tiene menos fichas.',
        ej: 'Entre 5 y 8, el número menor es 5.',
      },
      {
        id: 'igual',
        icon: '⚖️',
        term: 'Igual',
        def: 'Igual quiere decir que dos grupos tienen la misma cantidad. Los dos tienen el mismo número. No sobra ni falta ninguna cosa.',
        ana: 'Como cuando tú y tu amigo tienen la misma cantidad de fichas.',
        ej: '4 fichas y 4 fichas son cantidades iguales.',
      },
    ],
  },
  {
    id: 'figuras',
    label: 'Figuras Geométricas',
    icon: '📐',
    color: '#7B2FBE',
    cards: [
      {
        id: 'circulo',
        icon: '📐',
        term: 'Círculo',
        def: 'Un círculo es una figura redonda sin puntas. Es una línea cerrada que gira. No tiene lados rectos.',
        ana: 'Como una pelota vista desde arriba o un plato.',
        ej: 'El sol dibujado, la luna llena y una moneda son círculos.',
      },
      {
        id: 'cuadrado',
        icon: '📐',
        term: 'Cuadrado',
        def: 'Un cuadrado es una figura con 4 lados iguales. Todos sus lados son del mismo tamaño. Tiene 4 puntas o esquinas.',
        ana: 'Como una ficha de dominó cuadrada o una galleta cuadrada.',
        ej: 'Si dibujas 4 líneas iguales que se cierran, tienes un cuadrado.',
      },
      {
        id: 'triangulo',
        icon: '📐',
        term: 'Triángulo',
        def: 'Un triángulo es una figura con 3 lados. Tiene 3 puntas o esquinas. Sus lados pueden ser iguales o distintos.',
        ana: 'Como un cono de pizza visto de lado.',
        ej: 'Un triángulo con 3 lados iguales de 4 es un triángulo equilátero.',
      },
      {
        id: 'rectangulo',
        icon: '📐',
        term: 'Rectángulo',
        def: 'Un rectángulo es una figura con 4 lados. Dos lados son más largos y dos son más cortos. Tiene 4 esquinas.',
        ana: 'Como una puerta o una hoja de cuaderno.',
        ej: 'Si dibujas un cuadrado y lo estiras, tienes un rectángulo.',
      },
    ],
  },
  {
    id: 'medidas',
    label: 'Medidas Básicas',
    icon: '📏',
    color: '#C25400',
    cards: [
      {
        id: 'largo',
        icon: '📏',
        term: 'Largo',
        def: 'Largo quiere decir cuánto se extiende una cosa de un lado a otro. Un objeto largo es más grande al medirlo. Se mide con reglas o pasos.',
        ana: 'Como cuando una cinta larga se estira mucho.',
        ej: 'Un lápiz nuevo mide unos 20 centímetros de largo.',
      },
      {
        id: 'corto',
        icon: '📏',
        term: 'Corto',
        def: 'Corto quiere decir que una cosa mide poco de un lado a otro. Un objeto corto es más chico al medirlo. Es lo contrario de largo.',
        ana: 'Como cuando una cinta está apenas estirada.',
        ej: 'Un pedacito de cinta de 3 centímetros es corto.',
      },
      {
        id: 'metro',
        icon: '📏',
        term: 'Metro',
        def: 'El metro es una medida para saber qué tan largo es algo. Se usa para medir cosas grandes como una mesa o una puerta. Se escribe con la letra m.',
        ana: 'Como cuando el papá dice que la mesa mide 1 metro de largo.',
        ej: 'Una puerta mide más o menos 2 metros de alto.',
      },
    ],
  },
];

/** Botón circular cyan de audio con sintetizador TTS */
function CyanAudioBtn({
  text,
  size = 32,
  fontSize = 15,
  title = 'Escuchar definición',
}: {
  text: string;
  size?: number;
  fontSize?: number;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        fedorTTS.speak(text);
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.45)',
        flexShrink: 0,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.12)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.45)';
      }}
      title={title}
      aria-label={title}
    >
      🔊
    </button>
  );
}

export default function DefinicionesScreen1ro() {
  const { goScreen } = useBook1();
  const [activeTab, setActiveTab] = useState('conteo');

  const currentModule =
    DEFINICIONES_MODULES.find((m) => m.id === activeTab) || DEFINICIONES_MODULES[0];

  return (
    <div
      style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem 1rem 3rem',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'left',
      }}
    >
      {/* Secciones superiores: Definiciones FEDOR, Estándares MEN, Problemas Cotidianos */}
      <TopFeaturesSection1ro />

      {/* Botón Volver al inicio */}
      <div
        onClick={() => goScreen('home')}
        style={{
          cursor: 'pointer',
          fontWeight: 900,
          color: '#6C28B4',
          fontSize: '14px',
          marginBottom: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-3px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        ← Volver al inicio
      </div>

      {/* ════ HERO BANNER (Imagen de Definiciones) ════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7B2FBE, #A864E8, #F5A623)',
          borderRadius: '22px',
          padding: '1.75rem 1.5rem',
          color: '#ffffff',
          marginBottom: '1.25rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(123, 47, 190, 0.28)',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '38px', marginBottom: '6px', lineHeight: 1 }}>📚</div>
        <h1
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: '30px',
            fontWeight: 900,
            margin: '0 0 6px',
            color: '#ffffff',
            letterSpacing: '0.01em',
          }}
        >
          Definiciones FEDOR
        </h1>
        <div
          style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Conceptos matemáticos claros y con ejemplos para 1° de Primaria
        </div>
      </div>

      {/* ════ BARRA DE PESTAÑAS (TABS) ════ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '1.5rem',
          justifyContent: 'flex-start',
        }}
      >
        {DEFINICIONES_MODULES.map((mod) => {
          const isActive = mod.id === activeTab;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveTab(mod.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #7B2FBE, #9333EA)'
                  : 'rgba(123, 47, 190, 0.1)',
                border: isActive
                  ? '2px solid #581C87'
                  : '1.5px solid rgba(123, 47, 190, 0.28)',
                color: isActive ? '#ffffff' : '#3D1468',
                fontWeight: 900,
                fontSize: '13px',
                padding: '9px 16px',
                borderRadius: '14px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 4px 14px rgba(123, 47, 190, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(123, 47, 190, 0.18)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(123, 47, 190, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{mod.icon}</span>
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* ════ LISTA DE TARJETAS DEL MÓDULO ACTIVO ════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentModule.cards.map((card) => {
          const fullAudioText = `${card.term}. Definición: ${card.def} Analogía: ${card.ana} Ejemplo: ${card.ej}`;

          return (
            <div
              key={card.id}
              style={{
                background: '#ffffff',
                border: '1.5px solid #E5E7EB',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* Encabezado del Concepto */}
              <div
                style={{
                  background: '#F8F5FF',
                  padding: '12px 18px',
                  borderLeft: `6px solid ${currentModule.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '18px',
                    fontWeight: 900,
                    color: currentModule.color,
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{card.icon}</span>
                  <span>{card.term}</span>
                </div>

                {/* Botón de Audio para narrar toda la tarjeta */}
                <CyanAudioBtn
                  text={fullAudioText}
                  size={36}
                  fontSize={16}
                  title={`Escuchar todo sobre ${card.term}`}
                />
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. DEFINICIÓN FEDOR */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#7A7299',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: '6px',
                    }}
                  >
                    <span>📖 DEFINICIÓN FEDOR</span>
                    <CyanAudioBtn
                      text={`Definición FEDOR de ${card.term}: ${card.def}`}
                      size={26}
                      fontSize={12}
                      title="Escuchar definición"
                    />
                  </div>

                  <div
                    style={{
                      background: '#F0FFF4',
                      borderLeft: '5px solid #16876A',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '14.5px',
                      lineHeight: 1.5,
                      color: '#1a1a1a',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <span style={{ flex: 1 }}>{card.def}</span>
                    <CyanAudioBtn
                      text={card.def}
                      size={28}
                      fontSize={13}
                      title="Escuchar texto de la definición"
                    />
                  </div>
                </div>

                {/* 2. ANALOGÍA CONCRETA */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#B45309',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: '6px',
                    }}
                  >
                    <span>💡 ANALOGÍA CONCRETA</span>
                    <CyanAudioBtn
                      text={`Analogía concreta: ${card.ana}`}
                      size={26}
                      fontSize={12}
                      title="Escuchar analogía"
                    />
                  </div>

                  <div
                    style={{
                      background: '#FFF8DC',
                      borderLeft: '5px solid #F5C518',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '14.5px',
                      lineHeight: 1.5,
                      color: '#7A3200',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <span style={{ flex: 1 }}>{card.ana}</span>
                    <CyanAudioBtn
                      text={card.ana}
                      size={28}
                      fontSize={13}
                      title="Escuchar analogía concreta"
                    />
                  </div>
                </div>

                {/* 3. EJEMPLO SIMPLE */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#DC2626',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: '6px',
                    }}
                  >
                    <span>🎯 EJEMPLO SIMPLE</span>
                    <CyanAudioBtn
                      text={`Ejemplo simple: ${card.ej}`}
                      size={26}
                      fontSize={12}
                      title="Escuchar ejemplo"
                    />
                  </div>

                  <div
                    style={{
                      background: '#FEE8E8',
                      borderLeft: '5px solid #E24B4A',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '14.5px',
                      lineHeight: 1.5,
                      color: '#7A1B00',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <span style={{ flex: 1 }}>{card.ej}</span>
                    <CyanAudioBtn
                      text={card.ej}
                      size={28}
                      fontSize={13}
                      title="Escuchar ejemplo simple"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
