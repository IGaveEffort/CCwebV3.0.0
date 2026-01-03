import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

async function tryAccessToken(): Promise<string | null> {
  // Next.js 15: headers() is async
  const h = await headers();
  const authHeader = h.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) return authHeader.slice(7).trim();

  // cookies() may be sync in some versions, async in others — handle both
  const jarAny: any = cookies();
  const jar = typeof jarAny?.then === "function" ? await jarAny : jarAny;

  const direct = jar.get?.("sb-access-token")?.value;
  if (direct) return direct;

  const all = jar.getAll?.() ?? [];
  for (const c of all) {
    if (c.name?.endsWith?.("-auth-token")) {
      try {
        const parsed = JSON.parse(c.value);
        if (parsed?.access_token) return String(parsed.access_token);
      } catch {}
    }
  }

  return null;
}

/**
 * Server-side Supabase client for route handlers (RLS-friendly).
 */
export async function createSupabaseServerClient() {
  const url = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = mustEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const token = await tryAccessToken();

  return createClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  });
}
