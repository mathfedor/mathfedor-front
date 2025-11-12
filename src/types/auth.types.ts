export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastName: string;
  avatar?: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  ok: boolean;
  message?: string;
} 