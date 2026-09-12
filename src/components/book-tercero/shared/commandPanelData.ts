// src/components/book-tercero/shared/commandPanelData.ts
// Datos completos para los modales del Panel de Comando (Grado 3°)

export interface ShopItem3ro {
  id: string;
  cat: 'casco' | 'traje' | 'mascota' | 'nave';
  emoji: string;
  name: string;
  price: number;
  avatar: string | null;
  unlockXP: number;
  desc: string;
}

export const SHOP_ITEMS_3RO: ShopItem3ro[] = [
  // CASCOS
    {id:'helm_basic', cat:'casco', emoji:'🪖', name:'Casco básico',     price:0,    avatar:'🧑‍🚀', unlockXP:0,    desc:'Tu casco de cadete. Ya lo tienes.'},
    {id:'helm_orange',cat:'casco', emoji:'🟠', name:'Casco naranja',    price:80,   avatar:'👨‍🚀', unlockXP:0,    desc:'Brilla bajo el sol de cualquier planeta.'},
    {id:'helm_pink',  cat:'casco', emoji:'🎀', name:'Casco rosa',       price:80,   avatar:'👩‍🚀', unlockXP:0,    desc:'Para exploradoras estelares.'},
    {id:'helm_gold',  cat:'casco', emoji:'👑', name:'Casco dorado',     price:300,  avatar:'🤴',          unlockXP:300,  desc:'Reservado a astronautas con +300 XP.'},
    // TRAJES
    {id:'suit_ninja', cat:'traje', emoji:'🥷', name:'Traje ninja',      price:200,  avatar:'🥷',          unlockXP:100,  desc:'Sigiloso entre asteroides.'},
    {id:'suit_super', cat:'traje', emoji:'🦸', name:'Traje súper',      price:250,  avatar:'🦸',          unlockXP:150,  desc:'Vuelas más rápido entre planetas.'},
    {id:'suit_wiz',   cat:'traje', emoji:'🧙', name:'Traje mago',       price:300,  avatar:'🧙',          unlockXP:200,  desc:'Convierte ejercicios difíciles en chocolatinas.'},
    {id:'suit_robot', cat:'traje', emoji:'🤖', name:'Traje robot',      price:400,  avatar:'🤖',          unlockXP:300,  desc:'Reflejos de máquina, mente humana.'},
    // MASCOTAS
    {id:'pet_dog',    cat:'mascota', emoji:'🐕', name:'Perro espacial', price:120,  avatar:null,          unlockXP:50,   desc:'Te ladra cuando aciertas. ¡Buen chico!'},
    {id:'pet_cat',    cat:'mascota', emoji:'🐈', name:'Gato cósmico',   price:120,  avatar:null,          unlockXP:50,   desc:'Maúlla en código binario.'},
    {id:'pet_dragon', cat:'mascota', emoji:'🐉', name:'Dragón estelar', price:500,  avatar:null,          unlockXP:500,  desc:'Una mascota legendaria. Solo para maestros.'},
    {id:'pet_unicorn',cat:'mascota', emoji:'🦄', name:'Unicornio',      price:600,  avatar:null,          unlockXP:600,  desc:'¡Magia matemática garantizada!'},
    // NAVES
    {id:'ship_basic', cat:'nave', emoji:'🚀', name:'Cohete cadete',     price:0,    avatar:null,          unlockXP:0,    desc:'Tu primera nave. Pequeña pero veloz.'},
    {id:'ship_ufo',   cat:'nave', emoji:'🛸', name:'OVNI',              price:350,  avatar:null,          unlockXP:200,  desc:'Tecnología de otro mundo.'},
    {id:'ship_sat',   cat:'nave', emoji:'🛰️', name:'Satélite Fedor',    price:450,  avatar:null,          unlockXP:400,  desc:'Captura señales de las matemáticas del universo.'},
  ];

export interface ShopV2Item3ro {
  id: string;
  cat: 'avatar' | 'mascota' | 'fondo' | 'power' | 'access';
  emoji: string;
  name: string;
  price: number;
}

export const SHOP_V2_ITEMS_3RO: ShopV2Item3ro[] = [
  // Avatares (personajes 3°)
  { id: 'av_numerix',   cat: 'avatar',  emoji: '🧙‍♂️', name: 'Numerix el Mago', price: 200 },
  { id: 'av_sumalia',   cat: 'avatar',  emoji: '🧝‍♀️', name: 'Sumalia la Hada', price: 250 },
  { id: 'av_reston',    cat: 'avatar',  emoji: '🦸',   name: 'Restón Veloz', price: 200 },
  { id: 'av_multiplex', cat: 'avatar',  emoji: '🤖',   name: 'Multiplex 3000', price: 280 },
  { id: 'av_divisor',   cat: 'avatar',  emoji: '🦸‍♀️', name: 'Divisora Mágica', price: 280 },
  { id: 'av_ninja',     cat: 'avatar',  emoji: '🥷',   name: 'Niño Ninja', price: 320 },
  { id: 'av_astro2',    cat: 'avatar',  emoji: '👨‍🚀', name: 'Astronauta Pro', price: 300 },
  { id: 'av_dragoncito',cat: 'avatar',  emoji: '🐲',   name: 'Dragoncito Negoran', price: 400 },
  { id: 'av_principe',  cat: 'avatar',  emoji: '🤴',   name: 'Príncipe del Cálculo', price: 350 },
  { id: 'av_princesa',  cat: 'avatar',  emoji: '👸',   name: 'Princesa Matemática', price: 350 },
  // Mascotas
  { id: 'pet_unicorn',  cat: 'mascota', emoji: '🦄',   name: 'Unicornio Brillante', price: 450 },
  { id: 'pet_dragon',   cat: 'mascota', emoji: '🐉',   name: 'Dragón de Fuego', price: 500 },
  { id: 'pet_oso',      cat: 'mascota', emoji: '🐻',   name: 'Oso Calculín', price: 380 },
  { id: 'pet_pulpo',    cat: 'mascota', emoji: '🐙',   name: 'Pulpo 8-brazos', price: 420 },
  { id: 'pet_buho',     cat: 'mascota', emoji: '🦉',   name: 'Búho Sabio', price: 360 },
  { id: 'pet_robot',    cat: 'mascota', emoji: '🤖',   name: 'Robot Suma 9000', price: 550 },
  // Fondos del universo
  { id: 'bg_nebula',    cat: 'fondo',   emoji: '🌌',   name: 'Nebulosa Violeta', price: 300 },
  { id: 'bg_galaxy',    cat: 'fondo',   emoji: '🌠',   name: 'Galaxia Espiral', price: 350 },
  { id: 'bg_meteor',    cat: 'fondo',   emoji: '☄️',   name: 'Lluvia de Meteoros', price: 400 },
  { id: 'bg_planet',    cat: 'fondo',   emoji: '🪐',   name: 'Planeta de Anillos', price: 350 },
  { id: 'bg_sunset',    cat: 'fondo',   emoji: '🌅',   name: 'Atardecer Cósmico', price: 280 },
  // Power-ups
  { id: 'pw_50',        cat: 'power',   emoji: '🎯',   name: '50/50 (×3)', price: 100 },
  { id: 'pw_hint',      cat: 'power',   emoji: '💡',   name: 'Pista Extra (×3)', price: 80 },
  { id: 'pw_doublecoin',cat: 'power',   emoji: '💰',   name: 'Monedas ×2 (1 nivel)', price: 150 },
  { id: 'pw_time',      cat: 'power',   emoji: '⏰',   name: '+15s de tiempo', price: 120 },
  { id: 'pw_shield',    cat: 'power',   emoji: '🛡️',   name: 'Escudo (1 error gratis)', price: 140 },
  // Accesorios
  { id: 'ac_corona',    cat: 'access',  emoji: '👑',   name: 'Corona Real', price: 600 },
  { id: 'ac_gafas',     cat: 'access',  emoji: '🕶️',   name: 'Gafas Cool', price: 180 },
  { id: 'ac_capa',      cat: 'access',  emoji: '🦹',   name: 'Capa de Héroe', price: 240 },
  { id: 'ac_medalla',   cat: 'access',  emoji: '🏅',   name: 'Medalla Dorada', price: 320 },
  { id: 'ac_estrella',  cat: 'access',  emoji: '⭐',   name: 'Estrella en la frente', price: 260 },
];


export interface StickerItem3ro {
  id: string;
  e: string;
  name: string;
}

