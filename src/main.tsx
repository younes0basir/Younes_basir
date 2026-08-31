import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppwriteProvider } from "@appwrite.io/react";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppwriteProvider
        endpoint={import.meta.env.VITE_APPWRITE_ENDPOINT}
        projectId={import.meta.env.VITE_APPWRITE_PROJECT_ID}
      >
        <App />
      </AppwriteProvider>
    </QueryClientProvider>
  </StrictMode>,
);
