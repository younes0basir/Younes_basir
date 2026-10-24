import {
  clearSessionCookie,
  createSessionToken,
  credentialsMatch,
  readSessionEmail,
  sessionCookie,
} from "./auth.ts";
import {
  assertId,
  deleteGalleryItem,
  deleteProject,
  insertGalleryItem,
  insertProject,
  listGallery,
  listProjects,
  parseGalleryInput,
  parseProjectInput,
  updateGalleryItem,
  updateProject,
} from "./content.ts";
import { HttpError } from "./errors.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type Route =
  | { name: "session" }
  | { name: "login" }
  | { name: "logout" }
  | { name: "projects" }
  | { name: "project"; id: string }
  | { name: "gallery" }
  | { name: "gallery-item"; id: string };

export type ApiInput = {
  method: string;
  pathname: string;
  cookieHeader: string | null;
  body: unknown;
  secureCookie: boolean;
};

export type ApiResult = {
  status: number;
  body: unknown;
  cookies?: string[];
};

export async function handleApi(input: ApiInput): Promise<ApiResult> {
  try {
    const method = parseMethod(input.method);
    if (!method) {
      return { status: 405, body: { error: "Method not allowed" } };
    }

    const route = matchRoute(input.pathname);
    if (!route) {
      return { status: 404, body: { error: "Not found" } };
    }

    return await dispatch(route, method, input);
  } catch (error) {
    if (error instanceof HttpError) {
      return { status: error.status, body: { error: error.message } };
    }

    console.error("[api]", error);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}

async function dispatch(route: Route, method: Method, input: ApiInput): Promise<ApiResult> {
  switch (route.name) {
    case "session":
      return session(method, input);
    case "login":
      return login(method, input);
    case "logout":
      return logout(method, input);
    case "projects":
      return projects(method, input);
    case "project":
      return project(method, input, route.id);
    case "gallery":
      return gallery(method, input);
    case "gallery-item":
      return galleryItem(method, input, route.id);
    default: {
      const exhaustive: never = route;
      return exhaustive;
    }
  }
}

function session(method: Method, input: ApiInput): ApiResult {
  switch (method) {
    case "GET":
      return { status: 200, body: { email: readSessionEmail(input.cookieHeader) } };
    case "POST":
    case "PUT":
    case "DELETE":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

function login(method: Method, input: ApiInput): ApiResult {
  switch (method) {
    case "POST": {
      const credentials = parseCredentials(input.body);
      if (!credentialsMatch(credentials.email, credentials.password)) {
        return { status: 401, body: { error: "Invalid email or password" } };
      }

      const email = process.env.ADMIN_EMAIL?.trim() || credentials.email.trim();
      return {
        status: 200,
        body: { email },
        cookies: [sessionCookie(createSessionToken(email), input.secureCookie)],
      };
    }
    case "GET":
    case "PUT":
    case "DELETE":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

function logout(method: Method, input: ApiInput): ApiResult {
  switch (method) {
    case "POST":
      return {
        status: 200,
        body: { ok: true },
        cookies: [clearSessionCookie(input.secureCookie)],
      };
    case "GET":
    case "PUT":
    case "DELETE":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

async function projects(method: Method, input: ApiInput): Promise<ApiResult> {
  switch (method) {
    case "GET":
      return { status: 200, body: await listProjects() };
    case "POST":
      requireUser(input.cookieHeader);
      await insertProject(parseProjectInput(input.body));
      return { status: 201, body: { ok: true } };
    case "PUT":
    case "DELETE":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

async function project(method: Method, input: ApiInput, id: string): Promise<ApiResult> {
  switch (method) {
    case "PUT":
      requireUser(input.cookieHeader);
      await updateProject(assertId(id), parseProjectInput(input.body));
      return { status: 200, body: { ok: true } };
    case "DELETE":
      requireUser(input.cookieHeader);
      await deleteProject(assertId(id));
      return { status: 200, body: { ok: true } };
    case "GET":
    case "POST":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

async function gallery(method: Method, input: ApiInput): Promise<ApiResult> {
  switch (method) {
    case "GET":
      return { status: 200, body: await listGallery() };
    case "POST":
      requireUser(input.cookieHeader);
      await insertGalleryItem(parseGalleryInput(input.body));
      return { status: 201, body: { ok: true } };
    case "PUT":
    case "DELETE":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

async function galleryItem(method: Method, input: ApiInput, id: string): Promise<ApiResult> {
  switch (method) {
    case "PUT":
      requireUser(input.cookieHeader);
      await updateGalleryItem(assertId(id), parseGalleryInput(input.body));
      return { status: 200, body: { ok: true } };
    case "DELETE":
      requireUser(input.cookieHeader);
      await deleteGalleryItem(assertId(id));
      return { status: 200, body: { ok: true } };
    case "GET":
    case "POST":
      return methodNotAllowed();
    default: {
      const exhaustive: never = method;
      return exhaustive;
    }
  }
}

function requireUser(cookieHeader: string | null): string {
  const email = readSessionEmail(cookieHeader);
  if (!email) {
    throw new HttpError(401, "Sign in required");
  }

  return email;
}

function parseCredentials(body: unknown): { email: string; password: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Email and password are required");
  }

  const record = body as Record<string, unknown>;
  if (typeof record.email !== "string" || typeof record.password !== "string") {
    throw new HttpError(400, "Email and password are required");
  }

  const email = record.email.trim();
  if (!email || !record.password) {
    throw new HttpError(400, "Email and password are required");
  }

  return { email, password: record.password };
}

function matchRoute(pathname: string): Route | null {
  const parts = pathname.split("?")[0]?.split("/").filter(Boolean) ?? [];
  if (parts[0] !== "api") {
    return null;
  }

  const head = parts[1];
  const tail = parts[2];
  if (head === "auth" && tail === "session" && parts.length === 3) {
    return { name: "session" };
  }
  if (head === "auth" && tail === "login" && parts.length === 3) {
    return { name: "login" };
  }
  if (head === "auth" && tail === "logout" && parts.length === 3) {
    return { name: "logout" };
  }
  if (head === "projects" && parts.length === 2) {
    return { name: "projects" };
  }
  if (head === "projects" && tail && parts.length === 3) {
    return { name: "project", id: decodeURIComponent(tail) };
  }
  if (head === "gallery" && parts.length === 2) {
    return { name: "gallery" };
  }
  if (head === "gallery" && tail && parts.length === 3) {
    return { name: "gallery-item", id: decodeURIComponent(tail) };
  }

  return null;
}

function parseMethod(method: string): Method | null {
  switch (method.toUpperCase()) {
    case "GET":
      return "GET";
    case "POST":
      return "POST";
    case "PUT":
      return "PUT";
    case "DELETE":
      return "DELETE";
    default:
      return null;
  }
}

function methodNotAllowed(): ApiResult {
  return { status: 405, body: { error: "Method not allowed" } };
}