export const STICKERS_3RO: StickerItem3ro[] = [
  {id:'st_dragon',  e:'🐲', name:'Dragoncito Negoran'},
    {id:'st_unicor',  e:'🦄', name:'Unicornio Brillante'},
    {id:'st_buho',    e:'🦉', name:'Búho Sabio'},
    {id:'st_robot',   e:'🤖', name:'Robot Sumador'},
    {id:'st_corona',  e:'👑', name:'Corona del Saber'},
    {id:'st_estrella',e:'🌟', name:'Estrella Dorada'},
    {id:'st_mago',    e:'🧙', name:'Mago Numerix'},
    {id:'st_principe',e:'🤴', name:'Príncipe Calculín'},
    {id:'st_pirata',  e:'🏴‍☠️', name:'Pirata del Número'},
    {id:'st_astro',   e:'👨‍🚀', name:'Astronauta de las Cuentas'},
    {id:'st_dinos',   e:'🦕', name:'Dino Calculador'},
    {id:'st_arcoiris',e:'🌈', name:'Arcoíris Mágico'},
    {id:'st_cohete',  e:'🚀', name:'Cohete del Saber'},
    {id:'st_planeta', e:'🪐', name:'Planeta Anillado'},
    {id:'st_galaxy',  e:'🌌', name:'Galaxia Espiral'},
    {id:'st_medall',  e:'🏅', name:'Medalla Dorada'},
    {id:'st_trofeo',  e:'🏆', name:'Trofeo Mayor'},
    {id:'st_pizza',   e:'🍕', name:'Pizza de Premio'},
    {id:'st_torta',   e:'🍰', name:'Torta de Fiesta'},
    {id:'st_helado',  e:'🍦', name:'Helado Galáctico'},
];

export interface EstCardItem {
  h: string;
  items?: string[];
  niveles?: boolean;
  niv?: Array<{ t: string; c: string; d: string }>;
}

export interface EstThoughtItem {
  title: string;
  cards: EstCardItem[];
}

export const EST_DATA_3RO: Record<string, EstThoughtItem> = {
  num:{
        title:'🔢 Pensamiento Numérico y Sistemas Numéricos',
        cards:[
          {
            h:'📌 Estándar MEN',
            items:['Uso representaciones del sistema decimal (unidades, decenas, centenas, miles) y comprendo su valor posicional.',
              'Propongo y desarrollo estrategias para la adición y sustracción de números naturales.',
              'Establezco relaciones entre las operaciones de multiplicación y división y sus propiedades.',
              'Reconozco y uso fracciones como representación de partes de un todo y de situaciones cotidianas.',
              'Formulo y resuelvo problemas con las cuatro operaciones básicas en contextos reales.']
          },
          {
            h:'🧠 Competencias',
            items:['<b>Comunicación:</b> Describe y representa números con material concreto y simbólico.',
              '<b>Razonamiento:</b> Justifica procedimientos de adición, sustracción y multiplicación.',
              '<b>Resolución de problemas:</b> Elige la operación adecuada según la situación problema.',
              '<b>Modelación:</b> Usa modelos concretos (base-10, recta numérica, ábaco) para operar.',
              '<b>Conexión:</b> Relaciona las operaciones con situaciones de la vida diaria.']
          },
          {
            h:'📗 DBA (Derechos Básicos de Aprendizaje v2)',
            items:['DBA 1 — Reconoce el valor posicional de los dígitos en números hasta 9 999.',
              'DBA 2 — Resuelve adiciones y sustracciones con números hasta 9 999.',
              'DBA 3 — Comprende la multiplicación como adición repetida y usa las tablas del 1 al 10.',
              'DBA 4 — Identifica fracciones simples (mitad, tercio, cuarto) como partes de un entero.',
              'DBA 5 — Formula y resuelve problemas con las operaciones básicas.']
          },
          {
            h:'📊 Niveles de Desempeño',
            niveles:true,
            niv:[
              {t:'Bajo',c:'niv-bajo',d:'Reconoce números hasta 999. Realiza adiciones y sustracciones sin reagrupación con apoyo visual.'},
              {t:'Básico',c:'niv-bas',d:'Lee y escribe números hasta 9 999. Suma y resta con reagrupación. Multiplica por las tablas del 2 y 5.'},
              {t:'Alto',c:'niv-alt',d:'Opera con números hasta 9 999. Comprende propiedades de la multiplicación. Representa fracciones.'},
              {t:'Superior',c:'niv-sup',d:'Resuelve problemas multi-paso. Relaciona fracciones con situaciones reales. Explica procedimientos.'}
            ]
          }
        ]
      },
      geo:{
        title:'📐 Pensamiento Espacial y Sistemas Geométricos',
        cards:[
          {
            h:'📌 Estándar MEN',
            items:['Identifico y describo características de figuras planas (triángulos, cuadriláteros, círculos) y cuerpos sólidos.',
              'Reconozco y aplico transformaciones básicas (traslación, reflexión, rotación) en el plano.',
              'Uso sistemas de referencia para describir la ubicación de objetos en el espacio.',
              'Relaciono figuras geométricas con objetos del entorno.']
          },
          {
            h:'🧠 Competencias',
            items:['<b>Comunicación:</b> Describe figuras geométricas usando vocabulario correcto (lados, vértices, ángulos).',
              '<b>Razonamiento:</b> Clasifica figuras según sus propiedades y justifica la clasificación.',
              '<b>Modelación:</b> Construye modelos de figuras con material concreto y en cuadrícula.',
              '<b>Resolución de problemas:</b> Aplica propiedades geométricas para resolver situaciones.']
          },
          {
            h:'📗 DBA',
            items:['DBA 1 — Distingue y describe las características de figuras planas y cuerpos en 3D.',
              'DBA 2 — Usa conceptos de paralelismo y perpendicularidad en figuras planas.',
              'DBA 3 — Identifica ejes de simetría en figuras del plano.',
              'DBA 4 — Describe la ubicación de objetos en el plano cartesiano usando coordenadas.']
          },
          {
            h:'📊 Niveles de Desempeño',
            niveles:true,
            niv:[
              {t:'Bajo',c:'niv-bajo',d:'Identifica círculo, cuadrado y triángulo. Nombra algunos cuerpos sólidos con apoyo.'},
              {t:'Básico',c:'niv-bas',d:'Clasifica polígonos por número de lados. Distingue figuras planas de cuerpos sólidos.'},
              {t:'Alto',c:'niv-alt',d:'Reconoce propiedades de figuras. Identifica ejes de simetría. Ubica puntos en una cuadrícula.'},
              {t:'Superior',c:'niv-sup',d:'Relaciona figuras con objetos reales. Construye figuras con propiedades dadas. Justifica clasificaciones.'}
            ]
          }
        ]
      },
      met:{
        title:'📏 Pensamiento Métrico y Sistemas de Medida',
        cards:[
          {
            h:'📌 Estándar MEN',
            items:['Comparo y ordeno objetos según longitud, masa y capacidad usando unidades no convencionales y convencionales.',
              'Uso el sistema métrico decimal (centímetros, metros, kilómetros; gramos, kilogramos; mililitros, litros).',
              'Estimo y verifico medidas de longitud, área, masa y capacidad.',
              'Leo y uso el reloj (horas, minutos) y el calendario en contextos cotidianos.',
              'Calculo el perímetro de figuras planas regulares.']
          },
          {
            h:'🧠 Competencias',
            items:['<b>Comunicación:</b> Expresa medidas en unidades apropiadas del sistema métrico.',
              '<b>Razonamiento:</b> Justifica la elección de la unidad de medida según el objeto.',
              '<b>Modelación:</b> Usa instrumentos de medida (regla, balanza, recipiente) correctamente.',
              '<b>Resolución de problemas:</b> Resuelve situaciones de conversión entre unidades sencillas.']
          },
          {
            h:'📗 DBA',
            items:['DBA 1 — Establece relaciones entre unidades de medida (cm/m, g/kg, mL/L).',
              'DBA 2 — Estima y mide longitudes con centímetros y metros.',
              'DBA 3 — Lee la hora en relojes analógicos y digitales (horas y minutos).',
              'DBA 4 — Calcula el perímetro sumando los lados de figuras regulares.']
          },
          {
            h:'📊 Niveles de Desempeño',
            niveles:true,
            niv:[
              {t:'Bajo',c:'niv-bajo',d:'Compara longitudes directamente. Reconoce metro y centímetro sin operar con ellos.'},
              {t:'Básico',c:'niv-bas',d:'Mide con regla. Convierte cm a m en casos simples. Lee la hora en horas exactas.'},
              {t:'Alto',c:'niv-alt',d:'Convierte entre unidades. Lee hora en minutos. Calcula perímetro de rectángulos.'},
              {t:'Superior',c:'niv-sup',d:'Estima medidas con precisión. Resuelve problemas de medición. Explica conversiones.'}
            ]
          }
        ]
      },
      est:{
        title:'📊 Pensamiento Aleatorio y Sistemas de Datos',
        cards:[
          {
            h:'📌 Estándar MEN',
            items:['Clasifico y organizo datos de experimentos sencillos y de situaciones cotidianas.',
              'Represento datos en gráficas de barras, pictogramas y tablas de frecuencia.',
              'Interpreto y comparo información presentada en distintos tipos de representación.',
              'Identifico la posibilidad de ocurrencia de eventos cotidianos (probable, poco probable, imposible).']
          },
          {
            h:'🧠 Competencias',
            items:['<b>Comunicación:</b> Lee e interpreta datos de gráficas y tablas.',
              '<b>Razonamiento:</b> Compara frecuencias y saca conclusiones de los datos.',
              '<b>Modelación:</b> Construye tablas de datos y gráficas de barras correctamente.',
              '<b>Resolución de problemas:</b> Responde preguntas a partir de conjuntos de datos organizados.']
          },
          {
            h:'📗 DBA',
            items:['DBA 1 — Recoge, organiza y representa datos en tablas de frecuencia y gráficas de barras.',
              'DBA 2 — Interpreta y compara información en gráficas de barras y pictogramas.',
              'DBA 3 — Identifica la moda en conjuntos de datos.',
              'DBA 4 — Describe la probabilidad de eventos como probable, imposible o seguro.']
          },
          {
            h:'📊 Niveles de Desempeño',
            niveles:true,
            niv:[
              {t:'Bajo',c:'niv-bajo',d:'Lee pictogramas simples. Clasifica objetos con un criterio dado por el docente.'},
              {t:'Básico',c:'niv-bas',d:'Construye tablas de frecuencia y gráficas de barras con datos dados.'},
              {t:'Alto',c:'niv-alt',d:'Interpreta gráficas e identifica la moda. Explica diferencias entre datos.'},
              {t:'Superior',c:'niv-sup',d:'Diseña experimentos, recoge datos y los representa. Predice resultados y los justifica.'}
            ]
          }
        ]
      },
      var:{
        title:'🔣 Pensamiento Variacional y Sistemas Algebraicos',
        cards:[
          {
            h:'📌 Estándar MEN',
            items:['Identifico y describo regularidades y patrones en secuencias numéricas y geométricas.',
              'Uso letras o símbolos para representar una cantidad desconocida en situaciones sencillas.',
              'Establezco y justifico relaciones de orden y equivalencia entre expresiones numéricas.',
              'Describo situaciones de cambio usando representaciones de entrada-salida.']
          },
          {
            h:'🧠 Competencias',
            items:['<b>Comunicación:</b> Describe patrones con palabras, dibujos o expresiones numéricas.',
              '<b>Razonamiento:</b> Generaliza la regla de un patrón y la aplica para predecir términos.',
              '<b>Modelación:</b> Representa situaciones de cambio en tablas de valores.',
              '<b>Resolución de problemas:</b> Determina valores desconocidos en ecuaciones simples (□ + 3 = 7).']
          },
          {
            h:'📗 DBA',
            items:['DBA 1 — Identifica la regla de formación de patrones numéricos y geométricos.',
              'DBA 2 — Predice términos siguientes en una secuencia.',
              'DBA 3 — Encuentra el valor de la incógnita en igualdades como □ + 5 = 12.',
              'DBA 4 — Representa situaciones de variación en tablas de dos entradas.']
          },
          {
            h:'📊 Niveles de Desempeño',
            niveles:true,
            niv:[
              {t:'Bajo',c:'niv-bajo',d:'Continúa patrones dados con apoyo visual. Identifica el elemento siguiente en una secuencia simple.'},
              {t:'Básico',c:'niv-bas',d:'Describe la regla de un patrón numérico de 1 operación. Completa igualdades simples.'},
              {t:'Alto',c:'niv-alt',d:'Genera patrones propios y explica la regla. Representa variación en tablas.'},
              {t:'Superior',c:'niv-sup',d:'Crea y justifica patrones complejos. Resuelve ecuaciones con incógnita y explica el proceso.'}
            ]
          }
        ]
      }
};

