import type { IncomingMessage, ServerResponse } from "node:http";
import { handleNodeRequest } from "../server/node-adapter.ts";

type VercelRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

export default function handler(req: VercelRequest, res: ServerResponse) {
  return handleNodeRequest(req, res, {
    body: req.body,
    pathname: requestPath(req),
  });
}

function requestPath(req: VercelRequest): string {
  const pathOnly = (req.url ?? "").split("?")[0] ?? "";
  if (pathOnly.startsWith("/api")) {
    return pathOnly;
  }

  const path = req.query?.path;
  if (Array.isArray(path)) {
    return `/api/${path.join("/")}`;
  }
  if (typeof path === "string") {
    return `/api/${path}`;
  }

  return pathOnly || "/api";
}
