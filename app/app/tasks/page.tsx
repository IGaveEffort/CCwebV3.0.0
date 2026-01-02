"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input } from "../../../components/ui";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function TasksPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [items, setItems] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [link, setLink] = useState("");

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tasks", { headers: await authHeader() });
      const data = await res.json();
      setItems(data.items ?? []);
    })();
  }, []);

  async function submitLink() {
    if (!active) return;
    const res = await fetch(`/api/tasks/${active.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ link }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error ?? "Error");
    alert("Submitted");
    setLink("");
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 md:col-span-1">
        <div className="text-lg font-extrabold">Tasks</div>
        <div className="mt-3 space-y-2">
          {items.map((t) => (
            <button
              key={t.id}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                active?.id === t.id ? "border-accent bg-accent/20" : "border-ink/10 bg-white/60"
              }`}
              onClick={() => setActive(t)}
            >
              <div className="font-bold">{t.gig_title}</div>
              <div className="text-xs text-ink/60">{t.title}</div>
            </button>
          ))}
          {items.length === 0 && <div className="text-sm text-ink/70">No tasks yet.</div>}
        </div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <div className="text-lg font-extrabold">Submit deliverable</div>
        {!active ? (
          <div className="mt-4 text-sm text-ink/70">Select a task.</div>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-ink/10 bg-white/60 p-3">
              <div className="text-sm font-bold">{active.title}</div>
              <div className="text-xs text-ink/60">{active.instructions}</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-bold text-ink/70">Link</div>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://drive.google.com/…" />
            </div>

            <Button onClick={submitLink} disabled={!link.trim()}>Submit link</Button>

            <div className="text-xs text-ink/60">
              File uploads: enable the Supabase Storage bucket in SQL and use signed uploads. (See README_DEPLOYMENT.)
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
