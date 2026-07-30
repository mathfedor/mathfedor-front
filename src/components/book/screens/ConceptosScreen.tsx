'use client';

import { useState } from 'react';
import { useBook } from '../context/BookContext';
import { fedorTTS } from '@/services/tts.service';

interface ConceptCard {
  icon: string;
  term: string;
  def: string;
}

interface ConceptSection {
  id: string;
  title: string;
  icon: string;
  cards: ConceptCard[];
}

const CONCEPTOS_SECTIONS: ConceptSection[] = [
  {
    id: 'conteo',
    title: 'Conteo',
    icon: '🔢',
    cards: [
      { icon: '🔢', term: 'Números Cardinales', def: 'Números que indican cantidad: 1, 2, 3, 4, 5…' },
      { icon: '🔢', term: 'Elemento', def: 'Cada objeto individual de un conjunto.' },
      { icon: '🔢', term: 'Conjunto', def: 'Agrupación de elementos con una característica en común.' },
      { icon: '🔢', term: 'Unidad', def: 'Representa una sola cosa o cantidad. Es el primer número natural.' },
      { icon: '🔢', term: 'Correspondencia Biunívoca', def: 'Cada elemento de un conjunto se empareja con un único número.' },
    ],
  },
  {
    id: 'adicion',
    title: 'Adición (Suma)',
    icon: '➕',
    cards: [
      { icon: '➕', term: 'Números Naturales', def: 'Números que usamos para contar: 0, 1, 2, 3, 4, 5…' },
      { icon: '➕', term: 'Operación Básica', def: 'Acción matemática que combina números para obtener un resultado.' },
      { icon: '➕', term: 'Sumandos', def: 'Los números que se agregan o se juntan en la adición.' },
      { icon: '➕', term: 'Suma o Total', def: 'El resultado final de combinar los sumandos.' },
      { icon: '➕', term: 'Signo Más (+)', def: 'Símbolo matemático que indica adición.' },
      { icon: '➕', term: 'Propiedad Conmutativa', def: 'El orden de los sumandos no altera el resultado final (a + b = b + a).' },
      { icon: '➕', term: 'Elemento Neutro (0)', def: 'Sumar cero a cualquier número no cambia su valor (a + 0 = a).' },
    ],
  },
  {
    id: 'sustraccion',
    title: 'Sustracción (Resta)',
    icon: '➖',
    cards: [
      { icon: '➖', term: 'Minuendo', def: 'La cantidad original de la cual se resta o quita otra.' },
      { icon: '➖', term: 'Sustraendo', def: 'La cantidad que se resta o quita del minuendo.' },
      { icon: '➖', term: 'Diferencia o Resto', def: 'El resultado de la sustracción.' },
      { icon: '➖', term: 'Signo Menos (-)', def: 'Símbolo matemático que indica sustracción.' },
      { icon: '➖', term: 'Desagrupar (Prestar)', def: 'Convertir 1 decena en 10 unidades cuando las unidades no alcanzan.' },
    ],
  },
  {
    id: 'multiplicacion',
    title: 'Multiplicación',
    icon: '✖️',
    cards: [
      { icon: '✖️', term: 'Factores', def: 'Los números que se multiplican entre sí.' },
      { icon: '✖️', term: 'Producto', def: 'El resultado final de la multiplicación.' },
      { icon: '✖️', term: 'Suma Iterada', def: 'Sumar el mismo número varias veces (3 × 4 = 4 + 4 + 4).' },
      { icon: '✖️', term: 'Signo por (× o ·)', def: 'Símbolo matemático que indica multiplicación.' },
      { icon: '✖️', term: 'Propiedad Conmutativa', def: 'El orden de los factores no altera el producto (a × b = b × a).' },
      { icon: '✖️', term: 'Elemento Neutro (1)', def: 'Multiplicar cualquier número por 1 da el mismo número.' },
      { icon: '✖️', term: 'Elemento Absorbente (0)', def: 'Multiplicar cualquier número por 0 da siempre 0.' },
    ],
  },
  {
    id: 'division',
    title: 'División',
    icon: '➗',
    cards: [
      { icon: '➗', term: 'Dividendo', def: 'La cantidad total que se va a repartir o dividir.' },
      { icon: '➗', term: 'Divisor', def: 'El número de partes iguales en que se divide el dividendo.' },
      { icon: '➗', term: 'Cociente', def: 'El resultado de la división (cuánto toca a cada uno).' },
      { icon: '➗', term: 'Residuo o Resto', def: 'Lo que sobra cuando la división no es exacta.' },
      { icon: '➗', term: 'División Exacta', def: 'Cuando el residuo es cero (0).' },
    ],
  },
  {
    id: 'problemas',
    title: 'Problemas',
    icon: '📝',
    cards: [
      { icon: '📝', term: 'Enunciado', def: 'La historia o contexto que plantea una situación matemática.' },
      { icon: '📝', term: 'Datos', def: 'Los números e información clave que nos da el problema.' },
      { icon: '📝', term: 'Pregunta', def: 'Lo que se nos pide averiguar o calcular.' },
      { icon: '📝', term: 'Estrategia', def: 'El plan u operación que elegimos para resolver el problema.' },
    ],
  },
  {
    id: 'magnitudes_directas',
    title: 'Magnitudes Directas',
    icon: '📏',
    cards: [
      { icon: '📏', term: 'Magnitud', def: 'Todo lo que se puede medir o contar (longitud, peso, tiempo, dinero).' },
      { icon: '📏', term: 'Proporcionalidad Directa', def: 'Si una cantidad aumenta, la otra aumenta en la misma proporción.' },
      { icon: '📏', term: 'Razón de Cambio', def: 'La relación constante entre dos magnitudes directamente proporcionales.' },
    ],
  },
  {
    id: 'magnitudes_inversas',
    title: 'Magnitudes Inversas',
    icon: '🔄',
    cards: [
      { icon: '🔄', term: 'Relación Inversa', def: 'Si una cantidad aumenta, la otra disminuye en la misma proporción.' },
      { icon: '🔄', term: 'Constante de Proporcionalidad', def: 'El producto fijo entre dos magnitudes inversamente proporcionales.' },
      { icon: '🔄', term: 'Reparto Inverso', def: 'Distribuir una cantidad de forma opuesta al valor de cada parte.' },
    ],
  },
  {
    id: 'geometria',
    title: 'Geometría',
    icon: '📐',
    cards: [
      { icon: '📐', term: 'Punto', def: 'La marca más pequeña en el espacio. No tiene tamaño.' },
      { icon: '📐', term: 'Línea Recta', def: 'Línea continua sin curvas que se extiende en ambas direcciones.' },
      { icon: '📐', term: 'Segmento', def: 'Parte de una línea recta comprendida entre dos puntos.' },
      { icon: '📐', term: 'Línea Curva', def: 'Línea que cambia continuamente de dirección.' },
      { icon: '📐', term: 'Figura Plana', def: 'Figura de dos dimensiones (largo y ancho) sobre una superficie.' },
      { icon: '📐', term: 'Perímetro', def: 'La suma de las longitudes de todos los lados de una figura.' },
      { icon: '📐', term: 'Área', def: 'La medida de la superficie encerrada dentro de una figura plana.' },
      { icon: '📐', term: 'Ángulo', def: 'La abertura entre dos líneas que se unen en un punto llamado vértice.' },
    ],
  },
  {
    id: 'estadistica',
    title: 'Estadística',
    icon: '📊',
    cards: [
      { icon: '📊', term: 'Datos', def: 'Información recolectada mediante observación o conteo.' },
      { icon: '📊', term: 'Tabla de Conteo', def: 'Organización de datos mediante marcas o números.' },
      { icon: '📊', term: 'Frecuencia', def: 'El número de veces que se repite un dato.' },
      { icon: '📊', term: 'Gráfica de Barras', def: 'Representación visual de datos usando barras verticales u horizontales.' },
      { icon: '📊', term: 'Pictograma', def: 'Gráfica que usa símbolos o dibujos para representar cantidades.' },
      { icon: '📊', term: 'Moda', def: 'El dato que más se repite (mayor frecuencia).' },
    ],
  },
];

