import api from './api.config';
import { authService } from './auth.service';

export interface LearningResultSubject {
  title: string;
  points: number;
  maxPoints: number;
  percentage: number;
  N1?: string;
  N2?: string;
  N3?: string;
  N4?: string;
  answers?: LearningResultAnswer[];
}

export interface LearningResultAnswer {
  exerciseId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface LearningResultStudent {
  name: string;
  userId: string;
  lastName?: string;
  email?: string;
  institutionId?: string | null;
  branchId?: string | null;
  classroomId?: string | null;
}

export interface LearningResultModule {
  id: string;
  title: string;
  group: string;
}

export interface LearningResult {
  id?: string;
  _id?: string;
  learningId?: string;
  moduleId: string;
  module?: LearningResultModule;
  student: LearningResultStudent;
  teacher?: {
    name: string;
    userId: string;
  };
  institutionId?: string | null;
  branchId?: string | null;
  classroomId?: string | null;
  group: string;
  goodAnswers: number;
  wrongAnswers: number;
  rating: string;
  subjects: LearningResultSubject[];
  answers: LearningResultAnswer[];
  createdAt?: string;
  bookScores?: Record<string, {
    key: string;
    topicTitle: string;
    levelLabel: string;
    pts: number;
    maxPoints?: number;
    maxPts: number;
    ok: number;
    wrong: number;
    pct: number;
    grade: 'S' | 'A' | 'B' | 'L';
    attempts: number;
    ts: string;
  }>;
  bookReport?: {
    globalPct: number;
    completedLevels: number;
    totalLevels: number;
    avgPct: number;
    bestUnit: string | null;
    weakestUnit: string | null;
    perUnit: Array<{
      unitId: string;
      unitName: string;
      unitShort: string;
      unitIcon: string;
      completedLevels: number;
      totalLevels: number;
      avgPct: number;
      perTopic: Array<{
        topicId: string;
        topicTitle: string;
        topicIcon: string;
        completedLevels: number;
        totalLevels: number;
        avgPct: number;
        levels: Array<{
          levelKey: string;
          levelLabel: string;
          levelShort: string;
          levelBg: string;
          levelColor: string;
          pts: number | null;
          maxPts: number | null;
          pct: number | null;
          grade: 'S' | 'A' | 'B' | 'L' | null;
          attempts: number;
          ts: string | null;
        }>;
      }>;
    }>;
    lastUpdated?: string;
  };
}

export type LearningResultPayload = Omit<LearningResult, 'id' | '_id' | 'createdAt'>;

const mockLearningResults: LearningResult[] = [
  {
    id: 'mock-result-1',
    _id: 'mock-result-1',
    moduleId: 'mock-module-grade-11',
    module: {
      id: 'mock-module-grade-11',
      title: 'Learning Matemáticas Grado 11',
      group: 'Grado 11'
    },
    student: {
      name: 'Valentina Rojas',
      userId: 'mock-student-1',
      lastName: 'Rojas',
      email: 'valentina.rojas@colegio.edu.co',
      institutionId: 'mock-institution-1',
      branchId: 'mock-branch-1',
      classroomId: '11A'
    },
    teacher: {
      name: 'Profesor Demo',
      userId: 'mock-teacher-1'
    },
    institutionId: 'mock-institution-1',
    branchId: 'mock-branch-1',
    classroomId: '11A',
    group: 'Grado 11',
    goodAnswers: 18,
    wrongAnswers: 4,
    rating: 'Todo está muy bien',
    subjects: [
      { title: 'Funciones', points: 8.5, maxPoints: 10, percentage: 85, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Trigonometría', points: 7.8, maxPoints: 10, percentage: 78, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Probabilidad', points: 8.2, maxPoints: 10, percentage: 82, N1: '0%', N2: '0%', N3: '0%', N4: '0%' }
    ],
    answers: [
      { exerciseId: 'funciones-1', selectedAnswer: 'A', isCorrect: true },
      { exerciseId: 'trigonometria-1', selectedAnswer: 'C', isCorrect: true },
      { exerciseId: 'probabilidad-1', selectedAnswer: 'B', isCorrect: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-result-2',
    _id: 'mock-result-2',
    moduleId: 'mock-module-grade-10',
    module: {
      id: 'mock-module-grade-10',
      title: 'Learning Matemáticas Grado 10',
      group: 'Grado 10'
    },
    student: {
      name: 'Samuel Martínez',
      userId: 'mock-student-2',
      lastName: 'Martínez',
      email: 'samuel.martinez@colegio.edu.co',
      institutionId: 'mock-institution-1',
      branchId: 'mock-branch-1',
      classroomId: '10B'
    },
    teacher: {
      name: 'Profesor Demo',
      userId: 'mock-teacher-1'
    },
    institutionId: 'mock-institution-1',
    branchId: 'mock-branch-1',
    classroomId: '10B',
    group: 'Grado 10',
    goodAnswers: 9,
    wrongAnswers: 11,
    rating: 'Necesita mejorar',
    subjects: [
      { title: 'Álgebra', points: 5.5, maxPoints: 10, percentage: 55, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Geometría analítica', points: 4.2, maxPoints: 10, percentage: 42, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Ecuaciones cuadráticas', points: 6.1, maxPoints: 10, percentage: 61, N1: '0%', N2: '0%', N3: '0%', N4: '0%' }
    ],
    answers: [
      { exerciseId: 'algebra-1', selectedAnswer: 'D', isCorrect: false },
      { exerciseId: 'geometria-1', selectedAnswer: 'A', isCorrect: true },
      { exerciseId: 'cuadraticas-1', selectedAnswer: 'B', isCorrect: false }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'mock-result-3',
    _id: 'mock-result-3',
    moduleId: 'mock-module-grade-11',
    module: {
      id: 'mock-module-grade-11',
      title: 'Learning Matemáticas Grado 11',
      group: 'Grado 11'
    },
    student: {
      name: 'Camila Torres',
      userId: 'mock-student-3',
      lastName: 'Torres',
      email: 'camila.torres@colegio.edu.co',
      institutionId: 'mock-institution-1',
      branchId: 'mock-branch-1',
      classroomId: '11A'
    },
    teacher: {
      name: 'Profesor Demo',
      userId: 'mock-teacher-1'
    },
    institutionId: 'mock-institution-1',
    branchId: 'mock-branch-1',
    classroomId: '11A',
    group: 'Grado 11',
    goodAnswers: 13,
    wrongAnswers: 7,
    rating: 'Necesita mejorar',
    subjects: [
      { title: 'Cálculo diferencial', points: 6.8, maxPoints: 10, percentage: 68, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Estadística', points: 7.2, maxPoints: 10, percentage: 72, N1: '0%', N2: '0%', N3: '0%', N4: '0%' },
      { title: 'Lectura de gráficas', points: 5.9, maxPoints: 10, percentage: 59, N1: '0%', N2: '0%', N3: '0%', N4: '0%' }
    ],
    answers: [
      { exerciseId: 'calculo-1', selectedAnswer: 'C', isCorrect: true },
      { exerciseId: 'estadistica-1', selectedAnswer: 'B', isCorrect: true },
      { exerciseId: 'graficas-1', selectedAnswer: 'D', isCorrect: false }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return String(error.response.data.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

class LearningResultsService {
  async submitResult(result: LearningResultPayload): Promise<LearningResult> {
    try {
      const response = await api.post<LearningResult>('/learning/results', result);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'No se pudo guardar el resultado de learning'));
    }
  }

  async getStudentResultByModule(moduleId: string, studentId: string): Promise<LearningResult | null> {
    try {
      const response = await api.get<LearningResult | LearningResult[]>('/learning/results', {
        params: {
          moduleId,
          learningId: moduleId,
          studentId,
          userId: studentId
        }
      });

      const results = Array.isArray(response.data) ? response.data : [response.data];
      return this.findLatestStudentModuleResult(results, moduleId, studentId);
    } catch (error) {
      console.warn('No se pudo cargar resultado previo de learning:', error);
      return null;
    }
  }

  private findLatestStudentModuleResult(results: LearningResult[], moduleId: string, studentId: string) {
    return results
      .filter((result) =>
        (result.moduleId === moduleId || result.learningId === moduleId || result.module?.id === moduleId) &&
        (result.student.userId === studentId || result.student.email === studentId)
      )
      .sort((first, second) => new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime())[0] || null;
  }

  async getTeacherResults(): Promise<LearningResult[]> {
    try {
      const response = await api.get<LearningResult[]>('/learning/results/my-students');
      if (response.data.length === 0) {
        return mockLearningResults;
      }

      return response.data;
    } catch (error) {
      try {
        const currentUser = authService.getCurrentUser();
        const response = await api.get<LearningResult[]>('/learning/results', {
          params: currentUser?.role === 'Academy' && currentUser.institutionId
            ? { institutionId: currentUser.institutionId }
            : undefined
        });

        if (response.data.length === 0) {
          return mockLearningResults;
        }

        return response.data;
      } catch (fallbackError) {
        console.warn('Usando resultados mock de learning:', fallbackError || error);
        return mockLearningResults;
      }
    }
  }

  async getResultById(resultId: string): Promise<LearningResult> {
    try {
      const response = await api.get<LearningResult>(`/learning/results/${resultId}`);
      return response.data;
    } catch (error) {
      const mockResult = mockLearningResults.find((result) => result.id === resultId || result._id === resultId);

      if (mockResult) {
        return mockResult;
      }

      throw new Error(getErrorMessage(error, 'No se pudo cargar el resultado'));
    }
  }
}

export const learningResultsService = new LearningResultsService();
