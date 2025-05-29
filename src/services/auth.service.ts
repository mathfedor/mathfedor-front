import api from './api.config';
import { LoginCredentials, User, LoginResponse } from '@/types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Si no hay token en la respuesta, consideramos que hubo un error
      if (!response.data.token) {
        throw new Error('Credenciales invalidas');
      }

      console.log('Token recibido:', response);
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      // Guardar la información del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        ...response.data,
        ok: true
      };
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 