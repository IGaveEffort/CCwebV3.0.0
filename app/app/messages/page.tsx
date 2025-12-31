"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input } from "../../../components/ui";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function MessagesPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function loadThreads() {
    const res = await fetch("/api/messages/threads", { headers: await authHeader() });
    const data = await res.json();
    setThreads(data.threads ?? []);
  }

  async function loadMessages(threadId: string) {
    const res = await fetch(`/api/messages/${threadId}`, { headers: await authHeader() });
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  useEffect(() => { loadThreads(); }, []);

  async function send() {
    if (!active || !text.trim()) return;
    const res = await fetch(`/api/messages/${active.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");
    setText("");
    await loadMessages(active.id);
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 md:col-span-1">
        <div className="text-lg font-extrabold">Threads</div>
        <div className="mt-3 space-y-2">
          {threads.map((t) => (
            <button
              key={t.id}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                active?.id === t.id ? "border-accent bg-accent/20" : "border-ink/10 bg-white/60"
              }`}
              onClick={() => { setActive(t); loadMessages(t.id); }}
            >
              <div className="font-bold">{t.gig_title}</div>
              <div className="text-xs text-ink/60">{t.other_party_email}</div>
            </button>
          ))}
          {threads.length === 0 && <div className="text-sm text-ink/70">No threads yet. Messaging unlocks only after acceptance.</div>}
        </div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <div className="text-lg font-extrabold">Messages</div>
        {!active ? (
          <div className="mt-4 text-sm text-ink/70">Select a thread.</div>
        ) : (
          <div className="mt-3 flex h-[520px] flex-col">
            <div className="flex-1 space-y-2 overflow-auto rounded-xl border border-ink/10 bg-white/50 p-3">
              {messages.map((m) => (
                <div key={m.id} className="rounded-xl border border-ink/10 bg-white/70 p-2 text-sm">
                  <div className="text-xs font-bold text-ink/60">{m.sender_email}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" />
              <Button onClick={send}>Send</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