export default function ConceptosScreen() {
  const { goScreen } = useBook();
  const [activeSecId, setActiveSecId] = useState<string>('conteo');
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  const activeSection =
    CONCEPTOS_SECTIONS.find((s) => s.id === activeSecId) || CONCEPTOS_SECTIONS[0];

  const handleSpeakCard = (card: ConceptCard) => {
    if (speakingTerm === card.term) {
      fedorTTS.stop();
      setSpeakingTerm(null);
      return;
    }

    const textToSpeak = `${card.term}. ${card.def}`;
    setSpeakingTerm(card.term);
    fedorTTS.speak(textToSpeak, () => setSpeakingTerm(null));
  };

  return (
    <div className="min-h-screen py-4 px-3 md:px-6 flex flex-col justify-between select-none">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between py-2.5 px-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-emerald-100">
          <button
            type="button"
            onClick={() => goScreen('home')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-full shadow-md hover:scale-103 active:scale-97 transition-all flex items-center gap-2 cursor-pointer border border-white/30"
          >
            <span>←</span>
            <span>Volver al inicio</span>
          </button>

          <div className="flex items-center gap-2 text-emerald-950 font-black text-base md:text-lg">
            <span>📚</span>
            <span>Conceptos Matemáticos</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#16876A] via-[#24C496] to-[#34D399] p-5 md:p-6 text-white shadow-md relative overflow-hidden flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">📚</span>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                Conceptos Matemáticos
              </h1>
              <p className="text-xs md:text-sm font-medium opacity-90">
                Definiciones técnicas y vocabulario clave de cada área para 1° de Primaria
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navbar */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CONCEPTOS_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSecId(sec.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeSecId === sec.id
                  ? 'bg-emerald-600 text-white shadow-md scale-103'
                  : 'bg-white/80 text-emerald-950 hover:bg-white border border-emerald-100'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Section Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {activeSection.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/95 rounded-2xl p-4 md:p-5 shadow-sm border-l-4 border-l-emerald-500 border-t border-r border-b border-emerald-100/60 flex flex-col gap-2 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-base md:text-lg">
                  <span className="text-xl">{card.icon}</span>
                  <span>{card.term}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeakCard(card)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all cursor-pointer shadow-xs border ${
                    speakingTerm === card.term
                      ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse scale-110'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 hover:scale-105'
                  }`}
                  title="Escuchar en voz alta"
                  aria-label="Escuchar definición"
                >
                  🔊
                </button>
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed pt-1">
                {card.def}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
