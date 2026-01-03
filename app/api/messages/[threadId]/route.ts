import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../_utils";

const PostSchema = z.object({
  content: z.string().min(1).max(5000)
});

export async function GET(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase } = guard;

  const threadId = (ctx?.params?.threadId ?? "") as string;
  if (!threadId) return NextResponse.json({ error: "missing_thread_id" }, { status: 400 });

  const { data, error } = await supabase
    .from("messages_view")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;

  const { supabase, user } = guard;

  const threadId = (ctx?.params?.threadId ?? "") as string;
  if (!threadId) return NextResponse.json({ error: "missing_thread_id" }, { status: 400 });

  const body = await parseJson(req, PostSchema);

  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: user.id, content: body.content })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: inserted });
}
