export interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface Student {
  country?: string | null;
  department?: string | null;
  city?: string | null;
  institution?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastName: string;
  avatar?: string;
  student?: Student;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  rol: string;
  student?: Student;
  recaptchaToken?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  ok: boolean;
  message?: string;
} 