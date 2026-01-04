import MarketingLayout from "../../components/marketing/MarketingLayout";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">How It Works</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          A simple, campus-first workflow designed for speed, authenticity, and conversion.
        </p>

        <div className="mt-10 grid gap-4">
          {[
            {
              t: "Step 1: Brands brief the campaign",
              d: "Tell us your goals, campuses, deliverables, timeline, and any product logistics.",
            },
            {
              t: "Step 2: Campus Cliques activates ambassadors",
              d: "We recruit + match vetted ambassadors, coordinate IRL execution, and set content tasks.",
            },
            {
              t: "Step 3: Content + IRL execution + reporting",
              d: "Ambassadors submit deliverables, activations run on-campus, and you get a recap report.",
            },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-8">
              <div className="text-lg font-semibold">{s.t}</div>
              <div className="mt-2 text-sm opacity-80">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/for-brands#book" className="rounded-xl bg-[#12283f] px-5 py-3 text-sm font-semibold text-white">
            Book a Call
          </Link>
          <Link
            href="/for-students#apply"
            className="rounded-xl border border-[#12283f]/20 bg-white/60 px-5 py-3 text-sm font-semibold"
          >
            Apply as a Student
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
