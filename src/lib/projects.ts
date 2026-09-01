import { Databases, Query, type Models } from "appwrite";
import type { ProjectCard, ProjectRecord } from "../types/project.ts";
import { appwriteClient, appwriteConfigured } from "./appwrite.ts";
import { APPWRITE_DATABASE_ID, PROJECTS_COLLECTION_ID } from "./appwrite-config.ts";
import { resolveProjectIcon } from "./project-icons.ts";
import { emptyMediaFields, normalizeMediaFields } from "../types/media.ts";

export const DEFAULT_PROJECTS: ProjectRecord[] = [
  {
    id: "courseward",
    title: "CourseWard",
    number: "01",
    category: "E-learning",
    description: "Academic platform for course management, authentication, and student data.",
    icon: "graduation-cap",
    ...emptyMediaFields(),
    stack: ["React", "Vite", "Tailwind CSS", "Express.js", "PostgreSQL"],
    items: [
      "Course management and authentication",
      "Complete REST API",
      "Modern, responsive interface",
    ],
    href: "https://courseward-14va.onrender.com/",
    featured: true,
    order: 1,
  },
  {
    id: "quincaillerie-fassi",
    title: "Quincaillerie Fassi",
    number: "02",
    category: "E-commerce",
    description: "Hardware storefront with catalog search, cart, checkout, and admin tools.",
    icon: "store",
    ...emptyMediaFields(),
    stack: ["React", "Node.js", "MongoDB"],
    items: [
      "Product catalog with search and filtering",
      "Shopping cart and checkout system",
      "User authentication and admin dashboard",
    ],
    href: "http://quincailleriefassi.ma/",
    sourceHref: "https://github.com/younes1528/quincaillierie_fassi",
    featured: false,
    order: 2,
  },
  {
    id: "your-doctor",
    title: "Your Doctor",
    number: "03",
    category: "Medical",
    description: "Team project for appointments, records, and live notifications.",
    icon: "stethoscope",
    ...emptyMediaFields(),
    stack: ["React", "Socket.io", "JWT"],
    items: [
      "Online appointment booking",
      "Medical records management",
      "Automatic notifications",
    ],
    featured: false,
    order: 3,
  },
];

type ProjectDocument = Models.Document & {
  title: string;
  number: string;
  category: string;
  description: string;
  icon: string;
  imagePublicIds?: string[];
  mainImagePublicId?: string;
  imageFrame?: string;
  imagePublicId?: string;
  stack: string[];
  items: string[];
  href?: string;
  sourceHref?: string;
  featured: boolean;
  order: number;
};

function mapDocumentToRecord(document: ProjectDocument): ProjectRecord {
  const media = normalizeMediaFields(document);

  return {
    id: document.$id,
    title: document.title,
    number: document.number,
    category: document.category,
    description: document.description,
    icon: document.icon,
    stack: document.stack,
    items: document.items,
    href: document.href || undefined,
    sourceHref: document.sourceHref || undefined,
    featured: document.featured,
    order: document.order,
    ...media,
  };
}

export function toProjectCards(records: ProjectRecord[]): ProjectCard[] {
  return records.map((record) => ({
    ...record,
    icon: resolveProjectIcon(record.icon),
  }));
}

export async function fetchProjects(): Promise<ProjectRecord[]> {
  if (!appwriteConfigured) {
    return DEFAULT_PROJECTS;
  }

  try {
    const databases = new Databases(appwriteClient);
    const response = await databases.listDocuments<ProjectDocument>({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: PROJECTS_COLLECTION_ID,
      queries: [Query.orderAsc("order")],
    });

    if (response.documents.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return response.documents.map(mapDocumentToRecord);
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    // 403 general_unknown_origin = Vercel domain not added in Appwrite Console → Platforms
    if (err?.code === 403 && err?.type === "general_unknown_origin") {
      console.error(
        `[appwrite] 403 Invalid Origin — add your Vercel domain in Appwrite Console → Settings → Platforms → Add Platform → Web. Error: ${err.message}`,
      );
    } else {
      console.error("[appwrite] fetchProjects failed:", err?.message ?? error);
    }
    throw error;
  }
}
