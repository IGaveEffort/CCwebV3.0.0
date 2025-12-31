"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Textarea } from "../../../components/ui";
import { supabaseBrowser } from "../../../lib/supabase-browser";

type Gig = { id: string; title: string; description: string; budget: number; created_at: string };

export default function GigsPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [role, setRole] = useState<string>("student");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("150");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setRole(data.user?.user_metadata?.role ?? "student"));
  }, [supabase]);

  async function load() {
    const res = await fetch("/api/gigs", { headers: await authHeader() });
    const data = await res.json();
    setGigs(data.gigs ?? []);
  }

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => { load(); }, []);

  async function createGig() {
    setMsg(null);
    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ title, description, budget: Number(budget) }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error ?? "Error");
    setTitle(""); setDescription(""); setBudget("150");
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black">Gigs</div>

      {role === "employer" && (
        <Card className="p-5">
          <div className="text-lg font-extrabold">Post a gig</div>
          <div className="mt-3 grid gap-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Gig title" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe deliverables, timeline, target campus, etc." rows={4} />
            <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (USD)" />
            {msg && <div className="text-sm text-red-700">{msg}</div>}
            <Button disabled={!title || !description} onClick={createGig}>Publish</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {gigs.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold">{g.title}</div>
                <div className="mt-1 text-sm text-ink/70">{g.description}</div>
                <div className="mt-2 text-xs text-ink/60">Budget: ${g.budget}</div>
              </div>
              <a className="underline text-sm" href={`/app/gigs/${g.id}`}>Open</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