export interface DefTermItem {
  t: string;
  d: string;
  ex?: string;
}

export interface DefGroupItem {
  name: string;
  items: DefTermItem[];
}

export interface DefCategoryItem {
  title: string;
  grupos: DefGroupItem[];
}

export const DEF_DATA_3RO: Record<string, DefCategoryItem> = {
  adi:{
        title:'➕ Adición (Suma)',
        grupos:[
          {name:'Términos de la Adición',items:[
            {t:'Adición',d:'Operación matemática que une dos o más cantidades para obtener un total.',ex:'3 + 4 = 7'},
            {t:'Sumandos',d:'Los números que se suman en una adición.',ex:'En 8+5, los sumandos son 8 y 5'},
            {t:'Suma / Total',d:'El resultado de sumar todos los sumandos.',ex:'8 + 5 = 13 → 13 es la suma'},
            {t:'Adición con reagrupación',d:'Cuando la suma de una columna supera 9 y se lleva una unidad a la siguiente posición.',ex:'27 + 15 = 42 (7+5=12, escribo 2 llevo 1)'},
          ]},
          {name:'Propiedades de la Adición',items:[
            {t:'Propiedad conmutativa',d:'El orden de los sumandos no cambia la suma.',ex:'4 + 6 = 6 + 4 = 10'},
            {t:'Propiedad asociativa',d:'Al agrupar sumandos de diferente forma, el resultado no cambia.',ex:'(2+3)+5 = 2+(3+5) = 10'},
            {t:'Propiedad del elemento neutro',d:'Sumar cero a cualquier número no cambia su valor.',ex:'9 + 0 = 9'},
          ]},
          {name:'Conceptos Relacionados',items:[
            {t:'Números naturales',d:'Números enteros positivos que usamos para contar: 0, 1, 2, 3, …',ex:'0, 1, 2, 3, 4, 5…'},
            {t:'Número cardinal',d:'Indica la cantidad total de elementos en un conjunto.',ex:'🍎🍎🍎 → cardinal = 3'},
            {t:'Mayor, menor e igual',d:'Relaciones de orden entre números. Se usan los símbolos >, < e =.',ex:'8 > 5 · 3 < 7 · 6 = 6'},
          ]},
        ]
      },
      sus:{
        title:'➖ Sustracción (Resta)',
        grupos:[
          {name:'Términos de la Sustracción',items:[
            {t:'Sustracción',d:'Operación que encuentra la diferencia entre dos números o quita una cantidad a otra.',ex:'15 - 8 = 7'},
            {t:'Minuendo',d:'El número del que se resta (el mayor en sustracciones simples).',ex:'En 15-8, el minuendo es 15'},
            {t:'Sustraendo',d:'El número que se resta.',ex:'En 15-8, el sustraendo es 8'},
            {t:'Diferencia / Resto',d:'El resultado de la sustracción.',ex:'15 - 8 = 7 → 7 es la diferencia'},
            {t:'Préstamo / Reagrupación',d:'Cuando el dígito del minuendo es menor que el del sustraendo, se toma una unidad del siguiente valor posicional.',ex:'43-17: en unidades 3<7, se presta 1 decena → 13-7=6'},
          ]},
          {name:'Propiedades',items:[
            {t:'No conmutativa',d:'El orden importa: a - b ≠ b - a (en general).',ex:'9 - 3 = 6 ≠ 3 - 9'},
            {t:'Elemento neutro',d:'Restar cero no cambia el número.',ex:'12 - 0 = 12'},
            {t:'Verificación',d:'Para comprobar una resta, sumas el sustraendo y la diferencia; deben dar el minuendo.',ex:'15-8=7 → 7+8=15 ✓'},
          ]},
        ]
      },
      mul:{
        title:'✖️ Multiplicación',
        grupos:[
          {name:'Términos de la Multiplicación',items:[
            {t:'Multiplicación',d:'Operación que suma un número repetidas veces.',ex:'4 × 3 = 4+4+4 = 12'},
            {t:'Factores',d:'Los números que se multiplican.',ex:'En 4×3, los factores son 4 y 3'},
            {t:'Producto',d:'El resultado de multiplicar los factores.',ex:'4 × 3 = 12 → 12 es el producto'},
            {t:'Multiplicando',d:'El número que se repite (primer factor).',ex:'En 5×4, el multiplicando es 5'},
            {t:'Multiplicador',d:'Las veces que se repite (segundo factor).',ex:'En 5×4, el multiplicador es 4'},
            {t:'Tabla de multiplicar',d:'Lista organizada de los productos de un número del 1 al 10.',ex:'Tabla del 7: 7,14,21,28,35…'},
          ]},
          {name:'Propiedades de la Multiplicación',items:[
            {t:'Propiedad conmutativa',d:'El orden de los factores no altera el producto.',ex:'6 × 4 = 4 × 6 = 24'},
            {t:'Propiedad asociativa',d:'Al reagrupar los factores el resultado no cambia.',ex:'(2×3)×4 = 2×(3×4) = 24'},
            {t:'Elemento neutro',d:'Multiplicar por 1 no cambia el valor.',ex:'9 × 1 = 9'},
            {t:'Propiedad del cero',d:'Cualquier número multiplicado por 0 es 0.',ex:'7 × 0 = 0'},
            {t:'Propiedad distributiva',d:'La multiplicación se distribuye sobre la suma o resta.',ex:'3×(4+2) = 3×4 + 3×2 = 18'},
          ]},
        ]
      },
      div:{
        title:'➗ División',
        grupos:[
          {name:'Términos de la División',items:[
            {t:'División',d:'Operación que reparte una cantidad en partes iguales o indica cuántas veces cabe un número en otro.',ex:'20 ÷ 4 = 5'},
            {t:'Dividendo',d:'El número que se divide (el que se reparte).',ex:'En 20÷4, el dividendo es 20'},
            {t:'Divisor',d:'El número por el que se divide (el tamaño de cada parte).',ex:'En 20÷4, el divisor es 4'},
            {t:'Cociente',d:'El resultado de la división.',ex:'20 ÷ 4 = 5 → 5 es el cociente'},
            {t:'Residuo / Resto',d:'Lo que sobra cuando la división no es exacta.',ex:'22 ÷ 4 = 5, residuo 2'},
            {t:'División exacta',d:'Cuando el residuo es cero.',ex:'20 ÷ 4 = 5, residuo 0 ✓'},
          ]},
          {name:'Propiedades y Verificación',items:[
            {t:'No conmutativa',d:'El orden del dividendo y divisor importa.',ex:'12÷3 = 4 ≠ 3÷12'},
            {t:'Verificación',d:'Cociente × Divisor + Residuo = Dividendo.',ex:'23÷5: 4×5+3=23 ✓'},
            {t:'Relación con multiplicación',d:'La división es la operación inversa de la multiplicación.',ex:'Si 6×3=18, entonces 18÷3=6'},
          ]},
        ]
      },
      num:{
        title:'🔢 Números Naturales y Sistema Decimal',
        grupos:[
          {name:'Sistema de Numeración',items:[
            {t:'Sistema decimal',d:'Sistema de numeración en base 10 con 10 símbolos (0-9).',ex:'0,1,2,3,4,5,6,7,8,9'},
            {t:'Valor posicional',d:'El valor de un dígito depende de su posición en el número.',ex:'En 3 472: 3=miles, 4=centenas, 7=decenas, 2=unidades'},
            {t:'Unidad (U)',d:'Posición de los números del 1 al 9.',ex:'En 258, el 8 está en unidades'},
            {t:'Decena (D)',d:'Grupo de 10 unidades.',ex:'En 258, el 5 representa 5 decenas = 50'},
            {t:'Centena (C)',d:'Grupo de 100 unidades (10 decenas).',ex:'En 258, el 2 representa 2 centenas = 200'},
            {t:'Millar (M)',d:'Grupo de 1 000 unidades.',ex:'3 500 = 3 millares y 5 centenas'},
          ]},
          {name:'Comparación y Orden',items:[
            {t:'Mayor que (>)',d:'Indica que el primer número es más grande.',ex:'754 > 748'},
            {t:'Menor que (<)',d:'Indica que el primer número es más pequeño.',ex:'312 < 320'},
            {t:'Igual que (=)',d:'Los dos números tienen el mismo valor.',ex:'500 = 500'},
            {t:'Número ordinal',d:'Indica la posición de un elemento en una secuencia.',ex:'primero, segundo, tercero…'},
            {t:'Redondeo',d:'Aproximar un número a la decena, centena o millar más cercana.',ex:'347 ≈ 350 (decena) ≈ 300 (centena)'},
          ]},
        ]
      },
      geo:{
        title:'📐 Geometría',
        grupos:[
          {name:'Figuras Planas (2D)',items:[
            {t:'Polígono',d:'Figura plana cerrada formada por segmentos rectos.',ex:'triángulo, cuadrado, pentágono'},
            {t:'Triángulo',d:'Polígono con 3 lados y 3 ángulos.',ex:'🔺 — 3 lados, 3 vértices'},
            {t:'Cuadrilátero',d:'Polígono con 4 lados: cuadrado, rectángulo, rombo, trapecio.',ex:'⬜ cuadrado — 4 lados iguales'},
            {t:'Pentágono',d:'Polígono con 5 lados.',ex:'⬠ — 5 lados, 5 ángulos'},
            {t:'Hexágono',d:'Polígono con 6 lados.',ex:'⬡ — como las celdas de un panal'},
            {t:'Círculo',d:'Figura plana curva cuyos puntos están a igual distancia del centro.',ex:'⭕ — radio, diámetro, circunferencia'},
            {t:'Perímetro',d:'Suma de todos los lados de una figura.',ex:'Cuadrado de 5cm: P = 4×5 = 20 cm'},
            {t:'Simetría',d:'Una figura es simétrica si un eje la divide en dos partes iguales.',ex:'⬜ → eje vertical y horizontal'},
          ]},
          {name:'Cuerpos Sólidos (3D)',items:[
            {t:'Cubo',d:'Sólido con 6 caras cuadradas iguales.',ex:'🎲 — 6 caras, 8 vértices, 12 aristas'},
            {t:'Ortoedro / Prisma rectangular',d:'Sólido con 6 caras rectangulares.',ex:'📦 caja — caras rectangulares'},
            {t:'Esfera',d:'Sólido completamente redondo, sin aristas ni vértices.',ex:'⚽ balón'},
            {t:'Cilindro',d:'Sólido con dos bases circulares y una cara lateral curva.',ex:'🥫 lata'},
            {t:'Cono',d:'Sólido con base circular y un vértice en la punta.',ex:'🍦 cucurucho'},
          ]},
        ]
      },
      med:{
        title:'📏 Medida',
        grupos:[
          {name:'Longitud',items:[
            {t:'Longitud',d:'Distancia entre dos puntos.',ex:'El salón mide 7 metros'},
            {t:'Milímetro (mm)',d:'Unidad pequeña de longitud. 10 mm = 1 cm',ex:'El grosor de una moneda ≈ 2 mm'},
            {t:'Centímetro (cm)',d:'Unidad básica de longitud. 100 cm = 1 m',ex:'Regla de 30 cm'},
            {t:'Metro (m)',d:'Unidad principal de longitud. 1 m = 100 cm',ex:'Puerta ≈ 2 m de altura'},
            {t:'Kilómetro (km)',d:'1 km = 1 000 m Se usa para distancias largas.',ex:'Carretera de 5 km'},
          ]},
          {name:'Masa y Capacidad',items:[
            {t:'Gramo (g)',d:'Unidad de masa. 1 000 g = 1 kg',ex:'Un clip ≈ 1 g'},
            {t:'Kilogramo (kg)',d:'Unidad principal de masa.',ex:'Un niño ≈ 25 kg'},
            {t:'Mililitro (mL)',d:'Unidad pequeña de capacidad. 1 000 mL = 1 L.',ex:'Una cucharada ≈ 15 mL'},
            {t:'Litro (L)',d:'Unidad principal de capacidad.',ex:'Una botella de agua = 1 L'},
          ]},
          {name:'Tiempo',items:[
            {t:'Segundo (s)',d:'Unidad básica de tiempo. 60 s = 1 min.',ex:'Un latido del corazón ≈ 1 s'},
            {t:'Minuto (min)',d:'60 segundos.',ex:'Un recreo dura 30 minutos'},
            {t:'Hora (h)',d:'60 minutos.',ex:'Una clase dura 1 hora'},
            {t:'Día, semana, mes, año',d:'Unidades de tiempo calendáricas.',ex:'1 año = 12 meses = 52 semanas = 365 días'},
          ]},
        ]
      },
      est:{
        title:'📊 Estadística y Probabilidad',
        grupos:[
          {name:'Recolección y Organización de Datos',items:[
            {t:'Dato',d:'Información recolectada sobre una característica.',ex:'Los colores favoritos de 20 estudiantes'},
            {t:'Encuesta',d:'Conjunto de preguntas para recolectar datos.',ex:'¿Cuál es tu deporte favorito?'},
            {t:'Tabla de frecuencia',d:'Tabla que muestra cuántas veces aparece cada dato.',ex:'Color | Frecuencia: Rojo|5, Azul|8'},
            {t:'Frecuencia',d:'Número de veces que se repite un dato.',ex:'Azul aparece 8 veces → frecuencia = 8'},
            {t:'Moda',d:'Dato que aparece con mayor frecuencia.',ex:'Si Azul=8 es el mayor → moda = Azul'},
          ]},
          {name:'Gráficas',items:[
            {t:'Gráfica de barras',d:'Representación con barras cuya altura indica la frecuencia.',ex:'📊 Eje X = categorías, eje Y = frecuencias'},
            {t:'Pictograma',d:'Gráfica que usa dibujos o íconos para representar datos.',ex:'🍎🍎🍎 = 3 manzanas'},
            {t:'Gráfica de línea',d:'Puntos unidos por líneas que muestran cambios en el tiempo.',ex:'📈 temperatura por semana'},
            {t:'Diagrama de pastel',d:'Círculo dividido en sectores proporcionales a la frecuencia.',ex:'🥧 30% rojo, 50% azul, 20% verde'},
          ]},
          {name:'Probabilidad',items:[
            {t:'Evento probable',d:'Evento que tiene muchas posibilidades de ocurrir.',ex:'Sacar un número par en un dado (3 de 6 caras)'},
            {t:'Evento imposible',d:'Evento que no puede ocurrir.',ex:'Sacar el número 7 en un dado normal'},
            {t:'Evento seguro',d:'Evento que siempre ocurrirá.',ex:'Sacar un número del 1 al 6 en un dado'},
          ]},
        ]
      }
};

