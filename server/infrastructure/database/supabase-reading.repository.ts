import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import { IReadingRepository } from "../../domain/repositories/reading.repository"
import { ReadingProgress, SaveReadingProgressInput } from "../../domain/entities/reading-progress.entity"

type ReadingProgressRow = {
  id: string
  user_id: string
  book_id: string
  current_position: { scrollTop?: number; elementId?: string }
  progress_percent: number
  started_at: string
  finished_at: string | null
}

function mapToReadingProgress(row: ReadingProgressRow): ReadingProgress {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    currentPosition: row.current_position,
    progressPercent: row.progress_percent,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
  }
}

export class SupabaseReadingRepository implements IReadingRepository {
  constructor(private event: H3Event) {}

  async getByUserAndBook(userId: string, bookId: string): Promise<ReadingProgress | null> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("book_reading_progress")
      .select("id, user_id, book_id, current_position, progress_percent, started_at, finished_at")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching reading progress:", error)
      return null
    }

    return data ? mapToReadingProgress(data as ReadingProgressRow) : null
  }

  async save(input: SaveReadingProgressInput): Promise<ReadingProgress> {
    const supabase = await serverSupabaseClient(this.event)
    const isCompleted = input.progressPercent >= 95

    const { data, error } = await supabase
      .from("book_reading_progress")
      .upsert(
        {
          user_id: input.userId,
          book_id: input.bookId,
          current_position: input.currentPosition,
          progress_percent: Math.min(100, Math.max(0, input.progressPercent)),
          finished_at: isCompleted ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,book_id" },
      )
      .select()
      .single()

    if (error) {
      throw new Error("Failed to save reading progress")
    }

    return mapToReadingProgress(data as ReadingProgressRow)
  }

  async getByUser(userId: string): Promise<ReadingProgress[]> {
    const supabase = await serverSupabaseClient(this.event)

    const { data, error } = await supabase
      .from("book_reading_progress")
      .select("id, user_id, book_id, current_position, progress_percent, started_at, finished_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })

    if (error) {
      console.error("Error fetching reading progress:", error)
      return []
    }

    return (data || []).map(r => mapToReadingProgress(r as ReadingProgressRow))
  }
}
