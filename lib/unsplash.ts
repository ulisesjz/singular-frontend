import { CardImage } from "./types";

export const fetchImagesForCard = async (query: string): Promise<CardImage[]> => {
  const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Error fetching images for "${query}"`);
  return await res.json();
};

