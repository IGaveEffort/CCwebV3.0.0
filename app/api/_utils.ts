import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "../../lib/rate-limit";
import { supabaseServer } from "../../lib/supabase-server";

export async function withApiGuards(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `api:${req.nextUrl.pathname}:${ip}`;
  const rl = await enforceRateLimit(key);
  if (!rl.ok) {
    return { ok: false as const, res: NextResponse.json({ error: "rate_limited" }, { status: 429 }) };
  }

  const auth = req.headers.get("authorization") ?? undefined;
  if (!auth) return { ok: false as const, res: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };

  const supabase = supabaseServer(auth);
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return { ok: false as const, res: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };

  return { ok: true as const, supabase, user: userData.user };
}

export function parseJson<T extends z.ZodTypeAny>(req: NextRequest, schema: T) {
  return req.json().then((body) => schema.parse(body));
}
