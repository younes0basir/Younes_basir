import { emptyMediaFields } from "../types/media.ts";
import type { ProjectRecord } from "../types/project.ts";

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
