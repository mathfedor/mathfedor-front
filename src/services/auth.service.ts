import api from './api.config';
import { LoginCredentials, User, LoginResponse } from '@/types/auth.types';
import { AxiosError } from 'axios';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);

      // Si no hay token en la respuesta, consideramos que hubo un error
      if (!response.data.token) {
        throw new Error('Credenciales invalidas');
      }
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
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Credenciales inválidas');
        }
        const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(apiMessage || error.message || 'Error al iniciar sesión');
      }
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      throw new Error('Error al iniciar sesión');
    }
  }

  async socialLogin(provider: string, code: string): Promise<LoginResponse> {
    try {
      console.log('Iniciando social login con provider:', provider);
      console.log('Código recibido:', code ? 'Sí' : 'No');

      // Primero, obtener la información del usuario de Google usando el código
      const { googleUserInfo, accessToken } = await this.getGoogleUserInfo(code);

      // Preparar los datos que espera el backend
      const userData = {
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        password: accessToken // Usar el token de acceso de Google como "password"
      };

      console.log('Datos del usuario de Google:', googleUserInfo);
      console.log('Payload a enviar al backend:', userData);
      console.log('URL de la API:', process.env.NEXT_PUBLIC_API_URL);

      const response = await api.post<LoginResponse>('/auth/social-login', userData);

      console.log('Respuesta del servidor:', response.data);

      // Si no hay token en la respuesta, consideramos que hubo un error
      if (!response.data.token) {
        throw new Error('Error en la autenticación social');
      }
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      // Guardar la información del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        ...response.data,
        ok: true
      };
    } catch (error: unknown) {
      console.error('Error en social login:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const axiosError = error as { response: { data: { message?: string; error?: string } } };
        const errorMessage = axiosError.response.data?.message || axiosError.response.data?.error || 'Error en la autenticación social';
        throw new Error(errorMessage);
      } else if (error && typeof error === 'object' && 'request' in error) {
        // La petición fue hecha pero no se recibió respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Algo más causó el error
        const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión con Google';
        throw new Error(errorMessage);
      }
    }
  }

  private async getGoogleUserInfo(code: string): Promise<{ googleUserInfo: { email: string; name: string }; accessToken: string }> {
    try {
      // Intercambiar el código por un token de acceso
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
          redirect_uri: `${window.location.origin}/api/auth/callback/google`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        // Si falla con client_secret, intentar sin él (solo para desarrollo)
        console.warn('Fallback: intentando sin client_secret');
        const fallbackResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            redirect_uri: `${window.location.origin}/api/auth/callback/google`,
            grant_type: 'authorization_code',
          }),
        });

        if (!fallbackResponse.ok) {
          throw new Error('Error al obtener el token de acceso de Google');
        }

        const tokenData = await fallbackResponse.json();
        const idToken = tokenData.id_token;

        // Si tenemos ID token, decodificarlo para obtener la información del usuario
        if (idToken) {
          const userInfo = this.decodeJWT(idToken);
          const googleUserInfo = {
            email: userInfo.email,
            name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim()
          };

          return { googleUserInfo, accessToken: idToken };
        }
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Obtener la información del usuario usando el token de acceso
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Error al obtener la información del usuario de Google');
      }

      const userInfo = await userInfoResponse.json();

      const googleUserInfo = {
        email: userInfo.email,
        name: userInfo.name || userInfo.given_name + ' ' + userInfo.family_name
      };

      return { googleUserInfo, accessToken };
    } catch (error) {
      console.error('Error al obtener información del usuario de Google:', error);
      throw new Error('No se pudo obtener la información del usuario de Google');
    }
  }

  private decodeJWT(token: string): { email: string; name?: string; given_name?: string; family_name?: string } {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      throw new Error('Token JWT inválido');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as User & { _id?: string };
      // Normalizar id si viene del backend como _id
      if (user && !user.id && user._id) {
        user.id = user._id;
      }
      return user;
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async validateResetToken(token: string): Promise<boolean> {
    try {
      const response = await api.get<boolean>(`/auth/validate-reset-token/${token}`);
      return response.data;
    } catch {
      return false;
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      if (error instanceof AxiosError) {
        const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(apiMessage || error.message || 'Error al cambiar la contraseña');
      }
      throw new Error('Error al cambiar la contraseña');
    }
  }
  async requestPasswordRecovery(email: string, recaptchaToken?: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email, recaptchaToken });
    } catch (error) {
      console.error('Error en requestPasswordRecovery:', error);
      if (error instanceof AxiosError) {
        const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(apiMessage || error.message || 'Error al solicitar recuperación');
      }
      throw new Error('Error al solicitar recuperación');
    }
  }
}

export const authService = new AuthService(); 