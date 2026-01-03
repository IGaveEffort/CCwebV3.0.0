"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";

export default function AppHome() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Campus Cliques Platform</h1>
      <p style={{ opacity: 0.8 }}>
        Use the navigation below to manage gigs, applications, tasks, and messages.
      </p>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <Link href="/app/gigs" style={btn()}>
          Gigs
        </Link>
        <Link href="/app/applications" style={btn()}>
          Applications
        </Link>
        <Link href="/app/tasks" style={btn()}>
          Tasks / Deliverables
        </Link>
        <Link href="/app/messages" style={btn()}>
          Messages
        </Link>
        <Link href="/app/admin" style={btn()}>
          Admin Panel
        </Link>
      </div>
    </div>
  );
}

function btn(): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    textDecoration: "none",
    color: "inherit",
    fontWeight: 700
  };
}
