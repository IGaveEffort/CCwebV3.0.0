"use client";

import { useEffect } from "react";

export default function CalendlyInline() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;

  useEffect(() => {
    // Load Calendly script once.
    if (document.getElementById("calendly-widget-js")) return;
    const s = document.createElement("script");
    s.id = "calendly-widget-js";
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  if (!url) {
    return (
      <div className="rounded-2xl border border-[#12283f]/10 bg-white p-6 text-sm">
        Missing <code className="font-mono">NEXT_PUBLIC_CALENDLY_URL</code>. Add it in your env vars (Vercel + local).
      </div>
    );
  }

  return (
    <div
      className="calendly-inline-widget rounded-2xl border border-[#12283f]/10 bg-white"
      data-url={url}
      style={{ minWidth: "320px", height: "780px" }}
    />
  );
}
