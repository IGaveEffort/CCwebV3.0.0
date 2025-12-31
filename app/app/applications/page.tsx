"use client";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function ApplicationsPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [apps, setApps] = useState<any[]>([]);

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/applications", { headers: await authHeader() });
      const data = await res.json();
      setApps(data.applications ?? []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black">Applications</div>
      <div className="grid gap-3">
        {apps.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="font-extrabold">{a.gig_title}</div>
            <div className="mt-1 text-sm text-ink/70">status: <span className="font-bold">{a.status}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
