import "./globals.css";
import Link from "next/link";
import { Button } from "../components/ui";

export const metadata = {
  title: "Campus Cliques",
  description: "For Students, By Students — marketing gigs and ambassadors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-50 border-b border-ink/10 bg-bg/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-extrabold tracking-tight">
              Campus <span className="text-ink/70">Cliques</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link className="text-sm hover:underline" href="/pricing">Pricing</Link>
              <Link className="text-sm hover:underline" href="/app">App</Link>
              <Link className="text-sm hover:underline" href="/auth">Sign in</Link>
              <Link href="/auth?mode=signup">
                <Button className="ml-1" variant="primary">Create account</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="border-t border-ink/10 py-10">
          <div className="mx-auto max-w-6xl px-4 text-sm text-ink/70">
            © {new Date().getFullYear()} Campus Cliques. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
