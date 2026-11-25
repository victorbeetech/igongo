// The root of every page: the brand fonts and theme, the default meta tags,
// icons and sharing image, the toast area, cookie consent and analytics.

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { tokens } from "@igongo/design-tokens/tokens";
import { Analytics } from "@/shared/analytics/Analytics";
import { QueryProvider } from "@/shared/api/QueryProvider";
import { ConsentBanner } from "@/shared/analytics/ConsentBanner";
import { THEME_SCRIPT } from "@/shared/preferences/themeScript";
import { SITE } from "@/shared/seo/siteConfig";
import { Toaster } from "@/shared/ui/toast/Toaster";
import "./globals.css";

/** The meta tags every page starts with; each page adds its own title and description. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/web/favicon.ico", sizes: "48x48" },
      { url: "/brand/web/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/web/apple-touch-icon.png",
  },
  openGraph: { siteName: SITE.name, images: [{ url: SITE.ogImage, width: 1200, height: 630 }], locale: "en_UG", type: "website" },
  twitter: { card: "summary_large_image" },
  // Smart app banner on iPhone: the App Store ID is added once the app is listed (Phase 12).
  formatDetection: { telephone: false },
};

/** The browser bar is Igongo red in both modes, as the brand never changes. */
export const viewport: Viewport = { themeColor: tokens.color.light.primary, width: "device-width", initialScale: 1 };

/** The root layout. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a saved theme and text size before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {/* The live data cache for pages connected to the API. */}
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
