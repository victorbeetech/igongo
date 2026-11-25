/**
 * Finds whose staff card was tapped or scanned. Given by the Staff Cards
 * module (16) through its contract once it is built; until then the gateway
 * gives one that refuses with `not_configured`.
 */

export interface CardDirectory {
  /** The holder of the card, or null for an unknown, reset or blocked card. */
  holderOf(kind: "nfc" | "qr", value: string): Promise<string | null>;
}
