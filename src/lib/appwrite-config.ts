export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "6a948879000ebb5b9ea1";

export const PROJECTS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID ?? "projects";

export const GALLERY_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_GALLERY_COLLECTION_ID ?? "gallery";

export const GALLERY_BUCKET_ID = import.meta.env.VITE_APPWRITE_GALLERY_BUCKET_ID ?? "gallery";

export { PROJECT_ICON_OPTIONS, type ProjectIconKey } from "./project-icons.ts";

export const GALLERY_EVENT_TYPES = ["hackathon", "outdoor", "meeting"] as const;

export type GalleryEventType = (typeof GALLERY_EVENT_TYPES)[number];

export function galleryEventLabel(type: GalleryEventType): string {
  switch (type) {
    case "hackathon":
      return "Hackathon";
    case "outdoor":
      return "Outdoor";
    case "meeting":
      return "Meetup";
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}
