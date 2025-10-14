import { authService } from './auth.service';
import { DiagnosticConfig, DiagnosticFormData } from '@/types/diagnostic.types';

interface DiagnosticResult {
  diagnosticId: string;
  student: {
    name: string;
    userId: string;
    lastName: string;
  };
  teacher: {
    name: string;
    userId: string;
  };
  group: string;
  goodAnswers: number;
  wrongAnswers: number;
  rating: string;
  subjects: Array<{
    title: string;
    points: number;
    maxPoints: number;
    percentage: number;
    N1: string;
    N2: string;
    N3: string;
    N4: string;
  }>;
  answers: Array<{
    exerciseId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>;
}

class DiagnosticService {
  async createDiagnostic(formData: DiagnosticFormData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const formDataToSend = new FormData();

    // Agregar los campos requeridos
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('group', formData.group);

    // Agregar user_id
    const user = authService.getCurrentUser();
    formDataToSend.append('createdBy', user?.id || '');

    // Agregar los temas como array
    formData.topics.forEach((topic, index) => {
      formDataToSend.append(`tags[${index}]`, topic);
    });

    // Agregar el archivo si existe
    if (formData.file) {
      if (formData.file.size > 10 * 1024 * 1024) {
        throw new Error('El archivo excede el límite de 10MB');
      }
      formDataToSend.append('file', formData.file);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnostics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el diagnóstico');
    }

    return response.json();
  }

  async getDiagnosticConfig(): Promise<DiagnosticConfig[]> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnostics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la configuración del diagnóstico');
    }

    return response.json();
  }

  async submitResults(results: DiagnosticResult) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnostics/results`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(results)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar los resultados del diagnóstico');
    }

    return response.json();
  }

  async checkUserDiagnostic(diagnosticId: string, userId: string) {
    const token = authService.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnostics/results/${diagnosticId}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Error consultando diagnóstico');
    return await res.json(); // { exists: boolean }
  }
}

export const diagnosticService = new DiagnosticService();