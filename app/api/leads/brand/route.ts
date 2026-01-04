import { NextRequest, NextResponse } from "next/server";
import {
  BrandLeadSchema,
  rateLimit,
  tryStoreLead,
  tryWebhook
} from "../_shared";

export async function POST(req: NextRequest) {
  // Rate limit
  const rl = await rateLimit(req, "/api/leads/brand");
  if (!rl.ok) return rl.response;

  // Parse JSON safely
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Validate
  const parsed = BrandLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const payload = {
    type: "brand" as const,
    data: parsed.data,
    createdAt: new Date().toISOString()
  };

  // Best-effort store + webhook (never fail the request if these fail)
  await tryStoreLead(payload);
  await tryWebhook(payload);

  return NextResponse.json({ ok: true });
}
