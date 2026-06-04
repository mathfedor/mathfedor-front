/**
 * Tipos de progreso y resultados del libro "Matemáticas de Fedor 2°".
 * Compatibles con `learning-results.service.ts` para reutilizar el patrón
 * de reportes docentes existente.
 */

import type { GamificationState } from './gamification.types';

/** Calificación tipo MEN derivada del porcentaje. */
export interface Grade {
  /** Letra: S (Superior), A (Alto), B (Básico), L (Bajo). */
  letter: 'S' | 'A' | 'B' | 'L';
  /** Nota numérica (2.0..5.0). */
  num: string;
  /** Etiqueta legible. */
  lbl: string;
  /** Estrellas según desempeño. */
  stars: string;
  /** Mensaje adaptativo. */
  adaptive: string;
  /** Clase CSS del badge de calificación. */
  cls: string;
  /** Descripción / desempeño MEN. */
  desc: string;
  /** Color de la barra. */
  barColor: string;
  /** Porcentaje redondeado. */
  pct: number;
}

/** Resultado de completar un nivel concreto. */
export interface LevelScore {
  /** Clave del nivel: `u{u}t{t}-n{n}`. */
  key: string;
  topicTitle: string;
  levelLabel: string;
  /** Puntos obtenidos. */
  pts: number;
  /** Puntos máximos posibles. */
  maxPts: number;
  /** Respuestas correctas. */
  ok: number;
  /** Respuestas incorrectas. */
  wrong: number;
  /** Porcentaje 0..100. */
  pct: number;
  /** Letra de calificación. */
  grade: Grade['letter'];
  /** Intentos realizados. */
  attempts: number;
  /** ISO timestamp del último intento. */
  ts: string;
}

/** Mapa de puntuaciones por clave de nivel. */
export type ScoreMap = Record<string, LevelScore>;

/** Datos del estudiante capturados en el setup. */
export interface BookStudent {
  name: string;
  school: string;
  city: string;
  teacher: string;
  email?: string;
  avatar: string;
}

/**
 * Snapshot completo del progreso de un estudiante en el libro.
 * Es la unidad de persistencia que viajará al backend Node.js.
 */
export interface BookProgress {
  /** Identificador del progreso (Mongo _id en backend). */
  id?: string;
  bookSlug: string;
  student: BookStudent;
  scores: ScoreMap;
  gamification: GamificationState;
  createdAt?: string;
  updatedAt?: string;
}

/** Una respuesta individual registrada durante una lección. */
export interface ExerciseAttempt {
  exerciseId: string;
  /** Respuesta del estudiante. */
  userAnswer: string;
  /** Respuesta correcta. */
  correctAnswer: string;
  isCorrect: boolean;
}

/** Resultado de una lección recién terminada (entrada a la pantalla de resultados). */
export interface LessonResult {
  levelKey: string;
  topicTitle: string;
  levelLabel: string;
  pts: number;
  maxPts: number;
  ok: number;
  wrong: number;
  pct: number;
  grade: Grade;
  attempts: ExerciseAttempt[];
}

/** Bloque de análisis IA para el reporte docente (mockeable). */
export interface AIAnalysis {
  teacher: string;
  family: string;
  positive: string;
  improve: string;
}
