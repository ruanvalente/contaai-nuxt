import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthUser, Profile } from '~/types/auth'

export async function getProfile(client: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function ensureProfile(
  client: SupabaseClient,
  userId: string,
  name?: string | null,
): Promise<Profile> {
  const existing = await getProfile(client, userId)
  if (existing) return existing

  const { data, error } = await client
    .from('profiles')
    .insert({ id: userId, name: name ?? null })
    .select()
    .single()

  if (error) throw error
  return data
}

export function mapSupabaseUser(
  supabaseUser: { id?: string; sub?: string; email?: string | null; user_metadata?: { full_name?: string | null } },
  profile: Profile | null,
): AuthUser {
  return {
    id: supabaseUser.id ?? supabaseUser.sub ?? '',
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.full_name ?? null,
    profile,
  }
}
