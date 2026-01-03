"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { authHeader } from "../_auth";

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadThreads() {
    const res = await fetch("/api/messages/threads", { headers: await authHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to load threads");
    setThreads(data.threads ?? []);
  }

  async function loadMessages(threadId: string) {
    const res = await fetch(`/api/messages/${threadId}`, { headers: await authHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to load messages");
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadThreads();
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!active) return;
      try {
        await loadMessages(active);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [active]);

  async function send() {
    if (!active || !text.trim()) return;

    const res = await fetch(`/api/messages/${active}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ content: text })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error ?? "Send failed");
      return;
    }

    setText("");
    await loadMessages(active);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Messages</h1>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        <div style={panel()}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Threads</div>
          <div style={{ display: "grid", gap: 6 }}>
            {threads.map((t) => {
              const id = t.thread_id ?? t.id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.10)",
                    background: active === id ? "rgba(0,0,0,0.04)" : "#fff",
                    fontWeight: 700
                  }}
                >
                  {t.gig_title ?? "Thread"}
                </button>
              );
            })}
          </div>
        </div>

        <div style={panel()}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Conversation</div>

          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{m.sender_id}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "#fff"
              }}
            />
            <button onClick={send} style={btn()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function panel(): React.CSSProperties {
  return {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 12,
    padding: 12,
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
