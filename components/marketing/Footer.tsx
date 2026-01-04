import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#12283f]/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold">Campus Cliques</div>
            <p className="mt-2 text-sm opacity-80">
              For Students, By Students. We help brands activate college creators before loyalty is set.
            </p>
            <div className="mt-4 text-sm font-medium">150+ ambassadors · 1M+ followers · ~15M views</div>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold">Explore</div>
            <Link href="/for-brands" className="opacity-80 hover:opacity-100">
              For Brands
            </Link>
            <Link href="/for-students" className="opacity-80 hover:opacity-100">
              For Students
            </Link>
            <Link href="/case-studies" className="opacity-80 hover:opacity-100">
              Case Studies
            </Link>
            <Link href="/about" className="opacity-80 hover:opacity-100">
              About
            </Link>
            <Link href="/contact" className="opacity-80 hover:opacity-100">
              Contact
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold">Legal</div>
            <Link href="/privacy" className="opacity-80 hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="opacity-80 hover:opacity-100">
              Terms
            </Link>

            <div className="mt-4 font-semibold">Social</div>
            <div className="flex gap-3">
              <a className="opacity-80 hover:opacity-100" href="#" aria-label="Instagram">
                Instagram
              </a>
              <a className="opacity-80 hover:opacity-100" href="#" aria-label="TikTok">
                TikTok
              </a>
              <a className="opacity-80 hover:opacity-100" href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs opacity-70">© {new Date().getFullYear()} Campus Cliques</div>
      </div>
    </footer>
  );
}
