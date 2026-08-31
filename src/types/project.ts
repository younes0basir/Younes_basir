import type { LucideIcon } from "lucide-react";
import type { MediaFields } from "./media.ts";

export type ProjectRecord = {
  id: string;
  title: string;
  number: string;
  category: string;
  description: string;
  icon: string;
  stack: string[];
  items: string[];
  href?: string;
  sourceHref?: string;
  featured: boolean;
  order: number;
} & MediaFields;

export type ProjectCard = Omit<ProjectRecord, "icon"> & {
  icon: LucideIcon;
};
