import { NextRequest, NextResponse } from "next/server";
import { withApiGuards } from "../../_utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  const gigId = params.id;

  const { data: gig, error: gigErr } = await supabase.from("gigs").select("*").eq("id", gigId).single();
  if (gigErr) return NextResponse.json({ error: gigErr.message }, { status: 400 });

  let applications: any[] = [];
  if (role === "employer" || role === "admin") {
    const { data: apps, error } = await supabase
      .from("applications_view")
      .select("*")
      .eq("gig_id", gigId)
      .order("created_at", { ascending: false });
    if (!error && apps) applications = apps;
  }

  // student: fetch their own application
  let myApplication = null;
  if (role === "student") {
    const { data } = await supabase.from("applications").select("id,status").eq("gig_id", gigId).eq("student_id", user.id).maybeSingle();
    myApplication = data ?? null;
  }

  return NextResponse.json({ gig: { ...gig, applications }, myApplication });
}
