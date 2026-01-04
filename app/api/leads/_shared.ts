import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import { enforceRateLimit } from "../../../lib/rate-limit";

export const LeadType = z.enum(["brand", "student"]);

export const BrandLeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional().default(""),
  role: z.string().max(160).optional().default(""),
  message: z.string().max(2000).optional().default("")
});

export const StudentLeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  school: z.string().min(1).max(160),
  socials: z.string().min(1).max(500)
});

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export async function rateLimit(
  req: NextRequest,
  pathname: string
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const ip = getClientIp(req);
  const key = `leads:${pathname}:${ip}`;
  const rl = await enforceRateLimit(key);

  if (!rl.ok) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rl.reset) } }
      )
    };
  }

  return { ok: true };
}

type LeadPayload = {
  type: "brand" | "student";
  data: Record<string, unknown>;
  createdAt: string;
};

/**
 * Best-effort storage in Supabase table "leads".
 * If the table doesn't exist or insert fails, we swallow the error so form submit still succeeds.
 */
export async function tryStoreLead(payload: LeadPayload) {
  try {
    // IMPORTANT: createSupabaseServerClient may be async in your project
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("leads").insert([
      {
        type: payload.type,
        data: payload.data,
        created_at: payload.createdAt
      }
    ]);

    if (error) return;
  } catch {
    return;
  }
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.ok;
}

/**
 * Optional webhook (Zapier/Make/CRM) for lead notifications.
 * Set LEADS_WEBHOOK_URL in env to enable.
 */
export async function tryWebhook(payload: LeadPayload) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;

  try {
    await postJson(url, payload);
  } catch {
    // swallow (non-breaking)
  }
}
