"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { authHeader } from "../_auth";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/tasks", { headers: await authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load tasks");
      setTasks(data.tasks ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(taskId: string) {
    const link = prompt("Paste your deliverable link (Drive, Dropbox, etc):");
    if (!link) return;

    const res = await fetch(`/api/tasks/${taskId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ link })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error ?? "Submission failed");
      return;
    }
    await load();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Tasks</h1>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: 12,
              background: "#fff",
              display: "grid",
              gap: 6
            }}
          >
            <div style={{ fontWeight: 800 }}>{t.title}</div>
            <div style={{ opacity: 0.85 }}>{t.description}</div>
            <div style={{ opacity: 0.75, fontSize: 12 }}>
              Gig: {t.gig_id} • Due: {t.due_at ?? "n/a"}
            </div>

            <div style={{ marginTop: 6 }}>
              <button onClick={() => submit(t.id)} style={btn()}>
                Submit link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function btn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    fontWeight: 700
  };
}
