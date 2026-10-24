import { getCloudinaryImageUrl } from "./cloudinary.ts";
import { apiRequest } from "./api.ts";
import { resolveMainImagePublicId, type ImageFrame } from "../types/media.ts";
import type { GalleryRecord } from "../types/gallery.ts";

export function getGalleryImageUrl(
  publicId: string,
  frame: ImageFrame = "landscape",
  baseWidth = 960,
): string {
  return getCloudinaryImageUrl(publicId, frame, baseWidth);
}

export function getGalleryMainImage(record: GalleryRecord): string {
  return resolveMainImagePublicId(record);
}

export async function fetchGalleryItems(): Promise<GalleryRecord[]> {
  try {
    const records = await apiRequest<GalleryRecord[]>("/api/gallery");
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error("[gallery] fetch failed:", error);
    throw error;
  }
}
