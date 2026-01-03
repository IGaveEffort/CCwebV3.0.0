"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { authHeader } from "../_auth";

type Snapshot = Record<string, unknown> | null;

export default function AdminPage() {
  const [snapshot, setSnapshot] = useState<Snapshot>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const headers = await authHeader();
        const res = await fetch("/api/admin/overview", { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Request failed");
        setSnapshot(data);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Admin Overview</h1>

      {error ? (
        <p style={{ color: "crimson" }}>{error}</p>
      ) : (
        <pre
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 16,
            borderRadius: 12,
            overflow: "auto"
          }}
        >
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      )}
    </div>
  );
}
