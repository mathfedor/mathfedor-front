/**
 * Tipos del currículo del libro interactivo "Matemáticas de Fedor 2°".
 *
 * Modela el contenido educativo migrado desde el HTML original:
 *   Book → Unit → Topic → Level (N1..N5) → Exercise (mcq | input | seq)
 *
 * Se mantiene compatibilidad conceptual con `Module`/`Topic` existentes
 * (src/types/module.types.ts, src/types/diagnostic.types.ts) pero con un
 * modelo más rico para soportar gamificación y ejercicios tipados.
 */

/** Tipos de ejercicio soportados por el motor de lecciones. */
export type ExerciseType = 'mcq' | 'input' | 'seq';

/**
 * Item de una secuencia numérica (`type: 'seq'`).
 * - `t: 'f'` → casilla fija (visible), usa `v`.
 * - `t: 'b'` → casilla en blanco a completar, usa `a` (respuesta correcta).
 */
export interface SequenceItem {
  t: 'f' | 'b';
  /** Valor mostrado cuando la casilla es fija. */
  v?: string;
  /** Respuesta esperada cuando la casilla está en blanco. */
  a?: string;
}

/**
 * Datos auxiliares para renderizar una figura/diagrama del ejercicio
 * (tablas de proporcionalidad, geometría, estadística, etc.).
 * Se deja flexible porque cada `figure` usa su propia forma.
 */
export interface ExerciseFigureData {
  [key: string]: unknown;
}

/** Campos comunes a todos los ejercicios. */
interface ExerciseBase {
  /** Identificador estable del ejercicio (generado en la capa de datos). */
  id: string;
  type: ExerciseType;
  /** Enunciado / pregunta. */
  q: string;
  /** Puntos otorgados al acertar. */
  pts: number;
  /** Etiqueta corta de categoría (ej. "Conteo 1-10"). */
  badge?: string;
  /** Estilo inline original del badge (compat. visual con el HTML). */
  bst?: string;
  /** Emoji de la mascota que acompaña el ejercicio. */
  mascot?: string;
  /** Contexto narrativo opcional. */
  ctx?: string;
  /** Nombre de la figura a renderizar (ej. "tabla_directa", "geom_area"). */
  figure?: string;
  /** Datos para construir la figura. */
  fig_data?: ExerciseFigureData;
  /** Explicación o procedimiento procedimental (HTML). */
  explain?: string;
  countEmoji?: string;
  countN?: number;
}

/** Ejercicio de opción múltiple. */
export interface McqExercise extends ExerciseBase {
  type: 'mcq';
  opts: string[];
  ans: string;
}

/** Ejercicio de respuesta abierta corta. */
export interface InputExercise extends ExerciseBase {
  type: 'input';
  ans: string;
  hint?: string;
}

/** Ejercicio de secuencia numérica. */
export interface SeqExercise extends ExerciseBase {
  type: 'seq';
  items: SequenceItem[];
}

export type Exercise = McqExercise | InputExercise | SeqExercise;

/** Nivel de dificultad dentro de un tema (Básico → Pruebas SABER). */
export interface Level {
  /** Índice 0..4 dentro del tema. */
  index: number;
  label: string;
  /** Etiqueta corta (N1..N5). */
  short: string;
  /** Clase de "dot" para el indicador visual original. */
  dot: string;
  /** Color de fondo del chip de nivel. */
  bg: string;
  /** Color de texto del chip de nivel. */
  color: string;
  exercises: Exercise[];
}

/** Tema dentro de una unidad. */
export interface Topic {
  /** Identificador estable (`u{unit}-t{topic}`). */
  id: string;
  title: string;
  icon: string;
  desc: string;
  levels: Level[];
  levelDescs?: string[];
}

/** Unidad de aprendizaje del libro. */
export interface Unit {
  /** Identificador estable (`u{index}`). */
  id: string;
  /** Índice 0..N dentro del libro. */
  index: number;
  name: string;
  short: string;
  /** Estándar MEN asociado. */
  std: string;
  /** Clase CSS del hero original (uhb-1..uhb-8). */
  heroCls: string;
  icon: string;
  topics: Topic[];
}

/** Libro completo (raíz del currículo). */
export interface Book {
  id: string;
  slug: string;
  title: string;
  grade: string;
  /** Estándar curricular general. */
  standard: string;
  units: Unit[];
}

/** Coordenada que identifica un nivel concreto dentro del libro. */
export interface LevelRef {
  unitIndex: number;
  topicIndex: number;
  levelIndex: number;
}

/** Configuración de recta numérica para un ejemplo/ejercicio. */
export interface NumberLineConfig {
  min: number;
  max: number;
  ans: number;
}

/**
 * Tarjeta de ejemplo resuelto que se muestra antes de la práctica
 * (`LEVEL_EXAMPLES` del HTML original). `explain` y `vis` contienen el HTML
 * de diseño original y se renderizan tal cual para fidelidad total.
 */
export interface LevelExample {
  icon: string;
  /** Pregunta/enunciado del ejemplo. */
  q: string;
  /** Respuesta. */
  a: string;
  /** Explicación paso a paso (HTML con estilos inline). */
  explain: string;
  /** Visual del ejemplo (HTML/SVG o cadena de emojis). */
  vis?: string;
  /** Config de visual de grupos (multiplicación/división). */
  groups?: Record<string, unknown>;
  /** Config de recta numérica. */
  nl?: NumberLineConfig;
}

/** Mapa de ejemplos por clave de nivel (`u{u}t{t}-n{n}`). */
export type LevelExamplesMap = Record<string, LevelExample[]>;

/** Tutorial introductorio de una unidad (`UNIT_TUTS` del HTML). */
export interface UnitTutorial {
  icon: string;
  title: string;
  text: string;
  steps: string[];
}

/** Capítulo de la historia narrativa (diario/lore), desbloqueable por progreso. */
export interface LoreChapter {
  id: number;
  emoji: string;
  title: string;
  /** Umbral 0..1 de progreso global para desbloquearlo. */
  threshold: number;
  text: string;
}
