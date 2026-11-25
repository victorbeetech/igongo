// The address kept after `#` in the static preview, such as
// `#/staff/sample?dialog=block-card`. One small store: it reads the hash,
// tells listeners when it changes, and moves to a new address.

import { PREVIEW_START } from "./staticPreview";

/** The current address after `#`, or the start screen when there is none. */
export function readHash(): string {
  const hash = typeof window === "undefined" ? "" : window.location.hash.slice(1);
  return hash.startsWith("/") ? hash : PREVIEW_START;
}

/** Calls [listener] whenever the address changes (links, back and forward). */
export function subscribeHash(listener: () => void): () => void {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

/** Goes to [href], adding a history step so Back works. */
export function pushHash(href: string): void {
  window.location.hash = href;
}

/** Swaps the address for [href] without a history step (closing a dialog). */
export function replaceHash(href: string): void {
  // replaceState does not fire hashchange, so fire it for the listeners.
  window.history.replaceState(null, "", "#" + href);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/** Splits an address such as `/staff?dialog=x` into its path and its query. */
export function splitAddress(address: string): { path: string; query: string } {
  const at = address.indexOf("?");
  return at < 0 ? { path: address, query: "" } : { path: address.slice(0, at), query: address.slice(at + 1) };
}
