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
