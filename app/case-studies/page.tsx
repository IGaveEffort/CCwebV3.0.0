import MarketingLayout from "../../components/marketing/MarketingLayout";

const studies = [
  {
    title: "Campus Sampling + UGC",
    type: "Sampling + UGC",
    metrics: "8 campuses · 120 creators · 2.1M views",
    details: "Ambassadors distributed product, captured short-form content, and drove in-store visits.",
  },
  {
    title: "Pop-up Event Activation",
    type: "Pop-up / Experiential",
    metrics: "1 campus · 600 attendees · 18% email capture rate",
    details: "On-campus pop-up with creator coverage and post-event recap report.",
  },
  {
    title: "Creator-led Product Launch",
    type: "UGC + Creator Activation",
    metrics: "40 creators · 410k views · 3.6% CTR",
    details: "Matched creators by niche, coordinated posting windows, and measured click-through.",
  },
];

export default function CaseStudiesPage() {
  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">Case Studies / Activations</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          Proof beats promises. Replace these examples with your real activations as you launch.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {studies.map((s) => (
            <div key={s.title} className="rounded-[2rem] border border-[#12283f]/10 bg-white/60 p-6">
              <div className="text-xs font-semibold opacity-70">{s.type}</div>
              <div className="mt-2 text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm font-semibold">{s.metrics}</div>
              <div className="mt-2 text-sm opacity-80">{s.details}</div>
              <div className="mt-4 h-32 rounded-2xl bg-[#a79dfd]/20" aria-hidden />
              <div className="mt-2 text-xs opacity-60">Visual placeholder</div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
