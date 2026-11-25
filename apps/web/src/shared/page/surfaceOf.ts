// Which frame a page uses on the web, from where the inventory says it lives.

import type { ScreenSpec } from "@/shared/catalog/types";

/** The web frame for a page: portal, sign-in, public site, or the app-only notice. */
export type WebFrame = "portal" | "auth" | "public" | "appOnly";

/** Picks the frame for [spec]. */
export function frameOf(spec: ScreenSpec): WebFrame {
  // Step 1: the sign-in pages (module 00, numbers 1 to 20) use the sign-in frame,
  // except the guest home (S00-04), which is the public site's front page.
  if (spec.id.startsWith("S00-") && Number(spec.id.slice(4)) <= 20 && spec.id !== "S00-04") return "auth";
  // Step 2: anything on the web portal uses the portal frame.
  if (spec.surfaces.includes("web")) return "portal";
  // Step 3: public pages use the public site frame.
  if (spec.surfaces.includes("public")) return "public";
  // Step 4: app and kiosk screens show a notice inside the portal frame.
  return "appOnly";
}
