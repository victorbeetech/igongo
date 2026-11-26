// A card design with its two sides (S16-02, S16-03).

import type { CardColour, CardElement } from "./cardElement";

export interface CardSide {
  background: CardColour;
  elements: CardElement[];
}

export interface CardTemplate {
  key: string;
  name: string;
  orientation: "portrait" | "landscape";
  cardType: string;
  front: CardSide;
  back: CardSide;
  active: boolean;
}

/** The drawing area, in tenths of a millimetre. */
export const sizeOf = (o: CardTemplate["orientation"]) => (o === "portrait" ? { w: 540, h: 856 } : { w: 856, h: 540 });
