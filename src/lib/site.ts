export const EMAIL = "younesbasir0@gmail.com";
export const GITHUB_URL = "https://github.com/younes0basir";
export const LINKEDIN_URL = "https://linkedin.com/in/younes-basir";

/** Cloudinary public ID — uploaded to portfolio/about */
export const ABOUT_PORTRAIT_PUBLIC_ID = "portfolio/about/younes-portrait";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "GitHub", href: GITHUB_URL, external: true },
  { label: "LinkedIn", href: LINKEDIN_URL, external: true },
  { label: "Contact", href: "#contact" },
];

export const SOCIALS = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
] as const;

export const SECTION_IDS = ["about", "projects", "gallery", "contact"] as const;

export const SKILL_GROUPS = [
  { title: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
  { title: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB"] },
  { title: "Data", items: ["Python", "SQL", "Data Visualization"] },
] as const;

export const TIMELINE = [
  { label: "Now", title: "Open to a data internship", detail: "Python, SQL, and visualization" },
  { label: "Year 3", title: "Software Engineering", detail: "GPA 3.5+ / 4.0" },
  { label: "Built", title: "Three live products", detail: "CourseWard, Quincaillerie Fassi, Your Doctor" },
] as const;
