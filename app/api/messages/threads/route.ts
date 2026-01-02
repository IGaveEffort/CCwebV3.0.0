import { NextRequest, NextResponse } from "next/server";
import { withApiGuards } from "../../_utils";

export async function GET(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  const view = role === "employer" ? "threads_employer_view" : "threads_student_view";
  const { data, error } = await supabase.from(view).select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ threads: data });
}
