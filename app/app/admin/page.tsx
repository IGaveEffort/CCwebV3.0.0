"use client";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui";
import { supabaseBrowser } from "../../../lib/supabase-browser";

export default function AdminPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [role, setRole] = useState<string>("");
  const [snapshot, setSnapshot] = useState<any>(null);

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setRole(data.user?.user_metadata?.role ?? ""));
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/overview", { headers: await authHeader() });
      const data = await res.json();
      setSnapshot(data);
    })();
  }, []);

  if (role !== "admin") return <div>Forbidden</div>;

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black">Admin</div>
      <Card className="p-6">
        <div className="text-lg font-extrabold">Overview</div>
        <pre className="mt-3 overflow-auto rounded-xl border border-ink/10 bg-white/60 p-3 text-xs">
{JSON.stringify(snapshot, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
