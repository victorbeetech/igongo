// The robots file: search engines may read the public site; every portal
// page also says noindex in its own meta tags. On sample-data hosts
// (NEXT_PUBLIC_NOINDEX=1) every crawler is turned away from every page.

import type { MetadataRoute } from "next";
import { SITE } from "@/shared/seo/siteConfig";

/** Built once as a plain file, so it also works in the static preview. */
export const dynamic = "force-static";

/** Rules for search engine crawlers, with the sitemap's address. */
export default function robots(): MetadataRoute.Robots {
  if (!SITE.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
