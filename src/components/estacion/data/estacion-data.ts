import {
  ModuloEstacion,
  ItemCatalogo,
  JuegoZona,
  UbicarData,
  NivelData,
} from '../types/estacion.types';

export const BANDAS = ['5–7 · 1º', '7–9 · 2º·3º', '9–11 · 4º·5º', 'Misión especial'];
export const PAGO_ESTRELLA = 500;
export const PAGO_EXPRES = 300;
export const PAGO_AHORRO = 200;

export const CATALOGO: Record<string, ItemCatalogo> = {
  manzana: { n: 'Manzana espacial', p: 500, tier: 'eco', ic: 'pv-manzana' },
  banano: { n: 'Banano cometa', p: 600, tier: 'eco', ic: 'pv-banano' },
  galleta: { n: 'Galleta meteorito', p: 700, tier: 'eco', ic: 'pv-galleta' },
  jugo: { n: 'Jugo de nebulosa', p: 800, tier: 'eco', ic: 'pv-jugo' },
  pelota: { n: 'Pelota lunar', p: 1000, tier: 'com', ic: 'pv-pelota' },
  dulce: { n: 'Dulce cósmico', p: 1200, tier: 'com', ic: 'pv-dulce' },
  robot: { n: 'Robot de juguete', p: 1200, tier: 'com', ic: 'pv-robot' },
  carrito: { n: 'Carrito estelar', p: 1500, tier: 'com', ic: 'pv-carrito' },
  herramienta: { n: 'Herramienta lunar', p: 2000, tier: 'pre', ic: 'pv-herramienta' },
  casco: { n: 'Casco espacial', p: 2500, tier: 'pre', ic: 'pv-casco' },
  telescopio: { n: 'Telescopio', p: 3000, tier: 'pre', ic: 'pv-telescopio' },
  mochila: { n: 'Mochila propulsora', p: 3500, tier: 'pre', ic: 'pv-mochila' },
};

export const TIER_NOMBRE: Record<string, string> = {
  eco: 'Cristal Económico',
  com: 'Cristal Comercial',
  pre: 'Cristal Premium',
};

export const SVG_VALLA =
  '<svg viewBox="0 0 48 42" width="34" height="30" aria-hidden="true"><g stroke="#070C1F" stroke-width="2.5" stroke-linecap="round"><rect x="5" y="7" width="38" height="10" rx="2.5" fill="#FFFFFF"/><path d="M5 7 h9.5 v10 h-9.5 Z M24 7 h9.5 v10 h-9.5 Z" fill="#E04B38" stroke="none"/><rect x="5" y="7" width="38" height="10" rx="2.5" fill="none"/><line x1="10" y1="17" x2="10" y2="37"/><line x1="38" y1="17" x2="38" y2="37"/><line x1="3" y1="37" x2="17" y2="37"/><line x1="31" y1="37" x2="45" y2="37"/></g></svg>';

export const UBICAR: Record<string, UbicarData> = {
  mercado: {
    t: 'Centro Comercial Galáctico',
    et: 'Ubicar y clasificar',
    o: 'Ubica cada elemento en su espacio; al acertar se activa su precio',
    frase:
      '¡La estantería galáctica está vacía! Ubica cada producto y mira aparecer su precio. Los puntos se gastan en la Tienda.',
    contenedores: [
      { id: 'fru', e: '🍎', n: 'Frutas' },
      { id: 'ver', e: '🥕', n: 'Verduras' },
      { id: 'lac', e: '🥛', n: 'Lácteos' },
      { id: 'car', e: '🍗', n: 'Carnes' },
      { id: 'esc', e: '✏️', n: 'Escolares' },
      { id: 'jug', e: '🧸', n: 'Juguetes' },
    ],
    items: [
      { e: '🍎', t: 'Manzana', c: 'fru', p: 500 },
      { e: '🍌', t: 'Banano', c: 'fru', p: 600 },
      { e: '🥕', t: 'Zanahoria', c: 'ver', p: 400 },
      { e: '🥦', t: 'Brócoli', c: 'ver', p: 700 },
      { e: '🥛', t: 'Leche', c: 'lac', p: 800 },
      { e: '🧀', t: 'Queso', c: 'lac', p: 1200 },
      { e: '🍗', t: 'Pollo', c: 'car', p: 2000 },
      { e: '🥩', t: 'Carne', c: 'car', p: 2500 },
      { e: '✏️', t: 'Lápiz', c: 'esc', p: 300 },
      { e: '📓', t: 'Cuaderno', c: 'esc', p: 900 },
      { e: '🧸', t: 'Peluche', c: 'jug', p: 1000 },
      { e: '🤖', t: 'Robot', c: 'jug', p: 1200 },
    ],
  },
  invernadero: {
    t: 'Cápsulas de Crecimiento Galáctico',
    et: 'Ubicar por etapa',
    o: 'Ubica cada elemento en la cápsula correcta según su etapa',
    frase: 'Cápsulas para sembrar, nutrir y observar. ¡Cada cosa en su etapa!',
    contenedores: [
      { id: 'sem', e: '🌰', n: 'Semillas' },
      { id: 'jov', e: '🌱', n: 'Plantas jóvenes' },
      { id: 'mad', e: '🌻', n: 'Plantas maduras' },
      { id: 'her', e: '🧰', n: 'Herramientas de cultivo' },
      { id: 'nut', e: '💧', n: 'Nutrientes' },
    ],
    items: [
      { e: '🌰', t: 'Semilla de girasol', c: 'sem' },
      { e: '🥜', t: 'Semilla de fríjol', c: 'sem' },
      { e: '🌱', t: 'Brote', c: 'jov' },
      { e: '☘️', t: 'Plántula', c: 'jov' },
      { e: '🌻', t: 'Girasol', c: 'mad' },
      { e: '🌽', t: 'Maíz maduro', c: 'mad' },
      { e: '⛏️', t: 'Pica', c: 'her' },
      { e: '🪣', t: 'Balde', c: 'her' },
      { e: '💧', t: 'Agua', c: 'nut' },
      { e: '🧪', t: 'Abono', c: 'nut' },
    ],
  },
  pista: {
    t: 'Circuito Estelar',
    et: 'Arma la pista',
    o: 'Construye la pista ubicando cada elemento en su espacio',
    frase: 'La ruta está vacía: ubica cada obstáculo y completa el circuito.',
    contenedores: [
      { id: 'obs', e: '🚧', n: 'Obstáculos' },
      { id: 'bar', e: '🧱', n: 'Barreras' },
      { id: 'tun', e: '🕳️', n: 'Túneles' },
      { id: 'sal', e: '🤸', n: 'Saltos' },
      { id: 'sen', e: '🏁', n: 'Señales de ruta' },
    ],
    items: [
      { e: '', svg: SVG_VALLA, t: 'Valla', c: 'obs' },
      { e: '🪨', t: 'Roca', c: 'obs' },
      { e: '🧱', t: 'Muro', c: 'bar' },
      { e: '⛔', t: 'Talanquera', c: 'bar' },
      { e: '🕳️', t: 'Túnel', c: 'tun' },
      { e: '🤸', t: 'Salto acrobático', c: 'sal' },
      { e: '🏁', t: 'Meta', c: 'sen' },
      { e: '➡️', t: 'Flecha de ruta', c: 'sen' },
    ],
  },
  sala: {
    t: 'Panel de Juegos Galácticos',
    et: 'Activa los juegos',
    o: 'Ubica cada juego en su panel correspondiente',
    frase: 'Cada juego tiene su panel. ¡Actívalos todos!',
    contenedores: [
      { id: 'log', e: '🧩', n: 'Juegos de lógica' },
      { id: 'mem', e: '👀', n: 'Juegos de memoria' },
      { id: 'vel', e: '🏎️', n: 'Juegos de velocidad' },
      { id: 'est', e: '♟️', n: 'Juegos de estrategia' },
    ],
    items: [
      { e: '🧩', t: 'Rompecabezas', c: 'log' },
      { e: '🧠', t: 'Acertijo', c: 'log' },
      { e: '👀', t: 'Encuentra la pareja', c: 'mem' },
      { e: '🃏', t: 'Cartas iguales', c: 'mem' },
      { e: '🏎️', t: 'Carrera contra el reloj', c: 'vel' },
      { e: '⏱️', t: 'Reto rápido', c: 'vel' },
      { e: '♟️', t: 'Ajedrez', c: 'est' },
      { e: '🛡️', t: 'Defiende la torre', c: 'est' },
    ],
  },
  taller: {
    t: 'Mesa de Ensamble Estelar',
    et: 'Mesa de ensamble',
    o: 'Ubica cada pieza en su espacio de ensamble',
    frase: 'Sobre la mesa de ensamble cada pieza tiene su lugar.',
    contenedores: [
      { id: 'pie', e: '🟦', n: 'Piezas' },
      { id: 'her2', e: '🔨', n: 'Herramientas' },
      { id: 'mat', e: '🪵', n: 'Materiales' },
      { id: 'mec', e: '⚙️', n: 'Componentes mecánicos' },
      { id: 'ele', e: '🔋', n: 'Componentes electrónicos' },
    ],
    items: [
      { e: '🟦', t: 'Bloque', c: 'pie' },
      { e: '🧩', t: 'Pieza de encaje', c: 'pie' },
      { e: '🔨', t: 'Martillo', c: 'her2' },
      { e: '🪛', t: 'Destornillador', c: 'her2' },
      { e: '🪵', t: 'Madera', c: 'mat' },
      { e: '🧱', t: 'Ladrillo', c: 'mat' },
      { e: '⚙️', t: 'Engranaje', c: 'mec' },
      { e: '🔩', t: 'Tornillo', c: 'mec' },
      { e: '🔋', t: 'Batería', c: 'ele' },
      { e: '💡', t: 'Bombillo', c: 'ele' },
    ],
  },
  cocina: {
    t: 'Estación de Cocina Galáctica',
    et: 'Estación de cocina',
    o: 'Ubica ingredientes y utensilios en la estación correcta',
    frase: '¡A ordenar la cocina para preparar el plato!',
    contenedores: [
      { id: 'ing', e: '🥚', n: 'Ingredientes' },
      { id: 'ute', e: '🥄', n: 'Utensilios' },
      { id: 'rec', e: '📖', n: 'Recetas' },
      { id: 'pla', e: '🍰', n: 'Platos preparados' },
    ],
    items: [
      { e: '🥚', t: 'Huevo', c: 'ing' },
      { e: '🍫', t: 'Chocolate', c: 'ing' },
      { e: '🥄', t: 'Cuchara', c: 'ute' },
      { e: '🍳', t: 'Sartén', c: 'ute' },
      { e: '📖', t: 'Receta de torta', c: 'rec' },
      { e: '📜', t: 'Receta de pan', c: 'rec' },
      { e: '🍰', t: 'Torta lista', c: 'pla' },
      { e: '🥞', t: 'Pancakes listos', c: 'pla' },
    ],
  },
  observatorio: {
    t: 'Panel de Análisis Estelar',
    et: 'Panel de análisis',
    o: 'Ubica cada tipo de dato en su panel correspondiente',
    frase: 'El panel de análisis espera sus datos. ¡Clasifícalos!',
    contenedores: [
      { id: 'gra', e: '📊', n: 'Gráficas' },
      { id: 'tab', e: '📋', n: 'Tablas' },
      { id: 'sen2', e: '📡', n: 'Sensores' },
      { id: 'ind', e: '🧭', n: 'Indicadores' },
      { id: 'reg', e: '📓', n: 'Registros' },
    ],
    items: [
      { e: '📊', t: 'Gráfica de barras', c: 'gra' },
      { e: '📈', t: 'Gráfica de línea', c: 'gra' },
      { e: '📋', t: 'Tabla de datos', c: 'tab' },
      { e: '🗒️', t: 'Tabla de conteo', c: 'tab' },
      { e: '🌡️', t: 'Termómetro', c: 'sen2' },
      { e: '📡', t: 'Antena', c: 'sen2' },
      { e: '🧭', t: 'Brújula', c: 'ind' },
      { e: '📓', t: 'Bitácora', c: 'reg' },
      { e: '🗂️', t: 'Archivo', c: 'reg' },
    ],
  },
  reloj: {
    t: 'Panel Cronométrico Estelar',
    et: 'Panel cronométrico',
    o: 'Ubica cada segmento de tiempo en su espacio',
    frase: 'Construyamos el reloj de la nave, pieza por pieza.',
    contenedores: [
      { id: 'seg', e: '🕐', n: 'Segmentos de tiempo' },
      { id: 'ind2', e: '⏱️', n: 'Indicadores' },
      { id: 'ala', e: '⏰', n: 'Alarmas' },
      { id: 'cic', e: '🌗', n: 'Ciclos' },
    ],
    items: [
      { e: '🕐', t: 'Hora', c: 'seg' },
      { e: '📅', t: 'Día', c: 'seg' },
      { e: '⏱️', t: 'Cronómetro', c: 'ind2' },
      { e: '⌛', t: 'Reloj de arena', c: 'ind2' },
      { e: '⏰', t: 'Despertador', c: 'ala' },
      { e: '🔔', t: 'Campana', c: 'ala' },
      { e: '🌗', t: 'Fases de la luna', c: 'cic' },
      { e: '🔄', t: 'Ciclo del día', c: 'cic' },
    ],
  },
};

