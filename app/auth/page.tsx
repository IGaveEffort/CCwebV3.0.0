"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card, Input } from "../../components/ui";
import { supabaseBrowser } from "../../lib/supabase-browser";

export default function AuthPage() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode") ?? "signin";
  const role = params.get("role") ?? "student";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => supabaseBrowser(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/app");
    });
  }, [router, supabase]);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role } },
        });
        if (error) throw error;
        router.push("/app");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/app");
      }
    } catch (e: any) {
      setError(e.message ?? "Auth error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <div className="text-2xl font-black">{mode === "signup" ? "Create account" : "Sign in"}</div>
        <div className="mt-1 text-sm text-ink/70">
          {mode === "signup" ? "Choose a role and create your account." : "Welcome back."}
        </div>

        {mode === "signup" && (
          <div className="mt-4 flex gap-2">
            {(["student", "employer"].map((r) => (
              <a
                key={r}
                href={`/auth?mode=signup&role=${r}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                  role === r ? "bg-accent/35 border-accent" : "bg-white/60 border-ink/15"
                }`}
              >
                {r}
              </a>
            )))}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div>
            <div className="mb-1 text-xs font-bold text-ink/70">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-ink/70">Password</div>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
          </div>
          {error && <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-700">{error}</div>}
          <Button className="w-full" disabled={busy || !email || !password} onClick={onSubmit}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <div className="text-center text-xs text-ink/70">
            {mode === "signup" ? (
              <a className="underline" href="/auth">Already have an account? Sign in</a>
            ) : (
              <a className="underline" href="/auth?mode=signup&role=student">Need an account? Sign up</a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
