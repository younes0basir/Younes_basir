import { randomUUID } from "node:crypto";
import { isGalleryEventType, type GalleryEventType } from "../src/lib/gallery-events.ts";
import { normalizeMediaFields, type ImageFrame } from "../src/types/media.ts";
import { getSql } from "./db.ts";
import { HttpError } from "./errors.ts";

const ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;

type ProjectInput = {
  title: string;
  number: string;
  category: string;
  description: string;
  icon: string;
  stack: string[];
  items: string[];
  href: string;
  sourceHref: string;
  featured: boolean;
  order: number;
  imagePublicIds: string[];
  mainImagePublicId: string;
  imageFrame: ImageFrame;
};

type GalleryInput = {
  title: string;
  description: string;
  eventType: GalleryEventType;
  date: string;
  location: string;
  order: number;
  imagePublicIds: string[];
  mainImagePublicId: string;
  imageFrame: ImageFrame;
};

type ProjectRow = {
  id: string;
  title: string;
  number: string;
  category: string;
  description: string;
  icon: string;
  stack: unknown;
  items: unknown;
  href: string;
  source_href: string;
  featured: boolean;
  sort_order: number;
  image_public_ids: unknown;
  main_image_public_id: string;
  image_frame: string;
};

type GalleryRow = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  location: string;
  sort_order: number;
  image_public_ids: unknown;
  main_image_public_id: string;
  image_frame: string;
};

export function assertId(id: string): string {
  if (!ID_PATTERN.test(id)) {
    throw new HttpError(400, "Invalid id");
  }

  return id;
}

export async function listProjects() {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id, title, number, category, description, icon, stack, items, href, source_href,
      featured, sort_order, image_public_ids, main_image_public_id, image_frame
    FROM projects
    ORDER BY sort_order ASC, title ASC
  `;

  return rows.map((row) => mapProject(row as ProjectRow));
}

export async function insertProject(data: ProjectInput, id = randomUUID()): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO projects (
      id, title, number, category, description, icon, stack, items, href, source_href,
      featured, sort_order, image_public_ids, main_image_public_id, image_frame
    ) VALUES (
      ${id},
      ${data.title},
      ${data.number},
      ${data.category},
      ${data.description},
      ${data.icon},
      ${JSON.stringify(data.stack)}::jsonb,
      ${JSON.stringify(data.items)}::jsonb,
      ${data.href},
      ${data.sourceHref},
      ${data.featured},
      ${data.order},
      ${JSON.stringify(data.imagePublicIds)}::jsonb,
      ${data.mainImagePublicId},
      ${data.imageFrame}
    )
  `;
}

export async function updateProject(id: string, data: ProjectInput): Promise<void> {
  const sql = getSql();
  const rows = await sql`
    UPDATE projects SET
      title = ${data.title},
      number = ${data.number},
      category = ${data.category},
      description = ${data.description},
      icon = ${data.icon},
      stack = ${JSON.stringify(data.stack)}::jsonb,
      items = ${JSON.stringify(data.items)}::jsonb,
      href = ${data.href},
      source_href = ${data.sourceHref},
      featured = ${data.featured},
      sort_order = ${data.order},
      image_public_ids = ${JSON.stringify(data.imagePublicIds)}::jsonb,
      main_image_public_id = ${data.mainImagePublicId},
      image_frame = ${data.imageFrame}
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new HttpError(404, "Project not found");
  }
}

export async function deleteProject(id: string): Promise<void> {
  const sql = getSql();
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) {
    throw new HttpError(404, "Project not found");
  }
}

export async function listGallery() {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id, title, description, event_type, event_date, location, sort_order,
      image_public_ids, main_image_public_id, image_frame
    FROM gallery_items
    ORDER BY sort_order ASC, event_date DESC
  `;

  return rows.map((row) => mapGallery(row as GalleryRow));
}

