import { NextRequest, NextResponse } from "next/server";
import { withApiGuards } from "../../_utils";

export async function GET(req: NextRequest) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  if (role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const [{ count: usersCount }, { count: gigsCount }, { count: appsCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("gigs").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    users: usersCount ?? 0,
    gigs: gigsCount ?? 0,
    applications: appsCount ?? 0,
    timestamp: new Date().toISOString(),
  });
}
