// The sitemap for search engines: the public home and every public page.
// Portal pages are private and never listed.

import type { MetadataRoute } from "next";
import { catalog } from "@/shared/catalog/catalogIndex";
import { isPublic } from "@/shared/seo/pageMetadata";
import { SITE } from "@/shared/seo/siteConfig";

/** Built once as a plain file, so it also works in the static preview. */
export const dynamic = "force-static";

/** Every public address, with how often it changes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = catalog.allScreens().filter((s) => isPublic(s) && !s.route.includes(":id"));
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    ...pages.map((s) => ({ url: `${SITE.url}${s.route}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
