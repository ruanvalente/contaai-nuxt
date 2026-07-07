export interface UserMetrics {
  totalBooks: number
  publishedBooks: number
  drafts: number
  totalReads: number
  totalWords: number
  avgRating: number
}

export interface PlatformMetrics {
  totalAuthors: number
  totalBooks: number
  totalReaders: number
  totalWords: number
}

export interface CreateBookPayload {
  title: string
  author: string
  category: string
  coverColor: string
  coverUrl?: string
}

export const COVER_COLORS = [
  "#8B4513",
  "#A0522D",
  "#CD853F",
  "#D2691E",
  "#2E8B57",
  "#3CB371",
  "#4682B4",
  "#5F9EA0",
  "#6A5ACD",
  "#7B68EE",
  "#B22222",
  "#CD5C5C",
  "#DAA520",
  "#F0A500",
  "#2F4F4F",
  "#708090",
] as const

export type CoverColor = typeof COVER_COLORS[number]
