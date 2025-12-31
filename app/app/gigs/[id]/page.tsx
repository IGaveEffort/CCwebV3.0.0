"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button } from "../../../../components/ui";
import { supabaseBrowser } from "../../../../lib/supabase-browser";

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [gig, setGig] = useState<any>(null);
  const [role, setRole] = useState<string>("student");
  const [status, setStatus] = useState<string>("");

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setRole(data.user?.user_metadata?.role ?? "student"));
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/gigs/${id}`, { headers: await authHeader() });
      const data = await res.json();
      setGig(data.gig);
      setStatus(data.myApplication?.status ?? "");
    })();
  }, [id]);

  async function apply() {
    const res = await fetch(`/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ gig_id: id }),
    });
    const data = await res.json();
    if (res.ok) setStatus(data.application.status);
    else alert(data.error ?? "Error");
  }

  if (!gig) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="text-2xl font-black">{gig.title}</div>
        <div className="mt-2 text-sm text-ink/70">{gig.description}</div>
        <div className="mt-3 text-sm">Budget: <span className="font-bold">${gig.budget}</span></div>

        {role === "student" && (
          <div className="mt-4">
            {status ? (
              <div className="text-sm">Application status: <span className="font-bold">{status}</span></div>
            ) : (
              <Button onClick={apply}>Apply</Button>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="text-lg font-extrabold">Applications</div>
        <div className="mt-3 space-y-2 text-sm">
          {(gig.applications ?? []).map((a: any) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/60 p-3">
              <div>
                <div className="font-semibold">{a.student_email}</div>
                <div className="text-xs text-ink/60">status: {a.status}</div>
              </div>
              {role === "employer" && (
                <div className="flex gap-2">
                  <ActionButton gigId={id} appId={a.id} action="accept" />
                  <ActionButton gigId={id} appId={a.id} action="decline" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ActionButton({ gigId, appId, action }: { gigId: string; appId: string; action: "accept" | "decline" }) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  async function go() {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Error");
    location.reload();
  }
  return (
    <button
      className={`rounded-xl px-3 py-1 text-xs font-bold border ${action === "accept" ? "bg-accent/35 border-accent" : "bg-white/70 border-ink/15"}`}
      onClick={go}
    >
      {action}
    </button>
  );
}
