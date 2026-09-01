import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppwriteProvider } from "@appwrite.io/react";
import "./index.css";
import App from "./App.tsx";
import { installScrollGuards } from "./lib/scroll.ts";

installScrollGuards();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const appwriteReady =
  Boolean(
    appwriteEndpoint &&
      appwriteProjectId &&
      !appwriteEndpoint.includes("<REGION>") &&
      appwriteProjectId !== "<PROJECT_ID>",
  );

if (!appwriteReady && !import.meta.env.DEV) {
  console.warn(
    "[appwrite] VITE_APPWRITE_ENDPOINT / VITE_APPWRITE_PROJECT_ID missing in production build — Appwrite features will be disabled. Add them in Vercel → Settings → Environment Variables and redeploy.",
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {appwriteReady ? (
        <AppwriteProvider endpoint={appwriteEndpoint} projectId={appwriteProjectId}>
          <App />
        </AppwriteProvider>
      ) : (
        <App />
      )}
    </QueryClientProvider>
  </StrictMode>,
);
