import { Client } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwriteConfigured =
  Boolean(endpoint && projectId && !endpoint.includes("<REGION>") && projectId !== "<PROJECT_ID>");

export const appwriteClient = (() => {
  const client = new Client();
  // Avoid throwing at import time when env vars are missing (e.g. Vercel env not set).
  // Consumers already guard with `appwriteConfigured`; this keeps production builds from crashing.
  if (appwriteConfigured) {
    client.setEndpoint(endpoint).setProject(projectId);
  } else if (import.meta.env.DEV) {
    console.warn(
      "[appwrite] Missing VITE_APPWRITE_ENDPOINT or VITE_APPWRITE_PROJECT_ID — falling back to local defaults. Set them in Vercel → Settings → Environment Variables and redeploy.",
    );
  }
  return client;
})();
