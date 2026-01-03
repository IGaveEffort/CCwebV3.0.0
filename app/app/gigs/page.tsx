"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui";
import { authHeader } from "../_auth";

export default function GigsPage() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/gigs", { headers: await authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load gigs");
      setGigs(data.gigs ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createGig() {
    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader()) },
        body: JSON.stringify({
          title,
          description,
          status: "open",
          pay_cents: 0
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Create failed");

      setTitle("");
      setDescription("");
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Create failed");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Gigs</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: 8, maxWidth: 720, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Gig title"
          style={input()}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Gig description"
          style={{ ...input(), minHeight: 100 }}
        />
        <button onClick={createGig} style={btn()}>
          Create Gig
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {gigs.map((g) => (
          <Card key={g.id}>
            <div style={{ padding: 16, display: "grid", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>{g.title}</div>
                <Link href={`/app/gigs/${g.id}`} style={{ fontWeight: 800, textDecoration: "none" }}>
                  Open →
                </Link>
              </div>
              <div style={{ opacity: 0.85 }}>{g.description}</div>
              <div style={{ opacity: 0.75, fontSize: 12 }}>Status: {g.status}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function input(): React.CSSProperties {
  return {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#fff"
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
