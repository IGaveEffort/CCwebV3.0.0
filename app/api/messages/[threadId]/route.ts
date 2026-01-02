import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiGuards, parseJson } from "../../_utils";

export async function GET(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;
  const { supabase } = guard;

  const { data, error } = await supabase
    .from("messages_view")
    .select("*")
    .eq("thread_id", params.threadId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ messages: data });
}

const Send = z.object({ text: z.string().min(1).max(2000) });

export async function POST(req: NextRequest, ctx: any) {
  const guard = await withApiGuards(req);
  if (!guard.ok) return guard.res;
  const { supabase, user } = guard;

  const body = await parseJson(req, Send);

  // RLS ensures user can only send if in the thread.
  const { data, error } = await supabase
    .from("messages")
    .insert({ thread_id: params.threadId, sender_id: user.id, text: body.text })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: data });
}
