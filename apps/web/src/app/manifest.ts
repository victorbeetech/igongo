// The web app manifest: name, colours and icons from the brand kit, so the
// portal installs on a phone or computer like an app.

import type { MetadataRoute } from "next";
import { tokens } from "@igongo/design-tokens/tokens";
import { SITE } from "@/shared/seo/siteConfig";

/** The manifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    start_url: "/home",
    display: "standalone",
    theme_color: tokens.color.light.primary,
    background_color: tokens.color.light.background,
    icons: [
      { src: "/brand/web/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/web/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/web/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
