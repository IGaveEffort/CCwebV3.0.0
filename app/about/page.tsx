import MarketingLayout from "../../components/marketing/MarketingLayout";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">About</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          Mission: build early brand loyalty on campus through authentic, creator-led activations.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Network</div>
            <div className="mt-2 text-sm opacity-80">Vetted ambassadors across campuses with real reach.</div>
          </div>
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Values</div>
            <div className="mt-2 text-sm opacity-80">Diversity, authenticity, and conversion-first execution.</div>
          </div>
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Execution</div>
            <div className="mt-2 text-sm opacity-80">Turnkey: we recruit, manage, and report.</div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