export async function insertGalleryItem(data: GalleryInput, id = randomUUID()): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO gallery_items (
      id, title, description, event_type, event_date, location, sort_order,
      image_public_ids, main_image_public_id, image_frame
    ) VALUES (
      ${id},
      ${data.title},
      ${data.description},
      ${data.eventType},
      ${data.date},
      ${data.location},
      ${data.order},
      ${JSON.stringify(data.imagePublicIds)}::jsonb,
      ${data.mainImagePublicId},
      ${data.imageFrame}
    )
  `;
}

export async function updateGalleryItem(id: string, data: GalleryInput): Promise<void> {
  const sql = getSql();
  const rows = await sql`
    UPDATE gallery_items SET
      title = ${data.title},
      description = ${data.description},
      event_type = ${data.eventType},
      event_date = ${data.date},
      location = ${data.location},
      sort_order = ${data.order},
      image_public_ids = ${JSON.stringify(data.imagePublicIds)}::jsonb,
      main_image_public_id = ${data.mainImagePublicId},
      image_frame = ${data.imageFrame}
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new HttpError(404, "Gallery entry not found");
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const sql = getSql();
  const rows = await sql`DELETE FROM gallery_items WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) {
    throw new HttpError(404, "Gallery entry not found");
  }
}

export function parseProjectInput(body: unknown): ProjectInput {
  const record = asRecord(body);
  const media = normalizeMediaFields({
    imagePublicIds: stringList(record.imagePublicIds, "Images"),
    mainImagePublicId: optionalString(record.mainImagePublicId, 240),
    imageFrame: optionalString(record.imageFrame, 40),
  });

  return {
    title: requiredString(record.title, "Title", 160),
    number: requiredString(record.number, "Number", 8),
    category: requiredString(record.category, "Category", 80),
    description: requiredString(record.description, "Description", 4000),
    icon: requiredString(record.icon, "Icon", 40),
    stack: stringList(record.stack, "Stack"),
    items: stringList(record.items, "Highlights"),
    href: optionalString(record.href, 500),
    sourceHref: optionalString(record.sourceHref, 500),
    featured: requiredBoolean(record.featured, "Featured"),
    order: requiredOrder(record.order),
    imagePublicIds: media.imagePublicIds,
    mainImagePublicId: media.mainImagePublicId,
    imageFrame: media.imageFrame,
  };
}

export function parseGalleryInput(body: unknown): GalleryInput {
  const record = asRecord(body);
  const eventType = requiredString(record.eventType, "Event type", 40);
  if (!isGalleryEventType(eventType)) {
    throw new HttpError(400, "Invalid event type");
  }

  const media = normalizeMediaFields({
    imagePublicIds: stringList(record.imagePublicIds, "Images"),
    mainImagePublicId: optionalString(record.mainImagePublicId, 240),
    imageFrame: optionalString(record.imageFrame, 40),
  });

  return {
    title: requiredString(record.title, "Title", 160),
    description: optionalString(record.description, 4000),
    eventType,
    date: requiredString(record.date, "Date", 40),
    location: optionalString(record.location, 160),
    order: requiredOrder(record.order),
    imagePublicIds: media.imagePublicIds,
    mainImagePublicId: media.mainImagePublicId,
    imageFrame: media.imageFrame,
  };
}

function mapProject(row: ProjectRow) {
  const media = normalizeMediaFields({
    imagePublicIds: asStringArray(row.image_public_ids),
    mainImagePublicId: row.main_image_public_id,
    imageFrame: row.image_frame,
  });

  return {
    id: row.id,
    title: row.title,
    number: row.number,
    category: row.category,
    description: row.description,
    icon: row.icon,
    stack: asStringArray(row.stack),
    items: asStringArray(row.items),
    href: row.href || undefined,
    sourceHref: row.source_href || undefined,
    featured: row.featured === true,
    order: asNumber(row.sort_order),
    ...media,
  };
}

function mapGallery(row: GalleryRow) {
  if (!isGalleryEventType(row.event_type)) {
    throw new HttpError(500, "Stored gallery event type is invalid");
  }

  const media = normalizeMediaFields({
    imagePublicIds: asStringArray(row.image_public_ids),
    mainImagePublicId: row.main_image_public_id,
    imageFrame: row.image_frame,
  });

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventType: row.event_type,
    date: row.event_date,
    location: row.location,
    order: asNumber(row.sort_order),
    ...media,
  };
}

function asRecord(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Expected a JSON object");
  }

  return body as Record<string, unknown>;
}

function requiredString(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${field} is required`);
  }

  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new HttpError(400, `${field} is too long`);
  }

  return trimmed;
}

function optionalString(value: unknown, max: number): string {
  if (value == null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new HttpError(400, "Invalid text field");
  }

  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new HttpError(400, "Text field is too long");
  }

  return trimmed;
}

function stringList(value: unknown, field: string): string[] {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new HttpError(400, `${field} must be a list`);
  }

  if (value.length > 40) {
    throw new HttpError(400, `${field} has too many items`);
  }

  return value
    .map((item) => {
      if (typeof item !== "string") {
        throw new HttpError(400, `${field} must be text`);
      }

      const trimmed = item.trim();
      if (trimmed.length > 240) {
        throw new HttpError(400, `${field} item is too long`);
      }

      return trimmed;
    })
    .filter(Boolean);
}

function requiredBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new HttpError(400, `${field} must be true or false`);
  }

  return value;
}

function requiredOrder(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 10000) {
    throw new HttpError(400, "Order must be a whole number");
  }

  return value;
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    try {
      return asStringArray(JSON.parse(value) as unknown);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }

  return 0;
}
