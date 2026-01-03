import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Browser-side Supabase client factory.
 * Uses NEXT_PUBLIC_* env vars.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const url = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = mustEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

/**
 * Backwards-compatible alias used throughout the app code.
 */
export function supabaseBrowser(): SupabaseClient {
  return createSupabaseBrowserClient();
}
