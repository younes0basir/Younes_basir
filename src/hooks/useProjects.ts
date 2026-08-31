import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PROJECTS, fetchProjects, toProjectCards } from "../lib/projects.ts";

export function useProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_PROJECTS,
  });

  return {
    ...query,
    projects: toProjectCards(query.data ?? DEFAULT_PROJECTS),
  };
}
