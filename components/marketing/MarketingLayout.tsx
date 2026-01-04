import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eaebff] text-[#12283f]">
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
