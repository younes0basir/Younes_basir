import type { ProjectCard, ProjectRecord } from "../types/project.ts";
import { DEFAULT_PROJECTS } from "./default-projects.ts";
import { apiRequest } from "./api.ts";
import { resolveProjectIcon } from "./project-icons.ts";

export { DEFAULT_PROJECTS };

export function toProjectCards(records: ProjectRecord[]): ProjectCard[] {
  return records.map((record) => ({
    ...record,
    icon: resolveProjectIcon(record.icon),
  }));
}

export async function fetchProjects(): Promise<ProjectRecord[]> {
  try {
    const records = await apiRequest<ProjectRecord[]>("/api/projects");
    if (!Array.isArray(records) || records.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return records;
  } catch (error) {
    console.error("[projects] fetch failed:", error);
    throw error;
  }
}
