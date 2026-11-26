/**
 * Every card design setting in one place: the templates, the card types,
 * the default template, and which template each role uses (S16-05).
 */

import type { CardTemplate } from "./card-template";
import type { CardType } from "./card-type";

export interface CardDesigns {
  templates: CardTemplate[];
  types: CardType[];
  /** Used for every role without its own template. */
  defaultTemplate: string;
  /** Role key to template key. */
  byRole: Record<string, string>;
}

/** The template for a holder of [roleKeys]: the first role with one, else the default. */
export function templateFor(designs: CardDesigns, roleKeys: string[]): CardTemplate | undefined {
  const key = roleKeys.map((r) => designs.byRole[r]).find((k) => !!k) ?? designs.defaultTemplate;
  return designs.templates.find((t) => t.key === key) ?? designs.templates.find((t) => t.key === designs.defaultTemplate);
}
