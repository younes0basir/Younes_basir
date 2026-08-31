import type { GalleryEventType } from "../lib/appwrite-config.ts";
import type { MediaFields } from "./media.ts";

export type GalleryRecord = {
  id: string;
  title: string;
  description: string;
  eventType: GalleryEventType;
  date: string;
  location: string;
  order: number;
} & MediaFields;

export type GalleryFormData = Omit<GalleryRecord, "id">;
