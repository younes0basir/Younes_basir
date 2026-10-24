import { neon } from "@neondatabase/serverless";
import { HttpError } from "./errors.ts";

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new HttpError(500, "Database is not configured");
  }

  return neon(databaseUrl);
}
