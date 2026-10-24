import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./api.ts";

const sessionKey = ["admin-session"] as const;

export function useAdminSession() {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: sessionKey,
    queryFn: async () => {
      try {
        return await apiRequest<{ email: string | null }>("/api/auth/session");
      } catch {
        return { email: null };
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  async function signIn(email: string, password: string) {
    const payload = await apiRequest<{ email: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    queryClient.setQueryData(sessionKey, payload);
  }

  async function signOut() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      queryClient.setQueryData(sessionKey, { email: null });
    }
  }

  return {
    email: session.data?.email ?? null,
    isLoading: session.isPending,
    signIn,
    signOut,
  };
}
