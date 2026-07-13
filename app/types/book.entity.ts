export type BookCategory =
  | "Ficção Científica"
  | "Fantasia"
  | "Drama"
  | "Negócios"
  | "Educação"
  | "Geografia";

export type Category = "All" | BookCategory;

export const CATEGORIES: Category[] = [
  "All", "Ficção Científica", "Fantasia", "Drama", "Negócios", "Educação", "Geografia"
];

export const BOOK_CATEGORIES: BookCategory[] = [
  "Ficção Científica", "Fantasia", "Drama", "Negócios", "Educação", "Geografia"
];

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverColor: string;
  description: string;
  category: BookCategory;
  pages: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  createdAt: Date;
}

export type BookListItem = Pick<
  Book,
  | "id"
  | "title"
  | "author"
  | "coverUrl"
  | "coverColor"
  | "category"
  | "rating"
>;

export type BookStats = {
  pages: number;
  ratings: number;
  reviews: number;
};

export type ApiBook = {
  id: string
  title: string
  author: string
  cover_url: string | null
  cover_color: string | null
  category: string
  rating: number | string | null
  rating_count: number | null
  review_count: number | null
  created_at: string
  pages: number | null
  description: string | null
};

export function mapApiToBookListItem(book: ApiBook): BookListItem {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.cover_url || undefined,
    coverColor: book.cover_color || '#8B4513',
    category: book.category as BookCategory,
    rating: typeof book.rating === 'string' ? parseFloat(book.rating) : (book.rating || 0),
  }
}

export function mapToBook(item: BookListItem): Book {
  return {
    id: item.id,
    title: item.title,
    author: item.author,
    coverUrl: item.coverUrl || '',
    coverColor: item.coverColor,
    rating: item.rating || 0,
    description: '',
    category: item.category,
    pages: 0,
    ratingCount: 0,
    reviewCount: 0,
    createdAt: new Date(),
  }
}
