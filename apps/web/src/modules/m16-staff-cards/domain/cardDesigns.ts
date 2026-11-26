// Every card design setting: templates, card types, the default template
// and which template each role uses (S16-05).

import type { CardTemplate } from "./cardTemplate";
import type { CardType } from "./cardType";

export interface CardDesigns {
  templates: CardTemplate[];
  types: CardType[];
  defaultTemplate: string;
  byRole: Record<string, string>;
}
