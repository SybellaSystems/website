import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || !value.trim()) return undefined;
  return value;
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey =
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error(
      "Supabase browser client init failed: NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }

  if (!publishableKey) {
    throw new Error(
      "Supabase browser client init failed: set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  browserClient = createClient(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  return browserClient;
}
