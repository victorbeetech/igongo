// Picks the brand kit drawing for a result page from its name, the same rule
// as the app (IllustrationKind.forName).

import type { IllustrationKind } from "./illustrations.g";

/** The drawing for a page called [name], such as "Page not found", or undefined when an icon suits it better. */
export function illustrationFor(name: string): IllustrationKind | undefined {
  // Each rule is checked in order; the first match wins.
  const n = name.toLowerCase();
  if (n.includes("not found")) return "not-found";
  if (n.includes("went wrong") || n.includes("failed")) return "error";
  if (/(denied|locked|no access)/.test(n)) return "denied";
  if (/(offline|no connection)/.test(n)) return "offline";
  if (/(confirmed|placed|sent|done|success)/.test(n)) return "success";
  return undefined;
}
