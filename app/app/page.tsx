"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, Button } from "../../components/ui";
import { supabaseBrowser } from "../../lib/supabase-browser";

type Role = "student" | "employer" | "admin";

export default function AppHome() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<Role>("student");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setEmail(u.email ?? "");
      setRole((u.user_metadata?.role ?? "student") as Role);
    });
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    location.href = "/";
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-black">Dashboard</div>
            <div className="text-sm text-ink/70">{email} · role: <span className="font-bold">{role}</span></div>
          </div>
          <div className="flex gap-2">
            <Link href="/app/gigs"><Button>Gigs</Button></Link>
            <Link href="/app/applications"><Button variant="ghost">Applications</Button></Link>
            <Link href="/app/messages"><Button variant="ghost">Messages</Button></Link>
            <Link href="/app/tasks"><Button variant="ghost">Tasks</Button></Link>
            {role === "admin" && <Link href="/app/admin"><Button variant="ghost">Admin</Button></Link>}
            <Button variant="ghost" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="text-lg font-extrabold">Quick start</div>
          <div className="mt-1 text-sm text-ink/70">
            This MVP uses Supabase tables + RLS. Use the included SQL to create schema, policies, and storage buckets.
          </div>
          <div className="mt-4 flex gap-2">
            <a href="/docs/README_DEPLOYMENT.md" className="underline text-sm">Deployment guide</a>
            <a href="/docs/SQL_SCHEMA.sql" className="underline text-sm">SQL schema</a>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-lg font-extrabold">What works in this template</div>
          <ul className="mt-2 space-y-2 text-sm text-ink/80">
            <li>• Auth with role metadata (student/employer/admin)</li>
            <li>• API endpoints with Zod input validation + Upstash rate limiting</li>
            <li>• Gigs + applications basic flows</li>
            <li>• Messaging gated by accepted applications</li>
            <li>• Tasks/deliverables with link submissions + (optional) file uploads via Supabase Storage</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
