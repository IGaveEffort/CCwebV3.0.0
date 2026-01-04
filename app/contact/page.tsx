"use client";

import MarketingLayout from "../../components/marketing/MarketingLayout";
import { useState } from "react";

type Mode = "brand" | "student";

export default function ContactPage() {
  const [mode, setMode] = useState<Mode>("brand");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };

    const endpoint = mode === "brand" ? "/api/leads/brand" : "/api/leads/student";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mode === "brand"
          ? payload
          : { name: payload.name, email: payload.email, school: payload.company, socials: payload.message }
      ),
    });

    setStatus(res.ok ? "sent" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <MarketingLayout>
      <section className="pt-12">
        <h1 className="text-4xl font-extrabold">Contact</h1>
        <p className="mt-3 max-w-3xl text-base opacity-80">
          Brand inquiry or student question — choose a tab and send a message.
        </p>

        <div className="mt-8 inline-flex rounded-2xl border border-[#12283f]/10 bg-white/60 p-1">
          <button
            className={
              "rounded-2xl px-4 py-2 text-sm font-semibold " +
              (mode === "brand" ? "bg-[#12283f] text-white" : "opacity-70")
            }
            onClick={() => setMode("brand")}
            type="button"
          >
            Brands
          </button>
          <button
            className={
              "rounded-2xl px-4 py-2 text-sm font-semibold " +
              (mode === "student" ? "bg-[#12283f] text-white" : "opacity-70")
            }
            onClick={() => setMode("student")}
            type="button"
          >
            Students
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submit} className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10">
            <div className="text-lg font-bold">{mode === "brand" ? "Brand inquiry" : "Student inquiry"}</div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input
                  name="name"
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

              {mode === "brand" ? (
                <div>
                  <label className="text-sm font-semibold">Company</label>
                  <input
                    name="company"
                    className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold">School</label>
                  <input
                    name="company"
                    className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold">{mode === "brand" ? "Message" : "Social links + note"}</label>
                <textarea
                  name="message"
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-[#12283f]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#a79dfd]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-xl bg-[#12283f] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send"}
              </button>

              {status === "sent" ? <div className="text-sm font-semibold text-green-700">Sent.</div> : null}
              {status === "error" ? (
                <div className="text-sm font-semibold text-red-700">Couldn’t send. Try again.</div>
              ) : null}
            </div>
          </form>

          <div className="rounded-[2.5rem] border border-[#12283f]/10 bg-white/60 p-10">
            <div className="text-lg font-bold">Email</div>
            <div className="mt-2 text-sm opacity-80">Replace with your real inbox.</div>
            <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold">hello@campuscliques.com</div>

            <div className="mt-8 text-lg font-bold">Social</div>
            <div className="mt-4 grid gap-2 text-sm">
              <a href="#" className="rounded-2xl bg-white p-4 font-semibold">
                Instagram
              </a>
              <a href="#" className="rounded-2xl bg-white p-4 font-semibold">
                TikTok
              </a>
              <a href="#" className="rounded-2xl bg-white p-4 font-semibold">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
