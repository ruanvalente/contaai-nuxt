import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import { IUserBookRepository, UserBookFilter } from "../../domain/repositories/user-book.repository"
import { UserBook, UserBookStatus, ReadingStatus } from "../../domain/entities/user-book.entity"

type UserBookRow = {
  id: string
  user_id: string
  title: string
  author: string
  cover_url: string | null
  cover_color: string
  content?: string | null
  content_url?: string | null
  status: "draft" | "published"
  reading_status: "none" | "reading" | "completed"
  reading_progress: number
  category: string
  word_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

function mapToUserBook(row: UserBookRow): UserBook {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url || undefined,
    coverColor: row.cover_color,
    content: row.content || undefined,
    contentUrl: row.content_url || undefined,
    status: row.status,
    readingStatus: row.reading_status,
    readingProgress: row.reading_progress,
    category: row.category as UserBook["category"],
    wordCount: row.word_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
  }
}

export class SupabaseUserBookRepository implements IUserBookRepository {
  constructor(private event: H3Event) {}

  async getByUserId(userId: string, filter: UserBookFilter): Promise<UserBook[]> {
    const supabase = await serverSupabaseClient(this.event)

    let query = supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("user_id", userId)

    switch (filter) {
      case "my-stories":
        query = query.in("status", ["draft", "published"])
        break
      case "reading":
        query = query.eq("reading_status", "reading")
        break
      case "completed":
        query = query.eq("reading_status", "completed")
        break
    }

    const { data, error } = await query.order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching user books:", error)
      return []
    }

    return (data || []).map(r => mapToUserBook(r as UserBookRow))
  }

  async getById(id: string): Promise<UserBook | null> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, content, content_url, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching user book:", error)
      return null
    }

    return mapToUserBook(data as UserBookRow)
  }

  async create(userId: string, data: { title: string; author: string; coverColor?: string; category: string }): Promise<UserBook> {
    const supabase = await serverSupabaseClient(this.event)

    const { data: book, error } = await supabase
      .from("user_books")
      .insert({
        user_id: userId,
        title: data.title,
        author: data.author,
        cover_color: data.coverColor || "#8B4513",
        category: data.category,
        status: "draft",
        reading_status: "none",
        reading_progress: 0,
        word_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user book:", error)
      throw error
    }

    return mapToUserBook(book as UserBookRow)
  }

  async update(id: string, data: Partial<{ title: string; author: string; content: string; coverUrl: string; status: string; readingStatus: string; readingProgress: number; wordCount: number }>): Promise<UserBook | null> {
    const supabase = await serverSupabaseClient(this.event)

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.author !== undefined) updateData.author = data.author
    if (data.content !== undefined) updateData.content = data.content
    if (data.coverUrl !== undefined) updateData.cover_url = data.coverUrl
    if (data.status !== undefined) updateData.status = data.status
    if (data.readingStatus !== undefined) updateData.reading_status = data.readingStatus
    if (data.readingProgress !== undefined) updateData.reading_progress = data.readingProgress
    if (data.wordCount !== undefined) updateData.word_count = data.wordCount

    const { data: book, error } = await supabase
      .from("user_books")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user book:", error)
      return null
    }

    return mapToUserBook(book as UserBookRow)
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    const { error } = await supabase
      .from("user_books")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error deleting user book:", error)
      return false
    }

    return true
  }

  async getByUserIdAndStatus(userId: string, status: UserBookStatus): Promise<UserBook[]> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("user_id", userId)
      .eq("status", status)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching user books by status:", error)
      return []
    }

    return (data || []).map(r => mapToUserBook(r as UserBookRow))
  }

  async getReadingBooks(userId: string): Promise<UserBook[]> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("user_id", userId)
      .eq("reading_status", "reading")
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching reading books:", error)
      return []
    }

    return (data || []).map(r => mapToUserBook(r as UserBookRow))
  }

  async getCompletedBooks(userId: string): Promise<UserBook[]> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("user_id", userId)
      .eq("reading_status", "completed")
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching completed books:", error)
      return []
    }

    return (data || []).map(r => mapToUserBook(r as UserBookRow))
  }

  async getPublishedBooks(): Promise<UserBook[]> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("user_books")
      .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching published books:", error)
      return []
    }

    return (data || []).map(r => mapToUserBook(r as UserBookRow))
  }

  async saveContent(id: string, content: string, userId: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length

    const { error } = await supabase
      .from("user_books")
      .update({
        content,
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error saving content:", error)
      return false
    }

    return true
  }

  async publish(id: string, userId: string): Promise<UserBook | null> {
    const supabase = await serverSupabaseClient(this.event)

    const { error } = await supabase
      .from("user_books")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error publishing book:", error)
      return null
    }

    return this.getById(id)
  }

  async setReadingStatus(id: string, status: ReadingStatus, userId: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    const updateData: Record<string, unknown> = {
      reading_status: status,
    }

    if (status === "reading") {
      updateData.reading_progress = 0
    } else if (status === "completed") {
      updateData.reading_progress = 100
    }

    const { error } = await supabase
      .from("user_books")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error setting reading status:", error)
      return false
    }

    return true
  }

  async setReadingProgress(id: string, progress: number, userId: string): Promise<boolean> {
    const supabase = await serverSupabaseClient(this.event)

    let readingStatus: ReadingStatus = "reading"
    if (progress >= 100) {
      readingStatus = "completed"
    } else if (progress <= 0) {
      readingStatus = "none"
    }

    const { error } = await supabase
      .from("user_books")
      .update({
        reading_progress: Math.min(100, Math.max(0, progress)),
        reading_status: readingStatus,
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error setting reading progress:", error)
      return false
    }

    return true
  }
}
