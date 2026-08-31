import "dotenv/config";
import { Client, Databases, Permission, Role, Storage } from "node-appwrite";

const configuredDatabaseId = process.env.VITE_APPWRITE_DATABASE_ID ?? "6a948879000ebb5b9ea1";
const PROJECTS_COLLECTION_ID = process.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID ?? "projects";
const GALLERY_COLLECTION_ID = process.env.VITE_APPWRITE_GALLERY_COLLECTION_ID ?? "gallery";
const GALLERY_BUCKET_ID = process.env.VITE_APPWRITE_GALLERY_BUCKET_ID ?? "gallery";

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const PUBLIC_READ = [Permission.read(Role.any())];
const AUTH_WRITE = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

const SEED_PROJECTS = [
  {
    id: "courseward",
    title: "CourseWard",
    number: "01",
    category: "E-learning",
    description: "Academic platform for course management, authentication, and student data.",
    icon: "graduation-cap",
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
    stack: ["React", "Socket.io", "JWT"],
    items: [
      "Online appointment booking",
      "Medical records management",
      "Automatic notifications",
    ],
    featured: false,
    order: 3,
  },
] as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveDatabaseId(databases: Databases): Promise<string> {
  try {
    await databases.get({ databaseId: configuredDatabaseId });
    console.log(`Using database "${configuredDatabaseId}".`);
    return configuredDatabaseId;
  } catch {
    // Try creating below.
  }

  try {
    await databases.create({ databaseId: configuredDatabaseId, name: "Portfolio" });
    console.log(`Created database "${configuredDatabaseId}".`);
    return configuredDatabaseId;
  } catch (error: unknown) {
    const isPlanLimit =
      error instanceof Error &&
      "type" in error &&
      (error as { type?: string }).type === "additional_resource_not_allowed";

    if (!isPlanLimit) {
      throw error;
    }
  }

  const existing = await databases.list();
  if (existing.databases.length === 0) {
    throw new Error("No databases found. Create one in Appwrite Console first.");
  }

  const database = existing.databases[0];
  console.log(`Reusing existing database "${database.$id}" (${database.name}).`);
  return database.$id;
}

async function waitForCollection(databases: Databases, databaseId: string, collectionId: string) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const collection = await databases.getCollection({ databaseId, collectionId });
    const pending = collection.attributes.some((attribute) => attribute.status !== "available");
    if (!pending) {
      return;
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for "${collectionId}" attributes.`);
}

async function ensureCollection(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  name: string,
  attributes: object[],
  indexes: object[],
) {
  try {
    await databases.getCollection({ databaseId, collectionId });
    await databases.updateCollection({
      databaseId,
      collectionId,
      name,
      permissions: AUTH_WRITE,
      documentSecurity: false,
      enabled: true,
    });
    console.log(`Updated permissions on collection "${collectionId}".`);
    return;
  } catch {
    // Create below.
  }

  await databases.createCollection({
    databaseId,
    collectionId,
    name,
    permissions: AUTH_WRITE,
    documentSecurity: false,
    attributes,
    indexes,
  });

  console.log(`Created collection "${collectionId}". Waiting for attributes…`);
  await waitForCollection(databases, databaseId, collectionId);
}

async function ensureStringAttribute(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  key: string,
  size: number,
  required = false,
) {
  try {
    await databases.getAttribute({ databaseId, collectionId, key });
    return;
  } catch {
    // Create below.
  }

  await databases.createStringAttribute({
    databaseId,
    collectionId,
    key,
    size,
    required,
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const attribute = await databases.getAttribute({ databaseId, collectionId, key });
    if (attribute.status === "available") {
      console.log(`Added attribute "${key}" on "${collectionId}".`);
      return;
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for attribute "${key}" on "${collectionId}".`);
}