export interface ExplStepItem {
  op: string;
  proc: string;
  expl: string;
  speech: string;
}

export type ExplSubcategory = Record<string, ExplStepItem[]>;
export type ExplCategory = ExplSubcategory | ExplStepItem[];

export const EXPL_DATA_3RO: Record<string, ExplCategory> = {
  adicion: {
    'sin-llevar': [
      {op:'  23\n+ 15\n────\n  38', proc:'Paso 1 — Unidades: 3 + 5 = 8\nPaso 2 — Decenas: 2 + 1 = 3\nResultado: 38', expl:'Sumamos primero las unidades: 3 + 5 = 8. Luego las decenas: 2 + 1 = 3. No hay que llevar porque ninguna columna suma más de 9.', speech:'Vamos a sumar veintitrés más quince. Paso uno: sumamos las unidades. Tres más cinco es igual a ocho. Paso dos: sumamos las decenas. Dos más uno es igual a tres. El resultado es treinta y ocho.'},
      {op:'  42\n+ 36\n────\n  78', proc:'Paso 1 — Unidades: 2 + 6 = 8\nPaso 2 — Decenas: 4 + 3 = 7\nResultado: 78', expl:'Sumamos las unidades: 2 + 6 = 8. Luego las decenas: 4 + 3 = 7. No necesitamos llevar ningún número.', speech:'Vamos a sumar cuarenta y dos más treinta y seis. Paso uno: sumamos las unidades. Dos más seis es igual a ocho. Paso dos: sumamos las decenas. Cuatro más tres es igual a siete. El resultado es setenta y ocho.'},
      {op:'  51\n+ 27\n────\n  78', proc:'Paso 1 — Unidades: 1 + 7 = 8\nPaso 2 — Decenas: 5 + 2 = 7\nResultado: 78', expl:'Sumamos las unidades: 1 + 7 = 8. Luego las decenas: 5 + 2 = 7. Ambas columnas dan menos de 10, no se lleva.', speech:'Vamos a sumar cincuenta y uno más veintisiete. Paso uno: sumamos las unidades. Uno más siete es igual a ocho. Paso dos: sumamos las decenas. Cinco más dos es igual a siete. El resultado es setenta y ocho.'},
      {op:'  64\n+ 13\n────\n  77', proc:'Paso 1 — Unidades: 4 + 3 = 7\nPaso 2 — Decenas: 6 + 1 = 7\nResultado: 77', expl:'Sumamos las unidades: 4 + 3 = 7. Luego las decenas: 6 + 1 = 7. No hay llevada porque todo suma menos de 10.', speech:'Vamos a sumar sesenta y cuatro más trece. Paso uno: sumamos las unidades. Cuatro más tres es igual a siete. Paso dos: sumamos las decenas. Seis más uno es igual a siete. El resultado es setenta y siete.'},
      {op:'  30\n+ 45\n────\n  75', proc:'Paso 1 — Unidades: 0 + 5 = 5\nPaso 2 — Decenas: 3 + 4 = 7\nResultado: 75', expl:'Sumamos las unidades: 0 + 5 = 5. Luego las decenas: 3 + 4 = 7. Suma directa sin llevar nada.', speech:'Vamos a sumar treinta más cuarenta y cinco. Paso uno: sumamos las unidades. Cero más cinco es igual a cinco. Paso dos: sumamos las decenas. Tres más cuatro es igual a siete. El resultado es setenta y cinco.'}
    ],
    'llevando': [
      {op:'  27\n+ 35\n────\n  62', proc:'Paso 1 — Unidades: 7 + 5 = 12\n   Escribo 2, llevo 1 a decenas\nPaso 2 — Decenas: 2 + 3 + 1 = 6\nResultado: 62', expl:'Las unidades dan 12 (mayor que 9). Escribo el 2 y llevo el 1 a las decenas. Luego sumo las decenas más el número llevado: 2 + 3 + 1 = 6.', speech:'Vamos a sumar veintisiete más treinta y cinco. Paso uno: unidades. Siete más cinco es doce. Como es mayor que nueve, escribo dos y llevo uno. Paso dos: decenas. Dos más tres más el uno que llevé es igual a seis. El resultado es sesenta y dos.'},
      {op:'  46\n+ 38\n────\n  84', proc:'Paso 1 — Unidades: 6 + 8 = 14\n   Escribo 4, llevo 1 a decenas\nPaso 2 — Decenas: 4 + 3 + 1 = 8\nResultado: 84', expl:'Las unidades dan 14. Escribo el 4 y llevo el 1 a las decenas. En las decenas: 4 + 3 = 7, más el 1 llevado = 8.', speech:'Vamos a sumar cuarenta y seis más treinta y ocho. Paso uno: unidades. Seis más ocho es catorce. Escribo cuatro y llevo uno. Paso dos: decenas. Cuatro más tres más el uno llevado es igual a ocho. El resultado es ochenta y cuatro.'},
      {op:'  58\n+ 25\n────\n  83', proc:'Paso 1 — Unidades: 8 + 5 = 13\n   Escribo 3, llevo 1 a decenas\nPaso 2 — Decenas: 5 + 2 + 1 = 8\nResultado: 83', expl:'Las unidades suman 13. Escribo el 3 en las unidades y llevo el 1. En las decenas: 5 + 2 + 1 = 8.', speech:'Vamos a sumar cincuenta y ocho más veinticinco. Paso uno: unidades. Ocho más cinco es trece. Escribo tres y llevo uno. Paso dos: decenas. Cinco más dos más el uno llevado es igual a ocho. El resultado es ochenta y tres.'},
      {op:'  67\n+ 24\n────\n  91', proc:'Paso 1 — Unidades: 7 + 4 = 11\n   Escribo 1, llevo 1 a decenas\nPaso 2 — Decenas: 6 + 2 + 1 = 9\nResultado: 91', expl:'Las unidades suman 11. Escribo el 1 y llevo el 1 a las decenas. En las decenas: 6 + 2 + 1 = 9.', speech:'Vamos a sumar sesenta y siete más veinticuatro. Paso uno: unidades. Siete más cuatro es once. Escribo uno y llevo uno. Paso dos: decenas. Seis más dos más el uno llevado es igual a nueve. El resultado es noventa y uno.'},
      {op:'  49\n+ 43\n────\n  92', proc:'Paso 1 — Unidades: 9 + 3 = 12\n   Escribo 2, llevo 1 a decenas\nPaso 2 — Decenas: 4 + 4 + 1 = 9\nResultado: 92', expl:'Las unidades suman 12. Escribo el 2 en las unidades y llevo el 1. En las decenas: 4 + 4 + 1 = 9.', speech:'Vamos a sumar cuarenta y nueve más cuarenta y tres. Paso uno: unidades. Nueve más tres es doce. Escribo dos y llevo uno. Paso dos: decenas. Cuatro más cuatro más el uno llevado es igual a nueve. El resultado es noventa y dos.'}
    ]
  },
  sustraccion: {
    'sin-prestamo': [
      {op:'  58\n- 23\n────\n  35', proc:'Paso 1 — Unidades: 8 - 3 = 5\nPaso 2 — Decenas: 5 - 2 = 3\nResultado: 35', expl:'Restamos primero las unidades: 8 - 3 = 5. Luego las decenas: 5 - 2 = 3. Como el dígito de arriba es mayor, no necesitamos pedir prestado.', speech:'Vamos a restar cincuenta y ocho menos veintitrés. Paso uno: unidades. Ocho menos tres es igual a cinco. Paso dos: decenas. Cinco menos dos es igual a tres. El resultado es treinta y cinco.'},
      {op:'  76\n- 42\n────\n  34', proc:'Paso 1 — Unidades: 6 - 2 = 4\nPaso 2 — Decenas: 7 - 4 = 3\nResultado: 34', expl:'Restamos las unidades: 6 - 2 = 4. Luego las decenas: 7 - 4 = 3. No hace falta pedir prestado.', speech:'Vamos a restar setenta y seis menos cuarenta y dos. Paso uno: unidades. Seis menos dos es igual a cuatro. Paso dos: decenas. Siete menos cuatro es igual a tres. El resultado es treinta y cuatro.'},
      {op:'  89\n- 54\n────\n  35', proc:'Paso 1 — Unidades: 9 - 4 = 5\nPaso 2 — Decenas: 8 - 5 = 3\nResultado: 35', expl:'Restamos las unidades: 9 - 4 = 5. Luego las decenas: 8 - 5 = 3. La resta es directa sin préstamo.', speech:'Vamos a restar ochenta y nueve menos cincuenta y cuatro. Paso uno: unidades. Nueve menos cuatro es igual a cinco. Paso dos: decenas. Ocho menos cinco es igual a tres. El resultado es treinta y cinco.'},
      {op:'  67\n- 35\n────\n  32', proc:'Paso 1 — Unidades: 7 - 5 = 2\nPaso 2 — Decenas: 6 - 3 = 3\nResultado: 32', expl:'Restamos las unidades: 7 - 5 = 2. Luego las decenas: 6 - 3 = 3. Todo se puede restar directamente.', speech:'Vamos a restar sesenta y siete menos treinta y cinco. Paso uno: unidades. Siete menos cinco es igual a dos. Paso dos: decenas. Seis menos tres es igual a tres. El resultado es treinta y dos.'},
      {op:'  95\n- 41\n────\n  54', proc:'Paso 1 — Unidades: 5 - 1 = 4\nPaso 2 — Decenas: 9 - 4 = 5\nResultado: 54', expl:'Restamos las unidades: 5 - 1 = 4. Luego las decenas: 9 - 4 = 5. La diferencia es directa porque los dígitos de arriba son mayores.', speech:'Vamos a restar noventa y cinco menos cuarenta y uno. Paso uno: unidades. Cinco menos uno es igual a cuatro. Paso dos: decenas. Nueve menos cuatro es igual a cinco. El resultado es cincuenta y cuatro.'}
    ],
    'prestamo': [
      {op:'  52\n- 27\n────\n  25', proc:'Paso 1 — Unidades: 2 < 7, pido 1 decena prestada\n   12 - 7 = 5\nPaso 2 — Decenas: 5 - 1 - 2 = 2\n   (5 - 1 del préstamo - 2)\nResultado: 25', expl:'Las unidades no alcanzan (2 < 7). Pedimos prestado 1 decena: el 2 se convierte en 12. Restamos 12 - 7 = 5. En las decenas descontamos el préstamo: 5 - 1 = 4, luego 4 - 2 = 2... Espera: 52-27=25. Decenas: 4-2=2.', speech:'Vamos a restar cincuenta y dos menos veintisiete. Paso uno: unidades. Dos es menor que siete, pedimos prestada una decena. Ahora tenemos doce menos siete, que es igual a cinco. Paso dos: decenas. Como prestamos una, tenemos cuatro menos dos que es igual a dos. El resultado es veinticinco.'},
      {op:'  74\n- 38\n────\n  36', proc:'Paso 1 — Unidades: 4 < 8, pido 1 decena prestada\n   14 - 8 = 6\nPaso 2 — Decenas: 6 - 3 = 3\n   (7 - 1 del préstamo = 6, luego 6 - 3 = 3)\nResultado: 36', expl:'Las unidades no alcanzan (4 < 8). Pedimos prestado: 14 - 8 = 6. En las decenas: el 7 se convierte en 6 por el préstamo, y 6 - 3 = 3.', speech:'Vamos a restar setenta y cuatro menos treinta y ocho. Paso uno: unidades. Cuatro es menor que ocho, pedimos prestado. Catorce menos ocho es seis. Paso dos: decenas. El siete se reduce a seis por el préstamo. Seis menos tres es tres. El resultado es treinta y seis.'},
      {op:'  63\n- 45\n────\n  18', proc:'Paso 1 — Unidades: 3 < 5, pido 1 decena prestada\n   13 - 5 = 8\nPaso 2 — Decenas: 5 - 4 = 1\n   (6 - 1 del préstamo = 5, luego 5 - 4 = 1)\nResultado: 18', expl:'Las unidades no alcanzan (3 < 5). Pedimos prestado: 13 - 5 = 8. En las decenas: el 6 baja a 5 por el préstamo, y 5 - 4 = 1.', speech:'Vamos a restar sesenta y tres menos cuarenta y cinco. Paso uno: unidades. Tres es menor que cinco, pedimos prestado. Trece menos cinco es ocho. Paso dos: decenas. El seis baja a cinco por el préstamo. Cinco menos cuatro es uno. El resultado es dieciocho.'},
      {op:'  81\n- 36\n────\n  45', proc:'Paso 1 — Unidades: 1 < 6, pido 1 decena prestada\n   11 - 6 = 5\nPaso 2 — Decenas: 7 - 3 = 4\n   (8 - 1 del préstamo = 7, luego 7 - 3 = 4)\nResultado: 45', expl:'Las unidades no alcanzan (1 < 6). Pedimos prestado: 11 - 6 = 5. En las decenas: el 8 baja a 7 por el préstamo, y 7 - 3 = 4.', speech:'Vamos a restar ochenta y uno menos treinta y seis. Paso uno: unidades. Uno es menor que seis, pedimos prestado. Once menos seis es cinco. Paso dos: decenas. El ocho baja a siete por el préstamo. Siete menos tres es cuatro. El resultado es cuarenta y cinco.'},
      {op:'  40\n- 18\n────\n  22', proc:'Paso 1 — Unidades: 0 < 8, pido 1 decena prestada\n   10 - 8 = 2\nPaso 2 — Decenas: 3 - 1 = 2\n   (4 - 1 del préstamo = 3, luego 3 - 1 = 2)\nResultado: 22', expl:'Las unidades no alcanzan (0 < 8). Pedimos prestado: 10 - 8 = 2. En las decenas: el 4 baja a 3 por el préstamo, y 3 - 1 = 2.', speech:'Vamos a restar cuarenta menos dieciocho. Paso uno: unidades. Cero es menor que ocho, pedimos prestado. Diez menos ocho es dos. Paso dos: decenas. El cuatro baja a tres por el préstamo. Tres menos uno es dos. El resultado es veintidós.'}
    ]
  },
  multiplicacion: [
    {op:' 3\n× 4\n────\n 12', proc:'3 × 4 = 12\nSignifica: 3 grupos de 4\n4 + 4 + 4 = 12', expl:'Multiplicar es sumar el mismo número varias veces. Tres por cuatro significa sumar el cuatro, tres veces: 4 + 4 + 4 = 12.', speech:'Vamos a multiplicar tres por cuatro. Tres por cuatro significa tres grupos de cuatro. Cuatro más cuatro más cuatro es igual a doce. El resultado es doce.'},
    {op:' 5\n× 6\n────\n 30', proc:'5 × 6 = 30\nSignifica: 5 grupos de 6\n6 + 6 + 6 + 6 + 6 = 30', expl:'Cinco por seis significa sumar el seis cinco veces. Usamos la tabla del 5: 5, 10, 15, 20, 25, 30. El resultado es 30.', speech:'Vamos a multiplicar cinco por seis. Cinco por seis significa cinco grupos de seis. Seis más seis más seis más seis más seis es igual a treinta. El resultado es treinta.'},
    {op:' 7\n× 4\n────\n 28', proc:'7 × 4 = 28\nSignifica: 7 grupos de 4\n4+4+4+4+4+4+4 = 28', expl:'Siete por cuatro significa sumar el cuatro siete veces. También podemos usar la tabla del 4: 4, 8, 12, 16, 20, 24, 28. El resultado es 28.', speech:'Vamos a multiplicar siete por cuatro. Siete por cuatro significa siete grupos de cuatro. Usando la tabla del cuatro: cuatro, ocho, doce, dieciséis, veinte, veinticuatro, veintiocho. El resultado es veintiocho.'},
    {op:' 6\n× 8\n────\n 48', proc:'6 × 8 = 48\nSignifica: 6 grupos de 8\n8+8+8+8+8+8 = 48', expl:'Seis por ocho: usamos la tabla del 8. El resultado es 48. También: 6 × 8 = 6 × 4 × 2 = 24 × 2 = 48.', speech:'Vamos a multiplicar seis por ocho. Seis por ocho significa seis grupos de ocho. Usando la tabla del ocho: ocho, dieciséis, veinticuatro, treinta y dos, cuarenta, cuarenta y ocho. El resultado es cuarenta y ocho.'},
    {op:' 9\n× 5\n────\n 45', proc:'9 × 5 = 45\nSignifica: 9 grupos de 5\n5+5+5+5+5+5+5+5+5 = 45', expl:'Nueve por cinco: usamos la tabla del 5. Cada múltiplo termina en 0 o 5. El resultado es 45.', speech:'Vamos a multiplicar nueve por cinco. Nueve por cinco significa nueve grupos de cinco. Usando la tabla del cinco: cinco, diez, quince, veinte, veinticinco, treinta, treinta y cinco, cuarenta, cuarenta y cinco. El resultado es cuarenta y cinco.'}
  ],
  division: [
    {op:'20 ÷ 4 = 5', proc:'Pregunta: ¿Cuántas veces cabe 4 en 20?\n4 × 1 = 4  →  no llega\n4 × 5 = 20 ✓\nResultado: 5', expl:'Dividir es repartir en partes iguales. Veinte dividido entre cuatro pregunta: ¿cuántos grupos de 4 hay en 20? Como 4 × 5 = 20, el resultado es 5.', speech:'Vamos a dividir veinte entre cuatro. Preguntamos: ¿cuántas veces cabe el cuatro en veinte? Cuatro por cinco es veinte. Por lo tanto, el resultado es cinco.'},
    {op:'36 ÷ 6 = 6', proc:'Pregunta: ¿Cuántas veces cabe 6 en 36?\n6 × 6 = 36 ✓\nResultado: 6', expl:'Treinta y seis dividido entre seis: usamos la tabla del 6 para encontrar qué número multiplicado por 6 da 36. Como 6 × 6 = 36, el cociente es 6.', speech:'Vamos a dividir treinta y seis entre seis. Preguntamos: ¿cuántas veces cabe el seis en treinta y seis? Seis por seis es treinta y seis. Por lo tanto, el resultado es seis.'},
    {op:'48 ÷ 8 = 6', proc:'Pregunta: ¿Cuántas veces cabe 8 en 48?\n8 × 6 = 48 ✓\nResultado: 6', expl:'Cuarenta y ocho dividido entre ocho: buscamos en la tabla del 8 qué número da 48. Como 8 × 6 = 48, el cociente es 6.', speech:'Vamos a dividir cuarenta y ocho entre ocho. Preguntamos: ¿cuántas veces cabe el ocho en cuarenta y ocho? Ocho por seis es cuarenta y ocho. Por lo tanto, el resultado es seis.'},
    {op:'35 ÷ 7 = 5', proc:'Pregunta: ¿Cuántas veces cabe 7 en 35?\n7 × 5 = 35 ✓\nResultado: 5', expl:'Treinta y cinco dividido entre siete: usamos la tabla del 7. Como 7 × 5 = 35, el cociente es 5.', speech:'Vamos a dividir treinta y cinco entre siete. Preguntamos: ¿cuántas veces cabe el siete en treinta y cinco? Siete por cinco es treinta y cinco. Por lo tanto, el resultado es cinco.'},
    {op:'45 ÷ 9 = 5', proc:'Pregunta: ¿Cuántas veces cabe 9 en 45?\n9 × 5 = 45 ✓\nResultado: 5', expl:'Cuarenta y cinco dividido entre nueve: buscamos en la tabla del 9 qué número da 45. Como 9 × 5 = 45, el cociente es 5.', speech:'Vamos a dividir cuarenta y cinco entre nueve. Preguntamos: ¿cuántas veces cabe el nueve en cuarenta y cinco? Nueve por cinco es cuarenta y cinco. Por lo tanto, el resultado es cinco.'}
  ]
};


