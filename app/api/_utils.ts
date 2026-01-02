import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { enforceRateLimit } from "@/lib/rate-limit";

export function getClientIp(req: NextRequest): string {
  // NextRequest.ip is not guaranteed / not typed in Next 15 in all runtimes.
  // Derive from standard proxy headers.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();

  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  return "unknown";
}

export async function withApiGuards(req: NextRequest) {
  const ip = getClientIp(req);
  const key = `api:${req.nextUrl.pathname}:${ip}`;

  const rl = await enforceRateLimit(key);
  if (!rl.ok) {
    return {
      ok: false as const,
      res: NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
      ),
    };
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, supabase, user };
}

export async function parseJson<T extends z.ZodTypeAny>(req: NextRequest, schema: T) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return schema.parse({});
  }
  return schema.parse(json);
}
