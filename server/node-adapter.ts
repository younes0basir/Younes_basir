import type { IncomingMessage, ServerResponse } from "node:http";
import { handleApi, type ApiResult } from "./router.ts";

type AdapterOptions = {
  body?: unknown;
  pathname?: string;
};

export async function handleNodeRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options?: AdapterOptions,
): Promise<void> {
  const pathname = options?.pathname ?? (req.url ?? "/").split("?")[0] ?? "/";
  let body: unknown = null;

  if (options) {
    body = options.body ?? null;
    if (typeof body === "string" && body.trim()) {
      try {
        body = JSON.parse(body) as unknown;
      } catch {
        send(res, { status: 400, body: { error: "Invalid JSON" } });
        return;
      }
    }
  } else if (req.method !== "GET" && req.method !== "HEAD") {
    const raw = await readBody(req);
    if (raw.length > 1_000_000) {
      send(res, { status: 413, body: { error: "Request is too large" } });
      return;
    }
    if (raw.trim()) {
      try {
        body = JSON.parse(raw) as unknown;
      } catch {
        send(res, { status: 400, body: { error: "Invalid JSON" } });
        return;
      }
    }
  }

  const result = await handleApi({
    method: req.method ?? "GET",
    pathname,
    cookieHeader: header(req, "cookie"),
    body,
    secureCookie: process.env.VERCEL === "1",
  });
  send(res, result);
}

function header(req: IncomingMessage, name: string): string | null {
  const value = req.headers[name];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, result: ApiResult) {
  res.statusCode = result.status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (result.cookies && result.cookies.length > 0) {
    res.setHeader("Set-Cookie", result.cookies);
  }
  res.end(JSON.stringify(result.body));
}
