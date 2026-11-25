// Every page of the portal and the public site, built ahead of time from the
// screen inventory: `/` is the public home, `/home` the role home, and every
// other address is a screen's route. Nothing here is typed per screen.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenSpec } from "@/shared/catalog/types";
import { ScreenPage } from "@/shared/page/ScreenPage";
import { hotelSchema } from "@/shared/seo/hotelSchema";
import { JsonLd } from "@/shared/seo/JsonLd";
import { pageMetadata } from "@/shared/seo/pageMetadata";

/** Only the addresses below exist; anything else is the Not found page. */
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ route?: string[] }>;
}

// Finds the screen for an address: `/` is the guest home, `/home` the role home.
function screenFor(route: string[] | undefined): ScreenSpec | undefined {
  const path = "/" + (route ?? []).join("/");
  if (path === "/") return catalog.screen("S00-04");
  if (path === "/home") return catalog.screen("S00-21");
  return catalog.screenAt(path);
}

/** Every address to build: home, role home and one per screen (sample record for `:id`). */
export function generateStaticParams() {
  return [{ route: [] }, { route: ["home"] }, ...catalog.allScreens().map((s) => ({ route: catalog.hrefOf(s).slice(1).split("/") }))];
}

/** The page's title, description, sharing tags and robots rule. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { route } = await params;
  const spec = screenFor(route);
  return spec ? pageMetadata(spec, "/" + (route ?? []).join("/")) : {};
}

/** Draws the page; the public home also carries the hotel's structured data. */
export default async function Page({ params }: PageProps) {
  const { route } = await params;
  const spec = screenFor(route);
  if (!spec) notFound();
  return (
    <>
      {!route?.length && <JsonLd data={hotelSchema()} />}
      <ScreenPage id={spec.id} />
    </>
  );
}
