import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../_utils";

const Patch = z.object({ action: z.enum(["accept", "decline"]) });

export async function PATCH(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;
  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  if (role !== "employer" && role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await parseJson(req, Patch);

  const { data: app, error: appErr } = await supabase.from("applications").select("id,gig_id,student_id,status").eq("id", params.id).single();
  if (appErr) return NextResponse.json({ error: appErr.message }, { status: 400 });

  // Ensure employer owns gig (enforced again by RLS, but keep server validation)
  const { data: gig } = await supabase.from("gigs").select("id,employer_id,title").eq("id", app.gig_id).single();
  if (!gig) return NextResponse.json({ error: "gig_not_found" }, { status: 404 });
  if (role === "employer" && gig.employer_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const newStatus = body.action === "accept" ? "accepted" : "declined";

  const { data: updated, error } = await supabase.from("applications").update({ status: newStatus }).eq("id", params.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Ensure thread exists when accepted
  if (newStatus === "accepted") {
    await supabase.from("message_threads").upsert({ gig_id: app.gig_id, student_id: app.student_id, employer_id: gig.employer_id }, { onConflict: "gig_id,student_id" });
  }

  return NextResponse.json({ application: updated });
}
