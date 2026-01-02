import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../_utils";

export async function GET(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  const { data, error } = await supabase
    .from("gigs_view")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Students can see all gigs; employers will see all gigs but only their own has apps attached in detail route.
  return NextResponse.json({ gigs: data, role });
}

const CreateGig = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  budget: z.number().int().min(0).max(100000),
});

export async function POST(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  if (role !== "employer" && role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await parseJson(req, CreateGig);

  const { data, error } = await supabase
    .from("gigs")
    .insert({ title: body.title, description: body.description, budget: body.budget, employer_id: user.id })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Create default task
  await supabase.from("tasks").insert({
    gig_id: data.id,
    title: "Submit final content",
    instructions: "Upload or link your final deliverables here.",
    sort_order: 1,
  });

  return NextResponse.json({ gig: data });
}
