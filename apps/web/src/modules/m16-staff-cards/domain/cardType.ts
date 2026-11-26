// A card type: print size and chip settings (S16-06, S16-07).

export interface CardType {
  key: string;
  name: string;
  widthMm: number;
  heightMm: number;
  cornerMm: number;
  chip: string;
  write: string;
  passwordLock: boolean;
  originalityCheck: boolean;
  tapCounter: boolean;
  printPreset: string;
  active: boolean;
}
