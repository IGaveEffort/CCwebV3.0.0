"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authHeader } from "../../_auth";

export default function GigDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [gig, setGig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function load(gigId: string) {
    try {
      const res = await fetch(`/api/gigs/${gigId}`, { headers: await authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load gig");

      setGig(data.gig ?? null);
      setTitle(data.gig?.title ?? "");
      setDescription(data.gig?.description ?? "");
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  }

  useEffect(() => {
    if (typeof id === "string" && id.length) load(id);
  }, [id]);

  async function save() {
    if (typeof id !== "string" || !id) return;

    const res = await fetch(`/api/gigs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error ?? "Save failed");
      return;
    }
    await load(id);
  }

  async function remove() {
    if (typeof id !== "string" || !id) return;

    const res = await fetch(`/api/gigs/${id}`, {
      method: "DELETE",
      headers: await authHeader()
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error ?? "Delete failed");
      return;
    }

    window.location.href = "/app/gigs";
  }

  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!gig) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, display: "grid", gap: 12, maxWidth: 760 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Gig</h1>

      <label style={label()}>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={input()} />
      </label>

      <label style={label()}>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...input(), minHeight: 140 }}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={save} style={btn()}>
          Save
        </button>
        <button onClick={remove} style={btn()}>
          Delete
        </button>
      </div>
    </div>
  );
}

function label(): React.CSSProperties {
  return { display: "grid", gap: 6, fontWeight: 800 };
}

function input(): React.CSSProperties {
  return {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#fff",
    fontWeight: 600
  };
}

function btn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    fontWeight: 800
  };
}
