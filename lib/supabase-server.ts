import { createClient } from "@supabase/supabase-js";

/**
 * Server-side client uses ANON key by default for RLS-protected reads/writes via user JWT.
 * If you later add admin-only server actions, you can use the service role key safely ONLY on server.
 */
export function supabaseServer(authorization?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error("Missing Supabase env vars");
  return createClient(url, anon, {
    global: {
      headers: authorization ? { Authorization: authorization } : undefined,
    },
  });
}

export function supabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !service) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service, { auth: { persistSession: false } });
}
