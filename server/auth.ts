import { createHmac, timingSafeEqual } from "node:crypto";
import { HttpError } from "./errors.ts";

const COOKIE_NAME = "basir_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function safeEqual(leftValue: string, rightValue: string): boolean {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function requireAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new HttpError(500, "Admin sign-in is not configured");
  }

  return secret;
}

export function credentialsMatch(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  requireAuthSecret();
  if (!expectedEmail || !expectedPassword) {
    throw new HttpError(500, "Admin sign-in is not configured");
  }

  const emailMatches = safeEqual(email.toLowerCase(), expectedEmail.toLowerCase());
  const passwordMatches = safeEqual(password, expectedPassword);
  return emailMatches && passwordMatches;
}

export function createSessionToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + MAX_AGE_SECONDS * 1000 } satisfies SessionPayload),
  ).toString("base64url");
  const signature = createHmac("sha256", requireAuthSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readSessionEmail(cookieHeader: string | null): string | null {
  const token = readCookie(cookieHeader, COOKIE_NAME);
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) {
    return null;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number" || parsed.exp < Date.now()) {
      return null;
    }

    return parsed.email;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  const parts = [`${COOKIE_NAME}=`, "HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=0"];
  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) {
    return null;
  }

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = part.slice(0, separator).trim();
    if (key === name) {
      return part.slice(separator + 1).trim();
    }
  }

  return null;
}
