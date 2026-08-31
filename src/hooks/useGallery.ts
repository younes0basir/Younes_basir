import { useQuery } from "@tanstack/react-query";
import { fetchGalleryItems } from "../lib/gallery.ts";

export function useGallery() {
  const query = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryItems,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    items: query.data ?? [],
  };
}
