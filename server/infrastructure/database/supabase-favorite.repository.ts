import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import { IFavoriteRepository, UserFavorite, FavoriteBook } from "../../domain/repositories/favorite.repository"

type FavoriteRow = {
  id: string
  user_id: string
  book_id: string
  created_at: string
}

type UnifiedBookRow = {
  id: string
  title: string
  author: string
  cover_color: string | null
  cover_url: string | null
  category: string | null
}

export class SupabaseFavoriteRepository implements IFavoriteRepository {
  constructor(private event: H3Event) {}

  async add(userId: string | null, book: FavoriteBook): Promise<boolean> {
    try {
      const supabase = await serverSupabaseClient(this.event)

      const insertData: Record<string, unknown> = {
        book_id: book.id,
      }

      if (userId && userId.startsWith("anonymous-")) {
        insertData.session_id = userId
        insertData.user_id = null
      } else if (userId) {
        insertData.user_id = userId
      } else {
        console.error("Invalid user/session ID")
        return false
      }

      const { error } = await supabase
        .from("user_favorites")
        .insert(insertData)

      if (error) {
        if (error.code === "23505") return true
        console.error("Error adding to favorites:", error)
        return false
      }

      return true
    } catch (err) {
      console.error("Error in add:", err)
      return false
    }
  }

  async remove(userId: string, bookId: string): Promise<boolean> {
    try {
      const supabase = await serverSupabaseClient(this.event)

      let query = supabase
        .from("user_favorites")
        .delete()
        .eq("book_id", bookId)

      if (userId && userId.startsWith("anonymous-")) {
        query = query.eq("session_id", userId).is("user_id", null)
      } else {
        query = query.eq("user_id", userId)
      }

      const { error } = await query

      if (error) {
        console.error("Error removing from favorites:", error)
        return false
      }

      return true
    } catch (err) {
      console.error("Error in remove:", err)
      return false
    }
  }

  async getByUser(userId: string): Promise<UserFavorite[]> {
    try {
      const supabase = await serverSupabaseClient(this.event)

      let query = supabase
        .from("user_favorites")
        .select("id, user_id, book_id, created_at")
        .order("created_at", { ascending: false })

      if (userId && userId.startsWith("anonymous-")) {
        query = query.eq("session_id", userId).is("user_id", null)
      } else {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching favorites:", error)
        return []
      }

      if (!data || data.length === 0) return []

      const bookIds = data.map(row => (row as FavoriteRow).book_id)
      const { data: books } = await supabase
        .from("unified_books")
        .select("id, title, author, cover_color, cover_url, category")
        .in("id", bookIds)

      const bookMap = new Map<string, UnifiedBookRow>(
        (books as UnifiedBookRow[] | null)?.map(b => [b.id, b]) ?? []
      )

      return (data as FavoriteRow[]).map(row => {
        const book = bookMap.get(row.book_id)
        return {
          id: row.id,
          userId: row.user_id ?? "",
          bookId: row.book_id,
          bookTitle: book?.title ?? "Unknown",
          bookAuthor: book?.author ?? "Unknown",
          bookCoverColor: book?.cover_color ?? undefined,
          bookCoverUrl: book?.cover_url ?? undefined,
          bookCategory: book?.category ?? undefined,
          createdAt: new Date(row.created_at),
        }
      })
    } catch (err) {
      console.error("Error in getByUser:", err)
      return []
    }
  }

  async countByBookId(bookId: string): Promise<number> {
    try {
      const supabase = await serverSupabaseClient(this.event)
      const { data } = await supabase
        .from("user_favorites")
        .select("book_id")
        .eq("book_id", bookId)
      return data?.length || 0
    } catch {
      return 0
    }
  }

  async clearSession(sessionId: string): Promise<boolean> {
    try {
      const supabase = await serverSupabaseClient(this.event)
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("session_id", sessionId)
        .is("user_id", null)
      return !error
    } catch {
      return false
    }
  }

  async isFavorited(userId: string | null, bookId: string): Promise<boolean> {
    if (!userId) return false

    try {
      const supabase = await serverSupabaseClient(this.event)

      let query

      if (userId.startsWith("anonymous-")) {
        query = supabase
          .from("user_favorites")
          .select("id", { count: "exact", head: true })
          .eq("session_id", userId)
          .eq("book_id", bookId)
      } else {
        query = supabase
          .from("user_favorites")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("book_id", bookId)
      }

      const { count, error } = await query

      if (error) return false

      return (count ?? 0) > 0
    } catch {
      return false
    }
  }
}
