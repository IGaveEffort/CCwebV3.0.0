import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../../_utils";

const SubmitSchema = z.object({
  link: z.string().url()
});

export async function POST(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;
  const role = (user.user_metadata?.role ?? "student") as string;

  if (role !== "student") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const taskId = (ctx?.params?.taskId ?? "") as string;
  if (!taskId) return NextResponse.json({ error: "missing_task_id" }, { status: 400 });

  const body = await parseJson(req, SubmitSchema);

  const { data, error } = await supabase
    .from("task_submissions")
    .upsert(
      { task_id: taskId, student_id: user.id, link: body.link },
      { onConflict: "task_id,student_id" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ submission: data });
}
