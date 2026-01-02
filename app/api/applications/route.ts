import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../_utils";

export async function GET(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;
  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  const view = role === "employer" ? "applications_employer_view" : "applications_student_view";
  const { data, error } = await supabase.from(view).select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ applications: data });
}

const Apply = z.object({ gig_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;
  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  if (role !== "student") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await parseJson(req, Apply);

  const { data, error } = await supabase
    .from("applications")
    .insert({ gig_id: body.gig_id, student_id: user.id, status: "submitted" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ application: data });
}
