import "dotenv/config";
import { DEFAULT_PROJECTS } from "../src/lib/default-projects.ts";
import { insertProject, listProjects } from "../server/content.ts";

const existing = await listProjects();
if (existing.length > 0) {
  console.log(`projects already present (${existing.length}), skipping seed`);
  process.exit(0);
}

for (const project of DEFAULT_PROJECTS) {
  const { id, href, sourceHref, ...data } = project;
  await insertProject(
    {
      ...data,
      href: href ?? "",
      sourceHref: sourceHref ?? "",
    },
    id,
  );
}

console.log(`seeded ${DEFAULT_PROJECTS.length} projects`);
