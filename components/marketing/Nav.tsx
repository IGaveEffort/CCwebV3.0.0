"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/for-brands", label: "For Brands" },
  { href: "/for-students", label: "For Students" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#12283f]/10 bg-[#eaebff]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#a79dfd] text-white">
            CC
          </span>
          <span>Campus Cliques</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "text-sm font-medium transition hover:opacity-80 " +
                  (active ? "underline underline-offset-8" : "")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/for-brands#book"
            className="rounded-xl bg-[#12283f] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}