async function ensureStringArrayAttribute(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  key: string,
  size: number,
) {
  try {
    await databases.getAttribute({ databaseId, collectionId, key });
    return;
  } catch {
    // Create below.
  }

  await databases.createStringAttribute({
    databaseId,
    collectionId,
    key,
    size,
    required: false,
    array: true,
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const attribute = await databases.getAttribute({ databaseId, collectionId, key });
    if (attribute.status === "available") {
      console.log(`Added array attribute "${key}" on "${collectionId}".`);
      return;
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for array attribute "${key}" on "${collectionId}".`);
}

async function ensureEnumAttribute(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  key: string,
  elements: string[],
) {
  try {
    await databases.getAttribute({ databaseId, collectionId, key });
    return;
  } catch {
    // Create below.
  }

  await databases.createEnumAttribute({
    databaseId,
    collectionId,
    key,
    elements,
    required: false,
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const attribute = await databases.getAttribute({ databaseId, collectionId, key });
    if (attribute.status === "available") {
      console.log(`Added enum attribute "${key}" on "${collectionId}".`);
      return;
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for enum attribute "${key}" on "${collectionId}".`);
}

async function ensureMediaAttributes(
  databases: Databases,
  databaseId: string,
  collectionId: string,
) {
  await ensureStringArrayAttribute(databases, databaseId, collectionId, "imagePublicIds", 256);
  await ensureStringAttribute(databases, databaseId, collectionId, "mainImagePublicId", 256);
  await ensureEnumAttribute(databases, databaseId, collectionId, "imageFrame", [
    "landscape",
    "square",
    "wide",
    "portrait",
    "original",
  ]);
  await ensureStringAttribute(databases, databaseId, collectionId, "imagePublicId", 256);
}

async function ensureProjectsCollection(databases: Databases, databaseId: string) {
  await ensureCollection(
    databases,
    databaseId,
    PROJECTS_COLLECTION_ID,
    "Projects",
    [
      { key: "title", type: "string", size: 128, required: true },
      { key: "number", type: "string", size: 8, required: true },
      { key: "category", type: "string", size: 64, required: true },
      { key: "description", type: "string", size: 512, required: true },
      { key: "icon", type: "string", size: 32, required: true },
      { key: "imagePublicIds", type: "string", size: 256, required: false, array: true },
      { key: "mainImagePublicId", type: "string", size: 256, required: false },
      {
        key: "imageFrame",
        type: "enum",
        elements: ["landscape", "square", "wide", "portrait", "original"],
        required: false,
      },
      { key: "imagePublicId", type: "string", size: 256, required: false },
      { key: "stack", type: "string", size: 64, required: true, array: true },
      { key: "items", type: "string", size: 256, required: true, array: true },
      { key: "href", type: "string", size: 512, required: false },
      { key: "sourceHref", type: "string", size: 512, required: false },
      { key: "featured", type: "boolean", required: false, default: false },
      { key: "order", type: "integer", required: true },
    ],
    [{ key: "order_idx", type: "key", attributes: ["order"], orders: ["ASC"] }],
  );

  await ensureMediaAttributes(databases, databaseId, PROJECTS_COLLECTION_ID);
}

async function ensureGalleryCollection(databases: Databases, databaseId: string) {
  await ensureCollection(
    databases,
    databaseId,
    GALLERY_COLLECTION_ID,
    "Gallery",
    [
      { key: "title", type: "string", size: 128, required: true },
      { key: "description", type: "string", size: 512, required: true },
      {
        key: "eventType",
        type: "enum",
        elements: ["hackathon", "outdoor", "meeting"],
        required: true,
      },
      { key: "date", type: "string", size: 32, required: true },
      { key: "location", type: "string", size: 128, required: true },
      { key: "imagePublicIds", type: "string", size: 256, required: false, array: true },
      { key: "mainImagePublicId", type: "string", size: 256, required: false },
      {
        key: "imageFrame",
        type: "enum",
        elements: ["landscape", "square", "wide", "portrait", "original"],
        required: false,
      },
      { key: "imagePublicId", type: "string", size: 256, required: false },
      { key: "imageFileId", type: "string", size: 256, required: false },
      { key: "order", type: "integer", required: true },
    ],
    [
      { key: "order_idx", type: "key", attributes: ["order"], orders: ["ASC"] },
      { key: "date_idx", type: "key", attributes: ["date"], orders: ["DESC"] },
    ],
  );

  await ensureMediaAttributes(databases, databaseId, GALLERY_COLLECTION_ID);
}

async function ensureGalleryBucket(storage: Storage) {
  try {
    await storage.getBucket({ bucketId: GALLERY_BUCKET_ID });
    await storage.updateBucket({
      bucketId: GALLERY_BUCKET_ID,
      name: "Gallery",
      permissions: AUTH_WRITE,
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 5_000_000,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp"],
    });
    console.log(`Updated permissions on bucket "${GALLERY_BUCKET_ID}".`);
  } catch {
    await storage.createBucket({
      bucketId: GALLERY_BUCKET_ID,
      name: "Gallery",
      permissions: AUTH_WRITE,
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 5_000_000,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp"],
    });
    console.log(`Created bucket "${GALLERY_BUCKET_ID}".`);
  }
}

async function seedProjects(databases: Databases, databaseId: string) {
  const existing = await databases.listDocuments({
    databaseId,
    collectionId: PROJECTS_COLLECTION_ID,
  });

  if (existing.total > 0) {
    console.log(`Projects collection has ${existing.total} document(s). Skipping seed.`);
    return;
  }

  for (const project of SEED_PROJECTS) {
    await databases.createDocument({
      databaseId,
      collectionId: PROJECTS_COLLECTION_ID,
      documentId: project.id,
      data: {
        title: project.title,
        number: project.number,
        category: project.category,
        description: project.description,
        icon: project.icon,
        imagePublicId: "",
        stack: [...project.stack],
        items: [...project.items],
        href: project.href ?? "",
        sourceHref: "sourceHref" in project ? project.sourceHref : "",
        featured: project.featured,
        order: project.order,
      },
      permissions: PUBLIC_READ,
    });
    console.log(`Seeded project "${project.title}".`);
  }
}

async function main() {
  if (!endpoint || !projectId) {
    console.error("Missing VITE_APPWRITE_ENDPOINT or VITE_APPWRITE_PROJECT_ID in .env");
    process.exit(1);
  }

  if (!apiKey) {
    console.error("Missing APPWRITE_API_KEY in .env");
    process.exit(1);
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const databaseId = await resolveDatabaseId(databases);
  await ensureProjectsCollection(databases, databaseId);
  await ensureGalleryCollection(databases, databaseId);
  await ensureGalleryBucket(storage);
  await seedProjects(databases, databaseId);

  console.log("Appwrite setup complete.");
  console.log(`  Database:  ${databaseId}`);
  console.log(`  Projects:  ${PROJECTS_COLLECTION_ID}`);
  console.log(`  Gallery:   ${GALLERY_COLLECTION_ID}`);
  console.log(`  Storage:   ${GALLERY_BUCKET_ID}`);
  console.log("Create an admin user in Appwrite Console → Auth, then sign in at /admin");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
