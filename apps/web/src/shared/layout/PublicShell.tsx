// The frame for public pages: the logo, the main guest links and Sign in at
// the top; the hotel's details at the bottom. Plain links help search engines.

import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/shared/ui/logo/Logo";

// The main guest pages, linked from every public page.
const NAV = [
  ["Rooms", "/room-bookings/rooms"],
  ["Dining", "/food-ordering/food-home"],
  ["Museum", "/museum/museum-home"],
  ["Events", "/events-conferences/events-home"],
  ["Pool", "/pool/pool-home"],
  ["Spa", "/spa/spa-home"],
  ["Shop", "/crafts-bookshop/shop"],
] as const;

/** The public page frame. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <Link href="/" aria-label="Igongo home"><Logo shape="horizontal" height={40} /></Link>
          {/* On phones the links sit on their own scrolling row under the logo. */}
          <nav aria-label="Main" className="order-last flex w-full gap-4 overflow-x-auto text-label font-bold whitespace-nowrap sm:order-none sm:w-auto sm:flex-1">
            {NAV.map(([label, href]) => <Link key={href} href={href} className="hover:text-primary-text">{label}</Link>)}
          </nav>
          <Link href="/sign-in" className="ml-auto rounded-md bg-primary px-4 py-2 text-label font-bold text-on-primary">Sign in</Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-1 px-4 py-6 text-caption text-muted">
          <span className="font-brand text-subtitle text-ink">IGONGO COUNTRY HOTEL &amp; CULTURAL CENTRE</span>
          <span>Biharwe, Mbarara, Uganda</span>
          <span><Link href="/about" className="underline">About</Link> · <Link href="/help-and-support" className="underline">Help</Link></span>
        </div>
      </footer>
    </div>
  );
}
