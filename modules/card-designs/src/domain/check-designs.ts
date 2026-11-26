/**
 * The rules a design set must keep before it is saved. Pure function.
 * Returns the first problem in words, or null when all is well.
 */

import type { CardDesigns } from "./card-designs";
import { sizeOf } from "./card-template";

export function checkDesigns(d: CardDesigns): string | null {
  // Step 1: unique keys.
  const keys = d.templates.map((t) => t.key);
  if (new Set(keys).size !== keys.length) return "Two templates have the same key.";
  const types = new Set(d.types.map((t) => t.key));
  if (types.size !== d.types.length) return "Two card types have the same key.";
  // Step 2: the default and every role point to an active template.
  const active = new Set(d.templates.filter((t) => t.active).map((t) => t.key));
  if (!active.has(d.defaultTemplate)) return "The default template must exist and be switched on.";
  const badRole = Object.entries(d.byRole).find(([, k]) => !active.has(k));
  if (badRole) return `The role ${badRole[0]} uses a template that is missing or switched off.`;
  // Step 3: every template prints on a known card type, and every element sits on the card.
  for (const t of d.templates) {
    if (!types.has(t.cardType)) return `${t.name} uses an unknown card type.`;
    const { w, h } = sizeOf(t.orientation);
    for (const e of [...t.front.elements, ...t.back.elements]) {
      if (e.x < 0 || e.y < 0 || e.w <= 0 || e.h <= 0 || e.x + e.w > w || e.y + e.h > h) return `In ${t.name}, "${e.id}" is off the card.`;
      if (e.kind === "field" && !e.field) return `In ${t.name}, "${e.id}" needs a holder field.`;
    }
    // Step 4: a card is only useful with its QR code on one side.
    if (![...t.front.elements, ...t.back.elements].some((e) => e.kind === "qr")) return `${t.name} needs a QR code on one side.`;
  }
  return null;
}
