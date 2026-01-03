"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <AuthInner />
    </Suspense>
  );
}

function AuthInner() {
  const sp = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "employer">("student");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const m = sp.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [sp]);

  async function submit() {
    setMsg(null);

    if (!email || !password) {
      setMsg("Email and password required.");
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      if (error) setMsg(error.message);
      else setMsg("Check your email to confirm signup (if enabled).");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      return;
    }

    window.location.href = "/app";
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMsg("Signed out.");
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Campus Cliques</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        {mode === "login" ? "Log in to your account" : "Create your account"}
      </p>

      <div
        style={{
          display: "grid",
          gap: 10,
          padding: 14,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "#fff"
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode("login")}
            style={tab(mode === "login")}
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            style={tab(mode === "signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        {mode === "signup" ? (
          <label style={label()}>
            Account type
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={input()}
            >
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>
          </label>
        ) : null}

        <label style={label()}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input()}
            type="email"
            autoComplete="email"
          />
        </label>

        <label style={label()}>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input()}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>

        <button onClick={submit} style={btn()} type="button">
          {mode === "login" ? "Login" : "Create account"}
        </button>

        <button onClick={signOut} style={btn()} type="button">
          Sign out
        </button>

        {msg ? <p style={{ margin: 0, color: "crimson" }}>{msg}</p> : null}
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
    fontWeight: 900
  };
}

function tab(active: boolean): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: active ? "rgba(0,0,0,0.05)" : "#fff",
    fontWeight: 900,
    flex: 1
  };
}
