/** Where the card designs are kept. */

import type { CardDesigns } from "../../domain/card-designs";

export interface DesignsStore {
  read(): Promise<CardDesigns>;
  write(value: CardDesigns, by: string | null, now: Date): Promise<void>;
}
