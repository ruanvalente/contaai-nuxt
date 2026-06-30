export interface AuthUser {
  id: string
  email: string
  name: string | null
  profile: Profile | null
}

export interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  password: string
}

export type AuthErrorCode =
  | 'email_already_exists'
  | 'invalid_credentials'
  | 'weak_password'
  | 'network_error'
  | 'invalid_email'
  | 'session_expired'
  | 'unknown'

export function getAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '')

  if (message.includes('Email already registered') || message.includes('email_exists')) {
    return 'Este email já está cadastrado'
  }
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'Email ou senha inválidos'
  }
  if (message.includes('Password should be at least') || message.includes('weak_password') || message.includes('Weak password')) {
    return 'A senha deve ter no mínimo 8 caracteres'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Email ainda não confirmado. Verifique sua caixa de entrada.'
  }
  if (message.includes('expired') || message.includes('Expired')) {
    return 'Sessão expirada. Faça login novamente.'
  }

  return message || 'Ocorreu um erro inesperado'
}
