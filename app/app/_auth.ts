import { supabaseBrowser } from "../../lib/supabase-browser";

export async function authHeader(): Promise<Record<string, string>> {
  const supabase = supabaseBrowser();
  const { data } = await supabase.auth.getSession();

  const token = data.session?.access_token;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}
