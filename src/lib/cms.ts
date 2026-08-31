import { Databases, ID, Permission, Query, Role } from "appwrite";
import { uploadGalleryImages, uploadProjectImages } from "./cloudinary.ts";
import { appwriteClient } from "./appwrite.ts";
import {
  APPWRITE_DATABASE_ID,
  GALLERY_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
} from "./appwrite-config.ts";
import type { GalleryFormData } from "../types/gallery.ts";
import { normalizeMediaFields, resolveMainImagePublicId } from "../types/media.ts";
import type { ProjectRecord } from "../types/project.ts";

export type ProjectFormData = Omit<ProjectRecord, "id">;

const documentPermissions = [Permission.read(Role.any())];

function mediaPayload(media: ReturnType<typeof normalizeMediaFields>) {
  const mainImagePublicId = resolveMainImagePublicId(media);

  return {
    imagePublicIds: media.imagePublicIds,
    mainImagePublicId,
    imageFrame: media.imageFrame,
    imagePublicId: mainImagePublicId,
  };
}

function readMedia(document: Record<string, unknown>) {
  return normalizeMediaFields({
    imagePublicIds: document.imagePublicIds as string[] | undefined,
    mainImagePublicId: document.mainImagePublicId as string | undefined,
    imageFrame: document.imageFrame as string | undefined,
    imagePublicId: document.imagePublicId as string | undefined,
    imageFileId: document.imageFileId as string | undefined,
  });
}

export async function listProjectsAdmin(): Promise<ProjectRecord[]> {
  const databases = new Databases(appwriteClient);
  const response = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: PROJECTS_COLLECTION_ID,
    queries: [Query.orderAsc("order")],
  });

  return response.documents.map((document) => {
    const media = readMedia(document);

    return {
      id: document.$id,
      title: document.title as string,
      number: document.number as string,
      category: document.category as string,
      description: document.description as string,
      icon: document.icon as string,
      stack: document.stack as string[],
      items: document.items as string[],
      href: (document.href as string) || undefined,
      sourceHref: (document.sourceHref as string) || undefined,
      featured: Boolean(document.featured),
      order: document.order as number,
      ...media,
    };
  });
}

export async function createProject(data: ProjectFormData): Promise<void> {
  const databases = new Databases(appwriteClient);
  const media = normalizeMediaFields(data);

  await databases.createDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: PROJECTS_COLLECTION_ID,
    documentId: ID.unique(),
    data: {
      title: data.title,
      number: data.number,
      category: data.category,
      description: data.description,
      icon: data.icon,
      stack: data.stack,
      items: data.items,
      href: data.href ?? "",
      sourceHref: data.sourceHref ?? "",
      featured: data.featured,
      order: data.order,
      ...mediaPayload(media),
    },
    permissions: documentPermissions,
  });
}

export async function updateProject(id: string, data: ProjectFormData): Promise<void> {
  const databases = new Databases(appwriteClient);
  const media = normalizeMediaFields(data);

  await databases.updateDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: PROJECTS_COLLECTION_ID,
    documentId: id,
    data: {
      title: data.title,
      number: data.number,
      category: data.category,
      description: data.description,
      icon: data.icon,
      stack: data.stack,
      items: data.items,
      href: data.href ?? "",
      sourceHref: data.sourceHref ?? "",
      featured: data.featured,
      order: data.order,
      ...mediaPayload(media),
    },
  });
}

export async function deleteProject(id: string): Promise<void> {
  const databases = new Databases(appwriteClient);
  await databases.deleteDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: PROJECTS_COLLECTION_ID,
    documentId: id,
  });
}

export async function listGalleryAdmin() {
  const databases = new Databases(appwriteClient);
  const response = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: GALLERY_COLLECTION_ID,
    queries: [Query.orderAsc("order"), Query.orderDesc("date")],
  });

  return response.documents.map((document) => {
    const media = readMedia(document);

    return {
      id: document.$id,
      title: document.title as string,
      description: document.description as string,
      eventType: document.eventType as GalleryFormData["eventType"],
      date: document.date as string,
      location: document.location as string,
      order: document.order as number,
      ...media,
    };
  });
}

export { uploadGalleryImages, uploadProjectImages };

export async function createGalleryItem(data: GalleryFormData): Promise<void> {
  const databases = new Databases(appwriteClient);
  const media = normalizeMediaFields(data);

  await databases.createDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: GALLERY_COLLECTION_ID,
    documentId: ID.unique(),
    data: {
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      date: data.date,
      location: data.location,
      order: data.order,
      ...mediaPayload(media),
    },
    permissions: documentPermissions,
  });
}

export async function updateGalleryItem(id: string, data: GalleryFormData): Promise<void> {
  const databases = new Databases(appwriteClient);
  const media = normalizeMediaFields(data);

  await databases.updateDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: GALLERY_COLLECTION_ID,
    documentId: id,
    data: {
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      date: data.date,
      location: data.location,
      order: data.order,
      ...mediaPayload(media),
    },
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const databases = new Databases(appwriteClient);
  await databases.deleteDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: GALLERY_COLLECTION_ID,
    documentId: id,
  });
}