export const NIVEL_UBICAR = (id: string): NivelData => {
  const u = UBICAR[id];
  return {
    t: u.t,
    et: '🚚 ' + u.et,
    o: u.o,
    mec: 'ubicar',
    frase: u.frase,
    datos: { ...u, id },
  };
};

export const NIVEL_AHORRO = (): NivelData => ({
  t: 'Ahorro',
  et: '💰 Ahorro',
  o: 'Recibo dinero y pago… ¿cuánto me queda?',
  mec: 'ahorro',
  ahorro: true,
  frase: 'Cada pregunta bien contestada guarda dinero en tu alcancía para la Tienda.',
  datos: {},
});

export const MODULOS: ModuloEstacion[] = [
  {
    id: 'mercado',
    nombre: 'Mercado Estelar',
    mapa: ['Mercado', 'Estelar'],
    icono: 'm-mercado',
    color: '#5BD672',
    desc: 'Dinero y costos: el Laboratorio Financiero de la estación.',
    niveles: [
      {
        t: 'Arma la plata',
        o: 'Componer una cantidad exacta',
        mec: 'armar',
        frase: 'Necesito el valor exacto, ni un peso más.',
        datos: {
          rondas: [
            { meta: 700, piezas: [500, 200, 100, 100] },
            { meta: 1500, piezas: [500, 500, 1000, 200, 100] },
            { meta: 1800, piezas: [1000, 500, 200, 100, 200] },
            { meta: 2700, piezas: [2000, 500, 200, 100, 1000] },
            { meta: 2600, piezas: [2000, 500, 100, 200, 1000] },
            { meta: 3500, piezas: [2000, 1000, 500, 200, 100] },
            { meta: 4300, piezas: [2000, 1000, 1000, 200, 100, 500] },
            { meta: 5200, piezas: [5000, 200, 1000, 100, 500] },
            { meta: 6700, piezas: [5000, 1000, 500, 200, 2000, 100] },
            { meta: 8600, piezas: [5000, 2000, 1000, 500, 100, 200] },
          ],
        },
      },
      {
        t: 'El cambio',
        o: 'Restar con dinero',
        mec: 'entradas',
        frase: 'Un buen tendero devuelve el cambio completo.',
        datos: {
          rondas: [
            {
              consigna: 'La cuenta es $700 y pagan con $1.000',
              ayuda: '¿Cuánto cambio devuelves?',
              escena: { tipo: 'dinero', args: [1000] },
              campos: [{ etq: 'Cambio:', esp: 300 }],
            },
            {
              consigna: 'La cuenta es $2.300 y pagan con $5.000',
              ayuda: 'Resta la cuenta al billete.',
              escena: { tipo: 'dinero', args: [5000] },
              campos: [{ etq: 'Cambio:', esp: 2700 }],
            },
            {
              consigna: 'La cuenta es $1.600 y pagan con $2.000',
              ayuda: '¡Tú puedes!',
              escena: { tipo: 'dinero', args: [2000] },
              campos: [{ etq: 'Cambio:', esp: 400 }],
            },
            {
              consigna: 'La cuenta es $4.200 y pagan con $5.000',
              ayuda: 'Resta con cuidado.',
              escena: { tipo: 'dinero', args: [5000] },
              campos: [{ etq: 'Cambio:', esp: 800 }],
            },
            {
              consigna: 'La cuenta es $3.100 y pagan con $5.000',
              ayuda: 'Sigue así.',
              escena: { tipo: 'dinero', args: [5000] },
              campos: [{ etq: 'Cambio:', esp: 1900 }],
            },
            {
              consigna: 'La cuenta es $4.200 y pagan con $10.000',
              ayuda: 'Ahora con billete grande.',
              escena: { tipo: 'dinero', args: [10000] },
              campos: [{ etq: 'Cambio:', esp: 5800 }],
            },
            {
              consigna: 'La cuenta es $7.600 y pagan con $10.000',
              ayuda: 'Casi lo logras todo.',
              escena: { tipo: 'dinero', args: [10000] },
              campos: [{ etq: 'Cambio:', esp: 2400 }],
            },
            {
              consigna: 'La cuenta es $5.500 y pagan con $10.000',
              ayuda: 'Mitades exactas.',
              escena: { tipo: 'dinero', args: [10000] },
              campos: [{ etq: 'Cambio:', esp: 4500 }],
            },
            {
              consigna: 'La cuenta es $8.900 y pagan con $10.000',
              ayuda: 'Cambio pequeño.',
              escena: { tipo: 'dinero', args: [10000] },
              campos: [{ etq: 'Cambio:', esp: 1100 }],
            },
            {
              consigna: 'La cuenta es $12.400 y pagan con $20.000',
              ayuda: '¡La venta más grande del día!',
              escena: { tipo: 'dinero', args: [20000] },
              campos: [{ etq: 'Cambio:', esp: 7600 }],
            },
          ],
        },
      },
      {
        t: 'Rebajas galácticas',
        o: 'Calcular porcentajes',
        mec: 'entradas',
        frase: '¡Hoy hay descuentos en todo el Mercado!',
        datos: {
          rondas: [
            {
              consigna: '4 × Carrito estelar a $1.500 con 25% de descuento',
              ayuda: 'Primero el precio sin descuento, luego el descuento, luego lo que pagas.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 6000 },
                { etq: 'Descuento (25%):', esp: 1500 },
                { etq: 'Pagas:', esp: 4500 },
              ],
            },
            {
              consigna: '2 × Casco espacial a $2.500 con 20% de descuento',
              ayuda: 'El 20% es dividir entre 5.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 5000 },
                { etq: 'Descuento (20%):', esp: 1000 },
                { etq: 'Pagas:', esp: 4000 },
              ],
            },
            {
              consigna: '6 × Manzana espacial a $500 con 10% de descuento',
              ayuda: 'El 10% es dividir entre 10.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 3000 },
                { etq: 'Descuento (10%):', esp: 300 },
                { etq: 'Pagas:', esp: 2700 },
              ],
            },
            {
              consigna: '5 × Jugo de nebulosa a $800 con 25% de descuento',
              ayuda: 'El 25% es la cuarta parte.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 4000 },
                { etq: 'Descuento (25%):', esp: 1000 },
                { etq: 'Pagas:', esp: 3000 },
              ],
            },
            {
              consigna: '3 × Pelota lunar a $1.000 con 20% de descuento',
              ayuda: 'Ya conoces el método.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 3000 },
                { etq: 'Descuento (20%):', esp: 600 },
                { etq: 'Pagas:', esp: 2400 },
              ],
            },
            {
              consigna: '5 × Robot de juguete a $1.200 con 50% de descuento',
              ayuda: '¡Mitad de precio!',
              campos: [
                { etq: 'Precio sin descuento:', esp: 6000 },
                { etq: 'Descuento (50%):', esp: 3000 },
                { etq: 'Pagas:', esp: 3000 },
              ],
            },
            {
              consigna: '4 × Galleta meteorito a $700 con 25% de descuento',
              ayuda: 'La cuarta parte otra vez.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 2800 },
                { etq: 'Descuento (25%):', esp: 700 },
                { etq: 'Pagas:', esp: 2100 },
              ],
            },
            {
              consigna: '5 × Dulce cósmico a $1.200 con 10% de descuento',
              ayuda: 'Divide entre 10.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 6000 },
                { etq: 'Descuento (10%):', esp: 600 },
                { etq: 'Pagas:', esp: 5400 },
              ],
            },
            {
              consigna: '3 × Herramienta lunar a $2.000 con 15% de descuento',
              ayuda: '15% = 10% + 5%.',
              campos: [
                { etq: 'Precio sin descuento:', esp: 6000 },
                { etq: 'Descuento (15%):', esp: 900 },
                { etq: 'Pagas:', esp: 5100 },
              ],
            },
            {
              consigna: '2 × Telescopio a $3.000 con 20% de descuento',
              ayuda: '¡Última rebaja del día!',
              campos: [
                { etq: 'Precio sin descuento:', esp: 6000 },
                { etq: 'Descuento (20%):', esp: 1200 },
                { etq: 'Pagas:', esp: 4800 },
              ],
            },
          ],
        },
      },
      NIVEL_AHORRO(),
      NIVEL_UBICAR('mercado'),
    ],
  },
  {
    id: 'invernadero',
    nombre: 'Invernadero Estelar',
    mapa: ['Invernadero', 'Estelar'],
    icono: 'm-planta',
    color: '#7BE08F',
    desc: 'La Huerta Escolar de los libros: sembrar, medir con la regla, registrar y leer el crecimiento.',
    niveles: [
      {
        t: 'Cuenta las semillas',
        o: 'Conteo hasta 10',
        mec: 'opciones',
        frase: '¡Sembremos! Pero primero cuenta las semillas.',
        datos: {
          rondas: [
            { consigna: '¿Cuántas semillas hay?', escena: { tipo: 'semillas', args: [3] }, ops: [2, 3, 4, 5], corr: 3 },
            { consigna: '¿Y ahora cuántas hay?', escena: { tipo: 'semillas', args: [5] }, ops: [4, 5, 6, 7], corr: 5 },
            { consigna: 'Cuenta con calma', escena: { tipo: 'semillas', args: [2] }, ops: [1, 2, 3, 4], corr: 2 },
            { consigna: '¿Cuántas semillas hay?', escena: { tipo: 'semillas', args: [7] }, ops: [6, 7, 8, 9], corr: 7 },
            { consigna: 'Sigue contando', escena: { tipo: 'semillas', args: [4] }, ops: [3, 4, 5, 6], corr: 4 },
            { consigna: '¿Cuántas hay en la bandeja?', escena: { tipo: 'semillas', args: [8] }, ops: [7, 8, 9, 10], corr: 8 },
            { consigna: '¡Ya casi eres experto!', escena: { tipo: 'semillas', args: [6] }, ops: [5, 6, 7, 8], corr: 6 },
            { consigna: '¿Cuántas semillas hay?', escena: { tipo: 'semillas', args: [9] }, ops: [8, 9, 10, 11], corr: 9 },
            { consigna: '¡Bandeja llena!', escena: { tipo: 'semillas', args: [10] }, ops: [8, 9, 10, 11], corr: 10 },
            { consigna: 'Última bandeja', escena: { tipo: 'semillas', args: [7] }, ops: [5, 6, 7, 8], corr: 7 },
          ],
        },
      },
      {
        t: 'Mide la planta',
        o: 'Medir con la regla en cm',
        mec: 'opciones',
        frase: 'Usa la regla: ¿hasta qué número llega la planta?',
        datos: {
          rondas: [
            { consigna: '¿Cuánto mide la planta?', escena: { tipo: 'planta', args: [4] }, ops: ['3 cm', '4 cm', '5 cm', '6 cm'], corr: '4 cm' },
            { consigna: 'Creció un poco…', escena: { tipo: 'planta', args: [6] }, ops: ['4 cm', '6 cm', '8 cm', '10 cm'], corr: '6 cm' },
            { consigna: '¿Cuánto mide ahora?', escena: { tipo: 'planta', args: [8] }, ops: ['7 cm', '8 cm', '9 cm', '10 cm'], corr: '8 cm' },
            { consigna: 'Mide con cuidado', escena: { tipo: 'planta', args: [5] }, ops: ['4 cm', '5 cm', '6 cm', '7 cm'], corr: '5 cm' },
            { consigna: '¡Sigue creciendo!', escena: { tipo: 'planta', args: [9] }, ops: ['7 cm', '8 cm', '9 cm', '11 cm'], corr: '9 cm' },
            { consigna: '¿Hasta dónde llega?', escena: { tipo: 'planta', args: [11] }, ops: ['10 cm', '11 cm', '12 cm', '13 cm'], corr: '11 cm' },
            { consigna: 'Revisa la regla', escena: { tipo: 'planta', args: [7] }, ops: ['6 cm', '7 cm', '8 cm', '9 cm'], corr: '7 cm' },
            { consigna: '¡Qué alta va!', escena: { tipo: 'planta', args: [12] }, ops: ['11 cm', '12 cm', '13 cm', '14 cm'], corr: '12 cm' },
            { consigna: 'Casi lista la cosecha', escena: { tipo: 'planta', args: [14] }, ops: ['12 cm', '13 cm', '14 cm', '15 cm'], corr: '14 cm' },
            { consigna: '¡Mírala ahora!', escena: { tipo: 'planta', args: [16] }, ops: ['14 cm', '15 cm', '16 cm', '17 cm'], corr: '16 cm' },
          ],
        },
      },
      {
        t: 'La curva de crecimiento',
        o: 'Registrar y calcular el crecimiento',
        mec: 'entradas',
        frase: 'El registro semanal es el corazón de la Huerta.',
        datos: {
          rondas: [
            {
              consigna: 'Midió: sem 1 = 5 cm · sem 2 = 9 cm · sem 3 = 14 cm · sem 4 = 21 cm',
              ayuda: 'Cuánto creció cada semana y el total.',
              escena: { tipo: 'linea', args: [[5, 9, 14, 21]] },
              campos: [
                { etq: 'Creció en semana 2 (cm):', esp: 4 },
                { etq: 'Creció en semana 3 (cm):', esp: 5 },
                { etq: 'Creció en semana 4 (cm):', esp: 7 },
                { etq: 'Crecimiento total (cm):', esp: 16 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 3 cm · sem 2 = 7 cm · sem 3 = 10 cm · sem 4 = 16 cm',
              ayuda: 'Resta semana contra semana.',
              escena: { tipo: 'linea', args: [[3, 7, 10, 16]] },
              campos: [
                { etq: 'Creció en semana 2 (cm):', esp: 4 },
                { etq: 'Crecimiento total (cm):', esp: 13 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 6 cm · sem 2 = 11 cm · sem 3 = 15 cm · sem 4 = 22 cm',
              ayuda: 'Fíjate en la semana 3.',
              escena: { tipo: 'linea', args: [[6, 11, 15, 22]] },
              campos: [
                { etq: 'Creció en semana 3 (cm):', esp: 4 },
                { etq: 'Crecimiento total (cm):', esp: 16 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 4 cm · sem 2 = 9 cm · sem 3 = 13 cm · sem 4 = 20 cm',
              ayuda: 'La última semana fue fuerte.',
              escena: { tipo: 'linea', args: [[4, 9, 13, 20]] },
              campos: [
                { etq: 'Creció en semana 4 (cm):', esp: 7 },
                { etq: 'Crecimiento total (cm):', esp: 16 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 2 cm · sem 2 = 6 cm · sem 3 = 12 cm · sem 4 = 19 cm',
              ayuda: 'Dos semanas para comparar.',
              escena: { tipo: 'linea', args: [[2, 6, 12, 19]] },
              campos: [
                { etq: 'Creció en semana 2 (cm):', esp: 4 },
                { etq: 'Creció en semana 3 (cm):', esp: 6 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 8 cm · sem 2 = 12 cm · sem 3 = 17 cm · sem 4 = 25 cm',
              ayuda: 'El total es final menos inicio.',
              escena: { tipo: 'linea', args: [[8, 12, 17, 25]] },
              campos: [
                { etq: 'Creció en semana 4 (cm):', esp: 8 },
                { etq: 'Crecimiento total (cm):', esp: 17 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 5 cm · sem 2 = 8 cm · sem 3 = 14 cm · sem 4 = 18 cm',
              ayuda: 'Semana 3 dio un salto.',
              escena: { tipo: 'linea', args: [[5, 8, 14, 18]] },
              campos: [
                { etq: 'Creció en semana 3 (cm):', esp: 6 },
                { etq: 'Crecimiento total (cm):', esp: 13 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 7 cm · sem 2 = 13 cm · sem 3 = 18 cm · sem 4 = 26 cm',
              ayuda: 'Empieza por la semana 2.',
              escena: { tipo: 'linea', args: [[7, 13, 18, 26]] },
              campos: [
                { etq: 'Creció en semana 2 (cm):', esp: 6 },
                { etq: 'Crecimiento total (cm):', esp: 19 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 3 cm · sem 2 = 9 cm · sem 3 = 16 cm · sem 4 = 24 cm',
              ayuda: 'Dos semanas seguidas.',
              escena: { tipo: 'linea', args: [[3, 9, 16, 24]] },
              campos: [
                { etq: 'Creció en semana 3 (cm):', esp: 7 },
                { etq: 'Creció en semana 4 (cm):', esp: 8 },
              ],
            },
            {
              consigna: 'Midió: sem 1 = 10 cm · sem 2 = 14 cm · sem 3 = 19 cm · sem 4 = 27 cm',
              ayuda: '¡Cosecha final!',
              escena: { tipo: 'linea', args: [[10, 14, 19, 27]] },
              campos: [
                { etq: 'Creció en semana 2 (cm):', esp: 4 },
                { etq: 'Crecimiento total (cm):', esp: 17 },
              ],
            },
          ],
        },
      },
      {
        t: 'El terreno de la huerta',
        et: '🌱 Plantas y costos',
        o: 'Área de la huerta y costo de las semillas',
        mec: 'entradas',
        frase: 'Cada cuadro del terreno lleva una planta. ¡Calculemos el costo!',
        datos: {
          rondas: [
            {
              consigna: 'La huerta mide 4 × 3 cuadros y en cada cuadro se siembra 1 planta. Cada semilla cuesta $200',
              ayuda: 'Primero cuenta las plantas, luego el costo.',
              escena: { tipo: 'cuadricula', args: [4, 3] },
              campos: [
                { etq: 'Plantas que caben:', esp: 12 },
                { etq: 'Costo de las semillas:', esp: 2400 },
              ],
            },
            {
              consigna: 'La huerta mide 5 × 2 cuadros. Cada semilla cuesta $100',
              ayuda: 'El mismo método.',
              escena: { tipo: 'cuadricula', args: [5, 2] },
              campos: [
                { etq: 'Plantas que caben:', esp: 10 },
                { etq: 'Costo de las semillas:', esp: 1000 },
              ],
            },
            {
              consigna: 'La huerta mide 3 × 3 cuadros. Cada semilla cuesta $300',
              ayuda: 'Un terreno cuadrado.',
              escena: { tipo: 'cuadricula', args: [3, 3] },
              campos: [
                { etq: 'Plantas que caben:', esp: 9 },
                { etq: 'Costo de las semillas:', esp: 2700 },
              ],
            },
            {
              consigna: 'La huerta mide 6 × 2 cuadros. Cada semilla cuesta $200',
              ayuda: 'Sigue contando.',
              escena: { tipo: 'cuadricula', args: [6, 2] },
              campos: [
                { etq: 'Plantas que caben:', esp: 12 },
                { etq: 'Costo de las semillas:', esp: 2400 },
              ],
            },
            {
              consigna: 'La huerta mide 4 × 4 cuadros. Cada semilla cuesta $100',
              ayuda: 'Vas muy bien.',
              escena: { tipo: 'cuadricula', args: [4, 4] },
              campos: [
                { etq: 'Plantas que caben:', esp: 16 },
                { etq: 'Costo de las semillas:', esp: 1600 },
              ],
            },
            {
              consigna: 'La huerta mide 5 × 3 cuadros. Cada semilla cuesta $200',
              ayuda: 'Plantas y luego costo.',
              escena: { tipo: 'cuadricula', args: [5, 3] },
              campos: [
                { etq: 'Plantas que caben:', esp: 15 },
                { etq: 'Costo de las semillas:', esp: 3000 },
              ],
            },
            {
              consigna: 'La huerta mide 6 × 3 cuadros. Cada semilla cuesta $100',
              ayuda: 'Un terreno grande.',
              escena: { tipo: 'cuadricula', args: [6, 3] },
              campos: [
                { etq: 'Plantas que caben:', esp: 18 },
                { etq: 'Costo de las semillas:', esp: 1800 },
              ],
            },
            {
              consigna: 'La huerta mide 4 × 5 cuadros. Cada semilla cuesta $300',
              ayuda: 'Con calma.',
              escena: { tipo: 'cuadricula', args: [4, 5] },
              campos: [
                { etq: 'Plantas que caben:', esp: 20 },
                { etq: 'Costo de las semillas:', esp: 6000 },
              ],
            },
            {
              consigna: 'La huerta mide 7 × 2 cuadros. Cada semilla cuesta $200',
              ayuda: 'Casi terminas.',
              escena: { tipo: 'cuadricula', args: [7, 2] },
              campos: [
                { etq: 'Plantas que caben:', esp: 14 },
                { etq: 'Costo de las semillas:', esp: 2800 },
              ],
            },
            {
              consigna: 'La huerta mide 5 × 4 cuadros. Cada semilla cuesta $500',
              ayuda: '¡La gran siembra final!',
              escena: { tipo: 'cuadricula', args: [5, 4] },
              campos: [
                { etq: 'Plantas que caben:', esp: 20 },
                { etq: 'Costo de las semillas:', esp: 10000 },
              ],
            },
          ],
        },
      },
      NIVEL_UBICAR('invernadero'),
    ],
  },
  {
    id: 'pista',
    nombre: 'Pista de Entrenamiento',
    mapa: ['Pista de', 'Entrenamiento'],
    icono: 'm-crono',
    color: '#FF6B5E',
    desc: 'Deporte y Números: cronómetro, ordenar tiempos y el promedio del equipo.',
    niveles: [
      {
        t: '¿Quién ganó?',
        o: 'Comparar: menor tiempo gana',
        mec: 'opciones',
        frase: 'En la carrera gana el tiempo MÁS pequeño.',
        datos: {
          rondas: [
            { consigna: 'Ana: 9 s · Beto: 7 s · Cami: 8 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Ana', 9], ['Beto', 7], ['Cami', 8]]] }, ops: ['Ana', 'Beto', 'Cami'], corr: 'Beto' },
            { consigna: 'Dani: 11 s · Eli: 12 s · Fede: 10 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Dani', 11], ['Eli', 12], ['Fede', 10]]] }, ops: ['Dani', 'Eli', 'Fede'], corr: 'Fede' },
            { consigna: '¿Quién quedó de último? Gina: 8 s · Hugo: 13 s · Iris: 9 s', escena: { tipo: 'podio', args: [[['Gina', 8], ['Hugo', 13], ['Iris', 9]]] }, ops: ['Gina', 'Hugo', 'Iris'], corr: 'Hugo' },
            { consigna: 'Juan: 6 s · Kata: 9 s · Leo: 7 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Juan', 6], ['Kata', 9], ['Leo', 7]]] }, ops: ['Juan', 'Kata', 'Leo'], corr: 'Juan' },
            { consigna: 'Mia: 10 s · Nico: 8 s · Olga: 12 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Mia', 10], ['Nico', 8], ['Olga', 12]]] }, ops: ['Mia', 'Nico', 'Olga'], corr: 'Nico' },
            { consigna: '¿Quién quedó de último? Pablo: 7 s · Quique: 11 s · Rosa: 9 s', escena: { tipo: 'podio', args: [[['Pablo', 7], ['Quique', 11], ['Rosa', 9]]] }, ops: ['Pablo', 'Quique', 'Rosa'], corr: 'Quique' },
            { consigna: 'Sara: 13 s · Tomás: 12 s · Ulises: 14 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Sara', 13], ['Tomás', 12], ['Ulises', 14]]] }, ops: ['Sara', 'Tomás', 'Ulises'], corr: 'Tomás' },
            { consigna: 'Vera: 6 s · Wilo: 8 s · Ximena: 5 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Vera', 6], ['Wilo', 8], ['Ximena', 5]]] }, ops: ['Vera', 'Wilo', 'Ximena'], corr: 'Ximena' },
            { consigna: '¿Quién quedó de último? Yara: 10 s · Zoe: 14 s · Abel: 12 s', escena: { tipo: 'podio', args: [[['Yara', 10], ['Zoe', 14], ['Abel', 12]]] }, ops: ['Yara', 'Zoe', 'Abel'], corr: 'Zoe' },
            { consigna: 'Bruno: 9 s · Cleo: 7 s · Darío: 8 s. ¿Quién ganó?', escena: { tipo: 'podio', args: [[['Bruno', 9], ['Cleo', 7], ['Darío', 8]]] }, ops: ['Bruno', 'Cleo', 'Darío'], corr: 'Cleo' },
          ],
        },
      },
      {
        t: 'Ordena la llegada',
        o: 'Ordenar números con decimales',
        mec: 'ordenar',
        frase: 'Del más rápido al más lento, ¡sin equivocarse!',
        datos: {
          rondas: [
            { consigna: 'Toca los tiempos del MENOR al MAYOR', items: [['9,2 s', 9.2], ['8,5 s', 8.5], ['10,1 s', 10.1], ['7,8 s', 7.8]] },
            { consigna: '¡Otra carrera! Del menor al mayor', items: [['12,4 s', 12.4], ['11,9 s', 11.9], ['12,0 s', 12.0], ['13,2 s', 13.2]] },
            { consigna: 'Ordena la llegada', items: [['6,8 s', 6.8], ['7,5 s', 7.5], ['7,1 s', 7.1], ['6,4 s', 6.4]] },
            { consigna: 'Del más rápido al más lento', items: [['10,5 s', 10.5], ['9,9 s', 9.9], ['10,0 s', 10.0], ['11,2 s', 11.2]] },
            { consigna: '¡Concéntrate en los decimales!', items: [['8,1 s', 8.1], ['8,9 s', 8.9], ['7,6 s', 7.6], ['9,3 s', 9.3]] },
            { consigna: 'Carrera de resistencia', items: [['14,2 s', 14.2], ['13,8 s', 13.8], ['15,0 s', 15.0], ['14,9 s', 14.9]] },
            { consigna: '¡Los más veloces!', items: [['5,9 s', 5.9], ['6,3 s', 6.3], ['5,5 s', 5.5], ['6,8 s', 6.8]] },
            { consigna: 'Ordena con cuidado', items: [['11,1 s', 11.1], ['10,7 s', 10.7], ['12,3 s', 12.3], ['11,8 s', 11.8]] },
            { consigna: 'Décimas de diferencia', items: [['7,2 s', 7.2], ['8,0 s', 8.0], ['7,9 s', 7.9], ['6,9 s', 6.9]] },
            { consigna: '¡Final del campeonato!', items: [['9,6 s', 9.6], ['9,1 s', 9.1], ['10,4 s', 10.4], ['8,8 s', 8.8]] },
          ],
        },
      },
      {
        t: 'El promedio del equipo',
        o: 'Calcular el promedio',
        mec: 'entradas',
        frase: 'El promedio: suma todo y divide entre cuántos son.',
        datos: {
          rondas: [
            {
              consigna: 'Tiempos: 8 s, 9 s, 7 s y 12 s',
              ayuda: 'Suma los cuatro y divide entre 4.',
              escena: { tipo: 'barras', args: [[8, 9, 7, 12], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 36 }, { etq: 'Promedio (s):', esp: 9 }],
            },
            {
              consigna: 'Tiempos: 10 s, 12 s, 14 s y 12 s',
              ayuda: 'El mismo método.',
              escena: { tipo: 'barras', args: [[10, 12, 14, 12], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 48 }, { etq: 'Promedio (s):', esp: 12 }],
            },
            {
              consigna: 'Tiempos: 6 s, 8 s, 10 s y 12 s',
              ayuda: 'Suma y divide.',
              escena: { tipo: 'barras', args: [[6, 8, 10, 12], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 36 }, { etq: 'Promedio (s):', esp: 9 }],
            },
            {
              consigna: 'Tiempos: 9 s, 11 s, 10 s y 10 s',
              ayuda: 'Todos cerca del promedio.',
              escena: { tipo: 'barras', args: [[9, 11, 10, 10], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 40 }, { etq: 'Promedio (s):', esp: 10 }],
            },
            {
              consigna: 'Tiempos: 7 s, 7 s, 9 s y 9 s',
              ayuda: 'Parejas de tiempos.',
              escena: { tipo: 'barras', args: [[7, 7, 9, 9], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 32 }, { etq: 'Promedio (s):', esp: 8 }],
            },
            {
              consigna: 'Tiempos: 11 s, 13 s, 12 s y 12 s',
              ayuda: 'Concéntrate en la suma.',
              escena: { tipo: 'barras', args: [[11, 13, 12, 12], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 48 }, { etq: 'Promedio (s):', esp: 12 }],
            },
            {
              consigna: 'Tiempos: 5 s, 9 s, 8 s y 10 s',
              ayuda: '¡Equipo veloz!',
              escena: { tipo: 'barras', args: [[5, 9, 8, 10], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 32 }, { etq: 'Promedio (s):', esp: 8 }],
            },
            {
              consigna: 'Tiempos: 14 s, 10 s, 12 s y 12 s',
              ayuda: 'Divide entre 4 al final.',
              escena: { tipo: 'barras', args: [[14, 10, 12, 12], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 48 }, { etq: 'Promedio (s):', esp: 12 }],
            },
            {
              consigna: 'Tiempos: 6 s, 10 s, 9 s y 11 s',
              ayuda: 'Vas muy bien.',
              escena: { tipo: 'barras', args: [[6, 10, 9, 11], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 36 }, { etq: 'Promedio (s):', esp: 9 }],
            },
            {
              consigna: 'Tiempos: 13 s, 9 s, 11 s y 11 s',
              ayuda: '¡Cierre del entrenamiento!',
              escena: { tipo: 'barras', args: [[13, 9, 11, 11], ['A', 'B', 'C', 'D']] },
              campos: [{ etq: 'Suma de tiempos (s):', esp: 44 }, { etq: 'Promedio (s):', esp: 11 }],
            },
          ],
        },
      },
      {
        t: 'Salto largo',
        et: '🏃 Salto y equipo',
        o: 'Participantes y marcas de salto largo',
        mec: 'entradas',
        frase: '¡A la arena! Saltos, marcas y el conteo del equipo.',
        datos: {
          rondas: [
            { consigna: 'Ana saltó 120 cm y Beto saltó 95 cm', ayuda: 'Resta las dos marcas.', campos: [{ etq: '¿Cuántos cm más saltó Ana?:', esp: 25 }] },
            { consigna: 'Hay 3 equipos con 4 participantes cada uno', ayuda: 'Multiplica.', campos: [{ etq: 'Participantes en total:', esp: 12 }] },
            { consigna: 'Cami saltó 110 cm y Dani saltó 130 cm', ayuda: '¿Quién saltó más y por cuánto?', campos: [{ etq: '¿Cuántos cm más saltó Dani?:', esp: 20 }] },
            { consigna: 'Hay 5 equipos con 6 participantes cada uno', ayuda: 'El conteo del torneo.', campos: [{ etq: 'Participantes en total:', esp: 30 }] },
            { consigna: 'Eli saltó 88 cm y Fede saltó 100 cm', ayuda: 'La diferencia de marcas.', campos: [{ etq: '¿Cuántos cm más saltó Fede?:', esp: 12 }] },
            { consigna: 'En la mañana saltaron 14 atletas y en la tarde 17', ayuda: 'Suma las dos jornadas.', campos: [{ etq: 'Atletas del día:', esp: 31 }] },
            { consigna: 'Gina saltó 125 cm y la marca del colegio es 150 cm', ayuda: '¿Cuánto le faltó?', campos: [{ etq: 'Le faltaron (cm):', esp: 25 }] },
            { consigna: 'Hay 4 equipos con 7 participantes cada uno', ayuda: 'Ya conoces el método.', campos: [{ etq: 'Participantes en total:', esp: 28 }] },
            {
              consigna: 'Hugo saltó 105, 112 y 121 cm en sus tres intentos',
              ayuda: 'Su mejor marca y su mejora.',
              campos: [
                { etq: 'Su mejor salto (cm):', esp: 121 },
                { etq: 'Mejoró del primero al último (cm):', esp: 16 },
              ],
            },
            { consigna: 'En la final saltan 2 equipos de 8 y hay 3 jueces', ayuda: 'Cuenta a todas las personas.', campos: [{ etq: 'Personas en la pista:', esp: 19 }] },
          ],
        },
      },
      NIVEL_UBICAR('pista'),
    ],
  },
  {
    id: 'sala',
    nombre: 'Sala de Juegos',
    mapa: ['Sala de', 'Juegos'],
    icono: 'm-dado',
    color: '#FFC94D',
    desc: 'Parqués, Dominó y probabilidad: los juegos de mesa de los libros, en versión estelar.',
    niveles: [
      {
        t: 'Suma de dados',
        o: 'Sumar dos dados',
        mec: 'opciones',
        frase: '¡Tira los dados del parqués!',
        datos: {
          rondas: [
            { consigna: '¿Cuánto suman?', escena: { tipo: 'dados', args: [2, 3] }, ops: [4, 5, 6, 7], corr: 5 },
            { consigna: '¡Otra tirada!', escena: { tipo: 'dados', args: [4, 5] }, ops: [8, 9, 10, 11], corr: 9 },
            { consigna: '¡Pares!', escena: { tipo: 'dados', args: [6, 6] }, ops: [10, 11, 12, 13], corr: 12 },
            { consigna: 'Suma con cuidado', escena: { tipo: 'dados', args: [3, 4] }, ops: [6, 7, 8, 9], corr: 7 },
            { consigna: 'Tirada pequeña', escena: { tipo: 'dados', args: [1, 2] }, ops: [2, 3, 4, 5], corr: 3 },
            { consigna: '¡Doble cinco!', escena: { tipo: 'dados', args: [5, 5] }, ops: [9, 10, 11, 12], corr: 10 },
            { consigna: '¿Cuánto suman ahora?', escena: { tipo: 'dados', args: [2, 6] }, ops: [7, 8, 9, 10], corr: 8 },
            { consigna: '¡Doble cuatro!', escena: { tipo: 'dados', args: [4, 4] }, ops: [6, 7, 8, 9], corr: 8 },
            { consigna: 'Sigue sumando', escena: { tipo: 'dados', args: [3, 6] }, ops: [8, 9, 10, 11], corr: 9 },
            { consigna: '¡Última tirada!', escena: { tipo: 'dados', args: [6, 5] }, ops: [10, 11, 12, 13], corr: 11 },
          ],
        },
      },
      {
        t: 'Dominó de cuentas',
        o: 'Encontrar la ficha que suma',
        mec: 'opciones',
        frase: 'Busca la ficha de dominó que sume lo que pido.',
        datos: {
          rondas: [
            { consigna: '¿Cuál ficha suma 8?', ops: [{ escena: { tipo: 'domino', args: [3, 5] }, v: 'a' }, { escena: { tipo: 'domino', args: [2, 4] }, v: 'b' }, { escena: { tipo: 'domino', args: [6, 3] }, v: 'c' }], corr: 'a' },
            { consigna: '¿Cuál ficha suma 7?', ops: [{ escena: { tipo: 'domino', args: [5, 5] }, v: 'a' }, { escena: { tipo: 'domino', args: [6, 1] }, v: 'b' }, { escena: { tipo: 'domino', args: [2, 3] }, v: 'c' }], corr: 'b' },
            { consigna: '¿Cuál ficha suma 10?', ops: [{ escena: { tipo: 'domino', args: [4, 4] }, v: 'a' }, { escena: { tipo: 'domino', args: [3, 6] }, v: 'b' }, { escena: { tipo: 'domino', args: [6, 4] }, v: 'c' }], corr: 'c' },
            { consigna: '¿Cuál ficha suma 9?', ops: [{ escena: { tipo: 'domino', args: [4, 5] }, v: 'a' }, { escena: { tipo: 'domino', args: [3, 3] }, v: 'b' }, { escena: { tipo: 'domino', args: [6, 2] }, v: 'c' }], corr: 'a' },
            { consigna: '¿Cuál ficha suma 6?', ops: [{ escena: { tipo: 'domino', args: [1, 3] }, v: 'a' }, { escena: { tipo: 'domino', args: [2, 4] }, v: 'b' }, { escena: { tipo: 'domino', args: [5, 3] }, v: 'c' }], corr: 'b' },
            { consigna: '¿Cuál ficha suma 11?', ops: [{ escena: { tipo: 'domino', args: [5, 5] }, v: 'a' }, { escena: { tipo: 'domino', args: [6, 4] }, v: 'b' }, { escena: { tipo: 'domino', args: [6, 5] }, v: 'c' }], corr: 'c' },
            { consigna: '¿Cuál ficha suma 5?', ops: [{ escena: { tipo: 'domino', args: [2, 3] }, v: 'a' }, { escena: { tipo: 'domino', args: [1, 2] }, v: 'b' }, { escena: { tipo: 'domino', args: [4, 4] }, v: 'c' }], corr: 'a' },
            { consigna: '¿Cuál ficha suma 12?', ops: [{ escena: { tipo: 'domino', args: [6, 5] }, v: 'a' }, { escena: { tipo: 'domino', args: [6, 6] }, v: 'b' }, { escena: { tipo: 'domino', args: [4, 6] }, v: 'c' }], corr: 'b' },
            { consigna: '¿Cuál ficha suma 4?', ops: [{ escena: { tipo: 'domino', args: [1, 1] }, v: 'a' }, { escena: { tipo: 'domino', args: [3, 3] }, v: 'b' }, { escena: { tipo: 'domino', args: [1, 3] }, v: 'c' }], corr: 'c' },
            { consigna: '¿Cuál ficha suma 9? ¡Última!', ops: [{ escena: { tipo: 'domino', args: [6, 3] }, v: 'a' }, { escena: { tipo: 'domino', args: [2, 5] }, v: 'b' }, { escena: { tipo: 'domino', args: [4, 4] }, v: 'c' }], corr: 'a' },
          ],
        },
      },
      {
        t: '¿Qué es más probable?',
        o: 'Probabilidad simple',
        mec: 'opciones',
        frase: 'Mira la bolsa y piensa: ¿qué color saldrá más fácil?',
        datos: {
          rondas: [
            { consigna: 'Hay 6 rojas y 2 azules. ¿Qué es más probable sacar?', escena: { tipo: 'bolsa', args: [6, 2] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Roja' },
            { consigna: 'Hay 3 rojas y 3 azules', escena: { tipo: 'bolsa', args: [3, 3] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Igual de probable' },
            { consigna: 'Hay 1 roja y 5 azules', escena: { tipo: 'bolsa', args: [1, 5] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Azul' },
            { consigna: 'Hay 7 rojas y 3 azules', escena: { tipo: 'bolsa', args: [7, 3] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Roja' },
            { consigna: 'Hay 4 rojas y 4 azules', escena: { tipo: 'bolsa', args: [4, 4] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Igual de probable' },
            { consigna: 'Hay 2 rojas y 6 azules', escena: { tipo: 'bolsa', args: [2, 6] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Azul' },
            { consigna: 'Hay 8 rojas y 2 azules', escena: { tipo: 'bolsa', args: [8, 2] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Roja' },
            { consigna: 'Hay 5 rojas y 5 azules', escena: { tipo: 'bolsa', args: [5, 5] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Igual de probable' },
            { consigna: 'Hay 3 rojas y 7 azules', escena: { tipo: 'bolsa', args: [3, 7] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Azul' },
            { consigna: 'Hay 9 rojas y 3 azules. ¡Última!', escena: { tipo: 'bolsa', args: [9, 3] }, ops: ['Roja', 'Azul', 'Igual de probable'], corr: 'Roja' },
          ],
        },
      },
      {
        t: 'Fichas y jugadores',
        et: '🎲 Fichas y dados',
        o: 'Participantes, dados y fichas del juego',
        mec: 'entradas',
        frase: 'Antes de jugar hay que repartir y contar.',
        datos: {
          rondas: [
            { consigna: 'Cada jugador recibe 4 fichas y juegan 3 jugadores', ayuda: 'Multiplica fichas por jugadores.', campos: [{ etq: 'Fichas repartidas:', esp: 12 }] },
            { consigna: 'Tiraron 3 dados y los tres cayeron en 6', ayuda: 'Suma los tres dados.', campos: [{ etq: 'Suma de los dados:', esp: 18 }] },
            { consigna: 'El parqués trae 16 fichas y se perdieron 3', ayuda: 'Resta las perdidas.', campos: [{ etq: 'Fichas que quedan:', esp: 13 }] },
            { consigna: 'Se juegan 2 partidas con 4 jugadores cada una', ayuda: 'Cuenta a todos.', campos: [{ etq: 'Participantes en total:', esp: 8 }] },
            { consigna: 'Cada jugador recibe 7 fichas de dominó y juegan 4', ayuda: 'El reparto del dominó.', campos: [{ etq: 'Fichas repartidas:', esp: 28 }] },
            { consigna: 'Dos dados cayeron en 5 y uno cayó en 3', ayuda: '5 + 5 + 3.', campos: [{ etq: 'Suma de los dados:', esp: 13 }] },
            { consigna: 'La caja trae 28 fichas de dominó y se repartieron 21', ayuda: '¿Cuántas sobraron?', campos: [{ etq: 'Quedan en la caja:', esp: 7 }] },
            { consigna: 'Hay 5 mesas con 4 jugadores cada una', ayuda: 'El salón completo.', campos: [{ etq: 'Participantes en total:', esp: 20 }] },
            { consigna: 'Un dado cayó en 4. Para llegar a 10…', ayuda: '¿Cuánto falta?', campos: [{ etq: 'Falta:', esp: 6 }] },
            { consigna: 'Cada uno de los 6 jugadores pone 2 fichas en el centro', ayuda: '¡El pozo del juego!', campos: [{ etq: 'Fichas en el centro:', esp: 12 }] },
          ],
        },
      },
      NIVEL_UBICAR('sala'),
    ],
  },
  {
    id: 'taller',
    nombre: 'Taller de Construcción',
    mapa: ['Taller de', 'Construcción'],
    icono: 'm-piramide',
    color: '#9CCBFF',
    desc: 'Las Pirámides y las baldosas: figuras, perímetro, área y volumen para construir la estación.',
    niveles: [
      {
        t: 'Lados y figuras',
        o: 'Reconocer figuras y contar lados',
        mec: 'opciones',
        frase: 'Todo constructor conoce sus figuras.',
        datos: {
          rondas: [
            { consigna: '¿Cuántos lados tiene el triángulo?', escena: { tipo: 'figura', args: ['tri'] }, ops: [3, 4, 5, 6], corr: 3 },
            { consigna: '¿Cuántos lados tiene el cuadrado?', escena: { tipo: 'figura', args: ['cua'] }, ops: [3, 4, 5, 6], corr: 4 },
            { consigna: '¿Cuántos lados tiene el hexágono?', escena: { tipo: 'figura', args: ['hex'] }, ops: [4, 5, 6, 8], corr: 6 },
            { consigna: '¿Cuántos lados tiene el pentágono?', escena: { tipo: 'figura', args: ['pent'] }, ops: [4, 5, 6, 7], corr: 5 },
            { consigna: '¿Cuántos lados tiene el rectángulo?', escena: { tipo: 'figura', args: ['rect'] }, ops: [3, 4, 5, 6], corr: 4 },
            { consigna: '¿Cuántos lados tiene el triángulo?', escena: { tipo: 'figura', args: ['tri'] }, ops: [2, 3, 4, 5], corr: 3 },
            { consigna: '¿Cuántos lados tiene el hexágono?', escena: { tipo: 'figura', args: ['hex'] }, ops: [5, 6, 7, 8], corr: 6 },
            { consigna: '¿Cuántos lados tiene el pentágono?', escena: { tipo: 'figura', args: ['pent'] }, ops: [3, 4, 5, 6], corr: 5 },
            { consigna: '¿Cuántos lados tiene el cuadrado?', escena: { tipo: 'figura', args: ['cua'] }, ops: [4, 5, 6, 8], corr: 4 },
            { consigna: '¿Cuántos lados tiene el rectángulo?', escena: { tipo: 'figura', args: ['rect'] }, ops: [2, 3, 4, 5], corr: 4 },
          ],
        },
      },
      {
        t: 'Baldosas: área y perímetro',
        o: 'Contar cuadrados de la cuadrícula',
        mec: 'entradas',
        frase: 'Cada cuadrito mide 1 metro. ¡A embaldosar!',
        datos: {
          rondas: [
            {
              consigna: 'El piso mide 6 × 3 cuadros',
              ayuda: 'Área: cuadros que caben. Perímetro: el borde completo.',
              escena: { tipo: 'cuadricula', args: [6, 3] },
              campos: [
                { etq: 'Área (cuadros):', esp: 18 },
                { etq: 'Perímetro (m):', esp: 18 },
              ],
            },
            {
              consigna: 'El piso mide 5 × 4 cuadros',
              ayuda: 'El mismo método.',
              escena: { tipo: 'cuadricula', args: [5, 4] },
              campos: [
                { etq: 'Área (cuadros):', esp: 20 },
                { etq: 'Perímetro (m):', esp: 18 },
              ],
            },
            {
              consigna: 'El piso mide 4 × 4 cuadros',
              ayuda: 'Un piso cuadrado.',
              escena: { tipo: 'cuadricula', args: [4, 4] },
              campos: [
                { etq: 'Área (cuadros):', esp: 16 },
                { etq: 'Perímetro (m):', esp: 16 },
              ],
            },
            {
              consigna: 'El piso mide 7 × 3 cuadros',
              ayuda: 'Cuenta con calma.',
              escena: { tipo: 'cuadricula', args: [7, 3] },
              campos: [
                { etq: 'Área (cuadros):', esp: 21 },
                { etq: 'Perímetro (m):', esp: 20 },
              ],
            },
            {
              consigna: 'El piso mide 6 × 5 cuadros',
              ayuda: 'Un salón grande.',
              escena: { tipo: 'cuadricula', args: [6, 5] },
              campos: [
                { etq: 'Área (cuadros):', esp: 30 },
                { etq: 'Perímetro (m):', esp: 22 },
              ],
            },
            {
              consigna: 'El piso mide 8 × 2 cuadros',
              ayuda: 'Un pasillo largo.',
              escena: { tipo: 'cuadricula', args: [8, 2] },
              campos: [
                { etq: 'Área (cuadros):', esp: 16 },
                { etq: 'Perímetro (m):', esp: 20 },
              ],
            },
            {
              consigna: 'El piso mide 5 × 5 cuadros',
              ayuda: 'Otro cuadrado.',
              escena: { tipo: 'cuadricula', args: [5, 5] },
              campos: [
                { etq: 'Área (cuadros):', esp: 25 },
                { etq: 'Perímetro (m):', esp: 20 },
              ],
            },
            {
              consigna: 'El piso mide 7 × 4 cuadros',
              ayuda: 'Vas muy bien.',
              escena: { tipo: 'cuadricula', args: [7, 4] },
              campos: [
                { etq: 'Área (cuadros):', esp: 28 },
                { etq: 'Perímetro (m):', esp: 22 },
              ],
            },
            {
              consigna: 'El piso mide 9 × 3 cuadros',
              ayuda: '¡El corredor de la nave!',
              escena: { tipo: 'cuadricula', args: [9, 3] },
              campos: [
                { etq: 'Área (cuadros):', esp: 27 },
                { etq: 'Perímetro (m):', esp: 24 },
              ],
            },
            {
              consigna: 'El piso mide 6 × 4 cuadros',
              ayuda: '¡Última obra!',
              escena: { tipo: 'cuadricula', args: [6, 4] },
              campos: [
                { etq: 'Área (cuadros):', esp: 24 },
                { etq: 'Perímetro (m):', esp: 20 },
              ],
            },
          ],
        },
      },
      {
        t: 'Volumen con cubos',
        o: 'Contar cubos: largo × ancho × alto',
        mec: 'entradas',
        frase: 'Como las pirámides: capa por capa.',
        datos: {
          rondas: [
            {
              consigna: 'Bloque de 3 × 2 de base y 2 pisos',
              ayuda: 'Cubos de la base, luego multiplica por los pisos.',
              escena: { tipo: 'cubos', args: [3, 2, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 6 },
                { etq: 'Cubos en total:', esp: 12 },
              ],
            },
            {
              consigna: 'Bloque de 4 × 3 de base y 2 pisos',
              ayuda: '¡Ya sabes el truco!',
              escena: { tipo: 'cubos', args: [4, 3, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 12 },
                { etq: 'Cubos en total:', esp: 24 },
              ],
            },
            {
              consigna: 'Bloque de 2 × 2 de base y 2 pisos',
              ayuda: 'Un cubo pequeño.',
              escena: { tipo: 'cubos', args: [2, 2, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 4 },
                { etq: 'Cubos en total:', esp: 8 },
              ],
            },
            {
              consigna: 'Bloque de 4 × 2 de base y 3 pisos',
              ayuda: 'Tres pisos ahora.',
              escena: { tipo: 'cubos', args: [4, 2, 3] },
              campos: [
                { etq: 'Cubos en la base:', esp: 8 },
                { etq: 'Cubos en total:', esp: 24 },
              ],
            },
            {
              consigna: 'Bloque de 5 × 3 de base y 2 pisos',
              ayuda: 'Base grande.',
              escena: { tipo: 'cubos', args: [5, 3, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 15 },
                { etq: 'Cubos en total:', esp: 30 },
              ],
            },
            {
              consigna: 'Bloque de 3 × 3 de base y 3 pisos',
              ayuda: '¡Un cubo perfecto!',
              escena: { tipo: 'cubos', args: [3, 3, 3] },
              campos: [
                { etq: 'Cubos en la base:', esp: 9 },
                { etq: 'Cubos en total:', esp: 27 },
              ],
            },
            {
              consigna: 'Bloque de 4 × 4 de base y 2 pisos',
              ayuda: 'Cuenta la base primero.',
              escena: { tipo: 'cubos', args: [4, 4, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 16 },
                { etq: 'Cubos en total:', esp: 32 },
              ],
            },
            {
              consigna: 'Bloque de 5 × 2 de base y 2 pisos',
              ayuda: 'Sigue construyendo.',
              escena: { tipo: 'cubos', args: [5, 2, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 10 },
                { etq: 'Cubos en total:', esp: 20 },
              ],
            },
            {
              consigna: 'Bloque de 3 × 4 de base y 2 pisos',
              ayuda: 'Casi terminas la torre.',
              escena: { tipo: 'cubos', args: [3, 4, 2] },
              campos: [
                { etq: 'Cubos en la base:', esp: 12 },
                { etq: 'Cubos en total:', esp: 24 },
              ],
            },
            {
              consigna: 'Bloque de 4 × 3 de base y 3 pisos',
              ayuda: '¡La gran pirámide final!',
              escena: { tipo: 'cubos', args: [4, 3, 3] },
              campos: [
                { etq: 'Cubos en la base:', esp: 12 },
                { etq: 'Cubos en total:', esp: 36 },
              ],
            },
          ],
        },
      },
      {
        t: 'El costo de la obra',
        et: '🧱 Precios de obra',
        o: 'Precios y costos de la construcción',
        mec: 'entradas',
        frase: 'Todo constructor calcula el costo antes de construir.',
        datos: {
          rondas: [
            {
              consigna: 'El piso lleva una baldosa por cuadro. Cada baldosa cuesta $300',
              ayuda: 'Cuenta las baldosas y calcula el costo.',
              escena: { tipo: 'cuadricula', args: [4, 3] },
              campos: [
                { etq: 'Baldosas:', esp: 12 },
                { etq: 'Costo:', esp: 3600 },
              ],
            },
            { consigna: 'Cada ladrillo cuesta $200 y la pared lleva 25', ayuda: 'Multiplica.', campos: [{ etq: 'Costo:', esp: 5000 }] },
            {
              consigna: 'Una baldosa por cuadro. Cada baldosa cuesta $400',
              ayuda: 'Primero el conteo.',
              escena: { tipo: 'cuadricula', args: [5, 2] },
              campos: [
                { etq: 'Baldosas:', esp: 10 },
                { etq: 'Costo:', esp: 4000 },
              ],
            },
            { consigna: 'Cada bloque cuesta $500 y la torre lleva 8', ayuda: 'El costo de la torre.', campos: [{ etq: 'Costo:', esp: 4000 }] },
            {
              consigna: 'Una baldosa por cuadro. Cada baldosa cuesta $200',
              ayuda: 'Un piso grande.',
              escena: { tipo: 'cuadricula', args: [6, 3] },
              campos: [
                { etq: 'Baldosas:', esp: 18 },
                { etq: 'Costo:', esp: 3600 },
              ],
            },
            { consigna: 'Se necesitan 3 tarros de pintura a $2.000 cada uno', ayuda: 'Multiplica.', campos: [{ etq: 'Costo:', esp: 6000 }] },
            {
              consigna: 'Una baldosa por cuadro. Cada baldosa cuesta $250',
              ayuda: 'Piso cuadrado.',
              escena: { tipo: 'cuadricula', args: [4, 4] },
              campos: [
                { etq: 'Baldosas:', esp: 16 },
                { etq: 'Costo:', esp: 4000 },
              ],
            },
            { consigna: 'La puerta cuesta $3.500 y la ventana $1.500', ayuda: 'Suma los dos precios.', campos: [{ etq: 'Costo de ambas:', esp: 5000 }] },
            {
              consigna: 'Una baldosa por cuadro. Cada baldosa cuesta $300',
              ayuda: 'El pasillo de la nave.',
              escena: { tipo: 'cuadricula', args: [7, 2] },
              campos: [
                { etq: 'Baldosas:', esp: 14 },
                { etq: 'Costo:', esp: 4200 },
              ],
            },
            { consigna: 'Se necesitan 10 tornillos a $150 cada uno', ayuda: '¡Último cálculo de la obra!', campos: [{ etq: 'Costo:', esp: 1500 }] },
          ],
        },
      },
      NIVEL_UBICAR('taller'),
    ],
  },
  {
    id: 'cocina',
    nombre: 'Cocina Estelar',
    mapa: ['Cocina', 'Estelar'],
    icono: 'm-torta',
    color: '#F5A3B8',
    desc: 'Pan, torta y mermeladas: fracciones y proporciones que se comen.',
    niveles: [
      {
        t: 'Parte la torta',
        o: 'Mitades, tercios y cuartos',
        mec: 'fraccion',
        frase: 'Toca las porciones para servirlas.',
        datos: {
          rondas: [
            { consigna: 'Sirve la MITAD de la torta', n: 2, k: 1 },
            { consigna: 'Sirve UN CUARTO', n: 4, k: 1 },
            { consigna: 'Sirve DOS CUARTOS', n: 4, k: 2 },
            { consigna: 'Sirve TRES CUARTOS', n: 4, k: 3 },
            { consigna: 'Sirve UN TERCIO', n: 3, k: 1 },
            { consigna: 'Sirve DOS TERCIOS', n: 3, k: 2 },
            { consigna: 'Sirve la MITAD de esta torta de 6', n: 6, k: 3 },
            { consigna: 'Sirve la MITAD de esta torta de 8', n: 8, k: 4 },
            { consigna: 'Sirve 1/6 de la torta', n: 6, k: 1 },
            { consigna: 'Sirve 2/8 de la torta', n: 8, k: 2 },
          ],
        },
      },
      {
        t: 'Fracciones al horno',
        o: 'Fracciones con más porciones',
        mec: 'fraccion',
        frase: 'Ahora con tortas de más porciones.',
        datos: {
          rondas: [
            { consigna: 'Sirve 3/8 de la torta', n: 8, k: 3 },
            { consigna: 'Sirve 2/6', n: 6, k: 2 },
            { consigna: 'Sirve 5/8', n: 8, k: 5 },
            { consigna: 'Sirve 4/6', n: 6, k: 4 },
            { consigna: 'Sirve 6/8', n: 8, k: 6 },
            { consigna: 'Sirve 2/5', n: 5, k: 2 },
            { consigna: 'Sirve 3/5', n: 5, k: 3 },
            { consigna: 'Sirve 7/8', n: 8, k: 7 },
            { consigna: 'Sirve 5/6', n: 6, k: 5 },
            { consigna: 'Sirve 3/10 de la torta gigante', n: 10, k: 3 },
          ],
        },
      },
      {
        t: 'Escala la receta',
        o: 'Proporciones: la receta de 6 porciones',
        mec: 'entradas',
        frase: 'La receta de la torta es para 6. ¡Pero somos más!',
        datos: {
          rondas: [
            {
              consigna: 'Receta para 6: 300 g de harina, 2 huevos, 150 mL de leche. Hazla para 12',
              ayuda: '12 es 2 veces 6.',
              campos: [
                { etq: 'Harina (g):', esp: 600 },
                { etq: 'Huevos:', esp: 4 },
                { etq: 'Leche (mL):', esp: 300 },
              ],
            },
            {
              consigna: 'La receta de 6, ahora para 18 porciones',
              ayuda: 'Multiplica todo por 3.',
              campos: [
                { etq: 'Harina (g):', esp: 900 },
                { etq: 'Huevos:', esp: 6 },
                { etq: 'Leche (mL):', esp: 450 },
              ],
            },
            {
              consigna: 'La receta de 6, para 24 porciones',
              ayuda: '¿Cuántas veces cabe 6 en 24?',
              campos: [
                { etq: 'Harina (g):', esp: 1200 },
                { etq: 'Huevos:', esp: 8 },
                { etq: 'Leche (mL):', esp: 600 },
              ],
            },
            {
              consigna: 'La receta de 6, para 9 porciones',
              ayuda: '9 ÷ 6 = 1,5: una vez y media.',
              campos: [
                { etq: 'Harina (g):', esp: 450 },
                { etq: 'Huevos:', esp: 3 },
                { etq: 'Leche (mL):', esp: 225 },
              ],
            },
            {
              consigna: 'La receta de 6, para 15 porciones',
              ayuda: '15 ÷ 6 = 2,5.',
              campos: [
                { etq: 'Harina (g):', esp: 750 },
                { etq: 'Huevos:', esp: 5 },
                { etq: 'Leche (mL):', esp: 375 },
              ],
            },
            {
              consigna: 'La receta de 6, para 30 porciones',
              ayuda: '¡Fiesta grande! ×5.',
              campos: [
                { etq: 'Harina (g):', esp: 1500 },
                { etq: 'Huevos:', esp: 10 },
                { etq: 'Leche (mL):', esp: 750 },
              ],
            },
            {
              consigna: 'La receta de 6, para solo 3 porciones',
              ayuda: 'La mitad de todo.',
              campos: [
                { etq: 'Harina (g):', esp: 150 },
                { etq: 'Huevos:', esp: 1 },
                { etq: 'Leche (mL):', esp: 75 },
              ],
            },
            {
              consigna: 'La receta de 6, para 21 porciones',
              ayuda: '21 ÷ 6 = 3,5.',
              campos: [
                { etq: 'Harina (g):', esp: 1050 },
                { etq: 'Huevos:', esp: 7 },
                { etq: 'Leche (mL):', esp: 525 },
              ],
            },
            {
              consigna: 'La receta de 6, para 27 porciones',
              ayuda: '27 ÷ 6 = 4,5.',
              campos: [
                { etq: 'Harina (g):', esp: 1350 },
                { etq: 'Huevos:', esp: 9 },
                { etq: 'Leche (mL):', esp: 675 },
              ],
            },
            {
              consigna: 'La receta de 6, para 36 porciones',
              ayuda: '¡Toda la escuela! ×6.',
              campos: [
                { etq: 'Harina (g):', esp: 1800 },
                { etq: 'Huevos:', esp: 12 },
                { etq: 'Leche (mL):', esp: 900 },
              ],
            },
          ],
        },
      },
      {
        t: 'El costo de la receta',
        et: '🍰 Precios de cocina',
        o: 'Precios y costos de los ingredientes',
        mec: 'entradas',
        frase: 'Cocinar rico también es saber cuánto cuesta.',
        datos: {
          rondas: [
            { consigna: 'Cada huevo cuesta $500 y la receta lleva 4', ayuda: 'Multiplica.', campos: [{ etq: 'Costo de los huevos:', esp: 2000 }] },
            { consigna: 'La harina cuesta $1.200 y la leche $800', ayuda: 'Suma los dos.', campos: [{ etq: 'Costo:', esp: 2000 }] },
            { consigna: 'Se compran 3 bolsas de azúcar a $900 cada una', ayuda: 'El azúcar de la torta.', campos: [{ etq: 'Costo:', esp: 2700 }] },
            {
              consigna: 'La torta lleva 2 huevos a $500 cada uno y 1 bolsa de harina de $1.200',
              ayuda: 'Huevos + harina.',
              campos: [{ etq: 'Costo total:', esp: 2200 }],
            },
            { consigna: 'Para la mermelada se compran 5 manzanas a $400', ayuda: 'Multiplica.', campos: [{ etq: 'Costo:', esp: 2000 }] },
            { consigna: 'El queso cuesta $4.000 y usamos la mitad', ayuda: 'La mitad del precio.', campos: [{ etq: 'Costo de lo usado:', esp: 2000 }] },
            { consigna: 'Se compran 2 litros de leche a $1.500 cada uno', ayuda: 'La leche del mes.', campos: [{ etq: 'Costo:', esp: 3000 }] },
            { consigna: 'La receta completa cuesta $6.000 y salen 6 porciones', ayuda: 'Divide entre las porciones.', campos: [{ etq: 'Costo de cada porción:', esp: 1000 }] },
            { consigna: 'La mantequilla cuesta $1.800 y el chocolate $2.700', ayuda: 'Suma con cuidado.', campos: [{ etq: 'Costo:', esp: 4500 }] },
            { consigna: 'Para el desayuno se compran 4 panes a $600', ayuda: '¡Último costo del día!', campos: [{ etq: 'Costo:', esp: 2400 }] },
          ],
        },
      },
      NIVEL_UBICAR('cocina'),
    ],
  },
  {
    id: 'observatorio',
    nombre: 'Observatorio de Datos',
    mapa: ['Observatorio', 'de Datos'],
    icono: 'm-tele',
    color: '#9B7BFF',
    desc: 'La Edad, El Estrato y las encuestas del salón: tablas, frecuencias y gráficas.',
    niveles: [
      {
        t: 'Lee el pictograma',
        o: 'Cada dibujo vale 1 voto',
        mec: 'opciones',
        frase: 'Las encuestas del salón, en dibujos.',
        datos: {
          rondas: [
            { consigna: '¿Cuántos votos tiene la manzana 🍎?', escena: { tipo: 'picto', args: [['🍎', 3], ['🍌', 2], ['🍪', 4]] }, ops: [2, 3, 4, 5], corr: 3 },
            { consigna: '¿Cuál fue la más votada?', escena: { tipo: 'picto', args: [['🍎', 3], ['🍌', 2], ['🍪', 4]] }, ops: ['🍎 Manzana', '🍌 Banano', '🍪 Galleta'], corr: '🍪 Galleta' },
            { consigna: '¿Cuántos votos hay en TOTAL?', escena: { tipo: 'picto', args: [['🍎', 3], ['🍌', 2], ['🍪', 4]] }, ops: [8, 9, 10, 11], corr: 9 },
            { consigna: '¿Cuántos votos tiene el fútbol ⚽?', escena: { tipo: 'picto', args: [['⚽', 5], ['🏀', 3], ['🎾', 2]] }, ops: [3, 4, 5, 6], corr: 5 },
            { consigna: '¿Cuál fue el menos votado?', escena: { tipo: 'picto', args: [['⚽', 5], ['🏀', 3], ['🎾', 2]] }, ops: ['⚽ Fútbol', '🏀 Baloncesto', '🎾 Tenis'], corr: '🎾 Tenis' },
            { consigna: '¿Cuántos votos hay en TOTAL?', escena: { tipo: 'picto', args: [['⚽', 5], ['🏀', 3], ['🎾', 2]] }, ops: [9, 10, 11, 12], corr: 10 },
            { consigna: '¿Cuántos votos tiene el gato 🐱?', escena: { tipo: 'picto', args: [['🐶', 6], ['🐱', 4], ['🐟', 2]] }, ops: [3, 4, 5, 6], corr: 4 },
            { consigna: '¿Cuál fue la más votada?', escena: { tipo: 'picto', args: [['🐶', 6], ['🐱', 4], ['🐟', 2]] }, ops: ['🐶 Perro', '🐱 Gato', '🐟 Pez'], corr: '🐶 Perro' },
            { consigna: '¿Cuántos votos hay en TOTAL?', escena: { tipo: 'picto', args: [['🐶', 6], ['🐱', 4], ['🐟', 2]] }, ops: [10, 11, 12, 13], corr: 12 },
            { consigna: '¿Cuál fue la menos votada?', escena: { tipo: 'picto', args: [['🐶', 6], ['🐱', 4], ['🐟', 2]] }, ops: ['🐶 Perro', '🐱 Gato', '🐟 Pez'], corr: '🐟 Pez' },
          ],
        },
      },
      {
        t: 'Lee las barras',
        o: 'Interpretar una gráfica de barras',
        mec: 'opciones',
        frase: 'Las encuestas del salón, ahora en barras.',
        datos: {
          rondas: [
            { consigna: '¿Cuántos votos tiene el gato?', escena: { tipo: 'barras', args: [[6, 9, 4], ['Perro', 'Gato', 'Pez']] }, ops: [4, 6, 8, 9], corr: 9 },
            { consigna: '¿Cuál tiene MENOS votos?', escena: { tipo: 'barras', args: [[6, 9, 4], ['Perro', 'Gato', 'Pez']] }, ops: ['Perro', 'Gato', 'Pez'], corr: 'Pez' },
            { consigna: '¿Cuántos votos más tiene el gato que el perro?', escena: { tipo: 'barras', args: [[6, 9, 4], ['Perro', 'Gato', 'Pez']] }, ops: [2, 3, 4, 5], corr: 3 },
            { consigna: '¿Cuántos votos tiene el tenis?', escena: { tipo: 'barras', args: [[5, 8, 3], ['Fútbol', 'Baloncesto', 'Tenis']] }, ops: [3, 5, 6, 8], corr: 3 },
            { consigna: '¿Cuál tiene MÁS votos?', escena: { tipo: 'barras', args: [[5, 8, 3], ['Fútbol', 'Baloncesto', 'Tenis']] }, ops: ['Fútbol', 'Baloncesto', 'Tenis'], corr: 'Baloncesto' },
            { consigna: '¿Cuántos votos más tiene el baloncesto que el tenis?', escena: { tipo: 'barras', args: [[5, 8, 3], ['Fútbol', 'Baloncesto', 'Tenis']] }, ops: [4, 5, 6, 7], corr: 5 },
            { consigna: '¿Cuántos votos tiene el rojo?', escena: { tipo: 'barras', args: [[7, 4, 10], ['Rojo', 'Azul', 'Verde']] }, ops: [4, 7, 9, 10], corr: 7 },
            { consigna: '¿Cuál tiene MÁS votos?', escena: { tipo: 'barras', args: [[7, 4, 10], ['Rojo', 'Azul', 'Verde']] }, ops: ['Rojo', 'Azul', 'Verde'], corr: 'Verde' },
            { consigna: '¿Cuál tiene MENOS votos?', escena: { tipo: 'barras', args: [[7, 4, 10], ['Rojo', 'Azul', 'Verde']] }, ops: ['Rojo', 'Azul', 'Verde'], corr: 'Azul' },
            { consigna: '¿Cuántos votos más tiene el verde que el azul?', escena: { tipo: 'barras', args: [[7, 4, 10], ['Rojo', 'Azul', 'Verde']] }, ops: [5, 6, 7, 8], corr: 6 },
          ],
        },
      },
      {
        t: 'La tabla de frecuencias',
        o: 'fi, total y porcentaje',
        mec: 'entradas',
        frase: 'Como en el proyecto La Edad: la tabla del salón.',
        datos: {
          rondas: [
            {
              consigna: 'Edades → 9 años: 6 · 10 años: 9 · 11 años: 5',
              ayuda: 'Porcentaje: frecuencia ÷ total × 100.',
              escena: { tipo: 'barras', args: [[6, 9, 5], ['9 años', '10 años', '11 años']] },
              campos: [{ etq: 'Total de niños:', esp: 20 }, { etq: '% de 10 años:', esp: 45 }],
            },
            {
              consigna: 'Edades → 9 años: 10 · 10 años: 8 · 11 años: 7',
              ayuda: 'Primero el total.',
              escena: { tipo: 'barras', args: [[10, 8, 7], ['9 años', '10 años', '11 años']] },
              campos: [{ etq: 'Total de niños:', esp: 25 }, { etq: '% de 9 años:', esp: 40 }],
            },
            {
              consigna: 'Mascotas → Perro: 4 · Gato: 3 · Pez: 3',
              ayuda: 'Un grupo pequeño.',
              escena: { tipo: 'barras', args: [[4, 3, 3], ['Perro', 'Gato', 'Pez']] },
              campos: [{ etq: 'Total de niños:', esp: 10 }, { etq: '% de Perro:', esp: 40 }],
            },
            {
              consigna: 'Deportes → Fútbol: 20 · Baloncesto: 15 · Tenis: 15',
              ayuda: 'Todo el colegio votó.',
              escena: { tipo: 'barras', args: [[20, 15, 15], ['Fútbol', 'Baloncesto', 'Tenis']] },
              campos: [{ etq: 'Total de niños:', esp: 50 }, { etq: '% de Fútbol:', esp: 40 }],
            },
            {
              consigna: 'Edades → 9 años: 8 · 10 años: 7 · 11 años: 5',
              ayuda: 'Con calma.',
              escena: { tipo: 'barras', args: [[8, 7, 5], ['9 años', '10 años', '11 años']] },
              campos: [{ etq: 'Total de niños:', esp: 20 }, { etq: '% de 9 años:', esp: 40 }],
            },
            {
              consigna: 'Colores → Rojo: 5 · Azul: 12 · Verde: 8',
              ayuda: 'El azul arrasó.',
              escena: { tipo: 'barras', args: [[5, 12, 8], ['Rojo', 'Azul', 'Verde']] },
              campos: [{ etq: 'Total de niños:', esp: 25 }, { etq: '% de Azul:', esp: 48 }],
            },
            {
              consigna: 'Meriendas → Fruta: 9 · Galletas: 6 · Jugo: 5',
              ayuda: 'Sigue el método.',
              escena: { tipo: 'barras', args: [[9, 6, 5], ['Fruta', 'Galletas', 'Jugo']] },
              campos: [{ etq: 'Total de niños:', esp: 20 }, { etq: '% de Fruta:', esp: 45 }],
            },
            {
              consigna: 'Mascotas → Perro: 2 · Gato: 5 · Pez: 3',
              ayuda: 'Grupo de 10.',
              escena: { tipo: 'barras', args: [[2, 5, 3], ['Perro', 'Gato', 'Pez']] },
              campos: [{ etq: 'Total de niños:', esp: 10 }, { etq: '% de Gato:', esp: 50 }],
            },
            {
              consigna: 'Edades → 9 años: 11 · 10 años: 9 · 11 años: 5',
              ayuda: 'Vas muy bien.',
              escena: { tipo: 'barras', args: [[11, 9, 5], ['9 años', '10 años', '11 años']] },
              campos: [{ etq: 'Total de niños:', esp: 25 }, { etq: '% de 9 años:', esp: 44 }],
            },
            {
              consigna: 'Deportes → Fútbol: 25 · Baloncesto: 15 · Tenis: 10',
              ayuda: '¡Cierre de la encuesta!',
              escena: { tipo: 'barras', args: [[25, 15, 10], ['Fútbol', 'Baloncesto', 'Tenis']] },
              campos: [{ etq: 'Total de niños:', esp: 50 }, { etq: '% de Fútbol:', esp: 50 }],
            },
          ],
        },
      },
      {
        t: 'Cuenta los datos',
        et: '📊 Conteo de datos',
        o: 'Contar y completar los datos de la encuesta',
        mec: 'entradas',
        frase: 'Antes de graficar hay que contar bien los datos.',
        datos: {
          rondas: [
            { consigna: 'En la encuesta votaron 8 niñas y 7 niños', ayuda: 'Suma los dos grupos.', campos: [{ etq: 'Datos en total:', esp: 15 }] },
            { consigna: 'El lunes se registraron 12 datos y el martes 9', ayuda: 'Suma los dos días.', campos: [{ etq: 'Datos en total:', esp: 21 }] },
            { consigna: 'La tabla tiene 3 filas con 5 datos cada una', ayuda: 'Multiplica.', campos: [{ etq: 'Datos en total:', esp: 15 }] },
            { consigna: 'De 20 encuestados, 6 no respondieron', ayuda: 'Resta.', campos: [{ etq: 'Respuestas obtenidas:', esp: 14 }] },
            { consigna: 'Se encuestaron 4 salones con 10 estudiantes cada uno', ayuda: 'Todo el colegio.', campos: [{ etq: 'Datos en total:', esp: 40 }] },
            { consigna: 'La gráfica muestra 7 votos el día 1 y 13 el día 2', ayuda: 'Suma los dos días.', campos: [{ etq: 'Votos en total:', esp: 20 }] },
            { consigna: 'De 25 datos registrados, 5 están repetidos', ayuda: 'Resta los repetidos.', campos: [{ etq: 'Datos distintos:', esp: 20 }] },
            { consigna: 'Se hicieron 2 encuestas con 15 preguntas cada una', ayuda: 'Multiplica.', campos: [{ etq: 'Preguntas en total:', esp: 30 }] },
            { consigna: 'Ya se contaron 22 votos y faltan 8', ayuda: 'El total de la urna.', campos: [{ etq: 'Votos en total:', esp: 30 }] },
            { consigna: 'El registro anotó 6, 9 y 5 datos en tres días', ayuda: '¡Cierre del conteo!', campos: [{ etq: 'Datos en total:', esp: 20 }] },
          ],
        },
      },
      NIVEL_UBICAR('observatorio'),
    ],
  },
  {
    id: 'reloj',
    nombre: 'Reloj de la Nave',
    mapa: ['Reloj de', 'la Nave'],
    icono: 'm-reloj',
    color: '#4FD8CB',
    desc: 'Viaje en el tiempo: la hora, las duraciones y las líneas de tiempo.',
    niveles: [
      {
        t: '¿Qué hora es?',
        o: 'Leer el reloj: en punto y y media',
        mec: 'opciones',
        frase: 'El reloj de la nave marca la hora de la misión.',
        datos: {
          rondas: [
            { consigna: '¿Qué hora marca?', escena: { tipo: 'reloj', args: [3, 0] }, ops: ['3:00', '6:00', '12:15', '9:00'], corr: '3:00' },
            { consigna: '¿Y ahora?', escena: { tipo: 'reloj', args: [7, 30] }, ops: ['6:30', '7:30', '8:30', '7:00'], corr: '7:30' },
            { consigna: '¿Qué hora es?', escena: { tipo: 'reloj', args: [10, 0] }, ops: ['10:00', '2:00', '11:00', '10:30'], corr: '10:00' },
            { consigna: 'Mira las dos agujas', escena: { tipo: 'reloj', args: [1, 30] }, ops: ['1:00', '1:30', '2:30', '12:30'], corr: '1:30' },
            { consigna: '¿Qué hora marca?', escena: { tipo: 'reloj', args: [6, 0] }, ops: ['5:00', '6:00', '7:00', '6:30'], corr: '6:00' },
            { consigna: 'Hora de la merienda', escena: { tipo: 'reloj', args: [9, 30] }, ops: ['9:00', '8:30', '9:30', '10:30'], corr: '9:30' },
            { consigna: '¡Mediodía en la nave!', escena: { tipo: 'reloj', args: [12, 0] }, ops: ['12:00', '6:00', '1:00', '11:00'], corr: '12:00' },
            { consigna: '¿Qué hora es?', escena: { tipo: 'reloj', args: [4, 30] }, ops: ['4:00', '5:30', '4:30', '3:30'], corr: '4:30' },
            { consigna: 'Casi la hora de dormir', escena: { tipo: 'reloj', args: [11, 0] }, ops: ['10:00', '11:00', '12:00', '11:30'], corr: '11:00' },
            { consigna: '¡Última hora!', escena: { tipo: 'reloj', args: [2, 30] }, ops: ['2:00', '3:30', '2:30', '1:30'], corr: '2:30' },
          ],
        },
      },
      {
        t: '¿Cuánto dura?',
        o: 'Duraciones y calendario',
        mec: 'entradas',
        frase: 'Las misiones tienen hora de inicio y de final.',
        datos: {
          rondas: [
            { consigna: 'La clase empieza a las 8:00 y dura 2 horas', ayuda: '¿A qué hora termina?', campos: [{ etq: 'Termina a las:', esp: 10 }] },
            { consigna: 'La película dura 90 minutos', ayuda: 'Pásalo a horas y minutos.', campos: [{ etq: 'Horas:', esp: 1 }, { etq: 'Minutos:', esp: 30 }] },
            { consigna: 'Vas al colegio de lunes a viernes', ayuda: '¿Cuántos días a la semana?', campos: [{ etq: 'Días:', esp: 5 }] },
            { consigna: 'El recreo dura 20 minutos y hay 2 recreos al día', ayuda: 'Suma los dos recreos.', campos: [{ etq: 'Minutos de recreo al día:', esp: 40 }] },
            { consigna: 'Media hora, ¿cuántos minutos es?', ayuda: 'La mitad de una hora.', campos: [{ etq: 'Minutos:', esp: 30 }] },
            { consigna: '2 horas, ¿cuántos minutos son?', ayuda: 'Una hora tiene 60 minutos.', campos: [{ etq: 'Minutos:', esp: 120 }] },
            { consigna: 'La práctica va de 3:00 a 5:00', ayuda: '¿Cuántas horas dura?', campos: [{ etq: 'Horas:', esp: 2 }] },
            { consigna: 'Una película de 2 horas y 15 minutos', ayuda: '¿Cuántos minutos en total?', campos: [{ etq: 'Minutos:', esp: 135 }] },
            { consigna: '45 minutos de tarea + 15 minutos de lectura', ayuda: 'Suma y conviértelo.', campos: [{ etq: 'Minutos:', esp: 60 }, { etq: 'Horas:', esp: 1 }] },
            { consigna: 'Una semana completa', ayuda: '¿Cuántos días tiene?', campos: [{ etq: 'Días:', esp: 7 }] },
          ],
        },
      },
      {
        t: 'Línea de tiempo',
        o: 'Años y edades',
        mec: 'entradas',
        frase: 'Como el proyecto La Edad: tu vida en una línea. Estamos en 2026.',
        datos: {
          rondas: [
            { consigna: 'Sara nació en 2015', ayuda: '¿Cuántos años cumple en 2026?', escena: { tipo: 'linea', args: [[2015, 2026]] }, campos: [{ etq: 'Años:', esp: 11 }] },
            { consigna: 'Su abuela nació en 1966', ayuda: '¿Cuántos años cumple en 2026?', campos: [{ etq: 'Años:', esp: 60 }] },
            { consigna: 'El colegio cumplirá 50 años en 2030', ayuda: '¿Cuántos años faltan desde 2026?', campos: [{ etq: 'Faltan:', esp: 4 }] },
            { consigna: 'Papá nació en 2000', ayuda: '¿Cuántos años cumple en 2026?', campos: [{ etq: 'Años:', esp: 26 }] },
            { consigna: 'La profe nació en 1990', ayuda: '¿Cuántos años cumple en 2026?', campos: [{ etq: 'Años:', esp: 36 }] },
            { consigna: 'Tu hermanito nació en 2020', ayuda: '¿Cuántos años cumple en 2026?', escena: { tipo: 'linea', args: [[2020, 2026]] }, campos: [{ etq: 'Años:', esp: 6 }] },
            { consigna: 'Un cohete se lanzará en 2050', ayuda: '¿Cuántos años faltan desde 2026?', campos: [{ etq: 'Faltan:', esp: 24 }] },
            { consigna: 'El abuelo nació en 1976', ayuda: '¿Cuántos años cumple en 2026?', campos: [{ etq: 'Años:', esp: 50 }] },
            { consigna: 'Tu prima nació en 2008', ayuda: '¿Cuántos años cumple en 2026?', campos: [{ etq: 'Años:', esp: 18 }] },
            { consigna: 'La bisabuela nació en 1946', ayuda: '¡80 años de historia! Compruébalo.', campos: [{ etq: 'Años:', esp: 80 }] },
          ],
        },
      },
      {
        t: 'El tiempo vuela',
        et: '🕐 El tiempo vuela',
        o: 'Convertir días, horas y minutos',
        mec: 'entradas',
        frase: 'En la nave el tiempo vuela: ¡aprende a convertirlo!',
        datos: {
          rondas: [
            { consigna: '2 días, ¿cuántas horas son?', ayuda: 'Un día tiene 24 horas.', campos: [{ etq: 'Horas:', esp: 48 }] },
            { consigna: '3 semanas, ¿cuántos días son?', ayuda: 'Una semana tiene 7 días.', campos: [{ etq: 'Días:', esp: 21 }] },
            { consigna: 'Medio día, ¿cuántas horas son?', ayuda: 'La mitad de 24.', campos: [{ etq: 'Horas:', esp: 12 }] },
            { consigna: '1 hora y media, ¿cuántos minutos son?', ayuda: '60 + 30.', campos: [{ etq: 'Minutos:', esp: 90 }] },
            { consigna: 'Un año, ¿cuántos meses tiene?', ayuda: 'Piensa en el calendario.', campos: [{ etq: 'Meses:', esp: 12 }] },
            { consigna: 'El vuelo sale a las 9:00 y dura 2 horas', ayuda: '¿A qué hora llega?', campos: [{ etq: 'Llega a las:', esp: 11 }] },
            { consigna: '4 horas, ¿cuántos minutos son?', ayuda: '4 × 60.', campos: [{ etq: 'Minutos:', esp: 240 }] },
            { consigna: 'Un día completo, ¿cuántas horas tiene?', ayuda: 'De medianoche a medianoche.', campos: [{ etq: 'Horas:', esp: 24 }] },
            { consigna: '2 semanas y 3 días, ¿cuántos días en total?', ayuda: '14 + 3.', campos: [{ etq: 'Días:', esp: 17 }] },
            { consigna: 'El cohete despega a las 6:00 y vuela 5 horas', ayuda: '¡Aterrizaje final!', campos: [{ etq: 'Aterriza a las:', esp: 11 }] },
          ],
        },
      },
      NIVEL_UBICAR('reloj'),
    ],
  },
];

export const JUEGOS_ZONA: JuegoZona[] = [
  {
    id: 'carrera-cosmica',
    archivo: '/estacion/carrera-cosmica_2.html',
    emoji: '🚀',
    nombre: 'Carrera Cósmica',
    desc: 'Pseudo-3D de velocidad: cada cálculo impulsa tu cohete contra 3 rivales.',
    final: 'carrera_terminada',
  },
  {
    id: 'atiende-la-tienda',
    archivo: '/estacion/atiende-la-tienda_1.html',
    emoji: '🛒',
    nombre: '¡Atiende la Tienda!',
    desc: 'Cobra la cuenta y da el cambio antes de que el cliente pierda la paciencia.',
    final: 'dia_terminado',
  },
  {
    id: 'cosecha-total',
    archivo: '/estacion/cosecha-total_1.html',
    emoji: '🌱',
    nombre: 'Cosecha Total',
    desc: 'Siembra, riega los mL exactos y llena el camión del Comando.',
    final: 'jornada_terminada',
  },
  {
    id: 'torre-de-bloques',
    archivo: '/estacion/torre-de-bloques_3.html',
    emoji: '🧱',
    nombre: 'Torre de Bloques',
    desc: 'La grúa baja cada capa que calcules bien. Pirámides para expertos.',
    final: 'obra_terminada',
  },
  {
    id: 'parques-estelar',
    archivo: '/estacion/parques-estelar_1.html',
    emoji: '🎲',
    nombre: 'Parqués Estelar',
    desc: 'Tablero 3D contra Fedor-bot: dados de verdad y casillas especiales.',
    final: 'partida_terminada',
  },
];

export const COLOR_DINERO: Record<number, string> = {
  50: '#E6C88A',
  100: '#E6C88A',
  200: '#D9D2C4',
  500: '#D9D2C4',
  1000: '#E8B96B',
  2000: '#B7D6EC',
  5000: '#F5C6C0',
  10000: '#C9E4C5',
  20000: '#D9C8EA',
  50000: '#F2D9A8',
};

export const POS: Array<[number, number]> = [
  [500, 88],
  [798, 112],
  [905, 300],
  [778, 486],
  [500, 492],
  [222, 486],
  [95, 300],
  [202, 112],
];

export const pesos = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');
export const esBillete = (v: number) => v >= 2000;
