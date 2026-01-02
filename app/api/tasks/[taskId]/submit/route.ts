import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../../_utils";

const Submit = z.object({
  link: z.string().url().max(2000),
});

export async function POST(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;
  if (role !== "student") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await parseJson(req, Submit);

  const { data, error } = await supabase
    .from("task_submissions")
    .upsert({ task_id: params.taskId, student_id: user.id, link: body.link }, { onConflict: "task_id,student_id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ submission: data });
}
