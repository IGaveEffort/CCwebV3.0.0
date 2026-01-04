"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // If already authed, redirect to app.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/app");
    });

    // Optional: ?mode=signup
    const m = searchParams.get("mode");
    if (m === "signup") setMode("signup");
  }, [router, supabase, searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth` },
      });
      if (error) return setMsg(error.message);
      setMsg("Check your email to confirm your account.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    router.push("/app");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#12283f]">{mode === "login" ? "Log in" : "Create account"}</h1>
      <p className="mt-2 text-sm opacity-75">Access the Campus Cliques platform.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-[#12283f]/10 bg-white p-6">
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-[#12283f]/20 px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            className="mt-1 w-full rounded-xl border border-[#12283f]/20 px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full rounded-xl bg-[#12283f] px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>

        {msg ? <div className="text-sm font-semibold">{msg}</div> : null}

        <div className="flex justify-between text-xs opacity-80">
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm">Loading...</div>}>
      <AuthInner />
    </Suspense>
  );
}
