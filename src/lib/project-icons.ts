import {
  Activity,
  ChartColumn,
  Code2,
  Database,
  FolderGit2,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  ShoppingBag,
  Stethoscope,
  Store,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const PROJECT_ICON_OPTIONS = [
  "graduation-cap",
  "store",
  "stethoscope",
  "folder-git",
  "trophy",
  "chart",
  "heart-pulse",
  "shopping-bag",
  "code",
  "database",
  "layout",
  "activity",
] as const;

export type ProjectIconKey = (typeof PROJECT_ICON_OPTIONS)[number];

type ProjectIconMeta = {
  icon: LucideIcon;
  label: string;
};

const PROJECT_ICONS: Record<ProjectIconKey, ProjectIconMeta> = {
  "graduation-cap": { icon: GraduationCap, label: "Education" },
  store: { icon: Store, label: "Store" },
  stethoscope: { icon: Stethoscope, label: "Medical" },
  "folder-git": { icon: FolderGit2, label: "Code repo" },
  trophy: { icon: Trophy, label: "Sports" },
  chart: { icon: ChartColumn, label: "Analytics" },
  "heart-pulse": { icon: HeartPulse, label: "Health" },
  "shopping-bag": { icon: ShoppingBag, label: "Commerce" },
  code: { icon: Code2, label: "App" },
  database: { icon: Database, label: "Data" },
  layout: { icon: LayoutDashboard, label: "Dashboard" },
  activity: { icon: Activity, label: "Activity" },
};

export function isProjectIconKey(value: string): value is ProjectIconKey {
  return PROJECT_ICON_OPTIONS.includes(value as ProjectIconKey);
}

export function resolveProjectIcon(key: string): LucideIcon {
  if (isProjectIconKey(key)) {
    return PROJECT_ICONS[key].icon;
  }

  return FolderGit2;
}

export function projectIconLabel(key: string): string {
  if (isProjectIconKey(key)) {
    return PROJECT_ICONS[key].label;
  }

  return "Icon";
}