export interface ExamQuestion3ro {
  id: number;
  unit: string;
  topic: string;
  q: string;
  opts: string[];
  ans: number; // 0-based index
  expl: string;
}

export const EXAM_QUESTIONS_3RO: ExamQuestion3ro[] = [
  {
    id: 1,
    unit: 'Adición',
    topic: 'Conteo y valor posicional',
    q: '¿Cuál es el valor posicional del dígito 7 en el número 4.752?',
    opts: ['7 unidades', '70 decenas', '700 unidades (7 centenas)', '7.000 unidades'],
    ans: 2,
    expl: 'En 4.752, el 7 ocupa el lugar de las centenas, por lo que equivale a 700 unidades.',
  },
  {
    id: 2,
    unit: 'Adición',
    topic: 'Suma de números de 3 dígitos',
    q: 'En la nave de Fedor hay 345 cristales de energía y recolecta 238 más en Marte. ¿Cuántos cristales tiene en total?',
    opts: ['573 cristales', '583 cristales', '593 cristales', '683 cristales'],
    ans: 1,
    expl: '345 + 238 = 583 cristales de energía.',
  },
  {
    id: 3,
    unit: 'Adición',
    topic: 'Propiedad conmutativa',
    q: 'Si sabemos que 450 + 230 = 680, ¿cuál es el resultado de 230 + 450?',
    opts: ['680', '780', '580', '480'],
    ans: 0,
    expl: 'Por la propiedad conmutativa de la adición, el orden de los sumandos no altera la suma.',
  },
  {
    id: 4,
    unit: 'Adición',
    topic: 'Estimación y redondeo',
    q: 'Aproxima el número 678 a la centena más cercana:',
    opts: ['600', '650', '700', '800'],
    ans: 2,
    expl: 'Como las decenas son 7 (mayor o igual a 5), se redondea hacia arriba a 700.',
  },
  {
    id: 5,
    unit: 'Adición',
    topic: 'Suma con reagrupación',
    q: 'Calcula: 1.459 + 2.873 =',
    opts: ['4.232', '4.332', '4.322', '3.332'],
    ans: 1,
    expl: '1.459 + 2.873 = 4.332.',
  },
  {
    id: 6,
    unit: 'Sustracción',
    topic: 'Resta básica',
    q: 'Un satélite tenía 850 litros de combustible espacial. Gastó 320 litros en maniobras. ¿Cuántos litros le quedan?',
    opts: ['520 L', '530 L', '540 L', '550 L'],
    ans: 1,
    expl: '850 - 320 = 530 litros.',
  },
  {
    id: 7,
    unit: 'Sustracción',
    topic: 'Resta con desagrupación',
    q: 'En una estación espacial había 500 baterías y se usaron 264. ¿Cuántas baterías quedan?',
    opts: ['236', '246', '336', '346'],
    ans: 0,
    expl: '500 - 264 = 236 baterías.',
  },
  {
    id: 8,
    unit: 'Sustracción',
    topic: 'Términos de la resta',
    q: 'En la resta 780 - 250 = 530, ¿cuál es el minuendo?',
    opts: ['250', '530', '780', 'El signo menos'],
    ans: 2,
    expl: 'El minuendo es la cantidad mayor inicial de la cual se resta: 780.',
  },
  {
    id: 9,
    unit: 'Sustracción',
    topic: 'Prueba de la resta',
    q: 'Para comprobar si una resta está correcta, se debe cumplir que:',
    opts: ['Sustraendo + Diferencia = Minuendo', 'Minuendo + Sustraendo = Diferencia', 'Diferencia - Sustraendo = Minuendo', 'Minuendo × Sustraendo = Diferencia'],
    ans: 0,
    expl: 'La prueba de la resta es: Sustraendo + Diferencia = Minuendo.',
  },
  {
    id: 10,
    unit: 'Sustracción',
    topic: 'Problema multi-paso',
    q: 'Fedor tenía 900 estrellas. Regaló 250 a su amigo y luego ganó 120 en un juego. ¿Cuántas estrellas tiene ahora?',
    opts: ['650', '770', '750', '820'],
    ans: 1,
    expl: '900 - 250 = 650; luego 650 + 120 = 770 estrellas.',
  },
  {
    id: 11,
    unit: 'Multiplicación',
    topic: 'Suma repetida',
    q: '¿Qué multiplicación representa la suma repetida 6 + 6 + 6 + 6 + 6?',
    opts: ['6 × 4', '5 × 6', '6 × 6', '5 + 6'],
    ans: 1,
    expl: 'El número 6 se repite 5 veces, por lo tanto es 5 × 6 = 30.',
  },
  {
    id: 12,
    unit: 'Multiplicación',
    topic: 'Tablas del 1 al 9',
    q: '¿Cuál es el resultado de 8 × 7?',
    opts: ['54', '56', '58', '64'],
    ans: 1,
    expl: '8 × 7 = 56.',
  },
  {
    id: 13,
    unit: 'Multiplicación',
    topic: 'Multiplicación por 10, 100, 1000',
    q: 'Al multiplicar 45 × 100 se obtiene:',
    opts: ['450', '4.500', '45.000', '405'],
    ans: 1,
    expl: 'Al multiplicar por 100 se agregan dos ceros a la derecha: 4.500.',
  },
  {
    id: 14,
    unit: 'Multiplicación',
    topic: 'Arreglos rectangulares',
    q: 'En un hangar espacial hay 4 filas de naves con 9 naves en cada fila. ¿Cuántas naves hay en total?',
    opts: ['32', '36', '40', '45'],
    ans: 1,
    expl: '4 filas × 9 naves = 36 naves.',
  },
  {
    id: 15,
    unit: 'Multiplicación',
    topic: 'Propiedad asociativa',
    q: 'Calcula (2 × 3) × 4:',
    opts: ['14', '20', '24', '28'],
    ans: 2,
    expl: '(2 × 3) = 6; luego 6 × 4 = 24.',
  },
  {
    id: 16,
    unit: 'División',
    topic: 'Reparto equitativo',
    q: 'Fedor tiene 24 chocolatinas estelares y las reparte por igual entre 4 astronautas. ¿Cuántas recibe cada uno?',
    opts: ['4', '5', '6', '8'],
    ans: 2,
    expl: '24 ÷ 4 = 6 chocolatinas para cada astronauta.',
  },
  {
    id: 17,
    unit: 'División',
    topic: 'Términos de la división',
    q: 'En la división 35 ÷ 5 = 7, ¿qué nombre recibe el número 5?',
    opts: ['Dividendo', 'Divisor', 'Cociente', 'Residuo'],
    ans: 1,
    expl: 'El 35 es el dividendo, el 5 es el divisor y el 7 es el cociente.',
  },
  {
    id: 18,
    unit: 'División',
    topic: 'División exacta e inexacta',
    q: 'Si dividimos 19 globos entre 3 niños en partes iguales, ¿cuántos globos sobran?',
    opts: ['0', '1', '2', '3'],
    ans: 1,
    expl: '3 × 6 = 18. Para llegar a 19 sobra 1 globo (residuo = 1).',
  },
  {
    id: 19,
    unit: 'División',
    topic: 'Relación con la multiplicación',
    q: 'Si sabemos que 7 × 9 = 63, ¿cuánto es 63 ÷ 7?',
    opts: ['6', '8', '9', '10'],
    ans: 2,
    expl: 'La división es la operación inversa de la multiplicación: 63 ÷ 7 = 9.',
  },
  {
    id: 20,
    unit: 'División',
    topic: 'Mitad y tercio',
    q: 'La mitad de 48 es:',
    opts: ['22', '24', '26', '28'],
    ans: 1,
    expl: '48 ÷ 2 = 24.',
  },
  {
    id: 21,
    unit: 'Geometría',
    topic: 'Figuras planas',
    q: '¿Cuántos lados y vértices tiene un hexágono?',
    opts: ['5 lados y 5 vértices', '6 lados y 6 vértices', '7 lados y 7 vértices', '8 lados y 8 vértices'],
    ans: 1,
    expl: 'Un hexágono tiene 6 lados y 6 vértices.',
  },
  {
    id: 22,
    unit: 'Geometría',
    topic: 'Perímetro',
    q: 'Un jardín cuadrado tiene 8 metros de lado. ¿Cuál es su perímetro?',
    opts: ['16 m', '24 m', '32 m', '64 m'],
    ans: 2,
    expl: 'El perímetro de un cuadrado es la suma de sus 4 lados: 8 + 8 + 8 + 8 = 32 m.',
  },
  {
    id: 23,
    unit: 'Medida',
    topic: 'Tiempo y reloj',
    q: 'Si la clase de ciencias espaciales empieza a las 9:15 y dura 45 minutos, ¿a qué hora termina?',
    opts: ['9:45', '9:50', '10:00', '10:15'],
    ans: 2,
    expl: '9:15 + 45 minutos = 10:00.',
  },
  {
    id: 24,
    unit: 'Estadística',
    topic: 'Gráficos de barras',
    q: 'En un gráfico de barras, si cada cuadro representa 5 votos y la barra de "Ciencias" tiene 6 cuadros, ¿cuántos votos obtuvo?',
    opts: ['25 votos', '30 votos', '35 votos', '40 votos'],
    ans: 1,
    expl: '6 cuadros × 5 votos por cuadro = 30 votos.',
  },
  {
    id: 25,
    unit: 'Problemas SABER',
    topic: 'Razonamiento lógico',
    q: 'Camila tiene el doble de estampillas que Tomás. Si Tomás tiene 18 estampillas, ¿cuántas estampillas tienen entre los dos?',
    opts: ['36 estampillas', '48 estampillas', '54 estampillas', '60 estampillas'],
    ans: 2,
    expl: 'Tomás tiene 18. Camila tiene el doble: 18 × 2 = 36. Juntos tienen: 18 + 36 = 54 estampillas.',
  },
];


