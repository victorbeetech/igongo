// S00-04 Explore as guest home, the public site's front page: a brand hero,
// then one tile per guest area. It is what search engines and visitors see first.

import Link from "next/link";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { TileGrid } from "@/shared/screens/home/TileGrid";
import { iconFor } from "@/shared/ui/icons/moduleIcons";
import { HomeTile } from "@/shared/ui/tile/HomeTile";

/** The public front page. */
export function GuestHomePage({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  // Sign in is in the header already, so the tiles show only the guest areas.
  const areas = screen.links.filter((id) => id !== "S00-05");
  return (
    <>
      {/* Step 1: the hero on Igongo red with the spiral pattern; one H1 for search engines. */}
      <section className="m-4 rounded-lg bg-primary bg-[url('/brand/pattern/igongo-pattern-spiral-on-red.svg')] bg-cover px-6 py-12 text-on-primary sm:py-16">
        <h1 className="font-brand text-display font-bold tracking-wide sm:text-[calc(var(--t-display-size)*1.5)]">Igongo Country Hotel &amp; Cultural Centre</h1>
        <p className="mt-3 max-w-xl text-subtitle">Stay, dine and discover the culture of Ankole at Biharwe, Mbarara.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={hrefFor("S67-01", here)} className="rounded-md bg-surface px-4 py-2.5 text-label font-bold text-ink">Book a room</Link>
          <Link href={hrefFor("S68-01", here)} className="rounded-md border border-on-primary px-4 py-2.5 text-label font-bold">Visit the museum</Link>
        </div>
      </section>
      {/* Step 2: every guest area. */}
      <h2 className="px-4 pt-4 text-title font-bold">Explore Igongo</h2>
      <div className="p-4">
        <TileGrid>
          {areas.map((id) => {
            const Icon = iconFor(id);
            return <HomeTile key={id} label={catalog.nameOf(id)} icon={<Icon size={20} />} href={hrefFor(id, here)} />;
          })}
        </TileGrid>
      </div>
    </>
  );
}
