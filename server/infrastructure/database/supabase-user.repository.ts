import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import { IUserRepository, UserRole } from "../../domain/repositories/user.repository"
import { User, UpdateUserInput } from "../../domain/entities/user.entity"
import { mapToUserEntity } from "../mappers/user.mapper"

export class SupabaseUserRepository implements IUserRepository {
  constructor(private event: H3Event) {}

  async getById(id: string): Promise<User | null> {
    const supabase = await serverSupabaseClient(this.event)

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, bio, created_at, updated_at")
      .eq("id", id)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
      return null
    }

    if (!profile) return null

    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.email || ""

    return mapToUserEntity(profile, email)
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const supabase = await serverSupabaseClient(this.event)

    const updates: Record<string, string | null> = {}
    if (data.name !== undefined) updates.name = data.name || null
    if (data.bio !== undefined) updates.bio = data.bio || null
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl || null
    updates.updated_at = new Date().toISOString()

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .upsert({ id, ...updates })
      .select()
      .single()

    if (error) {
      throw new Error("Failed to update user")
    }

    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.email || ""

    return mapToUserEntity(updatedProfile, email)
  }

  async getByEmail(email: string): Promise<User | null> {
    return null
  }

  async getRole(userId: string): Promise<UserRole | null> {
    const supabase = await serverSupabaseClient(this.event)

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (profile?.role) return profile.role as UserRole

    const { count } = await supabase
      .from("user_books")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "published")

    if (count && count > 0) return "author"

    return "reader"
  }
}
