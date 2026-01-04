import MarketingLayout from "../../components/marketing/MarketingLayout";
import CalendlyInline from "../../components/marketing/CalendlyInline";

export default function ForBrandsPage() {
  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">For Brands / Agencies</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          Traditional influencer marketing misses Gen Z authenticity. Campus Cliques gives you campus-native creators
          and real-world + digital activations — executed turnkey.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Problem</div>
            <div className="mt-2 text-sm opacity-80">
              Paid posts without campus context feel inauthentic. Gen Z trusts peers, not ads.
            </div>
          </div>
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Solution</div>
            <div className="mt-2 text-sm opacity-80">
              Campus-native creators + IRL activations + creator-led UGC, built for speed and conversion.
            </div>
          </div>
          <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
            <div className="text-sm font-semibold">Outcome</div>
            <div className="mt-2 text-sm opacity-80">
              Early loyalty → long-term CLV. On-campus credibility. Simple reporting.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Offerings</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Campus ambassadors", "Vetted creators matched to your brand, campus, and goals."],
            ["Pop-up events", "On-campus experiences that create real buzz."],
            ["Sampling + UGC", "Product drops paired with creator-led content."],
            ["Creator-led activations", "Content + IRL execution with performance recaps."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white p-6">
              <div className="text-base font-semibold">{t}</div>
              <div className="mt-2 text-sm opacity-80">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Why Campus Cliques</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Early loyalty → long-term CLV", "Win students before habits form."],
            ["On-campus credibility", "IRL + creator-led activation beats ads."],
            ["Turnkey execution", "We handle matching, management, deliverables, reporting."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
              <div className="text-sm font-semibold">{t}</div>
              <div className="mt-2 text-sm opacity-80">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10" id="book">
        <h2 className="text-2xl font-bold">Book a 15‑minute intro call</h2>
        <p className="mt-2 max-w-3xl text-sm opacity-80">
          We’ll map your campuses, activation style, budget, timeline, and deliverables.
        </p>

        <div className="mt-8">
          <CalendlyInline />
        </div>
      </section>
    </MarketingLayout>
  );
}
