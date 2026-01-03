import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../_utils";

const Patch = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(5000).optional(),
  pay_cents: z.number().int().min(0).optional(),
  status: z.enum(["open", "closed", "draft"]).optional()
});

export async function GET(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  const gigId = (ctx?.params?.id ?? "") as string;
  if (!gigId) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const { data: gig, error: gigErr } = await supabase
    .from("gigs")
    .select("*")
    .eq("id", gigId)
    .single();

  if (gigErr) return NextResponse.json({ error: gigErr.message }, { status: 400 });

  if (role === "student" && gig.status !== "open") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (role === "employer" && gig.employer_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({ gig });
}

export async function PATCH(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  if (role !== "employer" && role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const gigId = (ctx?.params?.id ?? "") as string;
  if (!gigId) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const body = await parseJson(req, Patch);

  if (role === "employer") {
    const { data: gig } = await supabase
      .from("gigs")
      .select("id,employer_id")
      .eq("id", gigId)
      .single();

    if (!gig) return NextResponse.json({ error: "gig_not_found" }, { status: 404 });
    if (gig.employer_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: updated, error } = await supabase
    .from("gigs")
    .update(body)
    .eq("id", gigId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ gig: updated });
}

export async function DELETE(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  if (role !== "employer" && role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const gigId = (ctx?.params?.id ?? "") as string;
  if (!gigId) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  if (role === "employer") {
    const { data: gig } = await supabase
      .from("gigs")
      .select("id,employer_id")
      .eq("id", gigId)
      .single();

    if (!gig) return NextResponse.json({ error: "gig_not_found" }, { status: 404 });
    if (gig.employer_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("gigs").delete().eq("id", gigId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
