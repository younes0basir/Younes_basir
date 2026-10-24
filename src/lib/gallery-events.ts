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

export function isGalleryEventType(value: string): value is GalleryEventType {
  switch (value) {
    case "hackathon":
    case "outdoor":
    case "meeting":
      return true;
    default:
      return false;
  }
}
