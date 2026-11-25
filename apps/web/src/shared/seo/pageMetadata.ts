// Builds each page's title, description, sharing tags and robots rule from
// its screen. Public pages are indexed; portal pages never are.

import type { Metadata } from "next";
import type { ScreenSpec } from "@/shared/catalog/types";
import { SITE } from "./siteConfig";

/** Whether search engines may index [spec]: only public pages. */
export const isPublic = (spec: ScreenSpec) => spec.surfaces.includes("public");

/** The meta tags for [spec] at the address [path]. */
export function pageMetadata(spec: ScreenSpec, path: string): Metadata {
  const indexable = isPublic(spec);
  return {
    title: spec.name,
    description: indexable ? `${spec.purpose}. ${SITE.name}, Mbarara.` : spec.purpose,
    alternates: { canonical: path },
    // Portal pages are private: keep them out of search results.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: `${spec.name} | ${SITE.shortName}`, description: spec.purpose, url: path, siteName: SITE.name, images: [SITE.ogImage], type: "website" },
  };
}
