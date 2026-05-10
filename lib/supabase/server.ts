import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || !value.trim()) return undefined;
  return value;
}

export function getSupabaseServerClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") ??
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error(
      "Supabase server client init failed: NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Supabase server client init failed: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}
