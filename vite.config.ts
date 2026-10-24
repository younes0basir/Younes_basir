import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";

const apiModule = fileURLToPath(new URL("./server/node-adapter.ts", import.meta.url));

function portfolioApi(): Plugin {
  return {
    name: "portfolio-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api")) {
          next();
          return;
        }

        const request = req as IncomingMessage;
        const response = res as ServerResponse;
        void server
          .ssrLoadModule(apiModule)
          .then(async (loaded) => {
            const { handleNodeRequest } = loaded as typeof import("./server/node-adapter.ts");
            await handleNodeRequest(request, response);
          })
          .catch((error: unknown) => {
            console.error("[api]", error);
            if (!response.headersSent) {
              response.statusCode = 500;
              response.setHeader("Content-Type", "application/json; charset=utf-8");
              response.end(JSON.stringify({ error: "Something went wrong" }));
            }
          });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.DATABASE_URL ??= env.DATABASE_URL;
  process.env.ADMIN_EMAIL ??= env.ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD ??= env.ADMIN_PASSWORD;
  process.env.AUTH_SECRET ??= env.AUTH_SECRET;

  return {
    plugins: [portfolioApi(), react(), tailwindcss()],
  };
});
