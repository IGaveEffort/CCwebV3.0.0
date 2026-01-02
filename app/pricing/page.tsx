import { Card, Button } from "../../components/ui";
import Link from "next/link";

const plans = [
  { name: "Starter", price: "$0", blurb: "For early testing and small campaigns.", items: ["Post 1 gig", "Up to 10 applications", "Deliverables tracking"] },
  { name: "Growth", price: "$199/mo", blurb: "For recurring campus programs.", items: ["Unlimited gigs", "Messaging after acceptance", "File uploads", "Basic analytics"] },
  { name: "Enterprise", price: "Custom", blurb: "For multi-campus rollouts.", items: ["SLA + support", "Custom onboarding", "Advanced analytics", "Admin workflows"] },
];

export default function Pricing() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Pricing</h1>
        <p className="text-ink/70">Simple plans for brands and teams of any size.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className="p-6">
            <div className="text-sm font-bold text-ink/70">{p.name}</div>
            <div className="mt-2 text-3xl font-black">{p.price}</div>
            <div className="mt-2 text-sm text-ink/70">{p.blurb}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth?mode=signup&role=employer" className="mt-6 block">
              <Button className="w-full">Get started</Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="text-lg font-extrabold">Notes</div>
        <div className="mt-1 text-sm text-ink/70">
          Payments are not implemented in this MVP. Add Stripe later and protect billing endpoints with the same rate limiting + input validation.
        </div>
      </Card>
    </div>
  );
}
