/** A card design: its two sides, drawn by the super admin (S16-02, S16-03). */

import type { CardColour, CardElement } from "./card-element";

export interface CardSide {
  background: CardColour;
  elements: CardElement[];
}

export interface CardTemplate {
  key: string;
  name: string;
  orientation: "portrait" | "landscape";
  /** The card type it prints on (size and chip). */
  cardType: string;
  front: CardSide;
  back: CardSide;
  active: boolean;
}

/** The drawing area of an orientation, in tenths of a millimetre. */
export const sizeOf = (o: CardTemplate["orientation"]) => (o === "portrait" ? { w: 540, h: 856 } : { w: 856, h: 540 });
