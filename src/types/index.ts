export interface Idea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  rating: number;
  insight: string;
  votes: number;
  createdAt: number;
}

export type SortOption = "rating" | "votes" | "newest";

export interface NewIdeaInput {
  name: string;
  tagline: string;
  description: string;
}
