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
      return response.data || [];
    } catch (error) {
      try {
        const currentUser = authService.getCurrentUser();
        const response = await api.get<LearningResult[]>('/learning/results', {
          params: currentUser?.role === 'Academy' && currentUser.institutionId
            ? { institutionId: currentUser.institutionId }
            : undefined
        });

        return response.data || [];
      } catch (fallbackError) {
        console.error('Error al obtener resultados:', fallbackError || error);
        return [];
      }
    }
  }

  async getResultById(resultId: string): Promise<LearningResult> {
    try {
      const response = await api.get<LearningResult>(`/learning/results/${resultId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'No se pudo cargar el resultado'));
    }
  }
}

export const learningResultsService = new LearningResultsService();

