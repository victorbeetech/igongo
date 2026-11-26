// Card colours from the design tokens only (packages/design-tokens): the
// designer offers these names, never a free colour.

import { tokens } from "@igongo/design-tokens/tokens";
import type { CardColour, LogoKind } from "../../domain/cardElement";

export const CARD_HEX: Record<CardColour, string> = {
  red: tokens.color.light.primary,
  "red-dark": tokens.color.light.primaryDark,
  black: tokens.color.light.brandInk,
  night: tokens.color.dark.onSecondary,
  cream: tokens.color.light.brandCream,
  white: tokens.color.light.surface,
};

/** The brand kit logo file for [kind] in [colour] (red, black or white artwork). */
export function logoUrl(kind: LogoKind, colour: CardColour): string {
  const variant = colour === "red" || colour === "red-dark" ? "red" : colour === "black" || colour === "night" ? "black" : "white";
  return `/brand/logo/${kind}/igongo-${kind}-${variant}.svg`;
}

/** The brand fonts, as loaded by the portal. */
export const CARD_FONT = { brand: "var(--font-brand)", body: "var(--font-body)" } as const;
