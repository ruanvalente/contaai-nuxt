import type { SupabaseClient } from '@supabase/supabase-js'
import type { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from '~/types/auth'

export async function loginUser(client: SupabaseClient, payload: LoginPayload) {
  const { data, error } = await client.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  })
  if (error) throw error
  return data
}

export async function registerUser(client: SupabaseClient, payload: RegisterPayload) {
  const { data, error } = await client.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: { full_name: payload.name },
    },
  })
  if (error) throw error
  return data
}

export async function logoutUser(client: SupabaseClient) {
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function sendPasswordReset(client: SupabaseClient, payload: ForgotPasswordPayload) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { error } = await client.auth.resetPasswordForEmail(payload.email, {
    redirectTo: `${origin}/auth/reset-password`,
  })
  if (error) throw error
}

export async function updateUserPassword(client: SupabaseClient, payload: ResetPasswordPayload) {
  const { data, error } = await client.auth.updateUser({
    password: payload.password,
  })
  if (error) throw error
  return data
}
