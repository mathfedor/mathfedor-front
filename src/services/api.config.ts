import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log('API_URL configurada:', API_URL);

if (!API_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('Petición HTTP:', config.method?.toUpperCase(), config.url);
    console.log('Base URL:', config.baseURL);
    console.log('URL completa:', (config.baseURL || '') + (config.url || ''));
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Si el token expiró o es inválido, cerrar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 