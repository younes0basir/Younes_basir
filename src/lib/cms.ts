import { uploadGalleryImages, uploadProjectImages } from "./cloudinary.ts";
import { apiRequest } from "./api.ts";
import type { GalleryFormData, GalleryRecord } from "../types/gallery.ts";
import type { ProjectRecord } from "../types/project.ts";

export type ProjectFormData = Omit<ProjectRecord, "id">;

export async function listProjectsAdmin(): Promise<ProjectRecord[]> {
  return apiRequest<ProjectRecord[]>("/api/projects");
}

export async function createProject(data: ProjectFormData): Promise<void> {
  await apiRequest("/api/projects", { method: "POST", body: data });
}

export async function updateProject(id: string, data: ProjectFormData): Promise<void> {
  await apiRequest(`/api/projects/${encodeURIComponent(id)}`, { method: "PUT", body: data });
}

export async function deleteProject(id: string): Promise<void> {
  await apiRequest(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function listGalleryAdmin(): Promise<GalleryRecord[]> {
  return apiRequest<GalleryRecord[]>("/api/gallery");
}

export async function createGalleryItem(data: GalleryFormData): Promise<void> {
  await apiRequest("/api/gallery", { method: "POST", body: data });
}

export async function updateGalleryItem(id: string, data: GalleryFormData): Promise<void> {
  await apiRequest(`/api/gallery/${encodeURIComponent(id)}`, { method: "PUT", body: data });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await apiRequest(`/api/gallery/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export { uploadGalleryImages, uploadProjectImages };
