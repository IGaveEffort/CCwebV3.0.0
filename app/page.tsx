import MarketingLayout from "../components/marketing/MarketingLayout";
import Link from "next/link";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-4 backdrop-blur">
      <div className="text-sm opacity-70">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero (Jobaway-inspired layout: big headline + right visual + CTA row) */}
      <section className="relative pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#12283f]/10 bg-white/60 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#a79dfd]" />
              For Students, By Students
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Activate college creators before brand loyalty is set.
            </h1>

            <p className="mt-4 max-w-xl text-base opacity-80 sm:text-lg">
              Campus Cliques connects brands with vetted college ambassadors through real‑world + creator‑led
              activations.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/for-brands"
                className="rounded-xl bg-[#12283f] px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                For Brands
              </Link>
              <Link
                href="/for-students"
                className="rounded-xl border border-[#12283f]/20 bg-white/60 px-5 py-3 text-center text-sm font-semibold hover:bg-white"
              >
                For Students
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Ambassadors" value="150+" />
              <Stat label="Followers" value="1M+" />
              <Stat label="Views" value="~15M" />
            </div>

            <div className="mt-6 text-sm opacity-70">
              Primary goals: book brand intro calls and capture ambassador sign‑ups.
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[#a79dfd]/20 blur-2xl" />
            <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-6 backdrop-blur">
              <div className="text-sm font-semibold">What you get</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-white p-4">
                  <div className="text-sm font-semibold">Brands</div>
                  <div className="mt-1 text-sm opacity-75">
                    Campus-native creators, IRL + UGC activations, and simple reporting.
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <div className="text-sm font-semibold">Students</div>
                  <div className="mt-1 text-sm opacity-75">
                    Paid campaigns, free products, resume-building experience, creator growth.
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <div className="text-sm font-semibold">Turnkey</div>
                  <div className="mt-1 text-sm opacity-75">
                    We recruit, vet, manage deliverables, and keep campaigns moving.
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#12283f]/10 bg-[#eaebff] p-4">
                <div className="text-xs font-semibold opacity-70">Quick path</div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/for-brands#book"
                    className="flex-1 rounded-xl bg-[#a79dfd] px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
                  >
                    Book a 15‑min intro call
                  </Link>
                  <Link
                    href="/for-students#apply"
                    className="flex-1 rounded-xl border border-[#12283f]/20 bg-white px-4 py-2 text-center text-sm font-semibold hover:bg-white/80"
                  >
                    Apply as an ambassador
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "Brands brief the campaign", d: "Goals, campuses, deliverables, timeline." },
            { n: "2", t: "We activate ambassadors", d: "Recruit + match creators, coordinate IRL + content." },
            { n: "3", t: "Execution + reporting", d: "UGC + on-campus activation + performance recap." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-[#12283f]/10 bg-white/60 p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a79dfd] text-sm font-bold text-white">
                {s.n}
              </div>
              <div className="mt-4 text-base font-semibold">{s.t}</div>
              <div className="mt-2 text-sm opacity-80">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/how-it-works" className="text-sm font-semibold underline underline-offset-4">
            See full breakdown
          </Link>
        </div>
      </section>

      {/* Credibility strip */}
      <section className="mt-16 rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10">
        <h2 className="text-2xl font-bold">Credibility, fast</h2>
        <p className="mt-2 max-w-3xl text-sm opacity-80">
          Traditional influencer marketing misses Gen Z authenticity. Campus Cliques is built on campus access:
          real students, real communities, real conversions.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6">
            <div className="text-sm font-semibold">Early loyalty → long-term CLV</div>
            <div className="mt-2 text-sm opacity-75">Win brands before habits form.</div>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <div className="text-sm font-semibold">On-campus credibility</div>
            <div className="mt-2 text-sm opacity-75">IRL + creator-led activation beats ads.</div>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <div className="text-sm font-semibold">Turnkey execution</div>
            <div className="mt-2 text-sm opacity-75">We handle matching, tasks, and reporting.</div>
          </div>
        </div>
      </section>

      {/* Dual CTAs */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-[#12283f] p-10 text-white">
          <div className="text-sm font-semibold opacity-90">For Brands / Agencies</div>
          <div className="mt-3 text-2xl font-bold">Book a 15‑minute intro call</div>
          <div className="mt-2 text-sm opacity-90">
            We’ll map your campuses, activation style, and creator deliverables.
          </div>
          <Link
            href="/for-brands#book"
            className="mt-6 inline-flex rounded-xl bg-[#a79dfd] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Book a Call
          </Link>
        </div>

        <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10">
          <div className="text-sm font-semibold">For Students</div>
          <div className="mt-3 text-2xl font-bold">Apply to join the ambassador network</div>
          <div className="mt-2 text-sm opacity-80">
            Paid opportunities, brand access, resume-building experience, and creator growth.
          </div>
          <Link
            href="/for-students#apply"
            className="mt-6 inline-flex rounded-xl bg-[#12283f] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
