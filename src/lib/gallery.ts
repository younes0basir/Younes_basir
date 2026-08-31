import { Databases, Query, type Models } from "appwrite";
import { getCloudinaryImageUrl } from "./cloudinary.ts";
import { appwriteClient, appwriteConfigured } from "./appwrite.ts";
import {
  APPWRITE_DATABASE_ID,
  GALLERY_COLLECTION_ID,
  type GalleryEventType,
} from "./appwrite-config.ts";
import type { GalleryRecord } from "../types/gallery.ts";
import { normalizeMediaFields, resolveMainImagePublicId } from "../types/media.ts";
import type { ImageFrame } from "../types/media.ts";

type GalleryDocument = Models.Document & {
  title: string;
  description: string;
  eventType: GalleryEventType;
  date: string;
  location: string;
  imagePublicIds?: string[];
  mainImagePublicId?: string;
  imageFrame?: string;
  imagePublicId?: string;
  imageFileId?: string;
  order: number;
};

function mapDocumentToRecord(document: GalleryDocument): GalleryRecord {
  const media = normalizeMediaFields(document);

  return {
    id: document.$id,
    title: document.title,
    description: document.description,
    eventType: document.eventType,
    date: document.date,
    location: document.location,
    order: document.order,
    ...media,
  };
}

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
  if (!appwriteConfigured) {
    return [];
  }

  const databases = new Databases(appwriteClient);
  const response = await databases.listDocuments<GalleryDocument>({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: GALLERY_COLLECTION_ID,
    queries: [Query.orderAsc("order"), Query.orderDesc("date")],
  });

  return response.documents.map(mapDocumentToRecord);
}
