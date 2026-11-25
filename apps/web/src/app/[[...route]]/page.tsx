// Every page of the portal and the public site, built ahead of time from the
// screen inventory: `/` is the public home, `/home` the role home, and every
// other address is a screen's route. Nothing here is typed per screen.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog } from "@/shared/catalog/catalogIndex";
import { screenFor } from "@/shared/catalog/screenFor";
import { ScreenPage } from "@/shared/page/ScreenPage";
import { hotelSchema } from "@/shared/seo/hotelSchema";
import { JsonLd } from "@/shared/seo/JsonLd";
import { pageMetadata } from "@/shared/seo/pageMetadata";
import { PreviewRoot } from "@/shared/static-preview/PreviewRoot";
import { STATIC_PREVIEW } from "@/shared/static-preview/staticPreview";

/** Only the addresses below exist; anything else is the Not found page. */
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ route?: string[] }>;
}

/** Every address to build: home, role home and one per screen (sample record for `:id`).
 *  The static preview builds only `/`, which draws every screen from the `#` address. */
export function generateStaticParams() {
  if (STATIC_PREVIEW) return [{ route: [] }];
  return [{ route: [] }, { route: ["home"] }, ...catalog.allScreens().map((s) => ({ route: catalog.hrefOf(s).slice(1).split("/") }))];
}

/** The page's title, description, sharing tags and robots rule. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { route } = await params;
  const spec = screenFor("/" + (route ?? []).join("/"));
  return spec ? pageMetadata(spec, "/" + (route ?? []).join("/")) : {};
}

/** Draws the page; the public home also carries the hotel's structured data. */
export default async function Page({ params }: PageProps) {
  // The static preview's one page draws the screen named after `#`.
  if (STATIC_PREVIEW) return <PreviewRoot />;
  const { route } = await params;
  const spec = screenFor("/" + (route ?? []).join("/"));
  if (!spec) notFound();
  return (
    <>
      {!route?.length && <JsonLd data={hotelSchema()} />}
      <ScreenPage id={spec.id} />
    </>
  );
}
