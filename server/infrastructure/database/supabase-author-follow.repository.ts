import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import { IAuthorFollowRepository, FollowedAuthor, AuthorStats } from "../../domain/repositories/author-follow.repository"

export class SupabaseAuthorFollowRepository implements IAuthorFollowRepository {
  constructor(private event: H3Event) {}

  async follow(authorName: string, userId?: string, sessionId?: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    const insertData: Record<string, unknown> = {
      author_name: authorName,
      created_at: new Date().toISOString(),
    }

    if (userId) {
      insertData.user_id = userId
    } else if (sessionId) {
      insertData.session_id = sessionId
      insertData.user_id = null
    } else {
      return false
    }

    const { error } = await supabase.from("author_follow").insert(insertData)

    if (error) {
      if (error.code === "23505") return true
      console.error("Error in follow:", error)
      return false
    }

    return true
  }

  async unfollow(authorName: string, userId?: string, sessionId?: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    let query = supabase
      .from("author_follow")
      .delete()
      .eq("author_name", authorName)

    if (userId) {
      query = query.eq("user_id", userId)
    } else if (sessionId) {
      query = supabase
        .from("author_follow")
        .delete()
        .eq("author_name", authorName)
        .eq("session_id", sessionId)
        .is("user_id", null)
    } else {
      return false
    }

    const { error } = await query
    if (error) {
      console.error("Error in unfollow:", error)
      return false
    }

    return true
  }

  async getFollowedAuthors(userId?: string, sessionId?: string): Promise<FollowedAuthor[]> {
    if (!userId && !sessionId) return []

    const supabase = await serverSupabaseClient(this.event)
    let query = supabase
      .from("author_follow")
      .select("author_name, created_at")
      .order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    } else if (sessionId) {
      query = query.eq("session_id", sessionId).is("user_id", null)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching followed authors:", error)
      return []
    }

    return (data || []).map((row: { author_name: string; created_at: string }) => ({
      authorName: row.author_name,
      createdAt: row.created_at,
    }))
  }

  async countFollowers(authorName: string): Promise<number> {
    const supabase = await serverSupabaseClient(this.event)
    const { data } = await supabase
      .from("author_follow")
      .select("author_name")
      .eq("author_name", authorName)
    return data?.length || 0
  }

  async clearSession(sessionId: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)
    const { error } = await supabase
      .from("author_follow")
      .delete()
      .eq("session_id", sessionId)
      .is("user_id", null)
    return !error
  }

  async countPublishedBooks(authorName: string): Promise<number> {
    const supabase = await serverSupabaseClient(this.event)
    const { data } = await supabase
      .from("user_books")
      .select("author")
      .eq("author", authorName)
      .eq("status", "published")
    return data?.length || 0
  }
}
