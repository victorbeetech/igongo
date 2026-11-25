// Draws one brand kit illustration inline, so its `currentColor` lines take
// the text colour of the tone around it (light and dark mode alike). The
// Igongo spiral inside it stays Igongo red.

import { ILLUSTRATIONS, type IllustrationKind } from "./illustrations.g";

/** A state illustration, 160 by 120. Decorative: the message says the same in words. */
export function StateIllustration({ kind, className = "" }: { kind: IllustrationKind; className?: string }) {
  // The SVG text comes from our own brand kit at build time, never from a user.
  return <span aria-hidden className={`block h-[120px] w-[160px] ${className}`} dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[kind] }} />;
}
