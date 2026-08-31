import { Client } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwriteConfigured =
  Boolean(endpoint && projectId && !endpoint.includes("<REGION>") && projectId !== "<PROJECT_ID>");

export const appwriteClient = new Client().setEndpoint(endpoint).setProject(projectId);
