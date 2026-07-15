export interface DiscoveryCategory {
  id: string;
  label: string;
}

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  { id: "all", label: "All" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "fantasy", label: "Fantasy" },
  { id: "drama", label: "Drama" },
  { id: "business", label: "Business" },
  { id: "education", label: "Education" },
  { id: "geography", label: "Geography" },
];
