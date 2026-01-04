"use client";

import MarketingLayout from "../../components/marketing/MarketingLayout";
import { useState } from "react";

export default function ForStudentsPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      school: String(form.get("school") ?? ""),
      email: String(form.get("email") ?? ""),
      socials: String(form.get("socials") ?? ""),
    };

    const res = await fetch("/api/leads/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? "sent" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">For Students (Ambassadors)</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          Join a vetted network of college creators running real-world + creator-led activations.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10">
          <h2 className="text-2xl font-bold">What you get</h2>
          <ul className="mt-4 space-y-2 text-sm opacity-85">
            <li>• Paid campaigns</li>
            <li>• Free products</li>
            <li>• Resume-building experience</li>
            <li>• Creator growth + social credibility</li>
            <li>• Brand access</li>
          </ul>

          <h3 className="mt-8 text-base font-semibold">How it works (3 steps)</h3>
          <ol className="mt-3 space-y-2 text-sm opacity-85">
            <li>1) Apply + get vetted</li>
            <li>2) Get matched to gigs</li>
            <li>3) Submit deliverables + get paid</li>
          </ol>
        </div>

        <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10" id="apply">
          <h2 className="text-2xl font-bold">Apply to join</h2>
          <p className="mt-2 text-sm opacity-80">We’re looking for consistent creators who can execute.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">School</label>
              <input
                name="school"
                required
                className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Social links</label>
              <input
                name="socials"
                placeholder="TikTok / Instagram / YouTube links"
                className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-[#12283f] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Submitting..." : "Submit Application"}
            </button>

            {status === "sent" ? (
              <div className="text-sm font-semibold text-green-700">Submitted. We’ll reach out if it’s a fit.</div>
            ) : null}
            {status === "error" ? (
              <div className="text-sm font-semibold text-red-700">
                Couldn’t submit. Try again, or use the Contact page.
              </div>
            ) : null}
          </form>
        </div>
      </section>
    </MarketingLayout>
  );
}
