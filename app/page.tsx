import Link from "next/link";
import { Button, Card } from "../components/ui";

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-ink/15 bg-white/60 px-3 py-1 text-xs font-semibold">{children}</span>;
}

export default function Page() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Pill>For Students, By Students</Pill>
            <Pill>Paid Gigs</Pill>
            <Pill>On-campus + UGC</Pill>
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Hire student creators. Launch campus wins.
          </h1>
          <p className="text-base leading-relaxed text-ink/80">
            Campus Cliques connects brands with student creators and ambassadors. Post gigs, review applicants, unlock messaging after acceptance,
            and manage deliverables in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth?mode=signup&role=student"><Button>Create student account</Button></Link>
            <Link href="/auth?mode=signup&role=employer"><Button variant="ghost">Create employer account</Button></Link>
            <Link href="/app"><Button variant="ghost">Open app</Button></Link>
          </div>
          <p className="text-xs text-ink/60">Built for Supabase (Auth + DB + Storage) with endpoint rate limiting.</p>
        </div>
        <Card className="p-6">
          <div className="grid gap-4">
            <div className="rounded-xl bg-accent/25 p-4">
              <div className="text-xs font-bold text-ink/70">EMPLOYERS</div>
              <div className="mt-1 text-lg font-extrabold">Post gigs in minutes</div>
              <div className="mt-1 text-sm text-ink/70">Define deliverables, budget, timeline, and target campuses.</div>
            </div>
            <div className="rounded-xl bg-white/70 p-4">
              <div className="text-xs font-bold text-ink/70">STUDENTS</div>
              <div className="mt-1 text-lg font-extrabold">Apply, get accepted, ship content</div>
              <div className="mt-1 text-sm text-ink/70">Track every gig, chat after acceptance, and submit links or uploads.</div>
            </div>
            <div className="rounded-xl bg-white/70 p-4">
              <div className="text-xs font-bold text-ink/70">ADMIN</div>
              <div className="mt-1 text-lg font-extrabold">Approve, audit, support</div>
              <div className="mt-1 text-sm text-ink/70">Manage users, gigs, and policy enforcement from one panel.</div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Student & employer accounts", "Separate onboarding flows, role-based access, secure RLS policies."],
          ["Applications dashboard", "Employers review applicants, accept/decline, and track status."],
          ["Messaging unlocks on acceptance", "Threads only exist when an application is accepted."],
          ["Tasks & deliverables", "Define tasks per gig; students submit links or file uploads."],
          ["Pricing", "Tiered plans with simple feature comparisons."],
          ["Admin panel", "View users/gigs, audit flags, and manage disputes."],
        ].map(([title, desc]) => (
          <Card key={title} className="p-5">
            <div className="text-lg font-extrabold">{title}</div>
            <div className="mt-1 text-sm text-ink/70">{desc}</div>
          </Card>
        ))}
      </section>

      <section className="rounded-xl2 border border-ink/10 bg-white/60 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-black">Ready to implement?</div>
            <div className="text-sm text-ink/70">This repo includes schema SQL, RLS, and a working MVP UI.</div>
          </div>
          <div className="flex gap-2">
            <Link href="/pricing"><Button>See pricing</Button></Link>
            <Link href="/app"><Button variant="ghost">Go to app</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
