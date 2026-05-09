import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  browserClient = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return browserClient;
}
