// The full web address of a portal page, for links that leave the portal
// and come back, such as Google sign-in returning to the role home.

import { STATIC_PREVIEW } from "@/shared/static-preview/staticPreview";

/** The absolute address of [path] (such as `/home`) on this portal. */
export function absoluteUrl(path: string): string {
  // The hosted preview keeps its address after `#`.
  return `${window.location.origin}${STATIC_PREVIEW ? `/#${path}` : path}`;
}
