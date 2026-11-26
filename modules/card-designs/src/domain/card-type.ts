/**
 * A card type (S16-06, S16-07): the blank card's size and corners for
 * printing, and what is written to its NFC chip and how it is protected.
 */

export interface CardType {
  key: string;
  name: string;
  widthMm: number;
  heightMm: number;
  cornerMm: number;
  chip: string;
  /** What the chip holds, such as "NDEF URL with a secure card ID". */
  write: string;
  passwordLock: boolean;
  originalityCheck: boolean;
  tapCounter: boolean;
  /** The printer profile name used for one-click printing. */
  printPreset: string;
  active: boolean;
}
