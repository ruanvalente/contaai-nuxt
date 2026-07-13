export interface UserBook {
  id: string
  user_id: string
  title: string
  author: string
  cover_url: string | null
  cover_color: string | null
  status: string
  reading_status: string
  reading_progress: number
  category: string
  word_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}
