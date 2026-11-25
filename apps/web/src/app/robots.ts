// The robots file: search engines may read the public site; every portal
// page also says noindex in its own meta tags.

import type { MetadataRoute } from "next";
import { SITE } from "@/shared/seo/siteConfig";

/** Rules for search engine crawlers, with the sitemap's address. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