export interface DailyMission3ro {
  id: string;
  title: string;
  desc: string;
  xpReward: number;
  coinsReward: number;
  icon: string;
  goal: number;
  current: number;
  done: boolean;
}

export const DEFAULT_DAILY_MISSIONS_3RO: DailyMission3ro[] = [
  {
    id: 'm_adicion',
    title: 'Maestro de la Adición',
    desc: 'Resuelve 3 sumas de 4 dígitos con reagrupación',
    xpReward: 30,
    coinsReward: 8,
    icon: '🔢',
    goal: 3,
    current: 0,
    done: false,
  },
  {
    id: 'm_tabla',
    title: 'Tabla del Día',
    desc: 'Practica la tabla del 6 o del 7 (¡sin errores!)',
    xpReward: 40,
    coinsReward: 10,
    icon: '✖️',
    goal: 1,
    current: 0,
    done: false,
  },
  {
    id: 'm_geometrico',
    title: 'Explorador Geométrico',
    desc: 'Identifica 3 figuras planas y describe sus propiedades',
    xpReward: 25,
    coinsReward: 6,
    icon: '📐',
    goal: 3,
    current: 0,
    done: false,
  },
  {
    id: 'm_datos',
    title: 'Analista de Datos',
    desc: 'Crea una gráfica de barras con datos de tu salón',
    xpReward: 30,
    coinsReward: 8,
    icon: '📊',
    goal: 1,
    current: 0,
    done: false,
  },
  {
    id: 'm_medidas',
    title: 'Experto en Medidas',
    desc: 'Convierte 5 medidas entre cm y m correctamente',
    xpReward: 30,
    coinsReward: 7,
    icon: '📏',
    goal: 5,
    current: 0,
    done: false,
  },
];
