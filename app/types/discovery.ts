export interface DiscoveryBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  rating: number;
  reviews: number;
  category: string;
}

export interface DiscoveryCategory {
  id: string;
  label: string;
}

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  { id: "All", label: "All" },
  { id: "Sci-Fi", label: "Sci-Fi" },
  { id: "Fantasy", label: "Fantasy" },
  { id: "Drama", label: "Drama" },
  { id: "Business", label: "Business" },
  { id: "Education", label: "Education" },
  { id: "Geography", label: "Geography" },
];
