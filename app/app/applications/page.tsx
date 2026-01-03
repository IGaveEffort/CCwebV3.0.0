"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Card } from "../../../components/ui";
import { authHeader } from "../_auth";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/applications", { headers: await authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Failed to load applications");
        setApps(data.applications ?? []);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Applications</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {apps.map((a) => (
          <Card key={a.id}>
            <div style={{ padding: 16, display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800 }}>{a.gig_title ?? a.gig_id}</div>
              <div style={{ opacity: 0.85 }}>Status: {a.status}</div>
              <div style={{ opacity: 0.75, fontSize: 12 }}>ID: {a.id}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
