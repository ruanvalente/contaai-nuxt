export interface UserMetrics {
  totalBooks: number;
  publishedBooks: number;
  drafts: number;
  totalReads: number;
  totalWords: number;
  avgRating: number;
}

export interface PlatformMetrics {
  totalAuthors: number;
  totalBooks: number;
  totalReaders: number;
  totalWords: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  category: string;
  coverColor: string;
  coverUrl?: string;
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
] as const;

export type CoverColor = (typeof COVER_COLORS)[number];

import type { SelectItem } from '@nuxt/ui'

export const BOOK_CATEGORY_OPTIONS: SelectItem[] = [
  { label: "Ficção", value: "Ficção" },
  { label: "Não-Ficção", value: "Não-Ficção" },
  { label: "Fantasia", value: "Fantasia" },
  { label: "Ficção Científica", value: "Ficção Científica" },
  { label: "Romance", value: "Romance" },
  { label: "Mistério", value: "Mistério" },
  { label: "Terror", value: "Terror" },
  { label: "Aventura", value: "Aventura" },
  { label: "Biografia", value: "Biografia" },
  { label: "Autoajuda", value: "Autoajuda" },
  { label: "Negócios", value: "Negócios" },
  { label: "Educação", value: "Educação" },
  { label: "Infantil", value: "Infantil" },
  { label: "Poesia", value: "Poesia" },
  { label: "Outro", value: "Outro" },
]
